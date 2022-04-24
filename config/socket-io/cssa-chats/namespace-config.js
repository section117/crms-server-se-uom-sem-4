const {getExpressSessionStore} = require('../../session-config');
const {getUserFromSession, getUserIDFromSession} = require('../../../helpers/session-helper');
const { putSocket, removeSocket, getSocketsByUserID } = require('./cssa-socket-store');
const { cssaSendMessage } = require('../../../services/chatMessagesService');

const createAndConfigureCSSAMessagesNamespace = (io) => {
	const cssaChatsWSNamespace = io.of('/cssa-messages');

	// convert a connect middleware to a Socket.IO middleware
	const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
	//Add Express Session Middleware
	cssaChatsWSNamespace.use(wrap(getExpressSessionStore()));

	cssaChatsWSNamespace.on('connection', (socket) => {
		console.log('A new user connected to /cssa-messages namespace with Socket ID -', socket.id);

		//Disconnect Event Listener
		socket.on('disconnect', firstDisconnectEventListener);

		const user = getUserFromSession(socket.request.session);
		const user_id = getUserIDFromSession(socket.request.session);
		validateConnection(user, socket);

		//Register additional Event Listeners
		socket.on('disconnect', (reason) => {
			secondDisconnectEventListener(reason, user_id, socket.id);
		});

		socket.on('cssa-message-send', async (arg, callback) => {
			const result = await cssaSendMessage(arg);
			if(!result) {
				callback({status: 'FAILED'});
				return;
			}
			const { chatMessage, chat } = result;
			callback({status: 'OK', chatMessage, chat});
			emitCSSASendMessageResponse(chatMessage, chat, user_id, socket.id);
		});

		//Add socket to the SocketStore
		putSocket(user_id, socket);
	});

	return cssaChatsWSNamespace;
};

//Event Listeners
const firstDisconnectEventListener = (reason) => {
	console.log('A user disconnected from /cssa-messages namespace', reason);
};

const secondDisconnectEventListener = (reason, user_id, socket_id) => {
	console.log('A user disconnected from /cssa-messages namespace', reason, 'with User ID -', user_id);
	removeSocket(user_id, socket_id);
};



//Event Emitters
const emitEventByUserID = (event_name, content, user_id, current_socket_id) => {
	const sockets = getSocketsByUserID(user_id);

	sockets.forEach((s) => {
		if(current_socket_id && current_socket_id === s.id)
			return;
		s.emit(event_name, content);
	});
};

const emitCSSASendMessageResponse = (chatMessage, chat, user_id, current_socket_id) => {
	emitEventByUserID('cssa-message-send-response', {chatMessage, chat}, user_id, current_socket_id);
};

const validateConnection = (user, socket) => {
	if(!(user !== null && user.user_type && user.user_type === 'CSSA'))
		socket.disconnect(true);
};

exports.createAndConfigureCSSAMessagesNamespace = createAndConfigureCSSAMessagesNamespace;