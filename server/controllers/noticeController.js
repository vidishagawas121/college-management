const Notice = require('../models/Notice');
const generateSlug = require('../utils/slugify');

// @desc    Get all active published notices (Public)
// @route   GET /api/notices
// @access  Public
exports.getPublicNotices = async (req, res, next) => {
  try {
    const { category, type, search, featured, limit } = req.query;
    const now = new Date();

    const filter = { status: 'PUBLISHED' };

    if (category && category !== 'ALL') filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (type === 'archived') {
      // Expired notices
      filter.expiryDate = { $lt: now };
    } else {
      // Active notices: published <= now, and (no expiry OR expiry >= now)
      filter.publishDate = { $lte: now };
      filter.$or = [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gte: now } },
      ];
    }

    let query = Notice.find(filter).sort({ priority: -1, publishDate: -1, createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const notices = await query;

    res.json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single published notice by slug (Public)
// @route   GET /api/notices/slug/:slug
// @access  Public
exports.getNoticeBySlug = async (req, res, next) => {
  try {
    const notice = await Notice.findOne({
      slug: req.params.slug,
      status: 'PUBLISHED',
    });

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    res.json({
      success: true,
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all notices (Admin)
// @route   GET /api/admin/notices
// @access  Private (Admin)
exports.getAdminNotices = async (req, res, next) => {
  try {
    const { category, search, status, priority } = req.query;
    const filter = {};

    if (category && category !== 'ALL') filter.category = category;
    if (status && status !== 'ALL') filter.status = status;
    if (priority && priority !== 'ALL') filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const notices = await Notice.find(filter).sort({ publishDate: -1, createdAt: -1 });

    res.json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create notice
// @route   POST /api/admin/notices
// @access  Private (Admin)
exports.createNotice = async (req, res, next) => {
  try {
    const { title, slug } = req.body;
    let finalSlug = slug ? generateSlug(slug) : generateSlug(title);

    const existing = await Notice.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const notice = await Notice.create({
      ...req.body,
      slug: finalSlug,
    });

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update notice
// @route   PUT /api/admin/notices/:id
// @access  Private (Admin)
exports.updateNotice = async (req, res, next) => {
  try {
    if (req.body.title && !req.body.slug) {
      req.body.slug = generateSlug(req.body.title);
    } else if (req.body.slug) {
      req.body.slug = generateSlug(req.body.slug);
    }

    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    res.json({
      success: true,
      message: 'Notice updated successfully',
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notice
// @route   DELETE /api/admin/notices/:id
// @access  Private (Admin)
exports.deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }
    res.json({
      success: true,
      message: 'Notice deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
