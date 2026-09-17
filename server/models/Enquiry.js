const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Your name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Your email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
    },
    category: {
      type: String,
      enum: ['General Enquiry', 'Admissions', 'Academic Information', 'Fee / Scholarship', 'Campus Visit', 'Placements', 'Grievance / Feedback'],
      default: 'General Enquiry',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    adminNotes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
      default: 'NEW',
    },
  },
  {
    timestamps: true,
  }
);

EnquirySchema.index({ name: 'text', email: 'text', subject: 'text', message: 'text' });

module.exports = mongoose.model('Enquiry', EnquirySchema);
