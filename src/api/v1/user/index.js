const express = require('express');
const router = express.Router();
const appRoot = require('app-root-path');
const auth = require(appRoot + '/src/middleware');
const userController = require('./user.controller');
const userMiddleware = require(appRoot +
	'/src/middleware/validation/user/user.middleware'
);
// --Api Route-- /api/v1/user

// In this method we will get user against user id
router.get('/:id',
	[auth],
	userController.getUserById
);

// In this method we will create new user
router.post('/',
	[auth, userMiddleware.validateUser],
	userController.createUser
);

module.exports = router;
