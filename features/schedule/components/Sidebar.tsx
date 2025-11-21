
import React from 'react';
import { Staff } from '../../../types';
import { ROW_HEIGHT, Icons } from '../constants';

interface SidebarHeaderProps {
  allRoles: string[];
  selectedRole: string;
  onRoleChange: (role: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  sortBy: 'name' | 'workload';
  onSortChange: (sort: 'name' | 'workload') => void;
  showWorkingOnly: boolean;
  onToggleWorkingOnly: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  allRoles,
  selectedRole,
  onRoleChange,
  showFilters,
  onToggleFilters,
  sortBy,
  onSortChange,
  showWorkingOnly,
  onToggleWorkingOnly
}) => {
  return (
    <div className="w-64 bg-white flex-shrink-0 border-r border-slate-200 z-40 flex flex-col bg-white">
        {/* Header with Role Filter & Icons */}
        <div className="h-12 flex items-center justify-between px-4 bg-white shrink-0">
            
            {/* Left: Role Selector */}
            <div className="relative group flex-1 max-w-[120px]">
              <select 
                value={selectedRole}
                onChange={(e) => onRoleChange(e.target.value)}
                className="appearance-none w-full bg-transparent hover:bg-slate-50 text-slate-700 text-xs font-bold py-1 pl-2 pr-6 rounded focus:outline-none cursor-pointer transition-colors uppercase tracking-wide"
              >
                <option value="All">All Roles</option>
                {allRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-slate-500">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>

            {/* Right: Sort & Filter Icons */}
            <div className="flex items-center gap-1">
                <button 
                    onClick={onToggleFilters}
                    className={`p-1.5 rounded-md transition-colors ${showFilters ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                >
                    <Icons.Sort />
                </button>
                <button 
                    onClick={onToggleFilters}
                    className={`p-1.5 rounded-md transition-colors ${showFilters ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                >
                    <Icons.Filter />
                </button>
            </div>
        </div>

        {/* Sidebar Sort/Filter Panel (Slide Down) */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-slate-50 border-b border-slate-100 ${showFilters ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-3 text-xs space-y-2 border-t border-slate-100">
                <div className="font-bold text-slate-400 uppercase text-[10px]">Sort Staff By</div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => onSortChange('name')}
                        className={`px-2 py-1 rounded border ${sortBy === 'name' ? 'bg-white border-indigo-200 text-indigo-600 shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-white'}`}
                    >
                        Name
                    </button>
                    <button 
                         onClick={() => onSortChange('workload')}
                         className={`px-2 py-1 rounded border ${sortBy === 'workload' ? 'bg-white border-indigo-200 text-indigo-600 shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-white'}`}
                    >
                        Workload
                    </button>
                </div>
                <div className="flex items-center gap-2 pt-1">
                     <input 
                        type="checkbox" 
                        id="showWorking" 
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                        checked={showWorkingOnly}
                        onChange={onToggleWorkingOnly}
                     />
                     <label htmlFor="showWorking" className="text-slate-600 font-medium">Show working only</label>
                </div>
            </div>
        </div>
    </div>
  );
};

interface SidebarListProps {
  staffList: Staff[];
  onStaffClick?: (staff: Staff) => void;
}

export const SidebarList: React.FC<SidebarListProps> = ({ staffList, onStaffClick }) => {
  return (
    <div className="w-64 bg-white flex-shrink-0 border-r border-slate-200 z-30 flex flex-col">
        {staffList.map((staff) => {
            const utilization = (staff.workedHours / staff.totalHours) * 100;
            const diff = staff.workedHours - staff.totalHours;
            const isOverloaded = diff > 0;
            
            return (
              <div 
                key={staff.id} 
                style={{ height: `${ROW_HEIGHT}px` }} 
                className="border-b border-slate-100 px-4 flex flex-col justify-center gap-0.5 hover:bg-slate-50 transition-colors group cursor-pointer"
                onClick={() => onStaffClick && onStaffClick(staff)}
              >
                  <div className="flex items-start gap-3 mb-0">
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white font-bold shadow-sm ${staff.avatarColor}`}>
                          {staff.initials}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                              <span className="font-medium text-sm text-slate-800 truncate mr-1 group-hover:text-indigo-600 transition-colors">{staff.name}</span>
                              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${staff.isWorking ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                  {staff.isWorking ? 'On' : 'Off'}
                              </span>
                          </div>
                          <span className="text-[10px] text-slate-500 truncate">{staff.role}</span>
                      </div>
                  </div>

                  {/* Workload Stats */}
                  <div className="mt-0.5">
                      <div className="flex items-center justify-between text-[10px] mb-0.5">
                        <span className="text-slate-500 font-medium">Workload</span>
                        <span className={`font-mono font-bold ${isOverloaded ? 'text-red-600' : staff.isWorking ? 'text-slate-700' : 'text-slate-400'}`}>
                            {staff.workedHours.toFixed(1)} / {staff.totalHours}h
                        </span>
                      </div>
                      
                      {/* Enhanced Progress Bar */}
                      <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden w-full">
                          {staff.isWorking && (
                              <>
                                  {/* Main Bar */}
                                  <div 
                                      className={`absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500 ${
                                          isOverloaded 
                                              ? 'bg-red-500' 
                                              : utilization > 90 ? 'bg-amber-400' : 'bg-indigo-500'
                                      }`}
                                      style={{ width: `${Math.min(utilization, 100)}%` }}
                                  ></div>
                                  {/* Striped pattern for overload (Secondary Indicator) */}
                                  {isOverloaded && (
                                      <div 
                                        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
                                        style={{
                                            backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.4) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.4) 50%, rgba(255,255,255,.4) 75%, transparent 75%, transparent)',
                                            backgroundSize: '8px 8px'
                                        }}
                                      ></div>
                                  )}
                              </>
                          )}
                      </div>
                      
                      {/* Deviation Indicator Row */}
                      <div className="flex items-center justify-end mt-0.5 text-[10px] h-3">
                          {staff.isWorking ? (
                              <>
                                {isOverloaded ? (
                                    <span className="text-red-600 font-bold flex items-center gap-1 bg-red-50 px-1.5 rounded-sm border border-red-100/50">
                                        +{Math.abs(diff).toFixed(1)}h Overload
                                    </span>
                                ) : (
                                    <span className="text-emerald-600 font-medium">
                                        {Math.abs(diff).toFixed(1)}h Available
                                    </span>
                                )}
                              </>
                          ) : (
                              <span className="text-slate-400 italic">Off Duty</span>
                          )}
                      </div>
                  </div>
              </div>
            );
        })}
    </div>
  );
};
