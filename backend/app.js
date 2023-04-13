const express = require('express');
const app = express();

const user = require('./routes/user');
const request = require('./routes/vacationRequest');
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routings
app.use('/api/v1', user);
app.use('/api/v1', request);

module.exports = app;
