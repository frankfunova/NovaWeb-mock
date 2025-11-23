
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Task, TaskStatus, TaskPriority } from '../../../types';
import { Icons } from '../../../constants';

interface TaskDetailProps {
  task: Task;
}

const MOCK_CATEGORIES: Record<string, { name: string; subcategories: string[] }> = {
    MAINT: { name: 'Maintenance', subcategories: ['Plumbing', 'HVAC', 'Electrical', 'Appliances', 'Other'] },
    HK: { name: 'Housekeeping', subcategories: ['Cleanliness', 'Supplies', 'Linens', 'Damage'] },
    GS: { name: 'Guest Services', subcategories: ['Check-in', 'Parking', 'Wifi', 'Amenities'] },
    FIN: { name: 'Financial', subcategories: ['Refund', 'Extra Charge', 'Invoice'] }
};

// Enhanced Checklist Type
interface ChecklistItem {
    id: string;
    title: string;
    description?: string;
    requiresAttachment?: boolean;
    isRequired?: boolean; // New field: Mandatory item
    referencePhotos?: string[]; // From setup
    isCompleted: boolean;
    completedAt?: string;
    completedBy?: string;
    workerNotes?: string;
    workerPhotos?: string[]; // From execution
}

// --- Custom Icons ---
const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
  </svg>
);

const PhotoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
);

const ChatBubbleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 9.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm0 4.5a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm0 4.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
  </svg>
);

const DragHandleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" clipRule="evenodd" />
    </svg>
);

const ThumbUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
);

// --- Helper Components ---

const CollapsibleSection: React.FC<{ 
    title: string; 
    icon?: React.ReactNode; 
    children: React.ReactNode; 
    defaultOpen?: boolean;
    action?: React.ReactNode;
}> = ({ title, icon, children, defaultOpen = true, action }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="px-6 py-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors group"
                >
                    <div className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                        <Icons.ChevronRight />
                    </div>
                    {icon && <span className="text-slate-400 group-hover:text-slate-600">{icon}</span>}
                    {title}
                </button>
                {action}
            </div>
            {isOpen && (
                <div className="animate-in slide-in-from-top-1 duration-200 fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};

const CascadingCategorySelector: React.FC<{ 
    categoryCode?: string; 
    subcategoryName?: string; 
    onChange: (categoryCode: string, subcategoryName: string) => void 
}> = ({ categoryCode, subcategoryName, onChange }) => {
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
                onClick={() => { setIsOpen(!isOpen); if (!isOpen) resetState(); }}
                className={`flex items-center justify-between w-full gap-1.5 px-3 py-2 rounded bg-slate-50 text-sm font-medium border transition-all shadow-sm group ${categoryCode ? 'text-indigo-700 border-indigo-200' : 'text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
            >
                <div className="flex items-center gap-2">
                    {categoryCode && subcategoryName ? (
                        <span className="flex items-center gap-1 truncate">
                            <span className="font-bold">{currentCategoryName}</span>
                            <span className="text-indigo-400">/</span>
                            <span>{subcategoryName}</span>
                        </span>
                    ) : (
                        <span>Assign Category</span>
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

const InlineTitleEditor: React.FC<{ value: string; onSave: (newVal: string) => void }> = ({ value, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value);

    useEffect(() => { setText(value); }, [value]);

    const handleSave = () => {
        if (!text.trim()) return;
        onSave(text);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setText(value);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="relative animate-in fade-in duration-200 mb-2">
                <input
                    className="w-full bg-white border border-indigo-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm placeholder:font-normal placeholder:text-slate-400"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={100}
                    autoFocus
                    placeholder="Add task title..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                        if (e.key === 'Escape') handleCancel();
                    }}
                />
                <div className="flex justify-end gap-2 mt-2">
                    <button onClick={handleCancel} className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors">Save</button>
                </div>
            </div>
        );
    }

    return (
        <div 
            onClick={() => setIsEditing(true)}
            className="relative group mb-1 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 hover:ring-1 hover:ring-indigo-100 px-3 py-2 transition-all"
        >
            <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">
                {value || <span className="text-slate-400 italic font-normal">Add task title...</span>}
            </h2>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-full p-1.5 shadow-sm text-indigo-500">
                 <Icons.Edit />
            </div>
        </div>
    );
};

const InlineDescriptionEditor: React.FC<{ value: string; onSave: (newVal: string) => void }> = ({ value, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => { setText(value); }, [value]);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${scrollHeight}px`;
        }
    }, [text, isEditing]);

    const handleSave = () => {
        onSave(text);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setText(value);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="relative animate-in fade-in duration-200">
                <textarea
                    ref={textareaRef}
                    className="w-full bg-white border border-indigo-300 rounded-lg p-3 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm resize-none overflow-hidden min-h-[80px]"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    autoFocus
                    placeholder="Add task description..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.metaKey) handleSave(); 
                        if (e.key === 'Escape') handleCancel();
                    }}
                />
                <div className="flex justify-end gap-2 mt-2">
                    <button onClick={handleCancel} className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors">Save</button>
                </div>
            </div>
        );
    }

    return (
        <div 
            onClick={() => setIsEditing(true)}
            className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-700 leading-relaxed shadow-sm cursor-pointer hover:bg-white hover:border-indigo-300 hover:ring-1 hover:ring-indigo-100 transition-all group relative min-h-[60px] whitespace-pre-wrap"
        >
            {value || <span className="text-slate-400 italic">Add task description...</span>}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-full p-1 shadow-sm">
                 <div className="w-4 h-4 text-indigo-400"><Icons.Edit /></div>
            </div>
        </div>
    );
};

