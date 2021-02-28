const db = require('../../database/db-config');

module.exports = {
	find,
	findBy,
	findByItemId,
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
//findBy(filter)
function findBy(filter) {
	return db('items').where(filter);
}

//findItemById
function findByItemId(id) {
	return db('items').where({ id }).first();
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
