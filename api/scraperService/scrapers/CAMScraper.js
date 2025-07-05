const { processDescArray } = require('../helpers/stringHelper');
const { extractValidYear } = require('../helpers/dateHelper');

/**
 * Scrapes data from the Cincinnati Art Museum website
 *
 * @param {object} ch - The Cheerio object loaded with the webpage HTML
 * @param {object} item - The item object to populate with scraped data
 * @returns {object} The populated item object
 */
module.exports = async function CAMScraper(ch, item) {
  item['collection'] = 'The Cincinnati Art Museum';
  // get rows of data
  const rows = ch('.artDetail.row');
  let desc_array = [];

  rows.each(function (i, el) {
    const title_str = ch(el).children('.label').text();
    const title = title_str.trim();
    const value_str = ch(el).children('.value').text();
    const value = value_str.trim();
    // console.log('TITLE _________:', title);
    // console.log('VALUE _________:', value);

    if (title === 'Artist:') {
      item['creator'] = value;
    } else if (title === 'Date:') {
      const year = extractValidYear(value);
      item['begin_year'] = year;
    } else if (title === 'Place:') {
      item['culture_country'] = value;
    } else if (title === 'Accession No:') {
      item['item_collection_no'] = value;
    } else if (title === 'Credit Line:') {
      item['source'] = value;
    } else if (title === 'Name:') {
      item['garment_type'] = value;
      desc_array[0] = value;
    } else if (title === 'Medium:') {
      const desc_item = `${title} ${value}`;
      desc_array[1] = desc_item;
    }
  });

  processDescArray(desc_array, item);

  // Extract and store the main image URL
  const imgSrc = ch('.artImage img.hidden-lg').attr('src');
  if (imgSrc) {
    item.sourceImageUrl = imgSrc;
    console.log('CAM main image URL:', imgSrc);
  }

  console.log('CAM fn', item);
  return item;
};
