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
    item.replace(/(\r\n|\n|\r)/gm, ' ').trim()
  );
  console.log('final', final_desc_array);
  item['description'] = final_desc_array.join('\n\n');
}

module.exports = {
  processDescArray,
  createOrAddToDictValue
};
