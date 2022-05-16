
const sendMessageToCSSA = (chat, chatMessage) => {
	const { emitCustomerMessageSend } = require('./cssa-chats/namespace-config');
	emitCustomerMessageSend(chat, chatMessage);
};

const sendMessageToCustomer = (chatMessage, chat_id) => {
	const { sendCSSAMessage } = require('./customer-chats/namespace-config');
	sendCSSAMessage(chatMessage, chat_id);
};

const sendCSSASeenResponseToCustomer = (chat_id, content) => {
	const { sendCSSASeenResponse } = require('./customer-chats/namespace-config');
	sendCSSASeenResponse(chat_id, content);
};

const indicateCSSATypingToCustomer = (chat_id) => {
	const {indicateTypingToCustomer } = require('./customer-chats/namespace-config');
	indicateTypingToCustomer(chat_id);
};

exports.sendMessageToCSSA = sendMessageToCSSA;
exports.sendMessageToCustomer = sendMessageToCustomer;
exports.sendCSSASeenResponseToCustomer = sendCSSASeenResponseToCustomer;
exports.indicateCSSATypingToCustomer = indicateCSSATypingToCustomer;