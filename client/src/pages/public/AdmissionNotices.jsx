import React, { useState, useEffect } from 'react';
import { admissionService } from '../../services/admissionService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import RichTextRenderer from '../../components/common/RichTextRenderer';
import { FileText, Download, Calendar, ExternalLink, ArrowRight } from 'lucide-react';

const AdmissionNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await admissionService.getPublicAdmissions();
        if (res.success && res.data) {
          setNotices(res.data);
        }
      } catch (err) {
        console.error('Failed to load admission notices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const filteredNotices = selectedCategory === 'ALL'
    ? notices
    : notices.filter(n => n.category === selectedCategory);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title="Admission Notices, Forms & Guidelines"
        description="Official published admission circulars, application links, PDF forms, and procedure guidelines."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            Official Announcements
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading mt-3">
            Admission Notices & Forms
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
            Official circulars, entrance guidelines, and downloadable offline forms for prospective students.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Undergraduate', 'Postgraduate', 'Ph.D', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-academic-navy text-amber-400 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Notices' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner message="Loading admission notices..." />
        ) : filteredNotices.length === 0 ? (
          <EmptyState title="No notices found" description="No active admission circulars matching this category." />
        ) : (
          <div className="space-y-6">
            {filteredNotices.map((n) => (
              <div
                key={n._id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-lg border border-amber-200">
                      {n.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Session {n.academicYear}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Posted: {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-academic-navy font-heading">
                    {n.title}
                  </h3>
                  <div className="text-sm text-slate-600 leading-relaxed">
                    <RichTextRenderer content={n.description} />
                  </div>

                  {/* Procedures or Requirements */}
                  {n.procedure && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-1">
                      <span className="font-bold text-slate-800 block">Procedure:</span>
                      <p className="text-slate-600 whitespace-pre-line">{n.procedure}</p>
                    </div>
                  )}

                  {/* Important Dates */}
                  {n.importantDates && n.importantDates.length > 0 && (
                    <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100 space-y-2">
                      <span className="text-xs font-bold text-primary-900 block uppercase tracking-wider">
                        Important Schedule:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {n.importantDates.map((d, idx) => (
                          <div key={idx} className="flex justify-between bg-white p-2 rounded-lg border border-primary-100">
                            <span className="text-slate-600 font-medium">{d.event}:</span>
                            <span className="font-bold text-primary-950">{d.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {n.externalApplyUrl && (
                      <a
                        href={n.externalApplyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-xs transition-colors"
                      >
                        <span>Apply Online</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {n.attachmentPdf && (
                      <a
                        href={n.attachmentPdf}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors border border-slate-200"
                      >
                        <FileText className="w-3.5 h-3.5 text-rose-600" />
                        <span>Download PDF Notice</span>
                      </a>
                    )}
                  </div>

                  {n.contactHelpline && (
                    <span className="text-xs text-slate-500">
                      Helpline: <strong className="text-slate-800">{n.contactHelpline}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionNotices;
