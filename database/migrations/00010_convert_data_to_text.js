exports.up = async function (knex) {
  // Select all rows from the table
  const rows = await knex('items').select('*');

  // Map each row to a new object containing the id & the two columns to be updated
  const updatedRows = rows.map((row) => {
    return {
      id: row.id,
      begin_year: row.begin_year.toString(),
      end_year:
        row.end_year !== null
          ? row.end_year.toString()
          : row.end_year
    };
  });

  // Update each row's colum with the new text value
  const updates = updatedRows.map((row) => {
    return knex('items').where('id', row.id).update({
      begin_year: row.begin_year,
      end_year: row.end_year
    });
  });

  // Execute all update queries
  await Promise.all(updates);
};

exports.down = async function (knex) {
  // Select all rows from the table
  const rows = await knex('items').select('*');

  // Map each row to a new object containing the id & the two columns to be updated
  const revertedRows = rows.map((row) => {
    const new_begin_year = revertValues(row.begin_year);
    const new_end_year = revertValues(row.end_year);
    return {
      id: row.id,
      begin_year: new_begin_year,
      end_year: new_end_year
    };
  });

  //helper function
  function revertValues(year) {
    let new_year;
    if (typeof year === 'string') {
      const parsedValue = parseInt(year);
      if (!isNaN(parsedValue)) {
        new_year = parsedValue;
      } else {
        new_year = null;
      }
    } else {
      new_year = year;
    }
    return new_year;
  }

  // Update each row's colum with the new text value
  const reversions = revertedRows.map((row) => {
    return knex('items').where('id', row.id).update({
      begin_year: row.begin_year,
      end_year: row.end_year
    });
  });

  // Execute all update queries
  await Promise.all(reversions);
};
