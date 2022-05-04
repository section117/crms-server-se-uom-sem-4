
const sendMessageToCSSA = (chat, chatMessage) => {
	const { emitCustomerMessageSend } = require('./cssa-chats/namespace-config');
	emitCustomerMessageSend(chat, chatMessage);
};

const sendMessageToCustomer = (chatMessage, chat_id) => {
	const { sendCSSAMessage } = require('./customer-chats/namespace-config');
	sendCSSAMessage(chatMessage, chat_id);
};

exports.sendMessageToCSSA = sendMessageToCSSA;
exports.sendMessageToCustomer = sendMessageToCustomer;
