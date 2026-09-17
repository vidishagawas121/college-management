const Department = require('../models/Department');
const Staff = require('../models/Staff');
const generateSlug = require('../utils/slugify');

// @desc    Get all published departments (Public)
// @route   GET /api/departments
// @access  Public
exports.getPublicDepartments = async (req, res, next) => {
  try {
    const { featured } = req.query;
    const filter = { status: 'PUBLISHED' };
    if (featured === 'true') filter.isFeatured = true;

    const departments = await Department.find(filter)
      .sort({ displayOrder: 1, createdAt: 1 })
      .populate({
        path: 'faculty',
        match: { status: 'PUBLISHED' },
        select: 'name designation qualification photo email specialization',
      });

    res.json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single published department by slug (Public)
// @route   GET /api/departments/slug/:slug
// @access  Public
exports.getDepartmentBySlug = async (req, res, next) => {
  try {
    const department = await Department.findOne({
      slug: req.params.slug,
      status: 'PUBLISHED',
    }).populate({
      path: 'faculty',
      match: { status: 'PUBLISHED' },
      options: { sort: { displayOrder: 1, createdAt: 1 } },
    });

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all departments (Admin)
// @route   GET /api/admin/departments
// @access  Private (Admin)
exports.getAdminDepartments = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    if (status && status !== 'ALL') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortName: { $regex: search, $options: 'i' } },
        { headOfDepartment: { $regex: search, $options: 'i' } },
      ];
    }

    const departments = await Department.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .populate('faculty');

    res.json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single department by ID (Admin)
// @route   GET /api/admin/departments/:id
// @access  Private (Admin)
exports.getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id).populate('faculty');
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create department
// @route   POST /api/admin/departments
// @access  Private (Admin)
exports.createDepartment = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    const finalSlug = slug ? generateSlug(slug) : generateSlug(name);

    // Check slug uniqueness
    const existing = await Department.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A department with this name or slug already exists' });
    }

    const department = await Department.create({
      ...req.body,
      slug: finalSlug,
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update department
// @route   PUT /api/admin/departments/:id
// @access  Private (Admin)
exports.updateDepartment = async (req, res, next) => {
  try {
    if (req.body.name && !req.body.slug) {
      req.body.slug = generateSlug(req.body.name);
    } else if (req.body.slug) {
      req.body.slug = generateSlug(req.body.slug);
    }

    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.json({
      success: true,
      message: 'Department updated successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete department
// @route   DELETE /api/admin/departments/:id
// @access  Private (Admin)
exports.deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    // Remove references or update assigned staff
    await Staff.updateMany({ department: req.params.id }, { $unset: { department: 1 } });

    res.json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
