exports.up = async function (knex) {
  await knex.schema.createTable('oauth_tokens', function (tbl) {
    tbl.increments().primary();
    tbl.string('session_id').notNullable();
    tbl.string('provider').notNullable();
    tbl.text('access_token').notNullable();
    tbl.text('refresh_token');
    tbl.integer('expires_in');
    tbl.string('provider_user_id');
    tbl.timestamp('created_at').defaultTo(knex.fn.now());
    tbl.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('oauth_tokens');
};
