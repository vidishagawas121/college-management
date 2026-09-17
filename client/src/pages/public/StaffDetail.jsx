import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { staffService } from '../../services/staffService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Mail, Phone, BookOpen, GraduationCap, Building, ChevronLeft, Award, Sparkles } from 'lucide-react';

const StaffDetail = () => {
  const { slug } = useParams();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await staffService.getStaffBySlug(slug);
        if (res.success && res.data) {
          setStaff(res.data);
        }
      } catch (err) {
        console.error('Failed to load faculty profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Loading faculty profile..." fullPage />;
  if (!staff) return <EmptyState title="Faculty member not found" description="The requested profile does not exist or is unpublished." />;

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title={`${staff.name} - ${staff.designation}`}
        description={`${staff.name}, ${staff.designation} at ${staff.department?.name || 'Apex Institute'}. Specialization in ${staff.specialization}.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/staff"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-900 hover:text-primary-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Faculty Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Profile Overview */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-40 h-40 mx-auto rounded-3xl overflow-hidden bg-slate-100 border-4 border-amber-500/20 shadow-md">
              <img
                src={staff.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                alt={staff.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-2xl font-black text-academic-navy font-heading">
                {staff.name}
              </h1>
              <p className="text-sm font-bold text-amber-700 mt-0.5">{staff.designation}</p>
              {staff.department && (
                <Link
                  to={`/departments/${staff.department.slug}`}
                  className="inline-block text-xs font-semibold text-slate-500 hover:text-primary-900 mt-1"
                >
                  {staff.department.name}
                </Link>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2.5 text-left">
              {staff.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <a href={`mailto:${staff.email}`} className="hover:text-primary-900 truncate">{staff.email}</a>
                </div>
              )}
              {staff.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <a href={`tel:${staff.phone}`} className="hover:text-primary-900">{staff.phone}</a>
                </div>
              )}
              {staff.experience && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Experience: {staff.experience}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Academic Credentials */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-academic-navy font-heading border-b border-slate-100 pb-3">
                Academic Background & Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <span className="font-semibold text-slate-500 block mb-1">Qualifications</span>
                  <span className="font-bold text-slate-900">{staff.qualification || '—'}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <span className="font-semibold text-slate-500 block mb-1">Core Specialization</span>
                  <span className="font-bold text-slate-900">{staff.specialization || '—'}</span>
                </div>
              </div>
            </div>

            {/* Biography */}
            {staff.bio && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-lg font-bold text-academic-navy font-heading border-b border-slate-100 pb-3">
                  Biography & Profile
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {staff.bio}
                </p>
              </div>
            )}

            {/* Research Interests */}
            {staff.researchInterests && staff.researchInterests.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-lg font-bold text-academic-navy font-heading border-b border-slate-100 pb-3">
                  Research Interests & Publications
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {staff.researchInterests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="bg-primary-50 text-primary-900 text-xs font-semibold px-3 py-1.5 rounded-lg border border-primary-100"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
                {staff.publicationsCount > 0 && (
                  <p className="text-xs text-slate-500 pt-3">
                    Authored / Co-authored <strong className="text-academic-navy">{staff.publicationsCount}</strong> peer-reviewed papers in indexed journals and conferences.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;
