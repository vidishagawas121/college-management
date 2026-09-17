import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Layout & Pages
import PublicLayout from './components/layout/PublicLayout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import VisionMission from './pages/public/VisionMission';
import PrincipalMessage from './pages/public/PrincipalMessage';
import Departments from './pages/public/Departments';
import DepartmentDetail from './pages/public/DepartmentDetail';
import Staff from './pages/public/Staff';
import StaffDetail from './pages/public/StaffDetail';
import Courses from './pages/public/Courses';
import Admissions from './pages/public/Admissions';
import AdmissionNotices from './pages/public/AdmissionNotices';
import Events from './pages/public/Events';
import EventDetail from './pages/public/EventDetail';
import Articles from './pages/public/Articles';
import ArticleDetail from './pages/public/ArticleDetail';
import Achievements from './pages/public/Achievements';
import Notices from './pages/public/Notices';
import NoticeDetail from './pages/public/NoticeDetail';
import Gallery from './pages/public/Gallery';
import GalleryDetail from './pages/public/GalleryDetail';
import Facilities from './pages/public/Facilities';
import Contact from './pages/public/Contact';
import DynamicPage from './pages/public/DynamicPage';
import NotFound from './pages/public/NotFound';

// Admin Layout & Pages
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import CollegeInfoAdmin from './pages/admin/CollegeInfoAdmin';
import DepartmentsAdmin from './pages/admin/DepartmentsAdmin';
import StaffAdmin from './pages/admin/StaffAdmin';
import EventsAdmin from './pages/admin/EventsAdmin';
import AdmissionsAdmin from './pages/admin/AdmissionsAdmin';
import ArticlesAdmin from './pages/admin/ArticlesAdmin';
import AchievementsAdmin from './pages/admin/AchievementsAdmin';
import NoticesAdmin from './pages/admin/NoticesAdmin';
import GalleryAdmin from './pages/admin/GalleryAdmin';
import DocumentsAdmin from './pages/admin/DocumentsAdmin';
import EnquiriesAdmin from './pages/admin/EnquiriesAdmin';
import PagesAdmin from './pages/admin/PagesAdmin';
import MenusAdmin from './pages/admin/MenusAdmin';
import SEOAdmin from './pages/admin/SEOAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';
import ProfileAdmin from './pages/admin/ProfileAdmin';

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="vision-mission" element={<VisionMission />} />
        <Route path="principal-message" element={<PrincipalMessage />} />
        <Route path="departments" element={<Departments />} />
        <Route path="departments/:slug" element={<DepartmentDetail />} />
        <Route path="staff" element={<Staff />} />
        <Route path="staff/:slug" element={<StaffDetail />} />
        <Route path="courses" element={<Courses />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="admissions/notices" element={<AdmissionNotices />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:slug" element={<EventDetail />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/:slug" element={<ArticleDetail />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="notices" element={<Notices />} />
        <Route path="notices/:slug" element={<NoticeDetail />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="gallery/:slug" element={<GalleryDetail />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="contact" element={<Contact />} />
        <Route path="pages/:slug" element={<DynamicPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Login Route (Independent from AdminLayout) */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin Protected Dashboard Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="college" element={<CollegeInfoAdmin />} />
        <Route path="departments" element={<DepartmentsAdmin />} />
        <Route path="staff" element={<StaffAdmin />} />
        <Route path="events" element={<EventsAdmin />} />
        <Route path="admissions" element={<AdmissionsAdmin />} />
        <Route path="articles" element={<ArticlesAdmin />} />
        <Route path="achievements" element={<AchievementsAdmin />} />
        <Route path="notices" element={<NoticesAdmin />} />
        <Route path="gallery" element={<GalleryAdmin />} />
        <Route path="documents" element={<DocumentsAdmin />} />
        <Route path="enquiries" element={<EnquiriesAdmin />} />
        <Route path="pages" element={<PagesAdmin />} />
        <Route path="menus" element={<MenusAdmin />} />
        <Route path="seo" element={<SEOAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
        <Route path="profile" element={<ProfileAdmin />} />
      </Route>
    </Routes>
  );
}
