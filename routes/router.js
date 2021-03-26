const express = require('express');
const controller = require('../controllers/controller');
var api = express.Router();

api.get('/', controller.home);
api.post('/get-gif', controller.getGifs);

module.exports = api;