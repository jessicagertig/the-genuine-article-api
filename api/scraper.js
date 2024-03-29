const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  scrape
};

async function scrape(url) {
  const src = getSourceFromUrl(url);
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
      culture_country: 'Western',
      collection: '',
      collection_url: url,
      creator: 'unknown',
      source: '',
      item_collection_no: '',
      description: ''
    };

    const scrapeFunctions = {
      MET: scrapeMET,
      VA: scrapeVA,
      CAM: scrapeCAM,
      PHILA: scrapePHILA,
      LACMA: scrapeLACMA,
      FIT: scrapeFIT,
      ROM: scrapeROM,
      CW: scrapeCW
    };

    let item_info;

    if (src in scrapeFunctions) {
      item_info = await scrapeFunctions[src](ch, item);
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

  // cleanup url
  const initial_url = item['collection_url'];
  removeQueryFromUrl(initial_url, item);
  // get title
  const title = ch('.artwork__title--text').text();
  item['garment_type'] = title;
  // get begin_year
  const dateStr = ch('.artwork__creation-date')
    .children('time')
    .text();
  const trimmedStr = dateStr.trim();
  const year = extractValidYear(trimmedStr);
  item['begin_year'] = year;
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
    if (label === 'Culture:') {
      item['culture_country'] = value;
    } else if (label === 'Credit Line:') {
      item['source'] = value;
    } else if (label === 'Accession Number:') {
      item['item_collection_no'] = value;
    } else if (label === 'Maker:') {
      item['creator'] = createOrAddToDictValue(
        item['creator'],
        value,
        'unknown'
      );
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
  const year = extractValidYear(trimmedStr);
  item['begin_year'] = year;
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

  // console.log('VA fn', item);
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

  // console.log('CAM fn', item);
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
      const desc_item = `${title} ${value}`;
      desc_array[1] = desc_item;
    } else if (title === 'Dimensions:') {
      desc_array[2] = value;
    }
  });

  processDescArray(desc_array, item);

  // console.log('Phila fn', item);
  return item;
}

// LACMA
async function scrapeLACMA(ch, item) {
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

  // console.log('Lacma fn', item);
  return item;
}

// FIT scraper function
async function scrapeFIT(ch, item) {
  item['collection'] = 'The Museum at FIT';

  // cleanup url
  const initial_url = item['collection_url'];
  removeQueryFromUrl(initial_url, item);
  let desc_array = [];

  // get rows of data
  const rows = ch('.item-details-inner').children();

  rows.each(function (i, el) {
    const title_str = ch(el).children('.detailFieldLabel').text();
    const title = title_str.trim();
    const value_str = ch(el).children('.detailFieldValue').text();
    const value = value_str.trim();
    // console.log('TITLE _________:', title);
    // console.log('VALUE _________:', value);

    if (title === 'Object:') {
      item['garment_type'] = value;
    } else if (title === 'Brand:') {
      item['creator'] = value;
    } else if (title === 'Date:') {
      const end_index = value.length;
      const year = value.slice(end_index - 4, end_index);
      const year_valid = canConvertToInteger(year);
      if (year_valid && year.length === 4) {
        item['begin_year'] = year;
      }
    } else if (title === 'Country:') {
      item['culture_country'] = value;
    } else if (title === 'Credit Line:') {
      item['source'] = value;
    } else if (title === 'Object number:') {
      item['item_collection_no'] = value;
    } else if (title === 'Label Text:' && value.length > 0) {
      desc_array[0] = value;
    } else if (title === 'Medium:' && value.length > 0) {
      const desc_item = `${title} ${value}`;
      desc_array[2] = desc_item;
    } else if (title === 'Description') {
      const span = ch(el).children('.detailFieldLabel').next();
      const desc = span.text();
      desc_array[1] = desc;
    }
  });

  processDescArray(desc_array, item);

  console.log('FIT fn', item);
  return item;
}

