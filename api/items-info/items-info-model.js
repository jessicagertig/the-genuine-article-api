const db = require('../../database/db-config');
const { calculateDecades } = require('../utils/helpers');
const { scrape } = require('../scraperService/scraper');
const {
  processScrapedImage
} = require('../scraperService/helpers/imageHelper');

module.exports = {
  findAllItemsInfo,
  findInfoById,
  findPaginatedItemsInfo,
  getItemsCount,
  findByCollectionNo,
  findByCollectionUrl,
  addItemInfo,
  addScrapedItemInfo,
  editItemInfo,
  deleteItemInfo,
  addScrapedItem
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

//finds all items (excluding colors and materials)
function findAllItemsInfo() {
  return db('items')
    .select(...infoToSelect)
    .orderBy('id', 'desc');
}

// fetch one extra item to calculate has more
function findPaginatedItemsInfo(offset, limit) {
  return db('items')
    .select(...infoToSelect)
    .orderBy('id', 'desc')
    .limit(limit + 1)
    .offset(offset);
}

async function getItemsCount() {
  const result = await db('items').count('id as count').first();
  return result.count;
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

// addItemScrapedInfo
async function addScrapedItemInfo(url) {
  const item_info = await scrape(url);

  // Check if scraping was successful
  if (!item_info) {
    throw new Error('Scraping failed - no item data returned');
  }

  const decadesArray = calculateDecades(
    item_info['begin_year'],
    item_info['end_year']
  );

  item_info['decade'] = decadesArray[0];
  item_info['secondary_decade'] = decadesArray[1];

  const new_item_info = await db('items')
    .insert(item_info)
    .returning('*');

  return new_item_info;
}

// addScrapedItem - creates item info and processes image if available
async function addScrapedItem(url) {
  try {
    console.log('Creating scraped item for URL:', url);

    const new_item = await addScrapedItemInfo(url);
    console.log('Successfully created item:', new_item[0]);

    // Check if we have an image source URL and process it
    if (new_item[0].sourceImageUrl) {
      console.log('Processing image for item:', new_item[0].id);
      try {
        await processScrapedImage(
          new_item[0].sourceImageUrl,
          new_item[0].id
        );
        console.log('Image processing completed');
      } catch (imageError) {
        console.error(
          'Image processing failed, but item was saved:',
          imageError.message
        );
        // Continue - don't fail the whole operation if just image fails
      }
    } else {
      console.log('No image URL found for this item');
    }

    return new_item;
  } catch (error) {
    console.error('Error creating scraped item:', error);
    throw error;
  }
}

// addItemInfo
async function addItemInfo(item_info, context = {}) {
  const { trx } = context;

  const decadesArray = calculateDecades(
    item_info['begin_year'],
    item_info['end_year']
  );

  item_info['decade'] = decadesArray[0];
  item_info['secondary_decade'] = decadesArray[1];

  const new_item_info = await db('items')
    .insert(item_info)
    .transacting(trx)
    .returning('*');

  return new_item_info;
}

// editItemInfo
async function editItemInfo(item_id, item_info, context = {}) {
  const { trx } = context;

  const begin_year =
    item_info['begin_year'] !== undefined
      ? item_info['begin_year']
      : '';
  const end_year =
    item_info['end_year'] !== undefined ? item_info['end_year'] : '';
  const decadesArray = calculateDecades(begin_year, end_year);
  item_info['decade'] = decadesArray[0];
  item_info['secondary_decade'] = decadesArray[1];

  const edited_item_info = await db('items')
    .where('id', item_id)
    .first({})
    .update(item_info)
    .transacting(trx)
    .returning('*');

  return edited_item_info;
}

//delete item info
async function deleteItemInfo(item_id, context = {}) {
  const { trx } = context;

  const item_deleted = await db('items')
    .where('id', item_id)
    .first({})
    .del()
    .transacting(trx)
    .returning('id');

  return item_deleted;
}
