const express = require('express');
const router = express.Router();
const {
  getPublicDocuments,
  trackDownload,
  getAdminDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} = require('../controllers/documentController');
const { protectAdmin } = require('../middleware/auth');

// Public
router.get('/', getPublicDocuments);
router.post('/:id/download', trackDownload);

// Admin
router.get('/admin/all', protectAdmin, getAdminDocuments);
router.post('/', protectAdmin, createDocument);
router.put('/:id', protectAdmin, updateDocument);
router.delete('/:id', protectAdmin, deleteDocument);

module.exports = router;
