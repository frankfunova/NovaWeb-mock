


import React from 'react';
import { Agent } from '../../../types';
import { Icons } from '../../../constants';

interface AgentsTableProps {
  agents: Agent[];
  onAgentClick?: (agent: Agent) => void;
  onShowLogs?: (agent: Agent) => void;
}

const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const AgentsTable: React.FC<AgentsTableProps> = ({ agents, onAgentClick, onShowLogs }) => {
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
                Agent Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Tools
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {agents.map((agent) => (
              <tr 
                key={agent.id} 
                className="hover:bg-slate-50 transition-colors group cursor-pointer"
                onClick={() => onAgentClick && onAgentClick(agent)}
              >
                <td className="px-6 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                   <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                </td>
                
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                            <Icons.Bot />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900">{agent.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">{agent.description}</div>
                        </div>
                    </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {agent.agentType}
                    </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize flex items-center gap-1.5 w-fit ${agent.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${agent.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                        {agent.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>

                <td className="px-6 py-4">
                    <div className="flex items-center gap-1 flex-wrap max-w-xs">
                        {agent.tools.slice(0, 3).map(tool => (
                            <span key={tool} className="text-[10px] bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                                {tool}
                            </span>
                        ))}
                        {agent.tools.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-medium">+{agent.tools.length - 3}</span>
                        )}
                    </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {formatDate(agent.updatedAt)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={() => onShowLogs && onShowLogs(agent)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                    >
                        Show call log
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};