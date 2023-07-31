const decades_dictionary = {
  0: '1800s',
  1: '1810s',
  2: '1820s',
  3: '1830s',
  4: '1840s',
  5: '1850s',
  6: '1860s',
  7: '1870s',
  8: '1880s',
  9: '1890s',
  10: '1900s',
  11: '1790s'
};

const get_decade = (str) => {
  let decade;
  if (str.charAt(1) === '9') {
    decade = decades_dictionary[10];
  } else if (str.charAt(1) === '7') {
    decade = decades_dictionary[11];
  } else {
    const decadeStr = str.charAt(2);
    decade = decades_dictionary[decadeStr];
  }
  return decade;
};

const calculateDecades = (begin_year, end_year) => {
  let begin_year_string = begin_year;
  let end_year_string = end_year;
  if (typeof begin_year === 'number') {
    begin_year_string = begin_year.toString();
  }

  if (typeof end_year === 'number') {
    end_year_string = end_year.toString();
  }

  const begin_decade = get_decade(begin_year_string);
  let end_decade =
    end_year_string !== null ? get_decade(end_year_string) : null;

  if (begin_decade === end_decade) {
    end_decade = null;
  }

  return [begin_decade, end_decade];
};

const sortByYear = (order, results_array) => {
  // Sort the results array
  results_array.sort((a, b) => {
    const begin_year_a = parseInt(a.begin_year, 10);
    const begin_year_b = parseInt(b.begin_year, 10);
    if (order === 'asc') {
      return begin_year_a - begin_year_b;
    } else if (order === 'desc') {
      return begin_year_b - begin_year_a;
    }
  });
  return results_array;
};

module.exports = {
  calculateDecades,
  sortByYear
};
