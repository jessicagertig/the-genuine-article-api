const { removeQueryFromUrl } = require('../helpers/urlHelper');
const { processDescArray } = require('../helpers/stringHelper');
const { extractValidYear } = require('../helpers/dateHelper');
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes data from the Museum of Fine Arts Boston website
 *
 * @param {object} ch - The Cheerio object loaded with the webpage HTML
 * @param {object} item - The item object to populate with scraped data
 * @returns {object} The populated item object
 */
module.exports = async function MFABScraper(ch, item) {
  item['collection'] = 'Museum of Fine Arts Boston';

  // cleanup url
  const initial_url = item['collection_url'];
  item['collection_url'] = removeQueryFromUrl(initial_url, item);
  let desc_array = [];

  const title = ch('.detailField.titleField h2').text().trim();
  console.log('TITLE', title);
  item['garment_type'] = title;
  desc_array[0] = title;

  // get rows of data
  const culture = ch('.detailField.cultureField').text().trim();
  item['culture_country'] = culture;

  const date = ch('.detailField.displayDateField').text().trim();
  const year = extractValidYear(date);
  item['begin_year'] = year;

  const medium = ch('.detailField.mediumField .detailFieldValue')
    .text()
    .trim();
  const medium_item = `Medium/Technique: ${medium}`;
  desc_array[2] = medium_item;

  const dimensions = ch(
    '.detailField.dimensionsField .detailFieldValue'
  )
    .text()
    .trim();
  const dimensions_item = `Dimensions: ${dimensions}`;
  desc_array[3] = dimensions_item;

  const credit_line = ch(
    '.detailField.creditlineField .detailFieldValue'
  )
    .text()
    .trim();
  item['source'] = credit_line;

  const accession_number = ch(
    '.detailField.invnolineField .detailFieldValue'
  )
    .text()
    .trim();
  item['item_collection_no'] = accession_number;

  const description = ch(
    '.detailField.descriptionField .detailFieldValue'
  )
    .text()
    .trim();
  desc_array[1] = description;

  processDescArray(desc_array, item);

  // Extract image URL using two-step process
  try {
    const downloadPageUrl = extractDownloadPageUrl(ch);
    if (downloadPageUrl) {
      const imageUrl = await extractImageUrlFromDownloadPage(
        downloadPageUrl
      );
      if (imageUrl) {
        item.sourceImageUrl = imageUrl;
      }
    }
  } catch (error) {
    console.error('Error extracting MFAB image URL:', error);
  }

  console.log('MFAB fn', item);
  return item;
};

/**
 * Extracts the download page URL from the main page
 * @param {object} ch - The Cheerio object loaded with the webpage HTML
 * @returns {string|null} The download page URL if found, null otherwise
 */
function extractDownloadPageUrl(ch) {
  const downloadLink = ch('a[href*="/download/"]');
  if (downloadLink.length > 0) {
    const downloadPath = downloadLink.attr('href'); // "/download/120381"
    return `https://collections.mfa.org${downloadPath}`;
  }
  return null;
}

/**
 * Extracts the actual image URL from the download page
 * @param {string} downloadUrl - The URL of the download page
 * @returns {string|null} The image URL if found, null otherwise
 */
async function extractImageUrlFromDownloadPage(downloadUrl) {
  try {
    const { data } = await axios.get(downloadUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const downloadPageCh = cheerio.load(data);
    // Look for the download button link with the dispatcher URL
    const imageLink = downloadPageCh(
      'a[href*="dispatcher"][href*="resize%3Aformat%3Dfull"]'
    );

    if (imageLink.length > 0) {
      let imageUrl = imageLink.attr('href');
      // Remove "?download" and jsessionid from the URL
      imageUrl = imageUrl.replace(/\?download$/, '');
      imageUrl = imageUrl.replace(/;jsessionid=[A-F0-9]+/, '');
      return imageUrl;
    }

    return null;
  } catch (error) {
    console.error('Error fetching download page:', error);
    return null;
  }
}
