// backend/routes/eventType.js
const express = require('express');
const router = express.Router();
const { protect, optional } = require('../middleware/auth');
const { validateCreate } = require('../middleware/validateEventType');

const etc = require('../controllers/eventTypeController');
const avc = require('../controllers/availabilityController');

/* CRUD */
router.get('/', protect, etc.getEventTypes);
router.post('/', protect, validateCreate, etc.createEventType);
router.get('/:id', protect, etc.getEventTypeById);
router.put('/:id', protect, etc.updateEventType);
router.delete('/:id', protect, etc.deleteEventType);
router.post('/:id/toggle', protect, etc.toggleEventType);
router.post('/:id/duplicate', protect, etc.duplicateEventType);

/* Availability */
router.get('/:id/availability', protect, avc.getAvailability);
router.put('/:id/availability', protect, avc.updateAvailability);
router.get('/:id/slots', optional, avc.getAvailableSlots);
router.post('/:id/check-slot', optional, avc.checkSlot);

/* Public */
router.get('/public/:slug', etc.getPublicEventType);

module.exports = router;