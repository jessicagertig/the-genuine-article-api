const db = require('../../database/db-config');

module.exports = {
  add,
  find,
  findBy,
  findById,
  destroy,
  findOauthToken,
  saveOauthToken
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

async function findOauthToken(provider, session_id) {
  return db('oauth_tokens')
    .where({ session_id })
    .where({ provider })
    .first();
}

async function saveOauthToken(data, provider, session_id) {
  console.log('Oauth save data', { data, provider, session_id });
  const { access_token, refresh_token, expires_in } = data;
  const new_record = {
    provider,
    session_id,
    access_token,
    refresh_token,
    expires_in
  };
  const inserted_record = await db('oauth_tokens')
    .insert(new_record)
    .returning('*');
  return inserted_record;
}
