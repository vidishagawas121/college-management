const express = require('express');
const router = express.Router();
const {
  getPublicEvents,
  getEventBySlug,
  getAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protectAdmin } = require('../middleware/auth');

// Public
router.get('/', getPublicEvents);
router.get('/slug/:slug', getEventBySlug);

// Admin
router.get('/admin/all', protectAdmin, getAdminEvents);
router.post('/', protectAdmin, createEvent);
router.put('/:id', protectAdmin, updateEvent);
router.delete('/:id', protectAdmin, deleteEvent);

module.exports = router;
