
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { useTheme, Theme } from '../context/ThemeContext';

interface GlobalHeaderProps {
    title: string;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ title }) => {
  const { theme, setTheme } = useTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
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
         <button className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full hidden sm:block" title="Favorites">
             <Icons.Star />
         </button>
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
  );
};
