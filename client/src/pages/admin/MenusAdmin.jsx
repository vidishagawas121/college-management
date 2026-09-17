import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Menu as MenuIcon, MoveUp, MoveDown, Check, X, ExternalLink, Link2 } from 'lucide-react';
import { menuService } from '../../services/menuService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Button from '../../components/common/Button';

export default function MenusAdmin() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    target: '_self',
    position: 'HEADER',
    order: 0,
    isActive: true
  });

  const { showToast } = useToast();

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const res = await menuService.getAll();
      setMenus(res.data || []);
    } catch (err) {
      showToast('Failed to fetch menu items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title || '',
        url: item.url || '',
        target: item.target || '_self',
        position: item.position || 'HEADER',
        order: item.order || 0,
        isActive: item.isActive !== undefined ? item.isActive : true
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        url: '',
        target: '_self',
        position: 'HEADER',
        order: menus.length,
        isActive: true
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      showToast('Title and URL are required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (editingItem) {
        await menuService.update(editingItem._id, formData);
        showToast('Menu item updated', 'success');
      } else {
        await menuService.create(formData);
        showToast('Menu item created', 'success');
      }
      setModalOpen(false);
      fetchMenus();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await menuService.delete(itemToDelete._id);
      showToast('Menu item deleted', 'success');
      fetchMenus();
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showToast('Failed to delete menu item', 'error');
    }
  };

  const columns = [
    {
      header: 'Order & Position',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center">
            {row.order}
          </span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
            row.position === 'HEADER' 
              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
              : row.position === 'FOOTER'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {row.position}
          </span>
        </div>
      )
    },
    {
      header: 'Menu Label & Link',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
            {row.title}
            {row.target === '_blank' && (
              <ExternalLink size={12} className="text-slate-400" />
            )}
          </div>
          <div className="text-xs text-slate-500 font-mono mt-0.5">{row.url}</div>
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {row.isActive ? <Check size={12} /> : <X size={12} />}
          {row.isActive ? 'Active' : 'Disabled'}
        </span>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
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
          <h1 className="text-2xl font-bold text-slate-900">Navigation Menus</h1>
          <p className="text-sm text-slate-600 mt-1">
            Configure header top navigation links, footer directory links, and external portal shortcuts
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>
          Add Menu Link
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={menus}
        loading={loading}
        emptyMessage="No custom navigation items defined"
      />

      {/* Menu Form Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingItem ? 'Edit Menu Link' : 'Add New Navigation Link'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Link Label / Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., NIRF Ranking or Student Portal"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Destination URL / Path *
              </label>
              <input
                type="text"
                required
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="e.g., /about, /admissions, or https://nirfindia.org"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Menu Position
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="HEADER">Header Navigation</option>
                  <option value="FOOTER">Footer Links</option>
                  <option value="BOTH">Both Header & Footer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Target Window
                </label>
                <select
                  value={formData.target}
                  onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="_self">Same Tab (_self)</option>
                  <option value="_blank">New Tab (_blank)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="relative flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Link is Visible & Active</span>
                </label>
              </div>
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
                {editingItem ? 'Save Changes' : 'Create Menu Item'}
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
        title="Delete Menu Item"
        message={`Are you sure you want to delete the navigation item "${itemToDelete?.title}"?`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
