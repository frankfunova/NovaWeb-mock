
import React from 'react';
import { MapStaff } from '../../../types';

interface MapStaffCardProps {
  staff: MapStaff;
  onClick?: () => void;
}

export const MapStaffCard: React.FC<MapStaffCardProps> = ({ staff, onClick }) => {
  return (
    <div 
        onClick={onClick}
        className="p-4 border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
    >
        <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0 ${staff.avatarColor}`}>
                {staff.initials}
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${staff.isWorking ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{staff.name}</h3>
                    <span className="text-[10px] font-medium text-slate-400">9:28PM EST</span>
                </div>
                
                {/* Current Status Line - Simulated */}
                <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${staff.isWorking ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    <span className="text-[10px] font-medium text-slate-600 truncate">
                        {staff.isWorking ? `${staff.role} • Active` : 'Off Duty'}
                    </span>
                </div>

                {/* Task Progress */}
                <div>
                    <div className="flex justify-between items-end mb-1 text-[10px]">
                        <span className="text-slate-500 font-medium">Tasks: {staff.tasksDone}/{staff.tasksTotal}</span>
                        <span className="font-bold text-slate-800">{staff.completionPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${staff.completionPercent}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Dropdown Arrow */}
            <div className="text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
        </div>
    </div>
  );
};
