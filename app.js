const express = require('express');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Express Incoming data Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Set up EJS
app.set('view-engine', 'ejs');
app.use(express.static('public'));

//Set up Session
let session_config = {
	secret: process.env.SESSION_SECRET,
	cookie: {
		sameSite: 'lax',
	},
	resave: false,
	saveUninitialized: false
};
if (process.env.NODE_ENV === 'production'){
	session_config.cookie.secure = true;
} else if (process.env.NODE_ENV === 'development'){

}
app.use(session(session_config));

//Set Routers
const homeRouter = require('./routes/home');
app.use('/', homeRouter);


module.exports = app;