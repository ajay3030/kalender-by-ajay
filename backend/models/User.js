// backend/models/User.js
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    timezone: { type: String, default: 'UTC' },
    profile: {
      avatar: String,
      company: String
    }
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);