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
	findItemsByMaterialId,
	addItemInfo,
	addItemMaterials,
	addItemColors,
	removeItemMaterial
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

//findItemsByMaterialId
function findItemsByMaterialId(material_id) {
	return db('item_materials as im')
		.join('materials', 'im.material_id', 'materials.id')
		.join('items', 'im.item_id', 'items.id')
		.select(
			'im.item_id',
			'im.material_id',
			'materials.material',
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
		.where('material_id', material_id);
}

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
//post item-colors with item_id
function addItemColors(item_id, color_fields) {
	//color_fields should be an object containing an array of objects named fields (json format)
	//such as { 'fields': [{'id': 2, 'color': 'red'}, {'id': 6, 'color': turquoise}] }
	const fieldsToInsert = color_fields.map((color_field) => ({
		item_id: item_id,
		color_id: color_field.id //how is this data going to come from frontend?
	}));
	//fieldsToInsert needs to be an array of objects, via knex, postgresql will then insert each object as separate row
	return db('item_colors').insert(fieldsToInsert).returning('*');
}

//post item-materials with item_id
function addItemMaterials(item_id, material_fields) {
	//color_fields should be an object containing an array of objects named fields (json format)
	//such as { 'fields': [{'id': 2, 'color': 'red'}, {'id': 6, 'color': turquoise}] }
	const fieldsToInsert = material_fields.map((material_field) => ({
		item_id: item_id,
		material_id: material_field.id //how is this data going to come from frontend?
	}));
	//fieldsToInsert needs to be an array of objects, via knex, postgresql will then insert each object as separate row
	return db('item_materials').insert(fieldsToInsert).returning('*');
}

//Delete Item_Material
function removeItemMaterial(item_id, material_id) {
	return db('item_materials')
		.where({ item_id })
		.andWhere({ material_id })
		.del(['item_id', 'material_id']);
}
//post primary-image with item_id
//post additonal-images with item_id

//PUT
//put item-info
//put primary-image with item_id
//put additonal-images with item_id
