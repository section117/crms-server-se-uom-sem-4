const {getExpressSessionStore} = require('../../session-config');
const {getUserFromSession} = require('../../../helpers/session-helper');

const createAndConfigureCSSAMessagesNamespace = (io) => {
	const cssaChatsWSNamespace = io.of('/cssa-messages');

	// convert a connect middleware to a Socket.IO middleware
	const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
	//Add Express Session Middleware
	cssaChatsWSNamespace.use(wrap(getExpressSessionStore()));

	cssaChatsWSNamespace.on('connection', (socket) => {
		console.log('A new user connected to /cssa-messages namespace with Socket ID -', socket.id);

		//Disconnect Event Listener
		socket.on('disconnect', disconnectEventListener);

		const user = getUserFromSession(socket.request.session);
		validateConnection(user, socket);

	});

	return cssaChatsWSNamespace;
};

const disconnectEventListener = (reason) => {
	console.log('A user disconnected from /cssa-messages namespace', reason);
};

const validateConnection = (user, socket) => {
	if(!(user !== null && user.user_type && user.user_type === 'CSSA'))
		socket.disconnect(true);
};

exports.createAndConfigureCSSAMessagesNamespace = createAndConfigureCSSAMessagesNamespace;