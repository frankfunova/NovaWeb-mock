
import React from 'react';

export const TaskExpenses: React.FC = () => {
    return (
        <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Labor Cost</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input type="number" className="w-full pl-6 pr-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="0.00" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Material Cost</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input type="number" className="w-full pl-6 pr-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="0.00" />
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Completion Notes</label>
                <textarea className="w-full border border-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none" rows={2} placeholder="Summary of work done..."></textarea>
            </div>
        </div>
    );
};
