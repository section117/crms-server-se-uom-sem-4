const chatRepository = require('../repositories/chatRepository');


const getActiveChatsOfCSSAWithMessages = async (user_id) => {
	return await chatRepository.getChatsOfCSSAWithMessages(user_id, 'ACTIVE');
};

//create a new chat
const createNewChat = async (data) => {
	return await  chatRepository.initNewChats(data.name, data.email, data.title_ques,data.company_id);
}

//check validity if chat
const checkValidityOfChat = async chatID => {
	return await chatRepository.findChatByID(chatID);
}

exports.getActiveChatsOfCSSAWithMessages = getActiveChatsOfCSSAWithMessages;
exports.createNewChat = createNewChat;
exports.checkValidityIfChat = checkValidityOfChat;