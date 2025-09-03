// backend/middleware/validateEventType.js
const dayjs = require('dayjs');

const isTime = t => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(t);

exports.validateCreate = (req, res, next) => {
  const { title, duration, availability } = req.body;
  if (!title || !duration) return res.status(400).json({ msg: 'Title & duration required' });
  if (duration < 15 || duration > 480) return res.status(400).json({ msg: 'Duration 15-480 min' });

  if (availability && availability.length) {
    for (const av of availability) {
      const { dayOfWeek, startTime, endTime } = av;
      if (dayOfWeek == null || !startTime || !endTime) return res.status(400).json({ msg: 'Availability fields missing' });
      if (!isTime(startTime) || !isTime(endTime)) return res.status(400).json({ msg: 'Invalid time format (HH:mm)' });
      if (startTime >= endTime) return res.status(400).json({ msg: 'Start must precede end' });
    }
  }
  next();
};