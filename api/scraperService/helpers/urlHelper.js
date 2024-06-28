/**
 * Removes the query string from a URL
 *
 * @param {string} url - The URL to remove the query string from
 * @returns {string} The URL without the query string
 */
function removeQueryFromUrl(url) {
  // Assertion: url is a string
  // Assertion: url contains a query string
  // Test inputs: 'https://example.com?query=string', 'https://example.com'

  const has_query = url.includes('?');
  if (has_query) {
    const end_index = url.indexOf('?');
    return url.slice(0, end_index);
  }
  return url;
}

module.exports = {
  removeQueryFromUrl
};
