const db = require('../../database/db-config');

module.exports = {
	find
};

function find() {
	return db('items')
		.select(
			'id',
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

// function findById(id) {}

// function findItemColorsByColorId(id) {}

// function findItemMaterialsByMaterialId(id) {}

// async function add(item) {
// 	const [id] = await db('items').insert(item, 'id');

// 	return findById(id);
// }
