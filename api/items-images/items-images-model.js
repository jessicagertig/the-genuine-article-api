const db = require('../../database/db-config');

//find
function find() {
	return db('main_image').select('*').orderBy('id');
}

function findImageById(id) {
	return db('main_image').where({ id }).first();
}

function findMainImageByItemId(item_id) {
	return db('main_image').where('item_id', item_id).first();
}

async function addMainImage(main_image_info) {
	const [id] = await db('main_image').insert(main_image_info, 'id');

	return findImageById(id);
}

async function updateMainImage({ main_image_url, item_id }) {
	return db('main_image')
		.where({ item_id })
		.update({ main_image_url });
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

// eslint-disable-next-line prettier/prettier
function removeMainImage(item_id){
	return db('main_image').where({ item_id }).del();
}

module.exports = {
	find,
	addMainImage,
	updateMainImage,
	addMainImageSizes,
	findImageById,
	findMainImageByItemId,
	addSecondaryImageSizes,
	removeMainImage
};
