const db = require('../../database/db-config');

module.exports = {
  findAllItemsInfo,
  findInfoById,
  findPaginatedItemsInfo,
  getItemsCount,
  findByCollectionNo,
  findByCollectionUrl
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
