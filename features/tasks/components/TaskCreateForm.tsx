
import React, { useState, useRef, useEffect } from 'react';
import { Icons, TASK_LABELS } from '../../../constants';
import { TaskPriority, TaskType } from '../../../types';
import { MOCK_MAP_PROPERTIES, MOCK_STAFF } from '../../../services/mockData';
import { CascadingCategorySelector } from './TaskSelectors';
import { ChecklistItem, ChecklistItemSetup } from './TaskChecklist';
import { TaskExpenses } from './TaskExpenses';
import { TaskAttachments, TaskAttachment } from './TaskAttachments';

interface TaskCreateFormProps {
    onCancel: () => void;
    onCreate: (data: any) => void;
    initialData?: {
        staffId?: string;
        startTime?: number; // Float hour
        date?: Date;
    };
}

const SOURCES = ['Guest', 'Owner', 'Staff', 'System'];

export const TaskCreateForm: React.FC<TaskCreateFormProps> = ({ onCancel, onCreate, initialData }) => {
    // Step 1 State
    const [propertyId, setPropertyId] = useState<string>('');
    const [taskType, setTaskType] = useState<TaskType | ''>('');
    const [template, setTemplate] = useState('');
    const [source, setSource] = useState('');

    // Step 2 State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<{code: string, sub: string}>({ code: '', sub: '' });
    const [priority, setPriority] = useState<TaskPriority>('medium');
    
    // Checklist
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    // Dispatch
    const [isDispatchOpen, setIsDispatchOpen] = useState(true);
    const [plannedDate, setPlannedDate] = useState(
        initialData?.date ? initialData.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    );
    const [plannedTime, setPlannedTime] = useState('09:00');
    const [duration, setDuration] = useState(1);
    const [assigneeId, setAssigneeId] = useState(initialData?.staffId || '');
    const [supervisorId, setSupervisorId] = useState('');

    // Footer State
    const [isCompleted, setIsCompleted] = useState(false);

    // Initialize time from float if provided
    useEffect(() => {
        if (initialData?.startTime) {
            const h = Math.floor(initialData.startTime);
            const m = Math.round((initialData.startTime - h) * 60);
            const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            setPlannedTime(timeString);
        }
    }, [initialData]);

    // Attachments
    const [attachments, setAttachments] = useState<TaskAttachment[]>([]);

    // Step 1 Logic
    const showForm = propertyId && taskType;

    // Handlers
    const handleAddChecklistItem = () => {
        setChecklist([...checklist, { id: Date.now().toString(), title: '', isCompleted: false, isRequired: false }]);
    };

    const handleUpdateChecklistItem = (id: string, updates: Partial<ChecklistItem>) => {
        setChecklist(checklist.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const handleDeleteChecklistItem = (id: string) => {
        setChecklist(checklist.filter(item => item.id !== id));
    };

    // Drag Handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedItemIndex(index);
    };
    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedItemIndex === null || draggedItemIndex === index) return;
        const newChecklist = [...checklist];
        const item = newChecklist[draggedItemIndex];
        newChecklist.splice(draggedItemIndex, 1);
        newChecklist.splice(index, 0, item);
        setChecklist(newChecklist);
        setDraggedItemIndex(index);
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDraggedItemIndex(null);
    };

    const handleAddAttachment = (files: FileList) => {
        const newAtts = Array.from(files).map((f, i) => ({
            id: `new-${Date.now()}-${i}`,
            name: f.name,
            type: f.type.startsWith('image') ? 'image' as const : 'document' as const,
            url: URL.createObjectURL(f)
        }));
        setAttachments([...attachments, ...newAtts]);
    };

    const handleCreate = () => {
        if (!title) {
            alert('Please enter a task title');
            return;
        }
        onCreate({
            propertyId, taskType, template, source, title, description, category, priority, checklist,
            dispatch: { plannedDate, plannedTime, duration, assigneeId, supervisorId },
            attachments,
            isCompleted
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
                <h2 className="text-lg font-bold text-slate-800">New Task</h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                
                {/* STEP 1: Essential Selection */}
                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Property <span className="text-red-500">*</span></label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
                            value={propertyId}
                            onChange={(e) => setPropertyId(e.target.value)}
                        >
                            <option value="" disabled>Select property</option>
                            {MOCK_MAP_PROPERTIES.map(p => (
                                <option key={p.id} value={p.id}>{p.title} - {p.address}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Task Type <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white appearance-none cursor-pointer"
                                value={taskType}
                                onChange={(e) => setTaskType(e.target.value as TaskType)}
                            >
                                <option value="" disabled>Select task type</option>
                                {Object.entries(TASK_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                                <option value="custom">Custom Task</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <Icons.ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Task Template</label>
                        <div className="relative">
                            <select 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
                                value={template}
                                onChange={(e) => setTemplate(e.target.value)}
                            >
                                <option value="">Select task template</option>
                                <option value="std_clean">Standard Cleaning</option>
                                <option value="ac_check">AC Maintenance Check</option>
                                <option value="plumbing_basic">Basic Plumbing Fix</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <Icons.ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Source</label>
                        <div className="relative">
                            <select 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                            >
                                <option value="">Select source</option>
                                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <Icons.ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 2: Detailed Form (Conditional) */}
                {showForm && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="h-px bg-slate-100 -mx-6"></div>

                        {/* Main Details */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Task Title <span className="text-red-500">*</span></label>
                                <input 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. Fix leaking faucet"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    placeholder="Add detailed instructions..."
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
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
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority <span className="text-red-500">*</span></label>
                                    <div className="flex gap-3">
                                        {renderPriorityButton('low')}
                                        {renderPriorityButton('medium')}
                                        {renderPriorityButton('high')}
                                        {renderPriorityButton('urgent')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checklist */}
                        <div className="border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">CHECKLIST</label>
                                <button onClick={() => setIsDispatchOpen(!isDispatchOpen)} className="text-slate-400 hover:text-slate-600"><Icons.ChevronDown className={`w-4 h-4 transition-transform ${isDispatchOpen ? '' : '-rotate-90'}`} /></button>
                            </div>
                            <div className="space-y-2">
                                {checklist.map((item, idx) => (
                                    <ChecklistItemSetup 
                                        key={item.id} item={item} index={idx} onChange={handleUpdateChecklistItem} onDelete={handleDeleteChecklistItem} 
                                        onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} isDragging={draggedItemIndex === idx}
                                    />
                                ))}
                                <button 
                                    onClick={handleAddChecklistItem}
                                    className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Icons.Plus className="w-3 h-3" /> Add Item
                                </button>
                            </div>
                        </div>

                        {/* Dispatch Section */}
                        <div className="border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setIsDispatchOpen(!isDispatchOpen)}>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer">DISPATCH</label>
                                <Icons.ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDispatchOpen ? '' : '-rotate-90'}`} />
                            </div>
                            
                            {isDispatchOpen && (
                                <div className="space-y-4 animate-in slide-in-from-top-1 duration-200">
                                    <div>
                                        <label className="block text-sm text-slate-600 font-medium mb-1">Planned Date</label>
                                        <div className="relative">
                                            <input 
                                                type="date" 
                                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                value={plannedDate}
                                                onChange={(e) => setPlannedDate(e.target.value)}
                                            />
                                            <Icons.Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-slate-600 font-medium mb-1">Assignee</label>
                                            <select 
                                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
                                                value={assigneeId}
                                                onChange={(e) => setAssigneeId(e.target.value)}
                                            >
                                                <option value="">Unassigned</option>
                                                {MOCK_STAFF.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-end">
                                            <button className="w-full border border-slate-200 text-indigo-600 text-sm font-bold py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                                <Icons.Calendar className="w-4 h-4" /> Show Agenda
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-slate-600 font-medium mb-1">Planned Start Time</label>
                                            <div className="relative">
                                                <input 
                                                    type="time" 
                                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    value={plannedTime}
                                                    onChange={(e) => setPlannedTime(e.target.value)}
                                                />
                                                <Icons.Clock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-600 font-medium mb-1">Estimated Duration</label>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="number" 
                                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    value={duration}
                                                    onChange={(e) => setDuration(parseFloat(e.target.value))}
                                                    min={0.25}
                                                    step={0.25}
                                                />
                                                <span className="text-sm text-slate-400">min</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-slate-600 font-medium mb-1">Supervisor</label>
                                        <select 
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
                                            value={supervisorId}
                                            onChange={(e) => setSupervisorId(e.target.value)}
                                        >
                                            <option value="">None</option>
                                            {MOCK_STAFF.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Expenses & Attachments */}
                        <div className="border-t border-slate-100 pt-4 space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">EXPENSES</label>
                                <TaskExpenses />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">ATTACHMENTS</label>
                                <TaskAttachments attachments={attachments} onAdd={handleAddAttachment} onRemove={(id) => setAttachments(attachments.filter(a => a.id !== id))} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id="markCompleted" 
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-4 w-4"
                        checked={isCompleted}
                        onChange={(e) => setIsCompleted(e.target.checked)}
                    />
                    <label htmlFor="markCompleted" className="text-sm text-slate-600 cursor-pointer select-none">
                        Mark this task as completed
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
                        disabled={!showForm}
                        className="px-6 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};
