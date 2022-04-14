const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const mongoose = require('mongoose');

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
	//Set Session Store to FileStore instead of MemoryStore
	session_config.store = new FileStore({});
}
app.use(session(session_config));

//Set up Database
mongoose.connect(process.env.DB_CONNECTION_STRING)
	.then(() => console.log('Connected to MongoDB...'))
	.catch(err => console.error('Could not connect to MongoDB...', err));

//Set Routers
const homeRouter = require('./routes/home');
app.use('/', homeRouter);

module.exports = app;