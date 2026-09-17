const Event = require('../models/Event');
const generateSlug = require('../utils/slugify');

// @desc    Get all published events (Public)
// @route   GET /api/events
// @access  Public
exports.getPublicEvents = async (req, res, next) => {
  try {
    const { type, category, featured, limit } = req.query;
    const filter = { status: 'PUBLISHED' };
    const now = new Date();

    if (category && category !== 'ALL') filter.category = category;
    if (featured === 'true') filter.isFeatured = true;

    if (type === 'upcoming') {
      filter.$or = [
        { date: { $gte: now } },
        { endDate: { $gte: now } }
      ];
    } else if (type === 'past') {
      filter.date = { $lt: now };
      filter.$or = [
        { endDate: { $exists: false } },
        { endDate: { $lt: now } }
      ];
    }

    let query = Event.find(filter);
    if (type === 'past') {
      query = query.sort({ date: -1 });
    } else {
      query = query.sort({ date: 1 });
    }

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const events = await query;

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single published event by slug (Public)
// @route   GET /api/events/slug/:slug
// @access  Public
exports.getEventBySlug = async (req, res, next) => {
  try {
    const event = await Event.findOne({
      slug: req.params.slug,
      status: 'PUBLISHED',
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Fetch related events
    const relatedEvents = await Event.find({
      _id: { $ne: event._id },
      status: 'PUBLISHED',
      category: event.category,
    }).limit(3).sort({ date: 1 });

    res.json({
      success: true,
      data: event,
      relatedEvents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events (Admin)
// @route   GET /api/admin/events
// @access  Private (Admin)
exports.getAdminEvents = async (req, res, next) => {
  try {
    const { category, search, status } = req.query;
    const filter = {};

    if (category && category !== 'ALL') filter.category = category;
    if (status && status !== 'ALL') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(filter).sort({ date: -1 });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create event
// @route   POST /api/admin/events
// @access  Private (Admin)
exports.createEvent = async (req, res, next) => {
  try {
    const { title, slug } = req.body;
    let finalSlug = slug ? generateSlug(slug) : generateSlug(title);

    const existing = await Event.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const event = await Event.create({
      ...req.body,
      slug: finalSlug,
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/admin/events/:id
// @access  Private (Admin)
exports.updateEvent = async (req, res, next) => {
  try {
    if (req.body.title && !req.body.slug) {
      req.body.slug = generateSlug(req.body.title);
    } else if (req.body.slug) {
      req.body.slug = generateSlug(req.body.slug);
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Private (Admin)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
