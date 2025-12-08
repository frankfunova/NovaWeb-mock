
import React, { useState } from 'react';
import { Agent } from '../../../types';
import { Icons } from '../../../constants';

interface AgentDetailProps {
  agent: Agent;
}

const CollapsibleSection: React.FC<{ 
    title: string; 
    icon?: React.ReactNode; 
    children: React.ReactNode; 
    defaultOpen?: boolean;
    action?: React.ReactNode;
}> = ({ title, icon, children, defaultOpen = true, action }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="px-6 py-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors group"
                >
                    <div className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                        <Icons.ChevronRight />
                    </div>
                    {icon && <span className="text-slate-400 group-hover:text-slate-600">{icon}</span>}
                    {title}
                </button>
                {action}
            </div>
            {isOpen && (
                <div className="animate-in slide-in-from-top-1 duration-200 fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};

export const AgentDetail: React.FC<AgentDetailProps> = ({ agent }) => {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-white flex-shrink-0 shadow-sm z-10">
            <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                        <Icons.Bot />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{agent.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-slate-500">{agent.agentType}</span>
                            <span className="text-slate-300">•</span>
                            <span className={`flex items-center gap-1 text-xs font-bold ${agent.isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${agent.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                                {agent.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>
                <button className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                    <Icons.Edit className="w-3.5 h-3.5" /> Edit
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            
            {/* General Info */}
            <div className="p-6">
                <div className="mb-4">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {agent.description}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Model</label>
                        <div className="text-sm font-bold text-slate-800 flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            {agent.modelName || 'Default Model'}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Last Updated</label>
                        <div className="text-sm text-slate-600 px-3 py-2">
                            {new Date(agent.updatedAt).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Prompt Settings */}
            <CollapsibleSection title="Prompt Engineering" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">System Instructions (Optimized Description)</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                            {agent.optimizedDescription || <span className="text-slate-400 italic">No instructions set.</span>}
                        </div>
                    </div>
                    {agent.expectedOutput && (
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">Expected Output Format</label>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-600 italic">
                                {agent.expectedOutput}
                            </div>
                        </div>
                    )}
                </div>
            </CollapsibleSection>

            {/* Configuration */}
            <CollapsibleSection title="Tools & Inputs" icon={<Icons.Settings className="w-4 h-4"/>}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-2">Enabled Tools</label>
                        <div className="flex flex-wrap gap-2">
                            {agent.tools.map(tool => (
                                <span key={tool} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono text-slate-600 shadow-sm flex items-center gap-1.5">
                                    <svg className="w-3 h-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {tool}
                                </span>
                            ))}
                            {agent.tools.length === 0 && <span className="text-slate-400 text-xs italic">No tools configured.</span>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-2">Required Inputs</label>
                        {agent.requiredInput && agent.requiredInput.length > 0 ? (
                            <div className="space-y-2">
                                {agent.requiredInput.map((inputGroup, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs">
                                        <span className="font-bold text-slate-400 w-4">{idx + 1}.</span>
                                        <div className="flex gap-1 flex-wrap">
                                            {inputGroup.map((alt, i) => (
                                                <React.Fragment key={i}>
                                                    <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                                                        {alt}
                                                    </span>
                                                    {i < inputGroup.length - 1 && <span className="text-slate-400 text-[10px]">OR</span>}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span className="text-slate-400 text-xs italic">No specific inputs required.</span>
                        )}
                    </div>
                </div>
            </CollapsibleSection>

            {/* Metadata (JSON) */}
            <CollapsibleSection title="Raw Metadata" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>} defaultOpen={false}>
                <div className="bg-slate-900 rounded-lg p-3 text-[10px] text-slate-300 font-mono overflow-x-auto">
                    <pre>{JSON.stringify({ 
                        id: agent.id, 
                        tenant_id: '12345', 
                        extra_info: {}, 
                        output_schema: null 
                    }, null, 2)}</pre>
                </div>
            </CollapsibleSection>
        </div>
    </div>
  );
};
