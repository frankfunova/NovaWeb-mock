
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Intent, IntentTimelineEvent, IntentAttachment } from '../../../types';
import { Icons } from '../../../constants';

interface IntentDetailProps {
  intent: Intent;
  onOpenTask?: (taskId: string) => void;
  onOpenReservation?: (resId: string) => void;
}

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const STATUSES = ['new', 'pending', 'in_progress', 'resolved', 'closed'];

const MOCK_CATEGORIES: Record<string, { name: string; subcategories: string[] }> = {
    MAINT: { name: 'Maintenance', subcategories: ['Plumbing', 'HVAC', 'Electrical', 'Appliances', 'Other'] },
    HK: { name: 'Housekeeping', subcategories: ['Cleanliness', 'Supplies', 'Linens', 'Damage'] },
    GS: { name: 'Guest Services', subcategories: ['Check-in', 'Parking', 'Wifi', 'Amenities'] },
    FIN: { name: 'Financial', subcategories: ['Refund', 'Extra Charge', 'Invoice'] }
};

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

const ResolveModal: React.FC<{ isOpen: boolean; onClose: () => void; onResolve: (note: string) => void }> = ({ isOpen, onClose, onResolve }) => {
    const [note, setNote] = useState('');
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800">Resolve Intent</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                        <Icons.X />
                    </button>
                </div>
                <div className="p-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Resolution Note</label>
                    <textarea 
                        className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        rows={4}
                        placeholder="Describe how this issue was resolved..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all">
                        Cancel
                    </button>
                    <button 
                        onClick={() => onResolve(note)}
                        disabled={!note.trim()}
                        className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50"
                    >
                        Mark as Resolved
                    </button>
                </div>
            </div>
        </div>
    );
};

// Unified Searchable Cascading Selector
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

