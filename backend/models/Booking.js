// backend/models/Booking.js
const { Schema, model } = require('mongoose');
const crypto = require('crypto');

const bookingSchema = new Schema(
  {
    eventTypeId: { type: Schema.Types.ObjectId, ref: 'EventType', required: true, index: true },
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, required: true, lowercase: true },
    clientPhone: String,
    clientTimezone: { type: String, default: 'UTC' },

    bookingDateTime: { type: Date, required: true, index: true },
    duration: { type: Number, required: true }, // minutes
    status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },

    customAnswers: { type: Map, of: String }, // answers to custom questions
    notes: String,

    cancellationToken: { type: String, unique: true, sparse: true }, // for client cancellation
    remindersSent: [{ type: Date }], // timestamps

    confirmedAt: Date
  },
  { timestamps: true }
);

/* Generate secure cancellation token */
bookingSchema.pre('save', function (next) {
  if (!this.cancellationToken) {
    this.cancellationToken = crypto.randomBytes(32).toString('hex');
  }
  next();
});

/* Compound index to prevent double-booking same slot */
bookingSchema.index({ eventTypeId: 1, bookingDateTime: 1 }, { unique: true });

module.exports = model('Booking', bookingSchema);