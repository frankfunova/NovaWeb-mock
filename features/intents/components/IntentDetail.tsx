

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Intent, IntentTimelineEvent, IntentAttachment } from '../../../types';
import { Icons } from '../../../constants';

interface IntentDetailProps {
  intent: Intent;
  onOpenTask?: (taskId: string) => void;
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
            // Small delay to ensure render
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const resetState = () => {
        setSearch('');
        setView('categories');
        setActiveCategory(null);
    };

    const currentCategoryName = categoryCode ? MOCK_CATEGORIES[categoryCode]?.name : null;
    
    // Flatten options for search
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
        setSearch(''); // Clear search if any
    };

    const handleSelect = (catCode: string, sub: string) => {
        onChange(catCode, sub);
        setIsOpen(false);
        resetState();
    };

    return (
        <div className="relative" ref={containerRef}>
            <button 
                onClick={() => { setIsOpen(!isOpen); if (!isOpen) resetState(); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all shadow-sm group ${categoryCode ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
            >
                <div className={`w-4 h-4 flex items-center justify-center rounded-full ${categoryCode ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                     <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                </div>
                
                {categoryCode && subcategoryName ? (
                    <span className="flex items-center gap-1">
                        <span className="font-bold">{currentCategoryName}</span>
                        <span className="text-indigo-400">/</span>
                        <span>{subcategoryName}</span>
                    </span>
                ) : (
                    <span>Assign Category</span>
                )}
                <div className={`w-3 h-3 transition-transform duration-200 opacity-50 ${isOpen ? 'rotate-180' : ''}`}><Icons.ChevronDown /></div>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[320px]">
                    
                    {/* Search Header */}
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
                            /* Search Results */
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
                            /* Category List */
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
                            /* Subcategory List */
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


// Inline Text Editor Component
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
                        if (e.key === 'Enter' && e.metaKey) handleSave(); // Cmd+Enter to save
                        if (e.key === 'Escape') handleCancel();
                    }}
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                    <button 
                        onClick={handleCancel} 
                        className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 shadow-sm transition-colors"
                        title="Cancel"
                    >
                        <Icons.X />
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="p-1.5 rounded-full bg-indigo-600 text-white border border-transparent hover:bg-indigo-700 shadow-sm transition-colors"
                        title="Save"
                    >
                        <Icons.Check />
                    </button>
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

// Priority Selector Component
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

// Status Selector Component
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

export const IntentDetail: React.FC<IntentDetailProps> = ({ intent: initialIntent, onOpenTask }) => {
  const [intent, setIntent] = useState<Intent>(initialIntent);
  const [commentInput, setCommentInput] = useState('');
  // Use local state for timeline to allow optimistic updates
  const [timeline, setTimeline] = useState<IntentTimelineEvent[]>(intent.timeline || []);
  const [timelineFilter, setTimelineFilter] = useState<string>('all');
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync timeline when intent prop changes
  useEffect(() => {
      setIntent(initialIntent);
      setTimeline(initialIntent.timeline || []);
  }, [initialIntent]);

  // Sort linked tasks by assignedAt date descending
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
          const isVideo = file.type.startsWith('video/');
          const type = isImage ? 'image' : isVideo ? 'video' : 'document';
          
          return {
              id: `new-${Date.now()}-${index}`,
              type: type as any,
              url: URL.createObjectURL(file),
              name: file.name,
              uploadedAt: new Date().toISOString(),
              thumbnailUrl: isImage ? URL.createObjectURL(file) : undefined
          };
      });

      setIntent(prev => ({
          ...prev,
          attachments: [...(prev.attachments || []), ...newAttachments]
      }));

      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdateIntent = (field: keyof Intent, value: any) => {
      setIntent(prev => ({
          ...prev,
          [field]: value
      }));
      
      // Add timeline event for status change
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
      setIntent(prev => ({
          ...prev,
          status: 'resolved',
          resolvedAt: new Date().toISOString(),
          resolvedBy: 'Me',
          resolvedNote: note
      }));
      
      const newEvent: IntentTimelineEvent = {
          id: Date.now().toString(),
          type: 'resolution',
          title: 'Intent Resolved',
          description: note,
          timestamp: 'Just now',
          actorName: 'Me',
          actorInitials: 'ME',
          actorColor: 'bg-emerald-600'
      };
      setTimeline([newEvent, ...timeline]);
      setIsResolveModalOpen(false);
  };

  const handleReopen = () => {
      if (window.confirm('Are you sure you want to re-open this intent?')) {
          setIntent(prev => ({
              ...prev,
              status: 'in_progress',
              resolvedAt: undefined,
              resolvedBy: undefined,
              resolvedNote: undefined
          }));
          
          const newEvent: IntentTimelineEvent = {
              id: Date.now().toString(),
              type: 'reopen',
              title: 'Intent Re-opened',
              timestamp: 'Just now',
              actorName: 'Me',
              actorInitials: 'ME',
              actorColor: 'bg-indigo-600'
          };
          setTimeline([newEvent, ...timeline]);
      }
  };

  const handleCategorySelection = (catCode: string, subName: string) => {
      const catName = MOCK_CATEGORIES[catCode]?.name || catCode;
      // Mock code generation
      const subCode = subName.toUpperCase().replace(/ /g, '_');
      
      setIntent(prev => ({
          ...prev,
          category: { name: catName, code: catCode },
          subcategory: { name: subName, code: subCode }
      }));
  };

  const filteredTimeline = timeline.filter(event => {
      if (timelineFilter === 'all') return true;
      return event.type === timelineFilter;
  });

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
       
       {/* Header Section */}
       <div className="px-6 py-5 border-b border-slate-200 bg-white flex-shrink-0">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                           {intent.intentTypeCode} #{intent.id.substring(0, 6)}
                        </h2>
                        <StatusSelector 
                            status={intent.status} 
                            onChange={(val) => handleUpdateIntent('status', val)} 
                        />
                        <PrioritySelector 
                            priority={intent.priority} 
                            onChange={(val) => handleUpdateIntent('priority', val)} 
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>Created {intent.createdAt}</span>
                        <span>•</span>
                        <span className="capitalize">{intent.source} Source</span>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                        <Icons.Plus /> Create Task
                    </button>
                    {intent.status === 'resolved' || intent.status === 'closed' ? (
                         <button 
                            onClick={handleReopen}
                            className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors shadow-sm"
                        >
                            Re-open
                        </button>
                    ) : (
                        <button 
                            onClick={() => setIsResolveModalOpen(true)}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-sm"
                        >
                            Resolve
                        </button>
                    )}
                </div>
            </div>

            {/* Context Pills */}
            <div className="flex flex-wrap gap-2 mt-2">
                 {intent.listing && (
                     <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-700 border border-slate-200">
                         <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                         {intent.listing.nickname}
                     </div>
                 )}
                 {intent.reservation && (
                     <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-700 border border-slate-200">
                         <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                         {intent.reservation.guestName} ({intent.reservation.reservationCode})
                     </div>
                 )}
                 
                 {/* Unified Cascading Selector */}
                 <CascadingCategorySelector 
                    categoryCode={intent.category?.code} 
                    subcategoryName={intent.subcategory?.name}
                    onChange={handleCategorySelection}
                 />
            </div>
       </div>

       <div className="flex-1 overflow-y-auto custom-scrollbar">
           
           {/* Resolved Info Banner */}
           {intent.status === 'resolved' && intent.resolvedAt && (
               <div className="mx-6 mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center flex-shrink-0 text-emerald-700">
                       <Icons.Check />
                   </div>
                   <div className="flex-1">
                       <div className="text-sm font-bold text-emerald-900">Resolved by {intent.resolvedBy || 'Staff'}</div>
                       <div className="text-xs text-emerald-700 mt-0.5">{new Date(intent.resolvedAt).toLocaleString()}</div>
                       {intent.resolvedNote && (
                           <div className="mt-2 text-sm text-emerald-800 bg-emerald-100/50 p-2 rounded border border-emerald-200/50">
                               "{intent.resolvedNote}"
                           </div>
                       )}
                   </div>
               </div>
           )}

           {/* Main Description */}
           <div className="p-6 pb-2">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Description</h3>
               <InlineDescriptionEditor 
                   value={intent.description} 
                   onSave={(val) => handleUpdateIntent('description', val)} 
               />
           </div>

           {/* Attachments */}
           <div className="px-6 py-4">
               <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                       <Icons.PaperClip /> Attachments ({intent.attachments?.length || 0})
                   </h3>
                   <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2 py-1 rounded transition-colors flex items-center gap-1"
                   >
                       <Icons.Plus /> Add File
                   </button>
                   <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        multiple
                        onChange={handleFileUpload}
                        accept="image/*,video/*,application/pdf"
                   />
               </div>
               
               {intent.attachments && intent.attachments.length > 0 ? (
                   <div className="grid grid-cols-4 gap-3">
                       {intent.attachments.map(att => (
                           <div key={att.id} className="group relative aspect-square bg-slate-100 rounded-lg border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-all">
                               {att.type === 'image' ? (
                                   <img src={att.thumbnailUrl || att.url} alt={att.name} className="w-full h-full object-cover" />
                               ) : (
                                   <div className="w-full h-full flex flex-col items-center justify-center p-2 text-slate-400">
                                       {att.type === 'video' ? (
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                       ) : (
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                       )}
                                       <span className="text-[9px] mt-1 truncate w-full text-center">{att.name}</span>
                                   </div>
                               )}
                               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                           </div>
                       ))}
                   </div>
               ) : (
                   <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-500 transition-all cursor-pointer"
                   >
                       <Icons.PaperClip />
                       <span className="text-xs font-medium mt-2">No attachments yet. Click to upload.</span>
                   </div>
               )}
           </div>

           {/* Linked Tasks */}
           <div className="px-6 py-4 border-t border-slate-100 mt-2">
               <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                       <Icons.ClipboardCheck /> Linked Tasks
                   </h3>
               </div>
               
               {sortedTasks && sortedTasks.length > 0 ? (
                   <div className="space-y-2">
                       {sortedTasks.map(task => (
                           <div 
                                key={task.id} 
                                className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group"
                                onClick={() => onOpenTask && onOpenTask(task.id)}
                           >
                               <div className="flex items-center gap-3">
                                   <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        <Icons.ClipboardCheck />
                                   </div>
                                   <div>
                                       <div className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{task.title}</div>
                                       <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                           {task.assigneeName && <span>{task.assigneeName}</span>}
                                           {task.assignedAt && (
                                               <>
                                                   <span className="text-slate-300">•</span>
                                                   <span>{new Date(task.assignedAt).toLocaleString()}</span>
                                               </>
                                           )}
                                       </div>
                                   </div>
                               </div>
                               
                               <div className="flex items-center gap-3">
                                   <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${
                                       task.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                       task.status === 'in-progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                       'bg-slate-50 text-slate-600 border-slate-200'
                                   }`}>
                                       {task.status}
                                   </span>
                                   <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                                       <Icons.ChevronRight />
                                   </div>
                               </div>
                           </div>
                       ))}
                   </div>
               ) : (
                   <div className="text-sm text-slate-400 italic py-2 text-center border border-dashed border-slate-200 rounded-lg">No linked tasks yet.</div>
               )}
           </div>

           {/* Activity Timeline */}
           <div className="px-6 py-6 border-t border-slate-100 bg-slate-50/30 min-h-[300px]">
               <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activity Timeline</h3>
                   
                   <select 
                        value={timelineFilter}
                        onChange={(e) => setTimelineFilter(e.target.value)}
                        className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                   >
                       <option value="all">All Activity</option>
                       <option value="comment">Comments</option>
                       <option value="status_change">Status Changes</option>
                       <option value="task_linked">Tasks</option>
                       <option value="creation">Creation</option>
                       <option value="resolution">Resolution</option>
                   </select>
               </div>
               
               <div className="relative pl-4 space-y-6">
                   {/* Vertical Line */}
                   <div className="absolute left-[21px] top-2 bottom-2 w-px bg-slate-200"></div>

                   {/* Timeline Items */}
                   {filteredTimeline.map((event, idx) => (
                       <div key={event.id} className="relative flex gap-4 group">
                           {/* Icon */}
                           <div className={`relative z-10 flex-shrink-0 w-9 h-9 rounded-full border-2 border-white flex items-center justify-center shadow-sm 
                               ${event.type === 'creation' ? 'bg-slate-100 text-slate-500' : 
                                 event.type === 'comment' ? 'bg-white text-slate-700' : 
                                 event.type === 'task_linked' ? 'bg-indigo-50 text-indigo-600' :
                                 event.type === 'resolution' ? 'bg-emerald-50 text-emerald-600' :
                                 event.type === 'reopen' ? 'bg-blue-50 text-blue-600' :
                                 'bg-white text-slate-500'}
                           `}>
                               {event.actorInitials ? (
                                   <span className={`text-xs font-bold ${event.type === 'comment' ? 'text-slate-600' : ''}`}>{event.actorInitials}</span>
                               ) : (
                                   <div className="w-4 h-4">
                                       {event.type === 'resolution' ? <Icons.Check /> : 
                                        event.type === 'reopen' ? <Icons.Briefcase /> : 
                                        <Icons.Bell />}
                                   </div> 
                               )}
                           </div>
                           
                           {/* Content */}
                           <div className="flex-1 pt-1">
                               <div className="flex justify-between items-start">
                                   <span className="text-sm font-bold text-slate-800">{event.actorName}</span>
                                   <span className="text-[10px] text-slate-400 font-medium">{event.timestamp}</span>
                               </div>
                               
                               {event.type === 'comment' ? (
                                   <div className="mt-1.5 p-3 bg-white border border-slate-200 rounded-lg rounded-tl-none text-sm text-slate-700 shadow-sm">
                                       {event.description}
                                   </div>
                               ) : (
                                   <div className="text-xs text-slate-500 mt-0.5">
                                       {event.title} {event.description && <span className="text-slate-400">- {event.description}</span>}
                                   </div>
                               )}
                           </div>
                       </div>
                   ))}
                   
                   {filteredTimeline.length === 0 && (
                       <div className="text-center py-4 text-xs text-slate-400 italic">
                           No activity found for this filter.
                       </div>
                   )}
               </div>
           </div>

       </div>

       {/* Comment Footer */}
       <div className="p-4 border-t border-slate-200 bg-white z-10">
            <div className="border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all bg-white flex gap-3 items-end">
                <textarea 
                    className="flex-1 text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none bg-transparent py-1"
                    placeholder="Write a comment..."
                    rows={1}
                    style={{ minHeight: '24px', maxHeight: '100px' }}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handlePostComment();
                        }
                    }}
                />
                <div className="flex gap-2 pb-0.5">
                    <button 
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                        title="Attach file"
                    >
                        <Icons.PaperClip />
                    </button>
                    <button 
                        onClick={handlePostComment}
                        disabled={!commentInput.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </div>
       </div>

       {/* Resolve Modal */}
       <ResolveModal 
          isOpen={isResolveModalOpen} 
          onClose={() => setIsResolveModalOpen(false)} 
          onResolve={handleResolve} 
       />
    </div>
  );
};