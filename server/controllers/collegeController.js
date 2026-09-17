const CollegeInfo = require('../models/CollegeInfo');

// @desc    Get College Information
// @route   GET /api/college
// @access  Public
exports.getCollegeInfo = async (req, res, next) => {
  try {
    let college = await CollegeInfo.findOne();
    if (!college) {
      college = await CollegeInfo.create({
        collegeName: 'Apex Institute of Technology & Sciences',
      });
    }
    res.json({
      success: true,
      data: college,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update College Information
// @route   PUT /api/college
// @access  Private (Admin)
exports.updateCollegeInfo = async (req, res, next) => {
  try {
    let college = await CollegeInfo.findOne();
    if (!college) {
      college = new CollegeInfo(req.body);
    } else {
      Object.assign(college, req.body);
    }
    await college.save();
    res.json({
      success: true,
      message: 'College information updated successfully',
      data: college,
    });
  } catch (error) {
    next(error);
  }
};
