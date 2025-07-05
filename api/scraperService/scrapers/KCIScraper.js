const { processDescArray } = require('../helpers/stringHelper');
const { extractValidYear } = require('../helpers/dateHelper');

/**
 * Scrapes data from the Kyoto Costume Institute website
 *
 * @param {object} ch - The Cheerio object loaded with the webpage HTML
 * @param {object} item - The item object to populate with scraped data
 * @returns {object} The populated item object
 */
module.exports = async function KCIScraper(ch, item) {
  item['collection'] = 'The Kyoto Costume Institute';

  let desc_array = [];

  // Get title
  const title = ch('.articleBlock__title').text().trim();
  item['garment_type'] = title;
  desc_array[0] = title;

  // Get date and location info
  const dateLocationStr = ch('.articleBlock__info').text().trim();
  if (dateLocationStr) {
    // Extract year from strings like "c. 1893 - America"
    const year = extractValidYear(dateLocationStr);
    item['begin_year'] = year;

    // Extract location/country (everything after the last dash)
    const parts = dateLocationStr.split(' - ');
    if (parts.length > 1) {
      item['culture_country'] = parts[parts.length - 1].trim();
    }
  }

  // Get specification details (Material, Inventory Number, etc.)
  const specElements = ch('.articleBlock__spec dt');
  const specExplains = ch('.articleBlock__spec dd');

  specElements.each(function (i, el) {
    const label = ch(el).text().trim();
    const value = ch(specExplains[i]).text().trim();

    if (label === 'Material') {
      const material_desc = `${label}: ${value}`;
      desc_array[1] = material_desc;
    } else if (label === 'Inventory Number(s)') {
      item['item_collection_no'] = value;
    }
  });

  // Get description text
  const description = ch('.articleBlock__text').text().trim();
  if (description) {
    desc_array[2] = description;
  }

  processDescArray(desc_array, item);

  // Extract and store the main image URL
  const imgSrc = ch('.articleBlock__img').attr('src');
  if (imgSrc) {
    item.sourceImageUrl = imgSrc;
    console.log('KCI main image URL:', imgSrc);
  }

  console.log('KCI fn', item);
  return item;
};
