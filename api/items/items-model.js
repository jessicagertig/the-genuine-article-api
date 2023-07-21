const db = require('../../database/db-config');
const {
  findAllItemsInfo,
  findInfoById,
  findPaginatedItemsInfo,
  getItemsCount,
  addItemInfo,
  editItemInfo,
  deleteItemInfo
} = require('../items-info/items-info-model');
const {
  findColorsByItemId,
  addItemColors,
  editItemColors,
  deleteItemColors
} = require('../items-colors/items-colors-model');
const {
  findMaterialsByItemId,
  addItemMaterials,
  editItemMaterials,
  deleteItemMaterials
} = require('../items-materials/items-materials-model');
const {
  findMainImageByItemId,
  deleteMainImageRecord,
  deleteMainImageFromS3
} = require('../items-images/items-images-model');
const { withTransaction } = require('../utils/withTransaction');

module.exports = {
  findAllGarmentTitles,
  getAllItems,
  getPaginatedItems,
  getPageCount,
  findItemById,
  createItem,
  updateItem,
  deleteItem,
  searchItems
};

const infoToSelect = [
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
];

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
    // insert item info and return the info including the new id
    const new_item_info = await addItemInfo(item_info, { trx });
    // assign the new item id to a variable to use in the colors and materials inserts
    const new_item_id = new_item_info[0].id;

    // Handle the color insert //
    const color_ids = await addItemColors(new_item_id, item_colors, {
      trx
    });
    // handle the material insert //
    const material_ids = await addItemMaterials(
      new_item_id,
      item_materials,
      { trx }
    );

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
    const edited_item_info = await editItemInfo(item_id, item_info, {
      trx
    });

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
    const item_deleted = await deleteItemInfo(item_id, { trx });

    await deleteItemColors(item_id, { trx });

    await deleteItemMaterials(item_id, { trx });

    return item_deleted;
  });
}

//paginated, on FE useInfiniteQuery but implement load more instead of pagination
async function searchItems(search_term, page = 1, limit = 30) {
  const offset = (page - 1) * limit;
  try {
    const results = await db('items')
      .whereRaw(
        "search_vector @@ plainto_tsquery('english', ?)",
        search_term
      )
      .select(...infoToSelect)
      .limit(limit)
      .offset(offset);

    for (let i = 0; i < results.length; i++) {
      let item = results[i];
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

    return results;
  } catch (error) {
    console.error('Error with search query:', error);
    throw new Error('Error with search');
  }
}
