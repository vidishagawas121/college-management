const express = require('express');
const router = express.Router();
const {
  getPublicDepartments,
  getDepartmentBySlug,
  getAdminDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { protectAdmin } = require('../middleware/auth');

// Public
router.get('/', getPublicDepartments);
router.get('/slug/:slug', getDepartmentBySlug);

// Admin
router.get('/admin/all', protectAdmin, getAdminDepartments);
router.get('/admin/:id', protectAdmin, getDepartmentById);
router.post('/', protectAdmin, createDepartment);
router.put('/:id', protectAdmin, updateDepartment);
router.delete('/:id', protectAdmin, deleteDepartment);

module.exports = router;
