import React from 'react';
import { Menu, LogOut, User, Globe, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminHeader = ({ setMobileOpen }) => {
  const { admin, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading leading-tight">
            Apex Institute Administration
          </h2>
          <span className="text-[11px] text-emerald-600 font-medium hidden sm:inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Authenticated as Administrator
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          to="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
        >
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>Live Site</span>
        </Link>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <Link
            to="/admin/profile"
            className="flex items-center gap-2 text-left p-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-900 text-amber-400 flex items-center justify-center font-bold text-xs shadow-xs">
              {admin?.fullName ? admin.fullName.charAt(0) : 'A'}
            </div>
            <div className="hidden md:block">
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {admin?.fullName || 'Administrator'}
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight">
                {admin?.email || 'admin@college.edu'}
              </span>
            </div>
          </Link>

          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
