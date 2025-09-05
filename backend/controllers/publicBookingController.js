// backend/controllers/publicBookingController.js
const EventType = require('../models/EventType');
const Booking = require('../models/Booking');
const { calculateDailySlots, checkExistingBookings } = require('../utils/availabilityCalculator');
const { sendBookingConfirmation, sendCancellationEmail } = require('../utils/emailService');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);

/* GET public event-type by slug */
const getPublicEventType = async (req, res) => {
  const event = await EventType.findOne({ slug: req.params.slug, isActive: true })
                               .populate('userId', 'name email timezone');
  if (!event) return res.status(404).json({ msg: 'Event type not found' });
  res.json(event);
};

/* GET available slots for date range */
const getAvailableTimeSlots = async (req, res) => {
  const { eventTypeId } = req.params;
  const { startDate, endDate, timezone = 'UTC' } = req.query;
  if (!startDate || !endDate) return res.status(400).json({ msg: 'startDate & endDate required' });

const event = await EventType.findById(eventTypeId).populate('userId', 'timezone').lean();   
if (!event) return res.status(404).json({ msg: 'Event type not found' });

  const userTz = event.userId.timezone || 'UTC';
  const slots = {};
  let cursor = dayjs.tz(startDate, userTz).startOf('day');
  const stop = dayjs.tz(endDate, userTz).endOf('day');

  while (cursor.isSameOrBefore(stop)) {
    const dateStr = cursor.format('YYYY-MM-DD');
    slots[dateStr] = await calculateDailySlots(event, dateStr, userTz, timezone);
    cursor = cursor.add(1, 'day');
  }

  res.json(slots);
};

/* POST check single slot */
const checkSlotAvailability = async (req, res) => {
  const { eventTypeId } = req.params;
  const { dateTime } = req.body;
  if (!dateTime) return res.status(400).json({ msg: 'dateTime required' });

  const exists = await Booking.exists({
    eventTypeId,
    bookingDateTime: new Date(dateTime),
    status: { $ne: 'cancelled' }
  });
  res.json({ available: !exists });
};

/* POST create booking */
const createBooking = async (req, res) => {
  const {
    clientName, clientEmail, clientPhone, clientTimezone,
    bookingDateTime, customAnswers, notes
  } = req.body;
  if (!clientName || !clientEmail || !bookingDateTime) return res.status(400).json({ msg: 'Missing required fields' });

  const event = await EventType.findById(req.params.eventTypeId).populate('userId');
  if (!event) return res.status(404).json({ msg: 'Event type not found' });

  /* race-condition guard */
  const exists = await Booking.exists({
    eventTypeId: event._id,
    bookingDateTime: new Date(bookingDateTime),
    status: { $ne: 'cancelled' }
  });
  if (exists) return res.status(409).json({ msg: 'Slot no longer available' });

  /* daily limit */
  if (event.maxBookingsPerDay > 0) {
    const today = dayjs(bookingDateTime).startOf('day');
    const count = await Booking.countDocuments({
      eventTypeId: event._id,
      bookingDateTime: { $gte: today.toDate(), $lt: today.add(1, 'day').toDate() },
      status: { $ne: 'cancelled' }
    });
    if (count >= event.maxBookingsPerDay) return res.status(409).json({ msg: 'Daily limit reached' });
  }

  const booking = await Booking.create({
    eventTypeId: event._id,
    clientName,
    clientEmail,
    clientPhone,
    clientTimezone,
    bookingDateTime: new Date(bookingDateTime),
    duration: event.duration,
    customAnswers,
    notes,
    confirmedAt: new Date()
  });

  /* send emails */
  await sendBookingConfirmation(booking, event);

  res.status(201).json({ booking, confirmationLink: `/booking/${booking._id}/confirm?token=${booking.cancellationToken}` });
};

/* GET booking confirmation page data */
const getBookingConfirmation = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
                               .populate('eventTypeId', 'title duration color slug userId')
                               .populate('eventTypeId.userId', 'name email');
  if (!booking) return res.status(404).json({ msg: 'Booking not found' });
  res.json(booking);
};

/* POST cancel booking (client) */
const cancelBooking = async (req, res) => {
  const { token } = req.body;
  const booking = await Booking.findOne({ _id: req.params.id, cancellationToken: token });
  if (!booking) return res.status(404).json({ msg: 'Invalid or expired link' });

  booking.status = 'cancelled';
  await booking.save();

  await sendCancellationEmail(booking);

  res.json({ msg: 'Booking cancelled' });
};

module.exports = {
  getPublicEventType,
  getAvailableTimeSlots,
  checkSlotAvailability,
  createBooking,
  getBookingConfirmation,
  cancelBooking
};