// backend/controllers/authController.js
const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const crypto = require('crypto')
/* Register */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ msg: 'Email already exists' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* Login */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ msg: 'Invalid credentials' });

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.json({ token, refreshToken,
               user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* Get Profile */
const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

/* Update Profile */
const updateProfile = async (req, res) => {
  const { name, timezone, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, timezone, avatar },
    { new: true, runValidators: true }
  ).select('-password');
  res.json(user);
};

/* Logout (placeholder; stateless JWT) */
const logout = (_req, res) => res.json({ msg: 'Logged out' });


const forgotPassword = async (req, res) => {
  /* Basic stub: generate token, store hash in DB, send email */
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: 'User not found' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save({ validateBeforeSave: false });

  /* TODO: send email with resetToken */
  res.json({ msg: 'Reset email sent (stub)', resetToken }); // remove in prod
};

const resetPassword = async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ msg: 'Password updated' });
};

module.exports = { register, login, logout, getProfile, updateProfile ,forgotPassword,resetPassword};