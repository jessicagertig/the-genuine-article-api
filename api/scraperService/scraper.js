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
