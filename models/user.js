const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	first_name: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 255
	},
	last_name: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 255
	},
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 255
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 255
	},
	user_type: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 25,
		enum: ['COMPANY_OWNER', 'CSSA', 'SYSTEM_ADMIN']
	},
	company: {
		required: false,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company'
	}
});

const userModel = mongoose.model('User', userSchema);

exports.schema = userSchema;
exports.User = userModel;