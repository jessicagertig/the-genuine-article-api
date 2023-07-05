exports.up = async function (knex) {
  return knex.schema.alterTable('main_images', function (tbl) {
    tbl.string('small_url').nullable().alter();
    tbl.string('admin_upload_url').nullable().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('main_images', function (tbl) {
    tbl.string('small_url').notNullable().alter();
    tbl.string('admin_upload_url').notNullable().alter();
  });
};
