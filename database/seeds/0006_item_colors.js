exports.seed = function (knex) {
	// Inserts seed entries
	return knex('item_colors').insert([
		{
			item_id: 4,
			color_id: 1
		},
		{
			item_id: 4,
			color_id: 2
		},
		{
			item_id: 4,
			color_id: 29
		},
		{
			item_id: 2,
			color_id: 7
		},
		{
			item_id: 2,
			color_id: 8
		},
		{
			item_id: 2,
			color_id: 3
		},
		{
			item_id: 5,
			color_id: 29
		}
	]);
};
