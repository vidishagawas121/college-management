const Document = require('../models/Document');

// @desc    Get all published documents (Public)
// @route   GET /api/documents
// @access  Public
exports.getPublicDocuments = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = { status: 'PUBLISHED' };

    if (category && category !== 'ALL') filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const documents = await Document.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track download count
// @route   POST /api/documents/:id/download
// @access  Public
exports.trackDownload = async (req, res, next) => {
  try {
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.json({
      success: true,
      downloadCount: document.downloadCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all documents (Admin)
// @route   GET /api/admin/documents
// @access  Private (Admin)
exports.getAdminDocuments = async (req, res, next) => {
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

    const documents = await Document.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create document
// @route   POST /api/admin/documents
// @access  Private (Admin)
exports.createDocument = async (req, res, next) => {
  try {
    const document = await Document.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Document record added successfully',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update document
// @route   PUT /api/admin/documents/:id
// @access  Private (Admin)
exports.updateDocument = async (req, res, next) => {
  try {
    const document = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.json({
      success: true,
      message: 'Document record updated successfully',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/admin/documents/:id
// @access  Private (Admin)
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({
      success: true,
      message: 'Document record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
