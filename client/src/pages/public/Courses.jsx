import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { departmentService } from '../../services/departmentService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { BookOpen, GraduationCap, Clock, Users, ArrowRight, ShieldCheck } from 'lucide-react';

const Courses = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDegree, setSelectedDegree] = useState('ALL');

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await departmentService.getPublicDepartments();
        if (res.success && res.data) {
          setDepartments(res.data);
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  // Aggregate all courses with department reference
  const allCourses = departments.flatMap(d =>
    (d.courses || []).map(c => ({ ...c, departmentName: d.name, departmentSlug: d.slug, departmentShort: d.shortName }))
  );

  const filteredCourses = selectedDegree === 'ALL'
    ? allCourses
    : allCourses.filter(c => c.degree?.toUpperCase() === selectedDegree);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title="Courses & Degree Programs"
        description="Explore Undergraduate, Postgraduate, and Doctoral degree programs offered across all engineering disciplines at Apex Institute."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            Academic Curricula
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading mt-3">
            Courses & Programs Offered
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
            Industry-aligned curricula benchmarked to international accreditation criteria, offering degrees in emerging technical domains.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Degree Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'B.TECH', 'M.TECH', 'PH.D'].map((deg) => (
            <button
              key={deg}
              onClick={() => setSelectedDegree(deg)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDegree === deg
                  ? 'bg-academic-navy text-amber-400 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {deg === 'ALL' ? 'All Degree Levels' : deg}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner message="Loading course offerings..." />
        ) : filteredCourses.length === 0 ? (
          <EmptyState title="No courses found" description="No course offerings found for the selected filter." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((c, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-200">
                      {c.degree}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {c.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-academic-navy font-heading mb-2 leading-snug">
                    {c.name}
                  </h3>

                  <p className="text-xs font-semibold text-slate-500 mb-4">
                    Offered by: <span className="text-slate-800">{c.departmentName}</span>
                  </p>

                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <p><span className="font-semibold text-slate-800">Approved Intake:</span> {c.intake} Seats</p>
                    <p><span className="font-semibold text-slate-800">Eligibility:</span> {c.eligibility}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                  <Link
                    to={`/departments/${c.departmentSlug}`}
                    className="text-xs font-bold text-primary-900 hover:text-primary-700 flex items-center gap-1"
                  >
                    <span>Department Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/admissions"
                    className="text-xs font-bold text-amber-600 hover:text-amber-700"
                  >
                    Apply Now &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
