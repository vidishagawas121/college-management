const express = require('express');
const router = express.Router();
const {
  getPublicGalleries,
  getGalleryBySlug,
  getAdminGalleries,
  createGallery,
  updateGallery,
  deleteGallery,
} = require('../controllers/galleryController');
const { protectAdmin } = require('../middleware/auth');

// Public
router.get('/', getPublicGalleries);
router.get('/slug/:slug', getGalleryBySlug);

// Admin
router.get('/admin/all', protectAdmin, getAdminGalleries);
router.post('/', protectAdmin, createGallery);
router.put('/:id', protectAdmin, updateGallery);
router.delete('/:id', protectAdmin, deleteGallery);

module.exports = router;
