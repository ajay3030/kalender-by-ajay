// backend/middleware/validateBooking.js
const { body } = require('express-validator');

exports.validateCreate = [
  body('clientName').trim().notEmpty().withMessage('Name is required'),
  body('clientEmail').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('clientPhone').optional().isMobilePhone().withMessage('Valid phone required'),
  body('bookingDateTime').isISO8601().withMessage('Valid ISO date-time required'),
  body('customAnswers').optional().isObject().withMessage('customAnswers must be object')
];