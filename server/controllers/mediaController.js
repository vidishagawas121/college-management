const path = require('path');
const fs = require('fs');

// @desc    Upload single or multiple files
// @route   POST /api/admin/media/upload
// @access  Private (Admin)
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ success: false, message: 'Please upload at least one file' });
    }

    if (req.file) {
      const isPdf = req.file.mimetype === 'application/pdf';
      const fileUrl = isPdf 
        ? `/uploads/documents/${req.file.filename}` 
        : `/uploads/images/${req.file.filename}`;

      return res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          url: fileUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: (req.file.size / (1024 * 1024)).toFixed(2) + ' MB',
          mimetype: req.file.mimetype,
        }
      });
    }

    if (req.files && req.files.length > 0) {
      const filesData = req.files.map(file => {
        const isPdf = file.mimetype === 'application/pdf';
        const fileUrl = isPdf 
          ? `/uploads/documents/${file.filename}` 
          : `/uploads/images/${file.filename}`;

        return {
          url: fileUrl,
          filename: file.filename,
          originalName: file.originalname,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          mimetype: file.mimetype,
        };
      });

      return res.status(201).json({
        success: true,
        message: `${req.files.length} files uploaded successfully`,
        data: filesData,
      });
    }
  } catch (error) {
    next(error);
  }
};
