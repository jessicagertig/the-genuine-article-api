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
  9: '1890s'
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

  const get_begin_decade = begin_year_string.charAt(2);
  const get_end_decade =
    end_year_string !== null ? end_year_string.charAt(2) : null;

  const begin_decade = decades_dictionary[get_begin_decade];
  let end_decade;
  if (
    get_begin_decade === get_end_decade ||
    get_end_decade === null
  ) {
    end_decade = null;
  } else {
    end_decade = decades_dictionary[get_end_decade];
  }

  return [begin_decade, end_decade];
};

module.exports = {
  calculateDecades
};
