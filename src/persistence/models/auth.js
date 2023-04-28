const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  accessTokenExpiresAt: { type: String, required: true },
  refreshTokenExpiresAt: { type: String, required: true },
  userId: { type: String, required: true }
});

module.exports = mongoose.model('Auth', AuthSchema, 'Auth');