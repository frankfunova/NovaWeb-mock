
import React, { useState, useEffect } from 'react';
import { Task, TaskType, Staff } from '../../../types';
import { Icons, TYPE_ICON_COLORS, TASK_LABELS } from '../constants';

interface UnassignedQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TaskType;
  tasks: Task[];
  staffList: Staff[];
  onAssign: (taskIds: string[], staffId: string) => void;
}

export const UnassignedQueueModal: React.FC<UnassignedQueueModalProps> = ({
  isOpen,
  onClose,
  type,
  tasks,
  staffList,
  onAssign
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [targetStaffId, setTargetStaffId] = useState<string>('');

  // Reset selection when opening/changing type
  useEffect(() => {
    if (isOpen) {
        setSelectedIds(new Set());
        setTargetStaffId('');
    }
  }, [isOpen, type]);

  const toggleSelectAll = () => {
    if (selectedIds.size === tasks.length) {
        setSelectedIds(new Set());
    } else {
        setSelectedIds(new Set(tasks.map(t => t.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleAssign = () => {
    if (!targetStaffId || selectedIds.size === 0) return;
    onAssign(Array.from(selectedIds), targetStaffId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

        {/* Modal Content */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col relative z-10 animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${TYPE_ICON_COLORS[type].replace('text-', 'bg-').replace('500', '100')} ${TYPE_ICON_COLORS[type]}`}>
                         {type === 'maintenance' && <Icons.Maintenance />}
                         {type === 'cleaning' && <Icons.Cleaning />}
                         {type === 'inspection' && <Icons.Inspection />}
                         {type === 'delivery' && <Icons.Delivery />}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">{TASK_LABELS[type]} Queue</h2>
                        <p className="text-xs text-slate-500">{tasks.length} tasks pending assignment</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 sticky top-0 z-10 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3 border-b border-slate-200 w-10 bg-slate-50">
                                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                                    checked={tasks.length > 0 && selectedIds.size === tasks.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-3 border-b border-slate-200 bg-slate-50">Task Details</th>
                            <th className="px-6 py-3 border-b border-slate-200 bg-slate-50">Duration</th>
                            <th className="px-6 py-3 border-b border-slate-200 bg-slate-50">Location</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {tasks.map(task => (
                            <tr key={task.id} className={`hover:bg-slate-50/80 transition-colors ${selectedIds.has(task.id) ? 'bg-indigo-50/30' : ''}`}>
                                <td className="px-6 py-4">
                                    <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        checked={selectedIds.has(task.id)}
                                        onChange={() => toggleSelect(task.id)}
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-slate-900">{task.title}</div>
                                    {task.notes && <div className="text-xs text-slate-400 italic truncate max-w-[200px]">{task.notes}</div>}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                                    {task.duration}h
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {task.location}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {tasks.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">
                                    No unassigned tasks of this type.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex items-center justify-between">
                <div className="text-sm text-slate-500 font-medium">
                    {selectedIds.size} tasks selected
                </div>
                <div className="flex gap-3">
                    <select 
                        className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 min-w-[200px]"
                        value={targetStaffId}
                        onChange={(e) => setTargetStaffId(e.target.value)}
                    >
                        <option value="" disabled>Assign to staff...</option>
                        {staffList.filter(s => s.isWorking).map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                    <button 
                        onClick={handleAssign}
                        disabled={!targetStaffId || selectedIds.size === 0}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Assign Selected
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
