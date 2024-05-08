exports.up = async function (knex) {
  return knex.schema.table('main_images', function (tbl) {
    tbl.string('tiny_display_url');
    tbl.string('tiny_large_url');
    tbl.string('tiny_main_url');
    tbl.dropColumn('small_url');
  });
};

exports.down = async function (knex) {
  return knex.schema.table('main_images', function (tbl) {
    tbl.dropColumn('tiny_display_url');
    tbl.dropColumn('tiny_large_url');
    tbl.dropColumn('tiny_main_url');
    tbl.string('small_url');
  });
};
