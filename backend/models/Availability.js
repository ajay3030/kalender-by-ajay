// backend/models/Availability.js
const { Schema, model } = require('mongoose');

const availabilitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0 = Sunday
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true }    // "17:00"
  },
  { timestamps: true }
);

module.exports = model('Availability', availabilitySchema);