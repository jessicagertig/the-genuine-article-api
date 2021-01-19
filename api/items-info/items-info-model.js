const db = require('../../database/db-config');

module.exports = {
	find,
	findAllColors,
	findAllMaterials,
	findAllGarmentTitles
};

//i for items_info
//c or item_colors
//m for item_materials
//p for primary_item_image
//a for additional_item_images

// const returning_item = [
// 	'i.id as item_id',
// 	'i.garment_title',
// 	'garment_type',
// 	'i.begin_year',
// 	'i.end_year',
// 	'i.decade',
// 	'i.secondary_decade',
// 	'i.culture_country',
// 	'i.collection',
// 	'i.collection_url',
// 	'i.creator',
// 	'i.source',
// 	'i.item_collection_no',
// 	'i.description'
// ];

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

// function findBy(filter) {}

// function findItemById(id) {}

// function findItemsByColorId(id) {}

// function findItemsByMaterialId(id) {}

//find colors, materials, and garment_titles for dropdown menus (forms and searchs)
function findAllColors() {
	return db('colors').select('id', 'color');
}

function findAllMaterials() {
	return db('materials').select('id', 'material');
}

function findAllGarmentTitles() {
	return db('garment_titles').select('garment_title');
}
