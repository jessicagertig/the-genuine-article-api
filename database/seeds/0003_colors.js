exports.seed = function (knex) {
	// Inserts seed entries
	return knex('colors').insert([
		{
			id: 1,
			color: 'black'
		},
		{
			id: 2,
			color: 'white'
		},
		{
			id: 3,
			color: 'beige'
		},
		{
			id: 4,
			color: 'tan'
		},
		{
			id: 5,
			color: 'grey'
		},
		{
			id: 6,
			color: 'silver'
		},
		{
			id: 7,
			color: 'orange'
		},
		{
			id: 8,
			color: 'red'
		},
		{
			id: 9,
			color: 'maroon'
		},
		{
			id: 10,
			color: 'purple'
		},
		{
			id: 11,
			color: 'lavender'
		},
		{
			id: 12,
			color: 'fuchsia'
		},
		{
			id: 13,
			color: 'pink'
		},
		{
			id: 14,
			color: 'forest green'
		},
		{
			id: 15,
			color: 'green'
		},
		{
			id: 16,
			color: 'lime'
		},
		{
			id: 17,
			color: 'chartreuse'
		},
		{
			id: 18,
			color: 'olive'
		},
		{
			id: 19,
			color: 'yellow'
		},
		{
			id: 20,
			color: 'gold'
		},
		{
			id: 21,
			color: 'navy'
		},
		{
			id: 22,
			color: 'blue'
		},
		{
			id: 23,
			color: 'teal'
		},
		{
			id: 24,
			color: 'aqua'
		},
		{
			id: 25,
			color: 'royal blue'
		},
		{
			id: 26,
			color: 'sky blue'
		},
		{
			id: 27,
			color: 'brown'
		},
		{
			id: 28,
			color: 'lilac'
		},
		{
			id: 29,
			color: 'cream'
		}
	]);
};
