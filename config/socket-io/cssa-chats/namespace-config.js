const {getExpressSessionStore} = require('../../session-config');
const {getUserFromSession, getUserIDFromSession} = require('../../../helpers/session-helper');
const { putSocket, removeSocket, getSocketsByUserID } = require('./cssa-socket-store');
const { cssaSendMessage } = require('../../../services/chatMessagesService');
const { toggleCSSAOnlineStatus } = require('../../../services/userService');
const { closeChat, markChatSeenByCSSA } = require('../../../services/chatService');
const { sendMessageToCustomer, sendCSSASeenResponseToCustomer, indicateCSSATypingToCustomer,
	sendCSSAToggleOnlineStatusResponseToCustomer, cssaCloseChatResponseToCustomer
} = require('../message-channel');

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
			sendMessageToCustomer(chatMessage, chat._id);
		});

		socket.on('cssa-toggle-online-status', async (arg) => {
			let { is_online, user_id, active_chat_ids } = arg;
			const user = await toggleCSSAOnlineStatus(user_id, is_online);
			if(!user)
				is_online = !is_online;
			emitCSSAoggleOnlineStatusResponse(is_online, user_id);
			sendCSSAToggleOnlineStatusResponseToCustomer(is_online, active_chat_ids);

		});

		socket.on('cssa-close-chat', async (arg) => {
			const {chat_id} = arg;
			const result = await closeChat(chat_id);
			let response = {
				chat_id
			};
			if(result)
				response['status'] = 'OK';
			else response['status'] = 'FAILED';
			emitCSSACloseChatResponse(response, user_id);
			cssaCloseChatResponseToCustomer(response, chat_id);
		});

		socket.on('cssa-chat-seen', async (arg) => {
			const {chat_id} = arg;
			const newChat = await markChatSeenByCSSA(chat_id);
			if(newChat) {
				emitCSSAChatSeenResponse({chat: newChat, status: 'OK'}, user_id, socket.id);
				sendCSSASeenResponseToCustomer(chat_id, {chat: newChat, is_seen: true});
			}
		});

		socket.on('cssa-typing-indicator-publish', (arg) => {
			console.log('arg in typing indicator',arg);
			indicateCSSATypingToCustomer(arg.chat_id);
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

const emitCSSAoggleOnlineStatusResponse = (is_online, user_id) => {
	emitEventByUserID('cssa-toggle-online-status-response', {is_online}, user_id, null);
};

const emitCSSACloseChatResponse = (response, user_id) => {
	emitEventByUserID('cssa-close-chat-response', response, user_id, null);
};

//customer close chat response emitter
const emitCustomerCloseChatResponse = (response, user_id) => {
	emitEventByUserID('customer-close-chat-response', response, user_id, null);
};

const emitCSSAChatSeenResponse = (content, user_id, current_socket_id) => {
	emitEventByUserID('cssa-chat-seen-response', content, user_id, current_socket_id);
};

const emitCustomerMessageSend = (chat, chatMessage) => {
	emitEventByUserID('customer-message-send', {chatMessage, chat}, chat.assigned_cssa, null);
};

const validateConnection = (user, socket) => {
	if(!(user !== null && user.user_type && user.user_type === 'CSSA'))
		socket.disconnect(true);
};

exports.createAndConfigureCSSAMessagesNamespace = createAndConfigureCSSAMessagesNamespace;
exports.emitCustomerMessageSend = emitCustomerMessageSend;
exports.emitCustomerCloseChatResponse = emitCustomerCloseChatResponse;