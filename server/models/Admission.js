const mongoose = require('mongoose');

const AdmissionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Admission notice title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Undergraduate', 'Postgraduate', 'Diploma', 'Ph.D', 'Lateral Entry', 'General'],
      default: 'Undergraduate',
    },
    academicYear: {
      type: String,
      default: '2026-2027',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    coursesOffered: {
      type: [String],
      default: [],
    },
    eligibility: {
      type: String,
      default: '',
    },
    procedure: {
      type: String,
      default: '',
    },
    feeStructure: {
      type: String,
      default: '',
    },
    importantDates: [
      {
        event: { type: String, required: true },
        date: { type: String, required: true },
      },
    ],
    requiredDocuments: {
      type: [String],
      default: [],
    },
    attachmentPdf: {
      type: String,
      default: '',
    },
    externalApplyUrl: {
      type: String,
      default: '',
    },
    contactHelpline: {
      type: String,
      default: '+91 (0) 1234-567890 / admissions@college.edu',
    },
    expiryDate: {
      type: Date,
    },
    isFeatured: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model('Admission', AdmissionSchema);
