const Admission = require('../models/Admission');
const generateSlug = require('../utils/slugify');

// @desc    Get all published admission notices (Public)
// @route   GET /api/admissions
// @access  Public
exports.getPublicAdmissions = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const filter = { status: 'PUBLISHED' };

    if (category && category !== 'ALL') filter.category = category;
    if (featured === 'true') filter.isFeatured = true;

    const admissions = await Admission.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: admissions.length,
      data: admissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single published admission notice by slug (Public)
// @route   GET /api/admissions/slug/:slug
// @access  Public
exports.getAdmissionBySlug = async (req, res, next) => {
  try {
    const admission = await Admission.findOne({
      slug: req.params.slug,
      status: 'PUBLISHED',
    });

    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission notice not found' });
    }

    res.json({
      success: true,
      data: admission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all admission notices (Admin)
// @route   GET /api/admin/admissions
// @access  Private (Admin)
exports.getAdminAdmissions = async (req, res, next) => {
  try {
    const { category, search, status } = req.query;
    const filter = {};

    if (category && category !== 'ALL') filter.category = category;
    if (status && status !== 'ALL') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { academicYear: { $regex: search, $options: 'i' } },
      ];
    }

    const admissions = await Admission.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: admissions.length,
      data: admissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create admission notice
// @route   POST /api/admin/admissions
// @access  Private (Admin)
exports.createAdmission = async (req, res, next) => {
  try {
    const { title, slug } = req.body;
    let finalSlug = slug ? generateSlug(slug) : generateSlug(title);

    const existing = await Admission.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const admission = await Admission.create({
      ...req.body,
      slug: finalSlug,
    });

    res.status(201).json({
      success: true,
      message: 'Admission notice published successfully',
      data: admission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admission notice
// @route   PUT /api/admin/admissions/:id
// @access  Private (Admin)
exports.updateAdmission = async (req, res, next) => {
  try {
    if (req.body.title && !req.body.slug) {
      req.body.slug = generateSlug(req.body.title);
    } else if (req.body.slug) {
      req.body.slug = generateSlug(req.body.slug);
    }

    const admission = await Admission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission notice not found' });
    }

    res.json({
      success: true,
      message: 'Admission notice updated successfully',
      data: admission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete admission notice
// @route   DELETE /api/admin/admissions/:id
// @access  Private (Admin)
exports.deleteAdmission = async (req, res, next) => {
  try {
    const admission = await Admission.findByIdAndDelete(req.params.id);
    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission notice not found' });
    }
    res.json({
      success: true,
      message: 'Admission notice deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
