
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { SidebarHeader, SidebarList } from './components/Sidebar';
import { TaskCard } from './components/TaskCard';
import { UnassignedGroupCard } from './components/UnassignedGroupCard';
import { UnassignedQueueModal } from './components/UnassignedQueueModal';
import { Flyout } from '../../components/Flyout';
import { TaskCreateForm } from '../../features/tasks/components/TaskCreateForm';
import { TaskDetail } from '../../features/tasks/components/TaskDetail';
import { StaffDetail } from '../../features/staff/components/StaffDetail';
import { BulkActionBar } from './components/BulkActionBar';
import { TIME_SLOTS, ROW_HEIGHT, START_HOUR, HOURS_COUNT, Icons, TASK_LABELS } from './constants';
import { Task, FilterState, TaskStatus, Staff, TaskType } from '../../types';
import { api } from '../../services/api';
import { useDeepLink } from '../../hooks/useDeepLink';

export const SchedulePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 10, 19));
  const [filters, setFilters] = useState<FilterState>({ searchQuery: '', types: [], statuses: [], assigneeId: null });
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [sidebarShowFilters, setSidebarShowFilters] = useState(false);
  const [sidebarSortBy, setSidebarSortBy] = useState<'name' | 'workload'>('name');
  const [sidebarShowWorkingOnly, setSidebarShowWorkingOnly] = useState(true);
  const { selectedId: deepLinkedTaskId, isOpen: isFlyoutOpen, open: openFlyout, close: closeFlyout, getShareUrl } = useDeepLink({ paramName: 'taskId' });
  const [selectedTask, setSelectedTask] = useState<Partial<Task> | null>(null);
  const [isNewTask, setIsNewTask] = useState(false);
  const [isStaffFlyoutOpen, setIsStaffFlyoutOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [queueModalType, setQueueModalType] = useState<TaskType | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [fetchedStaff, fetchedTasks] = await Promise.all([api.fetchStaff(), api.fetchTasks(currentDate)]);
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

  useEffect(() => {
    if (deepLinkedTaskId && !isNewTask) {
        const found = tasks.find(t => t.id === deepLinkedTaskId);
        if (found) setSelectedTask(found);
        else if (!isLoading) api.fetchTask(deepLinkedTaskId).then(t => { if(t) setSelectedTask(t); });
    }
  }, [deepLinkedTaskId, tasks, isLoading, isNewTask]);

  const uniqueRoles = useMemo(() => Array.from(new Set(staffList.map(s => s.role))).sort(), [staffList]);
  const visibleStaff = useMemo(() => {
    let staff = selectedRole === 'All' ? staffList : staffList.filter(s => s.role === selectedRole);
    const staffWithStats = staff.map(s => ({ ...s, workedHours: tasks.filter(t => t.staffId === s.id).reduce((acc, t) => acc + t.duration, 0) }));
    return staffWithStats.sort((a, b) => sidebarSortBy === 'workload' ? b.workedHours - a.workedHours : a.name.localeCompare(b.name));
  }, [selectedRole, tasks, sidebarSortBy, staffList]);

  const handleDateChange = (date: Date) => setCurrentDate(date);
  const shiftDate = (days: number) => { const d = new Date(currentDate); d.setDate(d.getDate() + days); setCurrentDate(d); };
  const handleDragStart = (e: React.DragEvent, taskId: string) => { setDraggedTaskId(taskId); if (selectedTaskIds.size > 0) setSelectedTaskIds(new Set()); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDrop = useCallback(async (e: React.DragEvent, staffId: string) => {
    e.preventDefault();
    if (!draggedTaskId) return;
    const targetStaff = staffList.find(s => s.id === staffId);
    if (targetStaff && !targetStaff.isWorking && !window.confirm(`${targetStaff.name} is OFF. Schedule anyway?`)) { setDraggedTaskId(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const hourOffset = percentage * HOURS_COUNT;
    const newStartTime = START_HOUR + hourOffset;
    const snappedStartTime = Math.round(newStartTime * 4) / 4;
    const updatedTasks = tasks.map(t => t.id === draggedTaskId ? { ...t, staffId: staffId, startTime: Math.max(START_HOUR, Math.min(START_HOUR + HOURS_COUNT - t.duration, snappedStartTime)), status: staffId === 'unassigned' ? 'pending' : t.status as TaskStatus } : t);
    setTasks(updatedTasks);
    setDraggedTaskId(null);
    const taskToUpdate = updatedTasks.find(t => t.id === draggedTaskId);
    if (taskToUpdate) await api.updateTask(taskToUpdate);
  }, [draggedTaskId, staffList, tasks]);

  const openTaskDetails = (task: Task) => { setIsNewTask(false); setIsStaffFlyoutOpen(false); openFlyout(task.id); };
  const openCreateTask = (staffId: string, hour: number) => { setSelectedTask({ title: '', staffId, startTime: hour, duration: 1, plannedStartTime: hour, plannedDuration: 1, type: 'maintenance', status: 'pending' }); setIsNewTask(true); };
  const handleCloseFlyout = () => { closeFlyout(); setIsNewTask(false); };
  const handleStaffClick = (staff: Staff) => { setSelectedStaff(staff); setIsStaffFlyoutOpen(true); closeFlyout(); };
  const handleCreateTask = async (newTaskData: any) => { /* Mock Create logic */ setIsNewTask(false); handleCloseFlyout(); };
  const handleDeleteTask = async (taskId: string) => { /* Mock Delete logic */ handleCloseFlyout(); };
  const toggleTaskSelection = (taskId: string) => setSelectedTaskIds(prev => { const next = new Set(prev); if (next.has(taskId)) next.delete(taskId); else next.add(taskId); return next; });
  const handleBulkAssign = (staffId: string) => { setTasks(prev => prev.map(t => selectedTaskIds.has(t.id) ? { ...t, staffId } : t)); setSelectedTaskIds(new Set()); };
  const handleBulkStatusChange = (status: TaskStatus) => { setTasks(prev => prev.map(t => selectedTaskIds.has(t.id) ? { ...t, status } : t)); setSelectedTaskIds(new Set()); };
  const handleBulkDelete = () => { if (window.confirm(`Delete ${selectedTaskIds.size} tasks?`)) { setTasks(prev => prev.filter(t => !selectedTaskIds.has(t.id))); setSelectedTaskIds(new Set()); } };
  const handleBulkAssignFromModal = (taskIds: string[], staffId: string) => { setTasks(prev => prev.map(t => taskIds.includes(t.id) ? { ...t, staffId } : t)); };

  const currentTime = 11 + (16 / 60); 
  const currentTimePercent = ((currentTime - START_HOUR) / HOURS_COUNT) * 100;
  const filteredTasks = tasks.filter(t => {
    const matchSearch = !filters.searchQuery || t.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) || t.location.toLowerCase().includes(filters.searchQuery.toLowerCase()) || (t.notes && t.notes.toLowerCase().includes(filters.searchQuery.toLowerCase()));
    const matchType = filters.types.length === 0 || filters.types.includes(t.type);
    const matchStatus = filters.statuses.length === 0 || filters.statuses.includes(t.status);
    let matchAssignee = true;
    if (filters.assigneeId === 'unassigned') matchAssignee = t.staffId === 'unassigned' || t.staffId === null;
    else if (filters.assigneeId) matchAssignee = t.staffId === filters.assigneeId;
    return matchSearch && matchType && matchStatus && matchAssignee;
  });
  const unassignedTasks = filteredTasks.filter(t => t.staffId === 'unassigned' || t.staffId === null);
  const unassignedGroups = useMemo(() => { const groups: any = {}; unassignedTasks.forEach(t => { if (!groups[t.type]) groups[t.type] = { count: 0, totalHours: 0 }; groups[t.type].count += 1; groups[t.type].totalHours += t.duration; }); return groups; }, [unassignedTasks]);
  const totalUnassignedHours = unassignedTasks.reduce((acc, t) => acc + t.duration, 0);
  const hasUnassigned = unassignedTasks.length > 0;
  const staffHeader = selectedStaff ? <div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${selectedStaff.avatarColor}`}>{selectedStaff.initials}</div><div><div className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">{selectedStaff.name}</div><div className="text-xs text-slate-500 dark:text-slate-400 font-normal">{selectedStaff.role}</div></div></div> : null;
  const getDisplayTask = () => selectedTask ? { ...selectedTask, description: selectedTask.description || selectedTask.notes || '', propertyName: selectedTask.propertyName || selectedTask.location || '', scheduledAt: selectedTask.scheduledAt || new Date().toISOString() } as Task : null;
  
  const getTaskTitle = (task: Partial<Task> | null) => { 
      if (!task) return 'Task Details'; 
      const type = task.type || 'maintenance'; 
      const Icon = Icons[type.charAt(0).toUpperCase() + type.slice(1) as keyof typeof Icons] || Icons.ClipboardCheck; 
      return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
                <div className="text-slate-400"><Icon /></div>
                <span className="capitalize font-semibold text-slate-800 dark:text-slate-100 leading-none">{TASK_LABELS[type]}</span>
            </div>
            {task.id && <span className="text-[10px] font-normal text-slate-400 font-mono ml-6 leading-none">Task ID {task.id}</span>}
        </div>
      );
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-900 text-slate-500 gap-3"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div><span>Loading schedule...</span></div>;
  const flyoutVisible = isFlyoutOpen || isNewTask;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-white dark:bg-slate-900">
        <Header filters={filters} onFilterChange={setFilters} staffList={staffList} currentDate={currentDate} onDateChange={handleDateChange} onPrevDay={() => shiftDate(-1)} onNextDay={() => shiftDate(1)} />
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
            <div className="flex flex-col min-h-full min-w-fit pb-24"> 
                <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm flex-shrink-0 z-30 min-h-[90px]">
                    <div className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 p-4 flex flex-col justify-center group bg-slate-50 dark:bg-slate-800">
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                            <div className={`p-2 rounded-lg shadow-sm border transition-colors duration-300 ${hasUnassigned ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}><Icons.Queue /></div>
                            <div><div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 transition-colors duration-300">UNASSIGNED</div><div className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">{unassignedTasks.length} Tasks</div><div className="text-[10px] font-medium text-slate-400">{totalUnassignedHours.toFixed(1)}h Est. Duration</div></div>
                        </div>
                    </div>
                    <div className="flex-1 p-3 flex gap-4 items-center overflow-x-auto custom-scrollbar">
                        {Object.entries(unassignedGroups).map(([type, stats]) => <UnassignedGroupCard key={type} type={type as TaskType} count={(stats as any).count} totalHours={(stats as any).totalHours} onClick={() => setQueueModalType(type as TaskType)} />)}
                        {unassignedTasks.length === 0 && <div className="text-sm text-slate-400 italic px-4 flex items-center gap-2">All tasks assigned!</div>}
                    </div>
                </div>
                <div className="sticky top-0 z-40 flex bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
                        <SidebarHeader allRoles={uniqueRoles} selectedRole={selectedRole} onRoleChange={setSelectedRole} showFilters={sidebarShowFilters} onToggleFilters={() => setSidebarShowFilters(!sidebarShowFilters)} sortBy={sidebarSortBy} onSortChange={setSidebarSortBy} showWorkingOnly={sidebarShowWorkingOnly} onToggleWorkingOnly={() => setSidebarShowWorkingOnly(!sidebarShowWorkingOnly)} />
                        <div className="flex-1 flex items-center">
                        {TIME_SLOTS.map((slot, index) => (
                            <div key={slot.value} className={`flex-1 h-12 flex justify-center items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase border-r border-slate-100 dark:border-slate-800 select-none ${index === TIME_SLOTS.length - 1 ? 'border-none' : ''}`}>{slot.label}</div>
                        ))}
                        </div>
                </div>
                <div className="flex flex-1 min-h-0">
                    <SidebarList staffList={visibleStaff} onStaffClick={handleStaffClick} />
                    <div className="flex-1 flex flex-col min-w-0 relative bg-white dark:bg-slate-900">
                        <div className="relative flex-1">
                            <div className="absolute top-0 bottom-0 w-px bg-red-500 z-30 pointer-events-none flex flex-col items-center" style={{ left: `${currentTimePercent}%` }}><div className="w-2 h-2 bg-red-500 rounded-full -mt-1"></div><div className="bg-red-500 text-white text-[9px] font-bold px-1 rounded mt-0.5 whitespace-nowrap shadow-sm">11:16</div></div>
                            {visibleStaff.map((staff) => (
                                <div key={staff.id} style={{ height: `${ROW_HEIGHT}px` }} className={`relative border-b border-slate-100 dark:border-slate-800 group/row ${!staff.isWorking ? 'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZjhmOGY4Ii8+CjxwYXRoIGQ9Ik0wIDhMOCAwTTggOEwwIDAiIHN0cm9rZT0iI2UyZTJlMiIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==")] dark:bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMWUyOTNiIi8+CjxwYXRoIGQ9Ik0wIDhMOCAwTTggOEwwIDAiIHN0cm9rZT0iIzMzNDE1NSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==")]' : 'bg-white dark:bg-slate-900'}`} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, staff.id)}>
                                    <div className="absolute inset-0 flex">
                                        {TIME_SLOTS.map((slot, index) => {
                                            const isShiftHour = slot.value >= staff.shiftStart && slot.value < staff.shiftEnd;
                                            const bgClass = !staff.isWorking ? 'bg-transparent' : staff.id !== 'unassigned' && !isShiftHour ? 'bg-slate-50/70 dark:bg-slate-800/50' : 'bg-transparent';
                                            return <div key={slot.value} className={`flex-1 border-r border-slate-100 dark:border-slate-800 h-full ${bgClass} ${index === TIME_SLOTS.length - 1 ? 'border-none' : ''} relative group/slot`}>
                                                    {staff.isWorking && <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-opacity z-0"><button onClick={() => openCreateTask(staff.id, slot.value)} className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center shadow-sm transform scale-75 group-hover/slot:scale-100 transition-transform"><Icons.Plus className="w-3.5 h-3.5" /></button></div>}
                                                </div>
                                        })}
                                    </div>
                                    {filteredTasks.filter(t => t.staffId === staff.id).map(task => <TaskCard key={task.id} task={task} isSelected={selectedTaskIds.has(task.id)} onDragStart={handleDragStart} onClick={openTaskDetails} onToggleSelect={toggleTaskSelection} />)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <BulkActionBar selectedCount={selectedTaskIds.size} staffList={staffList} onAssign={handleBulkAssign} onStatusChange={handleBulkStatusChange} onDelete={handleBulkDelete} onClear={() => setSelectedTaskIds(new Set())} />
        <Flyout isOpen={flyoutVisible} onClose={handleCloseFlyout} title={isNewTask ? "" : getTaskTitle(selectedTask)} side="right" noPadding={!isNewTask} size="xl" onShare={() => { navigator.clipboard.writeText(getShareUrl()); }}>
            {isNewTask ? <TaskCreateForm onCancel={handleCloseFlyout} onCreate={handleCreateTask} initialData={{ staffId: selectedTask?.staffId || '', startTime: selectedTask?.startTime || 9, date: currentDate }} /> : selectedTask && <TaskDetail task={getDisplayTask()!} />}
        </Flyout>
        <Flyout isOpen={isStaffFlyoutOpen} onClose={() => setIsStaffFlyoutOpen(false)} title={staffHeader} side="right">
            {selectedStaff && <StaffDetail staff={selectedStaff} tasks={tasks.filter(t => t.staffId === selectedStaff.id)} />}
        </Flyout>
        <UnassignedQueueModal isOpen={!!queueModalType} onClose={() => setQueueModalType(null)} type={queueModalType || 'maintenance'} tasks={unassignedTasks.filter(t => t.type === queueModalType)} staffList={staffList} onAssign={handleBulkAssignFromModal} />
    </div>
  );
};
