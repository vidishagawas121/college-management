import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { staffService } from '../../services/staffService';
import { departmentService } from '../../services/departmentService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import SearchBar from '../../components/common/SearchBar';
import { Mail, Phone, BookOpen, GraduationCap, ChevronRight, User } from 'lucide-react';

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [staffRes, deptRes] = await Promise.all([
          staffService.getPublicStaff(),
          departmentService.getPublicDepartments(),
        ]);
        if (staffRes.success && staffRes.data) setStaffList(staffRes.data);
        if (deptRes.success && deptRes.data) setDepartments(deptRes.data);
      } catch (err) {
        console.error('Failed to load faculty:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleFilter = async (deptId, search) => {
    setLoading(true);
    try {
      const params = {};
      if (deptId && deptId !== 'ALL') params.department = deptId;
      if (search) params.search = search;
      const res = await staffService.getPublicStaff(params);
      if (res.success && res.data) setStaffList(res.data);
    } catch (err) {
      console.error('Filter failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title="Faculty & Academic Staff Directory"
        description="Meet the distinguished professors, researchers, and academic faculty of Apex Institute of Technology & Sciences."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            Academic Mentors
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading mt-3">
            Faculty Directory
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
            Distinguished scholars, researchers, and educators dedicated to mentorship, critical inquiry, and world-class technical education.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(val) => {
                setSearchTerm(val);
                handleFilter(selectedDept, val);
              }}
              onClear={() => {
                setSearchTerm('');
                handleFilter(selectedDept, '');
              }}
              placeholder="Search faculty by name, qualification, or specialization..."
            />
          </div>

          <div className="w-full md:w-72 flex-shrink-0">
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                handleFilter(e.target.value, searchTerm);
              }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Staff Grid */}
        {loading ? (
          <LoadingSpinner message="Searching faculty roster..." />
        ) : staffList.length === 0 ? (
          <EmptyState
            title="No faculty members found"
            description="No published faculty records matched your selected criteria."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffList.map((st) => (
              <div
                key={st._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                      <ImageWithFallback
                        src={st.photo}
                        alt={st.name}
                        type="avatar"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-900 transition-colors truncate">
                        {st.name}
                      </h3>
                      <p className="text-xs font-semibold text-amber-700 truncate mt-0.5">
                        {st.designation}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                        {st.department?.name || 'Academic Faculty'}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="line-clamp-1"><span className="font-semibold text-slate-800">Qualification:</span> {st.qualification || '—'}</p>
                    <p className="line-clamp-1"><span className="font-semibold text-slate-800">Specialization:</span> {st.specialization || '—'}</p>
                    <p><span className="font-semibold text-slate-800">Experience:</span> {st.experience || '—'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                  {st.email ? (
                    <a href={`mailto:${st.email}`} className="text-slate-400 hover:text-primary-900 p-1 rounded" title={st.email}>
                      <Mail className="w-4 h-4" />
                    </a>
                  ) : <div />}
                  <Link
                    to={`/staff/${st.slug}`}
                    className="text-xs font-bold text-primary-900 hover:text-primary-700 flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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

export default Staff;
