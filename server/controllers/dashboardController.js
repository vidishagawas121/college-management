const Staff = require('../models/Staff');
const Department = require('../models/Department');
const Event = require('../models/Event');
const Article = require('../models/Article');
const Achievement = require('../models/Achievement');
const Admission = require('../models/Admission');
const Notice = require('../models/Notice');
const Gallery = require('../models/Gallery');
const Document = require('../models/Document');
const Enquiry = require('../models/Enquiry');
const Page = require('../models/Page');

// @desc    Get dynamic dashboard statistics & recent activity
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();

    const [
      totalStaff,
      totalDepartments,
      totalEvents,
      upcomingEventsCount,
      totalArticles,
      totalAchievements,
      activeAdmissionsCount,
      activeNoticesCount,
      totalGalleryAlbums,
      totalDocuments,
      newEnquiriesCount,
      totalPages,
      recentNotices,
      upcomingEvents,
      recentEnquiries,
      recentArticles,
      recentAchievements
    ] = await Promise.all([
      Staff.countDocuments(),
      Department.countDocuments(),
      Event.countDocuments(),
      Event.countDocuments({
        status: 'PUBLISHED',
        $or: [{ date: { $gte: now } }, { endDate: { $gte: now } }]
      }),
      Article.countDocuments(),
      Achievement.countDocuments(),
      Admission.countDocuments({ status: 'PUBLISHED' }),
      Notice.countDocuments({
        status: 'PUBLISHED',
        publishDate: { $lte: now },
        $or: [{ expiryDate: { $exists: false } }, { expiryDate: null }, { expiryDate: { $gte: now } }]
      }),
      Gallery.countDocuments(),
      Document.countDocuments(),
      Enquiry.countDocuments({ isRead: false }),
      Page.countDocuments(),
      // Lists
      Notice.find().sort({ createdAt: -1 }).limit(5),
      Event.find({
        $or: [{ date: { $gte: now } }, { endDate: { $gte: now } }]
      }).sort({ date: 1 }).limit(5),
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
      Article.find().sort({ createdAt: -1 }).limit(5),
      Achievement.find().populate('department', 'name shortName').sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      success: true,
      stats: {
        totalStaff,
        totalDepartments,
        totalEvents,
        upcomingEvents: upcomingEventsCount,
        totalArticles,
        totalAchievements,
        activeAdmissions: activeAdmissionsCount,
        activeNotices: activeNoticesCount,
        galleryAlbums: totalGalleryAlbums,
        totalDocuments,
        newEnquiries: newEnquiriesCount,
        totalPages,
      },
      recent: {
        notices: recentNotices,
        events: upcomingEvents,
        enquiries: recentEnquiries,
        articles: recentArticles,
        achievements: recentAchievements,
      }
    });
  } catch (error) {
    next(error);
  }
};
