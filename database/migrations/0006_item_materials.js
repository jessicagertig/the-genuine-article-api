exports.up = async function (knex) {
  await knex.schema.createTable('item_materials', function (tbl) {
    tbl
      .integer('item_id')
      .references('id')
      .inTable('items')
      .onDelete('cascade')
      .onUpdate('cascade');
    tbl
      .integer('material_id')
      .references('id')
      .inTable('materials')
      .onDelete('cascade')
      .onUpdate('cascade');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('item_materials');
};
