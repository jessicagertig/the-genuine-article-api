const axios = require('axios');
const crypto = require('crypto');
const fileType = require('file-type');

/**
 * Define parameters from file buffer (content type and MD5)
 * @param {Buffer} body - The image buffer
 * @returns {Promise<Array>} - [content_type, md5]
 */
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

/**
 * Download image from URL
 * @param {string} url - The URL to download from
 * @returns {Promise<Buffer>} - The image buffer
 */
const downloadImage = async (url) => {
  console.log(`Downloading image from ${url}`);
  const response = await axios.get(url, {
    responseType: 'arraybuffer'
  });
  return Buffer.from(response.data);
};

module.exports = {
  downloadImage,
  defineParamsFromFile
};
