
import React, { useState, useEffect } from 'react';
import { Task, TaskType, Staff } from '../../../types';
import { TASK_LABELS, STATUS_STYLES } from '../constants';

interface TaskFormProps {
  initialTask: Partial<Task> | null;
  staffList: Staff[];
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onCancel: () => void;
  isNew: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ 
  initialTask, 
  staffList, 
  onSave, 
  onDelete, 
  onCancel,
  isNew 
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    location: '',
    type: 'maintenance',
    staffId: 'unassigned',
    startTime: 9,
    duration: 1,
    plannedStartTime: 9,
    plannedDuration: 1,
    status: 'pending',
    notes: '',
  });

  useEffect(() => {
    if (initialTask) {
      setFormData(prev => ({ ...prev, ...initialTask }));
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.title || !formData.staffId) return;
    
    // If new, ensure planned matches actual if not set, or vice versa
    const submitData = { ...formData };
    if (!submitData.plannedStartTime) submitData.plannedStartTime = submitData.startTime;
    if (!submitData.plannedDuration) submitData.plannedDuration = submitData.duration;

    onSave(submitData as Task);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['startTime', 'duration', 'plannedStartTime', 'plannedDuration'].includes(name) ? parseFloat(value) : value
    }));
  };

  const selectedType = formData.type as TaskType;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
        <input
          type="text"
          name="title"
          id="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          placeholder="e.g., Fix AC Unit"
        />
      </div>

      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Task Type</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(TASK_LABELS).map(([type, label]) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: type as TaskType }))}
              className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md border transition-all ${
                selectedType === type 
                  ? 'bg-slate-800 text-white border-slate-900 ring-2 ring-offset-1 ring-slate-300' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Grid */}
      <div className="bg-slate-50 p-4 rounded-lg space-y-4 border border-slate-200">
        <h3 className="text-xs font-bold uppercase text-slate-500">Time Tracking</h3>
        
        <div className="grid grid-cols-2 gap-4">
            {/* Actual Start Time */}
            <div>
            <label htmlFor="startTime" className="block text-xs font-medium text-slate-700 mb-1">Actual Start (24h)</label>
            <input
                type="number"
                name="startTime"
                id="startTime"
                step="0.25"
                required
                value={formData.startTime}
                onChange={handleChange}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
            </div>

            {/* Actual Duration */}
            <div>
            <label htmlFor="duration" className="block text-xs font-medium text-slate-700 mb-1">Actual Duration (h)</label>
            <input
                type="number"
                name="duration"
                id="duration"
                step="0.25"
                min="0.25"
                required
                value={formData.duration}
                onChange={handleChange}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 opacity-80">
            {/* Planned Start Time */}
            <div>
            <label htmlFor="plannedStartTime" className="block text-xs font-medium text-slate-500 mb-1">Planned Start</label>
            <input
                type="number"
                name="plannedStartTime"
                id="plannedStartTime"
                step="0.25"
                value={formData.plannedStartTime}
                onChange={handleChange}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white/50"
            />
            </div>

            {/* Planned Duration */}
            <div>
            <label htmlFor="plannedDuration" className="block text-xs font-medium text-slate-500 mb-1">Planned Duration</label>
            <input
                type="number"
                name="plannedDuration"
                id="plannedDuration"
                step="0.25"
                min="0.25"
                value={formData.plannedDuration}
                onChange={handleChange}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white/50"
            />
            </div>
        </div>
      </div>

      {/* Staff Assignment */}
      <div>
        <label htmlFor="staffId" className="block text-sm font-medium text-slate-700 mb-1">Assigned To</label>
        <select
          name="staffId"
          id="staffId"
          value={formData.staffId || 'unassigned'}
          onChange={handleChange}
          className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white"
        >
           <option value="unassigned">Unassigned</option>
           {staffList.filter(s => s.id !== 'unassigned').map(staff => (
             <option key={staff.id} value={staff.id}>
               {staff.name} {staff.isWorking ? '' : '(Off)'}
             </option>
           ))}
        </select>
      </div>

       {/* Location */}
       <div>
        <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Location</label>
        <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
            </div>
            <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className="block w-full rounded-md border-slate-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            placeholder="Location or Room #"
            />
        </div>
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
        <div className="grid grid-cols-2 gap-2">
           {Object.keys(STATUS_STYLES).map(status => (
             <button
                key={status}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: status as any }))}
                className={`capitalize px-3 py-2 text-sm rounded-md border ${
                    formData.status === status 
                    ? `${STATUS_STYLES[status]} ring-1 ring-offset-1 ring-black/20 shadow-sm` 
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
             >
                {status}
             </button>
           ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
        <textarea
          name="notes"
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          placeholder="Additional details..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-8">
        {!isNew && (
            <button
            type="button"
            onClick={() => formData.id && onDelete(formData.id)}
            className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
            >
            Delete Task
            </button>
        )}
        <div className={`flex gap-3 ${isNew ? 'w-full justify-end' : ''}`}>
            <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
            >
            Cancel
            </button>
            <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 shadow-sm"
            >
            {isNew ? 'Create Task' : 'Save Changes'}
            </button>
        </div>
      </div>
    </form>
  );
};
