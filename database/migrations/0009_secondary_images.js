exports.up = async function (knex) {
  await knex.schema.createTable('secondary_images', function (tbl) {
    tbl.increments().primary()
    tbl.string('file_name').notNullable().unique()
    tbl.string('large_url').notNullable().unique()
    tbl.string('small_url').notNullable().unique()
    tbl.string('thumb_url').notNullable().unique()
    tbl
      .integer('item_id')
      .references('id')
      .inTable('items')
      .onDelete('cascade')
      .onUpdate('cascade')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('secondary_images')
}
