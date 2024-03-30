const db = require('../../database/db-config');
const { calculateDecades } = require('../utils/helpers');
const { scrape } = require('../scraper');

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
  deleteItemInfo
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
  const new_item_info = await addItemInfo(item_info);
  return new_item_info;
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

  const insertQuery = db('items').insert(item_info).returning('*');

  if (trx) {
    insertQuery.transacting(trx);
  }

  const new_item_info = await insertQuery;

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
  try {
    const item_deleted = await db('items')
      .where('id', item_id)
      .first({})
      .del()
      .transacting(trx)
      .returning('id');

    return item_deleted;
  } catch (error) {
    console.error(
      `Error attempting to delete item info for item_id: ${item_id}`,
      {
        error: error.message,
        itemId: item_id
      }
    );
  }
}
