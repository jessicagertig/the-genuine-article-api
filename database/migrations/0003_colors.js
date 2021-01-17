exports.up = async function (knex) {
	await knex.schema.createTable('colors', function (tbl) {
		tbl.increments().primary();
		tbl.string('color').notNullable().unique();
	});
};

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists('colors');
};
