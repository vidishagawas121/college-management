const Gallery = require('../models/Gallery');
const generateSlug = require('../utils/slugify');

// @desc    Get all published albums (Public)
// @route   GET /api/gallery
// @access  Public
exports.getPublicGalleries = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const filter = { status: 'PUBLISHED' };

    if (category && category !== 'ALL') filter.category = category;
    if (featured === 'true') filter.isFeatured = true;

    const galleries = await Gallery.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: galleries.length,
      data: galleries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single published album by slug (Public)
// @route   GET /api/gallery/slug/:slug
// @access  Public
exports.getGalleryBySlug = async (req, res, next) => {
  try {
    const gallery = await Gallery.findOne({
      slug: req.params.slug,
      status: 'PUBLISHED',
    });

    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery album not found' });
    }

    res.json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all albums (Admin)
// @route   GET /api/admin/gallery
// @access  Private (Admin)
exports.getAdminGalleries = async (req, res, next) => {
  try {
    const { category, search, status } = req.query;
    const filter = {};

    if (category && category !== 'ALL') filter.category = category;
    if (status && status !== 'ALL') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const galleries = await Gallery.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: galleries.length,
      data: galleries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create album
// @route   POST /api/admin/gallery
// @access  Private (Admin)
exports.createGallery = async (req, res, next) => {
  try {
    const { title, slug } = req.body;
    let finalSlug = slug ? generateSlug(slug) : generateSlug(title);

    const existing = await Gallery.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const gallery = await Gallery.create({
      ...req.body,
      slug: finalSlug,
    });

    res.status(201).json({
      success: true,
      message: 'Gallery album created successfully',
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update album
// @route   PUT /api/admin/gallery/:id
// @access  Private (Admin)
exports.updateGallery = async (req, res, next) => {
  try {
    if (req.body.title && !req.body.slug) {
      req.body.slug = generateSlug(req.body.title);
    } else if (req.body.slug) {
      req.body.slug = generateSlug(req.body.slug);
    }

    const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery album not found' });
    }

    res.json({
      success: true,
      message: 'Gallery album updated successfully',
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete album
// @route   DELETE /api/admin/gallery/:id
// @access  Private (Admin)
exports.deleteGallery = async (req, res, next) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery album not found' });
    }
    res.json({
      success: true,
      message: 'Gallery album deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
