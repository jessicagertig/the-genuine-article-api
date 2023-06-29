const db = require('../../database/db-config');
const {
  findColorsByItemId,
  editItemColors
} = require('../items-colors/items-colors-model');
const {
  findMaterialsByItemId,
  editItemMaterials
} = require('../items-materials/items-materials-model');
const {
  findMainImageByItemId
} = require('../items-images/items-images-model');
const { withTransaction } = require('../utils/withTransaction');

module.exports = {
  findAllGarmentTitles,
  findByCollectionUrl,
  findByCollectionNo,
  getAllItems,
  findAllItemsInfo,
  findInfoById,
  findItemById,
  createItem,
  updateItem
};

//finds all items (excluding colors and materials)
function findAllItemsInfo() {
  return db('items')
    .select(
      'id',
      'garment_title',
      'garment_type',
      'begin_year',
      'end_year',
      'decade',
      'secondary_decade',
      'culture_country',
      'collection',
      'collection_url',
      'creator',
      'source',
      'item_collection_no',
      'description'
    )
    .orderBy('id');
}

//findsAllGarmentTitles (for menu/search)
function findAllGarmentTitles() {
  return db('garment_titles').select('*');
}

//find by collection url (for validation middleware)
function findByCollectionUrl(collection_url) {
  return db('items').where({ collection_url }).first();
}

//function find by item collection no (for validation middleware)
function findByCollectionNo(item_collection_no) {
  return db('items').where({ item_collection_no }).first();
}

//findInfoById
function findInfoById(id) {
  return db('items').where({ id }).first();
}

//findItemById
/* note: the color and material tables are separate from the items table because each item can have multiple colors and materials, and each color and material can be associated with multiple items. The item_colors and item_materials tables are join tables. Sepration also facilitates searching by color or material. */
async function findItemById(id) {
  const info = await findInfoById(id);
  const materials = await findMaterialsByItemId(id);
  const materialsList = materials.map(
    (material) => material.material
  );
  const colors = await findColorsByItemId(id);
  const colorsList = colors.map((color) => color.color);
  const image_urls = await findMainImageByItemId(id);
  const returned = {
    ...info,
    colors: colorsList,
    materials: materialsList,
    image_urls
  };
  return returned;
}

async function getAllItems() {
  try {
    const info = await findAllItemsInfo();
    for (let i = 0; i < info.length; i++) {
      let item = info[i];
      let item_id = item.id;
      const materials = await findMaterialsByItemId(item_id);
      const materialsList = materials.map(
        (material) => material.material
      );
      item['materials'] = materialsList;
      const colors = await findColorsByItemId(item_id);
      const colorsList = colors.map((color) => color.color);
      item['colors'] = colorsList;
      const image_urls = await findMainImageByItemId(item_id);
      const item_image_urls = image_urls ? image_urls : null;
      item['image_urls'] = item_image_urls;
    }
    return info;
  } catch (error) {
    console.log(error);
  }
}

/* 
  Refactored createItem function to use transactions.
  Abstracted the transaction logic to a separate file (withTransaction.js).
  Refactored to use async/await and allow for access to returned data.
  Driving the refactor was the prior faulty reliance on the request body to provide the item info.
  Sources for the refactor: https://knexjs.org/guide/transactions.html and
  https://github.com/eventuate-tram-examples/eventuate-tram-examples-nodejs-customers-and-orders/blob/8c19f208439e2dfc9c5a9221efae6cd36a299993/common-module/mysql-lib/utils.js 
*/
async function createItem(item_info, item_colors, item_materials) {
  return withTransaction(async (trx) => {
    // insert item info and return the info including the new id
    const new_item_info = await db('items')
      .insert(item_info)
      .transacting(trx)
      .returning('*');
    // assign the new item id to a variable to use in the colors and materials inserts
    const new_item_id = new_item_info[0].id;

    // Handle the color insert //
    // explicetly handle empty array
    let color_ids = [];
    if (item_colors.length > 0) {
      const colorFieldsToInsert = item_colors.map(
        (item_color_id) => ({
          item_id: new_item_id,
          color_id: item_color_id
        })
      );

      const new_item_colors = await db('item_colors')
        .insert(colorFieldsToInsert)
        .transacting(trx)
        .returning(['item_id', 'color_id']);

      color_ids = new_item_colors.map((color) => color.color_id);
    }
    // handle the material insert //
    // explicetly handle empty array
    let material_ids = [];
    if (item_materials.length > 0) {
      const materialFieldsToInsert = item_materials.map(
        (item_material_id) => ({
          item_id: new_item_id,
          material_id: item_material_id
        })
      );

      const new_item_materials = await db('item_materials')
        .insert(materialFieldsToInsert)
        .transacting(trx)
        .returning(['item_id', 'material_id']);
      // define material_ids for return
      material_ids = new_item_materials.map(
        (material) => material.material_id
      );
    }

    // define the new item object for return
    const new_item = {
      item_id: new_item_id,
      item_info: new_item_info,
      color_ids: color_ids,
      material_ids: material_ids
    };

    return new_item;
  });
}

// put item by item_id
async function updateItem(
  item_id,
  item_info,
  item_colors,
  item_materials
) {
  return withTransaction(async (trx) => {
    const edited_item_info = await db('items')
      .where('id', item_id)
      .first({})
      .update(item_info)
      .transacting(trx)
      .returning('*');

    const edited_item_colors = await editItemColors(
      item_id,
      item_colors,
      { trx }
    );
    const edited_item_materials = await editItemMaterials(
      item_id,
      item_materials,
      { trx }
    );

    const edited_item = {
      item_id: item_id,
      item_info: edited_item_info,
      colors: edited_item_colors,
      materials: edited_item_materials
    };

    return edited_item;
  });
}
