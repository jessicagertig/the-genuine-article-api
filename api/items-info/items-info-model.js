const db = require('../../database/db-config');
const { calculateDecades } = require('../utils/helpers');
const { scrapeMET, scrapeVA, scrapeCAM } = require('../scraper');

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
    .orderBy('id');
}

// fetch one extra item to calculate has more
function findPaginatedItemsInfo(offset, limit) {
  return db('items')
    .select(...infoToSelect)
    .orderBy('id')
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
async function addScrapedItemInfo(src, url) {
  let item_info;
  if (src === 'MET') {
    item_info = await scrapeMET(url);
  } else if (src === 'VA') {
    item_info = await scrapeVA(url);
  } else if (src === 'CAM') {
    item_info = await scrapeCAM(url);
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
