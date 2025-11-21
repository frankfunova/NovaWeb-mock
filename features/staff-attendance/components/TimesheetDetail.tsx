
import React from 'react';
import { Staff } from '../../../types';
import { Icons } from '../../../constants';

interface TimesheetDetailProps {
  staff: Staff;
  dateRange: { start: Date; end: Date };
}

// Mock data based on the user's screenshot
const MOCK_DAILY_LOGS = [
  { date: '08', day: 'Sat', regular: '8:00', ot: '0:30', total: '8:30', payable: '8:00', hasWarning: true },
  { date: '07', day: 'Fri', regular: '8:00', ot: '0:45', total: '8:45', payable: '8:45', hasWarning: false },
  { date: '06', day: 'Thu', regular: '8:00', ot: '--', total: '8:00', payable: '8:00', hasWarning: false },
  { date: '05', day: 'Wed', regular: '7:30', ot: '--', total: '7:30', payable: '7:30', hasWarning: false },
  { date: '04', day: 'Tue', regular: '8:00', ot: '0:20', total: '8:20', payable: '8:20', hasWarning: false },
  { date: '03', day: 'Mon', regular: '6:00', ot: '--', total: '6:00', payable: '6:00', hasWarning: false },
  { date: '02', day: 'Sun', regular: '--', ot: '--', total: '--', payable: '--', hasWarning: false, isOff: true },
  { date: '01', day: 'Sat', regular: '--', ot: '--', total: '--', payable: '--', hasWarning: false, isOff: true },
  { date: '31', day: 'Fri', regular: '8:00', ot: '0:10', total: '8:10', payable: '8:10', hasWarning: false, isPrevMonth: true },
  { date: '30', day: 'Thu', regular: '7:00', ot: '--', total: '7:00', payable: '7:00', hasWarning: false, isPrevMonth: true },
  { date: '29', day: 'Wed', regular: '--', ot: '--', total: '--', payable: '--', hasWarning: false, isPrevMonth: true, isOff: true },
  { date: '28', day: 'Tue', regular: '--', ot: '--', total: '--', payable: '--', hasWarning: false, isPrevMonth: true, isOff: true },
];

const SUMMARY_STATS = {
  days: 8,
  regular: '56:30',
  overtime: '1:45',
  total: '58:15',
  payable: '57:45'
};

export const TimesheetDetail: React.FC<TimesheetDetailProps> = ({ staff, dateRange }) => {
  return (
    <div className="flex flex-col h-full font-sans">
      {/* Summary Stats Row */}
      <div className="bg-white border-b border-slate-200 pb-6 pt-2">
        <div className="grid grid-cols-5 gap-2 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Days</span>
            <span className="text-xl font-bold text-slate-800">{SUMMARY_STATS.days}</span>
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
        {MOCK_DAILY_LOGS.map((log, idx) => {
          const isWeekend = log.day === 'Sat' || log.day === 'Sun';
          const dateColor = log.isPrevMonth ? 'text-slate-300' : 'text-slate-900';
          const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'; // subtle zebra striping

          return (
            <div 
              key={idx} 
              className={`grid grid-cols-6 gap-4 px-4 py-4 border-b border-slate-100 items-center text-sm hover:bg-slate-50 transition-colors ${rowBg} ${log.isPrevMonth ? 'opacity-60' : ''}`}
            >
              {/* Date Column */}
              <div className="col-span-2 flex items-center gap-3">
                <div className={`text-lg font-bold ${log.isPrevMonth ? 'text-slate-300' : 'text-indigo-600'}`}>
                   {log.date}
                </div>
                <div className={`text-xs font-medium ${log.isPrevMonth ? 'text-slate-300' : 'text-slate-500'}`}>
                   {log.day}
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
                {log.regular}
              </div>
              
              <div className={`text-center font-medium ${log.ot !== '--' ? 'text-red-500' : 'text-slate-200'}`}>
                {log.ot}
              </div>

              <div className={`text-center font-medium ${log.isOff ? 'text-slate-200' : 'text-indigo-600'}`}>
                {log.total}
              </div>

              <div className={`text-center font-bold ${log.isOff ? 'text-slate-200' : 'text-green-600'}`}>
                {log.payable}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
