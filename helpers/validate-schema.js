const Joi = require('joi');

const chatValidateSchema = Joi.object({
	name: Joi.string().alphanum().min(3).max(255).required(),
	email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
	title_question: Joi.string().required(),
	company_id: Joi.string().required()
});

const reviewValidateSchema = Joi.object({
	chat_id: Joi.string().required(),
	customer_review: {
		is_resolved: Joi.boolean().required(),
		is_satisfied: Joi.boolean().required(),
		customer_message: Joi.string().min(3).max(1000)
	}
	
});

const closeChatValidateSchema = Joi.object({
	chat_id: Joi.string().required(),
});

exports.chatValidateSchema = chatValidateSchema;
exports.reviewValidateSchema = reviewValidateSchema;
exports.closeChatValidateSchema = closeChatValidateSchema;