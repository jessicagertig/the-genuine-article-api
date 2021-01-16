exports.seed = function (knex) {
	// Inserts seed entries
	return knex('users').insert([
		{
			username: 'Tester',
			email: 'jezzany@gmail.com',
			password: 'bustle'
		}
	]);
};