const InlineDescriptionEditor: React.FC<{ value: string; onSave: (newVal: string) => void }> = ({ value, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value);

    useEffect(() => { setText(value); }, [value]);

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
                    className="w-full bg-white border border-indigo-300 rounded-xl p-4 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm resize-none"
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.metaKey) handleSave(); 
                        if (e.key === 'Escape') handleCancel();
                    }}
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                    <button onClick={handleCancel} className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 shadow-sm transition-colors"><Icons.X /></button>
                    <button onClick={handleSave} className="p-1.5 rounded-full bg-indigo-600 text-white border border-transparent hover:bg-indigo-700 shadow-sm transition-colors"><Icons.Check /></button>
                </div>
            </div>
        );
    }

    return (
        <div 
            onClick={() => setIsEditing(true)}
            className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed shadow-sm cursor-pointer hover:bg-white hover:border-indigo-300 hover:ring-1 hover:ring-indigo-100 transition-all group relative min-h-[80px]"
        >
            {value}
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
        low: 'bg-green-100 text-green-800 border-green-200',
        medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        high: 'bg-orange-100 text-orange-800 border-orange-200',
        urgent: 'bg-red-100 text-red-800 border-red-200'
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
                onClick={() => setIsOpen(!isOpen)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize flex items-center gap-1 hover:opacity-80 transition-opacity ${colors[priority.toLowerCase()] || 'bg-slate-100'}`}
            >
                {priority}
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

const StatusSelector: React.FC<{ status: string; onChange: (val: string) => void }> = ({ status, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const colors: Record<string, string> = {
        new: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        pending: 'bg-amber-100 text-amber-800 border-amber-200',
        in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
        resolved: 'bg-green-100 text-green-800 border-green-200',
        closed: 'bg-slate-100 text-slate-600 border-slate-200'
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

    const formatStatus = (s: string) => s === 'new' ? 'New' : s.replace('_', ' ');

    return (
        <div className="relative" ref={containerRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize flex items-center gap-1 hover:opacity-80 transition-opacity ${colors[status.toLowerCase()] || 'bg-slate-100'}`}
            >
                {formatStatus(status)}
                <div className="w-3 h-3 opacity-50"><Icons.ChevronDown /></div>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 p-1">
                    {STATUSES.map(s => (
                        <div 
                            key={s}
                            onClick={() => { onChange(s); setIsOpen(false); }}
                            className="px-2 py-1.5 cursor-pointer hover:bg-slate-50 rounded-md flex items-center justify-between group"
                        >
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${colors[s.toLowerCase()] || 'bg-slate-100'}`}>
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
    // Mock status
    const statuses = ['Dirty', 'Occupied', 'Cleaned', 'Ready to Check in'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    let colorClass = 'bg-slate-100 text-slate-600 border-slate-200';
    if (status === 'Dirty') colorClass = 'bg-rose-50 text-rose-700 border-rose-200';
    if (status === 'Occupied') colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
    if (status === 'Cleaned') colorClass = 'bg-sky-50 text-sky-700 border-sky-200';
    if (status === 'Ready to Check in') colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';

    return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border tracking-wider ${colorClass}`}>
            {status}
        </span>
    );
};

export const IntentDetail: React.FC<IntentDetailProps> = ({ intent: initialIntent, onOpenTask, onOpenReservation }) => {
  const [intent, setIntent] = useState<Intent>(initialIntent);
  const [commentInput, setCommentInput] = useState('');
  const [timeline, setTimeline] = useState<IntentTimelineEvent[]>(intent.timeline || []);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  
  // Linking Reservation State
  const [isLinkingRes, setIsLinkingRes] = useState(false);
  const [resSearchQuery, setResSearchQuery] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      setIntent(initialIntent);
      setTimeline(initialIntent.timeline || []);
  }, [initialIntent]);

  const sortedTasks = useMemo(() => {
      if (!intent.linkedTasks) return [];
      return [...intent.linkedTasks].sort((a, b) => {
          const dateA = a.assignedAt ? new Date(a.assignedAt).getTime() : 0;
          const dateB = b.assignedAt ? new Date(b.assignedAt).getTime() : 0;
          return dateB - dateA;
      });
  }, [intent.linkedTasks]);

  const handlePostComment = () => {
      if (!commentInput.trim()) return;
      const newEvent: IntentTimelineEvent = {
          id: Date.now().toString(),
          type: 'comment',
          title: 'Comment added',
          description: commentInput,
          timestamp: 'Just now',
          actorName: 'Me',
          actorInitials: 'ME',
          actorColor: 'bg-indigo-600'
      };
      setTimeline([newEvent, ...timeline]);
      setCommentInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      const newAttachments: IntentAttachment[] = Array.from(files).map((file, index) => {
          const isImage = file.type.startsWith('image/');
          const type = isImage ? 'image' : 'document';
          return {
              id: `new-${Date.now()}-${index}`,
              type: type as any,
              url: URL.createObjectURL(file),
              name: file.name,
              uploadedAt: new Date().toISOString(),
              thumbnailUrl: isImage ? URL.createObjectURL(file) : undefined
          };
      });
      setIntent(prev => ({ ...prev, attachments: [...(prev.attachments || []), ...newAttachments] }));
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdateIntent = (field: keyof Intent, value: any) => {
      setIntent(prev => ({ ...prev, [field]: value }));
      if (field === 'status') {
          const newEvent: IntentTimelineEvent = {
            id: Date.now().toString(),
            type: 'status_change',
            title: `Status changed to ${value.replace('_', ' ')}`,
            timestamp: 'Just now',
            actorName: 'Me',
            actorInitials: 'ME',
            actorColor: 'bg-indigo-600'
        };
        setTimeline([newEvent, ...timeline]);
      }
  };

  const handleResolve = (note: string) => {
      setIntent(prev => ({ ...prev, status: 'resolved', resolvedAt: new Date().toISOString(), resolvedBy: 'Me', resolvedNote: note }));
      setTimeline([{
          id: Date.now().toString(),
          type: 'resolution',
          title: 'Intent Resolved',
          description: note,
          timestamp: 'Just now',
          actorName: 'Me',
          actorInitials: 'ME',
          actorColor: 'bg-emerald-600'
      }, ...timeline]);
      setIsResolveModalOpen(false);
  };

  const handleSaveReservationLink = () => {
      if (!resSearchQuery.trim()) return;
      // Mock linking a reservation
      const mockRes = {
          id: 'mock-res-id',
          guestName: 'Found Guest',
          reservationCode: resSearchQuery.toUpperCase(),
          status: 'Confirmed'
      };
      setIntent(prev => ({ ...prev, reservation: mockRes }));
      setIsLinkingRes(false);
      setResSearchQuery('');
  };

  // Helper to determine reporter info
  const getReporterInfo = () => {
    const source = intent.source || 'System';
    const date = intent.createdAt;
    
    // Check if createdAt is just "Nov 22" or ISO
    let displayTime = date;
    if (date && !date.includes(',')) { 
       try {
           const d = new Date(date.length < 10 ? `${date}, 2025` : date);
           if (!isNaN(d.getTime())) {
               displayTime = d.toLocaleString('en-US', { 
                   month: 'short', 
                   day: 'numeric', 
                   hour: 'numeric', 
                   minute: '2-digit' 
               });
           }
       } catch (e) {
           // keep original
       }
    }
    
    if (['Airbnb', 'VRBO', 'Booking', 'Direct'].includes(source)) {
        return {
            name: intent.reservation?.guestName || 'Guest',
            type: source,
            avatar: null,
            time: displayTime,
            icon: <Icons.User />,
            isGuest: true
        };
    }
    
    return {
        name: source === 'System' ? 'System' : 'Staff Member',
        type: source,
        avatar: null,
        time: displayTime,
        icon: source === 'System' ? <Icons.Settings /> : <Icons.User />,
        isGuest: false
    };
  };

  const reporter = getReporterInfo();

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
       
       {/* Sticky Feature Header Section */}
       <div className="px-6 py-5 border-b border-slate-200 bg-white flex-shrink-0 shadow-sm z-10">
            <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                    {/* Row 1: Title + Listing Status */}
                    <div className="flex items-center gap-3 mb-2">
                        {/* Property Name as Header */}
                        {intent.listing ? (
                            <div 
                                className="group flex items-center gap-2 cursor-pointer"
                                onClick={() => window.open('#', '_blank')} // Mock link
                                title="Open property page"
                            >
                                <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors decoration-2 underline-offset-2 group-hover:underline">
                                    {intent.listing.nickname}
                                </h2>
                                <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </div>
                        ) : (
                             <h2 className="text-xl font-bold text-slate-900">
                                General Intent
                            </h2>
                        )}
                        
                        {/* Listing Status Badge */}
                        <ListingStatusBadge />
                    </div>

                    {/* Row 2: Status + Priority */}
                    <div className="flex items-center gap-2">
                        <StatusSelector status={intent.status} onChange={(val) => handleUpdateIntent('status', val)} />
                        <PrioritySelector priority={intent.priority} onChange={(val) => handleUpdateIntent('priority', val)} />
                    </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 ml-4">
                    <button className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                        <Icons.Plus /> Create Task
                    </button>
                    {intent.status !== 'resolved' && (
                        <button onClick={() => setIsResolveModalOpen(true)} className="px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-sm">
                            Resolve
                        </button>
                    )}
                </div>
            </div>
       </div>

       {/* Scrollable Main Section */}
       <div className="flex-1 overflow-y-auto custom-scrollbar">
           
           {/* Context & Info Section */}
           <div className="p-6 pb-2 grid grid-cols-2 gap-x-6 gap-y-4">
                {/* Category */}
                <div className="col-span-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</div>
                    <CascadingCategorySelector 
                        categoryCode={intent.category?.code} 
                        subcategoryName={intent.subcategory?.name} 
                        onChange={(catCode, subName) => {
                            setIntent(prev => ({ ...prev, category: { name: MOCK_CATEGORIES[catCode].name, code: catCode }, subcategory: { name: subName, code: subName.toUpperCase() } }));
                        }} 
                    />
                </div>

                {/* Reported By (Merged Source + Time) */}
                <div className="col-span-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Reported By</div>
                    <div className="flex items-center gap-2">
                        {/* Avatar / Icon */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 shadow-sm flex-shrink-0 ${reporter.isGuest ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                            {reporter.isGuest ? <Icons.User className="w-4 h-4"/> : <Icons.Dashboard className="w-4 h-4"/>}
                        </div>
                        
                        {/* Text Info */}
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

           {/* Description */}
           <div className="px-6 pb-6">
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</div>
               <InlineDescriptionEditor value={intent.description} onSave={(val) => handleUpdateIntent('description', val)} />
           </div>

           {/* Attachments Section */}
           <CollapsibleSection 
               title={`Attachments (${intent.attachments?.length || 0})`} 
               icon={<Icons.PaperClip className="w-3.5 h-3.5 text-slate-400"/>}
               action={
                   <>
                       <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2 py-1 rounded transition-colors flex items-center gap-1">
                           <Icons.Plus /> Add File
                       </button>
                       <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} accept="image/*,video/*,application/pdf" />
                   </>
               }
           >
               {intent.attachments && intent.attachments.length > 0 ? (
                   <div className="grid grid-cols-4 gap-3 pt-1">
                       {intent.attachments.map(att => (
                           <div key={att.id} className="group relative aspect-square bg-slate-100 rounded-lg border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-all">
                               {att.type === 'image' ? <img src={att.thumbnailUrl || att.url} alt={att.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><span className="text-[9px]">{att.name}</span></div>}
                           </div>
                       ))}
                   </div>
               ) : (
                   <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-500 transition-all cursor-pointer mt-1">
                       <Icons.PaperClip /><span className="text-xs font-medium mt-2">No attachments yet. Click to upload.</span>
                   </div>
               )}
           </CollapsibleSection>

           {/* Linked Reservation Section */}
           <CollapsibleSection 
               title="Linked Reservation" 
               icon={<Icons.Calendar className="w-3.5 h-3.5 text-slate-400"/>}
               action={
                   !isLinkingRes && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsLinkingRes(true); }}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
                        >
                            {intent.reservation ? 'Change' : 'Link Reservation'}
                        </button>
                   )
               }
           >
               {isLinkingRes ? (
                   <div className="flex gap-2 items-center animate-in fade-in zoom-in-95 duration-200 pt-1">
                       <input 
                            type="text" 
                            autoFocus
                            placeholder="Enter Reservation ID or Confirmation Code..." 
                            className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            value={resSearchQuery}
                            onChange={(e) => setResSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveReservationLink()}
                       />
                       <button 
                            onClick={handleSaveReservationLink}
                            disabled={!resSearchQuery.trim()}
                            className="px-3 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                       >
                           Save
                       </button>
                       <button 
                            onClick={() => { setIsLinkingRes(false); setResSearchQuery(''); }}
                            className="px-3 py-2 bg-white border border-slate-300 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-50"
                       >
                           Cancel
                       </button>
                   </div>
               ) : intent.reservation ? (
                   <div 
                        className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group mt-1"
                        onClick={() => onOpenReservation && onOpenReservation(intent.reservation!.id)}
                   >
                       <div className="flex items-center gap-3">
                           <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                               <Icons.User />
                           </div>
                           <div>
                               <div className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
                                   {intent.reservation.guestName}
                                   <span className="text-slate-400 font-normal ml-1 text-xs">#{intent.reservation.reservationCode}</span>
                               </div>
                               <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                   <span>Nov 19 - Nov 24, 2025</span>
                               </div>
                           </div>
                       </div>
                       <div className="flex items-center gap-3">
                           <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize bg-slate-50 text-slate-600 border-slate-200`}>
                               {intent.reservation.status}
                           </span>
                           <div className="text-slate-400 group-hover:text-indigo-500 transition-colors"><Icons.ChevronRight /></div>
                       </div>
                   </div>
               ) : (
                   <div className="text-sm text-slate-400 italic py-2 text-center border border-dashed border-slate-200 rounded-lg mt-1">
                       No linked reservation.
                   </div>
               )}
           </CollapsibleSection>

           {/* Linked Tasks Section */}
           <CollapsibleSection 
               title="Linked Tasks" 
               icon={<Icons.ClipboardCheck className="w-3.5 h-3.5 text-slate-400"/>}
               action={
                   <button 
                        onClick={(e) => { e.stopPropagation(); console.log("Create Task Clicked"); }} 
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors flex items-center gap-1"
                   >
                       <Icons.Plus /> Create Task
                   </button>
               }
           >
               {sortedTasks && sortedTasks.length > 0 ? (
                   <div className="space-y-2 pt-1">
                       {sortedTasks.map(task => (
                           <div key={task.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group" onClick={() => onOpenTask && onOpenTask(task.id)}>
                               <div className="flex items-center gap-3">
                                   <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"><Icons.ClipboardCheck /></div>
                                   <div>
                                       <div className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{task.title}</div>
                                       <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                           {task.assigneeName && <span>{task.assigneeName}</span>}
                                           {task.assignedAt && <><span>•</span><span>{new Date(task.assignedAt).toLocaleString()}</span></>}
                                       </div>
                                   </div>
                               </div>
                               <div className="flex items-center gap-3">
                                   <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize bg-slate-50 text-slate-600 border-slate-200`}>{task.status}</span>
                                   <div className="text-slate-400 group-hover:text-indigo-500 transition-colors"><Icons.ChevronRight /></div>
                               </div>
                           </div>
                       ))}
                   </div>
               ) : <div className="text-sm text-slate-400 italic py-2 text-center border border-dashed border-slate-200 rounded-lg mt-1">No linked tasks yet.</div>}
           </CollapsibleSection>

           {/* Activity Timeline Section */}
           <CollapsibleSection title="Activity Timeline" icon={<Icons.Clock className="w-3.5 h-3.5 text-slate-400"/>}>
               <div className="relative pl-4 space-y-6 pt-2">
                   <div className="absolute left-[21px] top-2 bottom-2 w-px bg-slate-200"></div>
                   {timeline.map((event, idx) => (
                       <div key={event.id} className="relative flex gap-4 group">
                           <div className={`relative z-10 flex-shrink-0 w-9 h-9 rounded-full border-2 border-white flex items-center justify-center shadow-sm bg-white text-slate-500`}>
                               {event.actorInitials ? <span className="text-xs font-bold text-slate-600">{event.actorInitials}</span> : <div className="w-4 h-4"><Icons.Bell /></div>}
                           </div>
                           <div className="flex-1 pt-1">
                               <div className="flex justify-between items-start">
                                   <span className="text-sm font-bold text-slate-800">{event.actorName}</span>
                                   <span className="text-[10px] text-slate-400 font-medium">{event.timestamp}</span>
                               </div>
                               <div className="text-xs text-slate-500 mt-0.5">
                                   {event.title} {event.description && <span className="text-slate-400">- {event.description}</span>}
                               </div>
                           </div>
                       </div>
                   ))}
               </div>
           </CollapsibleSection>
       </div>

       {/* Sticky Bottom Section: Comment Footer */}
       <div className="p-4 border-t border-slate-200 bg-white z-20 flex-shrink-0">
            <div className="border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all bg-white flex gap-3 items-end">
                <textarea 
                    className="flex-1 text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none bg-transparent py-1"
                    placeholder="Write a comment..."
                    rows={1}
                    style={{ minHeight: '24px', maxHeight: '100px' }}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePostComment(); } }}
                />
                <div className="flex gap-2 pb-0.5">
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors" onClick={() => fileInputRef.current?.click()} title="Attach file"><Icons.PaperClip /></button>
                    <button onClick={handlePostComment} disabled={!commentInput.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </div>
            </div>
       </div>

       <ResolveModal isOpen={isResolveModalOpen} onClose={() => setIsResolveModalOpen(false)} onResolve={handleResolve} />
    </div>
  );
};
