const {
  processDescArray,
  convertHtmlTagsToNewlines
} = require('../helpers/stringHelper');
const { extractValidYear } = require('../helpers/dateHelper');

/**
 * Scrapes data from the Victoria and Albert Museum website
 *
 * @param {object} ch - The Cheerio object loaded with the webpage HTML
 * @param {object} item - The item object to populate with scraped data
 * @returns {object} The populated item object
 */
module.exports = async function VAScraper(ch, item) {
  item['collection'] = 'The Victoria and Albert Museum';
  // get title
  const title = ch('.object-page__title').text();
  item['garment_type'] = title;
  // get begin_year
  const dateStr = ch('.object-page__credit').text();
  const trimmedStr = dateStr.trim();
  const year = extractValidYear(trimmedStr);
  item['begin_year'] = year;
  // Define titles that need special handling for HTML tags
  const descTagTitles = [
    'Summary',
    'Physical description',
    'Object history',
    'Dimensions'
  ];
  // get rows of table data
  const rows = ch('.b-object-details__body').children(
    '.b-object-details__row'
  );
  let desc_array = [];
  rows.each(function (i, el) {
    const cells = ch(el).children();
    const title = ch(cells[0]).text();

    // For text extraction, handle HTML tags by replacing them with newlines
    let value;
    if (descTagTitles.includes(title)) {
      value = convertHtmlTagsToNewlines(ch(cells[1]), ch);
    } else {
      value = ch(cells[1]).text();
    }

    if (title === 'Artist/Maker') {
      item['creator'] = value;
    } else if (title === 'Place of origin') {
      const length = value.length;
      const endSlice = length - 7;
      const countryStr = value.trim().slice(0, endSlice);
      item['culture_country'] = countryStr;
    } else if (title === 'Accession number') {
      item['item_collection_no'] = value;
    } else if (title === 'Record URL') {
      item['collection_url'] = value;
    } else if (title === 'Credit line') {
      item['source'] = value;
    } else if (title === 'Summary') {
      desc_array[0] = value;
    } else if (title === 'Physical description') {
      desc_array[1] = value;
    } else if (title === 'Object history') {
      desc_array[2] = value;
    } else if (title === 'Materials and techniques') {
      const value_text = ch(cells[1])
        .children(
          '.b-object-details__controlled-vocab-string-container'
        )
        .text();
      const desc_item = `${title}: ${value_text}`;
      desc_array[3] = desc_item;
    } else if (title === 'Dimensions') {
      desc_array[4] = value;
    }
  });

  processDescArray(desc_array, item);

  // Extract and store the main image URL
  const imgSrc = ch('.object-page__hero-img').attr('src');
  if (imgSrc) {
    item.sourceImageUrl = imgSrc;
    console.log('VA main image URL:', imgSrc);
  }

  console.log('VA fn', item);
  return item;
};
