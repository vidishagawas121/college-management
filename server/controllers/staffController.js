const Staff = require('../models/Staff');
const generateSlug = require('../utils/slugify');

// @desc    Get all published staff / faculty (Public)
// @route   GET /api/staff
// @access  Public
exports.getPublicStaff = async (req, res, next) => {
  try {
    const { department, search, featured } = req.query;
    const filter = { status: 'PUBLISHED' };

    if (department) filter.department = department;
    if (featured === 'true') filter.isFeatured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { qualification: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ];
    }

    const staffList = await Staff.find(filter)
      .populate('department', 'name shortName slug')
      .sort({ displayOrder: 1, name: 1 });

    res.json({
      success: true,
      count: staffList.length,
      data: staffList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single published staff by slug (Public)
// @route   GET /api/staff/slug/:slug
// @access  Public
exports.getStaffBySlug = async (req, res, next) => {
  try {
    const staff = await Staff.findOne({
      slug: req.params.slug,
      status: 'PUBLISHED',
    }).populate('department', 'name shortName slug headOfDepartment');

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Faculty member not found' });
    }

    res.json({
      success: true,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all staff (Admin)
// @route   GET /api/admin/staff
// @access  Private (Admin)
exports.getAdminStaff = async (req, res, next) => {
  try {
    const { department, search, status } = req.query;
    const filter = {};

    if (department && department !== 'ALL') filter.department = department;
    if (status && status !== 'ALL') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const staffList = await Staff.find(filter)
      .populate('department', 'name shortName slug')
      .sort({ displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      count: staffList.length,
      data: staffList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single staff by ID (Admin)
// @route   GET /api/admin/staff/:id
// @access  Private (Admin)
exports.getStaffById = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('department');
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Faculty member not found' });
    }
    res.json({
      success: true,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create staff member
// @route   POST /api/admin/staff
// @access  Private (Admin)
exports.createStaff = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    let finalSlug = slug ? generateSlug(slug) : generateSlug(name);

    // Check slug collision
    const existing = await Staff.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const staff = await Staff.create({
      ...req.body,
      slug: finalSlug,
    });

    const populatedStaff = await Staff.findById(staff._id).populate('department', 'name shortName');

    res.status(201).json({
      success: true,
      message: 'Faculty member added successfully',
      data: populatedStaff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update staff member
// @route   PUT /api/admin/staff/:id
// @access  Private (Admin)
exports.updateStaff = async (req, res, next) => {
  try {
    if (req.body.name && !req.body.slug) {
      req.body.slug = generateSlug(req.body.name);
    } else if (req.body.slug) {
      req.body.slug = generateSlug(req.body.slug);
    }

    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('department', 'name shortName');

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Faculty member not found' });
    }

    res.json({
      success: true,
      message: 'Faculty member updated successfully',
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete staff member
// @route   DELETE /api/admin/staff/:id
// @access  Private (Admin)
exports.deleteStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Faculty member not found' });
    }
    res.json({
      success: true,
      message: 'Faculty member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
