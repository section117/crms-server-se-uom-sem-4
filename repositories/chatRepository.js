const { Chat } = require('../models/chat');
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

const closeChat = async (chat_id) => {
	try{
		const chat = Chat.findOneAndUpdate({_id: ObjectId(chat_id)}, {status: 'CLOSED'}, {new: true});
		return chat;
	} catch (e) {
		return null;
	}

};

exports.getChatsOfCSSAWithMessages= getChatsOfCSSAWithMessages;
exports.closeChat = closeChat;