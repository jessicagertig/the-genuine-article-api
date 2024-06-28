const { processDescArray } = require('../helpers/stringHelper');
const { canConvertToInteger } = require('../helpers/dateHelper');

/**
 * Scrapes data from the Philadelphia Museum of Art website
 *
 * @param {object} ch - The Cheerio object loaded with the webpage HTML
 * @param {object} item - The item object to populate with scraped data
 * @returns {object} The populated item object
 */
module.exports = async function PHILAScraper(ch, item) {
  item['collection'] = 'The Philadeliphia Museum of Art';

  let desc_array = [];
  const desc_summary = ch('.object-label').text();
  console.log('desc_summary_____', desc_summary);
  desc_array[0] = desc_summary;
  // get rows of data
  const table_body = ch('.object-description').children('tbody');
  const rows = ch(table_body).children();

  rows.each(function (i, el) {
    const title_str = ch(el)
      .children('.object-description-label')
      .text();
    const title = title_str.trim();
    const value_str = ch(el)
      .children('.object-description-text')
      .text();
    const value = value_str.trim();
    // console.log('TITLE _________:', title);
    // console.log('VALUE _________:', value);

    if (title === 'Title:') {
      item['garment_type'] = value;
    } else if (title === 'Date:') {
      const end_index = value.length;
      const year = value.slice(end_index - 4, end_index);
      const year_valid = canConvertToInteger(year);
      if (year_valid && year.length === 4) {
        item['begin_year'] = year;
      }
    } else if (title === 'Artist:') {
      const str_array = value.split(',');
      item['culture_country'] = str_array[1].trim();
      item['creator'] = str_array[0].trim();
    } else if (title === 'Place:') {
      item['culture_country'] = value;
    } else if (title === 'Accession Number:') {
      item['item_collection_no'] = value;
    } else if (title === 'Credit Line:') {
      item['source'] = value;
    } else if (title === 'Geography:') {
      desc_array[3] = value;
    } else if (title === 'Medium:') {
      const desc_item = `${title} ${value}`;
      desc_array[1] = desc_item;
    } else if (title === 'Dimensions:') {
      desc_array[2] = value;
    }
  });

  processDescArray(desc_array, item);

  console.log('Phila fn', item);
  return item;
};
