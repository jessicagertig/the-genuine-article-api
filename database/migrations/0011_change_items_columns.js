exports.up = async function (knex) {
  return knex.schema.alterTable('items', function (tbl) {
    tbl.string('begin_year').alter();
    tbl.string('end_year').alter();
    tbl.string('garment_type', 500).nullable().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('items', function (tbl) {
    tbl.integer('begin_year').alter();
    tbl.integer('end_year').alter();
    tbl.string('garment_type', 500).notNullable().alter();
  });
};
