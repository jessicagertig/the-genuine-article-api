exports.up = async function (knex) {
  return knex.schema.table('main_images', function (tbl) {
    tbl.dropUnique('file_name', 'main_images_file_name_unique');
  });
};

exports.down = function (knex) {
  return knex.schema.table('main_images', function (tbl) {
    tbl.unique('file_name', 'main_images_file_name_unique');
  });
};
