import React from 'react';
import { useCollege } from '../../context/CollegeContext';
import SEO from '../../components/common/SEO';
import RichTextRenderer from '../../components/common/RichTextRenderer';
import { ShieldCheck, Award, Building, Calendar, CheckCircle2 } from 'lucide-react';

const About = () => {
  const { collegeInfo } = useCollege();

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title="About Our College & History"
        description="Learn about the history, academic excellence, leadership, and campus infrastructure of Apex Institute of Technology & Sciences."
      />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            Institutional Profile
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading mt-3">
            About {collegeInfo?.collegeName || 'Apex Institute of Technology & Sciences'}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
            Pioneering academic excellence, transformative engineering research, and leadership since {collegeInfo?.establishmentYear || 1998}.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-8">
            {/* About text */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <h2 className="text-2xl font-bold text-academic-navy font-heading mb-4">
                Overview & Background
              </h2>
              {collegeInfo?.aboutCollege ? (
                <RichTextRenderer content={collegeInfo.aboutCollege} />
              ) : (
                <p className="text-slate-600">Information about the college will appear here.</p>
              )}
            </div>

            {/* History text */}
            {collegeInfo?.history && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                <h2 className="text-2xl font-bold text-academic-navy font-heading mb-4">
                  History & Milestones
                </h2>
                <RichTextRenderer content={collegeInfo.history} />
              </div>
            )}

            {/* Objectives */}
            {collegeInfo?.objectives && collegeInfo.objectives.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                <h2 className="text-2xl font-bold text-academic-navy font-heading mb-4">
                  Core Objectives
                </h2>
                <ul className="space-y-3">
                  {collegeInfo.objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar facts */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-academic-navy text-white rounded-2xl p-6 shadow-md border border-slate-800">
              <h3 className="text-lg font-bold font-heading text-white border-b border-slate-700 pb-3 mb-4">
                Institutional Highlights
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Establishment Year</span>
                  <span className="text-base font-bold text-amber-400">{collegeInfo?.establishmentYear || 1998}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Campus Area</span>
                  <span className="text-sm font-semibold text-white">{collegeInfo?.campusArea || '55 Acres Green Campus'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Accreditations</span>
                  <div className="space-y-1 mt-1">
                    {(collegeInfo?.accreditations || ['NAAC Grade A++', 'NBA Tier-1']).map((acc, i) => (
                      <span key={i} className="block text-emerald-400 font-semibold">• {acc}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Recognitions</span>
                  <div className="space-y-1 mt-1">
                    {(collegeInfo?.recognitions || ['AICTE Approved', 'UGC 2(f) & 12(B)']).map((rec, i) => (
                      <span key={i} className="block text-amber-300 font-semibold">• {rec}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
