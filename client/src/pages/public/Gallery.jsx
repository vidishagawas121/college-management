import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { galleryService } from '../../services/galleryService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Image as ImageIcon, Camera, ArrowRight } from 'lucide-react';

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'ALL') params.category = selectedCategory;

        const res = await galleryService.getPublicGalleries(params);
        if (res.success && res.data) {
          setGalleries(res.data);
        }
      } catch (err) {
        console.error('Failed to load galleries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, [selectedCategory]);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title="Campus Photo & Video Gallery"
        description="Experience campus life, state-of-the-art facilities, tech fest highlights, sports championships, and cultural celebrations."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            Visual Memories
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading mt-3">
            Photo & Media Gallery
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
            A visual chronicle of our dynamic campus culture, research celebrations, athletic events, and student triumphs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Campus', 'Events', 'Sports', 'Workshops', 'Cultural Activities'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-academic-navy text-amber-400 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Albums' : cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <LoadingSpinner message="Loading gallery albums..." />
        ) : galleries.length === 0 ? (
          <EmptyState
            title="No gallery albums found"
            description="There are currently no published albums in this category."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleries.map((gal) => (
              <Link
                key={gal._id}
                to={`/gallery/${gal.slug}`}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-60 bg-slate-100 overflow-hidden relative">
                    <img
                      src={gal.coverImage || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800'}
                      alt={gal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-academic-navy/90 backdrop-blur-xs text-amber-400 text-xs font-bold px-3 py-1 rounded-xl shadow flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{gal.images?.length || 0} Photos</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                      {gal.category}
                    </span>
                    <h3 className="text-lg font-bold text-academic-navy font-heading group-hover:text-primary-900 transition-colors leading-snug line-clamp-2">
                      {gal.title}
                    </h3>
                    {gal.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {gal.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-2 text-xs font-bold text-primary-900 group-hover:text-primary-700">
                  <span>View Album Photos</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
