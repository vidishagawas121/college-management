import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, CheckCircle2, Clock, Trash2, Eye, Search, Filter } from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Button from '../../components/common/Button';

export default function EnquiriesAdmin() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { showToast } = useToast();

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await enquiryService.getAll({ status: statusFilter });
      setEnquiries(res.data || []);
    } catch (err) {
      showToast('Failed to fetch contact enquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleView = async (enquiry) => {
    setSelectedEnquiry(enquiry);
    setViewModalOpen(true);
    if (enquiry.status === 'UNREAD') {
      try {
        await enquiryService.markAsRead(enquiry._id);
        setEnquiries(prev => prev.map(e => e._id === enquiry._id ? { ...e, status: 'READ' } : e));
      } catch (err) {
        // silent error for read status update
      }
    }
  };

  const handleToggleStatus = async (enquiry) => {
    try {
      const newStatus = enquiry.status === 'READ' ? 'UNREAD' : 'READ';
      if (newStatus === 'READ') {
        await enquiryService.markAsRead(enquiry._id);
      } else {
        await enquiryService.updateStatus(enquiry._id, 'UNREAD');
      }
      showToast(`Marked as ${newStatus.toLowerCase()}`, 'success');
      fetchEnquiries();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await enquiryService.delete(itemToDelete._id);
      showToast('Enquiry deleted successfully', 'success');
      fetchEnquiries();
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showToast('Failed to delete enquiry', 'error');
    }
  };

  const filteredEnquiries = enquiries.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.subject?.toLowerCase().includes(q) ||
      item.message?.toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      header: 'Sender Details',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900 flex items-center gap-2">
            {row.name}
            {row.status === 'UNREAD' && (
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse"></span>
            )}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1"><Mail size={12} /> {row.email}</span>
            {row.phone && <span className="flex items-center gap-1"><Phone size={12} /> {row.phone}</span>}
          </div>
        </div>
      )
    },
    {
      header: 'Subject & Preview',
      render: (row) => (
        <div className="max-w-md">
          <p className="font-medium text-slate-800 text-sm truncate">{row.subject}</p>
          <p className="text-xs text-slate-500 truncate mt-0.5">{row.message}</p>
        </div>
      )
    },
    {
      header: 'Received Date',
      render: (row) => (
        <span className="text-xs text-slate-600 flex items-center gap-1.5">
          <Calendar size={13} />
          {new Date(row.createdAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
          row.status === 'READ' 
            ? 'bg-slate-100 text-slate-700 border border-slate-200' 
            : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {row.status === 'READ' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleView(row)}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleToggleStatus(row)}
            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
            title={row.status === 'READ' ? 'Mark as Unread' : 'Mark as Read'}
          >
            <CheckCircle2 size={16} />
          </button>
          <button
            onClick={() => {
              setItemToDelete(row);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Enquiry"
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
          <h1 className="text-2xl font-bold text-slate-900">Student & Public Enquiries</h1>
          <p className="text-sm text-slate-600 mt-1">Review contact inquiries submitted through the public portal</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={16} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="UNREAD">Unread Only</option>
            <option value="READ">Read Only</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredEnquiries}
        loading={loading}
        emptyMessage="No enquiries found matching your criteria"
      />

      {/* View Enquiry Modal */}
      {viewModalOpen && selectedEnquiry && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title="Inquiry Details"
        >
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedEnquiry.name}</h3>
                  <p className="text-xs text-slate-500">{new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  selectedEnquiry.status === 'READ' ? 'bg-slate-200 text-slate-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedEnquiry.status}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-sm text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Mail size={14} className="text-slate-400" />
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-blue-600 hover:underline">
                    {selectedEnquiry.email}
                  </a>
                </div>
                {selectedEnquiry.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone size={14} className="text-slate-400" />
                    <a href={`tel:${selectedEnquiry.phone}`} className="text-blue-600 hover:underline">
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Subject
              </label>
              <p className="text-sm font-semibold text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-200">
                {selectedEnquiry.subject}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Message Content
              </label>
              <div className="text-sm text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedEnquiry.message}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <a
                href={`mailto:${selectedEnquiry.email}?subject=Re: ${encodeURIComponent(selectedEnquiry.subject)}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Mail size={15} /> Reply via Email
              </a>
              <Button variant="secondary" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Enquiry"
        message={`Are you sure you want to delete the enquiry from "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
