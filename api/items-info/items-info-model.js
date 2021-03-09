const db = require('../../database/db-config');

module.exports = {
	find,
	findByItemId,
	findByCollectionUrl,
	findByCollectionNo,
	addItemInfo,
	updateItemInfo
};

function find() {
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

//findItemById
function findByItemId(id) {
	return db('items').where({ id }).first();
}

//find by collection  url
function findByCollectionUrl(collection_url) {
	return db('items').where({ collection_url }).first();
}

//function find by item collection no
function findByCollectionNo(item_collection_no) {
	return db('items').where({ item_collection_no }).first();
}

//POST
//post item-info
async function addItemInfo(item) {
	const [id] = await db('items').insert(item, 'id');

	return findByItemId(id);
}

//PUT
//put item-info
async function updateItemInfo(data, item_id) {
	return await db('items')
		.where('id', item_id)
		.first({})
		.update(data)
		.returning('*');
}

//Delete
//Delete item
