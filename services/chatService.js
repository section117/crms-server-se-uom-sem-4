const chatRepository = require('../repositories/chatRepository');

const getActiveChatsOfCSSAWithMessages = async (user_id) => {
	return await chatRepository.getChatsOfCSSAWithMessages(user_id, 'ACTIVE');
};


const getClosedChatsOfCSSAWithMessages = async (user_id) => {
	return await chatRepository.getChatsOfCSSAWithMessages(user_id, 'CLOSED');
};
//create a new chat


const createNewChat = async (data) => {
	return await chatRepository.initNewChats(data.name, data.email, data.title_question, data.company_id);
};
//check validity if chat

const checkValidityOfChat = async chatID => {
	return await chatRepository.findChatByID(chatID);
};
const closeChat = async (chat_id) => {
	return await chatRepository.closeChat(chat_id);
};

const markChatSeenByCSSA = async (chat_id) => {
	return await chatRepository.markChatSeenByCSSA(chat_id);
};

const getAllChats = async (company_id,cssa_id) => {
	return await cssa_id ? chatRepository.getAllChats(company_id,cssa_id) : chatRepository.getAllChats(company_id);
};

const getAllmsgs = async (company_id) => {
	return await chatRepository.getAllmsgs(company_id);
};

const addChatReview= async (data) => {
	return await chatRepository.updateChatWithCustomerReview(data.chat_id, data.customer_review);
};

const getPositiveFeedbackForCSSA = async (user_id) => {
	return await chatRepository.getReviewsForCSSA(user_id, true);
};

const getNegativeFeedbackForCSSA = async (user_id) => {
	return await chatRepository.getReviewsForCSSA(user_id, false);
};
const getCurrentMonthChats = async (company_id) => {
	return await chatRepository.getCurrentMonthChats(company_id);
};

const getCurrentMonthPositiveFeedback = async (company_id) => {
	return await chatRepository.getCurrentMonthFeedback(company_id, true);
};
const getCurrentMonthNegativeFeedback = async (company_id) => {
	return await chatRepository.getCurrentMonthFeedback(company_id, false);
};

const getPositiveFeedbackForCompany = async (company_id) => {
	return await chatRepository.getReviewsForCompany(company_id, true);
};

const getNegativeFeedbackForCompany = async (company_id) => {
	return await chatRepository.getReviewsForCompany(company_id, false);
};

const getResolvedFeedbackForCSSA = async (user_id) => {
	return await chatRepository.getResolvedFeedbackForCSSA(user_id);
};

const getAllChatDetails = async (company_id) => {
	return await chatRepository.getAllChatDetails(company_id);
};

const getResolvedFeedbackForCompany = async (company_id) => {
	return await chatRepository.getResolvedFeedbackForCompany(company_id);
};



exports.getActiveChatsOfCSSAWithMessages = getActiveChatsOfCSSAWithMessages;
exports.getCloseChatsOfCSSAWithMessages = getClosedChatsOfCSSAWithMessages;
exports.closeChat = closeChat;
exports.markChatSeenByCSSA =markChatSeenByCSSA;
exports.getAllChats=getAllChats;
exports.getAllmsgs=getAllmsgs;
exports.createNewChat = createNewChat;
exports.checkValidityIfChat = checkValidityOfChat;
exports.addChatReview = addChatReview;
exports.getPositiveFeedback = getPositiveFeedbackForCSSA;
exports.getNegativeFeedback = getNegativeFeedbackForCSSA;
exports.getCurrentMonthChats = getCurrentMonthChats;
exports.getCurrentMonthPositiveFeedback = getCurrentMonthPositiveFeedback;
exports.getCurrentMonthNegativeFeedback = getCurrentMonthNegativeFeedback;
exports.getPositiveFeedbackForCompany = getPositiveFeedbackForCompany;
exports.getNegativeFeedbackForCompany = getNegativeFeedbackForCompany;
exports.getResolvedFeedbackForCSSA = getResolvedFeedbackForCSSA;
exports.getAllChatDetails = getAllChatDetails;
exports.getResolvedFeedbackForCompany = getResolvedFeedbackForCompany;
