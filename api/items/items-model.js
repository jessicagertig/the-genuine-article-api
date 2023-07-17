const db = require('../../database/db-config');
const {
  findColorsByItemId,
  editItemColors,
  deleteItemColors
} = require('../items-colors/items-colors-model');
const {
  findMaterialsByItemId,
  editItemMaterials,
  deleteItemMaterials
} = require('../items-materials/items-materials-model');
const {
  findMainImageByItemId,
  deleteMainImageRecord,
  deleteMainImageFromS3
} = require('../items-images/items-images-model');
const { withTransaction } = require('../utils/withTransaction');
const { calculateDecades } = require('../utils/helpers');

module.exports = {
  findAllGarmentTitles,
  findByCollectionUrl,
  findByCollectionNo,
  getAllItems,
  getPaginatedItems,
  getPageCount,
  findAllItemsInfo,
  findInfoById,
  findItemById,
  createItem,
  updateItem,
  deleteItem
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

function findPaginatedItemsInfo(offset, limit) {
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
    .orderBy('id')
    .limit(limit + 1)
    .offset(offset);
}

async function getItemsCount() {
  const result = await db('items').count('id as count').first();
  return result.count;
}
//findsAllGarmentTitles (for menu/search)
function findAllGarmentTitles() {
  return db('garment_titles').select('*');
}

// find GarmentTitleId by garment_title name
async function findGarmentTitleId(garment_title) {
  const data = await db('garment_titles')
    .select('id')
    .where({ garment_title });
  return data[0]['id'];
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
  try {
    const info = await findInfoById(id);
    const materials = await findMaterialsByItemId(id);
    const materialsList = materials.map(
      (material) => material.material
    );
    const colors = await findColorsByItemId(id);
    const colorsList = colors.map((color) => color.color);
    const image_urls = await findMainImageByItemId(id);
    const garment_name = info['garment_title'];
    const garment_title_id = await findGarmentTitleId(garment_name);
    const returned = {
      ...info,
      garment_title_id,
      colors: colorsList,
      materials: materialsList,
      image_urls
    };
    return returned;
  } catch (error) {
    console.log('Error getting item. MESSAGE:', error);
  }
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
    console.log('Error getting items', error);
  }
}

async function getPaginatedItems(page = 1, limit = 15) {
  try {
    const offset = (page - 1) * limit; // calculate offset
    let info = await findPaginatedItemsInfo(offset, limit);
    let hasMore = false;

    if (info.length > limit) {
      hasMore = true;
      info = info.slice(0, limit); // Remove the extra item
    }

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
    const pages = await getPageCount();
    return { items: info, hasMore: hasMore, pages: pages };
  } catch (error) {
    console.log('Error getting items', error);
  }
}

async function getPageCount(limit = 15) {
  // get num of pages
  const count = await getItemsCount();
  console.log('count', count);
  const pages = Math.ceil(count / limit);
  return pages;
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
    const decadesArray = calculateDecades(
      item_info['begin_year'],
      item_info['end_year']
    );

    item_info['decade'] = decadesArray[0];
    item_info['secondary_decade'] = decadesArray[1];
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

async function deleteItem(item_id) {
  return withTransaction(async (trx) => {
    // Check if a main image exists
    const image_info = await findMainImageByItemId(item_id);
    if (image_info !== null) {
      // Delete the main image from s3 first
      await deleteMainImageFromS3(item_id);

      await deleteMainImageRecord(item_id, { trx });
    }

    // If the main image deletion is successful, proceed with other deletions
    const item_deleted = await db('items')
      .where('id', item_id)
      .first({})
      .del()
      .transacting(trx)
      .returning('id');

    await deleteItemColors(item_id, { trx });

    await deleteItemMaterials(item_id, { trx });

    return item_deleted;
  });
}
