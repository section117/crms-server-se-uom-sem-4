const chatRepository = require('../repositories/chatRepository');


const getActiveChatsOfCSSAWithMessages = async (user_id) => {
	return await chatRepository.getChatsOfCSSAWithMessages(user_id, 'ACTIVE');
};


//create a new chat
const createNewChat = async (data) => {
	return await chatRepository.initNewChats(data.name, data.email, data.title_question,data.company_id);
}

//check validity if chat
const checkValidityOfChat = async chatID => {
	return await chatRepository.findChatByID(chatID);
}

const closeChat = async (chat_id) => {
	return await chatRepository.closeChat(chat_id);
};

const markChatSeenByCSSA = async (chat_id) => {
	return await chatRepository.markChatSeenByCSSA(chat_id);
};

exports.getActiveChatsOfCSSAWithMessages = getActiveChatsOfCSSAWithMessages;
exports.closeChat = closeChat;
exports.markChatSeenByCSSA =markChatSeenByCSSA;
exports.createNewChat = createNewChat;
exports.checkValidityIfChat = checkValidityOfChat;