const db = require('../../database/db-config');

module.exports = {
	findMaterialsByItemId,
	findItemsByMaterialId,
	addItemMaterials,
	removeItemMaterial
};

//findMaterialsByItemId
function findMaterialsByItemId(item_id) {
	return db('item_materials as im')
		.select('im.item_id', 'im.material_id', 'materials.material')
		.join('materials', 'im.material_id', 'materials.id')
		.where('item_id', item_id);
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

//post item-materials with item_id
function addItemMaterials(item_id, material_fields) {
	//color_fields should be an object containing an array of objects named fields (json format)
	//such as { 'fields': [{'id': 2, 'color': 'red'}, {'id': 6, 'color': turquoise}] }
	const fieldsToInsert = material_fields.map((material_field) => ({
		item_id: item_id,
		material_id: material_field.id, //how is this data going to come from frontend?
		material: material_field.material
	}));
	//fieldsToInsert needs to be an array of objects, via knex, postgresql will then insert each object as separate row
	return db('item_materials').insert(fieldsToInsert).returning('*');
}

//Delete Item_Material
function removeItemMaterial(item_id, material_id) {
	return db('item_materials')
		.where({ item_id })
		.andWhere({ material_id })
		.del(['item_id', 'material_id', 'material']);
}
