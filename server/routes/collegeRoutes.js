const express = require('express');
const router = express.Router();
const { getCollegeInfo, updateCollegeInfo } = require('../controllers/collegeController');
const { protectAdmin } = require('../middleware/auth');

router.get('/', getCollegeInfo);
router.put('/', protectAdmin, updateCollegeInfo);

module.exports = router;
