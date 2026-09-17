const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Academic', 'Sports', 'Cultural', 'Research & Patents', 'Innovation & Hackathon', 'Faculty Recognition', 'Institutional Award'],
      default: 'Academic',
    },
    recipient: {
      type: String,
      required: [true, 'Recipient / Team name is required'],
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
    },
    level: {
      type: String,
      enum: ['International', 'National', 'State', 'University', 'Zonal', 'Inter-College'],
      default: 'National',
    },
    description: {
      type: String,
      required: [true, 'Achievement description is required'],
    },
    photo: {
      type: String,
      default: '',
    },
    certificateUrl: {
      type: String,
      default: '',
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

module.exports = mongoose.model('Achievement', AchievementSchema);
