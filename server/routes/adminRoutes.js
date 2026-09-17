const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { uploadFile } = require('../controllers/mediaController');
const { protectAdmin } = require('../middleware/auth');
const upload = require('../config/multer');

// Dashboard statistics
router.get('/dashboard/stats', protectAdmin, getDashboardStats);

// Central media upload
router.post('/media/upload', protectAdmin, upload.single('file'), uploadFile);
router.post('/media/upload-multiple', protectAdmin, upload.array('files', 12), uploadFile);

module.exports = router;
