const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
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
      required: [true, 'Event description is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event start date is required'],
    },
    endDate: {
      type: Date,
    },
    startTime: {
      type: String,
      default: '09:00 AM',
    },
    endTime: {
      type: String,
      default: '05:00 PM',
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      default: 'Main Auditorium, Campus Block A',
    },
    organizer: {
      type: String,
      default: 'AITS Events Committee',
    },
    category: {
      type: String,
      enum: ['Academic', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Conference', 'Alumni', 'General'],
      default: 'Academic',
    },
    coverImage: {
      type: String,
      default: '',
    },
    gallery: {
      type: [String],
      default: [],
    },
    registrationLink: {
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for auto status: upcoming, ongoing, past
EventSchema.virtual('timeStatus').get(function () {
  const now = new Date();
  const eventDate = new Date(this.date);
  const eventEnd = this.endDate ? new Date(this.endDate) : new Date(this.date);
  eventEnd.setHours(23, 59, 59, 999);

  if (now > eventEnd) {
    return 'Completed';
  } else if (now >= eventDate && now <= eventEnd) {
    return 'Ongoing';
  } else {
    return 'Upcoming';
  }
});

module.exports = mongoose.model('Event', EventSchema);
