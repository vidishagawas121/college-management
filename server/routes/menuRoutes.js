const express = require('express');
const router = express.Router();
const {
  getNavigationMenu,
  getAdminMenu,
  updateNavigationMenu,
} = require('../controllers/menuController');
const { protectAdmin } = require('../middleware/auth');

// Public
router.get('/', getNavigationMenu);

// Admin
router.get('/admin', protectAdmin, getAdminMenu);
router.put('/admin', protectAdmin, updateNavigationMenu);

module.exports = router;
