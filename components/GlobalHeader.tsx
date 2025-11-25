
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { useTheme, Theme } from '../context/ThemeContext';

interface GlobalHeaderProps {
    title: string;
    onNavigate?: (page: string, params?: Record<string, string>) => void;
}

const INITIAL_WATCHLIST = [
  {
    groupName: "My watchlist",
    items: [
      { label: "Listings", count: 5, page: "listings" },
      { label: "Tasks", count: 12, page: "tasks" },
      { label: "Reviews", count: 2, page: "reviews" }
    ]
  },
  {
    groupName: "My Important Items",
    items: [
      { label: "Tasks", count: 2, page: "tasks" },
      { label: "Reservations", count: 3, page: "reservations" }
    ]
  }
];

interface ConfirmModalState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}

// Simple Confirmation Modal Component inside GlobalHeader to ensure Z-index over dropdown
const ConfirmationModal: React.FC<{ state: ConfirmModalState; onClose: () => void }> = ({ state, onClose }) => {
    if (!state.isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm relative z-10 p-6 animate-in zoom-in-95 duration-100 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{state.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{state.message}</p>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => { state.onConfirm(); onClose(); }}
                        className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ title, onNavigate }) => {
  const { theme, setTheme } = useTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const watchlistRef = useRef<HTMLDivElement>(null);

  // Watchlist State
  const [watchlist, setWatchlist] = useState(INITIAL_WATCHLIST);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      // Only close watchlist if we are NOT interacting with the modal overlay
      if (watchlistRef.current && !watchlistRef.current.contains(event.target as Node) && !confirmModal?.isOpen) {
        setIsWatchlistOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [confirmModal]);

  // Handlers
  const handleRemoveItem = (groupIndex: number, itemIndex: number, label: string, count: number) => {
      setConfirmModal({
          isOpen: true,
          title: `Unwatch ${label}?`,
          message: `Are you sure you want to remove all ${count} ${label} items from your watchlist?`,
          onConfirm: () => {
              const newWatchlist = [...watchlist];
              const group = newWatchlist[groupIndex];
              group.items = group.items.filter((_, i) => i !== itemIndex);
              
              // If group is empty, remove the group entirely? Or keep it empty? 
              // Usually removing empty groups is cleaner.
              if (group.items.length === 0) {
                  newWatchlist.splice(groupIndex, 1);
              }
              
              setWatchlist(newWatchlist);
          }
      });
  };

  const handleClearAll = () => {
      setConfirmModal({
          isOpen: true,
          title: "Clear Watchlist?",
          message: "Are you sure you want to unwatch all items? This cannot be undone.",
          onConfirm: () => {
              setWatchlist([]);
          }
      });
  };

  const totalWatchItems = watchlist.reduce((acc, group) => acc + group.items.reduce((gAcc, item) => gAcc + item.count, 0), 0);
  const hasItems = totalWatchItems > 0;

  return (
    <>
        <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 flex-shrink-0 z-50 shadow-sm relative transition-colors duration-200">
        {/* Left: Page Title */}
        <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 pl-2 capitalize">{title}</h1>
        </div>

        {/* Right: Global Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative" ref={themeMenuRef}>
                <button 
                    onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"
                    title="Toggle Theme"
                >
                    {theme === 'light' && <Icons.Sun />}
                    {theme === 'dark' && <Icons.Moon />}
                    {theme === 'system' && <Icons.Computer />}
                </button>
                
                {isThemeMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 p-1.5 animate-in fade-in zoom-in-95 duration-100 z-50">
                        <button 
                            onClick={() => { setTheme('light'); setIsThemeMenuOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${theme === 'light' ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                        >
                            <div className="flex items-center gap-2">
                                <Icons.Sun className="w-4 h-4" />
                                <span>Light</span>
                            </div>
                            {theme === 'light' && <Icons.Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                        </button>
                        <button 
                            onClick={() => { setTheme('dark'); setIsThemeMenuOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${theme === 'dark' ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                        >
                            <div className="flex items-center gap-2">
                                <Icons.Moon className="w-4 h-4" />
                                <span>Dark</span>
                            </div>
                            {theme === 'dark' && <Icons.Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                        </button>
                        <button 
                            onClick={() => { setTheme('system'); setIsThemeMenuOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${theme === 'system' ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                        >
                            <div className="flex items-center gap-2">
                                <Icons.Computer className="w-4 h-4" />
                                <span>System</span>
                            </div>
                            {theme === 'system' && <Icons.Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                        </button>
                    </div>
                )}
            </div>

            <button className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full hidden sm:block" title="Add New">
                <Icons.Plus />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full hidden sm:block" title="Language">
                <Icons.Translate />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full" title="Settings">
                <Icons.Settings /> 
            </button>
            
            {/* Watchlist Dropdown */}
            <div className="relative hidden sm:block" ref={watchlistRef}>
                <button 
                    onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}
                    className={`p-2 rounded-full transition-colors relative ${isWatchlistOpen || hasItems ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-400 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`} 
                    title="Watchlist"
                >
                    {hasItems || isWatchlistOpen ? <Icons.StarFilled /> : <Icons.Star />}
                </button>

                {isWatchlistOpen && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Watchlist</h3>
                            <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">{totalWatchItems} items</span>
                        </div>
                        
                        {/* Scrollable Content */}
                        <div className="max-h-64 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-800">
                            {watchlist.length > 0 ? watchlist.map((group, groupIndex) => (
                                <div key={group.groupName}>
                                    <div className="px-4 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-50 dark:border-slate-700/50 sticky top-0 z-10 backdrop-blur-sm">
                                        {group.groupName}
                                    </div>
                                    <div className="py-1">
                                        {group.items.map((item, itemIndex) => (
                                            <div
                                                key={itemIndex}
                                                onClick={() => {
                                                    if (onNavigate) onNavigate(item.page, { view: 'watchlist' });
                                                    setIsWatchlistOpen(false);
                                                }}
                                                className="w-full text-left flex items-center justify-between px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors group relative"
                                            >
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {item.label}
                                                </span>
                                                <div className="flex items-center">
                                                    <span className="text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full group-hover:hidden transition-all">
                                                        {item.count}
                                                    </span>
                                                    {/* Delete Icon - Shown on Hover */}
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveItem(groupIndex, itemIndex, item.label, item.count);
                                                        }}
                                                        className="hidden group-hover:block p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors absolute right-3 top-1/2 -translate-y-1/2"
                                                        title="Remove all items"
                                                    >
                                                        <Icons.Trash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {groupIndex < watchlist.length - 1 && (
                                        <div className="h-px bg-slate-100 dark:bg-slate-700 mx-2 my-1"></div>
                                    )}
                                </div>
                            )) : (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                                        <Icons.Star className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Your watchlist is empty.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        {watchlist.length > 0 && (
                            <div className="p-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-center">
                                <button 
                                    onClick={handleClearAll}
                                    className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:underline py-1 px-2 rounded transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="relative">
                <button className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full">
                    <Icons.Bell />
                </button>
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white dark:border-slate-900 shadow-sm">
                    34
                </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold text-xs ml-2 border border-purple-200 dark:border-purple-800 cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                MK
            </div>
        </div>
        </div>

        {/* Global Confirmation Modal Overlay */}
        {confirmModal && (
            <ConfirmationModal 
                state={confirmModal} 
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} 
            />
        )}
    </>
  );
};
