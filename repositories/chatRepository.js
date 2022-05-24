const { Chat } = require('../models/chat');
const { User } = require('../models/user');
const { ChatMessage } = require('../models/chat-message');
const mongoose = require('mongoose');
const {Company} = require('../models/company');
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

//company validation
const validateCompany = async (company_id) => {
	try {
		return await Company.findOne({_id: ObjectId(company_id)});
	}catch (e){
		return null;
	}
};


//assign a CSSA to a chat
const assignCSSA = async (company_id) => {
	console.log('company id', company_id);
	try {
		return await User.findOne(
			{
				$and: [{user_type: 'CSSA'}, {is_online: true}, {company: ObjectId(company_id)}]
			},
			{
				_id: 1,
				first_name: 1,
				last_name: 1,
				email: 1,
				profile_pic: 1,
				company: 1,
				is_online: 1,
			}
		);
	}catch (err) {
		console.log(err);
		return null;
	}
};

//choose random CSSA for chat
const assignRandomCSSA = async (company_id) => {
	try{
		return await User.aggregate([
			{
				$match: {
					$and: [{user_type: 'CSSA'}, {is_online: true}, {company: ObjectId(company_id)}]
				}
			},
			{
				$sample: {size: 1}
			}
		]);
	}catch (e) {
		console.log(e);
		return null;
	}

};

//create new chat
const initNewChat = async (customer_name, customer_email, title_ques, company_id) => {
	//check if company exists
	const company = await validateCompany(company_id);
	if(!company){
		return {error: 'NO_COMPANY', chat: null};
	}

	//get available CSSA
	const cssa = await assignCSSA(company_id);


	//choose random cssa ---------------------------------------------------

	// const cssaList = await assignRandomCSSA(company_id);
	// if(cssaList.length === 0){
	// 	return {error: 'NO_CSSA', chat: null};
	// }
	// const cssa = cssaList[0];

	//----------------------------------------------------------------------


	if(!cssa) {
		return {error: 'NO_CSSA', chat: null};
	}

	//create new chat
	const chat = new Chat({
		customer_name: customer_name,
		customer_email: customer_email,
		title_question: title_ques,
		company: ObjectId(company_id),
		assigned_cssa: cssa._id,
		status: 'ACTIVE',
		updated_at: new Date(),
		is_seen_by_cssa: false,
	});

	console.log('chat', chat);

	try {
		const newChat = await chat.save();
		return {chat: newChat, cssa: cssa};
	} catch (err) {
		console.log(err);
		return {error: 'ERROR_CREATING_CHAT', chat: null};
	}

};
//check if a given chat is available
const findChatByID = async chatID => {
	return await Chat.find({_id : chatID});
};


const closeChat = async (chat_id) => {
	try{
		const chat = await Chat.findOneAndUpdate({_id: ObjectId(chat_id)}, {status: 'CLOSED'}, {new: true});
		return chat;
	} catch (e) {
		return null;
	}

};

const markChatSeenByCSSA = async (chat_id) => {
	try {
		const chat = await Chat.findOneAndUpdate({_id: ObjectId(chat_id)}, {is_seen_by_cssa: true}, {new: true});
		return chat;
	}catch (e){
		return null;
	}
};


const getAllChats = async () => {
	try {
		const chat = await Chat.find();
		return chat;
	}catch (e){

	}
};

//update chat with customer review
const updateChatWithCustomerReview = async (chat_id, customer_review) => {
	const review = {
		is_resolved: customer_review.is_resolved,
		is_satisfied: customer_review.is_satisfied,
		customer_message: customer_review.customer_message,
	};
	try {
		return await Chat.findOneAndUpdate({_id: ObjectId(chat_id)}, {review: review}, {new: true});
	}catch (e){
		console.log('error here',e);
		return null;
	}
};

const getAllmsgs=async () => {
	try {
		const chat = await ChatMessage.find();
		return chat;
	}catch (e){
		
		return null;
	}
};

exports.getChatsOfCSSAWithMessages= getChatsOfCSSAWithMessages;
exports.closeChat = closeChat;
exports.markChatSeenByCSSA = markChatSeenByCSSA;
exports.initNewChats = initNewChat;
exports.findChatByID = findChatByID;
exports.updateChatWithCustomerReview = updateChatWithCustomerReview;
exports.getAllmsgs=getAllmsgs;
exports.getAllChats = getAllChats;

