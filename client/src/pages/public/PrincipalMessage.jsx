import React from 'react';
import { useCollege } from '../../context/CollegeContext';
import SEO from '../../components/common/SEO';
import RichTextRenderer from '../../components/common/RichTextRenderer';
import { Quote, Mail, GraduationCap } from 'lucide-react';

const PrincipalMessage = () => {
  const { collegeInfo } = useCollege();

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title="Principal's Desk & Message"
        description="Message from the Principal of Apex Institute of Technology & Sciences."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            Leadership Desk
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading mt-3">
            Principal's Message
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            A message to prospective scholars, students, alumni, and parents.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Profile Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center">
            <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden border-4 border-amber-500/30 mb-4 shadow-md bg-slate-100">
              <img
                src={collegeInfo?.principalPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                alt="Principal"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-academic-navy font-heading">
              {collegeInfo?.principalName || 'Dr. Arthur Pendelton, Ph.D.'}
            </h3>
            <p className="text-xs text-amber-700 font-semibold mt-1">
              {collegeInfo?.principalDesignation || 'Principal & Professor'}
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2 text-left">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Ph.D. in Applied Computational Engineering</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>principal@college.edu</span>
              </div>
            </div>
          </div>

          {/* Letter / Message */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
            <Quote className="w-12 h-12 text-amber-500/20" />
            <div className="text-slate-700 leading-relaxed space-y-4 text-base">
              {collegeInfo?.principalMessage ? (
                <RichTextRenderer content={collegeInfo.principalMessage} />
              ) : (
                <p>Welcome to Apex Institute of Technology & Sciences.</p>
              )}
            </div>

            <div className="pt-8 border-t border-slate-100">
              <p className="text-sm font-bold text-academic-navy">Warm regards,</p>
              <p className="text-base font-extrabold text-academic-navy font-heading mt-1">
                {collegeInfo?.principalName || 'Dr. Arthur Pendelton, Ph.D.'}
              </p>
              <p className="text-xs text-slate-500">
                Principal, {collegeInfo?.collegeName || 'Apex Institute of Technology & Sciences'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalMessage;
