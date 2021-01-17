exports.seed = function (knex) {
	// Inserts seed entries
	return knex('materials').insert([
		{
			material: 'cotton'
		},
		{
			material: 'muslin'
		},
		{
			material: 'calico'
		},
		{
			material: 'chintz'
		},
		{
			material: 'dimity'
		},
		{
			material: 'organza'
		},
		{
			material: 'gauze'
		},
		{
			material: 'cotton gauze'
		},
		{
			material: 'silk gauze'
		},
		{
			material: 'lawn'
		},
		{
			material: 'cotton lawn'
		},
		{
			material: 'linen lawn'
		},
		{
			material: 'silk'
		},
		{
			material: 'sarsnet'
		},
		{
			material: 'lutestring'
		},
		{
			material: 'linen'
		},
		{
			material: 'cambric'
		},
		{
			material: 'flannel'
		},
		{
			material: 'wool'
		},
		{
			material: 'worsted'
		},
		{
			material: 'canvas'
		},
		{
			material: 'duck'
		},
		{
			material: 'straw'
		},
		{
			material: 'mother of pearl'
		},
		{
			material: 'jet'
		},
		{
			material: 'pearls'
		},
		{
			material: 'satin'
		},
		{
			material: 'silk damask'
		},
		{
			material: 'silk brocade'
		},
		{
			material: 'tassels'
		},
		{
			material: 'lace'
		}
	]);
};
