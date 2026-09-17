import React, { useState } from 'react';
import { User, Lock, Mail, Key, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';

export default function ProfileAdmin() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      showToast('Password changed successfully', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Account & Security</h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage system administrator credentials and update your secure access passphrase
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account Info Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{user?.name || 'Administrator'}</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1">
                <ShieldCheck size={12} /> Root Admin
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Email Address</span>
              <span className="font-medium text-slate-800">{user?.email || 'admin@college.edu'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">System Role</span>
              <span className="font-medium text-slate-800">Single Institutional Administrator</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Privilege Level</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Full CMS Control</span>
            </div>
          </div>
        </div>

        {/* Password Change Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Key className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-slate-900">Change Master Password</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-900 flex gap-2">
              <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <span>
                Ensure you remember your updated password. As this is a single root administrator account, changing your password will take effect immediately for all active dashboard sessions.
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                loading={submitting}
                icon={Lock}
              >
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
