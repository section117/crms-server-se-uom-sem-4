const chatService = require('../services/chatService');

const sessionHelper = require('../helpers/session-helper');
const {emitCustomerCloseChatResponse} = require('../config/socket-io/cssa-chats/namespace-config');

const viewAllChats = (req, res) => {
	res.render('chats/all-chats.ejs');
};

const viewSavedChats =async (req, res) => {
	const chat= await chatService.getAllChats();
	const msgs=await chatService.getAllmsgs();
	// console.log(msgs[0].chat_id.toString());
	res.render('chats/saved-chats.ejs',{ chats: chat , msgs: msgs});
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

//TODO: validate the http req
const createNewChat = async (req, res) => {

	const newChat = await chatService.createNewChat(req.body);
	if(!newChat) return res.status(202).send({data: null, status: 'Failed'});
	res.status(200).send({data: newChat, status:'Successfully added'});
};
const addChatReview = async (req, res) => {
	const review = await chatService.addChatReview(req.body);
	if(!review) return res.status(202).send({data: null, status: 'Failed'});
	res.status(200).send({data: review, status:'Successfully added'});
};

const closeChat = async (req, res) => {
	const chat = await chatService.closeChat(req.body.chat_id);
	if(!chat) return res.status(202).send({data: null, status: 'Failed'});

	const response = {
		chat_id: chat._id,
		'status': 'OK'
	};
	emitCustomerCloseChatResponse(response, chat.assigned_cssa);
	res.status(200).send({data: chat, status:'Successfully Closed'});
};

exports.viewAllChats = viewAllChats;
exports.getActiveChatsOfCSSA = getActiveChatsOfCSSA;
exports.viewSavedChats=viewSavedChats;
exports.createNewChat = createNewChat;
exports.addChatReview = addChatReview;
exports.closeChat = closeChat;

