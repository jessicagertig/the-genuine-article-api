// Creates an admin user by inserting directly into the users table. This is
// the only way to create an admin. The API cannot.
//
// Connects to the database for the current NODE_ENV, as the app does.
//
// Usage:
//   ADMIN_USERNAME="Jane" ADMIN_EMAIL="jane@example.com" ADMIN_PASSWORD="..." node database/create-admin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db-config');

async function createAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !email || !password) {
    throw new Error(
      'ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD are required.'
    );
  }

  const existing = await db('users').where({ email }).first();
  if (existing) {
    throw new Error(`A user with email ${email} already exists.`);
  }

  const [user] = await db('users')
    .insert({
      username,
      email,
      password: bcrypt.hashSync(password, 12),
      role: 'admin'
    })
    .returning(['id', 'username', 'email', 'role']);

  return user;
}

createAdmin()
  .then((user) => {
    console.log(`Admin created: ${user.email} (id ${user.id})`);
  })
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => db.destroy());
