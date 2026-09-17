import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { noticeService } from '../../services/noticeService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import RichTextRenderer from '../../components/common/RichTextRenderer';
import { Calendar, FileText, Download, ChevronLeft, ExternalLink } from 'lucide-react';

const NoticeDetail = () => {
  const { slug } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await noticeService.getNoticeBySlug(slug);
        if (res.success && res.data) {
          setNotice(res.data);
        }
      } catch (err) {
        console.error('Failed to load notice:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Loading circular details..." fullPage />;
  if (!notice) return <EmptyState title="Notice not found" description="The circular you requested has expired or is unpublished." />;

  const pubDate = new Date(notice.publishDate || notice.createdAt);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title={notice.title}
        description={notice.description}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/notices"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-900 hover:text-primary-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to All Notices
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-lg">
                {notice.category}
              </span>
              {notice.priority && <StatusBadge status={notice.priority} />}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Published: {pubDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-academic-navy font-heading leading-tight">
            {notice.title}
          </h1>

          <div className="text-slate-700 leading-relaxed text-base space-y-4">
            <RichTextRenderer content={notice.description} />
          </div>

          {/* Action Links & Download */}
          {(notice.attachmentPdf || notice.externalLink) && (
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-4">
              {notice.attachmentPdf && (
                <a
                  href={notice.attachmentPdf}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-xs transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Official PDF Document</span>
                </a>
              )}
              {notice.externalLink && (
                <a
                  href={notice.externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-900 hover:bg-primary-800 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors"
                >
                  <span>Visit Related Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {notice.expiryDate && (
            <div className="text-[11px] text-slate-400 pt-2">
              Notice active until: {new Date(notice.expiryDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
