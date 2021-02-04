const db = require('../../database/db-config');

//findItemById
function findMainImagesByItemId(item_id) {
	return db('main_image')
		.select(
			'item_id',
			'main_image_url',
			'main_large_url',
			'main_display_url',
			'main_admin_upload_url',
			'main_small_url',
			'main_thumb_url'
		)
		.where('item_id', item_id);
}

function addMainImage(main_image, item_id) {
	const fieldsToInsert = {
		main_image_url: main_image[0],
		main_large_url: main_image[1],
		main_display_url: main_image[2],
		main_admin_upload_url: main_image[3],
		main_small_url: main_image[4],
		main_thumb_url: main_image[5],
		item_id: item_id
	};

	db('main_image').insert(fieldsToInsert);
	return findMainImagesByItemId(item_id);
}

//todo check for entry with that item_id and overwrite it if exists instead of creating new row

module.exports = {
	addMainImage,
	findMainImagesByItemId
};
