const express = require('express');
const router = express.Router();
const {
  getPublicAchievements,
  getAdminAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} = require('../controllers/achievementController');
const { protectAdmin } = require('../middleware/auth');

// Public
router.get('/', getPublicAchievements);

// Admin
router.get('/admin/all', protectAdmin, getAdminAchievements);
router.post('/', protectAdmin, createAchievement);
router.put('/:id', protectAdmin, updateAchievement);
router.delete('/:id', protectAdmin, deleteAchievement);

module.exports = router;
