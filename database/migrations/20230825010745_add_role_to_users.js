exports.up = async function (knex) {
  return knex.schema.table('users', function (tbl) {
    tbl.enu('role', ['guest', 'member', 'admin']).defaultTo('guest');
  });
};

exports.down = async function (knex) {
  return knex.schema.table('users', function (tbl) {
    tbl.dropColumn('role');
  });
};
