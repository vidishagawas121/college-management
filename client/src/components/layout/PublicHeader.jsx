import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, GraduationCap, ChevronDown, Menu, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { useCollege } from '../../context/CollegeContext';

const PublicHeader = () => {
  const { collegeInfo, settings, navigationMenu } = useCollege();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const collegeName = collegeInfo?.collegeName || settings?.collegeName || 'Apex Institute of Technology & Sciences';
  const shortName = collegeInfo?.shortName || settings?.shortName || 'AITS';
  const tagline = collegeInfo?.tagline || settings?.tagline || 'Pioneering Academic Excellence & Innovation';
  const phone = settings?.phone || '+91 (0) 1234 567890';
  const email = settings?.email || 'info@college.edu';

  // Fallback menu if context is loading
  const defaultMenu = [
    { title: 'Home', url: '/' },
    {
      title: 'About Us',
      url: '/about',
      children: [
        { title: 'Overview & History', url: '/about' },
        { title: 'Vision & Mission', url: '/vision-mission' },
        { title: "Principal's Message", url: '/principal-message' },
        { title: 'Campus Facilities', url: '/facilities' },
      ]
    },
    { title: 'Departments', url: '/departments' },
    { title: 'Faculty', url: '/staff' },
    { title: 'Courses', url: '/courses' },
    {
      title: 'Admissions',
      url: '/admissions',
      children: [
        { title: 'Admissions 2026', url: '/admissions' },
        { title: 'Notices & Forms', url: '/admissions/notices' },
      ]
    },
    { title: 'Events', url: '/events' },
    { title: 'News', url: '/articles' },
    { title: 'Achievements', url: '/achievements' },
    { title: 'Notices', url: '/notices' },
    { title: 'Gallery', url: '/gallery' },
    { title: 'Contact', url: '/contact' },
  ];

  const menuItems = navigationMenu && navigationMenu.length > 0 ? navigationMenu : defaultMenu;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md transition-all border-b border-[var(--color-border)]">
      {/* Top Institutional Bar */}
      <div className="bg-[var(--color-primary)] text-white/85 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href={`tel:${phone}`} className="hover:text-[var(--color-accent-light)] flex items-center gap-1.5 transition-colors">
              <Phone className="w-3.5 h-3.5 text-[var(--color-accent-light)]" />
              <span className="hidden sm:inline">{phone}</span>
            </a>
            <a href={`mailto:${email}`} className="hover:text-[var(--color-accent-light)] flex items-center gap-1.5 transition-colors">
              <Mail className="w-3.5 h-3.5 text-[var(--color-accent-light)]" />
              <span className="hidden md:inline">{email}</span>
            </a>
            <span className="hidden lg:inline-flex items-center gap-1 text-[var(--color-accent-light)] font-semibold bg-white/10 px-2 py-0.5 rounded text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-light)] animate-ping mr-0.5" />
              NAAC Grade A++ Accredited
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/courses"
              className="text-[var(--color-accent-light)] hover:text-white font-semibold transition-colors flex items-center gap-1"
            >
              Academic Programs 2026
            </Link>
            <span className="text-white/40">|</span>
            <Link
              to="/admin/login"
              className="text-white/70 hover:text-white transition-colors flex items-center gap-1"
              title="Admin Portal"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-white/70" />
              <span className="text-[11px]">Admin Access</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0 border border-[var(--color-primary-light)]">
            <GraduationCap className="w-7 h-7 text-[var(--color-accent-light)]" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-extrabold text-[var(--color-primary)] tracking-tight font-heading block leading-tight">
              {collegeName}
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:block">
              {tagline}
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/admissions"
            className="inline-flex items-center gap-2 bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <span>Apply for Admission</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Primary Navigation Bar (Desktop) */}
      <nav className="hidden lg:block bg-[var(--color-primary)] text-white border-t border-[var(--color-primary-dark)] shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center space-x-1">
            {menuItems.map((item, index) => {
              const hasChildren = item.children && item.children.length > 0;
              const isActive = location.pathname === item.url || (hasChildren && item.children.some(c => location.pathname === c.url));

              return (
                <li
                  key={item._id || index}
                  className="relative group py-1"
                  onMouseEnter={() => hasChildren && setActiveDropdown(item.title)}
                  onMouseLeave={() => hasChildren && setActiveDropdown(null)}
                >
                  {hasChildren ? (
                    <button
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-colors ${
                        isActive
                          ? 'text-[var(--color-accent-light)] bg-white/10'
                          : 'text-slate-200 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{item.title}</span>
                      <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                    </button>
                  ) : (
                    <Link
                      to={item.url}
                      className={`block px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-colors ${
                        isActive
                          ? 'text-[var(--color-accent-light)] bg-white/10'
                          : 'text-slate-200 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.title}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {hasChildren && (
                    <div
                      className={`absolute left-0 top-full w-60 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 z-50 transition-all duration-200 transform origin-top-left ${
                        activeDropdown === item.title ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                      }`}
                    >
                      {item.children.map((child, cIdx) => (
                        <Link
                          key={cIdx}
                          to={child.url}
                          className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-900 transition-colors"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="px-4 pt-3 pb-6 space-y-1">
            {menuItems.map((item, index) => {
              const hasChildren = item.children && item.children.length > 0;
              const isItemActive = location.pathname === item.url;

              return (
                <div key={item._id || index} className="border-b border-slate-100 last:border-0 pb-1">
                  {hasChildren ? (
                    <div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.title ? null : item.title)}
                        className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
                      >
                        <span>{item.title}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 transition-transform ${
                            activeDropdown === item.title ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {activeDropdown === item.title && (
                        <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg mb-1">
                          {item.children.map((child, cIdx) => (
                            <Link
                              key={cIdx}
                              to={child.url}
                              className="block py-2 px-3 text-xs font-medium text-slate-600 hover:text-primary-900 rounded"
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.url}
                      className={`block py-2.5 px-3 text-sm font-semibold rounded-lg ${
                        isItemActive ? 'bg-primary-50 text-primary-900' : 'text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              );
            })}

            <div className="pt-4">
              <Link
                to="/admissions"
                className="w-full text-center block bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white font-bold py-3 rounded-xl text-sm shadow"
              >
                Apply for Admission 2026
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
