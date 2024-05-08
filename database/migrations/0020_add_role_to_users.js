exports.up = async function (knex) {
  return knex.schema
    .table('users', function (tbl) {
      tbl
        .enu('role', ['guest', 'member', 'admin'])
        .defaultTo('guest');
    })
    .then(() => {
      // Update preexisting rows to use the default value
      return knex('users').update('role', 'guest');
    });
};

exports.down = async function (knex) {
  return knex.schema.table('users', function (tbl) {
    tbl.dropColumn('role');
  });
};
