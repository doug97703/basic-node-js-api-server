'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

//built modules
const v1 = require('./routes/v1');
const authRouter = require('./auth/router')

// Esoteric Resources
const errorHandler = require('./middleware/error.js');
const notFound = require('./middleware/404.js');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(categoryRoutes);
// app.use(productRoutes);
app.use(v1);
app.use(authRouter)

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => app.listen(port, () => console.log(`Server up on port ${port}`)),
};
