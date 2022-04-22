const { Chat } = require('../models/chat');

const getChatsOfCSSA = async (user_id, chat_status) => {
	let filter = {};
	if(chat_status)
		filter['status'] = chat_status;

	const chats = await Chat
		.find(filter)
		.sort({_id: -1});

	return chats;
};

exports.getChatsOfCSSA= getChatsOfCSSA;