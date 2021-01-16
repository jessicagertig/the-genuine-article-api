/* eslint-disable prettier/prettier */
const db = require('../database/db-config');

module.exports = {
  find,
  findBy,
  findById
};

function find() {
  return db('users')
    .select('id', 'email')
    .orderBy('id');
}

function findBy(filter) {
  return db('users')
    .where(filter);
}

function findById(id) {
	return db('users')
		.select('id', 'email')
		.where({ id })
		.first();
}