
const chatMessagesRepository = require('../repositories/chatMessagesRepository');

const getAllChatMessagesByChatID = async (chat_id) => {
	return await chatMessagesRepository.getAllChatMessagesByChatID(chat_id);
};

exports.getAllChatMessagesByChatID = getAllChatMessagesByChatID;