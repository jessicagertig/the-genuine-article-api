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
    responseType: 'arraybuffer',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      Referer: new URL(url).origin,
      'Sec-Fetch-Dest': 'image',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'same-origin'
    }
  });
  return Buffer.from(response.data);
};

module.exports = {
  downloadImage,
  defineParamsFromFile
};
