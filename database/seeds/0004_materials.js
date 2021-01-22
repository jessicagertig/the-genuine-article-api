exports.seed = function (knex) {
	// Inserts seed entries
	return knex('materials').insert([
		{
			id: 1,
			material: 'cotton'
		},
		{
			id: 2,
			material: 'muslin'
		},
		{
			id: 3,
			material: 'calico'
		},
		{
			id: 4,
			material: 'chintz'
		},
		{
			id: 5,
			material: 'dimity'
		},
		{
			id: 6,
			material: 'organza'
		},
		{
			id: 7,
			material: 'gauze'
		},
		{
			id: 8,
			material: 'cotton gauze'
		},
		{
			id: 9,
			material: 'silk gauze'
		},
		{
			id: 10,
			material: 'lawn'
		},
		{
			id: 11,
			material: 'cotton lawn'
		},
		{
			id: 12,
			material: 'linen lawn'
		},
		{
			id: 13,
			material: 'silk'
		},
		{
			id: 14,
			material: 'linen'
		},
		{
			id: 15,
			material: 'cambric'
		},
		{
			id: 16,
			material: 'flannel'
		},
		{
			id: 17,
			material: 'wool'
		},
		{
			id: 18,
			material: 'worsted'
		},
		{
			id: 19,
			material: 'canvas'
		},
		{
			id: 20,
			material: 'straw'
		},
		{
			id: 21,
			material: 'mother of pearl'
		},
		{
			id: 22,
			material: 'jet'
		},
		{
			id: 23,
			material: 'pearls'
		},
		{
			id: 24,
			material: 'satin'
		},
		{
			id: 25,
			material: 'silk damask'
		},
		{
			id: 26,
			material: 'silk brocade'
		},
		{
			id: 27,
			material: 'tassels'
		},
		{
			id: 28,
			material: 'lace'
		},
		{
			id: 29,
			material: 'whale bone'
		},
		{
			id: 30,
			material: 'steel'
		},
		{
			id: 31,
			material: 'silver'
		},
		{
			id: 32,
			material: 'gold'
		}
	]);
};
