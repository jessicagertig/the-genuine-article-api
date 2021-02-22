const db = require('../../database/db-config');

//findItemById
function findMainImageByItemId(id) {
	return db('main_image').where({ id }).first();
}

async function addMainImage(main_image_info) {
	const [id] = await db('main_image').insert(main_image_info, 'id');

	return findMainImageByItemId(id);
}

async function addMainImageSizes(baseUrl, fileName, item_id) {
	const fieldsToInsert = {
		large: `${baseUrl}/large_${fileName}`,
		display: `${baseUrl}/display_${fileName}`,
		admin_upload: `${baseUrl}/admin_upload_${fileName}`,
		small: `${baseUrl}/small_${fileName}`,
		thumb: `${baseUrl}/thumb_${fileName}`,
		item_id: item_id
	};
	//todo check for entry with that item_id and overwrite it if exists instead of creating new row
	return await db('main_image_sizes')
		.insert(fieldsToInsert)
		.returning('*');
}

async function addSecondaryImageSizes(baseUrl, fileName, item_id) {
	const fieldsToInsert = {
		large: `${baseUrl}/large_${fileName}`,
		small: `${baseUrl}/small_${fileName}`,
		thumb: `${baseUrl}/thumb_${fileName}`,
		item_id: item_id
	};
	//todo check for entry with that item_id and overwrite it if exists instead of creating new row
	return await db('secondary_images')
		.insert(fieldsToInsert)
		.returning('*');
}

module.exports = {
	addMainImage,
	addMainImageSizes,
	findMainImageByItemId,
	addSecondaryImageSizes
};