// ROM scraper fn
async function scrapeROM(ch, item) {
  item['collection'] = 'Royal Ontario Museum';

  // cleanup url
  const initial_url = item['collection_url'];
  removeQueryFromUrl(initial_url, item);
  let desc_array = [];

  const title = ch('.titleField').text().trim();
  console.log('TITLE', title);
  item['garment_type'] = title;
  desc_array[0] = title;

  // get rows of data
  const rows = ch('.item-details-inner').children();

  rows.each(function (i, el) {
    const title_str = ch(el).children('.detailFieldLabel').text();
    const title = title_str.trim();
    const value_str = ch(el).children('.detailFieldValue').text();
    const value = value_str.trim();
    // console.log('TITLE _________:', title);
    // console.log('VALUE _________:', value);

    if (title === 'Maker:') {
      item['creator'] = value;
    } else if (title === 'Date:') {
      console.log('DATE:', value);
      const year = extractValidYear(value);
      item['begin_year'] = year;
    } else if (title === 'Credit Line:') {
      item['source'] = value;
    } else if (title === 'Object number:') {
      item['item_collection_no'] = value;
    } else if (title === 'Description') {
      const span = ch(el).children('.detailFieldLabel').next();
      const desc = span.text();
      desc_array[1] = desc;
    } else if (title === 'Medium:' && value.length > 0) {
      const desc_item = `${title} ${value}`;
      desc_array[2] = desc_item;
    } else if (title === 'Dimensions:' && value.length > 0) {
      const desc_item = `${title} ${value}`;
      desc_array[3] = desc_item;
    } else if (title === 'Period:' && value.length > 0) {
      const desc_item = `${title} ${value}`;
      desc_array[4] = desc_item;
    } else if (title === 'Geography:' && value.length > 0) {
      desc_array[5] = value;
    }
  });

  processDescArray(desc_array, item);

  console.log('ROM fn', item);
  return item;
}

// Colonial Williamsburg scraper function
async function scrapeCW(ch, item) {
  item['collection'] = 'Colonial Williamsburg';

  // cleanup url
  const initial_url = item['collection_url'];
  removeQueryFromUrl(initial_url, item);
  let desc_array = [];

  const garmentTitle = ch('.titleField').text();
  item['garment_type'] = garmentTitle.trim();
  // get rows of data
  const rows = ch('.item-details-inner').children();

  rows.each(function (i, el) {
    const title_str = ch(el).children('.detailFieldLabel').text();
    const title = title_str.trim();
    const value_str = ch(el).children('.detailFieldValue').text();
    const value = value_str.trim();
    // console.log('TITLE _________:', title);
    // console.log('VALUE _________:', value);

    if (title === 'Date') {
      const year = extractValidYear(value);
      item['begin_year'] = year;
    } else if (title === 'Origin') {
      item['culture_country'] = value;
    } else if (title === 'Credit Line') {
      item['source'] = value;
    } else if (title === 'Object number') {
      item['item_collection_no'] = value;
    } else if (title === 'Label Text') {
      const span = ch(el).children('.detailFieldLabel').next();
      const desc = span.text();
      desc_array[0] = desc;
    } else if (title === 'Description') {
      const span = ch(el).children('.detailFieldLabel').next();
      const desc = span.text();
      desc_array[1] = desc;
    } else if (title === 'Medium' && value.length > 0) {
      const desc_item = `${title}: ${value}`;
      desc_array[2] = desc_item;
    } else if (title === 'Dimensions' && value.length > 0) {
      const desc_item = `${title}: ${value}`;
      desc_array[3] = desc_item;
    }
  });

  processDescArray(desc_array, item);

  console.log('CW fn', item);
  return item;
}

/* Helper Functions
----------------------------------- */

// don't use this function for the PhilaMuseum or LACMA because sometimes the date of the fabric is listed first
function extractValidYear(yearStr) {
  console.log('year str', yearStr);
  let year;
  if (yearStr.length >= 4) {
    const beginIndex = yearStr.indexOf('1');
    year = yearStr.slice(beginIndex, beginIndex + 4);
  }
  const year_valid = canConvertToInteger(year);
  const return_value =
    year_valid && year.length === 4 ? year : '1800';
  return return_value;
}

