const Joi = require('@hapi/joi');

exports.validateLoginUserData = Joi.object({
	email: Joi.string().required(),
	password: Joi.string().required(),
});

exports.validateGoogleLoginData = Joi.object({
	google_token_id: Joi.string().required(),
});

