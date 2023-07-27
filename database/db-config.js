const knex = require('knex');
const knexfile = require('../knexfile');
const { attachPaginate } = require('../api/utils/paginate');

const environment = process.env.NODE_ENV || 'development';

const knexConfig = knexfile[environment];

const db = knex(knexConfig); // Create the knex instance

attachPaginate(); // Attach the pagination method

module.exports = db;
