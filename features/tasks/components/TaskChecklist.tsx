
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

interface ChecklistItemSetupProps {
    item: ChecklistItem;
    index: number;
    onChange: (id: string, updates: Partial<ChecklistItem>) => void;
    onDelete: (id: string) => void;
    isDragging?: boolean;
    onDragStart?: (e: React.DragEvent, index: number) => void;
    onDragOver?: (e: React.DragEvent, index: number) => void;
    onDrop?: (e: React.DragEvent) => void;
}

export const ChecklistItemSetup: React.FC<ChecklistItemSetupProps> = ({ 
    item, 
    index, 
    onChange, 
    onDelete,
    isDragging,
    onDragStart,
    onDragOver,
    onDrop
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newPhotos = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            onChange(item.id, { referencePhotos: [...(item.referencePhotos || []), ...newPhotos] });
        }
    };

    const removePhoto = (photoIdx: number) => {
        const newPhotos = item.referencePhotos?.filter((_, i) => i !== photoIdx);
        onChange(item.id, { referencePhotos: newPhotos });
    };

    return (
        <div 
            draggable={!!onDragStart}
            onDragStart={(e) => onDragStart && onDragStart(e, index)}
            onDragOver={(e) => onDragOver && onDragOver(e, index)}
            onDrop={onDrop}
            className={`group bg-white border border-slate-200 rounded-lg p-3 transition-all ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        >
            <div className="flex gap-3">
                <div className="flex flex-col items-center pt-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
                </div>
                
                <div className="flex-1 space-y-2">
                    {/* Title Input */}
                    <input 
                        type="text" 
                        placeholder="Checklist item title..." 
                        className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 border-none p-0 focus:ring-0"
                        value={item.title}
                        onChange={(e) => onChange(item.id, { title: e.target.value })}
                    />
                    
                    {/* Description Input */}
                    <textarea 
                        rows={1}
                        placeholder="Add instructions (optional)..."
                        className="w-full text-xs text-slate-600 placeholder:text-slate-400 border-none p-0 focus:ring-0 resize-none bg-transparent"
                        value={item.description || ''}
                        onChange={(e) => onChange(item.id, { description: e.target.value })}
                        style={{ minHeight: '20px' }}
                    />

                    {/* Controls Row */}
                    <div className="flex flex-wrap gap-2 items-center pt-1">
                        {/* Requirement Toggles */}
                        <button 
                            onClick={() => onChange(item.id, { isRequired: !item.isRequired })}
                            className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${item.isRequired ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'}`}
                        >
                            Required
                        </button>
                        <button 
                            onClick={() => onChange(item.id, { requiresAttachment: !item.requiresAttachment })}
                            className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${item.requiresAttachment ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'}`}
                        >
                            Photo Required
                        </button>

                        <div className="h-4 w-px bg-slate-200 mx-1"></div>

                        {/* Reference Photos Trigger */}
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                        >
                            <Icons.Plus className="w-3 h-3" /> Ref Photo
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handlePhotoUpload} />
                    </div>

                    {/* Reference Photos Preview */}
                    {item.referencePhotos && item.referencePhotos.length > 0 && (
                        <div className="flex gap-2 pt-2 overflow-x-auto">
                            {item.referencePhotos.map((photo, i) => (
                                <div key={i} className="relative w-10 h-10 rounded border border-slate-200 group/photo">
                                    <img src={photo} alt="" className="w-full h-full object-cover rounded" />
                                    <button 
                                        onClick={() => removePhoto(i)}
                                        className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover/photo:opacity-100 transition-opacity"
                                    >
                                        <Icons.X className="w-2.5 h-2.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button 
                    onClick={() => onDelete(item.id)}
                    className="self-start text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Icons.Trash className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export const ChecklistItemExecution: React.FC<{ item: ChecklistItem }> = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [notes, setNotes] = useState(item.workerNotes || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // In execution mode, this would usually upload to server
        // Mocking local preview for UI
    };

    return (
        <div className={`border rounded-lg transition-all ${item.isCompleted ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 hover:border-indigo-300'}`}>
            <div className="p-3 flex items-start gap-3">
                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${item.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-indigo-500'}`}>
                    {item.isCompleted && <Icons.Check className="w-3.5 h-3.5" />}
                </div>
                
                <div className="flex-1" onClick={() => setIsExpanded(!isExpanded)}>
                    <div className={`text-sm font-medium ${item.isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                        {item.title}
                        {item.isRequired && <span className="text-red-500 ml-1 text-xs">*</span>}
                    </div>
                    {item.description && (
                        <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                    )}
                    
                    {/* Badges */}
                    <div className="flex gap-2 mt-1.5">
                        {item.requiresAttachment && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100 flex items-center gap-1">
                                <Icons.PaperClip className="w-2.5 h-2.5" /> Photo Required
                            </span>
                        )}
                        {item.referencePhotos && item.referencePhotos.length > 0 && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                                {item.referencePhotos.length} Refs
                            </span>
                        )}
                    </div>
                </div>

                <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-400 hover:text-slate-600">
                    <Icons.ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Execution Details (Photos, Notes) */}
            {isExpanded && (
                <div className="px-3 pb-3 pt-0 border-t border-slate-100 mt-1">
                    {/* Reference Photos Display */}
                    {item.referencePhotos && item.referencePhotos.length > 0 && (
                        <div className="mb-3 pt-2">
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Reference</div>
                            <div className="flex gap-2 overflow-x-auto">
                                {item.referencePhotos.map((url, i) => (
                                    <img key={i} src={url} className="w-16 h-16 object-cover rounded border border-slate-200" alt="ref" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Worker Inputs */}
                    <div className="space-y-2 pt-2">
                        <div>
                            <textarea 
                                className="w-full text-xs border border-slate-200 rounded p-2 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                                rows={2}
                                placeholder="Add notes..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1.5 rounded transition-colors"
                            >
                                <Icons.Plus className="w-3 h-3" /> Add Photo
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handlePhotoUpload} />
                        </div>
                        
                        {/* Worker Photos Preview (Mock) */}
                        {item.workerPhotos && item.workerPhotos.length > 0 && (
                            <div className="flex gap-2 pt-1 overflow-x-auto">
                                {item.workerPhotos.map((url, i) => (
                                    <div key={i} className="relative w-12 h-12">
                                        <img src={url} className="w-full h-full object-cover rounded border border-slate-200" alt="uploaded" />
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
