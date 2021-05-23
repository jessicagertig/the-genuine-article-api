const db = require('../../database/db-config')

module.exports = {
  add,
  find,
  findBy,
  findById
}

function find() {
  return db('users').select('id', 'username', 'email').orderBy('id')
}

function findBy(filter) {
  return db('users').where(filter)
}

function findById(id) {
  return db('users')
    .select('id', 'username', 'email')
    .where({ id })
    .first()
}

async function add(user) {
  const [id] = await db('users').insert(user, 'id')

  return findById(id)
}
