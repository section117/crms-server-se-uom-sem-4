const { Chat } = require('../models/chat');
const { User } = require('../models/user');
const { ChatMessage } = require('../models/chat-message');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getChatsOfCSSAWithMessages = async (user_id, chat_status) => {
	const chats = await Chat.aggregate([
		{
			$match: {
				$and: [ {status: chat_status}, {assigned_cssa: ObjectId(user_id) } ]
			}
		},
		{
			$sort: {updated_at: -1}
		},
		{
			$lookup: {
				from: ChatMessage.collection.name,
				localField: '_id',
				foreignField: 'chat_id',
				as: 'chat_messages',
			},
		}
	]).exec();

	return chats;
};

//assign a CSSA to a chat
const assignCSSA = async (company_id) => {
	try {
		return await User.findOne(
			{
				$and: [{user_type: "CSSA"}, {is_online: true}, {company: ObjectId(company_id)}]
			},
			{
				_id: 1
			}
		);
	}catch (err) {
		console.log(err)
		return null
	}
}

//create new chat
const initNewChat = async (customer_name, customer_email, title_ques, company_id) => {

	//get available CSSA
	const cssa = await assignCSSA(company_id);

	console.log("here", cssa)

	if(!cssa) {
		return null
	}

	//create new chat
	const chat = new Chat({
		customer_name: customer_name,
		customer_email: customer_email,
		title_question: title_ques,
		company: ObjectId(company_id),
		assigned_cssa: cssa._id,
		status: "ACTIVE",
		updated_at: new Date()
	});

	console.log("before saving", chat)

	return await chat.save();
}
//check if a given chat is available
const findChatByID = async chatID => {
	return await Chat.find({_id : chatID});
}
exports.getChatsOfCSSAWithMessages= getChatsOfCSSAWithMessages;
exports.initNewChats = initNewChat;
exports.findChatByID = findChatByID;
