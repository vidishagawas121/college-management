const express = require('express');
const router = express.Router();
const {
  getPublicAdmissions,
  getAdmissionBySlug,
  getAdminAdmissions,
  createAdmission,
  updateAdmission,
  deleteAdmission,
} = require('../controllers/admissionController');
const { protectAdmin } = require('../middleware/auth');

// Public
router.get('/', getPublicAdmissions);
router.get('/slug/:slug', getAdmissionBySlug);

// Admin
router.get('/admin/all', protectAdmin, getAdminAdmissions);
router.post('/', protectAdmin, createAdmission);
router.put('/:id', protectAdmin, updateAdmission);
router.delete('/:id', protectAdmin, deleteAdmission);

module.exports = router;
