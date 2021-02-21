exports.up = async function (knex) {
	await knex.schema.createTable('secondary_images', function (tbl) {
		tbl.increments().primary();
		tbl.string('large').notNullable();
		tbl.string('small').notNullable();
		tbl.string('thumb').notNullable();
		tbl
			.integer('item_id')
			.references('id')
			.inTable('items')
			.onDelete('cascade')
			.onUpdate('cascade');
	});
};

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists('secondary_images');
};
