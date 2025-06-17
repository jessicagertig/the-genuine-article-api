require('dotenv').config();

const database_name = process.env.DB_NAME;
const database_user = process.env.DB_USER;
const database_password = process.env.DB_PASSWORD;
const database_testing_name = process.env.DB_TESTING_NAME;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: database_name,
      user: database_user,
      password: database_password
    },
    migrations: {
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'
    },
    useNullAsDefault: true
  },

  testing: {
    client: 'pg',
    connection: {
      database: database_testing_name,
      user: database_user,
      password: database_password
    },
    migrations: {
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    },
    migrations: {
      directory: './database/migrations',
      loadExtensions: ['.js'],
      transactionMode: 'none'
    },
    seeds: {
      directory: './database/seeds'
    },
    useNullAsDefault: true
  }
};
