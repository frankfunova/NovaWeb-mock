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
            title="Task Details"
            side="right"
            noPadding={true}
        >
            {selectedTask && <TaskDetail task={selectedTask} />}
        </Flyout>
    </div>
  );
};