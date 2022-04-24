const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
	message: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		maxlength: 1000
	},
	is_incoming: {
		type: Boolean,
		required: true
	},
	chat_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Chat',
		required: true,
	}
}, { collection: 'chat_messages' });

const chatMessageModel = mongoose.model('ChatMessage', chatMessageSchema);

exports.schema = chatMessageSchema;
exports.ChatMessage = chatMessageModel;