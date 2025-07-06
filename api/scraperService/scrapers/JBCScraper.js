const { processDescArray } = require('../helpers/stringHelper');
const { extractValidYear } = require('../helpers/dateHelper');

/**
 * Scrapes data from The John Bright Collection website
 *
 * @param {object} ch - The Cheerio object loaded with the webpage HTML
 * @param {object} item - The item object to populate with scraped data
 * @returns {object} The populated item object
 */
module.exports = async function JBCScraper(ch, item) {
  item['collection'] = 'The John Bright Collection';

  // Get title from entry-title
  const title = ch('h1.entry-title').text().trim();
  item['garment_type'] = title;

  // Initialize description array with the title
  let desc_array = [title];

  // Get date from the decade field
  const dateText = ch('p.decade').text().trim();
  if (dateText) {
    const year = extractValidYear(dateText);
    item['begin_year'] = year;
    desc_array.push(`Date: ${dateText}`);
  }

  // Get material from additional section
  const material = ch('.additional').text().trim();
  if (material) {
    desc_array.push(`Material: ${material}`);
  }

  // Get the main description
  const description = ch('.entry-content p').text().trim();
  if (description) {
    desc_array.push(description);
  }

  // Set culture_country to UK since this is a British collection
  item['culture_country'] = 'United Kingdom';

  // Set creator as Unknown since not specified in this collection
  item['creator'] = 'Unknown';

  // Set source as the collection name
  item['source'] = 'The John Bright Collection';

  // Process the description array
  processDescArray(desc_array, item);

  // Extract main image URL from the main image link
  const imageElement = ch('.entry-image.left.slide a');
  if (imageElement.length > 0) {
    const imageUrl = imageElement.attr('href');
    if (imageUrl) {
      item.sourceImageUrl = imageUrl;
    }
  }

  console.log('JBC fn', item);
  return item;
};
