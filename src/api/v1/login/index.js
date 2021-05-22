const express = require('express');
const router = express.Router();
const appRoot = require('app-root-path');
const auth = require(appRoot + '/src/middleware');
const loginController = require('./login.controller');

// --Api Route-- /api/v1/login

// In this method we will login as a user
router.post('/login-user',
	[auth],
	loginController.loginUser
);

router.post('/google-login',
	[auth],
	loginController.googleLogin
);

module.exports = router;
