
const chatMessagesRepository = require('../repositories/chatMessagesRepository');

const getAllChatMessagesByChatID = async (chat_id) => {
	return await chatMessagesRepository.getAllChatMessagesByChatID(chat_id);
};

//SocketIO Emitters
const cssaSendMessage = async (data) => {
	const chatMessage = await chatMessagesRepository.insertAChatMessage(data.message, data.chat_id);
	return chatMessage;
};

exports.getAllChatMessagesByChatID = getAllChatMessagesByChatID;
exports.cssaSendMessage = cssaSendMessage;