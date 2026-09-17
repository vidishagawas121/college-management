import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(43,32,36,0.65)] backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`relative bg-white rounded-[22px] shadow-premium border border-[var(--color-border)] w-full ${maxWidth} overflow-hidden z-10 flex flex-col max-h-[90vh]`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[#fffaf4]">
          <div>
            <h3 className="text-lg font-bold text-[var(--color-primary)] font-heading">{title}</h3>
            {subtitle && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] p-2 rounded-lg hover:bg-[var(--color-surface-soft)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)] bg-[#fffaf4]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
