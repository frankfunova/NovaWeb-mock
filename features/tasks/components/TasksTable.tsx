
import React from 'react';
import { Task } from '../../../types';
import { Icons } from '../../../constants';
import { STATUS_BADGES, PRIORITY_STYLES } from '../constants';

interface TasksTableProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void; // Added prop
}

export const TasksTable: React.FC<TasksTableProps> = ({ tasks, onTaskClick }) => {
  
  const formatScheduledDate = (dateStr?: string) => {
      if (!dateStr) return '--';
      const date = new Date(dateStr);
      const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      return (
        <div className="flex flex-col">
            <span className="font-medium text-slate-900">{day}</span>
            <span className="text-xs text-slate-500">{time}</span>
        </div>
      );
  };

  const getInitials = (name: string) => {
      // Handle formats like "MT - Luis" or "Vendor - ..."
      const cleanName = name.includes('-') ? name.split('-')[1].trim() : name;
      return cleanName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
      if (name.toLowerCase().includes('vendor')) return 'bg-blue-500';
      if (name.toLowerCase().includes('mt')) return 'bg-slate-700';
      if (name.toLowerCase().includes('op')) return 'bg-indigo-600';
      return 'bg-emerald-600';
  };

  return (
    <div className="min-w-full inline-block align-middle">
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left w-10">
                 <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:text-slate-700">
                Task
                <svg className="w-3 h-3 opacity-0 group-hover:opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Property Name
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:text-slate-700">
                Status
                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Priority
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Assignee
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Scheduled
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {tasks.map((task) => (
              <tr 
                key={task.id} 
                className="hover:bg-slate-50 transition-colors group cursor-pointer"
                onClick={() => onTaskClick && onTaskClick(task)} // Added click handler
              >
                <td className="px-4 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                   <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                </td>
                
                {/* Task Title & Description */}
                <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-slate-400">
                            {task.type === 'maintenance' && <Icons.Maintenance />}
                            {task.type === 'inspection' && <Icons.Search />} 
                            {task.type === 'delivery' && <Icons.Truck />}
                            {task.type === 'cleaning' && <Icons.Cleaning />}
                        </div>
                        <div className="max-w-md">
                            <div className="text-sm font-medium text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{task.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.description || '-'}</div>
                        </div>
                    </div>
                </td>

                {/* Property */}
                <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                        {task.propertyName || '--'}
                    </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${STATUS_BADGES[task.status] || 'bg-gray-100 text-gray-600'}`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                </td>

                {/* Priority */}
                <td className="px-4 py-3 whitespace-nowrap">
                    {task.priority ? (
                        <span className={`px-2.5 py-0.5 rounded text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
                            {task.priority}
                        </span>
                    ) : <span className="text-slate-300 text-xs">--</span>}
                </td>

                {/* Assignee */}
                <td className="px-4 py-3 whitespace-nowrap">
                    {task.assigneeName ? (
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${getAvatarColor(task.assigneeName)}`}>
                                {getInitials(task.assigneeName)}
                            </div>
                            <span className="text-sm text-slate-700 font-medium">{task.assigneeName}</span>
                        </div>
                    ) : (
                        <span className="text-slate-400 text-sm italic">Unassigned</span>
                    )}
                </td>

                {/* Scheduled */}
                <td className="px-4 py-3 whitespace-nowrap">
                    {formatScheduledDate(task.scheduledAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
