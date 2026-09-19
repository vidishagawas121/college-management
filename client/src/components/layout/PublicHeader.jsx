import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, ChevronDown, Menu, X, ArrowRight, Search, UserRound, BadgeCheck } from 'lucide-react';
import { useCollege } from '../../context/CollegeContext';

const PublicHeader = () => {
  const { collegeInfo, settings, navigationMenu } = useCollege();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  useEffect(() => { setMobileMenuOpen(false); setActiveDropdown(null); }, [location.pathname]);

  const collegeName = collegeInfo?.collegeName || settings?.collegeName || 'Apex Institute of Technology & Sciences';
  const tagline = 'Pioneering Academic Excellence, Global Research & Human Leadership';
  const phone = '+91 (0) 1234 567890 / 567891';
  const email = settings?.email || 'info@college.edu';
  const defaultMenu = [
    { title: 'HOME', url: '/' },
    {
      title: 'ABOUT US',
      url: '/about',
      children: [
        { title: 'Overview & History', url: '/about' },
        { title: 'Vision & Mission', url: '/vision-mission' },
        { title: "Principal's Message", url: '/principal-message' },
        { title: 'Campus Facilities', url: '/facilities' },
      ],
    },
    {
      title: 'DEPARTMENTS',
      url: '/departments',
      children: [
        { title: 'Computer Science & Engineering', url: '/departments' },
        { title: 'Electronics & Communication', url: '/departments' },
        { title: 'Mechanical Engineering', url: '/departments' },
        { title: 'Civil Engineering', url: '/departments' },
      ],
    },
    {
      title: 'COURSES',
      url: '/courses',
      children: [
        { title: 'Undergraduate Programs (B.Tech)', url: '/courses' },
        { title: 'Postgraduate Programs (M.Tech)', url: '/courses' },
        { title: 'Doctoral Programs (Ph.D)', url: '/courses' },
      ],
    },
    {
      title: 'ADMISSIONS',
      url: '/admissions',
      children: [
        { title: 'Admissions 2026–27', url: '/admissions' },
        { title: 'Eligibility & Criteria', url: '/admissions' },
        { title: 'Fee Structure & Scholarships', url: '/admissions' },
        { title: 'Notices & Forms', url: '/admissions/notices' },
      ],
    },
    {
      title: 'CAMPUS LIFE',
      url: '/facilities',
      children: [
        { title: 'Campus Facilities', url: '/facilities' },
        { title: 'Events & Fests', url: '/events' },
        { title: 'Clubs & Societies', url: '/events' },
        { title: 'Photo Gallery', url: '/gallery' },
      ],
    },
    {
      title: 'PLACEMENTS',
      url: '/achievements',
      children: [
        { title: 'Placement Records', url: '/achievements' },
        { title: 'Top Recruiters', url: '/achievements' },
        { title: 'Internship Statistics', url: '/achievements' },
      ],
    },
    { title: 'CONTACT', url: '/contact' },
  ];
  const menuItems = defaultMenu;

  const renderMenuItem = (item, index, mobile = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = location.pathname === item.url || (hasChildren && item.children.some(child => location.pathname === child.url));
    if (!hasChildren) return <li key={item._id || index}><Link to={item.url} className={`public-header__nav-link ${isActive ? 'is-active' : ''}`}>{item.title}</Link></li>;
    return <li key={item._id || index} className="public-header__menu-item" onMouseEnter={() => !mobile && setActiveDropdown(item.title)} onMouseLeave={() => !mobile && setActiveDropdown(null)}>
      <button type="button" className={`public-header__nav-link ${isActive ? 'is-active' : ''}`} aria-expanded={activeDropdown === item.title} onClick={() => setActiveDropdown(activeDropdown === item.title ? null : item.title)}>{item.title}<ChevronDown className={activeDropdown === item.title ? 'rotate-180' : ''} aria-hidden="true" /></button>
      {activeDropdown === item.title && <div className={`public-header__dropdown ${mobile ? 'public-header__dropdown--mobile' : ''}`}>{item.children.map((child, childIndex) => <Link key={child._id || childIndex} to={child.url} className="public-header__dropdown-link">{child.title}</Link>)}</div>}
    </li>;
  };

  return <header className="public-header">
    <div className="public-header__brand-row"><div className="public-header__container public-header__brand-inner">
      <Link to="/" className="public-header__brand" aria-label={`${collegeName} home`}>
        <span className="public-header__logo"><img src="/assets/logo.svg" alt="" /></span>
        <span className="public-header__brand-copy">
          <strong>{collegeName}</strong>
          <span>{tagline}</span>
        </span>
      </Link>
      <div className="public-header__contact">
        <a href={`tel:+911234567890`} className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-[#f15b55]" aria-hidden="true" />
          <span>{phone}</span>
        </a>
        <i aria-hidden="true" />
        <a href={`mailto:${email}`} className="flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-[#f15b55]" aria-hidden="true" />
          <span>{email}</span>
        </a>
        <i aria-hidden="true" />
        <span className="public-header__accreditation flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d8a52a] inline-block shadow-sm" />
          <span className="font-bold text-[#2b1820]">NAAC Grade A+ Accredited</span>
        </span>
      </div>
      <button type="button" className="public-header__mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" aria-label="Toggle navigation menu">{mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
    </div></div>
    <nav className="public-header__nav" aria-label="Main navigation">
      <div className="public-header__container public-header__nav-inner">
        <ul className="public-header__menu">
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </ul>
        <button type="button" className="public-header__search" aria-label="Search">
          <Search aria-hidden="true" className="w-4 h-4" />
        </button>
        <span className="public-header__nav-divider" aria-hidden="true" />
        <div className="public-header__actions">
          <Link to="/admissions" className="public-header__apply">
            Apply for Admission <ArrowRight aria-hidden="true" className="w-4 h-4 ml-1" />
          </Link>
          <Link to="/admin/login" className="public-header__portal">
            <UserRound aria-hidden="true" className="w-4 h-4 mr-1" /> Student Portal
          </Link>
        </div>
      </div>
    </nav>
    {mobileMenuOpen && (
      <div id="mobile-navigation" className="public-header__mobile-panel">
        <ul className="public-header__mobile-menu">
          {menuItems.map((item, index) => renderMenuItem(item, index, true))}
        </ul>
        <div className="public-header__mobile-actions">
          <Link to="/admissions" className="public-header__apply">
            Apply for Admission <ArrowRight aria-hidden="true" />
          </Link>
          <Link to="/admin/login" className="public-header__portal">
            <UserRound aria-hidden="true" /> Student Portal
          </Link>
        </div>
      </div>
    )}
  </header>;
};

export default PublicHeader;
