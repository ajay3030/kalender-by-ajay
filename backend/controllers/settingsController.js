// backend/controllers/settingsController.js
const User = require('../models/User');

/* GET settings */
const getSettings = async (req, res) => {
  const user = await User.findById(req.user.id).select('preferences');
  res.json(user.preferences || {});
};

/* PUT settings */
const updateSettings = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { preferences: req.body },
    { new: true, runValidators: true }
  ).select('preferences');
  res.json(user.preferences);
};

/* PUT reset settings */
const resetSettings = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { preferences: {} });
  res.json({ msg: 'Settings reset to default' });
};

module.exports = { getSettings, updateSettings, resetSettings };