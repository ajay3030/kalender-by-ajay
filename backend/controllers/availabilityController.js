// backend/controllers/availabilityController.js
const Availability = require('../models/Availability');
const Booking = require('../models/Booking');
const dayjs = require('dayjs');

/* GET availability list for event-type */
const getAvailability = async (req, res) => {
  const list = await Availability.find({ eventTypeId: req.params.id });
  res.json(list);
};

/* UPDATE (replace all) */
const updateAvailability = async (req, res) => {
  const { availability } = req.body;
  await Availability.deleteMany({ eventTypeId: req.params.id });
  if (availability && availability.length) {
    const docs = availability.map(a => ({ ...a, eventTypeId: req.params.id }));
    await Availability.insertMany(docs);
  }
  res.json({ msg: 'Updated' });
};

/* GENERATE FREE SLOTS for a date range */
const getAvailableSlots = async (req, res) => {
  const { startDate, endDate, timezone = 'UTC' } = req.query;
  if (!startDate || !endDate) return res.status(400).json({ msg: 'startDate & endDate required' });

  const avail = await Availability.find({ eventTypeId: req.params.id });
  const bookings = await Booking.find({
    eventTypeId: req.params.id,
    dateTime: { $gte: new Date(startDate), $lte: new Date(endDate) }
  });

  const slots = generateSlots(avail, startDate, endDate, timezone, bookings);
  res.json(slots);
};

/* helper: generate 15-min slots */
function generateSlots(avail, start, end, tz, bookings) {
  const results = {};
  let current = dayjs(start).tz(tz).startOf('day');
  const stop = dayjs(end).tz(tz).endOf('day');
  const booked = bookings.map(b => dayjs(b.dateTime).unix());

  while (current.isBefore(stop)) {
    const day = current.day();
    const dateStr = current.format('YYYY-MM-DD');
    const dayAv = avail.filter(a => a.dayOfWeek === day);
    const slots = [];

    dayAv.forEach(({ startTime, endTime, bufferTimeBefore = 0, bufferTimeAfter = 0, duration = 30 }) => {
      let slot = current.hour(parseInt(startTime.split(':')[0])).minute(parseInt(startTime.split(':')[1]));
      const endSlot = current.hour(parseInt(endTime.split(':')[0])).minute(parseInt(endTime.split(':')[1]));

      while (slot.add(bufferTimeBefore + duration + bufferTimeAfter, 'minute').isSameOrBefore(endSlot)) {
        const start = slot.add(bufferTimeBefore, 'minute');
        const end = start.add(duration, 'minute');
        if (!booked.includes(start.unix())) slots.push({ start: start.toISOString(), end: end.toISOString() });
        slot = slot.add(15, 'minute'); // 15-min steps
      }
    });

    if (slots.length) results[dateStr] = slots;
    current = current.add(1, 'day');
  }
  return results;
}

/* CHECK SINGLE SLOT */
const checkSlot = async (req, res) => {
  const { dateTime } = req.body;
  if (!dateTime) return res.status(400).json({ msg: 'dateTime required' });
  const exists = await Booking.exists({ eventTypeId: req.params.id, dateTime: new Date(dateTime) });
  res.json({ available: !exists });
};

module.exports = { getAvailability, updateAvailability, getAvailableSlots, checkSlot };