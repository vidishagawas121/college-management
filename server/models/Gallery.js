const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Album title is required'],
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
      enum: ['Campus', 'Events', 'Sports', 'Cultural Activities', 'Workshops', 'Seminars', 'Annual Functions', 'Achievements', 'Departments', 'Laboratories'],
      default: 'Campus',
    },
    description: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: '' },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
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

module.exports = mongoose.model('Gallery', GallerySchema);
