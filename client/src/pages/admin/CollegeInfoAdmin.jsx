import React, { useState, useEffect } from 'react';
import { collegeService } from '../../services/collegeService';
import { useCollege } from '../../context/CollegeContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import FileUploader from '../../components/admin/FileUploader';
import RichTextEditor from '../../components/common/RichTextEditor';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Building2, Save, Sparkles, Plus, Trash2 } from 'lucide-react';

const CollegeInfoAdmin = () => {
  const { refreshGlobalData } = useCollege();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    collegeName: '',
    shortName: '',
    tagline: '',
    establishmentYear: 1998,
    aboutCollege: '',
    history: '',
    vision: '',
    mission: '',
    objectives: [],
    principalName: '',
    principalDesignation: '',
    principalMessage: '',
    principalPhoto: '',
    infrastructure: '',
    campusArea: '',
    heroHeading: '',
    heroSubheading: '',
    heroPrimaryCtaText: '',
    heroPrimaryCtaLink: '',
    heroSecondaryCtaText: '',
    heroSecondaryCtaLink: '',
  });

  const [newObjective, setNewObjective] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await collegeService.getCollegeInfo();
        if (res.success && res.data) {
          setFormData({
            ...res.data,
            objectives: res.data.objectives || [],
          });
        }
      } catch (err) {
        console.error('Failed to load college info:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await collegeService.updateCollegeInfo(formData);
      if (res.success) {
        success('College information updated successfully!');
        await refreshGlobalData();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update college information.');
    } finally {
      setSaving(false);
    }
  };

  const addObjective = () => {
    if (!newObjective.trim()) return;
    setFormData({
      ...formData,
      objectives: [...formData.objectives, newObjective.trim()],
    });
    setNewObjective('');
  };

  const removeObjective = (index) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index),
    });
  };

  if (loading) return <LoadingSpinner message="Loading institutional configuration..." fullPage />;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            College Information Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure institutional profiles, principal messages, vision, mission, and homepage hero content.
          </p>
        </div>

        <Button
          onClick={handleSave}
          isLoading={saving}
          icon={Save}
          size="md"
        >
          Save All Changes
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Institutional Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-academic-navy font-heading border-b border-slate-100 pb-3">
            General College Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full College Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Short Name / Acronym
              </label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Institutional Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Establishment Year
              </label>
              <input
                type="number"
                value={formData.establishmentYear}
                onChange={(e) => setFormData({ ...formData, establishmentYear: parseInt(e.target.value, 10) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
              />
            </div>
          </div>
        </div>

        {/* Homepage Hero Section Config */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-academic-navy font-heading border-b border-slate-100 pb-3">
            Homepage Hero Section Content
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Hero Main Heading
            </label>
            <input
              type="text"
              value={formData.heroHeading}
              onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Hero Subheading Description
            </label>
            <textarea
              rows={2}
              value={formData.heroSubheading}
              onChange={(e) => setFormData({ ...formData, heroSubheading: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-slate-800 uppercase block">Primary Call To Action</span>
              <input
                type="text"
                placeholder="Button Label (e.g. Explore Programs)"
                value={formData.heroPrimaryCtaText}
                onChange={(e) => setFormData({ ...formData, heroPrimaryCtaText: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800"
              />
              <input
                type="text"
                placeholder="Link URL (e.g. /courses)"
                value={formData.heroPrimaryCtaLink}
                onChange={(e) => setFormData({ ...formData, heroPrimaryCtaLink: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800"
              />
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-slate-800 uppercase block">Secondary Call To Action</span>
              <input
                type="text"
                placeholder="Button Label (e.g. Admissions 2026)"
                value={formData.heroSecondaryCtaText}
                onChange={(e) => setFormData({ ...formData, heroSecondaryCtaText: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800"
              />
              <input
                type="text"
                placeholder="Link URL (e.g. /admissions)"
                value={formData.heroSecondaryCtaLink}
                onChange={(e) => setFormData({ ...formData, heroSecondaryCtaLink: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Principal's Desk */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-academic-navy font-heading border-b border-slate-100 pb-3">
            Principal's Information & Desk
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Principal Name
              </label>
              <input
                type="text"
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Designation & Title
              </label>
              <input
                type="text"
                value={formData.principalDesignation}
                onChange={(e) => setFormData({ ...formData, principalDesignation: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
              />
            </div>
          </div>

          <FileUploader
            label="Principal's Photograph"
            currentUrl={formData.principalPhoto}
            onUploadSuccess={(url) => setFormData({ ...formData, principalPhoto: url })}
          />

          <RichTextEditor
            label="Principal's Official Message"
            value={formData.principalMessage}
            onChange={(val) => setFormData({ ...formData, principalMessage: val })}
          />
        </div>

        {/* Vision & Mission */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-academic-navy font-heading border-b border-slate-100 pb-3">
            Vision, Mission & Strategic Objectives
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Institutional Vision
            </label>
            <textarea
              rows={3}
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Institutional Mission
            </label>
            <textarea
              rows={3}
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>

          {/* Objectives Manager */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Strategic Objectives
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add strategic educational objective..."
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800"
              />
              <Button type="button" size="sm" onClick={addObjective} icon={Plus}>
                Add Objective
              </Button>
            </div>

            <div className="space-y-2 pt-2">
              {formData.objectives?.map((obj, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800">
                  <span>{obj}</span>
                  <button
                    type="button"
                    onClick={() => removeObjective(i)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Long-Form CMS Sections */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-academic-navy font-heading border-b border-slate-100 pb-3">
            Long-Form Institutional Content
          </h3>

          <RichTextEditor
            label="About College Overview"
            value={formData.aboutCollege}
            onChange={(val) => setFormData({ ...formData, aboutCollege: val })}
          />

          <RichTextEditor
            label="College History & Milestones"
            value={formData.history}
            onChange={(val) => setFormData({ ...formData, history: val })}
          />

          <RichTextEditor
            label="Campus Infrastructure Details"
            value={formData.infrastructure}
            onChange={(val) => setFormData({ ...formData, infrastructure: val })}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            isLoading={saving}
            icon={Save}
            size="lg"
          >
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CollegeInfoAdmin;
