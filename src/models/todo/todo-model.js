'use strict';

const Model = require('../mongo.js');
const schema = require('./todo-schema.js');

/**
 * Class representing a Product.
 * @extends Model
 */
class ToDo extends Model {
  constructor(schema) { super(schema); }
}

module.exports = new ToDo(schema);
