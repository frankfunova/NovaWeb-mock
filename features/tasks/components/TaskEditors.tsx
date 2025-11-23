
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../../../constants';

export const InlineTitleEditor: React.FC<{ value: string; onSave: (newVal: string) => void; placeholder?: string }> = ({ value, onSave, placeholder = "Add task title..." }) => {
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
                    placeholder={placeholder}
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
                {value || <span className="text-slate-400 italic font-normal">{placeholder}</span>}
            </h2>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-full p-1.5 shadow-sm text-indigo-500">
                 <Icons.Edit />
            </div>
        </div>
    );
};

export const InlineDescriptionEditor: React.FC<{ value: string; onSave: (newVal: string) => void; placeholder?: string }> = ({ value, onSave, placeholder = "Add task description..." }) => {
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
                    placeholder={placeholder}
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
            {value || <span className="text-slate-400 italic">{placeholder}</span>}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-full p-1 shadow-sm">
                 <div className="w-4 h-4 text-indigo-400"><Icons.Edit /></div>
            </div>
        </div>
    );
};
