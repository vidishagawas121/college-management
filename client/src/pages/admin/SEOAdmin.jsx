import React, { useState, useEffect } from 'react';
import { Save, Search, Share2, Globe, Tag, Sparkles } from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import FileUploader from '../../components/admin/FileUploader';

export default function SEOAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seoData, setSeoData] = useState({
    defaultMetaTitle: '',
    defaultMetaDescription: '',
    defaultKeywords: '',
    ogImageUrl: '',
    googleAnalyticsId: '',
    googleSearchConsoleVerification: ''
  });

  const { showToast } = useToast();

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        setLoading(true);
        const res = await settingsService.getSettings();
        if (res.data) {
          setSeoData({
            defaultMetaTitle: res.data.defaultMetaTitle || 'Apex Institute of Technology & Management | Premier Engineering & Management College',
            defaultMetaDescription: res.data.defaultMetaDescription || 'Apex Institute of Technology & Management is an autonomous, NAAC A++ accredited premier educational institution offering cutting-edge engineering, computing, and management education.',
            defaultKeywords: res.data.defaultKeywords || 'Engineering college, Computer Science, Autonomous institute, NAAC A++, Admissions, B.Tech, M.Tech, MBA',
            ogImageUrl: res.data.ogImageUrl || '',
            googleAnalyticsId: res.data.googleAnalyticsId || '',
            googleSearchConsoleVerification: res.data.googleSearchConsoleVerification || ''
          });
        }
      } catch (err) {
        showToast('Failed to load SEO configuration', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSeo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsService.updateSettings(seoData);
      showToast('SEO settings updated successfully', 'success');
    } catch (err) {
      showToast('Failed to save SEO settings', 'error');
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">SEO & Metadata Management</h1>
        <p className="text-sm text-slate-600 mt-1">
          Configure search engine indexing, social card previews (OpenGraph), and analytics tags across the website
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search Snippet Preview */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Search className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-slate-900">Google Search Preview</h2>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 font-sans max-w-2xl">
            <div className="text-xs text-slate-600 font-mono mb-1">
              https://apex.edu › home
            </div>
            <div className="text-lg font-medium text-blue-800 hover:underline cursor-pointer truncate">
              {seoData.defaultMetaTitle || 'College Portal Title'}
            </div>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
              {seoData.defaultMetaDescription || 'Add a meta description below to preview how your institution will appear in Google and Bing search results.'}
            </p>
          </div>
        </div>

        {/* Default SEO Values */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Tag className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-slate-900">Default Meta Tags</h2>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">
                Default Meta Title *
              </label>
              <span className="text-xs text-slate-400">{seoData.defaultMetaTitle.length} / 60 characters</span>
            </div>
            <input
              type="text"
              required
              value={seoData.defaultMetaTitle}
              onChange={(e) => setSeoData(prev => ({ ...prev, defaultMetaTitle: e.target.value }))}
              placeholder="Apex Institute of Technology & Management | Premier Engineering College"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">
                Default Meta Description *
              </label>
              <span className="text-xs text-slate-400">{seoData.defaultMetaDescription.length} / 160 characters</span>
            </div>
            <textarea
              rows={3}
              required
              value={seoData.defaultMetaDescription}
              onChange={(e) => setSeoData(prev => ({ ...prev, defaultMetaDescription: e.target.value }))}
              placeholder="High quality description highlighting accreditation, departments, admissions, and campus amenities."
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Meta Keywords (Comma separated)
            </label>
            <input
              type="text"
              value={seoData.defaultKeywords}
              onChange={(e) => setSeoData(prev => ({ ...prev, defaultKeywords: e.target.value }))}
              placeholder="Engineering, B.Tech, Computer Science, AICTE Approved, NAAC A++"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <FileUploader
              label="Default OpenGraph (Social Share) Image"
              fileType="IMAGE"
              currentUrl={seoData.ogImageUrl}
              onUploadSuccess={(url) => setSeoData(prev => ({ ...prev, ogImageUrl: url }))}
              helperText="Recommended dimension: 1200 x 630 px. Shown when sharing links on WhatsApp, LinkedIn, Twitter & Facebook."
            />
          </div>
        </div>

        {/* Verification & Analytics */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Globe className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-slate-900">Webmaster & Analytics Identifiers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Google Analytics Measurement ID
              </label>
              <input
                type="text"
                value={seoData.googleAnalyticsId}
                onChange={(e) => setSeoData(prev => ({ ...prev, googleAnalyticsId: e.target.value }))}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Google Search Console Verification Token
              </label>
              <input
                type="text"
                value={seoData.googleSearchConsoleVerification}
                onChange={(e) => setSeoData(prev => ({ ...prev, googleSearchConsoleVerification: e.target.value }))}
                placeholder="google-site-verification=..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            icon={Save}
            loading={saving}
          >
            Save SEO Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
