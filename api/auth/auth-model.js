const db = require('../../database/db-config');
const PinterestAPIService = require('../services/pinterest_api_service');

module.exports = {
  add,
  find,
  findBy,
  findById,
  destroy,
  findOauthToken,
  saveOauthToken,
  getValidAccessToken
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

async function getValidAccessToken(provider, session_id) {
  const tokenRecord = await findOauthToken(provider, session_id);
  const pinterestAPI = new PinterestAPIService();

  if (!tokenRecord) {
    throw new Error('No token found for session');
  }

  if (isTokenExpired(tokenRecord)) {
    const newAccessToken = await pinterestAPI.refreshToken(
      tokenRecord.refresh_token
    );
    // Update the token in the database
    await db('oauth_tokens')
      .where({ session_id })
      .update({ access_token: newAccessToken });
    return newAccessToken;
  } else {
    return tokenRecord.access_token;
  }
}

function isTokenExpired(tokenRecord) {
  const expiryTimestamp = calculateExpiryTime(tokenRecord);
  const nowTimestamp = Date.now(); // Corrected: Directly use Date.now()
  return nowTimestamp > expiryTimestamp;
}

function calculateExpiryTime(tokenRecord) {
  const expiryTime = new Date(tokenRecord.created_at);
  const expiresInMilliseconds = tokenRecord.expires_in * 1000; // Convert expiresIn to milliseconds
  const expiryTimestamp =
    expiryTime.getTime() + expiresInMilliseconds;
  return expiryTimestamp;
}
