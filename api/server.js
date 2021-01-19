require('dotenv').config();

// ----- Imports ------
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');

// ----- Router Imports -----
const authRouter = require('./auth/auth-router');
const itemsInfoRouter = require('./items-info/items-info-router');

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
server.use(logger('dev'));

// ------- Routers --------
server.use('/', authRouter);
server.use('/items', itemsInfoRouter);

// ---- Testing If Server is Live ----
server.get('/', (req, res) => {
	res.status(200).json({ api: 'up', dbenv: process.env.NODE_ENV });
});

module.exports = server;
