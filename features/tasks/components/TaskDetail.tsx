import React, { useState } from 'react';
import { Task } from '../../../types';
import { Icons } from '../../../constants';
import { STATUS_BADGES, PRIORITY_STYLES } from '../constants';

interface TaskDetailProps {
  task: Task;
}

const Accordion: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean; icon?: React.ReactNode }> = ({ title, children, defaultOpen = false, icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left group hover:bg-slate-50 transition-colors px-2 -mx-2 rounded-md"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
           {isOpen ? <Icons.ChevronRight /> : <Icons.ChevronRight />} 
           {icon}
           <span>{title}</span>
        </div>
      </button>
      {isOpen && (
        <div className="pb-6 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
  // Dates & Time Formatting
  const dateObj = task.scheduledAt ? new Date(task.scheduledAt) : new Date();
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  // Use startTime if available for time display, otherwise default
  let timeStr = '--:--';
  if (task.startTime) {
      const h = Math.floor(task.startTime);
      const m = Math.round((task.startTime - h) * 60);
      const date = new Date();
      date.setHours(h, m);
      timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } else if (task.scheduledAt) {
      timeStr = new Date(task.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  const formatDuration = (hours?: number) => {
      if (!hours) return '--';
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      if (h === 0) return `${m}m`;
      if (m === 0) return `${h}h`;
      return `${h}h ${m}m`;
  };
  
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      
      {/* Sticky Header Section */}
      <div className="px-6 py-5 border-b border-slate-200 bg-white flex-shrink-0 shadow-sm z-10">
         <div className="flex items-start justify-between gap-4">
             <div>
                 <h2 className="text-xl font-bold text-slate-900 truncate max-w-[350px] mb-2" title={task.propertyName || task.location}>
                     {task.propertyName || task.location || task.id.substring(0, 6).toUpperCase()}
                 </h2>
                 
                 <div className="flex items-center gap-2">
                     {/* Status Badge/Selector */}
                     <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide cursor-pointer hover:opacity-80 transition-opacity ${STATUS_BADGES[task.status] || 'bg-gray-100 text-gray-600'}`}>
                        {task.status.replace('-', ' ')}
                     </div>

                     {/* Priority Badge/Selector */}
                     {task.priority && (
                        <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide cursor-pointer hover:opacity-80 transition-opacity ${PRIORITY_STYLES[task.priority]}`}>
                            {task.priority}
                        </div>
                     )}
                 </div>
             </div>

             {/* Assignee Pill */}
             <div className="flex flex-col items-end gap-2">
                 <div className="flex items-center gap-2 bg-slate-50 pl-1 pr-3 py-1 rounded-full border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors">
                     <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                        {task.assigneeName ? task.assigneeName.charAt(0) : 'U'}
                     </div>
                     <span className="text-sm font-semibold text-slate-700 truncate max-w-[120px]">{task.assigneeName || 'Unassigned'}</span>
                 </div>
                 <button className="text-xs font-bold text-indigo-600 hover:underline">Reassign</button>
             </div>
         </div>
      </div>

      {/* Scrollable Main Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Info Bar */}
          <div className="bg-slate-50/80 border-b border-slate-100 px-6 py-3 grid grid-cols-3 gap-y-2 gap-x-4 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                  <Icons.Calendar />
                  <span className="font-medium">{dateStr}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                  <Icons.Clock />
                  <span className="font-medium">{timeStr}</span>
              </div>
               <div className="flex items-center gap-2 text-slate-500 justify-end">
                  <span className="text-slate-400">Est. Duration:</span>
                  <span className="font-bold text-slate-700 font-mono">{formatDuration(task.plannedDuration)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 col-span-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
                  <span className="text-slate-400">Started:</span>
                  <span className="font-medium text-slate-600">
                      {task.status === 'new' || task.status === 'pending' ? '--' : `${dateStr} ${timeStr}`}
                  </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 justify-end">
                  <span className="text-slate-400">Actual Duration:</span>
                  <span className={`font-bold font-mono ${task.duration > (task.plannedDuration || 0) ? 'text-orange-600' : 'text-slate-700'}`}>
                      {formatDuration(task.duration)}
                  </span>
              </div>
          </div>

          {/* Main Form Content */}
          <div className="p-6 space-y-8">
              
              {/* Title & Description */}
              <div className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Task title <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        defaultValue={task.title} 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Task description <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={3}
                        // Map notes to description if description is empty, ensuring field reuse
                        defaultValue={task.description || task.notes} 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white resize-none"
                      />
                  </div>
              </div>

              {/* Accordions */}
              <div>
                  <Accordion title="CHECKLIST">
                      <div className="pl-4">
                          <div className="flex items-center gap-3 py-2">
                              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                              <span className="text-sm text-slate-700">Verify tool availability</span>
                          </div>
                          <div className="flex items-center gap-3 py-2">
                              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                              <span className="text-sm text-slate-700 line-through opacity-60">Initial Safety Check</span>
                          </div>
                      </div>
                  </Accordion>

                  <Accordion title="ATTACHMENTS" defaultOpen icon={<svg className="w-4 h-4 text-slate-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>}>
                      <div className="space-y-3">
                          <h4 className="text-sm font-bold text-slate-800">Image Attachments</h4>
                          <div className="grid grid-cols-4 gap-2">
                              {[1,2,3,4,5].map(i => (
                                  <div key={i} className="aspect-square rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative group cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all">
                                      <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                      </div>
                                      {/* Timestamp Mock */}
                                      <div className="absolute top-1 left-1 text-[8px] text-red-500 font-mono font-bold bg-black/10 px-1 rounded">1/20/2025 02:39 PM</div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </Accordion>
              </div>

              {/* Field Staff Notes Section */}
              <div>
                  <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">FIELD STAFF NOTES</h3>
                  </div>

                  <div className="space-y-6 pl-1">
                      <div>
                          <div className="text-xs font-bold text-slate-400 uppercase mb-1">JOB RESULT</div>
                          <div className="text-sm text-slate-800">-</div>
                      </div>

                       <div>
                          <div className="text-xs font-bold text-slate-400 uppercase mb-1">STAFF NOTES</div>
                          <div className="text-sm text-slate-800">Guest at the house</div>
                      </div>

                       <div>
                          <div className="text-xs font-bold text-slate-400 uppercase mb-1">FOLLOW-UP REQUIRED</div>
                          <div className="text-sm text-slate-800">No</div>
                      </div>
                  </div>
              </div>

              {/* Feedback Section */}
              <div className="pt-6 border-t border-slate-100">
                   <div className="text-xs font-bold text-slate-500 uppercase mb-4">FEEDBACK</div>
                   
                   <div className="mb-4">
                       <div className="text-xs font-bold text-slate-400 uppercase mb-2">RATING</div>
                       <div className="flex gap-1 text-slate-300">
                           {[1,2,3,4,5].map(star => (
                               <svg key={star} className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                               </svg>
                           ))}
                       </div>
                   </div>

                   <div>
                       <div className="text-xs font-bold text-slate-400 uppercase mb-2">COMMENTS</div>
                       <div className="text-sm text-slate-800">No feedback provided</div>
                   </div>
              </div>

          </div>
      </div>
    </div>
  );
};