function canConvertToInteger(value) {
  return parseInt(value, 10).toString() === value;
}

function getSourceFromUrl(url) {
  const options = {
    metmuseum: 'MET',
    'collections.vam': 'VA',
    cincinnatiartmuseum: 'CAM',
    philamuseum: 'PHILA',
    lacma: 'LACMA',
    fitnyc: 'FIT',
    'collections.rom.on': 'ROM',
    'emuseum.history.org': 'CW'
  };
  let src;
  for (const [key, value] of Object.entries(options)) {
    if (url.includes(key)) {
      src = value;
    }
  }
  return src;
}

function removeQueryFromUrl(initial_url, item) {
  const has_query = initial_url.includes('?');
  if (has_query) {
    const end_index = initial_url.indexOf('?');
    const url = initial_url.slice(0, end_index);
    item['collection_url'] = url;
  }
}

function processDescArray(desc_array, item) {
  console.log('desc', desc_array);
  const filtered_desc_array = desc_array.filter(
    (str) => str.length > 0
  );
  const final_desc_array = filtered_desc_array.map((item) =>
    item.replace(/(\r\n|\n|\r)/gm, ' ').trim()
  );
  console.log('final', final_desc_array);
  item['description'] = final_desc_array.join('\n\n');
}

function createOrAddToDictValue(
  dict_value,
  next_value,
  default_value = ''
) {
  if (
    !dict_value ||
    dict_value.trim().length === 0 ||
    dict_value === default_value
  ) {
    return next_value;
  } else {
    return dict_value + ', ' + next_value;
  }
}

/* TEST Functions
------------------------ */

// const metUrl = 'https://www.metmuseum.org/art/collection/search/158923';
// const metUrl = 'https://www.metmuseum.org/art/collection/search/107620';
// const metUrl =
//   'https://www.metmuseum.org/art/collection/search/159292?sortBy=DateDesc&amp;deptids=8&amp;when=A.D.+1800-1900&amp;ao=on&amp;showOnly=openAccess&amp;ft=dress&amp;offset=40&amp;rpp=40&amp;pos=76';
// const vaUrl = 'https://collections.vam.ac.uk/item/O13844/dress-unknown/';
// const vaUrl =
//   'https://collections.vam.ac.uk/item/O108865/dress-liberty--co/';
// const camUrl = `https://www.cincinnatiartmuseum.org/art/explore-the-collection?id=11682053`;
// const philaUrl =
//   'https://www.philamuseum.org/collection/object/59168';
// const lacmaUrl = 'https://collections.lacma.org/node/214619';
// const lacmaUrl = 'https://collections.lacma.org/node/213825'
// const lacmaUrl = 'https://collections.lacma.org/node/214606';
// const lacmaUrl = 'https://collections.lacma.org/node/214655'
// const fitUrl =
//   'https://fashionmuseum.fitnyc.edu/objects/11416/p80114?ctx=a9866620-1fb6-4519-a45c-c25238153093&idx=44';
// const romUrl = 'https://collections.rom.on.ca/objects/394286/womans-semiformal-dress?ctx=abb69080-0824-4853-ae5f-f29dd769c436&idx=10'
// const romUrl =
//   'https://collections.rom.on.ca/objects/459363/womans-summer-day-dress?ctx=abb69080-0824-4853-ae5f-f29dd769c436&idx=9';
// const cwUrl =
//   'https://emuseum.history.org/objects/47797/dress?ctx=ee1c16b66c27cfc7d43c3de2269ee1d961178539&idx=47';
// scrape(metUrl);
// scrape(vaUrl);
// scrape(camUrl);
// scrape(philaUrl);
// scrape(lacmaUrl);
// scrape(fitUrl);
// scrape(romUrl);
// scrape(cwUrl);
//note - the Colonial Williamsburg collections use eMuseum (will be similiar to FIT or ROM)
