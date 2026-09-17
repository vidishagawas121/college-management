import React, { useState, useEffect } from 'react';
import { achievementService } from '../../services/achievementService';
import { departmentService } from '../../services/departmentService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FileUploader from '../../components/admin/FileUploader';
import { Plus, Edit, Trash2, Trophy } from 'lucide-react';

const AchievementsAdmin = () => {
  const [achievements, setAchievements] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic',
    recipient: '',
    department: '',
    academicYear: '2025-2026',
    level: 'National',
    description: '',
    photo: '',
    isFeatured: false,
    status: 'PUBLISHED',
  });

  // Delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { success, error } = useToast();

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'ALL') params.category = categoryFilter;
      if (searchTerm) params.search = searchTerm;

      const [achRes, deptRes] = await Promise.all([
        achievementService.getAdminAchievements(params),
        departmentService.getPublicDepartments(),
      ]);

      if (achRes.success && achRes.data) setAchievements(achRes.data);
      if (deptRes.success && deptRes.data) setDepartments(deptRes.data);
    } catch (err) {
      console.error('Failed to load achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [categoryFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Academic',
      recipient: '',
      department: '',
      academicYear: '2025-2026',
      level: 'National',
      description: '',
      photo: '',
      isFeatured: false,
      status: 'PUBLISHED',
    });
    setModalOpen(true);
  };

  const openEditModal = (ach) => {
    setEditingId(ach._id);
    setFormData({
      title: ach.title,
      category: ach.category || 'Academic',
      recipient: ach.recipient || '',
      department: ach.department?._id || ach.department || '',
      academicYear: ach.academicYear || '2025-2026',
      level: ach.level || 'National',
      description: ach.description || '',
      photo: ach.photo || '',
      isFeatured: !!ach.isFeatured,
      status: ach.status || 'PUBLISHED',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.recipient || !formData.description) {
      error('Please fill in required fields (Title, Recipient, Description).');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const res = await achievementService.updateAchievement(editingId, formData);
        if (res.success) {
          success('Achievement updated successfully!');
          setModalOpen(false);
          fetchAchievements();
        }
      } else {
        const res = await achievementService.createAchievement(formData);
        if (res.success) {
          success('Achievement record added successfully!');
          setModalOpen(false);
          fetchAchievements();
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
      const res = await achievementService.deleteAchievement(deletingId);
      if (res.success) {
        success('Achievement record deleted successfully!');
        setDeleteModalOpen(false);
        setDeletingId(null);
        fetchAchievements();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete achievement.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Honor / Achievement',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.title}</span>
          <span className="text-xs text-amber-700 font-semibold">{row.category} • {row.level} Level</span>
        </div>
      )
    },
    {
      header: 'Recipient / Team',
      accessor: 'recipient',
      cell: (row) => <span className="text-xs font-bold text-academic-navy">{row.recipient}</span>
    },
    {
      header: 'Session',
      accessor: 'academicYear',
      cell: (row) => <span className="text-xs text-slate-500">{row.academicYear}</span>
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
            title="Edit Record"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDeletingId(row._id);
              setDeleteModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Record"
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
            Achievements & Laurels Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Record collegiate awards, national hackathon wins, research patents, and student athletics trophies.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          icon={Plus}
          size="md"
        >
          Add New Achievement
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
              fetchAchievements();
            }}
            placeholder="Search achievements by award or recipient..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
          >
            <option value="ALL">All Categories</option>
            {['Academic', 'Sports', 'Cultural', 'Research & Patents', 'Innovation & Hackathon', 'Faculty Recognition', 'Institutional Award'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={achievements}
        isLoading={loading}
        emptyTitle="No achievements recorded"
      />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Achievement Record' : 'Add New Achievement'}
        subtitle="Record recipient, category, recognition level, and photos."
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={submitting}>
              {editingId ? 'Update Record' : 'Save Achievement'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Achievement / Award Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. First Prize in National Autonomous Robotics Cup"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Recipient / Team Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                placeholder="e.g. Team AeroApex (CSE & Mechanical)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              >
                {['Academic', 'Sports', 'Cultural', 'Research & Patents', 'Innovation & Hackathon', 'Faculty Recognition', 'Institutional Award'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Award Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              >
                <option value="International">International</option>
                <option value="National">National</option>
                <option value="State">State</option>
                <option value="University">University</option>
                <option value="Inter-College">Inter-College</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Academic Year
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="2025-2026"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Related Department (Optional)
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              >
                <option value="">General / All Departments</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.shortName || d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <FileUploader
            label="Award / Event Photograph"
            currentUrl={formData.photo}
            onUploadSuccess={(url) => setFormData({ ...formData, photo: url })}
          />

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Achievement Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Details regarding the competition, project scope, and jury appreciation..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              >
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
                <option value="UNPUBLISHED">UNPUBLISHED</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isFeaturedAch"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-primary-900 focus:ring-primary-700"
              />
              <label htmlFor="isFeaturedAch" className="text-xs font-bold text-slate-800 cursor-pointer">
                Feature in Hall of Fame
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
        title="Delete Achievement Record"
        message="Are you sure you want to delete this achievement record?"
        isLoading={deleting}
      />
    </div>
  );
};

export default AchievementsAdmin;
