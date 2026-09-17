const express = require('express');
const router = express.Router();
const {
  getPublicStaff,
  getStaffBySlug,
  getAdminStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController');
const { protectAdmin } = require('../middleware/auth');

// Public
router.get('/', getPublicStaff);
router.get('/slug/:slug', getStaffBySlug);

// Admin
router.get('/admin/all', protectAdmin, getAdminStaff);
router.get('/admin/:id', protectAdmin, getStaffById);
router.post('/', protectAdmin, createStaff);
router.put('/:id', protectAdmin, updateStaff);
router.delete('/:id', protectAdmin, deleteStaff);

module.exports = router;
