const mongoose = require('mongoose');

const CollegeInfoSchema = new mongoose.Schema(
  {
    collegeName: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
      default: 'Apex Institute of Technology & Sciences',
    },
    shortName: {
      type: String,
      trim: true,
      default: 'AITS',
    },
    tagline: {
      type: String,
      trim: true,
      default: 'Pioneering Academic Excellence, Innovation & Leadership',
    },
    establishmentYear: {
      type: Number,
      default: 1998,
    },
    logo: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    aboutCollege: {
      type: String,
      default: '',
    },
    history: {
      type: String,
      default: '',
    },
    vision: {
      type: String,
      default: '',
    },
    mission: {
      type: String,
      default: '',
    },
    objectives: {
      type: [String],
      default: [],
    },
    principalName: {
      type: String,
      default: 'Dr. Arthur Pendelton, Ph.D.',
    },
    principalDesignation: {
      type: String,
      default: 'Principal & Professor of Applied Sciences',
    },
    principalMessage: {
      type: String,
      default: '',
    },
    principalPhoto: {
      type: String,
      default: '',
    },
    infrastructure: {
      type: String,
      default: '',
    },
    campusArea: {
      type: String,
      default: '50+ Acres Green Campus',
    },
    affiliations: {
      type: [String],
      default: ['National Technological University', 'State Higher Education Council'],
    },
    accreditations: {
      type: [String],
      default: ['NAAC Grade A++', 'NBA Accredited', 'NIRF Ranked Top 50'],
    },
    recognitions: {
      type: [String],
      default: ['UGC 2(f) & 12(B) Recognized', 'AICTE Approved'],
    },
    heroBannerImage: {
      type: String,
      default: '',
    },
    heroHeading: {
      type: String,
      default: 'Empowering Minds, Transforming Futures',
    },
    heroSubheading: {
      type: String,
      default: 'Discover world-class academic programs, cutting-edge research facilities, and vibrant campus life.',
    },
    heroPrimaryCtaText: {
      type: String,
      default: 'Explore Programs',
    },
    heroPrimaryCtaLink: {
      type: String,
      default: '/courses',
    },
    heroSecondaryCtaText: {
      type: String,
      default: 'Admissions 2026',
    },
    heroSecondaryCtaLink: {
      type: String,
      default: '/admissions',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CollegeInfo', CollegeInfoSchema);
