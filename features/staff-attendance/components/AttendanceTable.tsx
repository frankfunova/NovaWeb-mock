
import React from 'react';
import { AttendanceRecord, AttendanceStatus, ViewMode } from '../../../types';

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onRowClick: (record: AttendanceRecord) => void;
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
  viewMode: ViewMode;
}

const formatTime = (isoDateString?: string) => {
  if (!isoDateString) return '--';
  const date = new Date(isoDateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (isoDateString?: string) => {
    if (!isoDateString) return '--';
    const date = new Date(isoDateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatDuration = (seconds: number) => {
    if (!seconds) return '--';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
};

const getStatusBadge = (status: AttendanceStatus) => {
    switch(status) {
        case 'Working':
            return (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full text-xs font-medium w-fit">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    Working
                </div>
            );
        case 'In break':
            return (
                <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full text-xs font-medium w-fit">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    In break
                </div>
            );
        case 'Shift End':
            return (
                <div className="flex items-center gap-2 text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full text-xs font-medium w-fit">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    Shift End
                </div>
            );
        case 'Off duty':
            return (
                 <div className="flex items-center gap-2 text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-medium w-fit">
                    Off duty
                </div>
            );
        default:
            return <span className="text-slate-400">--</span>;
    }
};

const SortableHeader = ({ 
  label, 
  sortKey, 
  sortConfig, 
  onSort 
}: { 
  label: string, 
  sortKey: string, 
  sortConfig: SortConfig | null, 
  onSort: (key: string) => void 
}) => {
  const isActive = sortConfig?.key === sortKey;
  const direction = isActive ? sortConfig.direction : null;

  return (
    <th 
      scope="col" 
      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 hover:bg-slate-100 transition-colors select-none group"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        <div className={`flex flex-col text-slate-400 ${isActive ? 'text-indigo-600' : 'opacity-30 group-hover:opacity-100 transition-opacity'}`}>
            {direction === 'asc' && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
            )}
             {direction === 'desc' && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            )}
            {!direction && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                </svg>
            )}
        </div>
      </div>
    </th>
  );
};

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, onRowClick, sortConfig, onSort, viewMode }) => {
  const isDaily = viewMode === 'daily';

  return (
    <div className="min-w-full inline-block align-middle">
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-10">
                 <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </th>
              <SortableHeader label="First name" sortKey="name" sortConfig={sortConfig} onSort={onSort} />
              
              <SortableHeader label="Department" sortKey="department" sortConfig={sortConfig} onSort={onSort} />
              <SortableHeader label="Position" sortKey="position" sortConfig={sortConfig} onSort={onSort} />
              
              {/* Status moved after Position, only visible in Daily mode */}
              {isDaily && (
                <SortableHeader label="Status" sortKey="status" sortConfig={sortConfig} onSort={onSort} />
              )}
              
              <SortableHeader label={isDaily ? "Clock in" : "Start Date"} sortKey="clockIn" sortConfig={sortConfig} onSort={onSort} />
              <SortableHeader label={isDaily ? "Clock out" : "End Date"} sortKey="clockOut" sortConfig={sortConfig} onSort={onSort} />
              
              <SortableHeader label="Total hours" sortKey="totalHours" sortConfig={sortConfig} onSort={onSort} />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {records.map((record) => (
              <tr 
                key={record.id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => onRowClick(record)}
              >
                <td className="px-6 py-4 whitespace-nowrap w-10" onClick={(e) => e.stopPropagation()}>
                   <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                     <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${record.user.avatarColor}`}>
                         {record.user.initials}
                     </div>
                     <span className="text-sm font-medium text-slate-700">{record.user.fullName}</span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                   {record.user.department !== '--' ? record.user.department : <span className="text-slate-300">--</span>}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                   {record.user.position !== '--' ? record.user.position : <span className="text-slate-300">--</span>}
                </td>

                {/* Status Cell */}
                {isDaily && (
                    <td className="px-6 py-4 whitespace-nowrap">
                       {getStatusBadge(record.status)}
                    </td>
                )}

                <td className="px-6 py-4 whitespace-nowrap">
                    {record.firstClockInAt ? (
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <span>{isDaily ? formatTime(record.firstClockInAt) : formatDate(record.firstClockInAt)}</span>
                        </div>
                    ) : <span className="text-slate-400">--</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {record.finalClockOutAt ? (
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <span>{isDaily ? formatTime(record.finalClockOutAt) : formatDate(record.finalClockOutAt)}</span>
                        </div>
                    ) : <span className="text-slate-400">--</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                   {formatDuration(record.totalWorkingDurationSec)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
