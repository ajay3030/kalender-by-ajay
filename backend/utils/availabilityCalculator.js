// backend/utils/availabilityCalculator.js
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

/* Generate daily slots for a given date */
async function calculateDailySlots(eventType, date, userTz, clientTz) {
  const { duration, bufferTimeBefore, bufferTimeAfter } = eventType;
  const availability = eventType.availability || []; 
  const dayOfWeek = dayjs.tz(date, userTz).day();

  /* Find recurring slots for this weekday */
  const dayAvail = availability.filter(a => a.dayOfWeek === dayOfWeek);
  if (!dayAvail.length) return [];

  /* booked slots for this date */
  const existing = await checkExistingBookings(eventType._id, date);

  const slots = [];
  dayAvail.forEach(slot => {
    let cursor = dayjs.tz(`${date}T${slot.startTime}`, userTz);
    const end = dayjs.tz(`${date}T${slot.endTime}`, userTz);

    while (cursor.add(bufferTimeBefore + duration + bufferTimeAfter, 'minute').isSameOrBefore(end)) {
      const start = cursor.add(bufferTimeBefore, 'minute');
      const endSlot = start.add(duration, 'minute');

      /* skip if overlaps an existing booking */
      const occupied = existing.some(b => {
        const bStart = dayjs.tz(b.bookingDateTime, userTz);
        const bEnd = bStart.add(b.duration, 'minute');
        return start.isBefore(bEnd) && endSlot.isAfter(bStart);
      });

      if (!occupied) {
        slots.push({
          start: start.tz(clientTz).format(),
          end: endSlot.tz(clientTz).format(),
          startUtc: start.toISOString(),
          endUtc: endSlot.toISOString(),
        });
      }
      cursor = cursor.add(15, 'minute'); // 15-min granularity
    }
  });

  return slots;
}

/* Fetch bookings for a single date */
async function checkExistingBookings(eventTypeId, date) {
  const Booking = require('../models/Booking');
  const start = dayjs.tz(date, 'UTC').startOf('day').toDate();
  const end = dayjs.tz(date, 'UTC').endOf('day').toDate();
  return Booking.find({
    eventTypeId,
    bookingDateTime: { $gte: start, $lte: end },
    status: { $ne: 'cancelled' }
  }).lean();
}

/* Apply buffer times (already done above, but exposed for reuse) */
function applyBufferTimes(slots, bufferBefore, bufferAfter) {
  return slots.map(s => ({
    ...s,
    start: dayjs(s.start).subtract(bufferBefore, 'minute').toISOString(),
    end: dayjs(s.end).add(bufferAfter, 'minute').toISOString(),
  }));
}

/* Convert slots between time-zones */
function handleTimezoneConversion(slots, fromTz, toTz) {
  return slots.map(s => ({
    ...s,
    start: dayjs.tz(s.start, fromTz).tz(toTz).format(),
    end: dayjs.tz(s.end, fromTz).tz(toTz).format(),
  }));
}

module.exports = {
  calculateDailySlots,
  checkExistingBookings,
  applyBufferTimes,
  handleTimezoneConversion,
};