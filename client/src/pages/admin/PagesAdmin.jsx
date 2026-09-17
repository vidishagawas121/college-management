import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Globe, Eye, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { pageService } from '../../services/pageService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Button from '../../components/common/Button';
import RichTextEditor from '../../components/common/RichTextEditor';

export default function PagesAdmin() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'PUBLISHED',
    metaTitle: '',
    metaDescription: ''
  });

  const { showToast } = useToast();

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await pageService.getAll();
      setPages(res.data || []);
    } catch (err) {
      showToast('Failed to fetch pages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title || '',
        slug: item.slug || '',
        content: item.content || '',
        status: item.status || 'PUBLISHED',
        metaTitle: item.metaTitle || '',
        metaDescription: item.metaDescription || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        status: 'PUBLISHED',
        metaTitle: '',
        metaDescription: ''
      });
    }
    setModalOpen(true);
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    if (!editingItem) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, title: val, slug: generatedSlug }));
    } else {
      setFormData(prev => ({ ...prev, title: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      showToast('Title and content are required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (editingItem) {
        await pageService.update(editingItem._id, formData);
        showToast('Page updated successfully', 'success');
      } else {
        await pageService.create(formData);
        showToast('Page created successfully', 'success');
      }
      setModalOpen(false);
      fetchPages();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await pageService.delete(itemToDelete._id);
      showToast('Page deleted successfully', 'success');
      fetchPages();
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showToast('Failed to delete page', 'error');
    }
  };

  const columns = [
    {
      header: 'Page Title',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.title}</div>
          <div className="text-xs text-slate-500 font-mono">/pages/{row.slug}</div>
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Last Updated',
      render: (row) => (
        <span className="text-xs text-slate-500">
          {new Date(row.updatedAt || row.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <a
            href={`/pages/${row.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Preview Live Page"
          >
            <Eye size={16} />
          </a>
          <button
            onClick={() => handleOpenModal(row)}
            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => {
              setItemToDelete(row);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Custom & Policy Pages</h1>
          <p className="text-sm text-slate-600 mt-1">
            Create custom static content pages, privacy policies, anti-ragging bylaws, and institutional terms
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>
          Create New Page
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={pages}
        loading={loading}
        emptyMessage="No custom pages created yet"
      />

      {/* Page Form Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingItem ? 'Edit Page' : 'Create Custom Page'}
          size="2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Page Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g., Anti-Ragging Cell & Policy"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  URL Slug *
                </label>
                <div className="flex items-center">
                  <span className="bg-slate-100 border border-r-0 border-slate-300 px-3 py-2.5 rounded-l-lg text-xs text-slate-500 font-mono">
                    /pages/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="anti-ragging-policy"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-r-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Page Content (Rich HTML & Formatting) *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Compose the full page body, policies, headings, lists..."
                rows={10}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  SEO Meta Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="Leave blank to use Page Title"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Publication Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PUBLISHED">Published (Visible to public)</option>
                  <option value="DRAFT">Draft (Admin only)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                SEO Meta Description (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.metaDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                placeholder="Brief summary for search engine snippets"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={submitting}
              >
                {editingItem ? 'Update Page' : 'Publish Page'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Page"
        message={`Are you sure you want to permanently delete the page "${itemToDelete?.title}"? Links pointing to /pages/${itemToDelete?.slug} will return a 404.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
