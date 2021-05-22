const appRoot = require('app-root-path');
const logger = require(appRoot + '/src/logger').apiLogger;
const UserValidation = require('./user.validation');
const User = require(appRoot + '/src/model/user');
const bcrypt = require('bcryptjs');

exports.getUserById = async (req, res) => {
	try {
		logger.info('In getUserById - Validating  user id');
		const { error } = UserValidation.validateGetUserById.validate(req.params, {
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
		logger.info(`getting user data with id ${req.params.id}`);
		const user = await User.findById(req.params.id);
		logger.info('Returning back user data with success code 200');
		return res.status(200).json({
			message: 'User found against user id.',
			data: user,
		});
	} catch (error) {
		logger.error(JSON.stringify((error = error.stack)));
		return res.status(500).json({
			message: 'Internal Server Error. Please try again later.',
			error: error,
		});
	}
}

exports.createUser = async (req, res) => {
	try {
		const body = ({
			first_name,
			last_name,
			email,
			password,
			phone_number,
		} = req.body);
		logger.info('In createUser - Validating  user data');
		const { error } = UserValidation.validateAddUserData.validate(body, {
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
		logger.info(`adding user data ${JSON.stringify(body)}`);
		const salt = await bcrypt.genSalt(10);
		body.password = await bcrypt.hash(password, salt);
		const user = await User.create(body);
		logger.info('Returning back User data with success code 200');
		return res.status(200).json({
			message: 'User is created successfully.',
			data: user,
		});
	} catch (error) {
		logger.error(JSON.stringify((error = error.stack)));
		return res.status(500).json({
			message: 'Internal Server Error. Please try again later.',
			error: error,
		});
	}
}
