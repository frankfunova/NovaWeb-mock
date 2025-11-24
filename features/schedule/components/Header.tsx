
import React, { useState, useRef } from 'react';
import { Icons, TASK_LABELS, STATUS_STYLES } from '../constants';
import { TaskType, TaskStatus, FilterState, Staff } from '../../../types';

interface HeaderProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  staffList: Staff[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  filters, 
  onFilterChange, 
  staffList,
  currentDate,
  onDateChange,
  onPrevDay,
  onNextDay
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onFilterChange({ 
        ...filters, 
        types: val === 'all' ? [] : [val as TaskType] 
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onFilterChange({ 
        ...filters, 
        statuses: val === 'all' ? [] : [val as TaskStatus] 
    });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onFilterChange({
        ...filters,
        assigneeId: val === 'all' ? null : val
    });
  };

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
  const activeCount = filters.types.length + filters.statuses.length + (filters.assigneeId ? 1 : 0);

  return (
    <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky top-0 z-40 relative flex flex-col transition-colors duration-200">
      <div className="h-16 flex items-center justify-between px-6 relative z-50 bg-white dark:bg-slate-900 gap-8">
        
        {/* LEFT: Date Navigation */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm">
            <button className="px-3 py-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors">Today</button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={onPrevDay} className="p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md"><Icons.ChevronLeft /></button>
            
            <div className="relative group">
                <button 
                    onClick={openDatePicker}
                    className="text-sm font-semibold text-slate-700 dark:text-slate-200 px-2 w-28 text-center hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded cursor-pointer flex items-center justify-center gap-1"
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

            <button onClick={onNextDay} className="p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md"><Icons.ChevronRight /></button>
          </div>
        </div>

        {/* MIDDLE: Search Box */}
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative group w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors">
              <Icons.Search />
            </div>
            <input 
              type="text" 
              value={filters.searchQuery}
              onChange={handleSearch}
              placeholder="Search tasks, locations, or notes..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm text-slate-800 dark:text-slate-200 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* RIGHT: Filter */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${activeCount > 0 ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600'}`}>
                {activeCount > 0 ? activeCount : '0'}
            </div>

            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all border ${isFilterOpen ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-700 dark:border-slate-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
                <Icons.Filter />
                <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Filter Row */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 ${isFilterOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 py-3 flex items-center gap-4 overflow-x-auto hide-scrollbar">
            
            <div className="relative min-w-[160px]">
                <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1 ml-1">Status</label>
                <select 
                    className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium shadow-sm"
                    value={filters.statuses[0] || 'all'}
                    onChange={handleStatusChange}
                >
                    <option value="all">All Statuses</option>
                    {Object.keys(STATUS_STYLES).map(s => (
                        <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute bottom-2.5 right-3 flex items-center text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

            <div className="relative min-w-[160px]">
                <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1 ml-1">Task Type</label>
                <select 
                    className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium shadow-sm"
                    value={filters.types[0] || 'all'}
                    onChange={handleTypeChange}
                >
                    <option value="all">All Types</option>
                    {Object.entries(TASK_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute bottom-2.5 right-3 flex items-center text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

            <div className="relative min-w-[160px]">
                <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1 ml-1">Assignee</label>
                <select 
                    className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium shadow-sm"
                    value={filters.assigneeId || 'all'}
                    onChange={handleAssigneeChange}
                >
                    <option value="all">All Staff</option>
                    <option value="unassigned">Unassigned</option>
                    {staffList.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute bottom-2.5 right-3 flex items-center text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

             <div className="relative min-w-[160px] opacity-60 cursor-not-allowed" title="Not available">
                <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1 ml-1">Property</label>
                <div className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-sm rounded-lg px-3 py-2 font-medium select-none">
                    All Properties
                </div>
            </div>

            {activeCount > 0 && (
                <button 
                    onClick={() => onFilterChange({ ...filters, types: [], statuses: [], assigneeId: null })}
                    className="mt-5 text-xs font-bold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded transition-colors whitespace-nowrap"
                >
                    Clear Filters
                </button>
            )}

        </div>
      </div>
    </header>
  );
};
