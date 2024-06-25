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
  let desc_array = [];

  // get rows of data
  const rows = ch('.item-details-inner').children();

  rows.each(function (i, el) {
    const title_str = ch(el).children('.detailFieldLabel').text();
    const title = title_str.trim();
    const value_str = ch(el).children('.detailFieldValue').text();
    const value = value_str.trim();
    // console.log('TITLE _________:', title);
    // console.log('VALUE _________:', value);

    if (title === 'Object:') {
      item['garment_type'] = value;
    } else if (title === 'Brand:') {
      item['creator'] = value;
    } else if (title === 'Date:') {
      const end_index = value.length;
      const year = value.slice(end_index - 4, end_index);
      const year_valid = canConvertToInteger(year);
      if (year_valid && year.length === 4) {
        item['begin_year'] = year;
      }
    } else if (title === 'Country:') {
      item['culture_country'] = value;
    } else if (title === 'Credit Line:') {
      item['source'] = value;
    } else if (title === 'Object number:') {
      item['item_collection_no'] = value;
    } else if (title === 'Label Text:' && value.length > 0) {
      desc_array[0] = value;
    } else if (title === 'Medium:' && value.length > 0) {
      const desc_item = `${title} ${value}`;
      desc_array[2] = desc_item;
    } else if (title === 'Description') {
      const span = ch(el).children('.detailFieldLabel').next();
      const desc = span.text();
      desc_array[1] = desc;
    }
  });

  processDescArray(desc_array, item);

  console.log('FIT fn', item);
  return item;
};
