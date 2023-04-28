const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 4,
      maxlength: 20,
      match: /^[a-zA-Z0-9._]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 256,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema, 'Users');
