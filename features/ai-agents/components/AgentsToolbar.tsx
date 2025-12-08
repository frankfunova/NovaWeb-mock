


import React from 'react';
import { Icons } from '../../../constants';

interface AgentsToolbarProps {
    onCreate?: () => void;
    onViewLogs?: () => void;
}

export const AgentsToolbar: React.FC<AgentsToolbarProps> = ({ onCreate, onViewLogs }) => {
    return (
        <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-3 flex flex-col gap-3">
            {/* Top Row: Search & Actions */}
            <div className="flex items-center justify-between gap-6">
                 <div className="flex items-center gap-4 flex-1">
                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                             <Icons.Search />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search agents..." 
                            className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        />
                    </div>
                 </div>

                 {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onViewLogs}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-md transition-all shadow-sm whitespace-nowrap"
                    >
                         <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        Agent Log
                    </button>
                    <button 
                        onClick={onCreate}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-all shadow-sm whitespace-nowrap"
                    >
                        <Icons.Plus />
                        Create Agent
                    </button>

                    <div className="h-6 w-px bg-slate-200"></div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors" title="Export">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                    {['All Status', 'All Types', 'All Models'].map((filter, i) => (
                        <button key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap shadow-sm">
                            {filter}
                            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};