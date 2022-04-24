const express = require('express');
const { getExpressSessionStore } = require('./config/session-config');
const mongoose = require('mongoose');
const passport = require('passport');
const { createServer } = require('http');
const morgan = require('morgan');

require('dotenv').config();

const app = express();

// Express Incoming data Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Set up EJS
app.set('view-engine', 'ejs');
app.use(express.static('public'));

//Set up Session
app.use(getExpressSessionStore());


//Set up Database
mongoose.connect(process.env.DB_CONNECTION_STRING)
	.then(() => console.log('Connected to MongoDB...'))
	.catch(err => console.error('Could not connect to MongoDB...', err));

//Set up Passport
app.use(passport.initialize({}));
app.use(passport.session({}));

//Set Routers
const homeRouter = require('./routes/home');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const chatMessagesRouter = require('./routes/chat-messages');
app.use('/', homeRouter);
app.use('/', userRouter);
app.use('/chats', chatRouter);
app.use('/chat-messages', chatMessagesRouter);


//Set up Socket.io
const { createIO } = require('./config/socket-io/socketio-config');
const httpServer = createServer(app);
createIO(httpServer);

//Set up Logging using Morgan
if(process.env.LOG_FORMAT_MORGAN)
	app.use(morgan(process.env.LOG_FORMAT_MORGAN));

module.exports = {
	app: httpServer
};