const axios = require('axios');
// const fs = require('fs').promises;
const crypto = require('crypto');
const fileType = require('file-type');
// const path = require('path');
const {
  replaceMainImage,
  find
} = require('../items-images/items-images-model');
console.log(
  'axios, fs, crypto, and fileType modules have been imported'
);

console.log(
  'replaceMainImage and find functions have been imported from items-images-model'
);

// Below file writing is for running the job locally
// const imagesDir = path.join(__dirname, 'images'); // 'images' directory in the same directory as your script

// console.log('downloadImage function is being defined');
// const downloadImage = async (url, itemId) => {
//   const itemDir = path.join(imagesDir, String(itemId)); // create a subdirectory for each item
//   await fs.mkdir(itemDir, { recursive: true }); // create the subdirectory if it doesn't exist

//   const imagePath = path.join(itemDir, 'image.jpg'); // save the image as 'image.jpg' in the item's directory
//   console.log(
//     `Downloading image from ${url} and saving to ${imagePath}`
//   );
//   const response = await axios.get(url, {
//     responseType: 'arraybuffer'
//   });
//   await fs.writeFile(imagePath, response.data);
//   console.log(`Image has been saved to ${imagePath}`);
//   return imagePath;
// };

const downloadImage = async (url) => {
  console.log(`Downloading image from ${url}`);
  const response = await axios.get(url, {
    responseType: 'arraybuffer'
  });
  return Buffer.from(response.data);
};

console.log('defineParamsFromFile function is being defined');
// const defineParamsFromFile = async (filePath) => {
//   console.log(`Defining parameters from file at ${filePath}`);
//   const body = await fs.readFile(filePath);
//   const type = await fileType.fromFile(filePath);
//   if (!type || !type.mime.startsWith('image/')) {
//     throw new Error('File is not an image');
//   }

//   const content_type = type.mime;
//   const md5 = crypto.createHash('md5').update(body).digest('base64');
//   const params = [body, content_type, md5];
//   console.log(
//     `Parameters have been defined for file at ${filePath}`
//   );
//   return params;
// };

const defineParamsFromFile = async (body) => {
  console.log(`Defining parameters from body`);
  const type = await fileType.fromBuffer(body);
  if (!type || !type.mime.startsWith('image/')) {
    throw new Error('File is not an image');
  }

  const content_type = type.mime;
  const md5 = crypto.createHash('md5').update(body).digest('base64');
  const params = [content_type, md5];
  return params;
};

console.log('runJob function is being defined');
// const runJob = async () => {
//   console.log('Fetching all items');
//   const main_images = await find(); // Fetch all items

//   for (const item of main_images) {
//     const imageUrl = item.main_image_url; // Get the image URL
//     const itemId = item.item_id; // Get the item ID
//     const file_name = item.file_name;

//     console.log(`Processing item with ID ${itemId}`);

//     // Download the image and get the path
//     const imagePath = await downloadImage(imageUrl, itemId);

//     // Define the image info
//     const [body, content_type, md5] = await defineParamsFromFile(
//       imagePath
//     );
//     const imageInfo = { body, content_type, file_name, md5 };

//     // Replace the main image
//     console.log(`Replacing main image for item with ID ${itemId}`);
//     await replaceMainImage(itemId, imageInfo);
//     console.log(
//       `Main image for item with ID ${itemId} has been replaced`
//     );
//   }
//   console.log('All items have been processed');
// };
const runJob = async () => {
  console.log('Fetching all items');
  const main_images = await find(); // Fetch all items

  for (const item of main_images) {
    const imageUrl = item.main_image_url; // Get the image URL
    const itemId = item.item_id; // Get the item ID
    const file_name = item.file_name;

    console.log(`Processing item with ID ${itemId}`);

    // Download the image and get the image data as a Buffer
    const body = await downloadImage(imageUrl);

    // Define the image info
    const [content_type, md5] = await defineParamsFromFile(body);
    const imageInfo = { body, content_type, file_name, md5 };

    // Replace the main image
    console.log(`Replacing main image for item with ID ${itemId}`);
    await replaceMainImage(itemId, imageInfo);
    console.log(
      `Main image for item with ID ${itemId} has been replaced`
    );
  }
  console.log('All items have been processed');
};

runJob().catch(console.error);
