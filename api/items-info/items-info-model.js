const db = require('../../database/db-config');

module.exports = {
	find,
	findBy,
	findByItemId,
	findAllColors,
	findAllMaterials,
	findAllGarmentTitles,
	findColorsByItemId,
	findMaterialsByItemId,
	findItemsByColorId,
	addItemColors,
	addItemInfo
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
//findBy(filter)
function findBy(filter) {
	return db('items').where(filter);
}

//findItemById
function findByItemId(id) {
	return db('items').where({ id }).first();
}

//findColorsByItemId
function findColorsByItemId(item_id) {
	return db('item_colors as ic')
		.select('ic.item_id', 'ic.color_id', 'colors.color')
		.join('colors', 'ic.color_id', 'colors.id')
		.where('item_id', item_id);
}

//findMaterialsByItemId
function findMaterialsByItemId(item_id) {
	return db('item_materials as im')
		.select('im.item_id', 'im.material_id', 'materials.material')
		.join('materials', 'im.material_id', 'materials.id')
		.where('item_id', item_id);
}

//findItemsByColorId
function findItemsByColorId(color_id) {
	return db('item_colors as ic')
		.join('colors', 'ic.color_id', 'colors.id')
		.join('items', 'ic.item_id', 'items.id')
		.select(
			'ic.item_id',
			'ic.color_id',
			'colors.color',
			'items.garment_title',
			'items.garment_type',
			'items.begin_year',
			'items.end_year',
			'items.decade',
			'items.secondary_decade',
			'items.culture_country',
			'items.collection',
			'items.collection_url',
			'items.creator',
			'items.source',
			'items.item_collection_no',
			'items.description'
		)
		.where('color_id', color_id);
}
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

//POST
//post item-info
async function addItemInfo(item) {
	const [id] = await db('items').insert(item, 'id');

	return findByItemId(id);
}
//post item-colors with item_id //draft
function addItemColors(item_id, color_fields) {
	//color_fields should be an object containing an array of objects named fields (json format)
	//such as { 'fields': [{'id': 2, 'color': 'red'}, {'id': 6, 'color': turquoise}] }
	const fieldsToInsert = color_fields.map((color_field) => ({
		item_id: item_id,
		color_id: color_field.id //how is this data going to come from frontend?
	}));
	//fieldsToInsert needs to be an array of objects
	return db('item_colors').insert(fieldsToInsert).returning('*');
}
//post item-materials with item_id
//post primary-image with item_id
//post additonal-images with item_id

//PUT
//put item-info
//put item-colors with item_id
//put item-materials with item_id
//put primary-image with item_id
//put additonal-images with item_id
