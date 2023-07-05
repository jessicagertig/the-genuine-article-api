const db = require('../../database/db-config');
const {
  ImageUploader,
  DeleteResizedImage
} = require('../utils/imageUploader');

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
  return await db('main_images').where({ item_id }).del();
}

async function deleteMainImage(item_id, context = {}) {
  const { trx } = context;
  let file_name;

  try {
    // get file_name from db
    const image_info = await findMainImageByItemId(item_id);
    console.log('GET FILE', image_info);
    file_name = image_info ? image_info.file_name : null;
    // delete original main image from s3
    if (file_name !== undefined && file_name !== null) {
      const deleteUpload = new ImageUploader('original_main_image');
      await deleteUpload.deleteOriginalImage(item_id, file_name);
      // delete resized main image from s3
      const deleteResizedUpload = new DeleteResizedImage(
        'resized_main_image'
      );
      await deleteResizedUpload.deleteResizedImages(
        item_id,
        file_name
      );
      console.log(
        'The images should have been successfuly deleted from AWS S3'
      );
    } else {
      throw new Error(
        'There was an error retrieving the image information from the DB. The item could not be deleted.'
      );
    }
  } catch (err) {
    console.error(
      'There was an error deleting the image from AWS S3.'
    );
    throw err;
  }

  // delete main image record from db
  try {
    await db('main_images')
      .where({ item_id })
      .del()
      .transacting(trx)
      .then((result) => {
        if (result) {
          console.log(
            `The main image for item with id ${item_id} has been deleted from the DB. Result: ${result}`
          );
        } else {
          throw new Error(
            `No main image existed for item with id ${item_id} in the DB.`
          );
        }
      });
  } catch (error) {
    console.error(`An error occured while deleting the main image from the 
        DB for item with id ${item_id}. Error: ${error}`);
    throw error;
  }
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
  removeMainImage,
  deleteMainImage
};
