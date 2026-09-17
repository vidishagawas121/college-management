import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { departmentService } from '../../services/departmentService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { GraduationCap, ArrowRight, Users, BookOpen, ChevronRight } from 'lucide-react';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await departmentService.getPublicDepartments();
        if (res.success && res.data) {
          setDepartments(res.data);
        }
      } catch (err) {
        console.error('Failed to load departments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title="Academic Departments"
        description="Explore our specialized engineering, technology, and applied sciences departments."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            Academic Divisions
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading mt-3">
            Academic Departments
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
            Offering multidisciplinary curricula, cutting-edge laboratory facilities, and world-class faculty mentors across all engineering domains.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSpinner message="Loading academic departments..." />
        ) : departments.length === 0 ? (
          <EmptyState title="No departments published yet" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {departments.map((dept) => (
              <div
                key={dept._id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-56 bg-slate-100 overflow-hidden relative">
                    <img
                      src={dept.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'}
                      alt={dept.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                      <span className="bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-lg">
                        {dept.shortName}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-academic-navy font-heading group-hover:text-primary-900 transition-colors">
                      {dept.name}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {dept.description}
                    </p>

                    {dept.headOfDepartment && (
                      <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                        <span className="font-semibold text-slate-700">Head of Department:</span>
                        <span className="text-academic-navy font-bold">{dept.headOfDepartment}</span>
                      </div>
                    )}

                    {/* Courses preview */}
                    {dept.courses && dept.courses.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Programs Offered:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {dept.courses.map((course, cIdx) => (
                            <span
                              key={cIdx}
                              className="inline-block bg-primary-50 text-primary-900 text-xs font-medium px-2.5 py-1 rounded-md border border-primary-100"
                            >
                              {course.name} ({course.duration})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{dept.faculty?.length || 0} Faculty Members</span>
                  </span>
                  <Link
                    to={`/departments/${dept.slug}`}
                    className="inline-flex items-center gap-1.5 bg-primary-900 hover:bg-primary-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
                  >
                    <span>View Department</span>
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

export default Departments;
