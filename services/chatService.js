const chatRepository = require('../repositories/chatRepository');


const getActiveChatsOfCSSAWithMessages = async (user_id) => {
	return await chatRepository.getChatsOfCSSAWithMessages(user_id, 'ACTIVE');
};

const closeChat = async (chat_id) => {
	return await chatRepository.closeChat(chat_id);
};

const markChatSeenByCSSA = async (chat_id) => {
	return await chatRepository.markChatSeenByCSSA(chat_id);
};

exports.getActiveChatsOfCSSAWithMessages = getActiveChatsOfCSSAWithMessages;
exports.closeChat = closeChat;
exports.markChatSeenByCSSA =markChatSeenByCSSA;