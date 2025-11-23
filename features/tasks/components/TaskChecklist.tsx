
import React, { useState, useRef } from 'react';
import { Icons } from '../../../constants';

// Enhanced Checklist Type
export interface ChecklistItem {
    id: string;
    title: string;
    description?: string;
    requiresAttachment?: boolean;
    isRequired?: boolean;
    referencePhotos?: string[];
    isCompleted: boolean;
    completedAt?: string;
    completedBy?: string;
    workerNotes?: string;
    workerPhotos?: string[];
}

const DragHandleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" clipRule="evenodd" />
    </svg>
);

const ChatBubbleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 9.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm0 4.5a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm0 4.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
  </svg>
);

export const ChecklistItemSetup: React.FC<{ 
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
                                type="button"
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
                                type="button"
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
                                type="button"
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

export const ChecklistItemExecution: React.FC<{ 
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
