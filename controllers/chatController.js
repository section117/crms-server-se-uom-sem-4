const chatService = require('../services/chatService');

const sessionHelper = require('../helpers/session-helper');

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

exports.viewAllChats = viewAllChats;
exports.getActiveChatsOfCSSA = getActiveChatsOfCSSA;
exports.viewSavedChats=viewSavedChats;

