// backend/models/Booking.js
const { Schema, model } = require('mongoose');

const bookingSchema = new Schema(
  {
    eventTypeId: { type: Schema.Types.ObjectId, ref: 'EventType', required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true, lowercase: true },
    dateTime: { type: Date, required: true }
  },
  { timestamps: true }
);

module.exports = model('Booking', bookingSchema);