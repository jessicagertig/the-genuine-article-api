const db = require('../../database/db-config');

module.exports = {
	findItems,
	createItem
};

function findItems() {
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

async function createItem(item_info, item_colors, item_materials) {
	return db.transaction((trx) => {
		return db('items')
			.transacting(trx)
			.insert(item_info)
			.returning('id')
			.then((res) => {
				const item_id = res.id[0];
				const colorFieldsToInsert = item_colors.map(
					(item_color) => ({
						item_id: item_id,
						color_id: item_color.id, //how is this data going to come from frontend?
						color: item_color.color
					})
				);

				return db('colors')
					.transacting(trx)
					.insert(colorFieldsToInsert)
					.returning(item_id);
			})
			.then((res) => {
				const item_id = res.item_id[0];
				const materialFieldsToInsert = item_materials.map(
					(item_material) => ({
						item_id: item_id,
						material_id: item_material.id, //how is this data going to come from frontend?
						material: item_material.material
					})
				);

				return db('materials')
					.transacting(trx)
					.insert(materialFieldsToInsert)
					.returning('*');
			})
			.then(trx.commit)
			.catch(trx.rollback);
	});
}
