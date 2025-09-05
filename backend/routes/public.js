// backend/routes/public.js
const express = require('express');
const router = express.Router();
const { validateCreate } = require('../middleware/validateBooking');
const {handleValidationErrors} = require('../middleware/handleValidationErrors')
const {
  getPublicEventType,
  getAvailableTimeSlots,
  checkSlotAvailability,
  createBooking,
  getBookingConfirmation,
  cancelBooking
} = require('../controllers/publicBookingController');
const { optional } = require('../middleware/auth'); // no auth required

router.get('/book/:slug', getPublicEventType);
router.get('/slots/:eventTypeId', getAvailableTimeSlots);
router.post('/check-slot/:eventTypeId', checkSlotAvailability);
// router.post('/book/:eventTypeId', createBooking);
router.get('/booking/:id/confirm', getBookingConfirmation);
router.post('/booking/:id/cancel', cancelBooking);
router.post('/book/:eventTypeId', validateCreate, handleValidationErrors, createBooking);

module.exports = router;