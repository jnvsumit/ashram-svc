const jwt = require('jsonwebtoken');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const config = require('../config');
const { generateAccessToken } = require('../middleware/auth');
const { Auth, User } = require('../persistence/models');
const { getMillisecondFromStringTime } = require('../utils/timeUtil');

const token = async (req, res) => {
  const refreshToken = req.headers['u-refresh-token'];

  if (!refreshToken) {
    return res.status(400).json({
      message: 'Refresh token not provided',
      messageCode: 'BAD_REQUEST_ERROR',
      status: 400,
      success: false,
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(refreshToken, config.jwt.refresh.secret);

    // Check if session is expired
    const auth = await Auth.findOne({ refreshToken });
    if (!auth || new Date() > auth.refreshTokenExpiresAt) {
      return res.status(401).json({
        message: 'Invalid refresh token',
        messageCode: 'UNAUTHORIZED_ERROR',
        status: 401,
        success: false,
      });
    }

    // Generate new access token
    const accessToken = generateAccessToken(decoded.userId);

    // Update the document in the Auth collection
    const expiresIn = getMillisecondFromStringTime(config.jwt.access.expiresIn);
    const updatedAuth = await Auth.findOneAndUpdate(
      { refreshToken },
      {
        accessToken,
        accessTokenExpiresAt: new Date(Date.now() + expiresIn),
      },
      { new: true }
    );

    // Send the new tokens in the response
    res.status(200).json({
      message: 'New tokens generated successfully',
      messageCode: 'TOKEN_GENERATED',
      status: 200,
      success: true,
      data: {
        accessToken: updatedAuth.accessToken,
        refreshToken: updatedAuth.refreshToken
      },
    });
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid refresh token',
      messageCode: 'UNAUTHORIZED_ERROR',
      status: 401,
      success: false,
    });
  }
};

const login = async (req, res) => {
    const { username, password } = req.body;
  
    console.log(username, password);

    try {
      // Check if user exists in the database
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({
          message: 'Invalid credentials',
          messageCode: 'UNAUTHORIZED_ERROR',
          status: 401,
          success: false,
        });
      }
  
      // Check if password is correct
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          message: 'Invalid credentials',
          messageCode: 'UNAUTHORIZED_ERROR',
          status: 401,
          success: false,
        });
      }
  
      const { userId } = user;
      const accessTokenExpiresInMS = getMillisecondFromStringTime(config.jwt.access.expiresIn);
      const refreshTokenExpiresInMS = getMillisecondFromStringTime(config.jwt.refresh.expiresIn);
      const accessToken = jwt.sign({ userId }, config.jwt.access.secret, { expiresIn: accessTokenExpiresInMS });
      const refreshToken = jwt.sign({ userId }, config.jwt.refresh.secret, { expiresIn: refreshTokenExpiresInMS });

      const refreshTokenExpiresAt = new Date(Date.now() + accessTokenExpiresInMS);
      const accessTokenExpiresAt = new Date(Date.now() + refreshTokenExpiresInMS);

      await Auth.findOneAndUpdate(
        { userId },
        { refreshToken, accessToken, refreshTokenExpiresAt, accessTokenExpiresAt },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      res.status(200).json({
        message: 'Login successful',
        messageCode: 'LOGIN_SUCCESSFUL',
        status: 200,
        success: true,
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'An error occurred while logging in',
        messageCode: 'INTERNAL_SERVER_ERROR',
        status: 500,
        success: false,
      });
    }
  };

module.exports = {
  token,
  login
};
