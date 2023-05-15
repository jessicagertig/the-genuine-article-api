const db = require('../../database/db-config');

module.exports = {
  add,
  find,
  findBy,
  findById
};

function find() {
  return db('users').select('id', 'username', 'email').orderBy('id');
}

function findBy(filter) {
  return db('users').where(filter).first();
}

function findById(id) {
  return db('users')
    .select('id', 'username', 'email')
    .where({ id })
    .first();
}

async function add(user) {
  const new_user_id = await db('users').insert(user, 'id');
  const user_id = new_user_id[0].id;
  return findById(user_id);
}
