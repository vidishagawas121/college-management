const express = require('express');
const router = express.Router();
const {
  getPublicNotices,
  getNoticeBySlug,
  getAdminNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');
const { protectAdmin } = require('../middleware/auth');

// Public
router.get('/', getPublicNotices);
router.get('/slug/:slug', getNoticeBySlug);

// Admin
router.get('/admin/all', protectAdmin, getAdminNotices);
router.post('/', protectAdmin, createNotice);
router.put('/:id', protectAdmin, updateNotice);
router.delete('/:id', protectAdmin, deleteNotice);

module.exports = router;
