exports.up = async function (knex) {
  return knex.schema.table('main_images', function (tbl) {
    tbl.decimal('ratio', 20, 14);
  });
};

exports.down = async function (knex) {
  return knex.schema.table('main_images', function (tbl) {
    tbl.dropColumn('ratio');
  });
};
