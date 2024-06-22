const axios = require('axios');
const cheerio = require('cheerio');
const scraperFunctions = require('./scrapers');

module.exports = {
  scrape
};

async function scrape(url) {
  const src = getSourceFromUrl(url);
  if (!src) {
    throw new Error(`Invalid site URL: ${url}`);
  }
  try {
    const { data } = await axios.get(url);
    const ch = cheerio.load(data);
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

    if (src in scraperFunctions) {
      return await scraperFunctions[src](ch, item);
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * Get the source from a URL.
 * @param {string} url - The URL to get the source from.
 * @returns {string} The source of the URL (e.g. MET, VA, etc.)
 */
function getSourceFromUrl(url) {
  // pseudo code for assertions:
  // assert(getSourceFromUrl('https://www.metmuseum.org/') === 'MET')
  // assert(getSourceFromUrl('https://collections.vam.ac.uk/') === 'VA')

  const options = {
    metmuseum: 'MET',
    'collections.vam': 'VA',
    cincinnatiartmuseum: 'CAM',
    philamuseum: 'PHILA',
    lacma: 'LACMA',
    fitnyc: 'FIT',
    'collections.rom.on': 'ROM',
    'emuseum.history.org': 'CW',
    'collections.mfa.org': 'MFAB'
  };
  let src;
  for (const [key, value] of Object.entries(options)) {
    if (url.includes(key)) {
      src = value;
    }
  }
  return src;
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
// const romUrl =
//   'https://collections.rom.on.ca/objects/394286/womans-semiformal-dress?ctx=abb69080-0824-4853-ae5f-f29dd769c436&idx=10';
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
