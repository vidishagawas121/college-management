const Achievement = require('../models/Achievement');

// @desc    Get all published achievements (Public)
// @route   GET /api/achievements
// @access  Public
exports.getPublicAchievements = async (req, res, next) => {
  try {
    const { category, level, featured, department } = req.query;
    const filter = { status: 'PUBLISHED' };

    if (category && category !== 'ALL') filter.category = category;
    if (level && level !== 'ALL') filter.level = level;
    if (featured === 'true') filter.isFeatured = true;
    if (department) filter.department = department;

    const achievements = await Achievement.find(filter)
      .populate('department', 'name shortName')
      .sort({ date: -1, createdAt: -1 });

    res.json({
      success: true,
      count: achievements.length,
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all achievements (Admin)
// @route   GET /api/admin/achievements
// @access  Private (Admin)
exports.getAdminAchievements = async (req, res, next) => {
  try {
    const { category, search, status } = req.query;
    const filter = {};

    if (category && category !== 'ALL') filter.category = category;
    if (status && status !== 'ALL') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { recipient: { $regex: search, $options: 'i' } },
      ];
    }

    const achievements = await Achievement.find(filter)
      .populate('department', 'name shortName')
      .sort({ date: -1, createdAt: -1 });

    res.json({
      success: true,
      count: achievements.length,
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create achievement
// @route   POST /api/admin/achievements
// @access  Private (Admin)
exports.createAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.create(req.body);
    const populated = await Achievement.findById(achievement._id).populate('department', 'name shortName');

    res.status(201).json({
      success: true,
      message: 'Achievement record created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update achievement
// @route   PUT /api/admin/achievements/:id
// @access  Private (Admin)
exports.updateAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('department', 'name shortName');

    if (!achievement) {
      return res.status(404).json({ success: false, message: 'Achievement record not found' });
    }

    res.json({
      success: true,
      message: 'Achievement record updated successfully',
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete achievement
// @route   DELETE /api/admin/achievements/:id
// @access  Private (Admin)
exports.deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) {
      return res.status(404).json({ success: false, message: 'Achievement record not found' });
    }
    res.json({
      success: true,
      message: 'Achievement record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
