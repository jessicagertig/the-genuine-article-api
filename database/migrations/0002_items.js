exports.up = async function (knex) {
  await knex.schema.createTable('items', function (tbl) {
    tbl.increments().primary()
    tbl.string('garment_title', 255).notNullable()
    tbl.string('garment_type', 500).notNullable()
    tbl.integer('begin_year').notNullable()
    tbl.integer('end_year')
    tbl.string('decade', 5).notNullable()
    tbl.string('secondary_decade', 5)
    tbl
      .string('culture_country', 255)
      .notNullable()
      .defaultTo('Western')
    tbl.string('collection', 255).notNullable().defaultTo('Unknown')
    tbl.string('collection_url', 1000).defaultTo('Unavailable')
    tbl.string('creator', 255).defaultTo('Unknown')
    tbl.string('source', 255)
    tbl.string('item_collection_no', 255).unique()
    tbl.text('description')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('items')
}
