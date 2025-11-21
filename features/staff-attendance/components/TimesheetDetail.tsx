
import React, { useEffect, useState } from 'react';
import { Staff, AttendanceRecord } from '../../../types';
import { api } from '../../../services/api';

interface TimesheetDetailProps {
  staff: Staff;
  dateRange: { start: Date; end: Date };
}

const SUMMARY_STATS = {
  days: 8,
  regular: '56:30',
  overtime: '1:45',
  total: '58:15',
  payable: '57:45'
};

export const TimesheetDetail: React.FC<TimesheetDetailProps> = ({ staff, dateRange }) => {
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const loadLogs = async () => {
          setIsLoading(true);
          try {
              const data = await api.fetchUserTimesheet(staff.id, dateRange.start, dateRange.end);
              setLogs(data);
          } catch (e) {
              console.error(e);
          } finally {
              setIsLoading(false);
          }
      };
      loadLogs();
  }, [staff.id, dateRange]);

  if (isLoading) {
      return <div className="p-6 text-center text-slate-400">Loading timesheet...</div>;
  }

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Summary Stats Row */}
      <div className="bg-white border-b border-slate-200 pb-6 pt-2">
        <div className="grid grid-cols-5 gap-2 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Days</span>
            <span className="text-xl font-bold text-slate-800">{logs.length}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Regular</span>
            <span className="text-xl font-bold text-slate-800">{SUMMARY_STATS.regular}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overtime</span>
            <span className="text-xl font-bold text-orange-500">{SUMMARY_STATS.overtime}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
            <span className="text-xl font-bold text-indigo-600">{SUMMARY_STATS.total}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payable</span>
            <span className="text-xl font-bold text-green-600">{SUMMARY_STATS.payable}</span>
          </div>
        </div>
      </div>

      {/* List Header */}
      <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        <div className="col-span-2">Date</div>
        <div className="text-center">Regular</div>
        <div className="text-center">OT</div>
        <div className="text-center">Total</div>
        <div className="text-center">Payable</div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {logs.map((log, idx) => {
          const dateObj = new Date(log.attendanceDate);
          const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dateStr = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
          const isPrevMonth = dateObj.getMonth() !== dateRange.end.getMonth();
          const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30';

          return (
            <div 
              key={log.id} 
              className={`grid grid-cols-6 gap-4 px-4 py-4 border-b border-slate-100 items-center text-sm hover:bg-slate-50 transition-colors ${rowBg} ${isPrevMonth ? 'opacity-60' : ''}`}
            >
              {/* Date Column */}
              <div className="col-span-2 flex items-center gap-3">
                <div className={`text-lg font-bold ${isPrevMonth ? 'text-slate-300' : 'text-indigo-600'}`}>
                   {dateStr}
                </div>
                <div className={`text-xs font-medium ${isPrevMonth ? 'text-slate-300' : 'text-slate-500'}`}>
                   {dayStr}
                </div>
                {log.hasWarning && (
                   <div className="text-orange-400" title="Missing punch or irregularity">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                      </svg>
                   </div>
                )}
              </div>

              {/* Stats Columns */}
              <div className={`text-center font-medium ${log.isOff ? 'text-slate-200' : 'text-slate-700'}`}>
                {log.regularHours || '--'}
              </div>
              
              <div className={`text-center font-medium ${log.overtimeHours && log.overtimeHours !== '--' ? 'text-red-500' : 'text-slate-200'}`}>
                {log.overtimeHours || '--'}
              </div>

              <div className={`text-center font-medium ${log.isOff ? 'text-slate-200' : 'text-indigo-600'}`}>
                {log.totalHours || '--'}
              </div>

              <div className={`text-center font-bold ${log.isOff ? 'text-slate-200' : 'text-green-600'}`}>
                {log.payableHours || '--'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
