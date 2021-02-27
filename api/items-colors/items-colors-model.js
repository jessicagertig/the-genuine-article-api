const db = require('../../database/db-config');

module.exports = {
	findColorsByItemId,
	findItemsByColorId,
	addItemColors,
	removeItemColor
};

//findColorsByItemId
function findColorsByItemId(item_id) {
	return db('item_colors as ic')
		.select('ic.item_id', 'ic.color_id', 'colors.color')
		.join('colors', 'ic.color_id', 'colors.id')
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

//Delete Item_Color
function removeItemColor(item_id, color_id) {
	return db('item_materials')
		.where({ item_id })
		.andWhere({ color_id })
		.del(['item_id', 'color_id']);
}
