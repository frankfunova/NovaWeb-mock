
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { SidebarHeader, SidebarList } from './components/Sidebar';
import { TaskCard } from './components/TaskCard';
import { UnassignedGroupCard } from './components/UnassignedGroupCard';
import { UnassignedQueueModal } from './components/UnassignedQueueModal';
import { Flyout } from '../../components/Flyout';
import { TaskForm } from '../../features/tasks/components/TaskForm';
import { TaskDetail } from '../../features/tasks/components/TaskDetail';
import { StaffDetail } from '../../features/staff/components/StaffDetail';
import { BulkActionBar } from './components/BulkActionBar';
import { TIME_SLOTS, ROW_HEIGHT, START_HOUR, HOURS_COUNT, Icons } from './constants';
import { Task, FilterState, TaskStatus, Staff, TaskType } from '../../types';
import { api } from '../../services/api';

export const SchedulePage: React.FC = () => {
  // Data State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Date State
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 10, 19)); // Nov 19, 2025

  // Updated Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    types: [],
    statuses: [],
    assigneeId: null
  });

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('All');
  
  // Sidebar Controls State
  const [sidebarShowFilters, setSidebarShowFilters] = useState(false);
  const [sidebarSortBy, setSidebarSortBy] = useState<'name' | 'workload'>('name');
  const [sidebarShowWorkingOnly, setSidebarShowWorkingOnly] = useState(true);

  // Flyout State
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Partial<Task> | null>(null);
  const [isNewTask, setIsNewTask] = useState(false);

  // Staff Detail Flyout State
  const [isStaffFlyoutOpen, setIsStaffFlyoutOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // Bulk Selection State
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());

  // Queue Modal State
  const [queueModalType, setQueueModalType] = useState<TaskType | null>(null);

  // -- Initial Data Fetching --
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch in parallel
        const [fetchedStaff, fetchedTasks] = await Promise.all([
          api.fetchStaff(),
          api.fetchTasks(currentDate)
        ]);
        setStaffList(fetchedStaff);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Failed to fetch schedule data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [currentDate]);

  // -- Derived Data --
  const uniqueRoles = useMemo(() => {
    return Array.from(new Set(staffList.map(s => s.role))).sort();
  }, [staffList]);

  const visibleStaff = useMemo(() => {
    // 1. Filter by Role
    let staff = selectedRole === 'All' 
      ? staffList 
      : staffList.filter(s => s.role === selectedRole);
    
    if (sidebarShowWorkingOnly) {
        // staff = staff.filter(s => s.isWorking); 
    }

    // 3. Calculate Stats
    const staffWithStats = staff.map(s => {
      const staffTasks = tasks.filter(t => t.staffId === s.id);
      const workedHours = staffTasks.reduce((acc, t) => acc + t.duration, 0);
      return { ...s, workedHours };
    });

    // 4. Sort
    return staffWithStats.sort((a, b) => {
        if (sidebarSortBy === 'workload') {
            return b.workedHours - a.workedHours;
        }
        return a.name.localeCompare(b.name);
    });
  }, [selectedRole, tasks, sidebarSortBy, sidebarShowWorkingOnly, staffList]);

  // -- Date Handlers --
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const shiftDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  // -- Drag and Drop Handlers --
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    if (selectedTaskIds.size > 0) setSelectedTaskIds(new Set());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = useCallback(async (e: React.DragEvent, staffId: string) => {
    e.preventDefault();
    
    if (!draggedTaskId) return;

    const targetStaff = staffList.find(s => s.id === staffId);
    
    if (targetStaff && !targetStaff.isWorking) {
       if (!window.confirm(`${targetStaff.name} is marked as OFF today. Are you sure you want to schedule this task?`)) {
         setDraggedTaskId(null);
         return;
       }
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    
    const hourOffset = percentage * HOURS_COUNT;
    const newStartTime = START_HOUR + hourOffset;
    const snappedStartTime = Math.round(newStartTime * 4) / 4;

    // Optimistic Update
    const updatedTasks = tasks.map(t => {
      if (t.id === draggedTaskId) {
        return {
          ...t,
          staffId: staffId,
          startTime: Math.max(START_HOUR, Math.min(START_HOUR + HOURS_COUNT - t.duration, snappedStartTime)),
          status: staffId === 'unassigned' ? 'pending' : t.status as TaskStatus
        };
      }
      return t;
    });
    setTasks(updatedTasks);
    setDraggedTaskId(null);

    // API Call (Fire and forget for prototype, but in real app handle error)
    const taskToUpdate = updatedTasks.find(t => t.id === draggedTaskId);
    if (taskToUpdate) await api.updateTask(taskToUpdate);

  }, [draggedTaskId, staffList, tasks]);

  // -- Flyout & Task Management --
  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsNewTask(false);
    setIsFlyoutOpen(true);
    setIsStaffFlyoutOpen(false);
  };

  const openCreateTask = (staffId: string, hour: number) => {
    const newTask: Partial<Task> = {
      title: '',
      staffId,
      startTime: hour,
      duration: 1,
      plannedStartTime: hour,
      plannedDuration: 1,
      type: 'maintenance',
      status: 'pending'
    };
    setSelectedTask(newTask);
    setIsNewTask(true);
    setIsFlyoutOpen(true);
    setIsStaffFlyoutOpen(false);
  };

  const handleStaffClick = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsStaffFlyoutOpen(true);
    setIsFlyoutOpen(false);
  };

  const handleSaveTask = async (task: Task) => {
    if (isNewTask) {
      const newTask = { ...task, id: Math.random().toString(36).substr(2, 9) };
      setTasks([...tasks, newTask]);
      await api.createTask(newTask);
    } else {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
      await api.updateTask(task);
    }
    setIsFlyoutOpen(false);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== taskId));
      setIsFlyoutOpen(false);
      await api.deleteTask(taskId);
    }
  };

  // -- Bulk Action Handlers --
  const toggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds(prev => {
        const next = new Set(prev);
        if (next.has(taskId)) next.delete(taskId);
        else next.add(taskId);
        return next;
    });
  };

  const handleBulkAssign = (staffId: string) => {
      setTasks(prev => prev.map(t => {
          if (selectedTaskIds.has(t.id)) return { ...t, staffId: staffId };
          return t;
      }));
      setSelectedTaskIds(new Set());
      // In real app: await api.bulkUpdate(...)
  };

  const handleBulkStatusChange = (status: TaskStatus) => {
      setTasks(prev => prev.map(t => {
          if (selectedTaskIds.has(t.id)) return { ...t, status: status };
          return t;
      }));
      setSelectedTaskIds(new Set());
  };

  const handleBulkDelete = () => {
      if (window.confirm(`Are you sure you want to delete ${selectedTaskIds.size} tasks?`)) {
          setTasks(prev => prev.filter(t => !selectedTaskIds.has(t.id)));
          setSelectedTaskIds(new Set());
      }
  };

  const handleBulkAssignFromModal = (taskIds: string[], staffId: string) => {
      setTasks(prev => prev.map(t => {
          if (taskIds.includes(t.id)) return { ...t, staffId };
          return t;
      }));
  };

  // Current time line
  const currentTime = 11 + (16 / 60); 
  const currentTimePercent = ((currentTime - START_HOUR) / HOURS_COUNT) * 100;

  // Filter Tasks Logic
  const filteredTasks = tasks.filter(t => {
    const matchSearch = !filters.searchQuery || 
      t.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
      t.location.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(filters.searchQuery.toLowerCase()));

    const matchType = filters.types.length === 0 || filters.types.includes(t.type);
    const matchStatus = filters.statuses.length === 0 || filters.statuses.includes(t.status);

    let matchAssignee = true;
    if (filters.assigneeId === 'unassigned') {
        matchAssignee = t.staffId === 'unassigned' || t.staffId === null;
    } else if (filters.assigneeId) {
        matchAssignee = t.staffId === filters.assigneeId;
    }

    return matchSearch && matchType && matchStatus && matchAssignee;
  });

  // Group Unassigned Tasks
  const unassignedTasks = filteredTasks.filter(t => t.staffId === 'unassigned' || t.staffId === null);
  const unassignedGroups = useMemo(() => {
      const groups: Partial<Record<TaskType, { count: number; totalHours: number }>> = {};
      unassignedTasks.forEach(t => {
          if (!groups[t.type]) {
              groups[t.type] = { count: 0, totalHours: 0 };
          }
          groups[t.type]!.count += 1;
          groups[t.type]!.totalHours += t.duration; 
      });
      return groups;
  }, [unassignedTasks]);

  const totalUnassignedHours = unassignedTasks.reduce((acc, t) => acc + t.duration, 0);
  const hasUnassigned = unassignedTasks.length > 0;

  const staffHeader = selectedStaff ? (
    <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${selectedStaff.avatarColor}`}>
            {selectedStaff.initials}
        </div>
        <div>
            <div className="text-base font-bold text-slate-900 leading-tight">{selectedStaff.name}</div>
            <div className="text-xs text-slate-500 font-normal">{selectedStaff.role}</div>
        </div>
    </div>
  ) : null;

  const getDisplayTask = () => {
      if (!selectedTask) return null;
      return {
          ...selectedTask,
          description: selectedTask.description || selectedTask.notes || '',
          propertyName: selectedTask.propertyName || selectedTask.location || '',
          scheduledAt: selectedTask.scheduledAt || new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), Math.floor(selectedTask.startTime || 9), ((selectedTask.startTime || 9)%1)*60).toISOString()
      } as Task;
  };

  if (isLoading) {
      return (
          <div className="flex-1 flex items-center justify-center bg-white text-slate-500 gap-3">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading schedule...</span>
          </div>
      );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
        <Header 
            filters={filters} 
            onFilterChange={setFilters} 
            staffList={staffList}
            currentDate={currentDate}
            onDateChange={handleDateChange}
            onPrevDay={() => shiftDate(-1)}
            onNextDay={() => shiftDate(1)}
        />

        <div className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar bg-slate-50/50">
            <div className="flex flex-col min-h-full min-w-fit pb-24"> 
                
                {/* Unassigned Queue Row */}
                <div className="flex border-b border-slate-200 bg-slate-100/80 backdrop-blur-sm flex-shrink-0 z-30 min-h-[90px]">
                    <div className="w-64 flex-shrink-0 border-r border-slate-200 p-4 flex flex-col justify-center group bg-slate-50">
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className={`p-2 rounded-lg shadow-sm border transition-colors duration-300 ${hasUnassigned ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-slate-200 text-slate-600'}`}>
                                <Icons.Queue />
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-900 transition-colors duration-300">
                                    UNASSIGNED
                                </div>
                                <div className="text-sm font-bold text-slate-800 leading-tight">{unassignedTasks.length} Tasks</div>
                                <div className="text-[10px] font-medium text-slate-400">{totalUnassignedHours.toFixed(1)}h Est. Duration</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-3 flex gap-4 items-center overflow-x-auto custom-scrollbar">
                        {Object.entries(unassignedGroups).map(([type, stats]) => {
                            const s = stats as { count: number; totalHours: number };
                            return (
                                <UnassignedGroupCard
                                    key={type}
                                    type={type as TaskType}
                                    count={s.count}
                                    totalHours={s.totalHours}
                                    onClick={() => setQueueModalType(type as TaskType)}
                                />
                            );
                        })}
                        {unassignedTasks.length === 0 && (
                            <div className="text-sm text-slate-400 italic px-4 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                All tasks assigned!
                            </div>
                        )}
                    </div>
                </div>

                {/* STICKY HEADER */}
                <div className="sticky top-0 z-40 flex bg-white border-b border-slate-200 shadow-sm">
                        <SidebarHeader 
                            allRoles={uniqueRoles}
                            selectedRole={selectedRole}
                            onRoleChange={setSelectedRole}
                            showFilters={sidebarShowFilters}
                            onToggleFilters={() => setSidebarShowFilters(!sidebarShowFilters)}
                            sortBy={sidebarSortBy}
                            onSortChange={setSidebarSortBy}
                            showWorkingOnly={sidebarShowWorkingOnly}
                            onToggleWorkingOnly={() => setSidebarShowWorkingOnly(!sidebarShowWorkingOnly)}
                        />
                        <div className="flex-1 flex items-center">
                        {TIME_SLOTS.map((slot, index) => (
                            <div 
                            key={slot.value}
                            className={`flex-1 h-12 flex justify-center items-center text-[10px] font-bold text-slate-500 uppercase border-r border-slate-100 select-none ${index === TIME_SLOTS.length - 1 ? 'border-none' : ''}`}
                            >
                            {slot.label}
                            </div>
                        ))}
                        </div>
                </div>

                {/* GRID */}
                <div className="flex flex-1 min-h-0">
                    <SidebarList 
                        staffList={visibleStaff} 
                        onStaffClick={handleStaffClick}
                    />
                    <div className="flex-1 flex flex-col min-w-0 relative bg-white">
                        <div className="relative flex-1">
                            <div 
                                className="absolute top-0 bottom-0 w-px bg-red-500 z-30 pointer-events-none flex flex-col items-center"
                                style={{ left: `${currentTimePercent}%` }}
                            >
                                    <div className="w-2 h-2 bg-red-500 rounded-full -mt-1"></div>
                                    <div className="bg-red-500 text-white text-[9px] font-bold px-1 rounded mt-0.5 whitespace-nowrap shadow-sm">
                                    11:16
                                    </div>
                            </div>

                            {visibleStaff.map((staff) => (
                                <div 
                                    key={staff.id} 
                                    style={{ height: `${ROW_HEIGHT}px` }} 
                                    className={`relative border-b border-slate-100 group/row ${!staff.isWorking ? 'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZjhmOGY4Ii8+CjxwYXRoIGQ9Ik0wIDhMOCAwTTggOEwwIDAiIHN0cm9rZT0iI2UyZTJlMiIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==")]' : 'bg-white'}`}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, staff.id)}
                                >
                                    <div className="absolute inset-0 flex">
                                        {TIME_SLOTS.map((slot, index) => {
                                            const isShiftHour = slot.value >= staff.shiftStart && slot.value < staff.shiftEnd;
                                            const isWorkingDay = staff.isWorking;
                                            let bgClass = '';
                                            if (!isWorkingDay) bgClass = 'bg-transparent'; 
                                            else if (staff.id !== 'unassigned' && !isShiftHour) bgClass = 'bg-slate-50/70';
                                            else bgClass = 'bg-transparent';

                                            return (
                                                <div
                                                    key={slot.value}
                                                    className={`flex-1 border-r border-slate-100 h-full ${bgClass} ${index === TIME_SLOTS.length - 1 ? 'border-none' : ''} relative group/slot`}
                                                >
                                                    {staff.isWorking && (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-opacity z-0">
                                                        <button 
                                                        onClick={() => openCreateTask(staff.id, slot.value)}
                                                        className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center shadow-sm transform scale-75 group-hover/slot:scale-100 transition-transform"
                                                        title="Add task here"
                                                        >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                                        </button>
                                                    </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {filteredTasks.filter(t => t.staffId === staff.id).map(task => (
                                        <TaskCard 
                                            key={task.id} 
                                            task={task} 
                                            isSelected={selectedTaskIds.has(task.id)}
                                            onDragStart={handleDragStart} 
                                            onClick={openTaskDetails}
                                            onToggleSelect={toggleTaskSelection}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <BulkActionBar 
            selectedCount={selectedTaskIds.size}
            staffList={staffList}
            onAssign={handleBulkAssign}
            onStatusChange={handleBulkStatusChange}
            onDelete={handleBulkDelete}
            onClear={() => setSelectedTaskIds(new Set())}
        />

        <Flyout
            isOpen={isFlyoutOpen}
            onClose={() => setIsFlyoutOpen(false)}
            title={isNewTask ? "New Task" : "Task Details"}
            side="right"
            noPadding={!isNewTask}
        >
            {isNewTask ? (
                <TaskForm 
                    initialTask={selectedTask}
                    staffList={staffList}
                    onSave={handleSaveTask}
                    onDelete={handleDeleteTask}
                    onCancel={() => setIsFlyoutOpen(false)}
                    isNew={isNewTask}
                />
            ) : (
                selectedTask && <TaskDetail task={getDisplayTask()!} />
            )}
        </Flyout>

        <Flyout
            isOpen={isStaffFlyoutOpen}
            onClose={() => setIsStaffFlyoutOpen(false)}
            title={staffHeader}
            side="right" 
        >
            {selectedStaff && (
            <StaffDetail 
                staff={selectedStaff} 
                tasks={tasks.filter(t => t.staffId === selectedStaff.id)} 
            />
            )}
        </Flyout>

        <UnassignedQueueModal 
            isOpen={!!queueModalType}
            onClose={() => setQueueModalType(null)}
            type={queueModalType || 'maintenance'}
            tasks={unassignedTasks.filter(t => t.type === queueModalType)}
            staffList={staffList}
            onAssign={handleBulkAssignFromModal}
        />
    </div>
  );
};
