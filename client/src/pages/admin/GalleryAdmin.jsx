import React, { useState, useEffect } from 'react';
import { galleryService } from '../../services/galleryService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FileUploader from '../../components/admin/FileUploader';
import { Plus, Edit, Trash2, Image as ImageIcon, PlusCircle } from 'lucide-react';

const GalleryAdmin = () => {
  const [galleries, setGalleries] = useState([]);
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
    category: 'Campus',
    description: '',
    coverImage: '',
    images: [],
    isFeatured: false,
    status: 'PUBLISHED',
  });

  const [newPhoto, setNewPhoto] = useState({ url: '', caption: '' });

  // Delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { success, error } = useToast();

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'ALL') params.category = categoryFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await galleryService.getAdminGalleries(params);
      if (res.success && res.data) {
        setGalleries(res.data);
      }
    } catch (err) {
      console.error('Failed to load gallery albums:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, [categoryFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Campus',
      description: '',
      coverImage: '',
      images: [],
      isFeatured: false,
      status: 'PUBLISHED',
    });
    setNewPhoto({ url: '', caption: '' });
    setModalOpen(true);
  };

  const openEditModal = (gal) => {
    setEditingId(gal._id);
    setFormData({
      title: gal.title,
      slug: gal.slug || '',
      category: gal.category || 'Campus',
      description: gal.description || '',
      coverImage: gal.coverImage || '',
      images: gal.images || [],
      isFeatured: !!gal.isFeatured,
      status: gal.status || 'PUBLISHED',
    });
    setNewPhoto({ url: '', caption: '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      error('Album title is required.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const res = await galleryService.updateGallery(editingId, formData);
        if (res.success) {
          success('Gallery album updated successfully!');
          setModalOpen(false);
          fetchGalleries();
        }
      } else {
        const res = await galleryService.createGallery(formData);
        if (res.success) {
          success('Gallery album created successfully!');
          setModalOpen(false);
          fetchGalleries();
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
      const res = await galleryService.deleteGallery(deletingId);
      if (res.success) {
        success('Album deleted successfully!');
        setDeleteModalOpen(false);
        setDeletingId(null);
        fetchGalleries();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete album.');
    } finally {
      setDeleting(false);
    }
  };

  const addPhotoToAlbum = () => {
    if (!newPhoto.url) return;
    setFormData({
      ...formData,
      images: [...formData.images, { ...newPhoto }],
      coverImage: formData.coverImage || newPhoto.url,
    });
    setNewPhoto({ url: '', caption: '' });
  };

  const removePhotoFromAlbum = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const columns = [
    {
      header: 'Album Title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
            <img
              src={row.coverImage || 'https://images.unsplash.com/photo-1562774053-701939374585?w=200'}
              alt={row.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">{row.title}</span>
            <span className="text-xs text-amber-700 font-semibold">{row.category}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Photos',
      cell: (row) => (
        <span className="text-xs font-semibold bg-primary-50 text-primary-900 px-2.5 py-1 rounded-md border border-primary-100">
          {row.images?.length || 0} Photos
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
            title="Edit Album"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDeletingId(row._id);
              setDeleteModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Album"
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
            Photo & Media Gallery Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create albums, upload high-resolution campus photos, manage captions, and feature highlight galleries.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          icon={Plus}
          size="md"
        >
          Create New Album
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
              fetchGalleries();
            }}
            placeholder="Search albums by title..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
          >
            <option value="ALL">All Categories</option>
            {['Campus', 'Events', 'Sports', 'Cultural Activities', 'Workshops', 'Seminars', 'Annual Functions', 'Achievements', 'Departments', 'Laboratories'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={galleries}
        isLoading={loading}
        emptyTitle="No gallery albums found"
      />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Gallery Album' : 'Create New Photo Album'}
        subtitle="Manage album title, cover, and add photos with captions."
        maxWidth="max-w-3xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={submitting}>
              {editingId ? 'Update Album' : 'Create Album'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Album Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Annual Tech Fest 2026 Celebrations"
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
                {['Campus', 'Events', 'Sports', 'Cultural Activities', 'Workshops', 'Seminars', 'Annual Functions', 'Achievements', 'Departments', 'Laboratories'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Album Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the event, venue, and highlights..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>

          <FileUploader
            label="Album Cover Image"
            currentUrl={formData.coverImage}
            onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
          />

          {/* Add Photos to Album */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Add Photos to Album
            </span>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <FileUploader
                label="Upload New Photo"
                currentUrl={newPhoto.url}
                onUploadSuccess={(url) => setNewPhoto({ ...newPhoto, url })}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Photo caption (e.g. Keynote address at main arena)..."
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                />
                <Button type="button" size="sm" onClick={addPhotoToAlbum} icon={PlusCircle}>
                  Add to Album
                </Button>
              </div>
            </div>

            {/* List of current photos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {formData.images?.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-slate-200 bg-white group">
                  <img src={img.url} alt={img.caption || `Photo ${i}`} className="w-full h-24 object-cover" />
                  <div className="p-2">
                    <p className="text-[10px] text-slate-600 truncate">{img.caption || 'No caption'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhotoFromAlbum(i)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
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
                id="isFeaturedGallery"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-primary-900 focus:ring-primary-700"
              />
              <label htmlFor="isFeaturedGallery" className="text-xs font-bold text-slate-800 cursor-pointer">
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
        title="Delete Photo Album"
        message="Are you sure you want to delete this photo album and all its images?"
        isLoading={deleting}
      />
    </div>
  );
};

export default GalleryAdmin;
