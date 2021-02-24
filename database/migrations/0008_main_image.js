exports.up = async function (knex) {
	await knex.schema.createTable('main_image', function (tbl) {
		tbl.increments().primary();
		tbl.string('main_image_url').notNullable();
		tbl.string('file_name').notNullable();
		tbl
			.integer('item_id')
			.references('id')
			.inTable('items')
			.onDelete('cascade')
			.onUpdate('cascade');
	});

	await knex.schema.createTable('main_image_sizes', function (tbl) {
		tbl.increments().primary();
		tbl.string('large').notNullable();
		tbl.string('display').notNullable();
		tbl.string('admin_upload').notNullable();
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
	await knex.schema.dropTableIfExists('main_image');
	await knex.schema.dropTableIfExists('main_image_sizes');
};
