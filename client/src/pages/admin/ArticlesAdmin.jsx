import React, { useState, useEffect } from 'react';
import { articleService } from '../../services/articleService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FileUploader from '../../components/admin/FileUploader';
import RichTextEditor from '../../components/common/RichTextEditor';
import { Plus, Edit, Trash2, Newspaper } from 'lucide-react';

const ArticlesAdmin = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Campus News',
    author: 'College Media & Public Relations Cell',
    shortDescription: '',
    content: '',
    featuredImage: '',
    tags: [],
    seoTitle: '',
    seoDescription: '',
    isFeatured: false,
    status: 'PUBLISHED',
  });

  const [tagsInput, setTagsInput] = useState('');

  // Delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { success, error } = useToast();

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'ALL') params.category = categoryFilter;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await articleService.getAdminArticles(params);
      if (res.success && res.data) {
        setArticles(res.data);
      }
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [categoryFilter, statusFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Campus News',
      author: 'College Media & Public Relations Cell',
      shortDescription: '',
      content: '',
      featuredImage: '',
      tags: [],
      seoTitle: '',
      seoDescription: '',
      isFeatured: false,
      status: 'PUBLISHED',
    });
    setTagsInput('');
    setModalOpen(true);
  };

  const openEditModal = (art) => {
    setEditingId(art._id);
    setFormData({
      title: art.title,
      slug: art.slug || '',
      category: art.category || 'Campus News',
      author: art.author || '',
      shortDescription: art.shortDescription || '',
      content: art.content || '',
      featuredImage: art.featuredImage || '',
      tags: art.tags || [],
      seoTitle: art.seoTitle || '',
      seoDescription: art.seoDescription || '',
      isFeatured: !!art.isFeatured,
      status: art.status || 'PUBLISHED',
    });
    setTagsInput((art.tags || []).join(', '));
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.shortDescription || !formData.content) {
      error('Please fill in required fields (Title, Short Description, Content).');
      return;
    }

    const payload = {
      ...formData,
      tags: tagsInput ? tagsInput.split(',').map(s => s.trim()).filter(Boolean) : [],
    };

    setSubmitting(true);
    try {
      if (editingId) {
        const res = await articleService.updateArticle(editingId, payload);
        if (res.success) {
          success('Article updated successfully!');
          setModalOpen(false);
          fetchArticles();
        }
      } else {
        const res = await articleService.createArticle(payload);
        if (res.success) {
          success('Article published successfully!');
          setModalOpen(false);
          fetchArticles();
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
      const res = await articleService.deleteArticle(deletingId);
      if (res.success) {
        success('Article deleted successfully!');
        setDeleteModalOpen(false);
        setDeletingId(null);
        fetchArticles();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete article.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Article Title',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.title}</span>
          <span className="text-xs text-amber-700 font-semibold">{row.category}</span>
        </div>
      )
    },
    {
      header: 'Author',
      accessor: 'author',
      cell: (row) => <span className="text-xs text-slate-600">{row.author}</span>
    },
    {
      header: 'Published Date',
      cell: (row) => (
        <span className="text-xs text-slate-500">
          {new Date(row.publicationDate || row.createdAt).toLocaleDateString()}
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
            title="Edit Article"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDeletingId(row._id);
              setDeleteModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Article"
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
            News & Articles CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Write, format, categorize, schedule drafts, and publish official university articles and press releases.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          icon={Plus}
          size="md"
        >
          Write New Article
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
              fetchArticles();
            }}
            placeholder="Search news by title..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
          >
            <option value="ALL">All Categories</option>
            {['Campus News', 'Research & Innovation', 'Student Life', 'Faculty Spotlight', 'Events & Highlights', 'Alumni Story'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

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
        data={articles}
        isLoading={loading}
        emptyTitle="No articles found"
      />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Article' : 'Write New Article'}
        subtitle="Full rich text content, tags, author, and SEO meta configuration."
        maxWidth="max-w-4xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={submitting}>
              {editingId ? 'Update Article' : 'Publish Article'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Article Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. AITS Secures Highest NAAC A++ Accreditation"
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
                {['Campus News', 'Research & Innovation', 'Student Life', 'Faculty Spotlight', 'Events & Highlights', 'Alumni Story', 'General'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Author / Cell
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. Office of Communications"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. NAAC, Accreditation, Excellence"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              />
            </div>
          </div>

          <FileUploader
            label="Featured Cover Image"
            currentUrl={formData.featuredImage}
            onUploadSuccess={(url) => setFormData({ ...formData, featuredImage: url })}
          />

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Short Description / Summary <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              maxLength={300}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief summary that appears in article listings (Max 300 chars)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>

          <RichTextEditor
            label="Full Article Content"
            required
            value={formData.content}
            onChange={(val) => setFormData({ ...formData, content: val })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                SEO Meta Title (Optional)
              </label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="Custom title for Google search..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                SEO Meta Description (Optional)
              </label>
              <input
                type="text"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="Custom snippet description for search engines..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              />
            </div>
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
                <option value="PUBLISHED">PUBLISHED (Live)</option>
                <option value="DRAFT">DRAFT (Hidden)</option>
                <option value="UNPUBLISHED">UNPUBLISHED</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isFeaturedArticle"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-primary-900 focus:ring-primary-700"
              />
              <label htmlFor="isFeaturedArticle" className="text-xs font-bold text-slate-800 cursor-pointer">
                Feature in Top News Section
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
        title="Delete Article"
        message="Are you sure you want to permanently delete this news article?"
        isLoading={deleting}
      />
    </div>
  );
};

export default ArticlesAdmin;
