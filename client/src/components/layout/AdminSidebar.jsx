import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  Calendar,
  FileSpreadsheet,
  Newspaper,
  Trophy,
  Bell,
  Image,
  FileText,
  Mail,
  FileCode,
  Menu,
  Search,
  Settings,
  ShieldAlert,
  UserCheck,
  Globe
} from 'lucide-react';

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const navGroups = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Academic Core',
      items: [
        { name: 'College Information', path: '/admin/college', icon: Building2 },
        { name: 'Departments', path: '/admin/departments', icon: GraduationCap },
        { name: 'Staff / Faculty', path: '/admin/staff', icon: Users },
        { name: 'Admissions', path: '/admin/admissions', icon: FileSpreadsheet },
      ]
    },
    {
      title: 'Campus Life & Updates',
      items: [
        { name: 'Events & Seminars', path: '/admin/events', icon: Calendar },
        { name: 'Notices & Circulars', path: '/admin/notices', icon: Bell },
        { name: 'News & Articles', path: '/admin/articles', icon: Newspaper },
        { name: 'Achievements', path: '/admin/achievements', icon: Trophy },
      ]
    },
    {
      title: 'Media & Communications',
      items: [
        { name: 'Gallery Albums', path: '/admin/gallery', icon: Image },
        { name: 'Documents / Circulars', path: '/admin/documents', icon: FileText },
        { name: 'Public Enquiries', path: '/admin/enquiries', icon: Mail },
      ]
    },
    {
      title: 'CMS & Structure',
      items: [
        { name: 'Dynamic Pages', path: '/admin/pages', icon: FileCode },
        { name: 'Menu Navigation', path: '/admin/menus', icon: Menu },
        { name: 'SEO & Metadata', path: '/admin/seo', icon: Search },
        { name: 'Website Settings', path: '/admin/settings', icon: Settings },
        { name: 'Admin Profile', path: '/admin/profile', icon: UserCheck },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-academic-navy text-slate-300 flex flex-col border-r border-primary-950 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-primary-900/60 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm font-heading block leading-none">
                AITS Admin CMS
              </span>
              <span className="text-[10px] text-amber-400 font-semibold tracking-wide uppercase">
                Single Control Panel
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <h5 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {group.title}
              </h5>
              <div className="space-y-0.5">
                {group.items.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={idx}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Quick Action */}
        <div className="p-3 border-t border-primary-900/60 bg-slate-950/40">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-primary-900/60 hover:bg-primary-800 text-amber-400 rounded-lg text-xs font-semibold border border-primary-800 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </a>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
