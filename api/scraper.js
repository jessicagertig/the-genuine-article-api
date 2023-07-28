const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  scrapeMET
};
// const metUrl =
//   'https://www.metmuseum.org/art/collection/search/107620';

async function scrapeMET(url) {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const ch = cheerio.load(data);
    // define item object
    const item = {
      garment_title: 'Dress',
      garment_type: '',
      begin_year: '',
      end_year: '',
      culture_country: '',
      collection: 'The Metropolitan Museum of Art',
      collection_url: url,
      creator: 'unknown',
      source: '',
      item_collection_no: '',
      description: ''
    };
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
    const year = dateStr.trim().slice(4);
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
      if (label === 'Credit Line:') {
        item['source'] = value;
      }
      if (label === 'Accession Number:') {
        item['item_collection_no'] = value;
      }
    });
    console.log(item);
    return item;
  } catch (err) {
    console.error(err);
  }
}
// Invoke the above function
// scrapeMET(metUrl);
