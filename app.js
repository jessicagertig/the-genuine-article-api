require('dotenv').config();

// ----- Imports ------
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');

// ----- Router Imports -----
const authRouter = require('./api/auth/auth-router');
const itemsRouter = require('./api/items/items-router');
const itemsInfoRouter = require('./api/items-info/items-info-router');
const itemsImagesRouter = require('./api/items-images/items-images-router');
const itemsColorsRouter = require('./api/items-colors/items-colors-router');
const itemsMaterialsRouter = require('./api/items-materials/items-materials-router');

// ----- Set up server ------
const app = express();

// ----- Middleware ------
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(logger('dev'));

// ------- Routers --------
app.use('/auth', authRouter);
app.use('/items', itemsRouter);
app.use('/items-info', itemsInfoRouter);
app.use('/images', itemsImagesRouter);
app.use('/items-colors', itemsColorsRouter);
app.use('/items-materials', itemsMaterialsRouter);

// ---- Testing If Server is Live ----
app.get('/', (req, res) => {
  res.status(200).json({ api: 'up', dbenv: process.env.NODE_ENV });
});

module.exports = app;
