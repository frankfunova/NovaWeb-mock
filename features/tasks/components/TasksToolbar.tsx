
import React from 'react';
import { Icons } from '../../../constants';

interface TasksToolbarProps {
    onCreate?: () => void;
}

export const TasksToolbar: React.FC<TasksToolbarProps> = ({ onCreate }) => {
    return (
        <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-3 flex flex-col gap-4">
            {/* Top Row: View Select, Search, Counts, Actions */}
            <div className="flex items-center justify-between gap-6">
                 <div className="flex items-center gap-4 flex-1">
                    {/* View Selector */}
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors group">
                        <div className="w-4 h-4 opacity-50 group-hover:opacity-100">
                            <Icons.Queue />
                        </div>
                        <span className="text-sm font-bold text-slate-800">All Tasks</span>
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>

                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                             <Icons.Search />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search tasks..." 
                            className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    {/* Stats Inline */}
                    <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500 select-none">
                        <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-indigo-600">
                                <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-bold text-indigo-600 px-1">7075</span>
                        </div>
                        <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
                             <span className="text-xs font-bold text-emerald-600 px-1">4427</span>
                        </div>
                        <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
                             <span className="text-xs font-bold text-orange-600 px-1">0</span>
                        </div>
                        <div className="flex items-center gap-1">
                             <span className="text-xs font-bold text-purple-600 px-1">25</span>
                        </div>
                        <svg className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                 </div>

                 {/* Right Actions */}
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-md transition-all whitespace-nowrap">
                         <Icons.Briefcase />
                         Save as view
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-md transition-all shadow-sm bg-white whitespace-nowrap">
                         Edit view
                    </button>
                    <button 
                        onClick={onCreate}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-all shadow-sm whitespace-nowrap ml-2"
                    >
                        <Icons.Plus />
                        Create Task
                    </button>
                </div>
            </div>

            {/* Filter Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                     <button className="px-3 py-1.5 bg-white border border-purple-300 text-purple-700 rounded-full text-sm flex items-center gap-2 whitespace-nowrap shadow-sm ring-2 ring-purple-100">
                        This Month
                        <svg className="w-3 h-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {['All Status', 'All Priority', 'All Type', 'All Assignee', 'All Property'].map((filter, i) => (
                        <button key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap shadow-sm">
                            {filter}
                            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                    ))}
                    <button className="text-sm text-slate-400 hover:text-slate-600 px-2">Clear</button>
                </div>

                <div className="flex items-center gap-2 pl-4">
                    <button className="p-1.5 text-slate-500 hover:bg-white hover:text-indigo-600 rounded border border-slate-200 bg-white transition-all">
                        <Icons.Queue />
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
