exports.up = async function (knex) {
	await knex.schema.createTable('main_images', function (tbl) {
		tbl.increments().primary();
		tbl.string('main_image_url').notNullable().unique();
		tbl
			.integer('item_id')
			.references('id')
			.inTable('items')
			.onDelete('cascade')
			.onUpdate('cascade');
		tbl.string('file_name').notNullable().unique();
		tbl.string('large_url').notNullable().unique();
		tbl.string('display_url').notNullable().unique();
		tbl.string('admin_upload_url').notNullable().unique();
		tbl.string('small_url').notNullable().unique();
		tbl.string('thumb_url').notNullable().unique();
	});
};

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists('main_images');
};
