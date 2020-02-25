'use strict';

const express = require('express');
const router = express.Router();

const todo = require('../models/todo/todo-model');

function getModel(req, res, next) {
  let model = req.params.model;
  switch (model) {
  case 'todo':
    req.model = todo;
    next();
    return;
  default:
    next('no data available for that model');
    return;
  }
}

router.param('model', getModel);

// Route Definitions
router.get('/api/v1/:model', handleGetAll);
router.post('/api/v1/:model', handlePost);
router.put('/api/v1/:model/:id', handlePut);
router.get('/api/v1/:model/:id', handleGetOne);
router.delete('/api/v1/:model/:id', handleDelete);

// Route Handlers
function handleGetAll(req, res, next) {
  req.model.get()
    .then(results => {
      let count = results.length;
      res.json({ count, results });
    })
    .catch(next);
}

function handleGetOne(req, res, next) {
  let id = req.params.id;
  req.model.get(id)
    .then(record => res.json(record))
    .catch(next);
}

function handleDelete(req, res, next) {
  let id = req.params.id;
  req.model.delete(id)
    .then(record => res.json(record))
    .catch(next);
}

function handlePut(req, res, next) {
  let id = req.params.id;
  let body = req.body;
  req.model.update(id, body)
    .then(record => res.json(record))
    .catch(next);
}

function handlePost(req, res, next) {
  console.log(req.body)
  req.model.create(req.body)
    .then(result => res.json(result))
    .catch(next);
}


module.exports = router;
