// backend/controllers/eventTypeController.js
const EventType = require('../models/EventType');
const Availability = require('../models/Availability');
const Booking = require('../models/Booking');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

/* CREATE */
const createEventType = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user.id };
    console.log('EventType loaded:', typeof EventType);
    const event = await EventType.create(data);

    // bulk-insert availability if provided
    if (req.body.availability && req.body.availability.length) {
      const avDocs = req.body.availability.map(a => ({ ...a, eventTypeId: event._id }));
      await Availability.insertMany(avDocs);
    }
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

/* LIST (paginated) */
const getEventTypes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [total, list] = await Promise.all([
    EventType.countDocuments({ userId: req.user.id }),
    EventType.find({ userId: req.user.id }).skip(skip).limit(limit).sort({ createdAt: -1 })
  ]);
  res.json({ total, page, pages: Math.ceil(total / limit), list });
};

/* GET SINGLE */
const getEventTypeById = async (req, res) => {
  const event = await EventType.findOne({ _id: req.params.id, userId: req.user.id });
  if (!event) return res.status(404).json({ msg: 'Event type not found' });
  res.json(event);
};

/* UPDATE */
const updateEventType = async (req, res) => {
  const event = await EventType.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!event) return res.status(404).json({ msg: 'Event type not found' });
  res.json(event);
};

/* SOFT DELETE */
const deleteEventType = async (req, res) => {
  const event = await EventType.findOneAndDelete(
    { _id: req.params.id, userId: req.user.id },
  );
  if (!event) return res.status(404).json({ msg: 'Event type not found' });
  res.json({ msg: 'Deleted' });
};

/* TOGGLE ACTIVE */
const toggleEventType = async (req, res) => {
  const event = await EventType.findOne({ _id: req.params.id, userId: req.user.id });
  if (!event) return res.status(404).json({ msg: 'Event type not found' });
  event.isActive = !event.isActive;
  await event.save();
  res.json(event);
};

/* DUPLICATE */
const duplicateEventType = async (req, res) => {
  const src = await EventType.findOne({ _id: req.params.id, userId: req.user.id });
  if (!src) return res.status(404).json({ msg: 'Event type not found' });
  const copy = src.toObject();
  delete copy._id;
  copy.title = copy.title + ' (Copy)';
  copy.slug = copy.slug + '-' + Date.now();
  const dup = await EventType.create(copy);
  res.status(201).json(dup);
};

/* PUBLIC SLUG LOOKUP (no auth) */
const getPublicEventType = async (req, res) => {
  const event = await EventType.findOne({ slug: req.params.slug, isActive: true }).populate('userId', 'name timezone');
  if (!event) return res.status(404).json({ msg: 'Event type not found' });
  res.json(event);
};

module.exports = {
  createEventType,
  getEventTypes,
  getEventTypeById,
  updateEventType,
  deleteEventType,
  toggleEventType,
  duplicateEventType,
  getPublicEventType
};