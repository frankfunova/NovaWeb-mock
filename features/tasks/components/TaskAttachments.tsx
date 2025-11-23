
import React, { useRef } from 'react';
import { Icons } from '../../../constants';

export interface TaskAttachment {
    id: string;
    type: 'image' | 'document';
    url: string;
    name: string;
    thumbnailUrl?: string;
}

interface TaskAttachmentsProps {
    attachments: TaskAttachment[];
    onAdd: (files: FileList) => void;
    onRemove: (id: string) => void;
}

export const TaskAttachments: React.FC<TaskAttachmentsProps> = ({ attachments, onAdd, onRemove }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onAdd(e.target.files);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div>
            {attachments.length > 0 ? (
                <div className="grid grid-cols-4 gap-3 pt-1">
                    {attachments.map(att => (
                        <div key={att.id} className="group relative aspect-square bg-slate-100 rounded-lg border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-all">
                            {att.type === 'image' ? (
                                <img src={att.thumbnailUrl || att.url} alt={att.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 flex-col p-2 text-center">
                                    <Icons.PaperClip className="w-6 h-6 mb-1" />
                                    <span className="text-[9px] truncate w-full">{att.name}</span>
                                </div>
                            )}
                            
                            {/* Remove Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={(e) => { e.stopPropagation(); onRemove(att.id); }} className="bg-white p-1.5 rounded-full text-red-500 hover:bg-red-50 shadow-sm">
                                    <Icons.X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    <div 
                        onClick={() => fileInputRef.current?.click()} 
                        className="border-2 border-dashed border-slate-200 rounded-lg aspect-square flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-500 transition-all cursor-pointer"
                    >
                        <Icons.Plus className="w-6 h-6" />
                        <span className="text-[10px] font-bold mt-1">Add</span>
                    </div>
                </div>
            ) : (
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-500 transition-all cursor-pointer mt-1">
                    <Icons.PaperClip /><span className="text-xs font-medium mt-2">No attachments yet. Click to upload.</span>
                </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
        </div>
    );
};
