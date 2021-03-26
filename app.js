'use strict'

const express = require('express');
const router = require('./routes/router');

var app = express();
const simpsonsGifsRoute = require('./routes/router');

app.use(express.urlencoded({extended:false}));
app.use(express.json()); 

app.use('/', router);
app.use('/get-gif', router);

module.exports = app;