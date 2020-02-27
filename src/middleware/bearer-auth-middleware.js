'use strict';

const User = require('../auth/models/users-model.js');
require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) { next('Invalid Login - no authorization'); return; }
  let token = req.headers.authorization.split(' ').pop();

  authenticateToken(token)
    .then(user => {
      console.log('............. user found: ............');
      console.log(user);
      if (user) {
        req.user = user;
        req.capabilities = user.permissions.capabilities;
        //pulling the array of capabilities out of the virtual column
        next();
      }
    })
    .catch(err => next(err));
};

async function authenticateToken(token) {
  let tokenObject = jwt.verify(token, process.env.SECRET);
  let now = Date.now();
  if (now - tokenObject.date >= 3600000) { return Promise.reject('your token has timed out'); }
  //token lasts for 1 hour before timing out
  let result = await User.findOne({ _id: tokenObject.id });
  if (result) { 
    console.log('TOKEN OBJ: ', tokenObject);
    console.log('--------------------');
    return tokenObject; 
  }
  else {
    console.log('authenticate error bearer-auth-middle');
    return Promise.reject();
  }
}