
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../../../constants';

interface IntentsToolbarProps {
    onCreate: (type?: string) => void;
}

const REQUEST_TYPES = [
    'Service Request',
    'Reservation Change',
    'Refund Request',
    'Damage Claim',
    'Approval & Purchase'
];

export const IntentsToolbar: React.FC<IntentsToolbarProps> = ({ onCreate }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCreateClick = (type: string) => {
        onCreate(type);
        setIsDropdownOpen(false);
    };

    const StatsPill = ({ values, color }: { values: string, color: string }) => (
      <div className="flex items-center gap-2 px-2">
          <span className={`text-xs font-bold ${color}`}>{values}</span>
      </div>
    );

    return (
        <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-3 flex flex-col gap-3">
            {/* Top Row */}
            <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1">
                    {/* View Toggle */}
                     <div className="p-2 border border-indigo-600 text-indigo-600 rounded-lg cursor-pointer bg-indigo-50 shadow-sm">
                        <Icons.Queue />
                     </div>

                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                             <Icons.Search />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search intents..." 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    {/* Stats Group */}
                    <div className="flex items-center border border-slate-200 rounded-md bg-slate-50 px-2 py-1.5 select-none">
                        <div className="flex items-center gap-2 border-r border-slate-200 pr-2">
                           <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            <StatsPill values="3022" color="text-indigo-600" />
                        </div>
                        <div className="border-r border-slate-200 px-2">
                           <StatsPill values="31" color="text-emerald-600" />
                        </div>
                        <div className="border-r border-slate-200 px-2">
                           <StatsPill values="2" color="text-orange-600" />
                        </div>
                         <div className="pl-2">
                           <StatsPill values="19" color="text-purple-600" />
                        </div>
                         <svg className="w-3 h-3 text-slate-400 ml-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* New Request Split Button */}
                    <div className="relative" ref={dropdownRef}>
                        <div className="flex rounded-lg shadow-sm transition-all bg-purple-600 hover:bg-purple-700">
                            <button 
                                onClick={() => onCreate('Service Request')}
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white border-r border-purple-500/30 rounded-l-lg transition-colors"
                            >
                                <Icons.Plus />
                                New Request
                            </button>
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="px-2 py-2 text-white rounded-r-lg hover:bg-purple-800 transition-colors"
                            >
                                <Icons.ChevronDown className="w-4 h-4" />
                            </button>
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 py-1">
                                {REQUEST_TYPES.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleCreateClick(type)}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors font-medium"
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="h-6 w-px bg-slate-200"></div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors" title="Export to CSV">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors" title="Share Link">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                            </svg>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors" title="More Actions">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

             {/* Filter Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                    {[
                        'All Date Range', 
                        'All Listings', 
                        'All Status', 
                        'All Priority', 
                        'All Source'
                    ].map((filter, i) => (
                        <button key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap shadow-sm">
                            {filter}
                            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 pl-4">
                    <button className="p-1.5 text-slate-500 hover:bg-white hover:text-indigo-600 rounded border border-transparent hover:border-slate-200 transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <button className="p-1.5 text-slate-500 hover:bg-white hover:text-indigo-600 rounded border border-transparent hover:border-slate-200 transition-all">
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
