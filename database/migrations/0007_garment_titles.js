exports.up = async function (knex) {
	await knex.schema.createTable('garment_titles', function (tbl) {
		tbl.increments().primary();
		tbl.string('garment_title').notNullable().unique();
	});
};

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists('garment_titles');
};
