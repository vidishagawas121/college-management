import React, { useState, useEffect } from 'react';
import { noticeService } from '../../services/noticeService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FileUploader from '../../components/admin/FileUploader';
import { Plus, Edit, Trash2, Bell, FileText } from 'lucide-react';

const NoticesAdmin = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'General',
    description: '',
    priority: 'MEDIUM',
    publishDate: '',
    expiryDate: '',
    attachmentPdf: '',
    externalLink: '',
    isFeatured: false,
    status: 'PUBLISHED',
  });

  // Delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { success, error } = useToast();

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'ALL') params.category = categoryFilter;
      if (priorityFilter !== 'ALL') params.priority = priorityFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await noticeService.getAdminNotices(params);
      if (res.success && res.data) {
        setNotices(res.data);
      }
    } catch (err) {
      console.error('Failed to load notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [categoryFilter, priorityFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'General',
      description: '',
      priority: 'MEDIUM',
      publishDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      attachmentPdf: '',
      externalLink: '',
      isFeatured: false,
      status: 'PUBLISHED',
    });
    setModalOpen(true);
  };

  const openEditModal = (n) => {
    setEditingId(n._id);
    setFormData({
      title: n.title,
      slug: n.slug || '',
      category: n.category || 'General',
      description: n.description || '',
      priority: n.priority || 'MEDIUM',
      publishDate: n.publishDate ? new Date(n.publishDate).toISOString().split('T')[0] : '',
      expiryDate: n.expiryDate ? new Date(n.expiryDate).toISOString().split('T')[0] : '',
      attachmentPdf: n.attachmentPdf || '',
      externalLink: n.externalLink || '',
      isFeatured: !!n.isFeatured,
      status: n.status || 'PUBLISHED',
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
        const res = await noticeService.updateNotice(editingId, formData);
        if (res.success) {
          success('Notice updated successfully!');
          setModalOpen(false);
          fetchNotices();
        }
      } else {
        const res = await noticeService.createNotice(formData);
        if (res.success) {
          success('Notice created successfully!');
          setModalOpen(false);
          fetchNotices();
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
      const res = await noticeService.deleteNotice(deletingId);
      if (res.success) {
        success('Notice deleted successfully!');
        setDeleteModalOpen(false);
        setDeletingId(null);
        fetchNotices();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete notice.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Notice Title',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.title}</span>
          <span className="text-xs text-slate-500">{row.category}</span>
        </div>
      )
    },
    {
      header: 'Priority',
      cell: (row) => <StatusBadge status={row.priority} />
    },
    {
      header: 'Publish Date',
      cell: (row) => (
        <span className="text-xs text-slate-600 font-medium">
          {new Date(row.publishDate || row.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Expiry Date',
      cell: (row) => (
        <span className="text-xs text-slate-500">
          {row.expiryDate ? new Date(row.expiryDate).toLocaleDateString() : 'No expiry'}
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
            Notices & Announcements Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Issue exam schedules, circulars, fee notifications, and set urgent banner tickers.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          icon={Plus}
          size="md"
        >
          Publish New Notice
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
              fetchNotices();
            }}
            placeholder="Search notices by title or content..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
          >
            <option value="ALL">All Categories</option>
            {['General', 'Academic', 'Examination', 'Admission', 'Events', 'Important', 'Circular', 'Hostel & Transport'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent Alert</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={notices}
        isLoading={loading}
        emptyTitle="No notices found"
      />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Official Circular' : 'Publish New Circular / Notice'}
        subtitle="Set priority flags, active date schedules, and upload official PDF documents."
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Notice / Circular Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Schedule for End-Semester Practical & Theory Examinations"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              >
                {['General', 'Academic', 'Examination', 'Admission', 'Events', 'Important', 'Circular', 'Hostel & Transport'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent (Shows in Top Ticker)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Publish Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Expiry Date (Notice will auto-archive)
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Notice Content / Instructions <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Full text of the circular, exam instructions, deadlines..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileUploader
              label="Official PDF Attachment"
              accept="application/pdf"
              currentUrl={formData.attachmentPdf}
              onUploadSuccess={(url) => setFormData({ ...formData, attachmentPdf: url })}
            />

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                External Link (Optional)
              </label>
              <input
                type="url"
                value={formData.externalLink}
                onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              />
            </div>
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
                id="isFeaturedNotice"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-primary-900 focus:ring-primary-700"
              />
              <label htmlFor="isFeaturedNotice" className="text-xs font-bold text-slate-800 cursor-pointer">
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
        title="Delete Official Circular"
        message="Are you sure you want to delete this notice?"
        isLoading={deleting}
      />
    </div>
  );
};

export default NoticesAdmin;
