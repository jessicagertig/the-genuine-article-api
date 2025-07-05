const { processDescArray } = require('../helpers/stringHelper');

/**
 * Scrapes data from the Los Angeles County Museum of Art website
 *
 * @param {object} ch - The Cheerio object loaded with the webpage HTML
 * @param {object} item - The item object to populate with scraped data
 * @returns {object} The populated item object
 */
module.exports = async function LACMAScraper(ch, item) {
  item['collection'] = 'LACMA';

  let desc_array = [];
  let desc_title = ch('#page-title').text();
  console.log('desc_title_____', desc_title);
  if (desc_title.includes("Woman's")) {
    const endIndex = desc_title.length;
    const title = desc_title.slice(7, endIndex);
    desc_title = title.trim();
  }
  console.log('desc_title_____', desc_title);
  desc_array[0] = desc_title;
  item['garment_type'] = desc_title;

  // get artist (handles possible duplicate divs)
  const els = ch('.artist-name').find('a');
  if (els.length > 0) {
    els.each(function (i, el) {
      if (i == 0) {
        const artist = ch(el).text();
        item['creator'] = artist.trim();
      }
    });
  }

  const html_string = ch('.group-right').html();
  const date_regex = /(?<=circa\s).*?(?=<)/;
  const date_match = html_string.match(date_regex);
  const date_text = date_match ? date_match[0] : '1800';
  item['begin_year'] = date_text;

  const place_regex = /(?<=<\/h2><\/div>).*?(?=,\scirca)/;
  const place_match = html_string.match(place_regex);
  const place_text = place_match ? place_match[0] : 'Western';
  item['culture_country'] = place_text;

  const begin_el = ch('.artist-name').next();
  const materials_el = begin_el.next();
  const materials_text = materials_el.text().trim();
  const materials_desc = `Materials: ${materials_text}`;
  if (materials_text.length > 0) {
    desc_array[1] = materials_desc;
  }
  // get el next to materials_el
  const dimensions_el = materials_el.next();
  const dimensions_text = dimensions_el.text().trim();
  const dimensions_desc = `Measurements: ${dimensions_text}`;
  if (dimensions_text.length > 0) {
    desc_array[2] = dimensions_desc;
  }
  // get el next to dimensions el
  const source_and_accession_no_el = dimensions_el.next();
  const text = source_and_accession_no_el.text().trim();
  const last_opening_paren_index = text.lastIndexOf('(');
  const last_closing_paren_index = text.lastIndexOf(')');
  const accession_no = text.substring(
    last_opening_paren_index + 1,
    last_closing_paren_index
  );
  item['item_collection_no'] = accession_no;
  const source = text.substring(0, last_opening_paren_index).trim();
  item['source'] = source;

  processDescArray(desc_array, item);

  // Extract and store the main image URL
  const imgSrc = ch('.media-asset-image img').attr('src');
  if (imgSrc) {
    item.sourceImageUrl = imgSrc;
    console.log('LACMA main image URL:', imgSrc);
  }

  console.log('Lacma fn', item);
  return item;
};
