const express = require('express');
const router = express.Router();
const { login, getMe, updateProfile } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protectAdmin, getMe);
router.put('/profile', protectAdmin, updateProfile);

module.exports = router;
