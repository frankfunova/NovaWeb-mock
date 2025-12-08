
import React from 'react';
import { Icons } from '../../../constants';

interface AgentLogToolbarProps {
    onSearch: (query: string) => void;
}

export const AgentLogToolbar: React.FC<AgentLogToolbarProps> = ({ onSearch }) => {
    return (
        <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-3 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-6">
                 <div className="flex items-center gap-4 flex-1">
                    {/* View Label */}
                    <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 shadow-sm text-slate-700">
                        <Icons.Queue className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-bold">Execution Logs</span>
                    </div>

                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                             <Icons.Search />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search logs by tool name, status, or user..." 
                            className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                 </div>

                 {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors" title="Export">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors" title="Refresh">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Filter Row */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                {['All Status', 'All Models', 'Last 24 Hours'].map((filter, i) => (
                    <button key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap shadow-sm">
                        {filter}
                        <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                ))}
            </div>
        </div>
    );
};
