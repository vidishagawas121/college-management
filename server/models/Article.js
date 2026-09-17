const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    featuredImage: {
      type: String,
      default: '',
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: 300,
    },
    content: {
      type: String,
      required: [true, 'Full content is required'],
    },
    author: {
      type: String,
      default: 'College Media & Public Relations Cell',
      trim: true,
    },
    category: {
      type: String,
      enum: ['Campus News', 'Research & Innovation', 'Student Life', 'Faculty Spotlight', 'Events & Highlights', 'Alumni Story', 'General'],
      default: 'Campus News',
    },
    tags: {
      type: [String],
      default: ['College', 'Education'],
    },
    publicationDate: {
      type: Date,
      default: Date.now,
    },
    readTimeMinutes: {
      type: Number,
      default: 4,
    },
    seoTitle: {
      type: String,
      trim: true,
      default: '',
    },
    seoDescription: {
      type: String,
      trim: true,
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

ArticleSchema.index({ title: 'text', shortDescription: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Article', ArticleSchema);
