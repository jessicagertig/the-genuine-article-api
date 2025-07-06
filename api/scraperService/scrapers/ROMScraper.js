const { removeQueryFromUrl } = require('../helpers/urlHelper');
const { processDescArray } = require('../helpers/stringHelper');
const { extractValidYear } = require('../helpers/dateHelper');

/**
 * Scrapes data from the Royal Ontario Museum website
 *
 * @param {object} ch - The Cheerio object loaded with the webpage HTML
 * @param {object} item - The item object to populate with scraped data
 * @returns {object} The populated item object
 */
module.exports = async function ROMScraper(ch, item) {
  item['collection'] = 'Royal Ontario Museum';

  // cleanup url
  const initial_url = item['collection_url'];
  removeQueryFromUrl(initial_url, item);
  let desc_array = [];

  const title = ch('.titleField').text().trim();
  console.log('TITLE', title);
  item['garment_type'] = title;
  desc_array[0] = title;

  // get rows of data
  const rows = ch('.item-details-inner').children();

  rows.each(function (i, el) {
    const title_str = ch(el).children('.detailFieldLabel').text();
    const title = title_str.trim();
    const value_str = ch(el).children('.detailFieldValue').text();
    const value = value_str.trim();
    // console.log('TITLE _________:', title);
    // console.log('VALUE _________:', value);

    if (title === 'Maker:') {
      item['creator'] = value;
    } else if (title === 'Date:') {
      console.log('DATE:', value);
      const year = extractValidYear(value);
      item['begin_year'] = year;
    } else if (title === 'Credit Line:') {
      item['source'] = value;
    } else if (title === 'Object number:') {
      item['item_collection_no'] = value;
    } else if (title === 'Description') {
      const span = ch(el).children('.detailFieldLabel').next();
      const desc = span.text();
      desc_array[1] = desc;
    } else if (title === 'Medium:' && value.length > 0) {
      const desc_item = `${title} ${value}`;
      desc_array[2] = desc_item;
    } else if (title === 'Dimensions:' && value.length > 0) {
      const desc_item = `${title} ${value}`;
      desc_array[3] = desc_item;
    } else if (title === 'Period:' && value.length > 0) {
      const desc_item = `${title} ${value}`;
      desc_array[4] = desc_item;
    } else if (title === 'Geography:' && value.length > 0) {
      desc_array[5] = value;
    }
  });

  processDescArray(desc_array, item);

  // Extract image URL
  const imageElement = ch('#mediaZone img');
  if (imageElement.length > 0) {
    const imageSrc = imageElement.attr('src');
    if (imageSrc) {
      // Convert relative URL to absolute
      item.sourceImageUrl = `https://collections.rom.on.ca${imageSrc}`;
    }
  }

  console.log('ROM fn', item);
  return item;
};
