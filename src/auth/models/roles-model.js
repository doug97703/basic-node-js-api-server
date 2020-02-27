'use strict';

const mongoose = require('mongoose');
const users = require('./users-model');

const roles = new mongoose.Schema({
  role: { type:String, required:true, default:'none', enum:['reader', 'creator', 'editor', 'admin', 'none']},
  capabilities: { type:Array, default:['none'] },
}, { toObject: { virtuals: true }, toJSON: { virtuals: true } });

roles.virtual('permissions', {
  ref: users,
  localField: 'role',
  foreignField: 'role',
  justOne: true,
});

module.exports = mongoose.model('roles', roles);
