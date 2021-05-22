const appRoot = require('app-root-path');
const config = require('config');
const logger = require(appRoot + '/src/logger').apiLogger;
const User = require(appRoot + '/src/model/user');
const LoginValidation = require('./login.validation');
const bcrypt = require('bcryptjs');
const constant = require(appRoot + '/src/constant');
const jwt = require('jsonwebtoken');
const _get = require('lodash.get');
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = config.get('googleAuth.clientId');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

exports.loginUser = async (req, res) => {
	try {
		const body = ({
			email,
			password,
		} = req.body);
		logger.info('In loginUser - Validating  user input data');
		const { error } = LoginValidation.validateLoginUserData.validate(body, {
			abortEarly: false,
		});
		if (error) {
			logger.info(`Validation error ${JSON.stringify(error.details)}`);
			return res.status(400).json({
				message: 'Invalid Request. Please check and try again.',
				error: error.details,
			});
		}
		logger.info('All validations passed');
		logger.info('Going to validate user');
		const userExist  = await User.findOne({ email: email });
		if (!userExist) {
			return res.status(400).json({
				message: "No user found against requested email.",
			});
		}
		if (!userExist.google_id) {
			logger.info('Going to compare password');
			let match = await bcrypt.compare(password, userExist.password);
			if (!match) {
				return res.status(400).json({
					message: "Password is incorrect",
				});
			}
		}
		let token = jwt.sign({ id: userExist._id }, constant.JWT_SECRET_LOGIN, { expiresIn: constant.JWT_EXPIRE });
		logger.info(`Returning back user data with auth token success code 200`);
		const returnData = {
			..._get(userExist, '_doc'),
			jwt_token: token,
		};
		return res.status(200).json({
			message: 'Logged In successfully.',
			data: returnData,
		});
	} catch (error) {
		logger.error(JSON.stringify((error = error.stack)));
		return res.status(500).json({
			message: 'Internal Server Error. Please try again later.',
			error: error,
		});
	}
}

exports.googleLogin = async (req, res) => {
	try {
		const body = ({
			google_token_id
		} = req.body);
		logger.info('In googleLogin - Validating  google token id data');
		const { error } = LoginValidation.validateGoogleLoginData.validate(body, {
			abortEarly: false,
		});
		if (error) {
			logger.info(`Validation error ${JSON.stringify(error.details)}`);
			return res.status(400).json({
				message: 'Invalid Request. Please check and try again.',
				error: error.details,
			});
		}
		logger.info('All validations passed');
		logger.info('Going to validate google token id');
		const ticket = await client.verifyIdToken({
			idToken: google_token_id,
			audience: GOOGLE_CLIENT_ID
		});
		const { email, given_name, family_name } = ticket.getPayload();
		let userExist;
		logger.info('Going to check if user exist with email');
		userExist  = await User.findOne({ email: email });
		if (!userExist) {
			logger.info('Going to create user with email');
			const userBody = {
				email,
				first_name: given_name,
				last_name: family_name,
				google_id: google_token_id,
			}
			userExist = await User.create(userBody);
		}
		let token = jwt.sign({ id: userExist._id }, constant.JWT_SECRET_LOGIN, { expiresIn: constant.JWT_EXPIRE });
		logger.info(`Returning back user data with auth token success code 200`);
		const returnData = {
			..._get(userExist, '_doc', userExist),
			jwt_token: token,
		};
		return res.status(200).json({
			message: 'Logged In successfully.',
			data: returnData,
		});
	} catch (error) {
		logger.error(JSON.stringify((error = error.stack)));
		return res.status(500).json({
			message: 'Internal Server Error. Please try again later.',
			error: error,
		});
	}
}
