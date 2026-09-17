import React, { useState, useEffect } from 'react';
import { departmentService } from '../../services/departmentService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FileUploader from '../../components/admin/FileUploader';
import { Plus, Edit, Trash2, GraduationCap, PlusCircle } from 'lucide-react';

const DepartmentsAdmin = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    slug: '',
    description: '',
    headOfDepartment: '',
    headMessage: '',
    headPhoto: '',
    image: '',
    contactEmail: '',
    contactPhone: '',
    displayOrder: 0,
    isFeatured: false,
    status: 'PUBLISHED',
    courses: [],
  });

  // Course item inside department
  const [newCourse, setNewCourse] = useState({ name: '', degree: 'B.Tech', duration: '4 Years', intake: 60, eligibility: '10+2 with PCM' });

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { success, error } = useToast();

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await departmentService.getAdminDepartments(params);
      if (res.success && res.data) {
        setDepartments(res.data);
      }
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [statusFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      shortName: '',
      slug: '',
      description: '',
      headOfDepartment: '',
      headMessage: '',
      headPhoto: '',
      image: '',
      contactEmail: '',
      contactPhone: '',
      displayOrder: 0,
      isFeatured: false,
      status: 'PUBLISHED',
      courses: [],
    });
    setModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingId(dept._id);
    setFormData({
      name: dept.name,
      shortName: dept.shortName || '',
      slug: dept.slug || '',
      description: dept.description || '',
      headOfDepartment: dept.headOfDepartment || '',
      headMessage: dept.headMessage || '',
      headPhoto: dept.headPhoto || '',
      image: dept.image || '',
      contactEmail: dept.contactEmail || '',
      contactPhone: dept.contactPhone || '',
      displayOrder: dept.displayOrder || 0,
      isFeatured: !!dept.isFeatured,
      status: dept.status || 'PUBLISHED',
      courses: dept.courses || [],
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      error('Department name is required.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const res = await departmentService.updateDepartment(editingId, formData);
        if (res.success) {
          success('Department updated successfully!');
          setModalOpen(false);
          fetchDepartments();
        }
      } else {
        const res = await departmentService.createDepartment(formData);
        if (res.success) {
          success('Department created successfully!');
          setModalOpen(false);
          fetchDepartments();
        }
      }
    } catch (err) {
      error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await departmentService.deleteDepartment(deletingId);
      if (res.success) {
        success('Department deleted successfully!');
        setDeleteModalOpen(false);
        setDeletingId(null);
        fetchDepartments();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete department.');
    } finally {
      setDeleting(false);
    }
  };

  const addCourse = () => {
    if (!newCourse.name) return;
    setFormData({
      ...formData,
      courses: [...formData.courses, { ...newCourse }],
    });
    setNewCourse({ name: '', degree: 'B.Tech', duration: '4 Years', intake: 60, eligibility: '10+2 with PCM' });
  };

  const removeCourse = (index) => {
    setFormData({
      ...formData,
      courses: formData.courses.filter((_, i) => i !== index),
    });
  };

  const columns = [
    {
      header: 'Department',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.name}</span>
          <span className="text-xs text-slate-400 font-semibold">{row.shortName || '—'}</span>
        </div>
      )
    },
    {
      header: 'Head of Dept (HOD)',
      accessor: 'headOfDepartment',
      cell: (row) => row.headOfDepartment || <span className="text-slate-400 italic">Unassigned</span>
    },
    {
      header: 'Programs',
      cell: (row) => (
        <span className="text-xs font-semibold bg-primary-50 text-primary-900 px-2.5 py-1 rounded-md border border-primary-100">
          {row.courses?.length || 0} Courses
        </span>
      )
    },
    {
      header: 'Featured',
      cell: (row) => (
        <span className={`text-xs font-bold ${row.isFeatured ? 'text-amber-600' : 'text-slate-400'}`}>
          {row.isFeatured ? '★ Featured' : 'Standard'}
        </span>
      )
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 text-slate-600 hover:text-primary-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit Department"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDeletingId(row._id);
              setDeleteModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Department"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            Department Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, assign HODs, configure degree programs, and publish academic divisions.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          icon={Plus}
          size="md"
        >
          Add New Department
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <SearchBar
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
            }}
            onClear={() => {
              setSearchTerm('');
              fetchDepartments();
            }}
            placeholder="Search by department or HOD..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="UNPUBLISHED">Unpublished</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={departments}
        isLoading={loading}
        emptyTitle="No departments found"
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Academic Department' : 'Add New Department'}
        subtitle="Configure department credentials, curricula, and leadership."
        maxWidth="max-w-3xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={submitting}>
              {editingId ? 'Update Department' : 'Create Department'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Department Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Department of Computer Science & Engineering"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Short Name / Code
              </label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                placeholder="e.g. CSE"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Department Overview Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed introduction of the academic division..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Head of Department (HOD)
              </label>
              <input
                type="text"
                value={formData.headOfDepartment}
                onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
                placeholder="e.g. Dr. Eleanor Vance, Ph.D."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="e.g. cse.head@college.edu"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
              />
            </div>
          </div>

          <FileUploader
            label="Department Banner / Showcase Image"
            currentUrl={formData.image}
            onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
          />

          {/* Courses List Builder */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Offered Degree Programs
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <input
                type="text"
                placeholder="Degree name (e.g. B.Tech in AI)"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                className="sm:col-span-2 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
              />
              <select
                value={newCourse.degree}
                onChange={(e) => setNewCourse({ ...newCourse, degree: e.target.value })}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800"
              >
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="Ph.D">Ph.D</option>
                <option value="Diploma">Diploma</option>
              </select>
              <Button type="button" size="sm" onClick={addCourse} icon={PlusCircle}>
                Add Program
              </Button>
            </div>

            <div className="space-y-2">
              {formData.courses?.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800">
                  <div>
                    <span className="font-bold">{c.name}</span>
                    <span className="text-slate-400 ml-2">({c.degree} • {c.duration} • {c.intake} seats)</span>
                  </div>
                  <button type="button" onClick={() => removeCourse(i)} className="text-rose-500 hover:text-rose-700 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Publication Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              >
                <option value="PUBLISHED">PUBLISHED (Visible)</option>
                <option value="DRAFT">DRAFT (Hidden)</option>
                <option value="UNPUBLISHED">UNPUBLISHED</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isFeaturedDept"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-primary-900 focus:ring-primary-700"
              />
              <label htmlFor="isFeaturedDept" className="text-xs font-bold text-slate-800 cursor-pointer">
                Feature on Homepage
              </label>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Academic Department"
        message="Are you sure you want to delete this department? All assigned faculty will be unlinked."
        isLoading={deleting}
      />
    </div>
  );
};

export default DepartmentsAdmin;
