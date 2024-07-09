/**
 * Extracts a valid year from a string
 *
 * @param {string} yearStr - The string to extract the year from
 * @returns {string} The extracted year
 */
function extractValidYear(yearStr) {
  // Assertion: yearStr is a string
  // Assertion: yearStr contains a valid year
  // Test inputs: '1999', '2000-2001', 'Invalid year'

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

/**
 * Checks if a value can be converted to an integer
 *
 * @param {string} value - The value to check
 * @returns {boolean} True if the value can be converted to an integer, false otherwise
 */
function canConvertToInteger(value) {
  // Assertion: value is a string
  // Test inputs: '123', 'abc'

  return parseInt(value, 10).toString() === value;
}

module.exports = {
  extractValidYear,
  canConvertToInteger
};
