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

	const chats = await chatService.getActiveChatsOfCSSAWithMessages(user_id);

	res.json(chats);
};

//create a new chat

//TODO: validate the http req
const createNewChat = async (req, res) => {

	const newChat = await chatService.createNewChat(req.body);
	console.log(newChat, "hello")
	if(!newChat) return res.status(202).send({data: null, status: "Failed"})
	res.status(200).send({data: newChat, status:"Successfully added"})
}

exports.viewAllChats = viewAllChats;
exports.getActiveChatsOfCSSA = getActiveChatsOfCSSA;
exports.createNewChat = createNewChat;

