const chatMessagesService = require('../services/chatMessagesService');

const getAllChatMessages = async (req, res) => {
	const chat_id = req.params.chat_id;

	const chatMessages = await chatMessagesService.getAllChatMessagesByChatID(chat_id);

	res.json(chatMessages);

};

exports.getAllChatMessages = getAllChatMessages;