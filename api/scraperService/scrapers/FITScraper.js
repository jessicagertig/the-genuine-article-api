const { removeQueryFromUrl } = require('../helpers/urlHelper');
const { processDescArray } = require('../helpers/stringHelper');
const { canConvertToInteger } = require('../helpers/dateHelper');

/**
 * Scrapes data from the Fashion Institute of Technology website
 *
 * @param {object} ch - The Cheerio object loaded with the webpage HTML
 * @param {object} item - The item object to populate with scraped data
 * @returns {object} The populated item object
 */
module.exports = async function FITScraper(ch, item) {
  item['collection'] = 'The Museum at FIT';

  // cleanup url
  const initial_url = item['collection_url'];
  removeQueryFromUrl(initial_url, item);

  // get fields using new structure
  item['garment_type'] = ch(
    '.item-details-inner .dynastyField .detailFieldValue'
  )
    .text()
    .trim();

  // Date extraction: get value, then use original logic
  const date_value = ch(
    '.item-details-inner .displayDateField .detailFieldValue'
  )
    .text()
    .trim();
  if (date_value) {
    const end_index = date_value.length;
    const year = date_value.slice(end_index - 4, end_index);
    const year_valid = canConvertToInteger(year);
    if (year_valid && year.length === 4) {
      item['begin_year'] = year;
    }
  }

  item['culture_country'] = ch(
    '.item-details-inner .cultureField .detailFieldValue'
  )
    .text()
    .trim();
  item['source'] = ch(
    '.item-details-inner .creditlineField .detailFieldValue'
  )
    .text()
    .trim();
  item['item_collection_no'] = ch(
    '.item-details-inner .invnoField .detailFieldValue'
  )
    .text()
    .trim();

  let desc_array = [];
  const labelText = ch(
    '.item-details-inner .labelTextField .detailFieldValue'
  )
    .text()
    .trim();
  const medium = ch(
    '.item-details-inner .mediumField .detailFieldValue'
  )
    .text()
    .trim();
  const description = ch(
    '.item-details-inner .descriptionField .toggleContent'
  )
    .text()
    .trim();

  if (labelText) desc_array[0] = labelText;
  if (description) desc_array[1] = description;
  if (medium) desc_array[2] = `Medium: ${medium}`;

  processDescArray(desc_array, item);

  console.log('FIT fn', item);
  return item;
};
