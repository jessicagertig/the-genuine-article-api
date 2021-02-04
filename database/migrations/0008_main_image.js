exports.up = async function (knex) {
	await knex.schema.createTable('main_image', function (tbl) {
		tbl.increments().primary();
		tbl.string('main_image_url').notNullable();
		tbl.string('main_large_url').notNullable();
		tbl.string('main_display_url').notNullable();
		tbl.string('main_admin_upload_url').notNullable();
		tbl.string('main_small_url').notNullable();
		tbl.string('main_thumb_url').notNullable();
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
};
