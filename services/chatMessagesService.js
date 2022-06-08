
const chatMessagesRepository = require('../repositories/chatMessagesRepository');

const getAllChatMessagesByChatID = async (chat_id) => {
	return await chatMessagesRepository.getAllChatMessagesByChatID(chat_id);
};

//SocketIO Emitters
const cssaSendMessage = async (data) => {
	const chatMessage = await chatMessagesRepository.insertAChatMessage(data.message, data.chat_id, false);
	return chatMessage;
};

const customerSendMessage = async (data) => {
	console.log("in-service layer for insert a new message")
	return await chatMessagesRepository.insertAChatMessage(data.message, data.chat_id, true);
}

exports.getAllChatMessagesByChatID = getAllChatMessagesByChatID;
exports.cssaSendMessage = cssaSendMessage;
exports.customerSendMessage = customerSendMessage;