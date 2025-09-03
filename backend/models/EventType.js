// backend/models/EventType.js
const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const dayjs = require('dayjs');

const customQuestionSchema = new Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ['text', 'textarea', 'select', 'checkbox'], default: 'text' },
  required: { type: Boolean, default: false },
  options: [String] // for select/checkbox
}, { _id: false });

const eventTypeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    duration: { type: Number, required: true, min: 15, max: 480 }, // minutes
    color: { type: String, default: '#3B82F6' },
    isActive: { type: Boolean, default: true },
    slug: { type: String, required: true, lowercase: true, index: true },
    eventType: { type: String, enum: ['one-on-one', 'group', 'round-robin'], default: 'one-on-one' },
    location: {
      type: { type: String, enum: ['zoom', 'google-meet', 'phone', 'in-person', 'custom'], default: 'zoom' },
      value: String
    },
    bufferTimeBefore: { type: Number, default: 0, min: 0, max: 60 },
    bufferTimeAfter: { type: Number, default: 0, min: 0, max: 60 },
    maxBookingsPerDay: { type: Number, default: 0, min: 0 }, // 0 = unlimited
    customQuestions: [customQuestionSchema],
    pricing: {
      enabled: { type: Boolean, default: false },
      amount: { type: Number, min: 0 },
      currency: { type: String, default: 'USD' }
    }
  },
  { timestamps: true }
);

/* Unique slug per user */
eventTypeSchema.index({ userId: 1, slug: 1 }, { unique: true });
eventTypeSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

/* Auto-generate slug if missing */
eventTypeSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = model('EventType', eventTypeSchema);