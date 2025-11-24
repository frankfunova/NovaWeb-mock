
import React, { useState, useRef } from 'react';
import { Icons } from '../../../constants';
import { TaskPriority } from '../../../types';
import { MOCK_MAP_PROPERTIES } from '../../../services/mockData';
import { CascadingCategorySelector } from '../../tasks/components/TaskSelectors';
import { TaskAttachments, TaskAttachment } from '../../tasks/components/TaskAttachments';

interface IntentCreateFormProps {
    onCancel: () => void;
    onCreate: (data: any) => void;
    type?: string;
}

export const IntentCreateForm: React.FC<IntentCreateFormProps> = ({ onCancel, onCreate, type = 'Service Request' }) => {
    // Form State
    const [propertyId, setPropertyId] = useState<string>('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<{code: string, sub: string}>({ code: '', sub: '' });
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [createTask, setCreateTask] = useState(false);
    const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
    
    // Footer State
    const [markResolved, setMarkResolved] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handlers
    const handleAddAttachment = (files: FileList) => {
        const newAtts = Array.from(files).map((f, i) => ({
            id: `new-${Date.now()}-${i}`,
            name: f.name,
            type: f.type.startsWith('image') ? 'image' as const : 'document' as const,
            url: URL.createObjectURL(f)
        }));
        setAttachments([...attachments, ...newAtts]);
    };

    const handleRemoveAttachment = (id: string) => {
        setAttachments(attachments.filter(a => a.id !== id));
    };

    const handleCreate = () => {
        if (!propertyId) {
            alert('Please select a property');
            return;
        }
        onCreate({
            type,
            propertyId,
            description,
            category,
            priority,
            createTask,
            attachments,
            markResolved
        });
    };

    const renderPriorityButton = (p: TaskPriority) => {
        const isSelected = priority === p;
        let baseClass = "flex-1 py-2 text-sm font-medium rounded-md border transition-all capitalize";
        let activeClass = "";
        
        if (isSelected) {
            switch(p) {
                case 'low': activeClass = "bg-slate-100 border-slate-300 text-slate-700 shadow-sm"; break;
                case 'medium': activeClass = "bg-yellow-50 border-yellow-400 text-yellow-800 shadow-sm"; break;
                case 'high': activeClass = "bg-orange-50 border-orange-400 text-orange-800 shadow-sm"; break;
                case 'urgent': activeClass = "bg-red-50 border-red-400 text-red-800 shadow-sm"; break;
            }
        } else {
            activeClass = "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300";
        }

        return (
            <button 
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`${baseClass} ${activeClass}`}
            >
                {p}
            </button>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-white">
                <h2 className="text-lg font-bold text-slate-800">New {type}</h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="space-y-6">
                    
                    {/* Property Selection (Required) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Property <span className="text-red-500">*</span>
                        </label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
                            value={propertyId}
                            onChange={(e) => setPropertyId(e.target.value)}
                            autoFocus
                        >
                            <option value="" disabled>Select property</option>
                            {MOCK_MAP_PROPERTIES.map(p => (
                                <option key={p.id} value={p.id}>{p.title} - {p.address}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea 
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            placeholder="Describe the request or issue..."
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Category & Priority Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                            <CascadingCategorySelector 
                                placeholder="Select Category"
                                categoryCode={category.code}
                                subcategoryName={category.sub}
                                onChange={(c, s) => setCategory({ code: c, sub: s })}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                            <div className="flex gap-3">
                                {renderPriorityButton('low')}
                                {renderPriorityButton('medium')}
                                {renderPriorityButton('high')}
                                {renderPriorityButton('urgent')}
                            </div>
                        </div>
                    </div>

                    {/* Create Task Toggle */}
                    <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <input 
                            type="checkbox" 
                            id="createTask" 
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-4 w-4"
                            checked={createTask}
                            onChange={(e) => setCreateTask(e.target.checked)}
                        />
                        <label htmlFor="createTask" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                            Create a task and assign to me
                        </label>
                    </div>

                    {/* Attachments */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attachments</label>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                                <Icons.Plus className="w-3 h-3" /> Add
                            </button>
                        </div>
                        <TaskAttachments 
                            attachments={attachments} 
                            onAdd={handleAddAttachment} 
                            onRemove={handleRemoveAttachment} 
                        />
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            multiple 
                            onChange={(e) => e.target.files && handleAddAttachment(e.target.files)} 
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id="markResolved" 
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer h-4 w-4"
                        checked={markResolved}
                        onChange={(e) => setMarkResolved(e.target.checked)}
                    />
                    <label htmlFor="markResolved" className="text-sm text-slate-600 cursor-pointer select-none">
                        Mark as resolved
                    </label>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleCreate}
                        className="px-6 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};
