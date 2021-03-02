const db = require('../../database/db-config');

module.exports = {
	find,
	findByItemId,
	findByCollectionUrl,
	findByCollectionNo,
	findAllColors,
	findAllMaterials,
	findAllGarmentTitles,
	addItemInfo
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
		.orderBy('begin_year');
}

//findItemById
function findByItemId(id) {
	return db('items').where({ id }).first();
}

//findBy(filter)
function findByCollectionUrl(collection_url) {
	return db('items').where({ collection_url }).first();
}

//function find by item collection no
function findByCollectionNo(item_collection_no) {
	return db('items').where({ item_collection_no }).first();
}

//find colors, materials, and garment_titles for dropdown menus (forms and searchs)
function findAllColors() {
	return db('colors').select('*');
}

function findAllMaterials() {
	return db('materials').select('*');
}

function findAllGarmentTitles() {
	return db('garment_titles').select('*');
}

//POST
//post item-info
async function addItemInfo(item) {
	const [id] = await db('items').insert(item, 'id');

	return findByItemId(id);
}

//PUT
//put item-info

//Delete
//Delete item
