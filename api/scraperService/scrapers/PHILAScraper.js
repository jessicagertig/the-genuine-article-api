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

    if (title === 'Title:' || title === 'Title') {
      item['garment_type'] = value;
      // Add title to description array as first element
      const title_desc = `${title} ${value}`;
      desc_array[0] = title_desc;
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
      desc_array[4] = value;
    } else if (title === 'Medium:') {
      const desc_item = `${title} ${value}`;
      desc_array[2] = desc_item;
    } else if (title === 'Dimensions:') {
      desc_array[3] = value;
    }
  });

  processDescArray(desc_array, item);

  // Since imageviewer is dynamically loaded, look for the ID in script tags
  const micrId = extractMicrId(ch);

  // If we found an ID, construct the IIIF URL
  if (micrId) {
    item.sourceImageUrl = `https://iiif.micr.io/${micrId}/full/^4096,/0/default.jpg`;
    console.log(`PHILA: Image URL: ${item.sourceImageUrl}`);
  } else {
    console.log('PHILA: Could not find micr ID');
  }

  console.log('Phila fn', item);
  return item;
};

/**
 * Extracts the micr ID from script tags in the page
 * @param {object} ch - The Cheerio object loaded with the webpage HTML
 * @returns {string|null} The micr ID if found, null otherwise
 */
function extractMicrId(ch) {
  const scriptTags = ch('script');
  let micrId = null;

  scriptTags.each((i, el) => {
    const scriptContent = ch(el).html();
    if (scriptContent) {
      // Look for the micrio configuration with shortId
      if (
        scriptContent.includes('"micrio"') &&
        scriptContent.includes('"shortId"')
      ) {
        // Based on debug output, the structure is: "shortId":"dRcXz"
        const shortIdMatch =
          scriptContent.match(/"shortId":"(\w+)"/);
        if (shortIdMatch) {
          micrId = shortIdMatch[1];
          console.log(`PHILA: Found micr ID:`, micrId);
        }
      }
    }
  });

  return micrId;
}
