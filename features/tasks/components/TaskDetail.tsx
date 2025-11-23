
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Task } from '../../../types';
import { Icons } from '../../../constants';
import { ChecklistItem, ChecklistItemSetup, ChecklistItemExecution } from './TaskChecklist';
import { TaskAttachments, TaskAttachment } from './TaskAttachments';
import { TaskExpenses } from './TaskExpenses';
import { CascadingCategorySelector, PrioritySelector, StatusSelector, ListingStatusBadge } from './TaskSelectors';
import { InlineTitleEditor, InlineDescriptionEditor } from './TaskEditors';

interface TaskDetailProps {
  task: Task;
}

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

const ThumbUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
);

// --- Main Component ---

export const TaskDetail: React.FC<TaskDetailProps> = ({ task: initialTask }) => {
  const [task, setTask] = useState<Task>(initialTask);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<{id: string, text: string, author: string, time: string}[]>([
      { id: '1', text: 'Scheduled for tomorrow.', author: 'System', time: 'Nov 18, 9:00 AM' }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  
  // Mock Category State
  const [category, setCategory] = useState<{code?: string, subName?: string}>({ code: 'MAINT', subName: 'General' });

  // Checklist State
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

  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklistData);
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
    : `CHECKLIST (${completedRequiredCount}/${totalRequired || 1} required item completed)`;

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
  };

  const handleCancelChecklist = () => {
      setChecklist(savedChecklist);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
      setDraggedItemIndex(index);
      e.dataTransfer.effectAllowed = "move";
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

  const handleAddAttachment = (files: FileList) => {
      const newAtts = Array.from(files).map((f, i) => ({
          id: `att-${Date.now()}-${i}`,
          name: f.name,
          type: f.type.startsWith('image') ? 'image' as const : 'document' as const,
          url: URL.createObjectURL(f)
      }));
      setAttachments([...attachments, ...newAtts]);
  };

  const handleRemoveAttachment = (id: string) => {
      setAttachments(attachments.filter(a => a.id !== id));
  };

  const reporter = {
      name: 'System',
      type: 'System',
      avatar: null,
      time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      icon: <Icons.Settings />,
      isGuest: false
  };

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
                     isChecklistDirty ? (
                         <div className="flex gap-2 animate-in fade-in duration-200">
                             <button onClick={handleCancelChecklist} className="px-2 py-1 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Cancel</button>
                             <button onClick={handleSaveChecklist} className="px-2 py-1 text-[10px] font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 shadow-sm transition-colors">Save</button>
                         </div>
                     ) : null
                 ) : (
                     <div className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${checklistStatus.color}`}>
                         {checklistStatus.icon}
                         {checklistStatus.label}
                     </div>
                 )
             }
          >
             <div className="space-y-3 pt-1">
                {isEditMode ? (
                    <>
                        {checklist.map((item, idx) => (
                            <ChecklistItemSetup 
                                key={item.id} item={item} index={idx} onChange={handleUpdateChecklistItem} onDelete={handleDeleteChecklistItem}
                                isDragging={draggedItemIndex === idx} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}
                            />
                        ))}
                        <button onClick={handleAddChecklistItem} className="w-full py-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2">
                            <Icons.Plus className="w-4 h-4" /> Add Item
                        </button>
                    </>
                ) : (
                    <>
                        {checklist.map(item => <ChecklistItemExecution key={item.id} item={item} />)}
                    </>
                )}
             </div>
          </CollapsibleSection>

          {/* Photos Section */}
          <CollapsibleSection 
              title={`Photos & Attachments (${attachments.length})`} 
              icon={<Icons.PaperClip className="w-4 h-4 text-slate-400" />}
              action={
                  <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2 py-1 rounded transition-colors">
                     + Add
                  </button>
              }
          >
              <TaskAttachments attachments={attachments} onAdd={handleAddAttachment} onRemove={handleRemoveAttachment} />
              <input type="file" ref={fileInputRef} className="hidden" multiple onChange={(e) => e.target.files && handleAddAttachment(e.target.files)} accept="image/*" />
          </CollapsibleSection>

          {/* Expenses / Completion */}
          <CollapsibleSection title="Expenses & Completion" icon={<Icons.Briefcase className="w-4 h-4 text-slate-400" />}>
              <TaskExpenses />
          </CollapsibleSection>

          {/* Activity */}
          <div className="bg-slate-50 border-t border-slate-200 p-6 pb-24">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Activity Log</h3>
              <div className="space-y-4">
                  {comments.map(c => (
                      <div key={c.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">{c.author[0]}</div>
                          <div>
                              <div className="flex items-center gap-2"><span className="text-sm font-bold text-slate-900">{c.author}</span><span className="text-xs text-slate-400">{c.time}</span></div>
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
              <button onClick={handlePostComment} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-indigo-700">Send</button>
          </div>
      </div>
    </div>
  );
};
