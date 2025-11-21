
import React, { useRef } from 'react';
import { Icons } from '../../schedule/constants';

interface AttendanceHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
  currentDate,
  onDateChange,
  onPrevDay,
  onNextDay
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const openDatePicker = () => {
    if (dateInputRef.current) {
        if (typeof dateInputRef.current.showPicker === 'function') {
            dateInputRef.current.showPicker();
        } else {
            dateInputRef.current.focus();
        }
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
        const [year, month, day] = e.target.value.split('-').map(Number);
        onDateChange(new Date(year, month - 1, day));
    }
  };

  const displayDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  const inputValue = currentDate.toISOString().split('T')[0];

  return (
    <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-3 flex items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
            {/* Date Navigation */}
            <div className="flex items-center gap-0 bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm overflow-hidden">
                <button 
                    className="px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 border-r border-slate-100 transition-colors"
                    onClick={() => onDateChange(new Date())}
                >
                    Today
                </button>
                <div className="flex items-center px-2">
                     <button onClick={onPrevDay} className="p-1 text-slate-500 hover:bg-slate-50 rounded-md hover:text-indigo-600 transition-colors">
                        <Icons.ChevronLeft />
                     </button>
                     
                     {/* Date Picker Trigger */}
                     <div className="relative group mx-2">
                        <button 
                            onClick={openDatePicker}
                            className="text-sm font-bold text-slate-800 px-2 py-1 hover:text-indigo-600 hover:bg-slate-50 rounded cursor-pointer flex items-center justify-center gap-1 min-w-[130px]"
                        >
                            <span>{displayDate}</span>
                            <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <input 
                            type="date" 
                            ref={dateInputRef}
                            value={inputValue}
                            onChange={handleDateInputChange}
                            className="absolute top-full left-0 opacity-0 w-0 h-0 pointer-events-none" 
                        />
                    </div>

                     <button onClick={onNextDay} className="p-1 text-slate-500 hover:bg-slate-50 rounded-md hover:text-indigo-600 transition-colors">
                        <Icons.ChevronRight />
                     </button>
                </div>
            </div>
        </div>

        {/* Right Actions/Filter Placeholder */}
        <div className="flex items-center gap-2">
            <div className="relative">
                 <input 
                    type="text" 
                    placeholder="Search staff..." 
                    className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all w-64"
                 />
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Icons.Search />
                </div>
            </div>
             <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                <Icons.Filter />
             </button>
        </div>
    </div>
  );
};
