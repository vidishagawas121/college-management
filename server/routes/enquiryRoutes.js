const express = require('express');
const router = express.Router();
const {
  submitEnquiry,
  getAdminEnquiries,
  updateEnquiry,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const { protectAdmin } = require('../middleware/auth');

// Public
router.post('/', submitEnquiry);

// Admin
router.get('/admin/all', protectAdmin, getAdminEnquiries);
router.put('/admin/:id', protectAdmin, updateEnquiry);
router.delete('/admin/:id', protectAdmin, deleteEnquiry);

module.exports = router;
