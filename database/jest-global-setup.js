// Runs once before the test suites. Brings the testing database up to date
// and loads the seed data, so every test run starts from the same known state.
require('dotenv').config();
const knex = require('knex');
const knexfile = require('../knexfile');

module.exports = async () => {
  const db = knex(knexfile.testing);
  try {
    await db.migrate.latest();
    await db.seed.run();
  } finally {
    await db.destroy();
  }
};
