import React, { useState, useEffect } from 'react';
import { AgentLog, Agent } from '../../../types';
import { Icons } from '../../../constants';
import { api } from '../../../services/api';

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

interface ReplayAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    log: AgentLog;
}

const ReplayAgentModal: React.FC<ReplayAgentModalProps> = ({ isOpen, onClose, log }) => {
    const [inputs, setInputs] = useState<{ id: string, key: string, value: string }[]>([]);
    const [prompt, setPrompt] = useState('');
    const [isPromptExpanded, setIsPromptExpanded] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [agent, setAgent] = useState<Agent | null>(null);
    const [isFetchingAgent, setIsFetchingAgent] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setResult(null);
            setIsLoading(false);
            setAgent(null);
            setIsPromptExpanded(false);
            
            // Populate inputs from log context
            if (log.inputContext) {
                const initialInputs = Object.entries(log.inputContext).map(([key, value]) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    key,
                    value: typeof value === 'object' ? JSON.stringify(value) : String(value)
                }));
                setInputs(initialInputs);
            } else {
                setInputs([{ id: Math.random().toString(36).substr(2, 9), key: '', value: '' }]);
            }

            // Fetch Agent Details to get system instructions etc.
            if (log.agentId) {
                setIsFetchingAgent(true);
                api.fetchAgent(log.agentId).then(fetchedAgent => {
                    setAgent(fetchedAgent || null);
                }).catch(err => {
                    console.error("Failed to fetch agent definition", err);
                }).finally(() => {
                    setIsFetchingAgent(false);
                });
            }
        }
    }, [isOpen, log]);

    // Update prompt when inputs change
    useEffect(() => {
        const inputStr = inputs.filter(i => i.key.trim()).map(i => `${i.key}: ${i.value}`).join('\n');
        setPrompt(`Execute the following task based on your system instructions.\n\nInput Variables:\n${inputStr}`);
    }, [inputs]);

    const handleAddInput = () => {
        setInputs([...inputs, { id: Math.random().toString(36).substr(2, 9), key: '', value: '' }]);
    };

    const handleRemoveInput = (id: string) => {
        setInputs(inputs.filter(i => i.id !== id));
    };

    const handleInputChange = (id: string, field: 'key' | 'value', text: string) => {
        setInputs(inputs.map(i => i.id === id ? { ...i, [field]: text } : i));
    };

    const handleRun = async () => {
        if (!agent) return;
        setIsLoading(true);
        setResult(null);
        try {
            const output = await api.runAgent(agent, prompt);
            setResult(output);
        } catch (e: any) {
            setResult(`Error: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Replay Agent: {log.toolName}</h3>
                        <p className="text-xs text-slate-500">Edit context variables and re-run execution</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                        <Icons.X />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <div className="space-y-4">
                        {isFetchingAgent ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                <span className="text-xs text-slate-500">Loading agent definition...</span>
                            </div>
                        ) : !agent ? (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                                Warning: Could not find original agent definition. Replay may not work as expected.
                            </div>
                        ) : (
                            <>
                                {/* Inputs Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Input Context</label>
                                        <button onClick={handleAddInput} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                            <Icons.Plus className="w-3 h-3" /> Add Variable
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {inputs.map((input) => (
                                            <div key={input.id} className="flex gap-2 items-center">
                                                <input 
                                                    type="text" 
                                                    placeholder="Name" 
                                                    className="w-1/3 text-xs border border-slate-200 rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none font-mono text-slate-600 bg-slate-50"
                                                    value={input.key}
                                                    onChange={(e) => handleInputChange(input.id, 'key', e.target.value)}
                                                />
                                                <input 
                                                    type="text" 
                                                    placeholder="Value" 
                                                    className="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-800"
                                                    value={input.value}
                                                    onChange={(e) => handleInputChange(input.id, 'value', e.target.value)}
                                                />
                                                <button 
                                                    onClick={() => handleRemoveInput(input.id)}
                                                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Remove input"
                                                >
                                                    <Icons.Trash className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                        {inputs.length === 0 && (
                                            <div className="text-xs text-slate-400 italic text-center py-2 bg-slate-50 rounded border border-dashed border-slate-200">
                                                No inputs defined.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Final Prompt Preview */}
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                            Final Prompt
                                            <span className="text-[10px] font-normal text-slate-400 normal-case bg-slate-100 px-1.5 py-0.5 rounded">Preview</span>
                                        </label>
                                        <button 
                                            onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                                            className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                                        >
                                            {isPromptExpanded ? 'Collapse' : 'Expand & Edit'}
                                            <Icons.ChevronDown className={`w-3 h-3 transition-transform ${isPromptExpanded ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                    
                                    {isPromptExpanded && (
                                        <div className="animate-in slide-in-from-top-1 duration-200">
                                            <textarea 
                                                className="w-full h-40 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                                placeholder="Generated prompt will appear here..."
                                            />
                                            <p className="text-[10px] text-slate-400 mt-1 italic">
                                                You can manually edit the final prompt sent to the model. Note: changing inputs above will overwrite manual edits.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Result Section */}
                                {(result || isLoading) && (
                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">New Output</label>
                                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[120px] max-h-[400px] overflow-y-auto text-sm text-slate-700 font-mono leading-relaxed relative">
                                            {isLoading ? (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[1px]">
                                                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                                                    <span className="text-xs text-indigo-600 font-medium animate-pulse">Running agent...</span>
                                                </div>
                                            ) : (
                                                <pre className="whitespace-pre-wrap font-sans">{result}</pre>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all">
                        Close
                    </button>
                    <button 
                        onClick={handleRun}
                        disabled={isLoading || !agent}
                        className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Running...' : 'Run Agent'}
                        {!isLoading && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AgentLogDetail: React.FC<AgentLogDetailProps> = ({ log }) => {
  const [isReplayModalOpen, setIsReplayModalOpen] = useState(false);

  const handleReplay = () => {
      setIsReplayModalOpen(true);
  };

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
                
                {/* Actions */}
                <button 
                    onClick={handleReplay}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Re-play
                </button>
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

        <ReplayAgentModal 
            isOpen={isReplayModalOpen} 
            onClose={() => setIsReplayModalOpen(false)} 
            log={log} 
        />
    </div>
  );
};
