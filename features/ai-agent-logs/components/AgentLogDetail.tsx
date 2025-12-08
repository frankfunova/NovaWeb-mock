
import React, { useState } from 'react';
import { AgentLog } from '../../../types';
import { Icons } from '../../../constants';

interface AgentLogDetailProps {
  log: AgentLog;
}

const CollapsibleSection: React.FC<{ 
    title: string; 
    icon?: React.ReactNode; 
    children: React.ReactNode; 
    defaultOpen?: boolean;
}> = ({ title, icon, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="px-6 py-4 border-t border-slate-100">
            <div 
                className="flex items-center justify-between mb-3 cursor-pointer group select-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-700 transition-colors">
                    <div className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                        <Icons.ChevronRight />
                    </div>
                    {icon && <span className="text-slate-400 group-hover:text-slate-600">{icon}</span>}
                    {title}
                </div>
            </div>
            {isOpen && (
                <div className="animate-in slide-in-from-top-1 duration-200 fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};

export const AgentLogDetail: React.FC<AgentLogDetailProps> = ({ log }) => {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-white flex-shrink-0 shadow-sm z-10">
            <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${log.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        {log.status === 'success' ? <Icons.Check /> : <Icons.X />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{log.toolName}</h2>
                        <div className="flex items-center gap-2 mt-1 text-xs font-medium text-slate-500">
                             <span className="font-mono">{log.id}</span>
                             <span className="text-slate-300">•</span>
                             <span>{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            
            {/* Stats Overview */}
            <div className="p-6 grid grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Duration</div>
                    <div className="text-sm font-bold text-slate-800">{log.durationMs}ms</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Tokens</div>
                    <div className="text-sm font-bold text-slate-800">{log.tokenUsage}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">LLM Calls</div>
                    <div className="text-sm font-bold text-slate-800">{log.llmCallCount}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Model</div>
                    <div className="text-sm font-bold text-slate-800 truncate" title={log.modelName}>{log.modelName}</div>
                </div>
            </div>

            {/* Error Message (if failed) */}
            {log.status === 'failed' && (
                <div className="mx-6 mb-6 bg-red-50 border border-red-100 rounded-lg p-4">
                    <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Icons.X className="w-4 h-4" /> Execution Failed
                    </div>
                    <div className="text-sm text-red-800 font-medium">{log.errorMessage}</div>
                    {log.errorTraceback && (
                        <div className="mt-3 bg-red-100/50 p-3 rounded border border-red-200 text-[10px] font-mono text-red-900 overflow-x-auto whitespace-pre-wrap">
                            {log.errorTraceback}
                        </div>
                    )}
                </div>
            )}

            {/* Input Context */}
            <CollapsibleSection title="Input Context" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                <div className="bg-slate-900 rounded-lg p-4 text-xs font-mono text-slate-300 overflow-x-auto">
                    <pre>{JSON.stringify(log.inputContext, null, 2)}</pre>
                </div>
            </CollapsibleSection>

            {/* Final Prompt (if success) */}
            {log.finalPrompt && (
                <CollapsibleSection title="Final Prompt" icon={<Icons.Edit className="w-4 h-4" />}>
                     <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
                        {log.finalPrompt}
                     </div>
                </CollapsibleSection>
            )}

            {/* Metadata */}
            <CollapsibleSection title="Metadata" icon={<Icons.Settings className="w-4 h-4" />} defaultOpen={false}>
                 <div className="grid grid-cols-2 gap-4 text-xs">
                     <div>
                         <span className="text-slate-500 font-medium">Prompt Tokens:</span>
                         <span className="ml-2 text-slate-800 font-mono">{log.promptTokens}</span>
                     </div>
                     <div>
                         <span className="text-slate-500 font-medium">Completion Tokens:</span>
                         <span className="ml-2 text-slate-800 font-mono">{log.completionTokens}</span>
                     </div>
                     <div>
                         <span className="text-slate-500 font-medium">Agent ID:</span>
                         <span className="ml-2 text-slate-800 font-mono">{log.agentId || 'N/A'}</span>
                     </div>
                      <div>
                         <span className="text-slate-500 font-medium">User ID:</span>
                         <span className="ml-2 text-slate-800 font-mono">{log.userId || 'N/A'}</span>
                     </div>
                 </div>
            </CollapsibleSection>

        </div>
    </div>
  );
};
