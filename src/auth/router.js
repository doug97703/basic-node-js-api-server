'use strict';
require('dotenv').config();
const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt')

const path = require('path');
const indexPath = path.join(__dirname, '../public');
authRouter.use('/', express.static(indexPath));

const bearerAuth = require('../middleware/bearer-auth-middleware');
const User = require('./models/users-model');
const auth = require('./middleware.js');
const oauth = require('./oauth/github.js');


authRouter.get('/hello', (req, res, next) => {
  res.send('hello');
});

authRouter.post('/signup', async (req, res, next) => {
  req.body.password = await bcrypt.hash(req.body.password, 4)
  let user = await new User(req.body);
  let saved = await user.save();

  User.findOne({username: saved.username})
    .then((user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    }).catch(next);
});

authRouter.post('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

authRouter.get('/oauth', async (req, res, next) => {
  let token = await oauth(req, res, next);
  res.status(200).send(token);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  let allUser = await User.find({});
  let data = {
    currentUser: req.user,
    otherUsers: allUser,
  };
  res.status(200).send(data);
});

module.exports = authRouter;