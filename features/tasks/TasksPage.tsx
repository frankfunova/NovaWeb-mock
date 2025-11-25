
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Task } from '../../types';
import { TasksTable } from './components/TasksTable';
import { TasksToolbar } from './components/TasksToolbar';
import { Flyout } from '../../components/Flyout';
import { TaskDetail } from './components/TaskDetail';
import { TaskCreateForm } from './components/TaskCreateForm';
import { Icons, TASK_LABELS } from '../../constants';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('All Tasks');
  
  // Flyout States
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailFlyoutOpen, setIsDetailFlyoutOpen] = useState(false);
  const [isCreateFlyoutOpen, setIsCreateFlyoutOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'watchlist') {
        setView('My Watchlist');
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await api.fetchTasksList();
        setTasks(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
      const handlePopState = () => {
          const params = new URLSearchParams(window.location.search);
          if (params.get('view') === 'watchlist') {
              setView('My Watchlist');
          } else {
              setView('All Tasks');
          }
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailFlyoutOpen(true);
  };

  const handleCreateTask = (newTask: any) => {
      // In a real app, post to API
      console.log("Creating Task:", newTask);
      setIsCreateFlyoutOpen(false);
      // Mock Optimistic Update
      const t: Task = {
          id: `new-${Date.now()}`,
          title: newTask.title,
          description: newTask.description,
          type: newTask.taskType,
          priority: newTask.priority,
          status: 'new',
          staffId: newTask.dispatch.assigneeId,
          assigneeName: newTask.dispatch.assigneeId ? 'Assigned Staff' : 'Unassigned',
          location: 'Selected Property', // Mock
          startTime: 0,
          duration: newTask.dispatch.duration,
          plannedStartTime: 0,
          plannedDuration: newTask.dispatch.duration,
          scheduledAt: `${newTask.dispatch.plannedDate}T${newTask.dispatch.plannedTime}`
      };
      setTasks([t, ...tasks]);
  };

  const getTaskTitle = (task: Task | null) => {
    if (!task) return 'Task Details';
    const type = task.type || 'maintenance';
    const Icon = type === 'maintenance' ? Icons.Maintenance :
                 type === 'cleaning' ? Icons.Cleaning :
                 type === 'inspection' ? Icons.Inspection :
                 type === 'delivery' ? Icons.Delivery : Icons.ClipboardCheck;
                 
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
                <div className="text-slate-400"><Icon /></div>
                <span className="capitalize font-semibold text-slate-800 leading-none">{TASK_LABELS[type]}</span>
            </div>
            <span className="text-[10px] font-normal text-slate-400 font-mono ml-6 leading-none">Task ID {task.id}</span>
        </div>
    );
  };

  if (isLoading) {
      return (
          <div className="flex-1 flex items-center justify-center h-full bg-white">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-slate-500 font-medium">Loading tasks...</span>
          </div>
      );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        <TasksToolbar onCreate={() => setIsCreateFlyoutOpen(true)} view={view} onViewChange={setView} />
        
        <div className="flex-1 overflow-auto bg-white custom-scrollbar">
            <TasksTable tasks={tasks} onTaskClick={handleTaskClick} isWatchlist={view === 'My Watchlist'} />
            
            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm bg-slate-50/50">
                <span className="text-slate-500">Showing {tasks.length} tasks</span>
                <div className="h-1 flex-1 mx-4 bg-slate-200 rounded-full overflow-hidden max-w-xs">
                    <div className="w-1/3 h-full bg-indigo-500"></div>
                </div>
                <button className="text-purple-600 hover:text-purple-800 font-medium hover:underline">Load more tasks...</button>
            </div>
        </div>

        {/* Detail Flyout */}
        <Flyout
            isOpen={isDetailFlyoutOpen}
            onClose={() => setIsDetailFlyoutOpen(false)}
            title={getTaskTitle(selectedTask)}
            side="right"
            size="xl"
            noPadding={true}
        >
            {selectedTask && <TaskDetail task={selectedTask} />}
        </Flyout>

        {/* Create Flyout */}
        <Flyout
            isOpen={isCreateFlyoutOpen}
            onClose={() => setIsCreateFlyoutOpen(false)}
            title="" // Title handled inside component for custom look
            side="right"
            size="xl"
            noPadding={true}
        >
            <TaskCreateForm onCancel={() => setIsCreateFlyoutOpen(false)} onCreate={handleCreateTask} />
        </Flyout>
    </div>
  );
};
