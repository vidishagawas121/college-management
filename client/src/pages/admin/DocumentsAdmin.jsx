import React, { useState, useEffect } from 'react';
import { documentService } from '../../services/documentService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FileUploader from '../../components/admin/FileUploader';
import { Plus, Edit, Trash2, FileText, Download } from 'lucide-react';

const DocumentsAdmin = () => {
  const [documents, setDocuments] = useState([]);
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
    description: '',
    category: 'General',
    fileUrl: '',
    fileName: '',
    fileSize: '1.2 MB',
    fileType: 'application/pdf',
    status: 'PUBLISHED',
  });

  // Delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { success, error } = useToast();

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'ALL') params.category = categoryFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await documentService.getAdminDocuments(params);
      if (res.success && res.data) {
        setDocuments(res.data);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [categoryFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      category: 'General',
      fileUrl: '',
      fileName: '',
      fileSize: '1.2 MB',
      fileType: 'application/pdf',
      status: 'PUBLISHED',
    });
    setModalOpen(true);
  };

  const openEditModal = (doc) => {
    setEditingId(doc._id);
    setFormData({
      title: doc.title,
      description: doc.description || '',
      category: doc.category || 'General',
      fileUrl: doc.fileUrl || '',
      fileName: doc.fileName || '',
      fileSize: doc.fileSize || '1.2 MB',
      fileType: doc.fileType || 'application/pdf',
      status: doc.status || 'PUBLISHED',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.fileUrl) {
      error('Please provide a document title and upload a file.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const res = await documentService.updateDocument(editingId, formData);
        if (res.success) {
          success('Document updated successfully!');
          setModalOpen(false);
          fetchDocuments();
        }
      } else {
        const res = await documentService.createDocument(formData);
        if (res.success) {
          success('Document uploaded and published successfully!');
          setModalOpen(false);
          fetchDocuments();
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
      const res = await documentService.deleteDocument(deletingId);
      if (res.success) {
        success('Document deleted successfully!');
        setDeleteModalOpen(false);
        setDeletingId(null);
        fetchDocuments();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete document.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Document Name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 border border-rose-200">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">{row.title}</span>
            <span className="text-xs text-slate-500">{row.category}</span>
          </div>
        </div>
      )
    },
    {
      header: 'File Size',
      accessor: 'fileSize',
      cell: (row) => <span className="text-xs text-slate-600">{row.fileSize || '—'}</span>
    },
    {
      header: 'Downloads',
      accessor: 'downloadCount',
      cell: (row) => (
        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.downloadCount || 0}</span>
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
            title="Edit Document"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDeletingId(row._id);
              setDeleteModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Document"
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
            Documents & Media Repository
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload institutional prospectus, academic calendars, mandatory disclosures, circulars, and admission forms.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          icon={Plus}
          size="md"
        >
          Upload New Document
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
              fetchDocuments();
            }}
            placeholder="Search documents by title..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
          >
            <option value="ALL">All Categories</option>
            {['Prospectus', 'Academic Calendar', 'Admission Forms', 'Circulars', 'Examination Rules', 'Syllabus', 'Annual Reports', 'Mandatory Disclosures', 'General'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={documents}
        isLoading={loading}
        emptyTitle="No documents uploaded"
      />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Document Details' : 'Upload Institutional Document'}
        subtitle="Manage official PDF attachments and categorize files for public download."
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={submitting}>
              {editingId ? 'Update Document' : 'Upload & Publish'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Document Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Academic Calendar 2026-2027"
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
              {['Prospectus', 'Academic Calendar', 'Admission Forms', 'Circulars', 'Examination Rules', 'Syllabus', 'Annual Reports', 'Mandatory Disclosures', 'General'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <FileUploader
            label="Upload Document / PDF File"
            accept="application/pdf"
            required
            currentUrl={formData.fileUrl}
            onUploadSuccess={(url, meta) => {
              setFormData({
                ...formData,
                fileUrl: url,
                fileName: meta?.originalName || url.split('/').pop(),
                fileSize: meta?.size || '1.5 MB',
              });
            }}
          />

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Short Description / Remarks
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief details about the document content..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
            >
              <option value="PUBLISHED">PUBLISHED (Downloadable)</option>
              <option value="DRAFT">DRAFT</option>
              <option value="UNPUBLISHED">UNPUBLISHED</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document from the repository?"
        isLoading={deleting}
      />
    </div>
  );
};

export default DocumentsAdmin;
