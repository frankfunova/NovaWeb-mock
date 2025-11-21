
import React from 'react';
import { Task, TaskType } from '../../../types';
import { Icons, TYPE_ICON_COLORS } from '../constants';

interface UnassignedTaskProps {
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

export const UnassignedTask: React.FC<UnassignedTaskProps> = ({ task, isSelected, onDragStart, onClick, onToggleSelect }) => {
  const Icon = TaskIcons[task.type];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={(e) => { e.stopPropagation(); onClick(task); }}
      className={`w-9 h-9 rounded-md border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center cursor-grab active:cursor-grabbing group relative select-none
        ${isSelected ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-200'}
      `}
    >
      {/* Checkbox for Selection */}
      <div 
         className={`absolute -top-1.5 -right-1.5 z-20 ${isSelected ? 'block' : 'hidden group-hover:block'}`}
         onClick={(e) => { e.stopPropagation(); onToggleSelect(task.id); }}
      >
          <div className="bg-white rounded-full p-0.5 shadow-sm border border-slate-200">
            <input 
                type="checkbox" 
                checked={isSelected} 
                readOnly 
                className="w-3 h-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 block cursor-pointer"
            />
          </div>
      </div>

      <span className={`${TYPE_ICON_COLORS[task.type]}`}>
        <Icon />
      </span>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-slate-800 text-white text-xs p-2 rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
         <div className="font-bold truncate">{task.title}</div>
         <div className="text-slate-400 text-[10px]">{task.type} • {task.duration}h</div>
         {/* Arrow */}
         <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );
};
