const { processDescArray } = require('../helpers/stringHelper');
const { extractValidYear } = require('../helpers/dateHelper');
/** has a free use policy: https://www.musee-mccord-stewart.ca/en/collections/photographic-services-and-copyright/ */
/**
 * Scrapes data from the McCord Stewart Museum Montreal website
 *
 * @param {object} ch - The Cheerio object loaded with the webpage HTML
 * @param {object} item - The item object to populate with scraped data
 * @returns {object} The populated item object
 */
module.exports = async function scrapeMcCordStewart(ch, item) {
  item['collection'] = 'McCord Stewart Museum Montreal';

  // Get title from nameField
  const title = ch('.detailField.nameField h1').text().trim();
  item['garment_type'] = title;

  // Initialize description array with the title
  let desc_array = [title];

  // Get year from the description
  const description = ch('.emuseum-detail-item .detailField').text();
  const year = extractValidYear(description);
  item['begin_year'] = year;

  const source = ch(
    '.detailField.creditlineField .detailFieldValue'
  ).text();
  item['source'] = source;

  // Get source and collection number
  const objectNumber = ch(
    '.detailField.invnoField .detailFieldValue'
  ).text();
  item['item_collection_no'] = objectNumber;

  // Assign default value to culture_country
  item['culture_country'] = 'Canada';
  // Get country from the 'Origin' field
  const country = ch(
    '.detailField.geographyField .detailFieldValue'
  ).text();
  if (country) {
    item['culture_country'] = country;
  }

  // Extract fields and add to desc_array if present
  const manufacturer = ch(
    '.detailField.peopleField:contains("Manufacturer") .detailFieldValue'
  )
    .text()
    .trim();
  const merchant = ch(
    '.detailField.peopleField:contains("Merchant") .detailFieldValue'
  )
    .text()
    .trim();
  const markings = ch('.detailField.markingsField .detailFieldValue')
    .text()
    .trim();
  const artist = ch(
    '.detailField.peopleField:contains("Artist") .detailFieldValue'
  )
    .text()
    .trim();

  if (markings) {
    desc_array.push(`Markings: ${markings}`);
  }
  if (manufacturer) {
    desc_array.push(`Manufacturer: ${manufacturer}`);
  }
  if (merchant) {
    desc_array.push(`Merchant: ${merchant}`);
  }
  if (artist) {
    desc_array.push(`Artist: ${artist}`);
  }

  const dimensions = ch(
    '.detailField.dimensionsField .detailFieldValue'
  )
    .text()
    .trim();
  if (dimensions && !dimensions.includes('Dimensions to come')) {
    desc_array.push(`Dimensions: ${dimensions}`);
  }

  // Determine the creator based on the presence of fields
  item['creator'] = artist || manufacturer || merchant || 'Unknown';

  processDescArray(desc_array, item);

  console.log('McCord Stewart fn', item);
  return item;
};
