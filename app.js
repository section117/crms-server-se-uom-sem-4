const express = require('express');
require('dotenv').config();

const app = express();

//Set up EJS
app.set('view-engine', 'ejs')
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('index.ejs');
});

module.exports = app;