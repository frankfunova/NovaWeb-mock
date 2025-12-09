
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Agent, DynamicVariableEntity, McpTool } from '../../../types';
import { Icons } from '../../../constants';
import { api } from '../../../services/api';
import { VariableModal } from './VariableModal';
import { MCPToolsModal } from './MCPToolsModal';
import { AgentRunModal } from './AgentRunModal';

// --- Helper Components ---

interface TextareaWithVariablesProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    value: string;
    onChange: (value: string) => void; 
    onOpenModal: () => void;
    label?: string;
    rows?: number;
}

const TextareaWithVariables: React.FC<TextareaWithVariablesProps> = ({ value, onChange, onOpenModal, label, className, rows = 4, ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>}
            <div className="relative">
                <textarea
                    className={`w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none pb-10 ${className}`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={rows}
                    {...props}
                />
                <button 
                    type="button"
                    onClick={onOpenModal}
                    className="absolute bottom-3 right-3 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-md transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm border border-indigo-100"
                    title="Insert Dynamic Variable"
                >
                    <span className="font-mono text-[10px]">{`{ }`}</span>
                    Insert Variable
                </button>
            </div>
        </div>
    );
};

interface AgentDetailProps {
  agent: Agent;
  isNew?: boolean;
  onSave?: (agent: Agent) => void;
  onCancel?: () => void;
}

