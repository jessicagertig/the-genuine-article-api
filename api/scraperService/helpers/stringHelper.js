/**
 * Creates or adds to a dictionary value
 *
 * @param {string} dict_value - The current dictionary value
 * @param {string} next_value - The value to add to the dictionary
 * @param {string} default_value - The default value to use if dict_value is empty
 * @returns {string} The updated dictionary value
 */
function createOrAddToDictValue(
  dict_value,
  next_value,
  default_value = ''
) {
  // Assertion: dict_value is a string
  // Assertion: next_value is a string
  // Assertion: default_value is a string
  // Test inputs: ('', 'value'), ('existing value', 'new value'), ('', 'value', 'default value')

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

function processDescArray(desc_array, item) {
  console.log('desc', desc_array);
  const filtered_desc_array = desc_array.filter(
    (str) => str.length > 0
  );
  const final_desc_array = filtered_desc_array.map((item) =>
    item
      .replace(/\r\n/g, '\n') // normalize Windows line endings
      .replace(/\r/g, '\n') // normalize Mac line endings
      .replace(/\n\s*\n/g, '\n') // collapse multiple newlines with whitespace
      .replace(/^\s+|\s+$/g, '') // trim leading/trailing whitespace
      .trim()
  );
  console.log('final', final_desc_array);
  item['description'] = final_desc_array.join('\n\n');
}

/**
 * Converts HTML content by replacing <br> and <li> tags with newlines and extracting text
 * @param {object} cheerioElement - The Cheerio element containing HTML
 * @param {object} ch - The Cheerio instance
 * @returns {string} Text content with preserved line breaks
 */
function convertHtmlTagsToNewlines(cheerioElement, ch) {
  const htmlContent = cheerioElement.html();
  const htmlWithNewlines = htmlContent
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li>/gi, '\n')
    .replace(/<\/li>/gi, '')
    .replace(/<ul>/gi, '')
    .replace(/<\/ul>/gi, '');
  return ch('<div>' + htmlWithNewlines + '</div>').text();
}

module.exports = {
  processDescArray,
  createOrAddToDictValue,
  convertHtmlTagsToNewlines
};
