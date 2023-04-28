const jwt = require('jsonwebtoken');
const config = require('../config');
const { Auth } = require('../persistence/models');

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.access.secret, { expiresIn: config.jwt.access.expiresIn });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.refresh.secret, { expiresIn: config.jwt.refresh.expiresIn });
};

const auth = async (req, res, next) => {
  // Get the token from the request header
  console.log("Auth", req.body);
  const token = req.headers['u-access-token'];

  if (!token) {
    return res.status(401).json({
      message: 'Authorization token not found',
      messageCode: 'UnauthorizedError',
      status: 401,
      success: false
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.jwt.access.secret);
    req.user = decoded;

    // Check if session is expired
    const auth = await Auth.findOne({ accessToken: token });
    if (!auth || new Date() > auth.accessTokenExpiresAt) {
      return res.status(401).json({
        message: 'Authorization token expired',
        messageCode: 'UnauthorizedError',
        status: 401,
        success: false
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid authorization token',
      messageCode: 'UnauthorizedError',
      status: 401,
      success: false
    });
  }
};

module.exports = {
  auth,
  generateAccessToken,
  generateRefreshToken
};
