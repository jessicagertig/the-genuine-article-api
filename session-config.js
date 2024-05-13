const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('././database/db-config'); // Import the Knex instance

const sessionStore = new KnexSessionStore({
  knex: db,
  tablename: 'sessions', // Defaults to 'sessions'
  createtable: true,
  clearInterval: 60000
});

const sessionConfig = session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
});

module.exports = sessionConfig;
