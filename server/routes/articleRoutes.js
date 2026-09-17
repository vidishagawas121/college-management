const express = require('express');
const router = express.Router();
const {
  getPublicArticles,
  getArticleBySlug,
  getAdminArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');
const { protectAdmin } = require('../middleware/auth');

// Public
router.get('/', getPublicArticles);
router.get('/slug/:slug', getArticleBySlug);

// Admin
router.get('/admin/all', protectAdmin, getAdminArticles);
router.post('/', protectAdmin, createArticle);
router.put('/:id', protectAdmin, updateArticle);
router.delete('/:id', protectAdmin, deleteArticle);

module.exports = router;
