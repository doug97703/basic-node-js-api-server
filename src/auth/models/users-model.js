'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET;

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  role: { type: String, required: true, default: 'none', enum: ['reader', 'creator', 'editor', 'admin', 'none'] },
});

users.statics.createFromOauth = function (record) {

  if (!record) { return Promise.reject('Validation Error'); }

  return this.findOne({ username: record.username })
    .then(user => {
      if (!user) { throw new Error('User Not Found'); }
      console.log('Welcome Back', user.username);
      return user;
    })
    .catch(error => {
      console.log('Creating new user');
      let username = record.username;
      let password = 'phoneybaloney';
      let role = record.role;
      return this.create({ username, password, role });
    });

};

users.statics.authenticateBasic = function (auth) {
  let query = { username: auth.username };
  console.log(query)
  console.log(auth)
  return this.findOne(query)
    .then(user => user && user.comparePassword(auth.password))
    .catch(error => { throw error; });
};

users.methods.comparePassword = function (password) {
  console.log(password)
  console.log(this.password)
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};

users.methods.generateToken = function () {
  let token = {
    id: this._id,
    role: this.role,
    date: Date.now(),
    username: this.username,
    permissions: this.permissions,
  };

  return jwt.sign(token, SECRET);
};

users.authenticateToken = async function (token) {
  try {
    let tokenObject = jwt.verify(token, SECRET);
    let query = { username: tokenObject.username };
    if (this.findOne(query)) {
      return Promise.resolve(tokenObject);
    }
    else {
      console.log('authenticate error in users-model');
      return Promise.reject();
    }
  } catch (e) { return Promise.reject(); }
};

module.exports = mongoose.model('users', users);
