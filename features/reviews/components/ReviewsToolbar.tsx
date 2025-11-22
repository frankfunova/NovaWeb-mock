
import React from 'react';
import { Icons } from '../../../constants';

export const ReviewsToolbar: React.FC = () => {
  const StatsPill = ({ icon, values, color }: { icon?: React.ReactNode, values: string, color: string }) => (
      <div className="flex items-center gap-2 px-2">
          {icon}
          <span className={`text-xs font-bold ${color}`}>{values}</span>
      </div>
  );

  return (
    <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-3 flex flex-col gap-3">
        
        {/* Top Row: View Select, Search, Stats */}
        <div className="flex items-center justify-between">
             <div className="flex items-center gap-4 flex-1">
                 
                 {/* View Selector */}
                 <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors group">
                    <div className="w-4 h-4 opacity-50 group-hover:opacity-100">
                        <Icons.Queue />
                    </div>
                    <span className="text-sm font-bold text-slate-800">All Reviews</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                 </div>

                 {/* Search Bar */}
                 <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Icons.Search />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search reviews, guest names..." 
                        className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                 </div>

                 {/* Stats Group */}
                 <div className="flex items-center border border-slate-200 rounded-md bg-slate-50 px-2 py-1.5 select-none">
                     <div className="border-r border-slate-200 pr-2">
                         <StatsPill 
                             icon={<svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} 
                             values="250" 
                             color="text-indigo-600" 
                         />
                     </div>
                     <div className="border-r border-slate-200 px-2">
                        <StatsPill 
                             values="172" 
                             color="text-emerald-600" 
                         />
                     </div>
                     <div className="border-r border-slate-200 px-2">
                        <StatsPill 
                             values="78" 
                             color="text-orange-600" 
                         />
                     </div>
                     <div className="pl-2">
                        <StatsPill 
                             values="4.5" 
                             color="text-purple-600" 
                         />
                     </div>
                     <svg className="w-3 h-3 text-slate-400 ml-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                 </div>
             </div>
             
             <div className="flex items-center gap-2">
                 <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-md transition-all whitespace-nowrap">
                     <Icons.BookOpen />
                     Save as view
                </button>
             </div>
        </div>

        {/* Filter Row */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                {[
                    'Last 30 Days', 
                    'All Ratings', 
                    'All Groups', 
                    'All Listings', 
                    'All Status'
                ].map((filter, i) => (
                    <button key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap shadow-sm">
                        {filter}
                        <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                ))}
                <button className="text-sm text-slate-400 hover:text-slate-600 px-2">Clear</button>
            </div>

            <div className="flex items-center gap-2 pl-4">
                <button className="p-1.5 text-slate-500 hover:bg-white hover:text-indigo-600 rounded border border-slate-200 bg-white transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
                <button className="p-1.5 text-slate-500 hover:bg-white hover:text-indigo-600 rounded border border-slate-200 bg-white transition-all">
                    <Icons.Filter />
                </button>
                <button className="p-1.5 text-slate-500 hover:bg-white hover:text-indigo-600 rounded border border-slate-200 bg-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
  );
};