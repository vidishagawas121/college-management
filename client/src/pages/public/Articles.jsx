import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import { Newspaper, Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchArticles = async (page = 1, category = selectedCategory, search = searchTerm) => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (category !== 'ALL') params.category = category;
      if (search) params.search = search;

      const res = await articleService.getPublicArticles(params);
      if (res.success && res.data) {
        setArticles(res.data);
        setTotalPages(res.totalPages || 1);
        setCurrentPage(res.currentPage || 1);
      }
    } catch (err) {
      console.error('Failed to load news articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1, selectedCategory, searchTerm);
  }, [selectedCategory]);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title="College News, Research & Articles"
        description="Official press releases, scientific discoveries, faculty spotlights, and campus stories from Apex Institute of Technology & Sciences."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            Newsroom & Press
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading mt-3">
            Articles & Campus News
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
            Read about student achievements, breakthrough research publications, university milestones, and academic features.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Categories Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(val) => {
                setSearchTerm(val);
                fetchArticles(1, selectedCategory, val);
              }}
              onClear={() => {
                setSearchTerm('');
                fetchArticles(1, selectedCategory, '');
              }}
              placeholder="Search articles by title, keywords, or topics..."
            />
          </div>

          <div className="w-full md:w-64 flex-shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            >
              <option value="ALL">All Categories</option>
              {['Campus News', 'Research & Innovation', 'Student Life', 'Faculty Spotlight', 'Events & Highlights', 'Alumni Story'].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <LoadingSpinner message="Fetching published articles..." />
        ) : articles.length === 0 ? (
          <EmptyState
            title="No articles found"
            description="No news or articles matching your filter parameters."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => (
              <div
                key={art._id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-52 bg-slate-100 overflow-hidden relative">
                      <ImageWithFallback
                        src={art.featuredImage}
                        alt={art.title}
                        type="article"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    <div className="absolute top-4 left-4 bg-academic-navy text-amber-400 text-xs font-bold px-3 py-1 rounded-xl shadow">
                      {art.category}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(art.publicationDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {art.readTimeMinutes || 4} min read
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-academic-navy font-heading group-hover:text-primary-900 transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {art.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[150px]">
                    By {art.author || 'AITS Media'}
                  </span>
                  <Link
                    to={`/articles/${art.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-900 hover:text-primary-700"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => fetchArticles(p, selectedCategory, searchTerm)}
        />
      </div>
    </div>
  );
};

export default Articles;
