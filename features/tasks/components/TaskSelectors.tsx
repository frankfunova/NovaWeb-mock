
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Icons } from '../../../constants';
import { TaskPriority, TaskStatus } from '../../../types';

// --- Constants ---
export const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
export const STATUSES: TaskStatus[] = ['new', 'pending', 'in-progress', 'completed', 'delayed', 'cancelled'];

export const MOCK_CATEGORIES: Record<string, { name: string; subcategories: string[] }> = {
    MAINT: { name: 'Maintenance', subcategories: ['Plumbing', 'HVAC', 'Electrical', 'Appliances', 'Other'] },
    HK: { name: 'Housekeeping', subcategories: ['Cleanliness', 'Supplies', 'Linens', 'Damage'] },
    GS: { name: 'Guest Services', subcategories: ['Check-in', 'Parking', 'Wifi', 'Amenities'] },
    FIN: { name: 'Financial', subcategories: ['Refund', 'Extra Charge', 'Invoice'] }
};

// --- Components ---

export const CascadingCategorySelector: React.FC<{ 
    categoryCode?: string; 
    subcategoryName?: string; 
    onChange: (categoryCode: string, subcategoryName: string) => void;
    placeholder?: string;
}> = ({ categoryCode, subcategoryName, onChange, placeholder = "Assign Category" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [view, setView] = useState<'categories' | 'subcategories'>('categories');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                resetState();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const resetState = () => {
        setSearch('');
        setView('categories');
        setActiveCategory(null);
    };

    const currentCategoryName = categoryCode ? MOCK_CATEGORIES[categoryCode]?.name : null;
    
    const allOptions = useMemo(() => {
        const opts: Array<{ catCode: string; catName: string; sub: string }> = [];
        Object.entries(MOCK_CATEGORIES).forEach(([cCode, cData]) => {
            cData.subcategories.forEach(sub => {
                opts.push({ catCode: cCode, catName: cData.name, sub });
            });
        });
        return opts;
    }, []);

    const filteredOptions = useMemo(() => {
        if (!search.trim()) return [];
        const q = search.toLowerCase();
        return allOptions.filter(o => 
            o.catName.toLowerCase().includes(q) || 
            o.sub.toLowerCase().includes(q)
        );
    }, [search, allOptions]);

    const handleCategoryClick = (code: string) => {
        setActiveCategory(code);
        setView('subcategories');
        setSearch('');
    };

    const handleSelect = (catCode: string, sub: string) => {
        onChange(catCode, sub);
        setIsOpen(false);
        resetState();
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <button 
                type="button"
                onClick={() => { setIsOpen(!isOpen); if (!isOpen) resetState(); }}
                className={`flex items-center justify-between w-full gap-1.5 px-3 py-2 rounded bg-slate-50 text-sm font-medium border transition-all shadow-sm group ${categoryCode ? 'text-indigo-700 border-indigo-200' : 'text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
            >
                <div className="flex items-center gap-2 truncate">
                    {categoryCode && subcategoryName ? (
                        <span className="flex items-center gap-1 truncate">
                            <span className="font-bold">{currentCategoryName}</span>
                            <span className="text-indigo-400">/</span>
                            <span>{subcategoryName}</span>
                        </span>
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </div>
                <div className={`w-4 h-4 transition-transform duration-200 opacity-50 ${isOpen ? 'rotate-180' : ''}`}><Icons.ChevronDown /></div>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-full min-w-[240px] bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[320px]">
                    <div className="p-2 border-b border-slate-100">
                        <div className="relative">
                            <input 
                                ref={searchInputRef}
                                type="text" 
                                placeholder="Search categories..."
                                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                                <Icons.Search />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {search ? (
                            <div className="py-1">
                                {filteredOptions.length > 0 ? filteredOptions.map((opt, idx) => (
                                    <div 
                                        key={`${opt.catCode}-${opt.sub}-${idx}`}
                                        onClick={() => handleSelect(opt.catCode, opt.sub)}
                                        className="px-4 py-2 hover:bg-indigo-50 cursor-pointer flex flex-col gap-0.5 group"
                                    >
                                        <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">{opt.sub}</div>
                                        <div className="text-[10px] text-slate-400 group-hover:text-indigo-400">{opt.catName}</div>
                                    </div>
                                )) : (
                                    <div className="p-4 text-center text-xs text-slate-400 italic">No results found</div>
                                )}
                            </div>
                        ) : view === 'categories' ? (
                            <div className="py-1">
                                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categories</div>
                                {Object.entries(MOCK_CATEGORIES).map(([code, data]) => (
                                    <div 
                                        key={code}
                                        onClick={() => handleCategoryClick(code)}
                                        className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 cursor-pointer flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-colors"></span>
                                            {data.name}
                                        </div>
                                        <Icons.ChevronRight />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-1">
                                <div className="px-2 py-1.5 flex items-center gap-2 border-b border-slate-50 mb-1">
                                    <button 
                                        onClick={() => setView('categories')}
                                        className="p-1 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
                                    >
                                        <Icons.ChevronLeft />
                                    </button>
                                    <span className="text-xs font-bold text-indigo-600">
                                        {activeCategory && MOCK_CATEGORIES[activeCategory].name}
                                    </span>
                                </div>
                                {activeCategory && MOCK_CATEGORIES[activeCategory].subcategories.map(sub => (
                                    <div 
                                        key={sub}
                                        onClick={() => handleSelect(activeCategory, sub)}
                                        className={`px-4 py-2 text-xs font-medium cursor-pointer hover:bg-indigo-50 transition-colors flex items-center justify-between ${
                                            categoryCode === activeCategory && subcategoryName === sub ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
                                        }`}
                                    >
                                        {sub}
                                        {categoryCode === activeCategory && subcategoryName === sub && (
                                            <div className="w-3 h-3 text-indigo-600"><Icons.Check /></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const PrioritySelector: React.FC<{ priority: string; onChange: (val: string) => void }> = ({ priority, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const colors: Record<string, string> = {
        low: 'bg-slate-100 text-slate-600 border-slate-200',
        medium: 'bg-blue-50 text-blue-700 border-blue-200',
        high: 'bg-orange-50 text-orange-700 border-orange-200',
        urgent: 'bg-red-50 text-red-700 border-red-200'
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize flex items-center gap-1 hover:opacity-80 transition-opacity ${colors[priority?.toLowerCase()] || 'bg-slate-100'}`}
            >
                {priority || 'low'}
                <div className="w-3 h-3 opacity-50"><Icons.ChevronDown /></div>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {PRIORITIES.map(p => (
                        <div 
                            key={p}
                            onClick={() => { onChange(p); setIsOpen(false); }}
                            className={`px-4 py-2 text-xs font-bold capitalize cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between ${p === priority ? 'bg-slate-50 text-indigo-600' : 'text-slate-600'}`}
                        >
                            {p}
                            {p === priority && <div className="w-3 h-3"><Icons.Check /></div>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const StatusSelector: React.FC<{ status: string; onChange: (val: string) => void }> = ({ status, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const getButtonStyles = (s: string) => {
        if (s === 'completed') return 'bg-emerald-600 text-white border-transparent hover:bg-emerald-700';
        if (s === 'in-progress') return 'bg-amber-500 text-white border-transparent hover:bg-amber-600';
        if (s === 'delayed') return 'bg-red-500 text-white border-transparent hover:bg-red-600';
        return 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50';
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatStatus = (s: string) => s.replace('-', ' ');

    return (
        <div className="relative" ref={containerRef}>
            <div className="flex">
                <button 
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`px-4 py-1.5 rounded-l-lg text-sm font-bold border flex items-center gap-2 transition-all shadow-sm ${getButtonStyles(status)}`}
                >
                    {status === 'completed' && <Icons.Check className="w-4 h-4" />}
                    {formatStatus(status || 'new')}
                </button>
                <button 
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`px-2 py-1.5 rounded-r-lg border-l-0 border text-sm font-bold transition-all shadow-sm flex items-center justify-center ${getButtonStyles(status)} opacity-90 hover:opacity-100`}
                >
                    <div className="w-4 h-4"><Icons.ChevronDown /></div>
                </button>
            </div>

            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 p-1">
                    {STATUSES.map(s => (
                        <div 
                            key={s}
                            onClick={() => { onChange(s); setIsOpen(false); }}
                            className="px-3 py-2 cursor-pointer hover:bg-slate-50 rounded-md flex items-center justify-between group"
                        >
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${s === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                {formatStatus(s)}
                            </span>
                            {s === status && <div className="w-3 h-3 text-slate-600"><Icons.Check /></div>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const ListingStatusBadge: React.FC<{status?: string}> = ({ status = 'Occupied' }) => {
    let colorClass = 'bg-slate-100 text-slate-600 border-slate-200';
    if (status === 'Dirty') colorClass = 'bg-rose-50 text-rose-700 border-rose-200';
    if (status === 'Occupied') colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
    if (status === 'Cleaned') colorClass = 'bg-sky-50 text-sky-700 border-sky-200';
    if (status === 'Ready to Check') colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';

    return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border tracking-wider ${colorClass}`}>
            {status}
        </span>
    );
};
