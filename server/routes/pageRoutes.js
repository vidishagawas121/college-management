const express = require('express');
const router = express.Router();
const {
  getPublicPageBySlug,
  getAdminPages,
  createPage,
  updatePage,
  deletePage,
} = require('../controllers/pageController');
const { protectAdmin } = require('../middleware/auth');

// Public
router.get('/slug/:slug', getPublicPageBySlug);

// Admin
router.get('/admin/all', protectAdmin, getAdminPages);
router.post('/', protectAdmin, createPage);
router.put('/:id', protectAdmin, updatePage);
router.delete('/:id', protectAdmin, deletePage);

module.exports = router;
