import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { noticeService } from '../../services/noticeService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import { Bell, Calendar, FileText, Download, ArrowRight, ExternalLink, AlertTriangle } from 'lucide-react';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'archived'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab === 'archived') params.type = 'archived';
      if (selectedCategory !== 'ALL') params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      const res = await noticeService.getPublicNotices(params);
      if (res.success && res.data) {
        setNotices(res.data);
      }
    } catch (err) {
      console.error('Failed to load notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [activeTab, selectedCategory]);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title="Official Notices & Circulars"
        description="Official university notices, exam timetables, academic circulars, fee deadlines, and hostel announcements."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            Information Center
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading mt-3">
            Notices & Circulars
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
            Official announcements, examination schedules, fee deadlines, and circulars issued by university administration.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Controls Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'active'
                  ? 'bg-academic-navy text-amber-400 shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Active Notices
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'archived'
                  ? 'bg-academic-navy text-amber-400 shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Archived Circulars
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="w-full sm:w-64">
              <SearchBar
                value={searchTerm}
                onChange={(val) => {
                  setSearchTerm(val);
                }}
                onClear={() => {
                  setSearchTerm('');
                  fetchNotices();
                }}
                placeholder="Search circulars..."
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-700/20 w-full sm:w-auto"
            >
              <option value="ALL">All Categories</option>
              {['General', 'Academic', 'Examination', 'Admission', 'Events', 'Important', 'Circular', 'Hostel & Transport'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notices List */}
        {loading ? (
          <LoadingSpinner message="Fetching circulars..." />
        ) : notices.length === 0 ? (
          <EmptyState
            title="No notices found"
            description="There are currently no circulars matching your filter query."
          />
        ) : (
          <div className="space-y-4">
            {notices.map((n) => {
              const pubDate = new Date(n.publishDate || n.createdAt);
              const isUrgent = n.priority === 'URGENT';
              return (
                <div
                  key={n._id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-200 hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                    isUrgent ? 'border-rose-300 bg-rose-50/20 shadow-xs' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 font-heading ${
                      isUrgent ? 'bg-rose-600 text-white' : 'bg-primary-50 text-primary-900 border border-primary-100'
                    }`}>
                      <span className="text-[10px] uppercase font-bold">
                        {pubDate.toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-base font-black leading-none">
                        {pubDate.getDate()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {n.category}
                        </span>
                        {n.priority && (
                          <StatusBadge status={n.priority} />
                        )}
                      </div>

                      <Link
                        to={`/notices/${n.slug}`}
                        className="text-base font-bold text-slate-900 hover:text-primary-900 transition-colors block font-heading"
                      >
                        {n.title}
                      </Link>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {n.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                    {n.attachmentPdf && (
                      <a
                        href={n.attachmentPdf}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl border border-rose-200 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </a>
                    )}
                    <Link
                      to={`/notices/${n.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary-900 hover:text-primary-700 px-3 py-2 rounded-xl hover:bg-primary-50 transition-colors"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;
