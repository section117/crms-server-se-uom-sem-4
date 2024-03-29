const chatService = require('../services/chatService');
const { chatValidateSchema, reviewValidateSchema, closeChatValidateSchema } = require('../helpers/validate-schema');
const sessionHelper = require('../helpers/session-helper');
const { emitCustomerCloseChatResponse } = require('../config/socket-io/cssa-chats/namespace-config');

const viewAllChats = (req, res) => {
	res.render('chats/all-chats.ejs');
};

const viewArchivedChats = async (req, res) => {
	const current_user = sessionHelper.getUserFromSession(req.session);
	const company_id = sessionHelper.getCompanyIDFromSession(req.session);
	let chats = [];
	
	if (current_user.user_type === 'COMPANY_OWNER') {
		chats = await chatService.getAllChats(company_id,null);
	}else{
		const cssa_id = current_user.id;
		chats = await chatService.getAllChats(company_id,cssa_id);

	}

	res.render('chats/saved-chats.ejs', { chats: chats });
};



const getActiveChatsOfCSSA = async (req, res) => {
	const user_id = sessionHelper.getUserIDFromSession(req.session);

	if (!user_id) {
		res.code(404);
		return;
	}

	const chats = await chatService.getActiveChatsOfCSSAWithMessages(user_id);

	res.json(chats);
};

//create a new chat
const createNewChat = async (req, res) => {

	//validate request body
	const { error, value } = chatValidateSchema.validate(req.body, { abortEarly: false });
	if (error) return res.status(202).json({ status: 'Failed', data: error.details[0].message });

	const chatData = await chatService.createNewChat(value);

	if (!chatData.chat) return res.status(202).json({ status: 'Failed', data: chatData.error });
	res.status(200).send({ status: 'Successfully added', data: chatData });
};

//add review to a closed chat
const addChatReview = async (req, res) => {

	// console.log('chat review', req.body);

	//validate request body
	const { error, value } = reviewValidateSchema.validate(req.body, { abortEarly: false });
	if (error) return res.status(202).json({ status: 'Failed', data: error.details[0].message });

	const review = await chatService.addChatReview(value);

	// console.log('review here', review);
	if (!review) return res.status(202).send({ data: null, status: 'Failed' });
	res.status(200).send({ data: review, status: 'Successfully added' });
};

const closeChat = async (req, res) => {

	//validate request body
	const { error, value } = closeChatValidateSchema.validate(req.body, { abortEarly: false });
	if (error) return res.status(202).json({ status: 'Failed', data: error.details[0].message });

	const chat = await chatService.closeChat(value.chat_id);
	if (!chat) return res.status(202).send({ data: null, status: 'Failed' });

	const response = {
		chat_id: chat._id,
		'status': 'OK'
	};
	emitCustomerCloseChatResponse(response, chat.assigned_cssa);
	res.status(200).send({ data: chat, status: 'Successfully Closed' });
};

exports.viewAllChats = viewAllChats;
exports.getActiveChatsOfCSSA = getActiveChatsOfCSSA;
exports.viewArchivedChats = viewArchivedChats;
exports.createNewChat = createNewChat;
exports.addChatReview = addChatReview;
exports.closeChat = closeChat;

