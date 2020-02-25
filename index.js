'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

const mongooseOptions = {
  useNewUrlParser:true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

let mongooseURL = process.env.MONGOLAB_YELLOW_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/todo'

mongoose.connect(mongooseURL, mongooseOptions)
  .then(connected => console.log('mongoose connected', connected.options));

require('./src/app.js').start(process.env.PORT);
