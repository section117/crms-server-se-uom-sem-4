const express = require('express');
require('dotenv').config();

const app = express();

//Set up EJS
app.set('view-engine', 'ejs');
app.use(express.static('public'));

//Set Routers
const homeRouter = require('./routes/home');
app.use('/', homeRouter);


module.exports = app;