exports.up = async function (knex) {
  return knex.schema.table('items', function (tbl) {
    tbl.string('sourceImageUrl', 2000);
  });
};

exports.down = async function (knex) {
  return knex.schema.table('items', function (tbl) {
    tbl.dropColumn('sourceImageUrl');
  });
};
