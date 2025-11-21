
import React, { useEffect } from 'react';

interface FlyoutProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  side?: 'left' | 'right';
}

export const Flyout: React.FC<FlyoutProps> = ({ isOpen, onClose, title, children, side = 'right' }) => {
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const translateClass = side === 'right' 
    ? (isOpen ? 'translate-x-0' : 'translate-x-full')
    : (isOpen ? 'translate-x-0' : '-translate-x-full');

  const positionClass = side === 'right' ? 'right-0 inset-y-0 pl-10' : 'left-0 inset-y-0 pr-10';

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible'}`} 
      aria-labelledby="slide-over-title" 
      role="dialog" 
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>

      <div className={`absolute flex max-w-full pointer-events-none ${positionClass}`}>
        <div 
          className={`pointer-events-auto w-screen max-w-md transform transition-transform duration-300 ease-in-out bg-white shadow-2xl flex flex-col ${translateClass}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="text-lg font-bold text-slate-800" id="slide-over-title">
              {title}
            </div>
            <button
              type="button"
              className="rounded-md text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-1"
              onClick={onClose}
            >
              <span className="sr-only">Close panel</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
