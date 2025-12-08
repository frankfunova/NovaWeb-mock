
import React from 'react';
import { AgentLog } from '../../../types';
import { Icons } from '../../../constants';

interface AgentLogTableProps {
  logs: AgentLog[];
  onLogClick?: (log: AgentLog) => void;
}

const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    });
};

const StatusBadge = ({ status }: { status: 'success' | 'failed' }) => {
    if (status === 'success') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Success
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            Failed
        </span>
    );
};

export const AgentLogTable: React.FC<AgentLogTableProps> = ({ logs, onLogClick }) => {
  return (
    <div className="min-w-full inline-block align-middle">
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left w-10">
                 <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Tool Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Model
              </th>
               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Duration & Tokens
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {logs.map((log) => (
              <tr 
                key={log.id} 
                className="hover:bg-slate-50 transition-colors group cursor-pointer"
                onClick={() => onLogClick && onLogClick(log)}
              >
                <td className="px-6 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                   <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={log.status} />
                </td>

                <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{log.toolName}</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">ID: {log.id}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        {log.modelName || 'N/A'}
                    </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                    {log.userName ? (
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                 {log.userName.charAt(0)}
                             </div>
                             <span className="text-sm text-slate-700">{log.userName}</span>
                        </div>
                    ) : (
                        <span className="text-sm text-slate-400 italic">System</span>
                    )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-0.5">
                        <div className="text-xs font-medium text-slate-700 flex items-center gap-1">
                            <Icons.Clock className="w-3 h-3 text-slate-400" />
                            {log.durationMs}ms
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                            {log.tokenUsage} tokens
                        </div>
                    </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                    {formatDate(log.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
