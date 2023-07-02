module.exports = {
  calculateDecades
};

const decadesDictionary = {
  0: '1800s',
  1: '1810s',
  2: '1820s',
  3: '1830s',
  4: '1840s',
  5: '1850s',
  6: '1860s',
  7: '1870s',
  8: '1880s',
  9: '1890s'
};

const calculateDecades = (beginYear, endYear) => {
  const getBeginDecade = beginYear.charAt(2);
  const getEndDecade = endYear.charAt(2);

  const beginDecade = decadesDictionary[getBeginDecade];
  let endDecade;
  if (getBeginDecade === getEndDecade) {
    endDecade = null;
  } else {
    endDecade = decadesDictionary[getEndDecade];
  }

  return [beginDecade, endDecade];
};
