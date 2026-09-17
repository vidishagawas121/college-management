const Article = require('../models/Article');
const generateSlug = require('../utils/slugify');

// @desc    Get all published articles / news (Public)
// @route   GET /api/articles
// @access  Public
exports.getPublicArticles = async (req, res, next) => {
  try {
    const { category, tag, search, featured, page = 1, limit = 9 } = req.query;
    const filter = { status: 'PUBLISHED' };

    if (category && category !== 'ALL') filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (featured === 'true') filter.isFeatured = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Article.countDocuments(filter);
    const articles = await Article.find(filter)
      .sort({ publicationDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: articles.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single published article by slug (Public)
// @route   GET /api/articles/slug/:slug
// @access  Public
exports.getArticleBySlug = async (req, res, next) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      status: 'PUBLISHED',
    });

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Fetch related articles
    const relatedArticles = await Article.find({
      _id: { $ne: article._id },
      status: 'PUBLISHED',
      category: article.category,
    }).limit(3).sort({ publicationDate: -1 });

    res.json({
      success: true,
      data: article,
      relatedArticles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all articles (Admin)
// @route   GET /api/admin/articles
// @access  Private (Admin)
exports.getAdminArticles = async (req, res, next) => {
  try {
    const { category, search, status } = req.query;
    const filter = {};

    if (category && category !== 'ALL') filter.category = category;
    if (status && status !== 'ALL') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const articles = await Article.find(filter).sort({ publicationDate: -1, createdAt: -1 });

    res.json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create article
// @route   POST /api/admin/articles
// @access  Private (Admin)
exports.createArticle = async (req, res, next) => {
  try {
    const { title, slug, content } = req.body;
    let finalSlug = slug ? generateSlug(slug) : generateSlug(title);

    const existing = await Article.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Calculate approximate read time
    const wordCount = content ? content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const article = await Article.create({
      ...req.body,
      slug: finalSlug,
      readTimeMinutes,
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update article
// @route   PUT /api/admin/articles/:id
// @access  Private (Admin)
exports.updateArticle = async (req, res, next) => {
  try {
    if (req.body.title && !req.body.slug) {
      req.body.slug = generateSlug(req.body.title);
    } else if (req.body.slug) {
      req.body.slug = generateSlug(req.body.slug);
    }

    if (req.body.content) {
      const wordCount = req.body.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
      req.body.readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    }

    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete article
// @route   DELETE /api/admin/articles/:id
// @access  Private (Admin)
exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
