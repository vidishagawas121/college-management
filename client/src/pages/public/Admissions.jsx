import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { admissionService } from '../../services/admissionService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckCircle2, Calendar, FileText, ArrowRight, HelpCircle, Phone, Mail, Award } from 'lucide-react';
import RichTextRenderer from '../../components/common/RichTextRenderer';

const Admissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const res = await admissionService.getPublicAdmissions();
        if (res.success && res.data) {
          setAdmissions(res.data);
        }
      } catch (err) {
        console.error('Failed to load admissions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmissions();
  }, []);

  const featuredNotice = admissions.find(a => a.isFeatured) || admissions[0];

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title="Admissions 2026-2027"
        description="Comprehensive admission procedure, important dates, eligibility criteria, fee structures, and application portals."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            Enrollment 2026
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading mt-3">
            Admissions Overview & Guidelines
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
            Join our vibrant community of innovators. Review programs, key deadlines, eligibility conditions, and application procedures below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Step-by-Step Procedure Guide */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
              Application Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-academic-navy font-heading mt-2">
              5-Step Admission Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Online Registration', desc: 'Create applicant account and fill educational credentials.' },
              { step: '02', title: 'Upload Documents', desc: 'Submit transcripts, entrance scorecards, and ID documents.' },
              { step: '03', title: 'Merit Counseling', desc: 'Participate in centralized counseling based on entrance rank.' },
              { step: '04', title: 'Seat Allotment', desc: 'Receive provisional branch allotment letter.' },
              { step: '05', title: 'Fee Payment', desc: 'Confirm admission and complete verification at campus.' },
            ].map((st, i) => (
              <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 relative">
                <span className="text-2xl font-black text-amber-500 font-heading block mb-2">
                  {st.step}
                </span>
                <h4 className="text-sm font-bold text-academic-navy mb-1">{st.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Notices Section */}
        {loading ? (
          <LoadingSpinner message="Loading admission circulars..." />
        ) : admissions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
                  Active Announcements
                </span>
                <h2 className="text-2xl font-bold text-academic-navy font-heading mt-2">
                  Admission Notifications & Deadlines
                </h2>
              </div>
              <Link to="/admissions/notices" className="text-xs font-bold text-primary-900 hover:text-primary-700">
                View All Notices &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {admissions.map((adm) => (
                <div
                  key={adm._id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-200">
                        {adm.category}
                      </span>
                      <span className="text-xs font-bold text-slate-500">Academic Year: {adm.academicYear}</span>
                    </div>

                    <h3 className="text-xl font-bold text-academic-navy font-heading">
                      {adm.title}
                    </h3>

                    <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                      <RichTextRenderer content={adm.description} />
                    </div>

                    {/* Important dates */}
                    {adm.importantDates && adm.importantDates.length > 0 && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                          Important Milestones:
                        </span>
                        <div className="space-y-1 text-xs text-slate-600">
                          {adm.importantDates.map((d, dIdx) => (
                            <div key={dIdx} className="flex items-center justify-between">
                              <span className="font-medium text-slate-700">{d.event}:</span>
                              <span className="font-bold text-academic-navy">{d.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    {adm.externalApplyUrl ? (
                      <a
                        href={adm.externalApplyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
                      >
                        Apply Online &rarr;
                      </a>
                    ) : (
                      <Link
                        to="/contact"
                        className="bg-primary-900 hover:bg-primary-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
                      >
                        Enquire at Admissions Office
                      </Link>
                    )}

                    <Link
                      to={`/admissions/notices`}
                      className="text-xs font-bold text-slate-600 hover:text-primary-900"
                    >
                      Read full prospectus
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admission Help Desk */}
        <div className="bg-academic-navy text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Admissions Cell</span>
            <h3 className="text-2xl font-bold font-heading text-white">
              Need assistance with your application?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Our counselors are available Monday through Saturday, 9:00 AM to 5:00 PM.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs shadow transition-colors"
            >
              Contact Admissions Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admissions;
