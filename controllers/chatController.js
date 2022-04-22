const chatService = require('../services/chatService');

const sessionHelper = require('../helpers/session-helper');

const viewAllChats = (req, res) => {
	res.render('chats/all-chats.ejs');
};


const getActiveChatsOfCSSA = async (req, res) => {
	const user_id = sessionHelper.getUserIDFromSession(req.session);

	if (!user_id) {
		res.code(404);
		return;
	}

	const chats = await chatService.getActiveChatsOfCSSA(user_id);

	res.json(chats);
};

exports.viewAllChats = viewAllChats;
exports.getActiveChatsOfCSSA = getActiveChatsOfCSSA;

