import React, { useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { mediaService } from '../../services/mediaService';
import { useToast } from '../../context/ToastContext';

const FileUploader = ({
  onUploadSuccess,
  currentUrl,
  label = 'Upload Media / Document',
  accept = 'image/*,application/pdf',
  helperText = 'Supported formats: JPG, PNG, WEBP, PDF (Max: 15MB)',
  className = '',
  required = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUrl || '');
  const { success, error } = useToast();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (15MB)
    if (file.size > 15 * 1024 * 1024) {
      error('File size exceeds the 15MB limit.');
      return;
    }

    setUploading(true);
    try {
      const res = await mediaService.uploadFile(file);
      if (res.success && res.data) {
        setPreviewUrl(res.data.url);
        onUploadSuccess(res.data.url, res.data);
        success('File uploaded successfully!');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setPreviewUrl('');
    onUploadSuccess('', null);
  };

  const isPdf = previewUrl && previewUrl.toLowerCase().endsWith('.pdf');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {previewUrl ? (
        <div className="relative border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center gap-3">
          {isPdf ? (
            <div className="w-12 h-12 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-300">
              <img
                src={previewUrl}
                alt="Uploaded media"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=200'; }}
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>File ready</span>
            </div>
            <p className="text-xs text-slate-600 truncate mt-0.5" title={previewUrl}>
              {previewUrl.split('/').pop()}
            </p>
          </div>

          <button
            type="button"
            onClick={clearFile}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className={`border-2 border-dashed border-slate-300 hover:border-primary-700 rounded-xl p-4 sm:p-6 bg-slate-50/50 hover:bg-primary-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-primary-900 animate-spin mb-2" />
              <span className="text-xs font-semibold text-slate-700">Uploading media...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-800">
                Click to browse or drag file here
              </span>
              <span className="text-[11px] text-slate-400 mt-1">{helperText}</span>
            </div>
          )}
        </label>
      )}
    </div>
  );
};

export default FileUploader;
