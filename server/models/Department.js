const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
      unique: true,
    },
    shortName: {
      type: String,
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
      default: '',
    },
    headOfDepartment: {
      type: String,
      default: '',
    },
    headPhoto: {
      type: String,
      default: '',
    },
    headMessage: {
      type: String,
      default: '',
    },
    courses: [
      {
        name: { type: String, required: true },
        degree: { type: String, default: 'B.Tech' },
        duration: { type: String, default: '4 Years' },
        intake: { type: Number, default: 60 },
        eligibility: { type: String, default: '10+2 with 60% in PCM' },
      }
    ],
    facilities: {
      type: [String],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '',
    },
    gallery: {
      type: [String],
      default: [],
    },
    contactEmail: {
      type: String,
      trim: true,
      default: '',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    displayOrder: {
      type: Number,
      default: 0,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for staff members belonging to this department
DepartmentSchema.virtual('faculty', {
  ref: 'Staff',
  localField: '_id',
  foreignField: 'department',
  justOne: false,
});

module.exports = mongoose.model('Department', DepartmentSchema);
