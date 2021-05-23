exports.up = async function (knex) {
  await knex.schema.createTable('materials', function (tbl) {
    tbl.increments().primary()
    tbl.string('material').notNullable().unique()
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('materials')
}
