const { ChatMessage } = require('../models/chat-message');

const getAllChatMessagesByChatID = async (chat_id) => {
	const chatMessages = await ChatMessage
		.find({chat: chat_id})
		.sort({_id: 1});

	return chatMessages;
};

exports.getAllChatMessagesByChatID = getAllChatMessagesByChatID;