const db = require('../../database/db-config');

//find
function find() {
	return db('main_image').select('*').orderBy('id');
}

function findImageById(id) {
	return db('main_image').where({ id }).first();
}

function findMainImageByItemId(item_id) {
	return db('main_image')
		.select('*')
		.where('item_id', item_id)
		.first();
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

async function addMainImageSizes(baseUrl, file_name, item_id) {
	const fieldsToInsert = {
		large: `${baseUrl}/large_${file_name}`,
		display: `${baseUrl}/display_${file_name}`,
		admin_upload: `${baseUrl}/admin_upload_${file_name}`,
		small: `${baseUrl}/small_${file_name}`,
		thumb: `${baseUrl}/thumb_${file_name}`,
		item_id: item_id
	};
	//todo check for entry with that item_id and overwrite it if exists instead of creating new row
	return await db('main_image_sizes')
		.insert(fieldsToInsert)
		.returning('*');
}

async function addSecondaryImageSizes(baseUrl, file_name, item_id) {
	const fieldsToInsert = {
		large: `${baseUrl}/large_${file_name}`,
		small: `${baseUrl}/small_${file_name}`,
		thumb: `${baseUrl}/thumb_${file_name}`,
		item_id: item_id
	};
	//todo check for entry with that item_id and overwrite it if exists instead of creating new row
	return await db('secondary_images')
		.insert(fieldsToInsert)
		.returning('*');
}

// eslint-disable-next-line prettier/prettier
async function removeMainImage(item_id){
	console.log('item_id', item_id);
	return await db('main_image')
		.where({ item_id })
		.del(['id', 'file_name', 'item_id']);
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
