const { ChatMessage } = require('../models/chat-message');
const { Chat } = require('../models/chat');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getAllChatMessagesByChatID = async (chat_id) => {
	const chatMessages = await ChatMessage
		.find({chat_id: chat_id})
		.sort({_id: 1});

	return chatMessages;
};

const insertAChatMessage = async (message, chat_id, is_incoming) => {
	let chatMessage = new ChatMessage({
		message,
		chat_id: ObjectId(chat_id),
		is_incoming: is_incoming
	});

	try{
		chatMessage =  await chatMessage.save();
		//Update Chat timestamp
		const chat =await Chat.findOneAndUpdate({_id: ObjectId(chat_id)}, {updated_at: Date.now()}, {new: true});
		return {chatMessage, chat};
	}catch (e){
		return null;
	}

};

exports.getAllChatMessagesByChatID = getAllChatMessagesByChatID;
exports.insertAChatMessage = insertAChatMessage;