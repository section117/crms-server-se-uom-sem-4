const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
	company_name: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 255
	},
	company_email: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 255
	},
	website: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 255
	},
	address: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 255
	},
	owner: {
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}
});

const companyModel = mongoose.model('Company', companySchema);

exports.schema = companySchema;
exports.Company = companyModel;