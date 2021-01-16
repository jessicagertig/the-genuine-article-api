require('dotenv').config();

// ----- Imports ------
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// ----- Router Imports -----
const authRouter = require('./auth/auth-router');

// ----- Set up server ------
const server = express();

// ----- Middleware ------
server.use(helmet());
server.use(express.json());
server.use(
	cors({
		origin: ['http://localhost:4000']
	})
);

// ------- Routers --------
server.use('/', authRouter);

// ---- Testing If Server is Live ----
server.get('/', (req, res) => {
	res.status(200).json({ api: 'up', dbenv: process.env.NODE_ENV });
});

module.exports = server;
