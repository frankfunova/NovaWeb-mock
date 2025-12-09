
import React, { useState, useEffect } from 'react';
import { Agent } from '../../../types';
import { Icons } from '../../../constants';
import { api } from '../../../services/api';

interface AgentRunModalProps {
    isOpen: boolean;
    onClose: () => void;
    agent: Agent | null;
    initialInputs?: Record<string, any>;
    initialMessage?: string;
}

export const AgentRunModal: React.FC<AgentRunModalProps> = ({ 
    isOpen, 
    onClose, 
    agent, 
    initialInputs, 
    initialMessage = '' 
}) => {
    const [message, setMessage] = useState(initialMessage);
    const [inputs, setInputs] = useState<{ id: string, key: string, value: string }[]>([]);
    const [finalPrompt, setFinalPrompt] = useState('');
    const [isPromptExpanded, setIsPromptExpanded] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setResult(null);
            setIsLoading(false);
            setIsPromptExpanded(false);
            setMessage(initialMessage);
            
            // Populate inputs
            if (initialInputs) {
                const mappedInputs = Object.entries(initialInputs).map(([key, value]) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    key,
                    value: typeof value === 'object' ? JSON.stringify(value) : String(value)
                }));
                setInputs(mappedInputs);
            } else if (agent?.requiredInput) {
                // Pre-fill keys from agent definition if available
                const keys = new Set<string>();
                agent.requiredInput.forEach(group => group.forEach(k => keys.add(k)));
                const mappedInputs = Array.from(keys).map(key => ({
                    id: Math.random().toString(36).substr(2, 9),
                    key,
                    value: ''
                }));
                setInputs(mappedInputs);
            } else {
                setInputs([{ id: Math.random().toString(36).substr(2, 9), key: '', value: '' }]);
            }
        }
    }, [isOpen, agent, initialInputs, initialMessage]);

    // Update prompt when inputs or message change
    useEffect(() => {
        const inputStr = inputs.filter(i => i.key.trim()).map(i => `${i.key}: ${i.value}`).join('\n');
        let constructedPrompt = '';
        
        if (message.trim()) {
            constructedPrompt += message;
        }
        
        if (inputStr.trim()) {
            if (constructedPrompt) constructedPrompt += '\n\n';
            constructedPrompt += `Input Variables:\n${inputStr}`;
        }

        if (!constructedPrompt) {
            constructedPrompt = "Execute task based on system instructions.";
        }

        setFinalPrompt(constructedPrompt);
    }, [inputs, message]);

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
            const output = await api.runAgent(agent, finalPrompt);
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
                        <h3 className="text-sm font-bold text-slate-800">Run Agent: {agent?.name || 'Unknown Agent'}</h3>
                        <p className="text-xs text-slate-500">Test agent execution with custom inputs</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                        <Icons.X />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <div className="space-y-6">
                        {!agent ? (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                                Error: No agent definition provided.
                            </div>
                        ) : (
                            <>
                                {/* Message Input */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                                    <textarea 
                                        className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                        rows={3}
                                        placeholder="Enter a message to start the conversation or test the agent..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>

                                {/* Inputs Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Input Context</label>
                                        <button onClick={handleAddInput} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                            <Icons.Plus className="w-3 h-3" /> Add Variable
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        {inputs.map((input) => (
                                            <div key={input.id} className="flex gap-2 items-center">
                                                <input 
                                                    type="text" 
                                                    placeholder="Key" 
                                                    className="w-1/3 text-xs border border-slate-200 rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none font-mono text-slate-600 bg-white"
                                                    value={input.key}
                                                    onChange={(e) => handleInputChange(input.id, 'key', e.target.value)}
                                                />
                                                <input 
                                                    type="text" 
                                                    placeholder="Value" 
                                                    className="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-800 bg-white"
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
                                            <div className="text-xs text-slate-400 italic text-center py-2">
                                                No context variables defined.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Final Prompt Preview */}
                                <div className="border-t border-slate-100 pt-4">
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
                                                className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                                                value={finalPrompt}
                                                onChange={(e) => setFinalPrompt(e.target.value)}
                                                placeholder="Generated prompt will appear here..."
                                            />
                                            <p className="text-[10px] text-slate-400 mt-1 italic">
                                                Edits here are temporary for this run.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Result Section */}
                                {(result || isLoading) && (
                                    <div className="pt-4 border-t border-slate-100">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Output</label>
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
                        className="px-6 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Running...' : 'Run Agent'}
                        {!isLoading && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    </button>
                </div>
            </div>
        </div>
    );
};
