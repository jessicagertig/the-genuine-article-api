const db = require('../../database/db-config');

module.exports = {
  add,
  find,
  findBy,
  findById,
  destroy
};

function find() {
  return db('users')
    .select('id', 'username', 'email', 'role')
    .orderBy('id');
}

function findBy(filter) {
  return db('users').where(filter).first();
}

function findById(id) {
  return db('users')
    .select('id', 'username', 'email', 'role')
    .where({ id })
    .first();
}

async function add(user) {
  const new_user_id = await db('users').insert(user, 'id');
  const user_id = new_user_id[0].id;
  return findById(user_id);
}

async function destroy(id) {
  console.log('ID', id);
  return db('users').where({ id }).del();
}
