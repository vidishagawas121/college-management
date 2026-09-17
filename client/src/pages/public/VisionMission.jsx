import React from 'react';
import { useCollege } from '../../context/CollegeContext';
import SEO from '../../components/common/SEO';
import { Target, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

const VisionMission = () => {
  const { collegeInfo } = useCollege();

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title="Vision & Mission"
        description="Our institutional vision, mission, and guiding philosophy at Apex Institute of Technology & Sciences."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            Guiding Philosophy
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading mt-3">
            Vision & Mission
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            The foundational principles that guide our academic pedagogy, scientific research, and societal contributions.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Vision Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary-900 text-amber-400 flex items-center justify-center flex-shrink-0 shadow-md">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-900">Our Vision</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-academic-navy font-heading">
                Where We Are Heading
              </h2>
            </div>
          </div>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium bg-slate-50 p-6 rounded-2xl border-l-4 border-primary-900">
            {collegeInfo?.vision || 'To be a globally revered citadel of higher learning, distinguished for trailblazing research, ethical innovation, and preparing future-ready professionals who enrich humanity.'}
          </p>
        </div>

        {/* Mission Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-md">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Our Mission</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-academic-navy font-heading">
                How We Achieve It
              </h2>
            </div>
          </div>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium bg-slate-50 p-6 rounded-2xl border-l-4 border-amber-500">
            {collegeInfo?.mission || 'To impart holistic education grounded in scientific rigor, cultivate critical inquiry and hands-on technological mastery, nurture an ecosystem of entrepreneurship and research, and serve societal needs with the highest ethical standards.'}
          </p>
        </div>

        {/* Objectives */}
        {collegeInfo?.objectives && collegeInfo.objectives.length > 0 && (
          <div className="bg-academic-navy text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
            <h3 className="text-xl font-bold font-heading text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Strategic Educational Objectives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collegeInfo.objectives.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisionMission;
