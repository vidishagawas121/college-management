import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/admin/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Users,
  GraduationCap,
  Calendar,
  Newspaper,
  Trophy,
  FileSpreadsheet,
  Bell,
  Image,
  FileText,
  Mail,
  PlusCircle,
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const { admin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getStats();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Calculating real-time database metrics..." fullPage />;

  const stats = data?.stats || {};
  const recent = data?.recent || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-academic-navy via-primary-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-white/10 px-3 py-1 rounded-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            Welcome, {admin?.fullName || 'Administrator'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            All website sections, publications, circulars, faculty profiles, and public enquiries are manageable from this single dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={fetchStats}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors border border-white/15"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Stats</span>
          </button>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/staff"
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-primary-50 text-slate-800 hover:text-primary-900 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors border border-slate-200"
          >
            <PlusCircle className="w-3.5 h-3.5 text-primary-900" />
            <span>Add Faculty</span>
          </Link>
          <Link
            to="/admin/notices"
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-primary-50 text-slate-800 hover:text-primary-900 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors border border-slate-200"
          >
            <PlusCircle className="w-3.5 h-3.5 text-primary-900" />
            <span>Publish Notice</span>
          </Link>
          <Link
            to="/admin/events"
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-primary-50 text-slate-800 hover:text-primary-900 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors border border-slate-200"
          >
            <PlusCircle className="w-3.5 h-3.5 text-primary-900" />
            <span>Schedule Event</span>
          </Link>
          <Link
            to="/admin/articles"
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-primary-50 text-slate-800 hover:text-primary-900 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors border border-slate-200"
          >
            <PlusCircle className="w-3.5 h-3.5 text-primary-900" />
            <span>New Article</span>
          </Link>
          <Link
            to="/admin/documents"
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-primary-50 text-slate-800 hover:text-primary-900 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors border border-slate-200"
          >
            <PlusCircle className="w-3.5 h-3.5 text-primary-900" />
            <span>Upload Document</span>
          </Link>
          <Link
            to="/admin/enquiries"
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-primary-50 text-slate-800 hover:text-primary-900 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors border border-slate-200"
          >
            <Mail className="w-3.5 h-3.5 text-amber-600" />
            <span>View Enquiries ({stats.newEnquiries || 0} New)</span>
          </Link>
        </div>
      </div>

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Faculty / Staff"
          value={stats.totalStaff}
          icon={Users}
          color="primary"
          link="/admin/staff"
        />
        <StatCard
          title="Academic Departments"
          value={stats.totalDepartments}
          icon={GraduationCap}
          color="amber"
          link="/admin/departments"
        />
        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          subtitle={`Total: ${stats.totalEvents || 0} events`}
          icon={Calendar}
          color="emerald"
          link="/admin/events"
        />
        <StatCard
          title="Active Notices"
          value={stats.activeNotices}
          icon={Bell}
          color="rose"
          link="/admin/notices"
        />
      </div>

      {/* Secondary Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Admissions"
          value={stats.activeAdmissions}
          icon={FileSpreadsheet}
          color="blue"
          link="/admin/admissions"
        />
        <StatCard
          title="Published Articles"
          value={stats.totalArticles}
          icon={Newspaper}
          color="purple"
          link="/admin/articles"
        />
        <StatCard
          title="Achievements Recorded"
          value={stats.totalAchievements}
          icon={Trophy}
          color="amber"
          link="/admin/achievements"
        />
        <StatCard
          title="Unread Enquiries"
          value={stats.newEnquiries}
          icon={Mail}
          color="rose"
          link="/admin/enquiries"
        />
      </div>

      {/* Recent Activity Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Notices */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-academic-navy font-heading flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Recently Published Circulars</span>
            </h3>
            <Link to="/admin/notices" className="text-xs font-bold text-primary-900 hover:text-primary-700">
              Manage All &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {recent.notices?.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4">No notices published yet.</p>
            ) : (
              recent.notices?.map((n) => (
                <div key={n._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex-1 min-w-0 pr-3">
                    <h5 className="font-bold text-slate-800 truncate">{n.title}</h5>
                    <span className="text-[11px] text-slate-500">{new Date(n.publishDate || n.createdAt).toLocaleDateString()} • {n.category}</span>
                  </div>
                  <StatusBadge status={n.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Public Inquiries */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-academic-navy font-heading flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-500" />
              <span>Recent Public Enquiries</span>
            </h3>
            <Link to="/admin/enquiries" className="text-xs font-bold text-primary-900 hover:text-primary-700">
              Manage Inquiries &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {recent.enquiries?.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4">No enquiries received yet.</p>
            ) : (
              recent.enquiries?.map((enq) => (
                <div key={enq._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex-1 min-w-0 pr-3">
                    <h5 className="font-bold text-slate-800 truncate">{enq.subject}</h5>
                    <span className="text-[11px] text-slate-500">From: {enq.name} ({enq.email})</span>
                  </div>
                  <StatusBadge status={enq.isRead ? 'RESOLVED' : 'NEW'} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
