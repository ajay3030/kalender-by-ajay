// backend/models/Availability.js
const { Schema, model } = require('mongoose');

const dateOverrideSchema = new Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // HH:mm
  endTime: { type: String, required: true },
  isAvailable: { type: Boolean, default: true }
}, { _id: false });

const availabilitySchema = new Schema(
  {
    eventTypeId: { type: Schema.Types.ObjectId, ref: 'EventType', required: true, index: true },
    dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0 = Sunday
    startTime: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    endTime: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    timezone: { type: String, default: 'UTC' },
    dateOverrides: [dateOverrideSchema],
    isRecurring: { type: Boolean, default: true }
  },
  { timestamps: true }
);

/* Prevent overlapping recurring slots for same event-type */
availabilitySchema.index({ eventTypeId: 1, dayOfWeek: 1 });

module.exports = model('Availability', availabilitySchema);