const {checkValidityIfChat, addChatReview} = require('../../../services/chatService');
const { putSocket, removeSocket, getSocketsByChatID } = require('./customer-socket-store');
const {customerSendMessage} = require('../../../services/chatMessagesService');
const { sendMessageToCSSA } = require('../message-channel');

const createAndConfigureCustomerChatsNamespace = (io) => {
	const customerChatsWSNamespace = io.of('/customer-messages');

	customerChatsWSNamespace.on('connection', (socket) => {

		let chatID = socket.handshake.query.chatID;


		//Customer Message Send Listener
		socket.on('customer-send-message', async message => {
			const result = await customerSendMessage({message: message, chat_id: chatID});
			console.log('chat message: ', result);
			if(!result) {
				//TODO: callback function
				console.log('FAILED');
			}else {
				const {chatMessage, chat} = result;
				sendMessageReceivedResponse(socket, chatID, chatMessage);
				sendMessageToCSSA(chat, chatMessage);
			}
		});

		socket.on('disconnect', () => {
			removeSocket(chatID, socket);
		});

		//Add socket to the SocketStore
		putSocket(chatID, socket);

	});
};

//Emit Message Received Event Response
const sendMessageReceivedResponse = (socket, chatId, content) => {
	emitEventByChatID('customer-message-received', content, chatId, null);
};
//Emit cssa sent message to a customer
const sendCSSAMessage = (chatMessage, chat_id) => {
	emitEventByChatID('cssa-message-response', chatMessage, chat_id, null);
};

//Emit an event all the chat sockets that are listening to the chatID
const emitEventByChatID = (event_name, content, chat_id, current_socket_id) => {
	const sockets = getSocketsByChatID(chat_id);

	sockets.forEach(s => {
		if(current_socket_id && current_socket_id === s.id)
			return;
		s.emit(event_name, content);
	});
};

//Emit cssa seen response to the customer
const sendCSSASeenResponse = (chat_id, content) => {
	emitEventByChatID('cssa-seen-response', content, chat_id, null);
};

//Emit cssa typing indicator to the customer
const indicateTypingToCustomer = (chat_id) => {
	emitEventByChatID('typing-indicator-response', null, chat_id, null);
};

exports.createAndConfigureCustomerChatsNamespace = createAndConfigureCustomerChatsNamespace;
exports.sendCSSAMessage = sendCSSAMessage;
exports.sendCSSASeenResponse = sendCSSASeenResponse;
exports.indicateTypingToCustomer = indicateTypingToCustomer;
