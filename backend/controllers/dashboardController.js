// backend/controllers/dashboardController.js
const Booking = require('../models/Booking');
const EventType = require('../models/EventType');

/* GET /api/user/dashboard */
const getDashboardStats = async (req, res) => {
  const userId = req.user.id;
  const totalBookings = await Booking.countDocuments({ eventTypeId: { $in: await EventType.distinct('_id', { userId }) } });
  const totalEvents = await EventType.countDocuments({ userId });

  const recent = await Booking.find({ eventTypeId: { $in: await EventType.distinct('_id', { userId }) } })
                              .sort({ createdAt: -1 }).limit(5)
                              .populate('eventTypeId', 'title');

  const upcoming = await Booking.find({
      eventTypeId: { $in: await EventType.distinct('_id', { userId }) },
      dateTime: { $gte: new Date() }
    })
    .sort({ dateTime: 1 }).limit(5)
    .populate('eventTypeId', 'title');

  res.json({ totalBookings, totalEvents, recent, upcoming });
};

module.exports = { getDashboardStats };