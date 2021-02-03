const db = require('../../database/db-config');

//findItemById
function findMainImageById(id) {
	return db('main_image').where({ id }).first();
}

async function addMainImage(main_image_info) {
	const [id] = await db('main_image').insert(main_image_info, 'id');
	return findMainImageById(id);
}

module.exports = {
	addMainImage,
	findMainImageById
};
