exports.up = async function (knex) {
  await knex.schema.createTable('users', function (tbl) {
    tbl.increments().primary();

    tbl.string('email', 255).notNullable().unique();

    tbl.string('password', 255).notNullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('users');
};
