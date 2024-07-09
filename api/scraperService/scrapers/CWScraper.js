const { removeQueryFromUrl } = require('../helpers/urlHelper');
const { extractValidYear } = require('../helpers/dateHelper');
const { processDescArray } = require('../helpers/stringHelper');

/**
 * Scrapes data from the Colonial Williamsburg website
 *
 * @param {object} ch - The Cheerio object loaded with the webpage HTML
 * @param {object} item - The item object to populate with scraped data
 * @returns {object} The populated item object
 */
module.exports = async function CWScraper(ch, item) {
  item['collection'] = 'Colonial Williamsburg';

  // cleanup url
  const initial_url = item['collection_url'];
  item['collection_url'] = removeQueryFromUrl(initial_url, item);
  let desc_array = [];

  const garmentTitle = ch('.titleField').text();
  item['garment_type'] = garmentTitle.trim();
  // get rows of data
  const rows = ch('.item-details-inner').children();

  rows.each(function (i, el) {
    const title_str = ch(el).children('.detailFieldLabel').text();
    const title = title_str.trim();
    const value_str = ch(el).children('.detailFieldValue').text();
    const value = value_str.trim();
    // console.log('TITLE _________:', title);
    // console.log('VALUE _________:', value);

    if (title === 'Date') {
      const year = extractValidYear(value);
      item['begin_year'] = year;
    } else if (title === 'Origin') {
      item['culture_country'] = value;
    } else if (title === 'Credit Line') {
      item['source'] = value;
    } else if (title === 'Object number') {
      item['item_collection_no'] = value;
    } else if (title === 'Label Text') {
      const span = ch(el).children('.detailFieldLabel').next();
      const desc = span.text();
      desc_array[0] = desc;
    } else if (title === 'Description') {
      const span = ch(el).children('.detailFieldLabel').next();
      const desc = span.text();
      desc_array[1] = desc;
    } else if (title === 'Medium' && value.length > 0) {
      const desc_item = `${title}: ${value}`;
      desc_array[2] = desc_item;
    } else if (title === 'Dimensions' && value.length > 0) {
      const desc_item = `${title}: ${value}`;
      desc_array[3] = desc_item;
    }
  });

  processDescArray(desc_array, item);

  console.log('CW fn', item);
  return item;
};
