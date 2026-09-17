const Page = require('../models/Page');
const generateSlug = require('../utils/slugify');

// @desc    Get published dynamic page by slug (Public)
// @route   GET /api/pages/:slug
// @access  Public
exports.getPublicPageBySlug = async (req, res, next) => {
  try {
    const page = await Page.findOne({
      slug: req.params.slug,
      status: 'PUBLISHED',
    });

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    res.json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pages (Admin)
// @route   GET /api/admin/pages
// @access  Private (Admin)
exports.getAdminPages = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'ALL') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    const pages = await Page.find(filter).sort({ displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      count: pages.length,
      data: pages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create dynamic page
// @route   POST /api/admin/pages
// @access  Private (Admin)
exports.createPage = async (req, res, next) => {
  try {
    const { title, slug } = req.body;
    let finalSlug = slug ? generateSlug(slug) : generateSlug(title);

    const existing = await Page.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A page with this slug already exists' });
    }

    const page = await Page.create({
      ...req.body,
      slug: finalSlug,
    });

    res.status(201).json({
      success: true,
      message: 'Page created successfully',
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update dynamic page
// @route   PUT /api/admin/pages/:id
// @access  Private (Admin)
exports.updatePage = async (req, res, next) => {
  try {
    if (req.body.title && !req.body.slug) {
      req.body.slug = generateSlug(req.body.title);
    } else if (req.body.slug) {
      req.body.slug = generateSlug(req.body.slug);
    }

    const page = await Page.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    res.json({
      success: true,
      message: 'Page updated successfully',
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete dynamic page
// @route   DELETE /api/admin/pages/:id
// @access  Private (Admin)
exports.deletePage = async (req, res, next) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    res.json({
      success: true,
      message: 'Page deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
