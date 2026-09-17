import React, { useState, useEffect } from 'react';
import { admissionService } from '../../services/admissionService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FileUploader from '../../components/admin/FileUploader';
import { Plus, Edit, Trash2, FileSpreadsheet, PlusCircle } from 'lucide-react';

const AdmissionsAdmin = () => {
  const [admissions, setAdmissions] = useState([]);
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
    slug: '',
    category: 'Undergraduate',
    academicYear: '2026-2027',
    description: '',
    eligibility: '',
    procedure: '',
    feeStructure: '',
    importantDates: [],
    attachmentPdf: '',
    externalApplyUrl: '',
    contactHelpline: '',
    isFeatured: false,
    status: 'PUBLISHED',
  });

  const [newDate, setNewDate] = useState({ event: '', date: '' });

  // Delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { success, error } = useToast();

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'ALL') params.category = categoryFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await admissionService.getAdminAdmissions(params);
      if (res.success && res.data) {
        setAdmissions(res.data);
      }
    } catch (err) {
      console.error('Failed to load admissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [categoryFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Undergraduate',
      academicYear: '2026-2027',
      description: '',
      eligibility: '',
      procedure: '',
      feeStructure: '',
      importantDates: [],
      attachmentPdf: '',
      externalApplyUrl: '',
      contactHelpline: '+91 (0) 1234 567800',
      isFeatured: false,
      status: 'PUBLISHED',
    });
    setModalOpen(true);
  };

  const openEditModal = (adm) => {
    setEditingId(adm._id);
    setFormData({
      title: adm.title,
      slug: adm.slug || '',
      category: adm.category || 'Undergraduate',
      academicYear: adm.academicYear || '2026-2027',
      description: adm.description || '',
      eligibility: adm.eligibility || '',
      procedure: adm.procedure || '',
      feeStructure: adm.feeStructure || '',
      importantDates: adm.importantDates || [],
      attachmentPdf: adm.attachmentPdf || '',
      externalApplyUrl: adm.externalApplyUrl || '',
      contactHelpline: adm.contactHelpline || '',
      isFeatured: !!adm.isFeatured,
      status: adm.status || 'PUBLISHED',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      error('Please fill in required fields (Title, Description).');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const res = await admissionService.updateAdmission(editingId, formData);
        if (res.success) {
          success('Admission notice updated successfully!');
          setModalOpen(false);
          fetchAdmissions();
        }
      } else {
        const res = await admissionService.createAdmission(formData);
        if (res.success) {
          success('Admission notice published successfully!');
          setModalOpen(false);
          fetchAdmissions();
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
      const res = await admissionService.deleteAdmission(deletingId);
      if (res.success) {
        success('Admission notice deleted successfully!');
        setDeleteModalOpen(false);
        setDeletingId(null);
        fetchAdmissions();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete admission notice.');
    } finally {
      setDeleting(false);
    }
  };

  const addImportantDate = () => {
    if (!newDate.event || !newDate.date) return;
    setFormData({
      ...formData,
      importantDates: [...formData.importantDates, { ...newDate }],
    });
    setNewDate({ event: '', date: '' });
  };

  const removeImportantDate = (index) => {
    setFormData({
      ...formData,
      importantDates: formData.importantDates.filter((_, i) => i !== index),
    });
  };

  const columns = [
    {
      header: 'Admission Title',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.title}</span>
          <span className="text-xs text-amber-700 font-semibold">{row.category} • Session {row.academicYear}</span>
        </div>
      )
    },
    {
      header: 'Deadlines',
      cell: (row) => (
        <span className="text-xs text-slate-600 font-semibold">
          {row.importantDates?.length || 0} Milestones
        </span>
      )
    },
    {
      header: 'Apply Link',
      cell: (row) => row.externalApplyUrl ? (
        <a href={row.externalApplyUrl} target="_blank" rel="noreferrer" className="text-xs text-primary-900 hover:underline">
          Configured
        </a>
      ) : <span className="text-xs text-slate-400">Manual / Campus</span>
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
            title="Edit Notice"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDeletingId(row._id);
              setDeleteModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Notice"
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
            Admissions Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create enrollment circulars, deadlines, eligibility criteria, application portals, and prospectus downloads.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          icon={Plus}
          size="md"
        >
          Publish Admission Notice
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
              fetchAdmissions();
            }}
            placeholder="Search admission notices..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
          >
            <option value="ALL">All Categories</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Postgraduate">Postgraduate</option>
            <option value="Ph.D">Ph.D</option>
            <option value="Diploma">Diploma</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={admissions}
        isLoading={loading}
        emptyTitle="No admission notices found"
      />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Admission Notice' : 'Publish New Admission Notice'}
        subtitle="Manage program requirements, timeline, fee info, and online application URL."
        maxWidth="max-w-3xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={submitting}>
              {editingId ? 'Update Notice' : 'Publish Notice'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Notice Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Undergraduate B.Tech Admissions 2026-27"
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
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Ph.D">Ph.D</option>
                <option value="Diploma">Diploma</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Academic Year
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="e.g. 2026-2027"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Contact Helpline
              </label>
              <input
                type="text"
                value={formData.contactHelpline}
                onChange={(e) => setFormData({ ...formData, contactHelpline: e.target.value })}
                placeholder="+91 (0) 1234 567800"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Admission Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Overview of seats, intake criteria, and general instructions..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Eligibility Conditions
            </label>
            <textarea
              rows={2}
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              placeholder="Minimum qualifying marks in 10+2 / entrance test..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>

          {/* Important Schedule Milestones */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Important Deadlines & Dates
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <input
                type="text"
                placeholder="Event milestone (e.g. Portal Closes)"
                value={newDate.event}
                onChange={(e) => setNewDate({ ...newDate, event: e.target.value })}
                className="sm:col-span-3 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
              />
              <input
                type="text"
                placeholder="Date (e.g. June 30, 2026)"
                value={newDate.date}
                onChange={(e) => setNewDate({ ...newDate, date: e.target.value })}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
              />
              <Button type="button" size="sm" onClick={addImportantDate} icon={PlusCircle}>
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {formData.importantDates?.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800">
                  <div>
                    <span className="font-bold">{d.event}:</span>
                    <span className="text-primary-900 font-semibold ml-2">{d.date}</span>
                  </div>
                  <button type="button" onClick={() => removeImportantDate(i)} className="text-rose-500 hover:text-rose-700 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                External Online Application Link
              </label>
              <input
                type="url"
                value={formData.externalApplyUrl}
                onChange={(e) => setFormData({ ...formData, externalApplyUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              />
            </div>

            <FileUploader
              label="Official PDF Document / Brochure"
              accept="application/pdf"
              currentUrl={formData.attachmentPdf}
              onUploadSuccess={(url) => setFormData({ ...formData, attachmentPdf: url })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Publication Status
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
                id="isFeaturedAdmission"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-primary-900 focus:ring-primary-700"
              />
              <label htmlFor="isFeaturedAdmission" className="text-xs font-bold text-slate-800 cursor-pointer">
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
        title="Delete Admission Notice"
        message="Are you sure you want to delete this admission notice?"
        isLoading={deleting}
      />
    </div>
  );
};

export default AdmissionsAdmin;
