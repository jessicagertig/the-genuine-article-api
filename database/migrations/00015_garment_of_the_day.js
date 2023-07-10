exports.up = async function (knex) {
  await knex.schema.createTable(
    'garment_of_the_day',
    function (tbl) {
      tbl.increments().primary();
      tbl.integer('item_id').references('id').inTable('items');
      tbl.timestamp('created_at').defaultTo(knex.fn.now());
      tbl.timestamp('updated_at').defaultTo(knex.fn.now());
    }
  );
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('garment_of_the_day');
};
