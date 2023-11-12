exports.up = async function (knex) {
  return knex.schema.table('main_images', function (tbl) {
    tbl.numeric('ratio', 20, 14);
  });
};

exports.down = async function (knex) {
  return knex.schema.table('main_images', function (tbl) {
    tbl.dropColumn('ratio');
  });
};
