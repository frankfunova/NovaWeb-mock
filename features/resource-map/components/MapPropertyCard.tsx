
import React from 'react';
import { MapProperty } from '../../../types';

interface MapPropertyCardProps {
  property: MapProperty;
  onClick?: () => void;
}

export const MapPropertyCard: React.FC<MapPropertyCardProps> = ({ property, onClick }) => {
  return (
    <div 
        onClick={onClick}
        className="p-4 border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
    >
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{property.title}</h3>
                    <span className="text-[10px] font-medium text-slate-400">9:28PM EST</span>
                </div>
                
                <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-2">
                    <svg className={`w-3 h-3 ${property.status === 'occupied' ? 'text-orange-500' : 'text-emerald-500'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="capitalize truncate max-w-[200px]">{property.status}: {property.nextEvent}</span>
                </div>

                {/* Task Progress */}
                <div className="mb-1">
                    <div className="flex justify-between items-end mb-1 text-[10px]">
                        <span className="text-slate-500 font-medium">Tasks: {property.tasks.completed}/{property.tasks.total}</span>
                        <span className="font-bold text-slate-800">{property.completionPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${property.completionPercent}%` }}
                        ></div>
                    </div>
                </div>

                {property.pendingTasksCount > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        {property.pendingTasksCount} tasks pending
                    </div>
                )}
            </div>
            
            {/* Dropdown Arrow */}
            <div className="text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
        </div>
    </div>
  );
};
