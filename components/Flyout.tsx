
import React, { useEffect, useState } from 'react';
import { Icons } from '../constants';

interface FlyoutProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  side?: 'left' | 'right';
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  noPadding?: boolean;
  onShare?: () => void;
}

export const Flyout: React.FC<FlyoutProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  side = 'right', 
  actions,
  size = 'xl',
  noPadding = false,
  onShare
}) => {
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  
  // Watch Feature State
  const [isWatching, setIsWatching] = useState(false);
  const [otherWatchers, setOtherWatchers] = useState(0);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Reset/Simulate watch state when flyout opens
  useEffect(() => {
    if (isOpen) {
        setIsWatching(false);
        // Simulate random other watchers (0-5) for demo
        setOtherWatchers(Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0);
    }
  }, [isOpen]);

  const handleWatchToggle = () => {
      setIsWatching(!isWatching);
  };

  const handleShareClick = async () => {
    if (onShare) {
        onShare();
    } else {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowCopyFeedback(true);
            setTimeout(() => setShowCopyFeedback(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    }
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full'
  };

  const maxWidthClass = sizeClasses[size] || sizeClasses.xl;

  const translateClass = side === 'right' 
    ? (isOpen ? 'translate-x-0' : 'translate-x-full')
    : (isOpen ? 'translate-x-0' : '-translate-x-full');

  const positionClass = side === 'right' ? 'right-0 inset-y-0 pl-10' : 'left-0 inset-y-0 pr-10';

  const totalWatchers = otherWatchers + (isWatching ? 1 : 0);

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible'}`} 
      aria-labelledby="slide-over-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div 
        className={`absolute inset-0 bg-slate-900/20 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>

      <div className={`absolute flex max-w-full pointer-events-none ${positionClass}`}>
        <div 
          className={`pointer-events-auto w-screen ${maxWidthClass} transform transition-transform duration-300 ease-in-out bg-white dark:bg-slate-900 shadow-2xl flex flex-col ${translateClass}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 min-h-[56px] flex-shrink-0 z-20">
            <div className="flex-1 flex items-center gap-3 min-w-0" id="slide-over-title">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">{title}</h2>
            </div>
            
            <div className="flex items-center gap-1 pl-4">
                {/* Watch Button */}
                <button 
                    onClick={handleWatchToggle}
                    className={`
                        relative flex items-center gap-1.5 transition-all font-medium text-xs border border-transparent
                        ${isWatching 
                            ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 px-3 py-1.5 rounded-full' 
                            : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-md'
                        }
                    `}
                    title={isWatching ? "Click to unwatch" : "Watch this item"}
                >
                    <Icons.Eye className={`w-4 h-4 ${isWatching ? 'text-indigo-600 dark:text-indigo-400' : 'text-current'}`} />
                    
                    {isWatching && <span>Watching</span>}
                    
                    {/* Watcher Count Badge (Show if multiple users are watching) */}
                    {otherWatchers > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full ring-2 ring-white dark:ring-slate-900 px-0.5">
                            {totalWatchers}
                        </span>
                    )}
                </button>

                <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                {actions}
                
                <div className="relative">
                    <button 
                        onClick={handleShareClick}
                        className={`p-2 rounded-md transition-colors ${showCopyFeedback ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} 
                        title="Copy Link to Clipboard"
                    >
                        {showCopyFeedback ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                        )}
                    </button>
                    {showCopyFeedback && (
                        <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded shadow-lg whitespace-nowrap z-50 animate-in fade-in zoom-in-95">
                            Link Copied!
                        </div>
                    )}
                </div>

                <button 
                    className="p-2 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" 
                    title="Open in new tab"
                    onClick={() => window.open(window.location.href, '_blank')}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </button>

                <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                
                <button
                    type="button"
                    className="p-2 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    onClick={onClose}
                    title="Close"
                >
                    <span className="sr-only">Close panel</span>
                    <Icons.X />
                </button>
            </div>
          </div>

          <div className={`flex-1 bg-white dark:bg-slate-900 ${noPadding ? 'flex flex-col overflow-hidden' : 'overflow-y-auto custom-scrollbar'}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
