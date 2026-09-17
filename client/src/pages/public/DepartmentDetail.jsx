import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { departmentService } from '../../services/departmentService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Mail, Phone, Users, BookOpen, Award, Sparkles, Building, ChevronLeft } from 'lucide-react';

const DepartmentDetail = () => {
  const { slug } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await departmentService.getDepartmentBySlug(slug);
        if (res.success && res.data) {
          setDepartment(res.data);
        }
      } catch (err) {
        console.error('Failed to load department details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartment();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Loading department details..." fullPage />;
  if (!department) return <EmptyState title="Department not found" description="The requested academic department could not be located." />;

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title={department.name}
        description={department.description}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/departments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-900 hover:text-primary-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to All Departments
        </Link>

        <div className="bg-academic-navy text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
              {department.shortName}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white">
              {department.name}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {department.description}
            </p>
          </div>

          <div className="flex flex-col gap-2 bg-white/10 p-5 rounded-2xl border border-white/15 text-xs text-slate-200 flex-shrink-0">
            <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Department Contact</span>
            {department.contactEmail && (
              <a href={`mailto:${department.contactEmail}`} className="flex items-center gap-2 hover:text-white">
                <Mail className="w-3.5 h-3.5 text-amber-400" /> {department.contactEmail}
              </a>
            )}
            {department.contactPhone && (
              <a href={`tel:${department.contactPhone}`} className="flex items-center gap-2 hover:text-white">
                <Phone className="w-3.5 h-3.5 text-amber-400" /> {department.contactPhone}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HOD Message Card */}
        {department.headOfDepartment && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border-2 border-amber-500/40">
              <img
                src={department.headPhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'}
                alt={department.headOfDepartment}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Department Leadership</span>
              <h3 className="text-xl font-bold text-academic-navy font-heading mt-0.5">
                {department.headOfDepartment}
              </h3>
              <p className="text-xs text-slate-500 mb-3">Head of Department</p>
              {department.headMessage && (
                <p className="text-sm text-slate-600 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                  "{department.headMessage}"
                </p>
              )}
            </div>
          </div>
        )}

        {/* Academic Courses Offered */}
        {department.courses && department.courses.length > 0 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
                Degree Programs
              </span>
              <h2 className="text-2xl font-bold text-academic-navy font-heading mt-2">
                Courses & Curricula
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {department.courses.map((course, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-primary-50 text-primary-900 text-xs font-bold px-2.5 py-1 rounded-md border border-primary-100">
                      {course.degree}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Duration: {course.duration}</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 font-heading">
                    {course.name}
                  </h4>
                  <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl">
                    <p><span className="font-semibold text-slate-800">Annual Intake:</span> {course.intake} Seats</p>
                    <p><span className="font-semibold text-slate-800">Eligibility:</span> {course.eligibility}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Laboratories & Facilities */}
        {department.facilities && department.facilities.length > 0 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
                Research Labs
              </span>
              <h2 className="text-2xl font-bold text-academic-navy font-heading mt-2">
                Departmental Laboratories & Infrastructure
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {department.facilities.map((fac, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <Building className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-800">{fac}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Faculty Roster */}
        {department.faculty && department.faculty.length > 0 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
                Mentors & Scholars
              </span>
              <h2 className="text-2xl font-bold text-academic-navy font-heading mt-2">
                Department Faculty Members
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {department.faculty.map((f) => (
                <Link
                  key={f._id}
                  to={`/staff/${f.slug}`}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex items-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                    <img
                      src={f.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                      alt={f.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary-900 transition-colors truncate">
                      {f.name}
                    </h4>
                    <p className="text-xs text-amber-700 font-semibold truncate">{f.designation}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{f.qualification}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentDetail;
