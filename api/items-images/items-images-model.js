const db = require('../../database/db-config');

//findItemById
function findMainImagesByItemId(id) {
	return db('main_image').where({ id }).first();
}

// function addMainImage(main_image, item_id) {
// 	const fieldsToInsert = {
// 		main_image_url: main_image[0],
// 		main_large_url: main_image[1],
// 		main_display_url: main_image[2],
// 		main_admin_upload_url: main_image[3],
// 		main_small_url: main_image[4],
// 		main_thumb_url: main_image[5],
// 		item_id: item_id
// 	};

async function addMainImage(main_image_info) {
	const [id] = await db('main_image').insert(main_image_info, 'id');

	return findMainImagesByItemId(id);
}

//todo check for entry with that item_id and overwrite it if exists instead of creating new row

module.exports = {
	addMainImage,
	findMainImagesByItemId
};
