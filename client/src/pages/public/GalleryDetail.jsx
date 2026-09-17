import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { galleryService } from '../../services/galleryService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Camera, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

const GalleryDetail = () => {
  const { slug } = useParams();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await galleryService.getGalleryBySlug(slug);
        if (res.success && res.data) {
          setGallery(res.data);
        }
      } catch (err) {
        console.error('Failed to load gallery album:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [slug]);

  // Handle keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight' && gallery?.images) {
        setLightboxIndex((prev) => (prev + 1) % gallery.images.length);
      }
      if (e.key === 'ArrowLeft' && gallery?.images) {
        setLightboxIndex((prev) => (prev - 1 + gallery.images.length) % gallery.images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, gallery]);

  if (loading) return <LoadingSpinner message="Loading album images..." fullPage />;
  if (!gallery) return <EmptyState title="Album not found" description="The requested photo album could not be found." />;

  const images = gallery.images || [];

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title={gallery.title}
        description={gallery.description}
        ogImage={gallery.coverImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-900 hover:text-primary-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to All Albums
        </Link>

        <div className="border-b border-slate-200 pb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
              {gallery.category}
            </span>
            <span className="text-xs text-slate-400 font-semibold">• {images.length} Photos</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading">
            {gallery.title}
          </h1>
          {gallery.description && (
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
              {gallery.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {images.length === 0 ? (
          <EmptyState title="No photos in this album" description="Photos will be uploaded shortly by the administration." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 cursor-pointer shadow-xs hover:shadow-xl transition-all"
              >
                <img
                  src={img.url}
                  alt={img.caption || `Photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <ZoomIn className="w-8 h-8 text-white mb-2" />
                  {img.caption && (
                    <p className="absolute bottom-3 left-3 right-3 text-xs text-white truncate font-medium">
                      {img.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Prev button */}
          <button
            onClick={() => setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>

          {/* Main Image */}
          <div className="max-w-5xl max-h-[80vh] flex flex-col items-center justify-center">
            <img
              src={images[lightboxIndex]?.url}
              alt={images[lightboxIndex]?.caption || 'Full view'}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            {images[lightboxIndex]?.caption && (
              <p className="text-white text-sm sm:text-base font-medium mt-4 text-center max-w-2xl bg-slate-900/60 px-4 py-2 rounded-xl backdrop-blur-sm">
                {images[lightboxIndex].caption}
              </p>
            )}
            <span className="text-xs text-slate-400 mt-2">
              Photo {lightboxIndex + 1} of {images.length}
            </span>
          </div>

          {/* Next button */}
          <button
            onClick={() => setLightboxIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryDetail;
