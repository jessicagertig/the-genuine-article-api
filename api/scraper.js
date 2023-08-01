const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  scrape
};

async function scrape(url, src) {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const ch = cheerio.load(data);
    // define item object
    const item = {
      garment_title: 'Dress',
      garment_type: '',
      begin_year: '1800',
      end_year: '',
      culture_country: '',
      collection: '',
      collection_url: url,
      creator: 'unknown',
      source: '',
      item_collection_no: '',
      description: ''
    };
    let item_info;
    if (src === 'MET') {
      item_info = await scrapeMET(ch, item);
    } else if (src === 'VA') {
      item_info = await scrapeVA(ch, item);
    } else if (src === 'CAM') {
      item_info = await scrapeCAM(ch, item);
    } else if (src === 'PHILA') {
      item_info = await scrapePHILA(ch, item);
    }
    console.log('Item in scrape fn', item_info);
    return item_info;
  } catch (err) {
    console.error(err);
  }
}
// Metropolitan Museum of Art scraper function
async function scrapeMET(ch, item) {
  item['collection'] = 'The Metropolitan Museum of Art';

  // get title
  const title = ch('.artwork__title--text').text();
  item['garment_type'] = title;
  // get culture_country
  const culture = ch('.gtm__artist_culture').text();
  item['culture_country'] = culture;
  // get begin_year
  const dateStr = ch('.artwork__creation-date')
    .children('time')
    .text();
  const trimmedStr = dateStr.trim();
  let year;
  if (trimmedStr.length === 4) {
    year = trimmedStr;
  } else if (trimmedStr.length > 4) {
    year = trimmedStr.slice(4);
  }
  const year_valid = canConvertToInteger(year);
  if (year_valid && year.length === 4) {
    item['begin_year'] = year;
  }
  // get description
  const description = ch('.artwork__intro__desc')
    .children('p')
    .text();
  item['description'] = description;
  // get source and collection_no
  const tombstoneList = ch('.artwork-tombstone--item');
  console.log(tombstoneList.length);
  tombstoneList.each(function (i, el) {
    const spans = ch(el).children();
    const label = ch(spans[0]).text();
    const value = ch(spans[1]).text();
    if (label === 'Credit Line:') {
      item['source'] = value;
    }
    if (label === 'Accession Number:') {
      item['item_collection_no'] = value;
    }
  });
  console.log('MET fn', item);
  return item;
}

// Victoria and Albert Museum Scraper function
async function scrapeVA(ch, item) {
  item['collection'] = 'The Victoria and Albert Museum';
  // get title
  const title = ch('.object-page__title').text();
  item['garment_type'] = title;
  // get begin_year
  const dateStr = ch('.object-page__credit').text();
  const trimmedStr = dateStr.trim();
  const ca_date = trimmedStr.includes('ca');
  const range_date = trimmedStr.includes('-');
  let year;
  if (ca_date) {
    year = trimmedStr.slice(4, 8);
  } else if (range_date) {
    year = trimmedStr.slice(0, 4);
  }
  const year_valid = canConvertToInteger(year);
  if (year_valid && year.length === 4) {
    item['begin_year'] = year;
  }
  // get rows of table data
  const rows = ch('.b-object-details__body').children(
    '.b-object-details__row'
  );
  let desc_array = [];
  rows.each(function (i, el) {
    const cells = ch(el).children();
    const title = ch(cells[0]).text();
    const value = ch(cells[1]).text();

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
      const desc_item = `${title}:\n${value}`;
      desc_array[3] = desc_item;
    } else if (title === 'Dimensions') {
      const desc_item = `${title}:\n${value}`;
      desc_array[4] = desc_item;
    }
  });
  item['description'] = desc_array.join('\n\n');

  console.log('VA fn', item);
  return item;
}

// Cincinnati Art Museum scraper function
async function scrapeCAM(ch, item) {
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
      const year_valid = canConvertToInteger(value);
      if (year_valid && value.length === 4) {
        item['begin_year'] = value;
      }
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
      const desc_item = `${title}\n${value}`;
      desc_array[1] = desc_item;
    }
  });
  item['description'] = desc_array.join('\n\n');

  console.log('CAM fn', item);
  return item;
}

// Philadelphia Museum of Art
async function scrapePHILA(ch, item) {
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
      const desc_item = `${title}\n${value}`;
      desc_array[1] = desc_item;
    } else if (title === 'Dimensions:') {
      const desc_item = `${title}\n${value}`;
      desc_array[2] = desc_item;
    }
  });
  item['description'] = desc_array.join('\n\n');

  console.log('Phila fn', item);
  return item;
}

//helper
function canConvertToInteger(value) {
  return parseInt(value, 10).toString() === value;
}

/* TEST Functions
------------------------ */

// const metUrl = 'https://www.metmuseum.org/art/collection/search/158923';
// const metUrl = 'https://www.metmuseum.org/art/collection/search/107620';
// const vaUrl = 'https://collections.vam.ac.uk/item/O13844/dress-unknown/';
// const vaUrl = 'https://collections.vam.ac.uk/item/O108865/dress-liberty--co/'
// const camUrl = `https://www.cincinnatiartmuseum.org/art/explore-the-collection?id=11682053`;
// const philaUrl =
//   'https://www.philamuseum.org/collection/object/59168';

// scrape(metUrl, 'MET');
// scrape(vaUrl, 'VA');
// scrape(camUrl, 'CAM');
// scrape(philaUrl, 'PHILA');
