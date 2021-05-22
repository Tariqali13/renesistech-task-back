const appRoot = require('app-root-path');
const logger = require(appRoot + '/src/logger').apiLogger;
const User = require(appRoot + '/src/model/user');

// In this method we will validate user with user id
exports.validateUser = async (req, res, next) => {
	logger.info(`starting middleware [validateUser] to validate user`)
	try {
		const { email } = req.body;
		if (email) {
			logger.info(`Checking if user exists against email: ${email}`)
			const userToFind = await User.findOne({ email: email})
			if (userToFind) {
				logger.info(`user is already exist against email: ${email}. Return with status code 400`);
				return res.status(400).json({
					message: `Email address is already registered and verified`
				});
			}
		}
		logger.info(`End middleware [validateUser]`);
		next();
	} catch (error) {
		logger.error(JSON.stringify(error = error.stack));
		return res.status(500).json({
			message: 'Internal Server Error. Please try again later.',
			error: error
		});
	}
}
