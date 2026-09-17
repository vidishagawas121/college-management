import React, { useState, useEffect } from 'react';
import { Save, Sliders, Globe, Mail, Phone, MapPin, Share2, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { useToast } from '../../context/ToastContext';
import { useCollege } from '../../context/CollegeContext';
import Button from '../../components/common/Button';
import FileUploader from '../../components/admin/FileUploader';

export default function SettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    collegeName: '',
    tagline: '',
    primaryPhone: '',
    secondaryPhone: '',
    primaryEmail: '',
    admissionEmail: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    logoUrl: '',
    faviconUrl: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      youtube: ''
    },
    googleMapsEmbedUrl: '',
    enableAdmissionBanner: true,
    admissionBannerText: '',
    footerText: '',
    establishedYear: 1984
  });

  const { showToast } = useToast();
  const { refreshInfo } = useCollege();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await settingsService.getSettings();
        if (res.data) {
          setSettings(prev => ({
            ...prev,
            ...res.data,
            socialLinks: { ...prev.socialLinks, ...(res.data.socialLinks || {}) }
          }));
        }
      } catch (err) {
        showToast('Failed to load website settings', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsService.updateSettings(settings);
      showToast('Settings saved successfully', 'success');
      refreshInfo();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Website & Brand Settings</h1>
          <p className="text-sm text-slate-600 mt-1">
            Configure global website identity, contact coordinates, social channels, and public banner alerts
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand & Identity */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Sparkles className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-slate-900">Brand Identity & Logos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                College Official Name *
              </label>
              <input
                type="text"
                required
                value={settings.collegeName}
                onChange={(e) => setSettings(prev => ({ ...prev, collegeName: e.target.value }))}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Motto / Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
                placeholder="e.g., Empowering Minds, Engineering the Future"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <FileUploader
                label="College Official Logo"
                fileType="IMAGE"
                currentUrl={settings.logoUrl}
                onUploadSuccess={(url) => setSettings(prev => ({ ...prev, logoUrl: url }))}
                helperText="PNG, SVG, or high-res JPG with transparent or solid background"
              />
            </div>

            <div>
              <FileUploader
                label="Browser Favicon Icon"
                fileType="IMAGE"
                currentUrl={settings.faviconUrl}
                onUploadSuccess={(url) => setSettings(prev => ({ ...prev, faviconUrl: url }))}
                helperText="Square 1:1 ratio icon (e.g., 64x64 or 128x128)"
              />
            </div>
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Phone className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-slate-900">Official Contact Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Primary Phone Number *
              </label>
              <input
                type="text"
                required
                value={settings.primaryPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, primaryPhone: e.target.value }))}
                placeholder="+1 (800) 555-0199"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Secondary / Helpline Phone
              </label>
              <input
                type="text"
                value={settings.secondaryPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, secondaryPhone: e.target.value }))}
                placeholder="+1 (800) 555-0198"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                General Enquiries Email *
              </label>
              <input
                type="email"
                required
                value={settings.primaryEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, primaryEmail: e.target.value }))}
                placeholder="contact@college.edu"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Admissions Office Email
              </label>
              <input
                type="email"
                value={settings.admissionEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, admissionEmail: e.target.value }))}
                placeholder="admissions@college.edu"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Campus Physical Address *
              </label>
              <input
                type="text"
                required
                value={settings.address}
                onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                placeholder="100 University Boulevard, Academic City"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                City & State
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => setSettings(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="City"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={settings.state}
                  onChange={(e) => setSettings(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="State"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Postal / PIN Code
              </label>
              <input
                type="text"
                value={settings.pincode}
                onChange={(e) => setSettings(prev => ({ ...prev, pincode: e.target.value }))}
                placeholder="e.g., 90210"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Google Maps Embed URL (Iframe Src)
              </label>
              <input
                type="text"
                value={settings.googleMapsEmbedUrl}
                onChange={(e) => setSettings(prev => ({ ...prev, googleMapsEmbedUrl: e.target.value }))}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Share2 className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-slate-900">Social Media Handles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Facebook URL</label>
              <input
                type="url"
                value={settings.socialLinks?.facebook || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                }))}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={settings.socialLinks?.linkedin || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                }))}
                placeholder="https://linkedin.com/school/..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                }))}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">YouTube Channel URL</label>
              <input
                type="url"
                value={settings.socialLinks?.youtube || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                }))}
                placeholder="https://youtube.com/@..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Global Notices / Marquee Alert */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <AlertCircle className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-slate-900">Announcement Ticker & Banner</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <label className="relative flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.enableAdmissionBanner}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableAdmissionBanner: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-slate-800">
                  Enable Top Marquee Ticker & Announcement Bar
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Ticker Headline / Marquee Text
              </label>
              <input
                type="text"
                value={settings.admissionBannerText}
                onChange={(e) => setSettings(prev => ({ ...prev, admissionBannerText: e.target.value }))}
                placeholder="e.g., Admissions Open for Academic Year 2026-2027 • Apply Online Before August 31st"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Custom Footer Copyright Notice
              </label>
              <input
                type="text"
                value={settings.footerText}
                onChange={(e) => setSettings(prev => ({ ...prev, footerText: e.target.value }))}
                placeholder="e.g., All Rights Reserved. Approved by AICTE, Affiliated to State Technological University."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 sticky bottom-4 bg-white/95 backdrop-blur p-4 rounded-xl border border-slate-200 shadow-lg">
          <Button
            type="submit"
            icon={Save}
            loading={saving}
          >
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