export const AgentDetail: React.FC<AgentDetailProps> = ({ agent, isNew, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Agent>(agent);
    const [dynamicVariables, setDynamicVariables] = useState<DynamicVariableEntity[]>([]);
    const [availableTools, setAvailableTools] = useState<McpTool[]>([]);
    
    // UI State
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [isPromptEngineeringOpen, setIsPromptEngineeringOpen] = useState(true);
    const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);
    const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
    const [isRunModalOpen, setIsRunModalOpen] = useState(false);
    
    const [activeField, setActiveField] = useState<'description' | 'optimizedDescription' | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);

    useEffect(() => {
        setFormData(agent);
    }, [agent]);

    // Check if required fields are present (Name & Description)
    const isRequiredMissing = !formData.name?.trim() || !formData.description?.trim();

    // Check if form data has changed
    const isDirty = useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify(agent);
    }, [formData, agent]);

    // Button states
    const isRunDisabled = isRequiredMissing;
    const isSaveDisabled = isRequiredMissing || (!isNew && !isDirty);

    useEffect(() => {
        const loadMetadata = async () => {
            try {
                const [vars, tools] = await Promise.all([
                    api.fetchDynamicVariables(),
                    api.fetchMcpTools()
                ]);
                setDynamicVariables(vars.entities);
                setAvailableTools(tools);
            } catch (e) {
                console.error("Failed to load metadata", e);
            }
        };
        loadMetadata();
    }, []);

    const handleOptimize = async () => {
        setIsOptimizing(true);
        try {
            const result = await api.generateAgentConfig(formData.name, formData.description, formData.expectedOutput || '');
            setFormData(prev => ({
                ...prev,
                optimizedDescription: result.optimizedDescription
            }));
            if (!isPromptEngineeringOpen) setIsPromptEngineeringOpen(true);
        } catch (e) {
            console.error("Optimization failed", e);
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleToolsSave = (selected: string[]) => {
        setFormData({ ...formData, tools: selected });
        setIsToolsModalOpen(false);
    };

    // Variable Insertion Logic
    const openVariableModal = (field: 'description' | 'optimizedDescription') => {
        setActiveField(field);
        setIsVariableModalOpen(true);
    };

    const handleVariableSelect = (variable: string) => {
        if (!activeField) return;
        
        const currentValue = formData[activeField] || '';
        const newValue = currentValue + (currentValue.length > 0 && !currentValue.endsWith(' ') ? ' ' : '') + variable;
        
        setFormData(prev => ({ ...prev, [activeField]: newValue }));
        setIsVariableModalOpen(false);
        setActiveField(null);
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-24">
                <div className="space-y-6">
                    
                    {/* Header Row: Agent Name + Run Button */}
                    <div className="flex items-end justify-between gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Agent Name <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Reservation Assistant"
                            />
                        </div>
                        <button 
                            onClick={() => setIsRunModalOpen(true)}
                            disabled={isRunDisabled}
                            className={`h-[42px] px-4 text-sm font-bold rounded-lg flex items-center gap-2 shadow-sm transition-colors ${
                                isRunDisabled 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                            title={isRunDisabled ? "Please enter Agent Name and Description to run" : "Run Agent"}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Run
                        </button>
                    </div>

                    {/* Description */}
                    <TextareaWithVariables 
                        label="Description"
                        value={formData.description}
                        onChange={(val) => setFormData({...formData, description: val})}
                        onOpenModal={() => openVariableModal('description')}
                        placeholder="Describe what this agent does..."
                        rows={4}
                    />

                    {/* Expected Output */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Expected Output</label>
                        <textarea 
                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            rows={3}
                            placeholder="e.g. JSON object with fields..."
                            value={formData.expectedOutput || ''}
                            onChange={(e) => setFormData({...formData, expectedOutput: e.target.value})}
                        />
                    </div>

                    {/* Prompt Engineering Section */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden transition-all duration-300">
                        <div 
                            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-100/50 transition-colors select-none border-b border-transparent data-[open=true]:border-slate-100"
                            onClick={() => setIsPromptEngineeringOpen(!isPromptEngineeringOpen)}
                            data-open={isPromptEngineeringOpen}
                        >
                            <div className="flex items-center gap-2">
                                <Icons.ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isPromptEngineeringOpen ? 'rotate-90' : ''}`} />
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Icons.StarFilled className="w-3 h-3" /> Prompt Engineering
                                </span>
                            </div>
                            
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOptimize();
                                }}
                                disabled={isOptimizing || !formData.description}
                                className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isOptimizing ? <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div> : <Icons.StarFilled className="w-3 h-3" />}
                                Optimize
                            </button>
                        </div>
                        
                        {isPromptEngineeringOpen && (
                            <div className="px-5 pb-5 pt-4 animate-in slide-in-from-top-2 duration-200 border-t border-slate-100">
                                <TextareaWithVariables 
                                    value={formData.optimizedDescription || ''}
                                    onChange={(val) => setFormData({...formData, optimizedDescription: val})}
                                    onOpenModal={() => openVariableModal('optimizedDescription')}
                                    placeholder="Detailed system instructions will appear here..."
                                    rows={8}
                                    className="font-mono text-slate-700 bg-white"
                                />
                            </div>
                        )}
                    </div>

                    {/* Advanced Settings */}
                    <div className="border-t border-slate-100 pt-4">
                        <button 
                            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-wider hover:bg-slate-50 hover:text-slate-700 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Icons.Settings className="w-4 h-4" />
                                Advanced Settings
                            </div>
                            <Icons.ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isAdvancedOpen ? 'rotate-90' : ''}`} />
                        </button>

                        {isAdvancedOpen && (
                            <div className="mt-4 space-y-6 animate-in slide-in-from-top-2 duration-200 pl-1">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Agent Type</label>
                                        <select 
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                            value={formData.agentType}
                                            onChange={(e) => setFormData({...formData, agentType: e.target.value})}
                                        >
                                            <option>Structured</option>
                                            <option>Free-form</option>
                                            <option>Chat</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">LLM Model</label>
                                        <select 
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                            value={formData.modelName}
                                            onChange={(e) => setFormData({...formData, modelName: e.target.value})}
                                        >
                                            <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                                            <option value="gpt-4o">gpt-4o</option>
                                            <option value="gpt-4-turbo">gpt-4-turbo</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Tools & Inputs</label>
                                        <button 
                                            onClick={() => setIsToolsModalOpen(true)}
                                            className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
                                        >
                                            Modify
                                        </button>
                                    </div>
                                    <div className="text-sm text-slate-400 italic">
                                        {formData.tools && formData.tools.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {formData.tools.map(t => (
                                                    <span key={t} className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-600 text-xs font-mono">{t}</span>
                                                ))}
                                            </div>
                                        ) : 'No tools selected'}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Raw Metadata</label>
                                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                                        <pre>{`{
  "extra_info": {},
  "output_schema": null
}`}</pre>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-between items-center flex-shrink-0 absolute bottom-0 left-0 right-0 z-20">
                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id="activate" 
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <label htmlFor="activate" className="text-sm font-medium text-slate-700 cursor-pointer">Activate this agent</label>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => onSave && onSave(formData)}
                        disabled={isSaveDisabled}
                        className={`px-6 py-2 text-sm font-bold text-white rounded-lg shadow-sm transition-colors ${
                            isSaveDisabled 
                            ? 'bg-purple-300 cursor-not-allowed opacity-70' 
                            : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                        title={isRequiredMissing ? "Please enter Agent Name and Description" : ""}
                    >
                        {isNew ? 'Create' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Modals */}
            <VariableModal 
                isOpen={isVariableModalOpen} 
                onClose={() => setIsVariableModalOpen(false)} 
                onSelect={handleVariableSelect}
                entities={dynamicVariables}
            />

            <MCPToolsModal 
                isOpen={isToolsModalOpen}
                onClose={() => setIsToolsModalOpen(false)}
                tools={availableTools}
                selectedTools={formData.tools || []}
                onSave={handleToolsSave}
            />

            <AgentRunModal 
                isOpen={isRunModalOpen}
                onClose={() => setIsRunModalOpen(false)}
                agent={formData}
            />
        </div>
    );
};
