// backend/routes/user.js
const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');

const userCtrl       = require('../controllers/userController');
const settingsCtrl   = require('../controllers/settingsController');
const dashboardCtrl  = require('../controllers/dashboardController');

/* Profile */
router.get('/profile', protect, userCtrl.getUserProfile);
router.put('/profile', protect, userCtrl.updateUserProfile);
router.post('/upload-avatar', protect, userCtrl.uploadProfilePicture);
router.put('/change-password', protect, userCtrl.changePassword);

/* Settings */
router.get('/settings', protect, settingsCtrl.getSettings);
router.put('/settings', protect, settingsCtrl.updateSettings);
router.put('/settings/reset', protect, settingsCtrl.resetSettings);

/* Dashboard */
router.get('/dashboard', protect, dashboardCtrl.getDashboardStats);

module.exports = router;