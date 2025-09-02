// backend/controllers/userController.js
const User = require('../models/User');
const Booking = require('../models/Booking');
const EventType = require('../models/EventType');

/* GET full profile */
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

/* PUT update profile */
const updateUserProfile = async (req, res) => {
  const allowed = ['name', 'company', 'phone', 'website', 'bio', 'preferences'];
  const updates = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
                         .select('-password');
  res.json(user);
};

/* POST upload avatar */
const uploadProfilePicture = [
  require('../middleware/upload').single('avatar'),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
    const url = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, { profilePicture: url }, { new: true })
                           .select('-password');
    res.json({ profilePicture: user.profilePicture });
  }
];

/* PUT change password */
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  if (!(await user.comparePassword(currentPassword)))
    return res.status(400).json({ msg: 'Current password incorrect' });

  user.password = newPassword;
  await user.save();
  res.json({ msg: 'Password changed' });
};

/* GET user stats for dashboard */
const getUserStats = async (req, res) => {
  const userId = req.user.id;
  const totalBookings = await Booking.countDocuments({ eventTypeId: { $in: await EventType.distinct('_id', { userId }) } });
  const totalEvents = await EventType.countDocuments({ userId });
  const today = new Date();
  const upcoming = await Booking.countDocuments({
    eventTypeId: { $in: await EventType.distinct('_id', { userId }) },
    dateTime: { $gte: today }
  });
  res.json({ totalBookings, totalEvents, upcoming });
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  changePassword,
  getUserStats
};