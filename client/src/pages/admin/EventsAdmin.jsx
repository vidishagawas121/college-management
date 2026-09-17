import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FileUploader from '../../components/admin/FileUploader';
import RichTextEditor from '../../components/common/RichTextEditor';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

const EventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Academic',
    description: '',
    date: '',
    endDate: '',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    venue: '',
    organizer: 'AITS Events Committee',
    coverImage: '',
    registrationLink: '',
    isFeatured: false,
    status: 'PUBLISHED',
  });

  // Delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { success, error } = useToast();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'ALL') params.category = categoryFilter;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await eventService.getAdminEvents(params);
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [categoryFilter, statusFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Academic',
      description: '',
      date: new Date().toISOString().split('T')[0],
      endDate: '',
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      venue: 'Main Auditorium, Campus Block A',
      organizer: 'AITS Events Committee',
      coverImage: '',
      registrationLink: '',
      isFeatured: false,
      status: 'PUBLISHED',
    });
    setModalOpen(true);
  };

  const openEditModal = (evt) => {
    setEditingId(evt._id);
    setFormData({
      title: evt.title,
      slug: evt.slug || '',
      category: evt.category || 'Academic',
      description: evt.description || '',
      date: evt.date ? new Date(evt.date).toISOString().split('T')[0] : '',
      endDate: evt.endDate ? new Date(evt.endDate).toISOString().split('T')[0] : '',
      startTime: evt.startTime || '09:00 AM',
      endTime: evt.endTime || '05:00 PM',
      venue: evt.venue || '',
      organizer: evt.organizer || '',
      coverImage: evt.coverImage || '',
      registrationLink: evt.registrationLink || '',
      isFeatured: !!evt.isFeatured,
      status: evt.status || 'PUBLISHED',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.description) {
      error('Please fill in required fields (Title, Date, Description).');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const res = await eventService.updateEvent(editingId, formData);
        if (res.success) {
          success('Event updated successfully!');
          setModalOpen(false);
          fetchEvents();
        }
      } else {
        const res = await eventService.createEvent(formData);
        if (res.success) {
          success('Event scheduled successfully!');
          setModalOpen(false);
          fetchEvents();
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
      const res = await eventService.deleteEvent(deletingId);
      if (res.success) {
        success('Event deleted successfully!');
        setDeleteModalOpen(false);
        setDeletingId(null);
        fetchEvents();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete event.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Event Title',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.title}</span>
          <span className="text-xs text-amber-700 font-semibold">{row.category}</span>
        </div>
      )
    },
    {
      header: 'Schedule Date',
      cell: (row) => (
        <span className="text-xs text-slate-700 font-semibold">
          {new Date(row.date).toLocaleDateString()} ({row.startTime})
        </span>
      )
    },
    {
      header: 'Venue',
      accessor: 'venue',
      cell: (row) => <span className="text-xs text-slate-600 truncate max-w-[160px] block">{row.venue}</span>
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
            title="Edit Event"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDeletingId(row._id);
              setDeleteModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Event"
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
            Events Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Schedule academic conferences, symposiums, cultural nights, tech fests, and workshops.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          icon={Plus}
          size="md"
        >
          Schedule New Event
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
              fetchEvents();
            }}
            placeholder="Search events by title or venue..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
          >
            <option value="ALL">All Categories</option>
            {['Academic', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Conference'].map((c) => (
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
        data={events}
        isLoading={loading}
        emptyTitle="No events scheduled"
      />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Event Schedule' : 'Schedule New Event'}
        subtitle="Manage dates, venue, registration links, and category."
        maxWidth="max-w-3xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={submitting}>
              {editingId ? 'Update Event' : 'Schedule Event'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Event Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. ApexInnovate 2026 Tech Symposium"
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
                {['Academic', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Conference', 'Alumni', 'General'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Start Time
              </label>
              <input
                type="text"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                placeholder="09:00 AM"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                End Time
              </label>
              <input
                type="text"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                placeholder="05:00 PM"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Venue Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g. Grand Central Auditorium"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Organizing Body
              </label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                placeholder="e.g. AITS Technical Council"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              />
            </div>
          </div>

          <FileUploader
            label="Event Cover Image"
            currentUrl={formData.coverImage}
            onUploadSuccess={(url) => setFormData({ ...formData, coverImage: url })}
          />

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              External Registration / Ticket URL (Optional)
            </label>
            <input
              type="url"
              value={formData.registrationLink}
              onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
              placeholder="https://..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Detailed Event Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Full details regarding speakers, schedule, eligibility, and prizes..."
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
                id="isFeaturedEvent"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-primary-900 focus:ring-primary-700"
              />
              <label htmlFor="isFeaturedEvent" className="text-xs font-bold text-slate-800 cursor-pointer">
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
        title="Delete Scheduled Event"
        message="Are you sure you want to delete this event record?"
        isLoading={deleting}
      />
    </div>
  );
};

export default EventsAdmin;
