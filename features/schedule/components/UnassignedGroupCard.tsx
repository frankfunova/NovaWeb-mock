
import React from 'react';
import { TaskType } from '../../../types';
import { Icons, TYPE_ICON_COLORS, TASK_LABELS } from '../constants';

interface UnassignedGroupCardProps {
  type: TaskType;
  count: number;
  totalHours: number;
  onClick: () => void;
}

const TaskIcons: Record<TaskType, React.FC> = {
  maintenance: Icons.Maintenance,
  cleaning: Icons.Cleaning,
  inspection: Icons.Inspection,
  delivery: Icons.Delivery,
};

export const UnassignedGroupCard: React.FC<UnassignedGroupCardProps> = ({ type, count, totalHours, onClick }) => {
  const Icon = TaskIcons[type];
  const colorClass = TYPE_ICON_COLORS[type]; 
  
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md hover:border-indigo-300 hover:bg-slate-50 transition-all min-w-[200px] group text-left flex-shrink-0"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform ${colorClass.replace('text-', 'bg-').replace('500', '100')}`}>
         <div className={colorClass}>
            <Icon />
         </div>
      </div>
      
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{TASK_LABELS[type]}</div>
        <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-red-600">{count}</span>
            <span className="text-xs text-slate-400 font-medium">Unassigned</span>
        </div>
        <div className="text-[10px] text-slate-400 font-medium">
           {totalHours.toFixed(1)}h Est. Duration
        </div>
      </div>
    </button>
  );
};
