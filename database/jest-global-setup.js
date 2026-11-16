// Jest globalSetup. Runs all migrations and seeds against the testing
// database once before the test suites.
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
