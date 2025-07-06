const {
  downloadImage,
  defineParamsFromFile
} = require('../../utils/imageDownloader');
const {
  addMainImageSizes
} = require('../../items-images/items-images-model');
const {
  ImageUploader,
  ResizedMainImageUploader
} = require('../../utils/imageUploader');

/**
 * Downloads and processes an image from a URL for a scraped item
 * @param {string} imageUrl - The URL of the image to download
 * @param {number} item_id - The ID of the item to associate the image with
 */
async function processScrapedImage(imageUrl, item_id) {
  if (!imageUrl) return;

  try {
    // Download image
    const imageBuffer = await downloadImage(imageUrl);

    // Get file type and md5
    const [content_type, md5] = await defineParamsFromFile(
      imageBuffer
    );

    // Generate filename
    const file_name = `${item_id}_${Date.now()}.jpg`; // or determine extension

    // Upload the original image to s3 (same pattern as router)
    const upload = new ImageUploader('original_main_image');
    const main_image_url = await upload.uploadOriginalImage(
      item_id,
      file_name,
      imageBuffer,
      content_type,
      md5
    );

    // Upload resized versions
    const resizedUpload = new ResizedMainImageUploader(
      'resized_main_image'
    );
    const { baseUrl, aspectRatio } =
      await resizedUpload.uploadResizedImages(
        item_id,
        file_name,
        imageBuffer
      );

    // Save the urls to the db
    await addMainImageSizes(
      main_image_url,
      baseUrl,
      file_name,
      item_id,
      aspectRatio
    );

    console.log(`Successfully processed image for item ${item_id}`);
  } catch (error) {
    console.error(
      `Error processing image for item ${item_id}:`,
      error.message
    );
    console.log(`Image URL that failed: ${imageUrl}`);
    if (error.response?.status === 403) {
      console.log(
        `Museum is blocking image downloads (403 Forbidden)`
      );
    }
  }
}

module.exports = {
  processScrapedImage
};
