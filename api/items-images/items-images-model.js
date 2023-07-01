const db = require('../../database/db-config');

function find() {
  return db('main_images').select('*').orderBy('id');
}

function findImageById(id) {
  return db('main_images').where({ id }).first();
}

async function findMainImageByItemId(item_id) {
  const image_info = await db('main_images')
    .where('item_id', item_id)
    .select(
      'id',
      'item_id',
      'file_name',
      'main_image_url',
      'large_url',
      'display_url',
      'thumb_url'
    )
    .first();

  if (image_info) {
    return image_info;
  } else {
    return null;
  }
}

async function findMainImageUrlsByItemId(item_id) {
  const image_urls = await db('main_images')
    .where('item_id', item_id)
    .select(
      'main_image_url',
      'large_url',
      'display_url',
      'thumb_url'
    )
    .first();

  if (image_urls) {
    return image_urls;
  } else {
    return null;
  }
}

// async function addMainImage(main_image_info) {
//   const [id] = await db('main_images').insert(main_image_info, 'id')

//   return findImageById(id)
// }

async function updateMainImage({ main_image_url, item_id }) {
  return db('main_images')
    .where({ item_id })
    .update({ main_image_url });
}

//allows the original main image and all the resized versions urls to be inserted into DB after uploading to S3
async function addMainImageSizes(
  main_image_url,
  baseUrl,
  file_name,
  item_id
) {
  const fieldsToInsert = {
    file_name: file_name,
    main_image_url: main_image_url,
    large_url: `${baseUrl}/large_${file_name}`,
    display_url: `${baseUrl}/display_${file_name}`,
    admin_upload_url: `${baseUrl}/admin_upload_${file_name}`,
    small_url: `${baseUrl}/small_${file_name}`,
    thumb_url: `${baseUrl}/thumb_${file_name}`,
    item_id: item_id
  };
  //TODO check for entry with that item_id and overwrite it if exists instead of creating new row
  return await db('main_images')
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
  //TODO check for entry with that item_id and overwrite it if exists instead of creating new row
  return await db('secondary_images')
    .insert(fieldsToInsert)
    .returning('*');
}

async function removeMainImage(item_id) {
  console.log('item_id', item_id);
  return await db('main_images')
    .where({ item_id })
    .del(['id', 'file_name', 'item_id']);
}

module.exports = {
  find,
  // addMainImage,
  updateMainImage,
  addMainImageSizes,
  findImageById,
  findMainImageByItemId,
  findMainImageUrlsByItemId,
  addSecondaryImageSizes,
  removeMainImage
};
