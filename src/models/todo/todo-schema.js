'use strict';
const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
  text: { type: String },
  _id: { type: String },
  assignee: { type: String },
  complete: { type: Boolean },
  difficulty: { type: String, enum: ['1', '2', '3', '4', '5'] },
  due: { type: String }
});

module.exports = mongoose.model('todo', todoSchema);
