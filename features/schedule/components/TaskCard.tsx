
import React, { useRef, useState, useEffect } from 'react';
import { Task, TaskType } from '../../../types';
import { Icons, START_HOUR, HOURS_COUNT, STATUS_STYLES, TYPE_ICON_COLORS } from '../constants';

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onClick: (task: Task) => void;
  onToggleSelect: (taskId: string) => void;
}

const TaskIcons: Record<TaskType, React.FC> = {
  maintenance: Icons.Maintenance,
  cleaning: Icons.Cleaning,
  inspection: Icons.Inspection,
  delivery: Icons.Delivery,
};

const formatTime = (h: number) => {
  const hour = Math.floor(h);
  const minutes = Math.round((h - hour) * 60);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const dispHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const dispMin = minutes < 10 ? `0${minutes}` : minutes;
  return `${dispHour}:${dispMin} ${ampm}`;
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, isSelected, onDragStart, onClick, onToggleSelect }) => {
  const Icon = TaskIcons[task.type];

  // Animation State for Celebration
  const prevStatusRef = useRef(task.status);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (task.status === 'completed' && prevStatusRef.current !== 'completed') {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
    prevStatusRef.current = task.status;
  }, [task.status]);

  // Timings
  const plannedStart = task.plannedStartTime ?? task.startTime;
  const plannedDur = task.plannedDuration ?? task.duration;
  const actualStart = task.startTime;
  const actualEnd = task.startTime + task.duration;
  const plannedEnd = plannedStart + plannedDur;

  // Overrun Flags
  // Schedule Overrun: Ends later than planned
  const hasScheduleOverrun = actualEnd > plannedEnd;
  // Duration Overrun: Takes longer than planned (independent of start time)
  const isDurationOverrun = task.duration > (plannedDur + 0.001); 

  // --- Positioning (based on Actual) ---
  const leftPercent = ((actualStart - START_HOUR) / HOURS_COUNT) * 100;
  const widthPercent = (task.duration / HOURS_COUNT) * 100;

  // --- Schedule Split Logic (for background pattern) ---
  const splitPointRelative = plannedEnd - actualStart;
  let splitPercent = (splitPointRelative / task.duration) * 100;
  
  if (splitPercent < 0) splitPercent = 0;
  if (splitPercent > 100) splitPercent = 100;
  
  const style: React.CSSProperties = {
    left: `${leftPercent}%`,
    width: `${widthPercent}%`,
  };

  const isCompleted = task.status === 'completed';
  const isDelayed = task.status === 'delayed';
  const hasBadge = isCompleted || isDelayed;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={(e) => { e.stopPropagation(); onClick(task); }}
      style={style}
      className={`absolute top-1 bottom-1 rounded-md shadow-sm cursor-pointer hover:brightness-105 hover:z-50 transition-all z-10 select-none border-l-4 group 
        ${STATUS_STYLES[task.status]} 
        ${isCompleted ? 'opacity-90 grayscale-[0.2]' : ''}
        ${isDurationOverrun ? 'border-r-4 border-r-orange-400' : ''}
        ${isSelected ? 'ring-2 ring-indigo-600 ring-offset-1 z-40 brightness-105' : ''}
      `}
    >
      {/* Selection Checkbox (Visible on Hover or Selected) */}
      <div 
        className={`absolute top-0.5 left-0.5 z-50 ${isSelected ? 'block' : 'hidden group-hover:block'}`}
        onClick={(e) => { e.stopPropagation(); onToggleSelect(task.id); }}
      >
         <input 
            type="checkbox" 
            checked={isSelected} 
            readOnly 
            className="w-3 h-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
         />
      </div>

      {/* Celebration Effect Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 z-50 pointer-events-none rounded-md overflow-hidden">
           <div className="absolute inset-0 bg-white/40 animate-pulse"></div>
           <div className="absolute top-0 right-1 text-lg animate-bounce" style={{ animationDuration: '0.8s' }}>✨</div>
           <div className="absolute bottom-1 left-1 text-lg animate-bounce" style={{ animationDuration: '1.2s', animationDelay: '0.2s' }}>✨</div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl animate-ping opacity-75" style={{ animationDuration: '1s' }}>✨</div>
        </div>
      )}

      {/* Delayed Status Pattern Overlay */}
      {isDelayed && (
          <div 
            className="absolute inset-0 z-0 pointer-events-none opacity-[0.06]" 
            style={{
                backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)',
                backgroundSize: '8px 8px'
            }}
          ></div>
      )}

      {/* Schedule Overrun Background Pattern Overlay */}
      {hasScheduleOverrun && !isDelayed && (
          <div 
            className="absolute inset-0 rounded-r-md z-0 pointer-events-none opacity-10"
            style={{
                background: `linear-gradient(to right, transparent ${splitPercent}%, black ${splitPercent}%)`,
                maskImage: `linear-gradient(to right, transparent ${splitPercent}%, black ${splitPercent}%)`
            }}
          >
             <div className="w-full h-full" style={{
                 backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)',
                 backgroundSize: '6px 6px'
             }}></div>
          </div>
      )}

      {/* Content Container - Compact Padding */}
      <div className={`relative z-10 flex flex-col h-full justify-between overflow-hidden p-1 ${isSelected ? 'pl-4' : ''}`}>
        {/* Title Row */}
        <div className={`flex items-center gap-1 mb-0 ${hasBadge ? 'pr-5' : ''}`}>
          <span className={TYPE_ICON_COLORS[task.type]}>
            <div className="w-2.5 h-2.5"><Icon /></div>
          </span>
          <span className={`font-semibold text-[10px] truncate leading-none ${isCompleted ? 'line-through decoration-slate-400/70' : ''}`}>
            {task.title}
          </span>
        </div>
        
        {task.duration > 0.5 && (
            <div className="flex flex-col gap-0 leading-none">
                 <span className="text-[8.5px] opacity-80 truncate">{task.location}</span>
                {task.notes && task.duration > 1 && (
                  <span className="text-[8px] bg-black/10 px-1 rounded inline-block w-fit truncate opacity-75 mt-0.5">
                    {task.notes}
                  </span>
                )}
            </div>
        )}
      </div>
      
      {/* Status Badges - Compact Size */}
      {isDelayed && (
         <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md z-30 flex items-center justify-center" title="Delayed">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 text-white">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
         </div>
      )}
      
      {isCompleted && (
         <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-md z-30" title="Completed">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
         </div>
      )}

      {/* Detailed Hover Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[240px] bg-slate-800 text-white text-xs p-2.5 rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 flex flex-col gap-1.5 ring-1 ring-white/10">
          <div className="flex items-start justify-between gap-2">
              <div className="font-bold text-sm leading-tight">{task.title}</div>
              <div className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${STATUS_STYLES[task.status].replace('bg-', 'bg-opacity-20 bg-').replace('text-', 'text-white ')}`}>
                  {task.status}
              </div>
          </div>
          
          <div className="text-slate-300 text-[11px] flex items-center gap-1">
             <span className={TYPE_ICON_COLORS[task.type]}><div className="w-3 h-3"><Icon /></div></span>
             <span className="capitalize">{task.type}</span>
             <span className="mx-1">•</span>
             <span>{task.location}</span>
          </div>

          <div className="border-t border-slate-600/50 pt-1.5 mt-0.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[10px]">
              <span className="text-slate-400 font-medium">Planned:</span>
              <span className="font-mono text-slate-200">
                {formatTime(plannedStart)} - {formatTime(plannedEnd)} 
                <span className="text-slate-400 ml-1">({plannedDur}h)</span>
              </span>
              
              <span className="text-slate-400 font-medium">Actual:</span>
              <span className={`font-mono ${hasScheduleOverrun || isDurationOverrun ? 'text-amber-300 font-bold' : 'text-slate-200'}`}>
                  {formatTime(actualStart)} - {formatTime(actualEnd)} 
                  <span className={`ml-1 ${isDurationOverrun ? 'text-red-400' : 'text-slate-400'}`}>({task.duration}h)</span>
              </span>

              {isDurationOverrun && (
                <div className="col-span-2 text-orange-400 italic text-[9px] mt-0.5 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Exceeds planned duration by {(task.duration - plannedDur).toFixed(2)}h
                </div>
              )}
          </div>

          {task.notes && (
              <div className="mt-1 text-[10px] italic text-slate-400 bg-slate-900/50 p-1.5 rounded border border-slate-700/50">
                  "{task.notes}"
              </div>
          )}

          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );
};
