require('dotenv').config();

const environment = process.env.DB_ENV || 'development';

const knex = require('knex');

const knexConfig = require('../knexfile.js')[environment];

module.exports = knex(knexConfig);
