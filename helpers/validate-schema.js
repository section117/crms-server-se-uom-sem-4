const Joi = require('joi');

const chatValidateSchema = Joi.object({
	name: Joi.string().alphanum().min(3).max(255).required(),
	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
		.required(),
	title_question: Joi.string().required(),
	company_id: Joi.string().required(),
});

const reviewValidateSchema = Joi.object({
	chat_id: Joi.string().required(),
	customer_review: {
		is_resolved: Joi.boolean().required(),
		is_satisfied: Joi.boolean().required(),
		customer_message: Joi.string().min(3).max(1000),
	},
});

const closeChatValidateSchema = Joi.object({
	chat_id: Joi.string().required(),
});

const userRegistrationSchema = Joi.object({
	email: Joi.string().required().min(3).max(255).email().label('Email'),
	first_name: Joi.string().required().min(3).max(255).label('First Name'),
	last_name: Joi.string().required().min(3).max(255).label('Last Name'),
	password: Joi.string().required().min(3).max(255).label('Password'),
}).options({ allowUnknown: true });

const userUpdateSchema = Joi.object({
	email: Joi.string().required().min(3).max(255).email().label('Email'),
	first_name: Joi.string().required().min(3).max(255).label('First Name'),
	last_name: Joi.string().required().min(3).max(255).label('Last Name'),
}).options({ allowUnknown: true });


const companyValidateSchema = Joi.object({
	company_name: Joi.string().required().min(3).max(255).label('Company Name'),
	company_email: Joi.string().required().min(3).max(255).email().label('Company Email'),
	website: Joi.string().required().min(3).max(255).label('Company Website'),
	address: Joi.string().required().min(3).max(255).label('Company Address'),
});

exports.chatValidateSchema = chatValidateSchema;
exports.reviewValidateSchema = reviewValidateSchema;
exports.closeChatValidateSchema = closeChatValidateSchema;
exports.userRegistrationSchema = userRegistrationSchema;
exports.userUpdateSchema = userUpdateSchema;
exports.companyValidateSchema = companyValidateSchema;
