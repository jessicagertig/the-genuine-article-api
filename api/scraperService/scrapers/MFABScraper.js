const { removeQueryFromUrl } = require('../helpers/urlHelper');
const { processDescArray } = require('../helpers/stringHelper');
const { extractValidYear } = require('../helpers/dateHelper');

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

  const title = ch('.titleField h2').text().trim();
  console.log('TITLE', title);
  item['garment_type'] = title;
  desc_array[0] = title;

  // get rows of data
  const culture = ch('.cultureField').text().trim();
  item['culture_country'] = culture;

  const date = ch('.displayDateField').text().trim();
  const year = extractValidYear(date);
  item['begin_year'] = year;

  const medium = ch('.mediumField .detailFieldValue').text().trim();
  const medium_item = `Medium/Technique: ${medium}`;
  desc_array[2] = medium_item;

  const dimensions = ch('.dimensionsField .detailFieldValue')
    .text()
    .trim();
  const dimensions_item = `Dimensions: ${dimensions}`;
  desc_array[3] = dimensions_item;

  const credit_line = ch('.creditlineField .detailFieldValue')
    .text()
    .trim();
  item['source'] = credit_line;

  const accession_number = ch('.invnolineField .detailFieldValue')
    .text()
    .trim();
  item['item_collection_no'] = accession_number;

  const description = ch('.descriptionField .detailFieldValue')
    .text()
    .trim();
  desc_array[1] = description;

  processDescArray(desc_array, item);

  console.log('MFAB fn', item);
  return item;
};
