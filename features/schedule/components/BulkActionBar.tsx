
import React from 'react';
import { Staff, TaskStatus } from '../../../types';
import { STATUS_STYLES } from '../constants';

interface BulkActionBarProps {
  selectedCount: number;
  staffList: Staff[];
  onAssign: (staffId: string) => void;
  onStatusChange: (status: TaskStatus) => void;
  onDelete: () => void;
  onClear: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  staffList,
  onAssign,
  onStatusChange,
  onDelete,
  onClear
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-slate-200 shadow-2xl rounded-xl p-2 flex items-center gap-4 animate-in slide-in-from-bottom-4 fade-in duration-300 ring-1 ring-black/5">
      <div className="flex items-center gap-3 pl-3 pr-4 border-r border-slate-200">
        <div className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md min-w-[24px] text-center">
          {selectedCount}
        </div>
        <span className="text-sm font-medium text-slate-700">Selected</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Assign Dropdown */}
        <select 
          className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 hover:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700"
          onChange={(e) => {
             if (e.target.value) {
                onAssign(e.target.value);
                e.target.value = ""; // Reset
             }
          }}
          defaultValue=""
        >
          <option value="" disabled>Assign to...</option>
          <option value="unassigned">Unassigned</option>
          {staffList.filter(s => s.isWorking).map(s => (
             <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
           className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 hover:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700"
           onChange={(e) => {
               if (e.target.value) {
                   onStatusChange(e.target.value as TaskStatus);
                   e.target.value = ""; // Reset
               }
           }}
           defaultValue=""
        >
            <option value="" disabled>Set Status...</option>
            {Object.keys(STATUS_STYLES).map(status => (
                <option key={status} value={status} className="capitalize">{status}</option>
            ))}
        </select>
      </div>

      <div className="h-6 w-px bg-slate-200 mx-1"></div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Selected"
        >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
             <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
           </svg>
        </button>
        
        <button 
          onClick={onClear}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Cancel Selection"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>
      </div>
    </div>
  );
};
