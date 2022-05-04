const {checkValidityIfChat} = require('../../../services/chatService');
const { putSocket, removeSocket, getSocketsByChatID } = require('./customer-socket-store');
const {customerSendMessage} = require('../../../services/chatMessagesService');
const { sendMessageToCSSA } = require('../message-channel');

const createAndConfigureCustomerChatsNamespace = (io) => {
	const customerChatsWSNamespace = io.of('/customer-messages');

	customerChatsWSNamespace.on('connection', (socket) => {

		let chatID = socket.handshake.query.chatID;



		//get Chat ID & validate
		// socket.on('send-chat-id', async (chatID) => {
		// 	console.log('socket-id : ', socket.id);
		// 	const chat = await checkValidityIfChat(chatID);
		// 	if(!chat) {
		// 		//TODO: callback function
		// 		console.log("chat is not available");
		// 	}else{
		// 		console.log("chat is available");
		// 	}
		//
		// });


		//Customer Message Send Listener
		socket.on('customer-send-message', async message => {
			console.log(message);
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

		//Add socket to the SocketStore
		putSocket(chatID, socket);


		/*
		* message recived
		* update database
		* emit message to all customer sockets
		* emit message to all relevant cssa sockets
		* */

	});
};

//Emit Message Received Event Response
/*
* Get all sockets of customer with chat ID
* Emit to all sockets with a for each
 */
const sendMessageReceivedResponse = (socket, chatId, content) => {
	emitEventByChatID('customer-message-received', content, chatId, null);
};

const sendCSSAMessage = (chatMessage, chat_id) => {
	emitEventByChatID('cssa-message-response', chatMessage, chat_id, null);
};

const emitEventByChatID = (event_name, content, chat_id, current_socket_id) => {
	const sockets = getSocketsByChatID(chat_id);

	sockets.forEach(s => {
		if(current_socket_id && current_socket_id === s.id)
			return;
		s.emit(event_name, content);
	});
};

exports.createAndConfigureCustomerChatsNamespace = createAndConfigureCustomerChatsNamespace;
exports.sendCSSAMessage = sendCSSAMessage;