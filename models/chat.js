const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
	is_resolved: {
		type: Boolean,
		required: true,
	},
	is_satisfied: {
		type: Boolean,
		required: true,
	},
	customer_message: {
		type: String,
		required: false,
		minlength: 3,
		maxlength: 1000,
		trim: true,
	},
});

/*const assignedCSSASchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	first_name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
		trim: true,
	},
	last_name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
		trim: true,
	},
});*/

const chatSchema = new mongoose.Schema({
	customer_name: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 255
	},
	customer_email: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 255
	},
	title_question: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 255
	},
	company: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: true
	},
	assigned_cssa: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	status: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 25,
		enum: ['ACTIVE', 'CLOSED']
	},
	review: {
		type: reviewSchema,
		required: false
	},
	updated_at: {
		type: Date,
		required: true
	},
	is_seen_by_cssa: {
		type: Boolean,
		required: true
	}
});

const chatModel = mongoose.model('Chat', chatSchema);

exports.schema = chatSchema;
exports.Chat = chatModel;
