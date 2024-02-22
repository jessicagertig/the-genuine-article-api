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
const { sortByYear } = require('../utils/helpers');

module.exports = {
  findGarmentTitle,
  findAllGarmentTitles,
  getAllItems,
  getPaginatedItems,
  getPageCount,
  findItemById,
  createItem,
  updateItem,
  deleteItem,
  searchItems,
  simpleSearch,
  addGarmentTitle,
  deleteGarmentTitle
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

function findGarmentTitle(garment_title) {
  return db('garment_titles').where({ garment_title }).first();
}

//findsAllGarmentTitles (for menu/search)
function findAllGarmentTitles() {
  return db('garment_titles')
    .select('*')
    .orderBy('garment_title', 'asc');
}

async function addGarmentTitle(garment_title) {
  try {
    const added_title = await db('garment_titles')
      .insert({ garment_title: garment_title })
      .returning('*');
    return added_title[0];
  } catch (error) {
    console.error(
      'Could not add the new garment title menu option.'
    );
  }
}

async function deleteGarmentTitle(garment_title_id) {
  const title = await db('garment_titles')
    .where({ id: garment_title_id })
    .returning('*');
  const title_string = title[0]['garment_title'];
  const existing_items_with_title = await db('items').where({
    garment_title: title_string
  });
  console.log(
    'existing_items_with_title',
    existing_items_with_title
  );
  if (
    existing_items_with_title.length === 0 ||
    existing_items_with_title === null
  ) {
    return db('garment_titles')
      .where({ id: garment_title_id })
      .del()
      .returning('*');
  } else {
    console.error(
      'Cannot delete garment title while associated with items: ',
      existing_items_with_title
    );
    throw new Error(
      'Cannot delete garment title while associated with items.'
    );
  }
}
// find GarmentTitleId by garment_title name
async function findGarmentTitleId(garment_title) {
  try {
    const data = await db('garment_titles')
      .select('id')
      .where({ garment_title });
    return data[0]['id'];
  } catch (error) {
    console.error(
      `Problem finding id for garment title: ${garment_title}`
    );
  }
}

//findItemById
/* note: the color and material tables are separate from the items table because each item can have multiple colors and materials, and each color and material can be associated with multiple items. The item_colors and item_materials tables are join tables. Sepration also facilitates searching by color or material. */
async function findItemById(id) {
  try {
    const info = await findInfoById(id);
    console.log(info);
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
    // delete any associated garment of the day record
    await db('garment_of_the_day')
      .where('item_id', item_id)
      .del()
      .transacting(trx);
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

async function simpleSearch(search_term, page = 1, limit = 15) {
  try {
    const results = await db('items')
      .whereRaw(
        "search_vector @@ plainto_tsquery('pg_catalog.english', ?)",
        search_term
      )
      .select(...infoToSelect)
      .orderBy('id', 'desc')
      .paginate({
        perPage: limit,
        currentPage: page,
        isLengthAware: true
      });
    const data = results.data;
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let item_id = item.id;
      console.log('KEYWORD SEARCH RESULT ID', item_id);
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

    results['data'] = data;

    return results;
  } catch (error) {
    console.error('Error with search query:', error);
    throw new Error('Error with search');
  }
}

//paginated, on FE useInfiniteQuery but implement load more instead of pagination
async function searchItems(
  search_term,
  page = 1,
  limit = 30,
  order = 'desc',
  sort = 'id',
  decades = '',
  colors = '',
  materials = ''
) {
  const offset = (page - 1) * limit;

  // Convert the string into an array
  const decadeArray = decades.split(',');
  const colorArray = colors.split(',').map(Number);
  const materialArray = materials.split(',').map(Number);

  console.log('decadeArray', decadeArray);
  try {
    let query = db('items')
      .distinctOn('items.id')
      .leftJoin(
        'item_colors',
        'items.id',
        '=',
        'item_colors.item_id'
      )
      .leftJoin(
        'item_materials',
        'items.id',
        '=',
        'item_materials.item_id'
      )
      .whereRaw(
        "search_vector @@ plainto_tsquery('pg_catalog.english', ?)",
        search_term
      )
      .select(...infoToSelect)
      .orderBy('items.id', 'desc')
      .limit(limit)
      .offset(offset);

    // handle decade, colors, and materials filters
    if (decadeArray.length > 0 && decadeArray[0] !== '') {
      query = query.whereIn('decade', decadeArray);
    }
    const invalidColorArray =
      colorArray[0] === '' ||
      colorArray[0] === 0 ||
      isNaN(colorArray[0]);

    if (colorArray.length > 0 && !invalidColorArray) {
      query = query.whereIn('item_colors.color_id', colorArray);
    }

    const invalidMaterialArray =
      materialArray[0] === '' ||
      materialArray[0] === 0 ||
      isNaN(materialArray[0]);

    if (materialArray.length > 0 && !invalidMaterialArray) {
      query = query.whereIn(
        'item_materials.material_id',
        materialArray
      );
    }

    const preprocessed_results = await query;

    const result_ids = preprocessed_results.map((item) => item.id);

    console.log('preprocessedResults ids', result_ids);

    let results;
    if (sort === 'begin_year') {
      results = sortByYear(order, preprocessed_results);
    } else {
      results = preprocessed_results;
    }

    //add colors, materials, imagesUrls
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
