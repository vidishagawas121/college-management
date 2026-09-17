const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Notice content / description is required'],
    },
    category: {
      type: String,
      enum: ['General', 'Academic', 'Examination', 'Admission', 'Events', 'Important', 'Circular', 'Hostel & Transport'],
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    attachmentPdf: {
      type: String,
      default: '',
    },
    externalLink: {
      type: String,
      default: '',
    },
    publishDate: {
      type: Date,
      default: Date.now,
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

// Virtual to check if notice is currently active (not expired, published)
NoticeSchema.virtual('isActive').get(function () {
  const now = new Date();
  const isPub = this.status === 'PUBLISHED';
  const isAfterPublish = !this.publishDate || new Date(this.publishDate) <= now;
  const isBeforeExpiry = !this.expiryDate || new Date(this.expiryDate) >= now;
  return isPub && isAfterPublish && isBeforeExpiry;
});

module.exports = mongoose.model('Notice', NoticeSchema);
