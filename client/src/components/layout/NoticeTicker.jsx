import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronRight } from 'lucide-react';
import { noticeService } from '../../services/noticeService';

const NoticeTicker = () => {
  const [urgentNotices, setUrgentNotices] = useState([]);

  useEffect(() => {
    const fetchUrgentNotices = async () => {
      try {
        const res = await noticeService.getPublicNotices({ limit: 4 });
        if (res.success && res.data) {
          setUrgentNotices(res.data);
        }
      } catch (err) {
        console.error('Failed to load notices ticker:', err);
      }
    };
    fetchUrgentNotices();
  }, []);

  if (urgentNotices.length === 0) return null;

  return (
    <div className="bg-[var(--color-primary-dark)] text-white text-xs border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 bg-[var(--color-accent)] text-[var(--color-primary-dark)] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider text-[10px]">
            <Bell className="w-3 h-3 fill-current" />
            Alerts
          </span>
        </div>

        {/* Ticker marquee or active list */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-8 truncate">
            {urgentNotices.map((notice, idx) => (
              <Link
                key={notice._id || idx}
                to={`/notices/${notice.slug}`}
                className="hover:text-[var(--color-accent-light)] flex items-center gap-1.5 transition-colors group truncate"
              >
                <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                <span className="truncate font-medium">{notice.title}</span>
                {notice.priority === 'URGENT' && (
                  <span className="text-[10px] text-rose-300 font-bold px-1 bg-rose-900/50 rounded">URGENT</span>
                )}
              </Link>
            ))}
          </div>
        </div>

        <Link
          to="/notices"
          className="flex-shrink-0 text-[var(--color-accent)] hover:text-white font-semibold flex items-center gap-1 text-[11px] hidden sm:flex"
        >
          View All Notices <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default NoticeTicker;
