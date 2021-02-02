exports.up = async function (knex) {
	await knex.schema.createTable('main_image', function (tbl) {
		tbl.increments().primary();
		tbl.string('main_image_url').notNullable();
		tbl
			.integer('item_id')
			.references('id')
			.inTable('items')
			.onDelete('cascade')
			.onUpdate('cascade');
	});
};

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists('colors');
};
