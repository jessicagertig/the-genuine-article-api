const bcrypt = require('bcryptjs');

// Seed users for development and testing databases only. These credentials
// are public, so these accounts must never exist in production. Production
// admins are created with database/create-admin.js, not through the API and
// not by running seeds.
exports.seed = function (knex) {
  return knex('users').insert([
    {
      username: 'Test Admin',
      email: 'admin@example.com',
      password: bcrypt.hashSync('test-admin-password', 10),
      role: 'admin'
    },
    {
      username: 'Test Guest',
      email: 'guest@example.com',
      password: bcrypt.hashSync('test-guest-password', 10),
      role: 'guest'
    }
  ]);
};
