const Menu = require('../models/Menu');

// Default initial menu structure
const defaultMenuItems = [
  { title: 'Home', url: '/', order: 1, isActive: true },
  {
    title: 'About Us',
    url: '/about',
    order: 2,
    isActive: true,
    children: [
      { title: 'Overview & History', url: '/about', order: 1, isActive: true },
      { title: 'Vision & Mission', url: '/vision-mission', order: 2, isActive: true },
      { title: "Principal's Message", url: '/principal-message', order: 3, isActive: true },
      { title: 'Campus Facilities', url: '/facilities', order: 4, isActive: true },
    ]
  },
  { title: 'Departments', url: '/departments', order: 3, isActive: true },
  { title: 'Faculty', url: '/staff', order: 4, isActive: true },
  { title: 'Courses', url: '/courses', order: 5, isActive: true },
  {
    title: 'Admissions',
    url: '/admissions',
    order: 6,
    isActive: true,
    children: [
      { title: 'Admissions Overview', url: '/admissions', order: 1, isActive: true },
      { title: 'Admission Notices & Forms', url: '/admissions/notices', order: 2, isActive: true },
    ]
  },
  { title: 'Events', url: '/events', order: 7, isActive: true },
  { title: 'News & Articles', url: '/articles', order: 8, isActive: true },
  { title: 'Achievements', url: '/achievements', order: 9, isActive: true },
  { title: 'Notices', url: '/notices', order: 10, isActive: true },
  { title: 'Gallery', url: '/gallery', order: 11, isActive: true },
  { title: 'Contact Us', url: '/contact', order: 12, isActive: true },
];

// @desc    Get Navigation Menu (Public)
// @route   GET /api/menus
// @access  Public
exports.getNavigationMenu = async (req, res, next) => {
  try {
    let menu = await Menu.findOne({ name: 'main-navigation' });
    if (!menu) {
      menu = await Menu.create({
        name: 'main-navigation',
        items: defaultMenuItems,
      });
    }

    // Filter only active items for public
    const activeItems = menu.items
      .filter(item => item.isActive)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        ...item.toObject(),
        children: (item.children || [])
          .filter(c => c.isActive)
          .sort((a, b) => a.order - b.order)
      }));

    res.json({
      success: true,
      data: activeItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Navigation Menu Items (Admin)
// @route   GET /api/admin/menus
// @access  Private (Admin)
exports.getAdminMenu = async (req, res, next) => {
  try {
    let menu = await Menu.findOne({ name: 'main-navigation' });
    if (!menu) {
      menu = await Menu.create({
        name: 'main-navigation',
        items: defaultMenuItems,
      });
    }

    res.json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Navigation Menu (Admin)
// @route   PUT /api/admin/menus
// @access  Private (Admin)
exports.updateNavigationMenu = async (req, res, next) => {
  try {
    const { items } = req.body;

    let menu = await Menu.findOne({ name: 'main-navigation' });
    if (!menu) {
      menu = new Menu({ name: 'main-navigation', items });
    } else {
      menu.items = items;
    }

    await menu.save();

    res.json({
      success: true,
      message: 'Navigation menu updated successfully',
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};
