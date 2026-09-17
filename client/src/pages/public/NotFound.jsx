import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import { GraduationCap, Home, Search, BookOpen, ChevronRight } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <SEO title="404 Page Not Found" description="The requested page could not be located on our server." />

      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
          <GraduationCap className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-black text-academic-navy font-heading block">
            404
          </span>
          <h1 className="text-xl font-bold text-slate-800 font-heading">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            The page you are looking for may have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-900 hover:bg-primary-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors border border-slate-200"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Browse Programs</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
