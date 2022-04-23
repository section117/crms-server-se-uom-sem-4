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
			$sort: {_id: -1}
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

exports.getChatsOfCSSAWithMessages= getChatsOfCSSAWithMessages;