const PrioritySelector: React.FC<{ priority: string; onChange: (val: string) => void }> = ({ priority, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const colors: Record<string, string> = {
        low: 'bg-slate-100 text-slate-600 border-slate-200',
        medium: 'bg-blue-50 text-blue-700 border-blue-200',
        high: 'bg-orange-50 text-orange-700 border-orange-200',
        urgent: 'bg-red-50 text-red-700 border-red-200'
    };

    const options: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

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
                onClick={() => setIsOpen(!isOpen)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize flex items-center gap-1 hover:opacity-80 transition-opacity ${colors[priority?.toLowerCase()] || 'bg-slate-100'}`}
            >
                {priority || 'low'}
                <div className="w-3 h-3 opacity-50"><Icons.ChevronDown /></div>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {options.map(p => (
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

const StatusSelector: React.FC<{ status: string; onChange: (val: string) => void }> = ({ status, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const getButtonStyles = (s: string) => {
        if (s === 'completed') return 'bg-emerald-600 text-white border-transparent hover:bg-emerald-700';
        if (s === 'in-progress') return 'bg-amber-500 text-white border-transparent hover:bg-amber-600';
        if (s === 'delayed') return 'bg-red-500 text-white border-transparent hover:bg-red-600';
        return 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50';
    };

    const options: TaskStatus[] = ['new', 'pending', 'in-progress', 'completed', 'delayed', 'cancelled'];

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
                    onClick={() => setIsOpen(!isOpen)}
                    className={`px-4 py-1.5 rounded-l-lg text-sm font-bold border flex items-center gap-2 transition-all shadow-sm ${getButtonStyles(status)}`}
                >
                    {status === 'completed' && <Icons.Check className="w-4 h-4" />}
                    {formatStatus(status || 'new')}
                </button>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`px-2 py-1.5 rounded-r-lg border-l-0 border text-sm font-bold transition-all shadow-sm flex items-center justify-center ${getButtonStyles(status)} opacity-90 hover:opacity-100`}
                >
                    <div className="w-4 h-4"><Icons.ChevronDown /></div>
                </button>
            </div>

            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 p-1">
                    {options.map(s => (
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

const ListingStatusBadge: React.FC = () => {
    const statuses = ['Occupied', 'Cleaned', 'Dirty', 'Ready to Check'];
    const status: string = 'Occupied'; 
    
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

// --- Checklist Sub-Components ---

const ChecklistItemSetup: React.FC<{ 
    item: ChecklistItem; 
    index: number; 
    onChange: (id: string, updates: Partial<ChecklistItem>) => void;
    onDelete: (id: string) => void; 
    isDragging?: boolean;
    onDragStart: (e: React.DragEvent, index: number) => void;
    onDragOver: (e: React.DragEvent, index: number) => void;
    onDrop: (e: React.DragEvent, index: number) => void;
}> = ({ item, index, onChange, onDelete, isDragging, onDragStart, onDragOver, onDrop }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newPhotos = Array.from(e.target.files).map(f => URL.createObjectURL(f));
            onChange(item.id, { referencePhotos: [...(item.referencePhotos || []), ...newPhotos] });
        }
    };

    return (
        <div 
            className={`border border-slate-200 rounded-xl bg-white overflow-hidden transition-all ${isDragging ? 'opacity-50 border-dashed border-slate-400' : ''}`}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
        >
            <div className="flex items-center gap-3 p-3 bg-slate-50/50 group">
                {/* Drag Handle */}
                <div className="cursor-grab text-slate-300 hover:text-slate-500 p-1 -ml-1">
                    <DragHandleIcon className="w-5 h-5" />
                </div>

                <div className="w-6 h-6 rounded flex items-center justify-center bg-white border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
                    {index + 1}
                </div>
                <input 
                    className="flex-1 bg-transparent text-sm font-medium text-slate-800 focus:outline-none min-w-0"
                    placeholder="Enter checklist item..."
                    value={item.title}
                    onChange={(e) => onChange(item.id, { title: e.target.value })}
                />
                
                {/* Badges & Thumbnails in Collapsed View */}
                <div className="flex items-center gap-2">
                    {item.referencePhotos && item.referencePhotos.length > 0 && (
                        <div className="flex -space-x-2 mr-2">
                            {item.referencePhotos.slice(0, 3).map((url, i) => (
                                <img key={i} src={url} alt="ref" className="w-6 h-6 rounded-md object-cover border border-white shadow-sm ring-1 ring-slate-100" />
                            ))}
                            {item.referencePhotos.length > 3 && (
                                <div className="w-6 h-6 rounded-md bg-slate-100 border border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-slate-500">
                                    +{item.referencePhotos.length - 3}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {item.isRequired && (
                        <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 uppercase tracking-wide whitespace-nowrap">
                            Required
                        </span>
                    )}
                </div>

                <div className="flex items-center border-l border-slate-200 pl-2 ml-1 gap-1">
                    <button onClick={() => onDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100" title="Delete">
                        <Icons.X className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsExpanded(!isExpanded)} className={`p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all ${isExpanded ? 'rotate-180' : ''}`} title="Expand">
                        <Icons.ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 border-t border-slate-100 space-y-4 bg-white animate-in slide-in-from-top-2 duration-200">
                    {/* Description */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea 
                            className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none h-20 bg-slate-50/30"
                            placeholder="Add instructions or details..."
                            value={item.description || ''}
                            onChange={(e) => onChange(item.id, { description: e.target.value })}
                        />
                    </div>

                    {/* Settings Toggles Row */}
                    <div className="flex items-center gap-6">
                        {/* Required Toggle */}
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => onChange(item.id, { isRequired: !item.isRequired })}
                                className={`relative w-9 h-5 rounded-full transition-colors ${item.isRequired ? 'bg-indigo-600' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${item.isRequired ? 'translate-x-4' : ''}`}></div>
                            </button>
                            <span className="text-sm text-slate-700 font-medium">Required</span>
                        </div>

                        {/* Attachment Toggle */}
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => onChange(item.id, { requiresAttachment: !item.requiresAttachment })}
                                className={`relative w-9 h-5 rounded-full transition-colors ${item.requiresAttachment ? 'bg-indigo-600' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${item.requiresAttachment ? 'translate-x-4' : ''}`}></div>
                            </button>
                            <span className="text-sm text-slate-700 font-medium">Photo Required</span>
                        </div>
                    </div>

                    {/* Reference Attachments */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Reference Photos</label>
                        <p className="text-xs text-slate-500 mb-3">Upload guide images for the worker.</p>
                        
                        <div className="flex gap-3 overflow-x-auto pb-1">
                            {item.referencePhotos?.map((url, i) => (
                                <div key={i} className="w-20 h-20 rounded-lg border border-slate-200 overflow-hidden relative group flex-shrink-0">
                                    <img src={url} alt="ref" className="w-full h-full object-cover" />
                                    <button className="absolute top-1 right-1 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all">
                                        <Icons.X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center gap-1"
                            >
                                <Icons.Plus className="w-5 h-5" />
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} accept="image/*" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ChecklistItemExecution: React.FC<{ 
    item: ChecklistItem; 
}> = ({ item }) => {
    // Format date helper
    const formatCompletedTime = (dateStr?: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
        });
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm transition-all">
            <div className="flex items-start gap-3">
                {/* Status Icon (Read Only) */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {item.isCompleted ? (
                        <Icons.Check className="w-3.5 h-3.5" strokeWidth={3} />
                    ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div className="pr-2">
                            <div className="flex items-center gap-2">
                                <h4 className={`text-sm font-bold ${item.isCompleted ? 'text-slate-800' : 'text-slate-600'}`}>{item.title}</h4>
                                {item.isRequired && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-wide">Required</span>}
                            </div>
                            
                            {item.description && (
                                <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                            )}
                            
                            {/* Reference Photos in Execution Mode */}
                            {item.referencePhotos && item.referencePhotos.length > 0 && (
                                <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                    {item.referencePhotos.map((url, i) => (
                                        <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 relative flex-shrink-0">
                                            <img src={url} alt="reference" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Completed Metadata - Compact */}
                        {item.isCompleted && item.completedAt ? (
                            <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded leading-none">
                                    Completed
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                    {formatCompletedTime(item.completedAt)}
                                </span>
                            </div>
                        ) : (
                             <div className="flex-shrink-0">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                                    Pending
                                </span>
                             </div>
                        )}
                    </div>

                    {/* Worker Content Area */}
                    {(item.workerNotes || (item.workerPhotos && item.workerPhotos.length > 0)) && (
                        <div className="mt-3 space-y-3 pt-3 border-t border-slate-50">
                            {/* Notes Bubble - New Chat Style */}
                            {item.workerNotes && (
                                <div className="bg-blue-50 text-slate-700 px-3 py-2 rounded-lg rounded-tl-none text-xs font-medium flex items-start gap-2 relative mt-1 w-fit max-w-full">
                                    <div className="mt-0.5 text-blue-400 flex-shrink-0"><ChatBubbleIcon className="w-3.5 h-3.5" /></div>
                                    <span className="leading-relaxed text-blue-900">{item.workerNotes}</span>
                                </div>
                            )}

                            {/* Worker Photos Grid */}
                            {item.workerPhotos && item.workerPhotos.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                    {item.workerPhotos.map((url, i) => (
                                        <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 relative flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
                                            <img src={url} alt="proof" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

export const TaskDetail: React.FC<TaskDetailProps> = ({ task: initialTask }) => {
  const [task, setTask] = useState<Task>(initialTask);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<{id: string, text: string, author: string, time: string}[]>([
      { id: '1', text: 'Scheduled for tomorrow.', author: 'System', time: 'Nov 18, 9:00 AM' }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock Category State
  const [category, setCategory] = useState<{code?: string, subName?: string}>({ code: 'MAINT', subName: 'General' });

  // Checklist State
  // Determine Mode based on status
  const isEditMode = ['new', 'pending'].includes(task.status || 'new');

  // MOCK DATA FOR INITIAL CHECKLIST
  const initialChecklistData: ChecklistItem[] = [
      { 
          id: '1', 
          title: 'Check AC filters', 
          description: 'Ensure filters are clean and free of dust. Replace if necessary.',
          requiresAttachment: true,
          isRequired: true,
          referencePhotos: [],
          isCompleted: true,
          completedAt: '2025-11-23T14:12:43.722Z',
          completedBy: 'Frank Fu',
          workerNotes: 'Yes inam done. But some area is too dirty',
          workerPhotos: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=150&h=150&fit=crop']
      },
      { 
          id: '2', 
          title: 'Verify thermostat batteries', 
          description: 'Check battery level indicator on the panel.',
          requiresAttachment: false,
          isRequired: false,
          referencePhotos: ['https://images.unsplash.com/photo-1585128792020-803d29415281?w=150&h=150&fit=crop'],
          isCompleted: false,
      },
      { 
          id: '3', 
          title: 'Inspect vent flow', 
          isRequired: true,
          isCompleted: false 
      }
  ];

  // State to hold the current editing list
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklistData);
  // State to hold the "saved" original list for dirty checking
  const [savedChecklist, setSavedChecklist] = useState<ChecklistItem[]>(initialChecklistData);

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
      setTask(initialTask);
  }, [initialTask]);

  // Dirty Check Logic
  const isChecklistDirty = useMemo(() => {
      return JSON.stringify(checklist) !== JSON.stringify(savedChecklist);
  }, [checklist, savedChecklist]);

  // Header Stats Logic
  const totalItems = checklist.length;
  const requiredCount = checklist.filter(i => i.isRequired).length;
  const totalRequired = requiredCount;
  const completedRequiredCount = checklist.filter(i => i.isRequired && i.isCompleted).length;

  const headerTitle = isEditMode 
    ? `CHECKLIST (${requiredCount}/${totalItems} required)` 
    : `CHECKLIST (${completedRequiredCount}/${totalRequired || 1} required item completed)`; // Prevent 0/0 division display weirdness, though logic handles it visually

  // Read Only Status Badge (Right Side of Header)
  const checklistStatus = useMemo(() => {
      const required = checklist.filter(i => i.isRequired);
      if (required.length === 0) return { label: 'No Requirements', color: 'bg-slate-100 text-slate-500', icon: null };
      const completed = required.filter(i => i.isCompleted);
      const isAllDone = required.length === completed.length;
      return isAllDone 
        ? { label: 'All Done', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <ThumbUpIcon className="w-3.5 h-3.5" /> }
        : { label: 'Incomplete', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: null };
  }, [checklist]);

  const dateObj = task.scheduledAt ? new Date(task.scheduledAt) : new Date();
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  let timeStr = '--:--';
  if (task.startTime) {
      const h = Math.floor(task.startTime);
      const m = Math.round((task.startTime - h) * 60);
      const d = new Date(); d.setHours(h, m);
      timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  const formatDuration = (hours?: number) => {
      if (!hours) return '--';
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      if (h === 0) return `${m}m`;
      return `${h}h ${m > 0 ? m + 'm' : ''}`;
  };

  const handleUpdateTask = (field: keyof Task, value: any) => {
      setTask(prev => ({ ...prev, [field]: value }));
  };

  const handlePostComment = () => {
      if (!commentInput.trim()) return;
      setComments(prev => [{
          id: Date.now().toString(),
          text: commentInput,
          author: 'Me',
          time: 'Just now'
      }, ...prev]);
      setCommentInput('');
  };

  // Checklist Handlers
  const handleAddChecklistItem = () => {
      const newItem: ChecklistItem = {
          id: Date.now().toString(),
          title: '',
          isCompleted: false,
          isRequired: false
      };
      setChecklist([...checklist, newItem]);
  };

  const handleDeleteChecklistItem = (id: string) => {
      setChecklist(checklist.filter(item => item.id !== id));
  };

  const handleUpdateChecklistItem = (id: string, updates: Partial<ChecklistItem>) => {
      setChecklist(checklist.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const handleSaveChecklist = () => {
      setSavedChecklist(checklist);
      // Here you would call API update
  };

  const handleCancelChecklist = () => {
      setChecklist(savedChecklist);
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
      setDraggedItemIndex(index);
      e.dataTransfer.effectAllowed = "move";
      // Minimal ghost image
      const ghost = document.createElement('div');
      ghost.style.width = '1px';
      ghost.style.height = '1px';
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, 0, 0);
      setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedItemIndex === null || draggedItemIndex === index) return;
      
      // Move item in state to create live preview
      const newChecklist = [...checklist];
      const draggedItem = newChecklist[draggedItemIndex];
      newChecklist.splice(draggedItemIndex, 1);
      newChecklist.splice(index, 0, draggedItem);
      
      setChecklist(newChecklist);
      setDraggedItemIndex(index);
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setDraggedItemIndex(null);
  };

  const reporter = useMemo(() => {
      return {
          name: 'System',
          type: 'System',
          avatar: null,
          time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          icon: <Icons.Settings />,
          isGuest: false
      };
  }, []);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      
      {/* Sticky Header */}
      <div className="px-6 py-5 border-b border-slate-200 bg-white flex-shrink-0 shadow-sm z-10">
         <div className="flex justify-between items-start">
             <div className="flex-1 min-w-0 flex items-center gap-3">
                 <div 
                    className="group flex items-center gap-2 cursor-pointer"
                    onClick={() => window.open('#', '_blank')}
                    title="Open property page"
                 >
                     <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors decoration-2 underline-offset-2 group-hover:underline truncate max-w-[350px]">
                         {task.propertyName || task.location || 'General Task'}
                     </h2>
                     <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                 </div>
                 <ListingStatusBadge />
             </div>

             <div className="ml-4">
                 <StatusSelector status={task.status} onChange={(v) => handleUpdateTask('status', v)} />
             </div>
         </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Context Grid */}
          <div className="p-6 pb-4 grid grid-cols-2 gap-x-6 gap-y-4 border-b border-slate-100">
              <div className="col-span-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned To</div>
                  <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-200 shadow-sm">
                          {task.assigneeName ? task.assigneeName.charAt(0) : 'U'}
                      </div>
                      <div>
                          <div className="text-sm font-bold text-slate-900">{task.assigneeName || 'Unassigned'}</div>
                          <div className="text-[10px] text-slate-400 font-medium cursor-pointer hover:text-indigo-600 transition-colors flex items-center gap-1">
                              Reassign
                          </div>
                      </div>
                  </div>
              </div>

              <div className="col-span-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Schedule</div>
                  <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200 shadow-sm">
                          <Icons.Calendar />
                      </div>
                      <div>
                          <div className="text-sm font-bold text-slate-900">{dateStr}</div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                              <span>{timeStr}</span>
                              <span className="text-slate-300">•</span>
                              <span className="font-mono bg-slate-100 px-1.5 rounded text-slate-600">{formatDuration(task.duration)}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Main Form */}
          <div className="px-6 py-6">
               {/* Category & Reported By */}
               <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
                    <div className="col-span-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</div>
                        <CascadingCategorySelector 
                            categoryCode={category.code} 
                            subcategoryName={category.subName} 
                            onChange={(catCode, subName) => setCategory({ code: catCode, subName })} 
                        />
                    </div>

                    <div className="col-span-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Reported By</div>
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 shadow-sm flex-shrink-0 ${reporter.isGuest ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                {reporter.icon}
                            </div>
                            <div className="flex flex-col justify-center overflow-hidden">
                                <div className="text-sm font-bold text-slate-800 leading-tight truncate w-full">
                                    {reporter.name}
                                    {reporter.isGuest && <span className="font-normal text-slate-500 text-xs ml-1">via {reporter.type}</span>}
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                                    {reporter.time}
                                </div>
                            </div>
                        </div>
                    </div>
               </div>

               {/* Title & Priority */}
               <div className="mb-4">
                   <div className="flex justify-between items-start gap-4 mb-2">
                        <div className="flex-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Task Title</div>
                            <InlineTitleEditor value={task.title} onSave={(v) => handleUpdateTask('title', v)} />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</div>
                            <PrioritySelector priority={task.priority || 'low'} onChange={(v) => handleUpdateTask('priority', v)} />
                        </div>
                   </div>
               </div>

               {/* Description */}
               <div className="mb-2">
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</div>
                   <InlineDescriptionEditor value={task.description || ''} onSave={(v) => handleUpdateTask('description', v)} />
               </div>
          </div>

          {/* Checklist Section */}
          <CollapsibleSection 
             title={headerTitle}
             icon={<Icons.ClipboardCheck className="w-4 h-4 text-slate-400" />}
             action={
                 isEditMode ? (
                     // Edit Mode: Show Save/Cancel buttons if dirty
                     isChecklistDirty ? (
                         <div className="flex gap-2 animate-in fade-in duration-200">
                             <button 
                                onClick={handleCancelChecklist}
                                className="px-2 py-1 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                             >
                                 Cancel
                             </button>
                             <button 
                                onClick={handleSaveChecklist}
                                className="px-2 py-1 text-[10px] font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 shadow-sm transition-colors"
                             >
                                 Save
                             </button>
                         </div>
                     ) : null
                 ) : (
                     // Read Only Mode: Show Status Badge
                     <div className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${checklistStatus.color}`}>
                         {checklistStatus.icon}
                         {checklistStatus.label}
                     </div>
                 )
             }
          >
             <div className="space-y-3 pt-1">
                {isEditMode ? (
                    // EDITING MODE (New/Pending)
                    <>
                        {checklist.map((item, idx) => (
                            <ChecklistItemSetup 
                                key={item.id} 
                                item={item} 
                                index={idx}
                                onChange={handleUpdateChecklistItem} 
                                onDelete={handleDeleteChecklistItem}
                                isDragging={draggedItemIndex === idx}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            />
                        ))}
                        <button 
                            onClick={handleAddChecklistItem} 
                            className="w-full py-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
                        >
                            <Icons.Plus className="w-4 h-4" /> Add Item
                        </button>
                    </>
                ) : (
                    // READ-ONLY / RESULT MODE (Completed/InProgress)
                    <>
                        {checklist.map(item => (
                            <ChecklistItemExecution 
                                key={item.id} 
                                item={item} 
                            />
                        ))}
                    </>
                )}
             </div>
          </CollapsibleSection>

          {/* Photos Section */}
          <CollapsibleSection 
              title="Photos & Attachments" 
              icon={<Icons.PaperClip className="w-4 h-4 text-slate-400" />}
              action={
                  <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors">
                     + Add
                  </button>
              }
          >
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-500 transition-all cursor-pointer mt-1">
                  <Icons.PaperClip /><span className="text-xs font-medium mt-2">No attachments yet. Click to upload.</span>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" multiple onChange={() => {}} />
          </CollapsibleSection>

          {/* Expenses / Completion */}
          <CollapsibleSection title="Expenses & Completion" icon={<Icons.Briefcase className="w-4 h-4 text-slate-400" />}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Labor Cost</label>
                      <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                          <input type="number" className="w-full pl-6 pr-3 py-2 border border-slate-200 rounded-md text-sm" placeholder="0.00" />
                      </div>
                  </div>
                  <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Material Cost</label>
                      <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                          <input type="number" className="w-full pl-6 pr-3 py-2 border border-slate-200 rounded-md text-sm" placeholder="0.00" />
                      </div>
                  </div>
              </div>
              <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Completion Notes</label>
                  <textarea className="w-full border border-slate-200 rounded-md p-2 text-sm" rows={2} placeholder="Summary of work done..."></textarea>
              </div>
          </CollapsibleSection>

          {/* Activity */}
          <div className="bg-slate-50 border-t border-slate-200 p-6 pb-24">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Activity Log</h3>
              <div className="space-y-4">
                  {comments.map(c => (
                      <div key={c.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                              {c.author[0]}
                          </div>
                          <div>
                              <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-slate-900">{c.author}</span>
                                  <span className="text-xs text-slate-400">{c.time}</span>
                              </div>
                              <p className="text-sm text-slate-600 mt-0.5">{c.text}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Footer Input */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
          <div className="flex gap-2">
              <input 
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Write a comment..."
                onKeyDown={e => e.key === 'Enter' && handlePostComment()}
              />
              <button onClick={handlePostComment} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-indigo-700">
                  Send
              </button>
          </div>
      </div>
    </div>
  );
};
