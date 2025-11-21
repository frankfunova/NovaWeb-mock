
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { api } from '../../services/api';
import { AttendanceRecord, Staff, Department, Position, AttendanceStatus, ViewMode } from '../../types';
import { AttendanceTable, SortConfig } from './components/AttendanceTable';
import { Flyout } from '../../components/Flyout';
import { StaffDetail } from '../../features/staff/components/StaffDetail';
import { TimesheetDetail } from './components/TimesheetDetail';
import { Icons } from '../../constants';

// Filter Options
const DEPARTMENTS: Department[] = [
    'Toronto Office', 
    'Orlando Operation Team', 
    'Offshore CS Team', 
    'Development Team'
];

const POSITIONS: Position[] = [
    'Maintenance', 
    'Inspector', 
    'Guest Service', 
    'Owner Service', 
    'Office Admin', 
    'Accountant', 
    'Dispatcher', 
    'Cleaner'
];

const STATUSES: AttendanceStatus[] = [
    'Working', 
    'In break', 
    'Shift End', 
    'Off duty'
];

// Helper: Get current Month Range
const getMonthRange = (d: Date) => {
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return { start, end };
};

// Helper Component for Filters
interface FilterDropdownProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter(s => s !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const handleSelectAll = () => {
        if (selected.length === options.length) {
            onChange([]);
        } else {
            onChange([...options]);
        }
    };

    const buttonLabel = useMemo(() => {
        if (selected.length === 0) return `All ${label}s`;
        if (selected.length === 1) return selected[0];
        if (selected.length === 2) return selected.join(', ');
        return `${label} (${selected.length})`;
    }, [selected, label]);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`px-3 py-1.5 bg-white border rounded-md text-sm flex items-center gap-2 whitespace-nowrap shadow-sm transition-colors max-w-[200px] ${selected.length > 0 ? 'border-indigo-200 text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                title={selected.length > 0 ? selected.join(', ') : `All ${label}s`}
            >
                <span className="truncate block text-left">{buttonLabel}</span>
                <svg className={`w-3 h-3 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white shadow-xl rounded-lg border border-slate-200 z-50 p-2 max-h-[320px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                     <div className="mb-2 pb-2 border-b border-slate-100 flex justify-between items-center px-2 pt-1">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                            <input 
                                type="checkbox" 
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                                checked={selected.length === options.length && options.length > 0}
                                onChange={handleSelectAll}
                            />
                            Select All
                        </label>
                        {selected.length > 0 && (
                            <button onClick={() => onChange([])} className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-wider">Clear</button>
                        )}
                     </div>
                     <div className="space-y-0.5">
                        {options.map(opt => (
                            <label key={opt} className="flex items-center gap-2.5 p-2 hover:bg-slate-50 rounded-md cursor-pointer select-none transition-colors group">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${selected.includes(opt) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white group-hover:border-indigo-400'}`}>
                                    {selected.includes(opt) && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <span className={`text-sm truncate ${selected.includes(opt) ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>{opt}</span>
                                <input type="checkbox" className="hidden" checked={selected.includes(opt)} onChange={() => toggleOption(opt)} />
                            </label>
                        ))}
                     </div>
                </div>
            )}
        </div>
    );
};

export const AttendancePage: React.FC = () => {
  // View State
  const [viewMode, setViewMode] = useState<ViewMode>('daily');

  // Data State
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Date State
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 10, 19)); // Default Nov 19
  const [dateRange, setDateRange] = useState<{start: Date, end: Date}>(() => {
      // Default to "This Month" logic for Timesheet
      const { start, end } = getMonthRange(new Date(2025, 10, 19));
      return { start, end };
  });

  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Sort State
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Fetch Data Logic
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (viewMode === 'daily') {
            const data = await api.fetchAttendance(currentDate);
            setRecords(data);
        } else {
            const data = await api.fetchTimesheetSummary(dateRange.start, dateRange.end);
            setRecords(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [currentDate, dateRange, viewMode]);

  // Handlers
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    // If in timesheet mode, selecting a specific date updates the range to that month
    if (viewMode === 'timesheet') {
        const { start, end } = getMonthRange(date);
        setDateRange({ start, end });
    }
  };

  const shiftDate = (direction: number) => {
    if (viewMode === 'daily') {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + direction);
        setCurrentDate(newDate);
    } else {
        // Shift range by month for timesheet
        const newStart = new Date(dateRange.start);
        newStart.setMonth(newStart.getMonth() + direction);
        // Recalculate end of month
        const newEnd = new Date(newStart.getFullYear(), newStart.getMonth() + 1, 0);
        setDateRange({ start: newStart, end: newEnd });
        // Also update current date anchor to start of new month
        setCurrentDate(newStart);
    }
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
        // Treat input as local date
        const [year, month, day] = e.target.value.split('-').map(Number);
        // Note: Month is 1-indexed in split string, but 0-indexed in Date constructor
        handleDateChange(new Date(year, month - 1, day));
    }
  };

  const handleRowClick = (record: AttendanceRecord) => {
      setSelectedRecord(record);
      setIsFlyoutOpen(true);
  };

  const handleSort = (key: string) => {
      setSortConfig(current => {
          if (current?.key === key) {
              return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
          }
          return { key, direction: 'asc' };
      });
  };

  const handleViewModeChange = (mode: ViewMode) => {
      setViewMode(mode);
      setSortConfig(null);
      
      // Reset Date Range to Month if switching to Timesheet
      if (mode === 'timesheet') {
          const { start, end } = getMonthRange(currentDate);
          setDateRange({ start, end });
      }
  };

  // Filter Logic
  const filteredRecords = useMemo(() => {
      return records.filter(record => {
        const query = searchQuery.toLowerCase();
        const matchSearch = searchQuery === '' || 
            record.user.fullName.toLowerCase().includes(query) ||
            record.user.department.toLowerCase().includes(query) ||
            record.user.position.toLowerCase().includes(query);
        
        const matchDept = selectedDepartments.length === 0 || selectedDepartments.includes(record.user.department);
        const matchPos = selectedPositions.length === 0 || selectedPositions.includes(record.user.position);
        // Only filter by status in daily mode
        const matchStatus = viewMode === 'timesheet' || selectedStatuses.length === 0 || selectedStatuses.includes(record.status);

        return matchSearch && matchDept && matchPos && matchStatus;
    });
  }, [records, searchQuery, selectedDepartments, selectedPositions, selectedStatuses, viewMode]);

  // Sort Logic
  const sortedRecords = useMemo(() => {
      if (!sortConfig) return filteredRecords;

      return [...filteredRecords].sort((a, b) => {
          let aValue: any;
          let bValue: any;

          switch (sortConfig.key) {
              case 'name':
                  aValue = a.user.fullName;
                  bValue = b.user.fullName;
                  break;
              case 'department':
                  aValue = a.user.department;
                  bValue = b.user.department;
                  break;
              case 'position':
                  aValue = a.user.position;
                  bValue = b.user.position;
                  break;
              case 'status':
                  aValue = a.status;
                  bValue = b.status;
                  break;
              case 'clockIn':
                  aValue = a.firstClockInAt ? new Date(a.firstClockInAt).getTime() : 0;
                  bValue = b.firstClockInAt ? new Date(b.firstClockInAt).getTime() : 0;
                  break;
              case 'clockOut':
                  aValue = a.finalClockOutAt ? new Date(a.finalClockOutAt).getTime() : 0;
                  bValue = b.finalClockOutAt ? new Date(b.finalClockOutAt).getTime() : 0;
                  break;
              case 'totalHours':
                  aValue = a.totalWorkingDurationSec;
                  bValue = b.totalWorkingDurationSec;
                  break;
              default:
                  return 0;
          }

          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      });
  }, [filteredRecords, sortConfig]);

  // Helper to convert AttendanceRecord to Staff for the detail view
  const getStaffFromRecord = (record: AttendanceRecord): Staff => {
      const workingHours = record.totalWorkingDurationSec ? record.totalWorkingDurationSec / 3600 : 0;
      
      return {
          id: record.userId,
          name: record.user.fullName,
          initials: record.user.initials,
          role: record.user.position !== '--' ? record.user.position : 'Staff',
          avatarColor: record.user.avatarColor,
          totalHours: 8, // Mock
          workedHours: workingHours,
          isWorking: record.status === 'Working',
          shiftStart: 9,
          shiftEnd: 17
      };
  };
  
  const staffHeader = selectedRecord ? (
    <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${selectedRecord.user.avatarColor}`}>
            {selectedRecord.user.initials}
        </div>
        <div>
            <div className="text-base font-bold text-slate-900 leading-tight">{selectedRecord.user.fullName}</div>
            <div className="text-xs text-slate-500 font-normal">{selectedRecord.user.position} • {selectedRecord.user.department}</div>
        </div>
    </div>
  ) : null;

  const StatsPill = ({ value, color }: { value: string | number, color: string }) => (
      <span className={`text-xs font-bold ${color} px-1`}>{value}</span>
  );

  const displayDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  // Calculate Timesheet Stats
  const timesheetStats = useMemo(() => {
      const totalSeconds = filteredRecords.reduce((acc, r) => acc + r.totalWorkingDurationSec, 0);
      const totalHours = totalSeconds / 3600;
      const avgHours = filteredRecords.length > 0 ? totalHours / filteredRecords.length : 0;
      return {
          staffCount: filteredRecords.length,
          totalHours: totalHours.toFixed(1),
          avgHours: avgHours.toFixed(1)
      };
  }, [filteredRecords]);

  const inputValue = currentDate.toISOString().split('T')[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        
        {/* Toolbar (Row 1) */}
        <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-3 flex items-center justify-between gap-6">
            
            <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-3">
                    {/* View Selector */}
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors group">
                        <div className="grid grid-cols-2 gap-0.5 w-4 h-4 opacity-50 group-hover:opacity-100">
                            <div className="bg-slate-800 rounded-[1px]"></div><div className="bg-slate-800 rounded-[1px]"></div>
                            <div className="bg-slate-800 rounded-[1px]"></div><div className="bg-slate-800 rounded-[1px]"></div>
                        </div>
                        <span className="text-sm font-bold text-slate-800">All Attendance</span>
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>

                     {/* View Mode Toggle */}
                     <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                        <button 
                            onClick={() => handleViewModeChange('daily')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'daily' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Daily Report
                        </button>
                        <button 
                             onClick={() => handleViewModeChange('timesheet')}
                             className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'timesheet' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Timesheet
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search staff, department, position..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                </div>

                {/* Stats Inline */}
                <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500 select-none hidden xl:flex">
                    {viewMode === 'daily' ? (
                        <>
                            <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
                                <span className="text-xs text-slate-400 uppercase font-semibold">Total</span>
                                <StatsPill value={records.length} color="text-indigo-600" />
                            </div>
                            <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
                                <span className="text-xs text-slate-400 uppercase font-semibold">Working</span>
                                <StatsPill value={records.filter(r => r.status === 'Working').length} color="text-emerald-600" />
                            </div>
                            <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
                                <span className="text-xs text-slate-400 uppercase font-semibold">Break</span>
                                <StatsPill value={records.filter(r => r.status === 'In break').length} color="text-orange-600" />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-400 uppercase font-semibold">Off</span>
                                <StatsPill value={records.filter(r => r.status === 'Off duty').length} color="text-slate-600" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
                                <span className="text-xs text-slate-400 uppercase font-semibold">Staff</span>
                                <StatsPill value={timesheetStats.staffCount} color="text-indigo-600" />
                            </div>
                            <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
                                <span className="text-xs text-slate-400 uppercase font-semibold">Total Hrs</span>
                                <StatsPill value={timesheetStats.totalHours} color="text-emerald-600" />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-400 uppercase font-semibold">Avg Hrs</span>
                                <StatsPill value={timesheetStats.avgHours} color="text-orange-600" />
                            </div>
                        </>
                    )}
                    <svg className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                 <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-md transition-all shadow-sm bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    Export
                </button>
            </div>
        </div>

        {/* Filter Bar (Row 2) */}
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2 min-h-[56px]">
            
            {/* Date Selection - Left Side */}
            <div className="flex items-center gap-3 mr-4">
                 <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                     {viewMode === 'daily' ? 'Report date' : 'Report period'}:
                 </span>
                 <div className="flex items-center bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
                     <button onClick={() => shiftDate(-1)} className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-colors border-r border-slate-100">
                        <Icons.ChevronLeft />
                     </button>
                     
                     <div className="relative group">
                        <button 
                            onClick={openDatePicker}
                            className="text-sm font-semibold text-slate-800 px-3 py-1 hover:text-indigo-600 hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-2 min-w-[140px]"
                        >
                            <span>
                                {viewMode === 'daily' 
                                    ? displayDate 
                                    : `${dateRange.start.toLocaleDateString('en-US', {month:'short', day:'numeric'})} - ${dateRange.end.toLocaleDateString('en-US', {month:'short', day:'numeric'})}`
                                }
                            </span>
                            {viewMode === 'daily' && (
                                <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            )}
                        </button>
                        {/* Hidden Date Picker input always available for easy navigation via Calendar */}
                        <input 
                            type="date" 
                            ref={dateInputRef}
                            value={inputValue}
                            onChange={handleDateInputChange}
                            className="absolute top-full left-0 opacity-0 w-0 h-0 pointer-events-none" 
                        />
                    </div>

                     <button onClick={() => shiftDate(1)} className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-colors border-l border-slate-100">
                        <Icons.ChevronRight />
                     </button>
                 </div>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 mx-2"></div>

            {/* Filters */}
            <FilterDropdown 
                label="Department" 
                options={DEPARTMENTS as string[]} 
                selected={selectedDepartments} 
                onChange={setSelectedDepartments} 
            />
            <FilterDropdown 
                label="Position" 
                options={POSITIONS as string[]} 
                selected={selectedPositions} 
                onChange={setSelectedPositions} 
            />
            {viewMode === 'daily' && (
                <FilterDropdown 
                    label="Status" 
                    options={STATUSES as string[]} 
                    selected={selectedStatuses} 
                    onChange={setSelectedStatuses} 
                />
            )}

            <div className="flex-1"></div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                 <button className="p-1.5 text-slate-500 hover:bg-white hover:text-indigo-600 rounded border border-transparent hover:border-slate-200 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                 </button>
                 <button className="p-1.5 text-slate-500 hover:bg-white hover:text-indigo-600 rounded border border-transparent hover:border-slate-200 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                 </button>
            </div>
        </div>

        <div className="flex-1 overflow-auto bg-white custom-scrollbar">
            <AttendanceTable 
                records={sortedRecords} 
                onRowClick={handleRowClick}
                sortConfig={sortConfig}
                onSort={handleSort}
                viewMode={viewMode}
            />
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>Showing {filteredRecords.length} records</span>
            </div>
        </div>

        <Flyout
            isOpen={isFlyoutOpen}
            onClose={() => setIsFlyoutOpen(false)}
            title={staffHeader}
            side="right"
        >
            {selectedRecord && (
                viewMode === 'daily' ? (
                    <StaffDetail 
                        staff={getStaffFromRecord(selectedRecord)} 
                        tasks={[]} 
                    />
                ) : (
                    <TimesheetDetail
                        staff={getStaffFromRecord(selectedRecord)}
                        dateRange={dateRange}
                    />
                )
            )}
        </Flyout>
    </div>
  );
};
