require('dotenv').config();

// ----- Imports ------
const express = require('express');
const cors = require('cors');

// ----- Set up server ------
const server = express();

// ----- Middleware ------
server.use(express.json());
server.use(
  cors({
    origin: ['http://localhost:4000'],
  })
);

// ---- Testing If Server is Live ----
server.get('/', (req, res) => {
  res.status(200).json({ api: 'up', dbenv: process.env.NODE_ENV });
});

module.exports = server;
