// backend/models/EventType.js
const { Schema, model } = require('mongoose');

const eventTypeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 15 }, // minutes
    description: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = model('EventType', eventTypeSchema);