const Joi = require('@hapi/joi');

exports.validateGetUserById = Joi.object({
	id: Joi.string().required()
});

exports.validateAddUserData = Joi.object({
	first_name: Joi.string().required(),
	last_name: Joi.string().required(),
	email: Joi.string().required(),
	password: Joi.string().required(),
	referral_link: Joi.string().allow(''),
});
