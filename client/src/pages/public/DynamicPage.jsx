import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pageService } from '../../services/pageService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import RichTextRenderer from '../../components/common/RichTextRenderer';
import { ChevronLeft } from 'lucide-react';

const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await pageService.getPageBySlug(slug);
        if (res.success && res.data) {
          setPage(res.data);
        }
      } catch (err) {
        console.error('Failed to load page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Loading page content..." fullPage />;
  if (!page) return <EmptyState title="Page not found" description="The requested institutional page does not exist or is unpublished." />;

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title={page.seoTitle || page.title}
        description={page.seoDescription}
        ogImage={page.featuredImage}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-900 hover:text-primary-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>

        {page.featuredImage && (
          <div className="rounded-3xl overflow-hidden mb-8 shadow-md border border-slate-200 aspect-[16/9] bg-slate-100">
            <img
              src={page.featuredImage}
              alt={page.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-sm space-y-6">
          <h1 className="text-3xl sm:text-4xl font-black text-academic-navy font-heading leading-tight border-b border-slate-100 pb-4">
            {page.title}
          </h1>

          <div className="text-slate-700 leading-relaxed text-base space-y-4">
            <RichTextRenderer content={page.content} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPage;
