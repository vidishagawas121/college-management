import React from 'react';

const StatusBadge = ({ status }) => {
  const normalized = (status || '').toUpperCase();

  const styles = {
    PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    DRAFT: 'bg-amber-50 text-amber-700 border-amber-200',
    UNPUBLISHED: 'bg-slate-100 text-slate-700 border-slate-200',
    ARCHIVED: 'bg-rose-50 text-rose-700 border-rose-200',
    URGENT: 'bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse',
    HIGH: 'bg-amber-100 text-amber-800 border-amber-300',
    MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
    LOW: 'bg-slate-100 text-slate-600 border-slate-200',
    NEW: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-300',
    RESOLVED: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[normalized] || 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      {normalized}
    </span>
  );
};

export default StatusBadge;
