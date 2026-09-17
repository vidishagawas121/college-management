const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema(
  {
    collegeName: {
      type: String,
      default: 'Apex Institute of Technology & Sciences',
      trim: true,
    },
    shortName: {
      type: String,
      default: 'AITS',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Pioneering Academic Excellence & Modern Innovation',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    faviconUrl: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: 'Knowledge Park IV, Educational Expressway, Metropolis Campus - 400012',
    },
    phone: {
      type: String,
      default: '+91 (0) 1234 567890 / 567891',
    },
    emergencyPhone: {
      type: String,
      default: '+91 (0) 1234 999111',
    },
    email: {
      type: String,
      default: 'info@college.edu',
    },
    admissionsEmail: {
      type: String,
      default: 'admissions@college.edu',
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      instagram: { type: String, default: 'https://instagram.com' },
    },
    mapEmbedUrl: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.2233913121413!2d77.4820014!3d28.5029312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDMwJzEwLjUiTiA3N8KwMjgnNTUuMiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin',
    },
    footerAbout: {
      type: String,
      default: 'Apex Institute of Technology & Sciences is a premier center of higher education and innovative research, recognized for holistic learning and top tier career opportunities.',
    },
    copyrightText: {
      type: String,
      default: '© 2026 Apex Institute of Technology & Sciences. All rights reserved.',
    },
    defaultSeo: {
      metaTitle: { type: String, default: 'Apex Institute of Technology & Sciences | Leading Engineering & Science College' },
      metaDescription: { type: String, default: 'Official portal of Apex Institute of Technology & Sciences. Offering top-ranked engineering, sciences and research degrees.' },
      ogImage: { type: String, default: '' },
      keywords: { type: String, default: 'college, engineering, computer science, admissions 2026, tech degrees, campus life' },
    },
    activeAdmissionAlert: {
      enabled: { type: Boolean, default: true },
      text: { type: String, default: 'Admissions Open for Academic Year 2026-27! Apply online now.' },
      link: { type: String, default: '/admissions' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', SettingSchema);
