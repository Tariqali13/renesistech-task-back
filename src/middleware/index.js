const config = require('config');
const jwt = require('jsonwebtoken');
const appRoot = require('app-root-path');
const logger = require(appRoot + '/src/logger').apiLogger;
const constant = require(appRoot + '/src/constant');
const PUBLIC_API_TOKEN = config.get('auth.public.token');

function auth(req, res, next) {
  const token = req.headers['authorization'];
  // check token

  if (!token) {
    logger.info(
      'User is Unauthorized to access this api. return with status code 401'
    );
    return res.status(401).json({
      message: 'No token, Auth Denied!!!',
      statusCode: constant.STATUS_UNAUTHORIZED,
      statusDesc: constant.STATUS_UNAUTHORIZED_DESC
    });
  }

  try {
    //verify token;
    if (token.includes('Public')) {
      let publicToken = token.slice('Public '.length);
      if (publicToken !== PUBLIC_API_TOKEN) {
        res.status(400).json({
          message: 'Token is invalid!',
          statusCode: constant.STATUS_UNAUTHORIZED,
          statusDesc: constant.STATUS_UNAUTHORIZED_DESC
        });
      }
    } else {
      let protectedToken = token.slice('Bearer '.length);
      req.user = jwt.verify(protectedToken, constant.JWT_SECRET_LOGIN);
    }

    logger.info(
      'User is Authorized to access this api'
    );
    next();
  } catch (error) {
    logger.error(JSON.stringify(error = error.stack));
    logger.info(
      'User is Unauthorized to access this api. return with status code 401'
    );
    res.status(400).json({
      message: 'Token Is Invalid!',
      statusCode: constant.STATUS_UNAUTHORIZED,
      statusDesc: constant.STATUS_UNAUTHORIZED_DESC
    });
  }
}

module.exports = auth;
