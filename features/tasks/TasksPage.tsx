
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Task } from '../../types';
import { TasksTable } from './components/TasksTable';
import { TasksToolbar } from './components/TasksToolbar';
import { Flyout } from '../../components/Flyout';
import { TaskDetail } from './components/TaskDetail';
import { Icons } from '../../constants';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

  useEffect(() => {
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

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsFlyoutOpen(true);
  };

  // Custom Header for Flyout
  const renderFlyoutHeader = () => {
      return (
        <div className="flex items-center gap-3">
            <button className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </button>
            
            {/* Priority Dropdown */}
            <button className="flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-bold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 transition-colors">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Low
                <svg className="w-3 h-3 ml-1 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

             {/* Status Dropdown */}
            <button className="flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-sm">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                Completed
                <svg className="w-3 h-3 ml-1 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
        </div>
      );
  };

  const renderFlyoutActions = () => {
      return (
          <div className="flex items-center gap-1">
              <button className="p-2 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Comments">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </button>
              <button className="p-2 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Open in new tab">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </button>
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
        <TasksToolbar />
        
        <div className="flex-1 overflow-auto bg-white custom-scrollbar">
            <TasksTable tasks={tasks} onTaskClick={handleTaskClick} />
            
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
            isOpen={isFlyoutOpen}
            onClose={() => setIsFlyoutOpen(false)}
            title={renderFlyoutHeader()}
            actions={renderFlyoutActions()}
            side="right"
        >
            {selectedTask && <TaskDetail task={selectedTask} />}
        </Flyout>
    </div>
  );
};
