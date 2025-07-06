const { removeQueryFromUrl } = require('../helpers/urlHelper');
const { processDescArray } = require('../helpers/stringHelper');
const { extractValidYear } = require('../helpers/dateHelper');

/**
 * Scrapes data from the FIDM Museum website
 *
 * @param {object} ch - The Cheerio object loaded with the webpage HTML
 * @param {object} item - The item object to populate with scraped data
 * @returns {object} The populated item object
 */
module.exports = async function FIDMScraper(ch, item) {
  item['collection'] = 'FIDM Museum';

  // cleanup url
  const initial_url = item['collection_url'];
  item['collection_url'] = removeQueryFromUrl(initial_url, item);
  let desc_array = [];

  // Function to get the value for a given category
  const getCategoryValue = (category) => {
    const row = ch('.recordData .interiorResultTable tr').filter(
      (_, el) => ch(el).find('.category').text().trim() === category
    );
    return row.find('.display').text().trim();
  };

  // Object Name (Garment Type)
  const objectName = getCategoryValue('Object Name');
  item['garment_type'] = objectName;
  desc_array.push(objectName);

  // Date
  const date = getCategoryValue('Date');
  const year = extractValidYear(date);
  item['begin_year'] = year;
  desc_array.push(`Date: ${date}`);

  // Year Range
  const yearRangeFrom = getCategoryValue('Year Range from');
  const yearRangeTo = getCategoryValue('Year Range to');
  item['begin_year'] = yearRangeFrom || item['begin_year'];
  item['end_year'] = yearRangeTo;
  desc_array.push(`Year Range: ${yearRangeFrom} - ${yearRangeTo}`);

  // Material
  const material = getCategoryValue('Material');
  desc_array.push(`Material: ${material}`);

  // Credit Line (Source)
  const creditLine = getCategoryValue('Credit Line');
  item['source'] = creditLine;

  // Object ID (Item Collection Number)
  const objectId = getCategoryValue('Object ID');
  item['item_collection_no'] = objectId;

  // Brand (Creator) - if it exists
  const brand = getCategoryValue('Brand');
  if (brand) {
    item['creator'] = brand;
    desc_array.push(`Brand: ${brand}`);
  }

  processDescArray(desc_array, item);

  // Extract image URL - get full-size image (href) not thumbnail (img src)
  const imageLink = ch('.largeImage a.fancybox_record_images');
  if (imageLink.length > 0) {
    const imageUrl = imageLink.attr('href');
    if (imageUrl) {
      item.sourceImageUrl = imageUrl; // Already absolute URL
    }
  }

  console.log('FIDM fn', item);
  return item;
};
