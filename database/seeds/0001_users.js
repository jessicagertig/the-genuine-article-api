exports.seed = function (knex) {
  // Inserts seed entries
  return knex('users').insert([
    {
      email: 'jezzany@gmail.com',
      password: 'bustle',
    },
  ]);
};
