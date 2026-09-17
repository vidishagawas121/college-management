import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import RichTextRenderer from '../../components/common/RichTextRenderer';
import { Calendar, Clock, User, Tag, ChevronLeft, ArrowRight, Share2 } from 'lucide-react';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await articleService.getArticleBySlug(slug);
        if (res.success && res.data) {
          setArticle(res.data);
          setRelatedArticles(res.relatedArticles || []);
        }
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Loading article..." fullPage />;
  if (!article) return <EmptyState title="Article not found" description="The requested article does not exist or is in draft mode." />;

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title={article.seoTitle || article.title}
        description={article.seoDescription || article.shortDescription}
        ogImage={article.featuredImage}
        keywords={article.tags?.join(', ')}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/articles"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-900 hover:text-primary-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to News & Articles
        </Link>

        {/* Article Header */}
        <div className="space-y-4 mb-8">
          <span className="inline-block bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-lg border border-amber-200">
            {article.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-academic-navy font-heading leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-y border-slate-200 py-3">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <User className="w-4 h-4 text-amber-600" /> By {article.author || 'AITS Media'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" /> {new Date(article.publicationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> {article.readTimeMinutes || 4} min read
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="rounded-3xl overflow-hidden mb-8 shadow-md border border-slate-200 aspect-[16/9] bg-slate-100">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Full Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <p className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed italic border-l-4 border-amber-500 pl-4 bg-amber-50/50 p-4 rounded-r-xl">
            {article.shortDescription}
          </p>

          <div className="text-slate-700 leading-relaxed text-base space-y-4">
            <RichTextRenderer content={article.content} />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-2">
                <Tag className="w-3.5 h-3.5" /> Tags:
              </span>
              {article.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-md"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="pt-12 space-y-6">
            <h3 className="text-xl font-bold text-academic-navy font-heading">
              Related Articles & Stories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel._id}
                  to={`/articles/${rel.slug}`}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all group block"
                >
                  <h5 className="text-xs font-bold text-slate-900 group-hover:text-primary-900 transition-colors line-clamp-2">
                    {rel.title}
                  </h5>
                  <span className="text-[11px] text-slate-400 mt-2 block">
                    {new Date(rel.publicationDate).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
