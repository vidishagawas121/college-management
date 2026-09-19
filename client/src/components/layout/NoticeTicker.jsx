import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, ArrowRight } from 'lucide-react';
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

  const defaultAnnouncements = [
    { title: 'Admissions Open for Academic Session 2026–27' },
    { title: 'End-Semester Theory Examinations Schedule Released' },
    { title: 'Hostel Re-allotment and Room Upgradation' },
    { title: 'National Merit-cum-Means Scholarship' },
  ];

  const announcements = urgentNotices.length > 0 ? urgentNotices : defaultAnnouncements;

  return (
    <div className="public-alert-bar">
      <div className="public-header__container public-alert-bar__inner">
        <div className="public-alert-bar__label">
          <Megaphone aria-hidden="true" className="w-3.5 h-3.5" />
          <strong>ALERTS</strong>
        </div>
        <div className="public-alert-bar__notices">
          {announcements.map((notice, idx) => (
            <React.Fragment key={notice._id || idx}>
              <Link to={notice.slug ? `/notices/${notice.slug}` : '/notices'} className="public-alert-bar__notice">
                {notice.title}
              </Link>
              {idx < announcements.length - 1 && (
                <span className="text-white/40 select-none px-1" aria-hidden="true">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <Link to="/notices" className="public-alert-bar__all">
          <span>View All Notices</span>
          <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default NoticeTicker;
