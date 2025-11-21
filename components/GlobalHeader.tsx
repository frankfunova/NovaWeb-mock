
import React from 'react';
import { Icons } from '../constants';

interface GlobalHeaderProps {
    title: string;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ title }) => {
  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 z-50 shadow-sm relative">
      {/* Left: Page Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-800 pl-2 capitalize">{title}</h1>
      </div>

      {/* Right: Global Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
         <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full hidden sm:block" title="Add New">
             <Icons.Plus />
         </button>
         <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full hidden sm:block" title="Language">
             <Icons.Translate />
         </button>
         <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full" title="Settings">
             <Icons.Settings /> 
         </button>
         <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full hidden sm:block" title="Favorites">
             <Icons.Star />
         </button>
         <div className="relative">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full">
                <Icons.Bell />
            </button>
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white shadow-sm">
                34
            </span>
         </div>
         <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs ml-2 border border-purple-200 cursor-pointer hover:bg-purple-200 transition-colors">
            MK
         </div>
      </div>
    </div>
  );
};
