const Setting = require('../models/Setting');

// @desc    Get website settings (Public)
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update website settings (Admin)
// @route   PUT /api/admin/settings
// @access  Private (Admin)
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({
      success: true,
      message: 'Website settings updated successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
