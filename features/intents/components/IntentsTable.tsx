
import React from 'react';
import { Intent } from '../../../types';
import { Icons } from '../../../constants';

interface IntentsTableProps {
  intents: Intent[];
  onIntentClick?: (intent: Intent) => void;
}

const PRIORITY_STYLES: Record<string, string> = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200'
};

const STATUS_STYLES: Record<string, string> = {
    new: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
    closed: 'bg-slate-100 text-slate-600 border-slate-200'
};

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${PRIORITY_STYLES[priority.toLowerCase()] || 'bg-slate-100'}`}>
            {priority}
        </span>
    );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${STATUS_STYLES[status.toLowerCase()] || 'bg-slate-100'}`}>
            {status === 'new' ? 'New' : status.replace('_', ' ')}
        </span>
    );
};

export const IntentsTable: React.FC<IntentsTableProps> = ({ intents, onIntentClick }) => {
  return (
    <div className="min-w-full inline-block align-middle">
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left w-10">
                 <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                <div className="flex items-center gap-1">
                    Description
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                 <div className="flex items-center gap-1">
                    Priority
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Listing
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                 <div className="flex items-center gap-1">
                    Status
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                 <div className="flex items-center gap-1">
                    Intent Type
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                 <div className="flex items-center gap-1">
                    Created Date
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {intents.map((intent) => (
              <tr 
                key={intent.id} 
                className="hover:bg-slate-50 transition-colors group cursor-pointer"
                onClick={() => onIntentClick && onIntentClick(intent)}
              >
                <td className="px-6 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                   <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                </td>
                
                {/* Description */}
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        {/* Mock Icon based on source/type */}
                        <div className="p-1 rounded border border-slate-200 text-slate-400 bg-white">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        </div>
                        <span className="text-sm text-slate-700 font-medium truncate max-w-md">{intent.description}</span>
                    </div>
                </td>

                {/* Priority */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={intent.priority} />
                </td>

                {/* Listing */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {intent.listingId}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={intent.status} />
                </td>

                {/* Intent Type */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {intent.intentTypeCode}
                </td>

                {/* Created Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {intent.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
