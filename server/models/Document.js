const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Prospectus', 'Academic Calendar', 'Admission Forms', 'Circulars', 'Examination Rules', 'Syllabus', 'Annual Reports', 'Mandatory Disclosures', 'Scholarship Forms', 'General'],
      default: 'General',
    },
    fileUrl: {
      type: String,
      required: [true, 'Document file path is required'],
    },
    fileName: {
      type: String,
      default: '',
    },
    fileType: {
      type: String,
      default: 'application/pdf',
    },
    fileSize: {
      type: String,
      default: '1.2 MB',
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'],
      default: 'PUBLISHED',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', DocumentSchema);
