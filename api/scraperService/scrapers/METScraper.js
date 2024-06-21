const { removeQueryFromUrl } = require('../helpers/urlHelper');
const { extractValidYear } = require('../helpers/dateHelper');
const {
  createOrAddToDictValue
} = require('../helpers/stringHelper');
const assert = require('assert');

// Metropolitan Museum of Art scraper function
module.exports = async function scrapeMET(ch, item) {
  item['collection'] = 'The Metropolitan Museum of Art';

  // cleanup url
  // Remove query from URL
  const url = item.collection_url;
  assert(
    removeQueryFromUrl(
      'https://www.metmuseum.org/art/collection/search/437654?year=1800&page=3'
    ) === 'https://www.metmuseum.org/art/collection/search/437654',
    'Function should remove query param from url'
  );
  const cleanedUrl = removeQueryFromUrl(url);
  assert(
    typeof cleanedUrl === 'string',
    'cleanedUrl should be a string'
  );
  const initial_url = item['collection_url'];
  item['collection_url'] = removeQueryFromUrl(initial_url, item);
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
    } else if (label === 'Design House:') {
      item['creator'] = createOrAddToDictValue(
        item['creator'],
        value,
        'unknown'
      );
    } else if (label === 'Designer:') {
      item['creator'] = createOrAddToDictValue(
        item['creator'],
        value,
        'unknown'
      );
    }
  });
  console.log('MET fn', item);
  return item;
};
