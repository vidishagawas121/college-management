import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'primary',
  link,
  subtitle,
}) => {
  const colorStyles = {
    primary: {
      bg: 'bg-primary-50 text-primary-900 border-primary-100',
      iconBg: 'bg-primary-900 text-amber-400',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-950 border-amber-100',
      iconBg: 'bg-amber-500 text-slate-950',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-950 border-emerald-100',
      iconBg: 'bg-emerald-600 text-white',
    },
    blue: {
      bg: 'bg-blue-50 text-blue-950 border-blue-100',
      iconBg: 'bg-blue-600 text-white',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-950 border-purple-100',
      iconBg: 'bg-purple-600 text-white',
    },
    rose: {
      bg: 'bg-rose-50 text-rose-950 border-rose-100',
      iconBg: 'bg-rose-600 text-white',
    },
  };

  const scheme = colorStyles[color] || colorStyles.primary;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {value ?? 0}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs flex-shrink-0 ${scheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {link && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <Link
            to={link}
            className="text-xs font-semibold text-primary-900 hover:text-primary-700 flex items-center gap-1 transition-colors"
          >
            <span>Manage records</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default StatCard;
