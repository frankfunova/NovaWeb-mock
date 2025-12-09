
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Agent, DynamicVariablesResponse, DynamicVariableEntity, McpTool } from '../../../types';
import { Icons } from '../../../constants';
import { api } from '../../../services/api';

interface AgentDetailProps {
  agent: Agent;
  isNew?: boolean;
  onSave?: (agent: Agent) => void;
  onCancel?: () => void;
}

// Mock Constants
const AVAILABLE_MODELS = [
    'gpt-4o', 
    'gpt-4-turbo', 
    'gpt-3.5-turbo', 
    'gemini-1.5-pro', 
    'gemini-2.5-flash', 
    'claude-3-opus', 
    'claude-3.5-sonnet'
];

const AGENT_TYPES = ['Structured', 'Customer Service', 'Operations', 'Marketing', 'Revenue Management'];

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

// --- Run Agent Modal ---

interface RunAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    agent: Agent;
}

const RunAgentModal: React.FC<RunAgentModalProps> = ({ isOpen, onClose, agent }) => {
    const [inputs, setInputs] = useState<{ id: string, key: string, value: string }[]>([]);
    const [prompt, setPrompt] = useState('');
    const [isPromptExpanded, setIsPromptExpanded] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setResult(null);
            setIsLoading(false);
            if (agent.requiredInput && agent.requiredInput.length > 0) {
                // Pre-fill with the first option of each required input group
                const initialInputs = agent.requiredInput.map(group => ({
                    id: Math.random().toString(36).substr(2, 9),
                    key: group[0] || '',
                    value: ''
                }));
                setInputs(initialInputs);
            } else {
                setInputs([{ id: Math.random().toString(36).substr(2, 9), key: '', value: '' }]);
            }
        }
    }, [isOpen, agent]);

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
                        <h3 className="text-sm font-bold text-slate-800">Run Agent: {agent.name}</h3>
                        <p className="text-xs text-slate-500">Provide input context to execute this agent</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                        <Icons.X />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <div className="space-y-4">
                        {/* Inputs Section */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content Inputs (Name-Value Pairs)</label>
                                <button onClick={handleAddInput} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                    <Icons.Plus className="w-3 h-3" /> Add Input
                                </button>
                            </div>
                            
                            <div className="space-y-2">
                                {inputs.map((input) => (
                                    <div key={input.id} className="flex gap-2 items-center">
                                        <input 
                                            type="text" 
                                            placeholder="Name (e.g. user_query)" 
                                            className="w-1/3 text-xs border border-slate-200 rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none font-mono text-slate-600 bg-slate-50"
                                            value={input.key}
                                            onChange={(e) => handleInputChange(input.id, 'key', e.target.value)}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Value (e.g. What is the wifi?)" 
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
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Agent Output</label>
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
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all">
                        Close
                    </button>
                    <button 
                        onClick={handleRun}
                        disabled={isLoading}
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

// --- Tool Selector Modal ---

interface ToolSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTools: string[];
    onSave: (tools: string[]) => void;
}

const ToolSelectorModal: React.FC<ToolSelectorModalProps> = ({ isOpen, onClose, selectedTools, onSave }) => {
    const [availableTools, setAvailableTools] = useState<McpTool[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSelection, setCurrentSelection] = useState<Set<string>>(new Set(selectedTools));

    useEffect(() => {
        if (isOpen) {
            setCurrentSelection(new Set(selectedTools));
            setSearchQuery('');
            const loadTools = async () => {
                setIsLoading(true);
                try {
                    const tools = await api.fetchMcpTools();
                    setAvailableTools(tools);
                } catch (e) {
                    console.error("Failed to load MCP tools", e);
                } finally {
                    setIsLoading(false);
                }
            };
            loadTools();
        }
    }, [isOpen, selectedTools]);

    const handleToggle = (toolName: string) => {
        const newSelection = new Set(currentSelection);
        if (newSelection.has(toolName)) {
            newSelection.delete(toolName);
        } else {
            newSelection.add(toolName);
        }
        setCurrentSelection(newSelection);
    };

    const handleSave = () => {
        onSave(Array.from(currentSelection));
        onClose();
    };

    const filteredTools = availableTools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Select MCP Tools</h3>
                        <p className="text-xs text-slate-500">Enable capabilities for this agent</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                        <Icons.X />
                    </button>
                </div>

                <div className="p-4 border-b border-slate-100 flex-shrink-0">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search tools..." 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                             <Icons.Search className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredTools.map(tool => (
                                <label 
                                    key={tool.name} 
                                    className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors ${currentSelection.has(tool.name) ? 'bg-indigo-50/30' : ''}`}
                                >
                                    <div className="pt-0.5">
                                        <input 
                                            type="checkbox" 
                                            checked={currentSelection.has(tool.name)}
                                            onChange={() => handleToggle(tool.name)}
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-slate-800 font-mono">{tool.name}</div>
                                        <div className="text-xs text-slate-500 mt-1 leading-relaxed">{tool.description}</div>
                                    </div>
                                </label>
                            ))}
                            {filteredTools.length === 0 && (
                                <div className="p-8 text-center text-slate-400 text-sm italic">
                                    No tools found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all">
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                    >
                        Save Selection ({currentSelection.size})
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Variable Selector Components ---

interface VariableSelectorProps {
    variables: DynamicVariableEntity[];
    onSelect: (template: string) => void;
}

const VariableSelector: React.FC<VariableSelectorProps> = ({ variables, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeEntity, setActiveEntity] = useState<string | null>(null);

    const handleEntityClick = (entityType: string) => {
        setActiveEntity(entityType);
    };

    return (
        <>
            <button 
                type="button" 
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded border border-indigo-100 transition-colors"
            >
                <span className="text-indigo-500">{`{ }`}</span> Insert Variable
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
                    
                    {/* Modal Content */}
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] relative z-10 flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-200">
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center flex-shrink-0">
                            <div>
                                <h3 className="text-base font-bold text-slate-800">Dynamic Variables</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Select a variable to insert into your prompt template</p>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <Icons.X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-1 min-h-0">
                            {/* Left Column: Entities */}
                            <div className="w-40 border-r border-slate-200 bg-slate-50/30 overflow-y-auto custom-scrollbar p-3">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Entities</div>
                                <div className="space-y-1">
                                    {variables.map(entity => (
                                        <button
                                            key={entity.entity_type}
                                            onClick={() => handleEntityClick(entity.entity_type)}
                                            className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                                                activeEntity === entity.entity_type 
                                                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="capitalize truncate">{entity.entity_type.replace('_', ' ')}</span>
                                                {activeEntity === entity.entity_type && <Icons.ChevronRight className="w-4 h-4 text-indigo-500 flex-shrink-0" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column: Fields */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white p-4">
                                {activeEntity ? (
                                    <div className="max-w-4xl mx-auto">
                                         <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Fields</span>
                                            <span className="text-xs text-slate-300">•</span>
                                            <span className="text-xs font-bold text-indigo-600 capitalize">{activeEntity.replace('_', ' ')}</span>
                                         </div>
                                         <div className="grid grid-cols-1 gap-2">
                                            {variables.find(e => e.entity_type === activeEntity)?.fields.map(field => (
                                                <button
                                                    key={field.code}
                                                    onClick={() => {
                                                        onSelect(field.template);
                                                        setIsOpen(false);
                                                    }}
                                                    className="w-full text-left p-3 hover:bg-indigo-50/50 rounded-xl transition-all group border border-slate-100 hover:border-indigo-200 hover:shadow-sm"
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 font-mono">{field.code}</span>
                                                        </div>
                                                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded group-hover:bg-white group-hover:text-indigo-600 border border-slate-200 group-hover:border-indigo-100 transition-colors">
                                                            {field.template}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 group-hover:text-indigo-600/80">{field.description}</div>
                                                </button>
                                            ))}
                                         </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-3">
                                        <div className="p-4 bg-slate-50 rounded-full">
                                            <Icons.Queue className="w-8 h-8" />
                                        </div>
                                        <span className="text-sm font-medium">Select an entity from the list to view variables</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

interface TextareaWithVariablesProps {
    value: string;
    onChange: (value: string) => void;
    rows?: number;
    placeholder?: string;
    className?: string;
    availableVariables: DynamicVariableEntity[];
}

const TextareaWithVariables: React.FC<TextareaWithVariablesProps> = ({ 
    value, 
    onChange, 
    rows = 3, 
    placeholder, 
    className,
    availableVariables 
}) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleInsert = (template: string) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = text.substring(0, start) + template + text.substring(end);
        
        onChange(newText);
        
        // Restore focus and cursor position after React re-render
        setTimeout(() => {
            if (textAreaRef.current) {
                textAreaRef.current.focus();
                const newCursorPos = start + template.length;
                textAreaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    return (
        <div className="relative">
            <textarea 
                ref={textAreaRef}
                className={className}
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            <div className="absolute bottom-2 right-2">
                <VariableSelector variables={availableVariables} onSelect={handleInsert} />
            </div>
        </div>
    );
};


export const AgentDetail: React.FC<AgentDetailProps> = ({ agent: initialAgent, isNew = false, onSave, onCancel }) => {
  const [agent, setAgent] = useState(initialAgent);
  const [isEditing, setIsEditing] = useState(isNew || false);
  const [formData, setFormData] = useState(initialAgent);
  
  // UI States for editing
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [metadataJson, setMetadataJson] = useState('');
  const [metadataError, setMetadataError] = useState<string | null>(null);
  
  // Optimization State
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Run Modal State
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);

  // Dynamic Variables
  const [dynamicVariables, setDynamicVariables] = useState<DynamicVariableEntity[]>([]);

  useEffect(() => {
    setAgent(initialAgent);
    setFormData(initialAgent);
    setIsEditing(isNew || false); 
  }, [initialAgent, isNew]);
  
  // Initialize metadata JSON string when entering edit mode
  useEffect(() => {
      if (isEditing) {
          const meta = {
              extra_info: formData.extraInfo || {},
              output_schema: formData.outputSchema || null
          };
          setMetadataJson(JSON.stringify(meta, null, 2));

          // Fetch dynamic variables if not loaded
          if (dynamicVariables.length === 0) {
              api.fetchDynamicVariables().then(response => {
                  setDynamicVariables(response.entities);
              }).catch(err => console.error("Failed to load variables", err));
          }
      }
  }, [isEditing]);

  const handleSave = () => {
      try {
          const parsedMeta = JSON.parse(metadataJson);
          const updatedAgent = {
              ...formData,
              extraInfo: parsedMeta.extra_info,
              outputSchema: parsedMeta.output_schema
          };
          
          if (onSave) {
              onSave(updatedAgent);
          } else {
              setAgent(updatedAgent);
              setFormData(updatedAgent);
              setIsEditing(false);
              setMetadataError(null);
              // In real app, api call here
          }
      } catch (e) {
          setMetadataError("Invalid JSON format in Metadata");
          return; // Stop save if invalid JSON
      }
  };

  const handleCancel = () => {
      if (onCancel) {
          onCancel();
      } else {
          setFormData(agent);
          setIsEditing(false);
          setMetadataError(null);
      }
  };

  const handleRun = () => {
      setIsRunModalOpen(true);
  };

  const handleOptimize = async () => {
      if (!formData.name && !formData.description) return;
      setIsOptimizing(true);
      try {
          const result = await api.generateAgentConfig(formData.name, formData.description, formData.expectedOutput || '');
          setFormData(prev => ({
              ...prev,
              optimizedDescription: result.optimizedDescription
          }));
      } catch (error) {
          console.error("Optimization failed", error);
      } finally {
          setIsOptimizing(false);
      }
  };

  // --- Render Logic for Create Mode (New Design) ---
  if (isNew) {
      return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-24">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Agent Name <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                    placeholder="e.g. Reservation Assistant"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    rows={3}
                                    placeholder="Describe what this agent does..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Expected Output</label>
                                <textarea 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    rows={2}
                                    placeholder="e.g. JSON object with fields..."
                                    value={formData.expectedOutput || ''}
                                    onChange={(e) => setFormData({...formData, expectedOutput: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Prompt Engineering Section (Visible after Optimize or manually expanded) */}
                    {(formData.optimizedDescription || isOptimizing) && (
                        <div className="pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-indigo-50 border border-indigo-100 w-fit rounded-md">
                                <div className="w-4 h-4 text-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" /></svg>
                                </div>
                                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">PROMPT ENGINEERING</span>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">Optimized Prompt</label>
                                {isOptimizing ? (
                                    <div className="h-40 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-xs">Generating optimal instructions...</span>
                                    </div>
                                ) : (
                                    <TextareaWithVariables 
                                        className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-700 font-mono text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-60"
                                        rows={10}
                                        value={formData.optimizedDescription || ''}
                                        onChange={(val) => setFormData({...formData, optimizedDescription: val})}
                                        placeholder="Enter instructions for the agent..."
                                        availableVariables={dynamicVariables}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Advanced Settings */}
                    <CollapsibleSection title="Advanced Setting" icon={<Icons.Settings className="w-4 h-4"/>} defaultOpen={false}>
                        <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Agent Type</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full text-sm font-medium text-slate-700 bg-white border border-slate-300 px-3 py-2 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                                            value={formData.agentType}
                                            onChange={(e) => setFormData({...formData, agentType: e.target.value})}
                                        >
                                            {AGENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <Icons.ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">LLM Model</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full text-sm font-medium text-slate-700 bg-white border border-slate-300 px-3 py-2 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                                            value={formData.modelName || ''}
                                            onChange={(e) => setFormData({...formData, modelName: e.target.value})}
                                        >
                                            <option value="" disabled>Select a model</option>
                                            {AVAILABLE_MODELS.map(model => (
                                                <option key={model} value={model}>{model}</option>
                                            ))}
                                        </select>
                                        <Icons.ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Tools Sub-Section */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tools & Inputs</label>
                                    <button 
                                        onClick={() => setIsToolModalOpen(true)}
                                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
                                    >
                                        Modify
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tools.length > 0 ? formData.tools.map(tool => (
                                        <span key={tool} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono text-slate-600 shadow-sm">
                                            {tool}
                                        </span>
                                    )) : <span className="text-slate-400 text-xs italic">No tools selected</span>}
                                </div>
                            </div>

                            {/* Metadata Sub-Section */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Raw Metadata</label>
                                <textarea 
                                    className="w-full bg-slate-900 text-slate-300 rounded-lg p-3 text-[10px] font-mono outline-none border border-slate-700 focus:border-indigo-500 resize-none"
                                    rows={6}
                                    value={metadataJson}
                                    onChange={(e) => {
                                        setMetadataJson(e.target.value);
                                        setMetadataError(null);
                                    }}
                                    spellCheck={false}
                                />
                                {metadataError && (
                                    <div className="text-red-500 text-xs mt-1 font-bold">{metadataError}</div>
                                )}
                            </div>
                        </div>
                    </CollapsibleSection>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="activateAgent" 
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        />
                        <label htmlFor="activateAgent" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                            Activate this agent
                        </label>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleOptimize}
                            className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all flex items-center gap-1.5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" /></svg>
                            Optimize
                        </button>
                        <button 
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 border border-slate-300 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="px-6 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-all"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>

            <ToolSelectorModal
                isOpen={isToolModalOpen}
                onClose={() => setIsToolModalOpen(false)}
                selectedTools={formData.tools}
                onSave={(newTools) => setFormData({ ...formData, tools: newTools })}
            />
        </div>
      );
  }

  // --- Render Logic for View/Edit Mode (Existing Design) ---
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-white flex-shrink-0 shadow-sm z-10">
            <div className="flex justify-between items-start">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                        <Icons.Bot />
                    </div>
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <input 
                                type="text"
                                className="w-full text-xl font-bold text-slate-900 border-b border-indigo-300 focus:border-indigo-600 outline-none bg-transparent px-1 mb-1"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Agent Name"
                            />
                        ) : (
                            <h2 className="text-xl font-bold text-slate-900 truncate">{agent.name}</h2>
                        )}
                        
                        <div className="flex items-center gap-2 mt-1">
                            {isEditing ? (
                                <>
                                    <div className="relative">
                                        <select 
                                            className="appearance-none text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 pr-6 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                                            value={formData.agentType}
                                            onChange={(e) => setFormData({...formData, agentType: e.target.value})}
                                        >
                                            {AGENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <Icons.ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>

                                    <span className="text-slate-300">•</span>

                                    <div className="relative">
                                        <select
                                            className={`appearance-none text-xs font-bold bg-slate-50 border border-slate-200 rounded-md px-2 py-1 pr-6 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer ${formData.isActive ? 'text-emerald-600' : 'text-slate-500'}`}
                                            value={formData.isActive ? 'active' : 'inactive'}
                                            onChange={(e) => setFormData({...formData, isActive: e.target.value === 'active'})}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                        <Icons.ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className="text-xs font-medium text-slate-500">{agent.agentType}</span>
                                    <span className="text-slate-300">•</span>
                                    <span className={`flex items-center gap-1 text-xs font-bold ${agent.isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${agent.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                                        {agent.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                    <button 
                        onClick={handleRun}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Run
                    </button>

                    {isEditing ? (
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                            <button 
                                onClick={handleCancel}
                                className="px-3 py-1 text-xs font-bold text-slate-600 hover:bg-white rounded-md transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-3 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-all"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                        >
                            <Icons.Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            
            {/* General Info */}
            <div className="p-6">
                <div className="mb-4">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                    {isEditing ? (
                         <TextareaWithVariables 
                            className="w-full text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                            rows={3}
                            value={formData.description}
                            onChange={(val) => setFormData({...formData, description: val})}
                            availableVariables={dynamicVariables}
                            placeholder="Describe what this agent does..."
                        />
                    ) : (
                        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                            {agent.description}
                        </p>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Model</label>
                        {isEditing ? (
                            <div className="relative">
                                <select 
                                    className="w-full text-sm font-bold text-slate-800 bg-white border border-slate-300 px-3 py-2 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                                    value={formData.modelName || ''}
                                    onChange={(e) => setFormData({...formData, modelName: e.target.value})}
                                >
                                    <option value="" disabled>Select a model</option>
                                    {AVAILABLE_MODELS.map(model => (
                                        <option key={model} value={model}>{model}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <Icons.ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm font-bold text-slate-800 flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                {agent.modelName || 'Default Model'}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Last Updated</label>
                        <div className="text-sm text-slate-600 px-3 py-2">
                            {agent.updatedAt ? new Date(agent.updatedAt).toLocaleString() : 'Never'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Prompt Settings */}
            <CollapsibleSection title="Prompt Engineering" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">Optimized Prompt</label>
                        {isEditing ? (
                             <TextareaWithVariables 
                                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-700 font-mono text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                rows={8}
                                value={formData.optimizedDescription || ''}
                                onChange={(val) => setFormData({...formData, optimizedDescription: val})}
                                placeholder="Enter instructions for the agent..."
                                availableVariables={dynamicVariables}
                            />
                        ) : (
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                                {agent.optimizedDescription || <span className="text-slate-400 italic">No instructions set.</span>}
                            </div>
                        )}
                    </div>
                    {(agent.expectedOutput || isEditing) && (
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">Expected Output Format</label>
                             {isEditing ? (
                                <textarea 
                                    className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-600 font-mono focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    rows={3}
                                    value={formData.expectedOutput || ''}
                                    onChange={(e) => setFormData({...formData, expectedOutput: e.target.value})}
                                    placeholder="e.g. JSON object with fields..."
                                />
                             ) : (
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-600 italic whitespace-pre-wrap">
                                    {agent.expectedOutput}
                                </div>
                             )}
                        </div>
                    )}
                </div>
            </CollapsibleSection>

            {/* Configuration */}
            <CollapsibleSection 
                title="Tools & Inputs" 
                icon={<Icons.Settings className="w-4 h-4"/>}
                action={isEditing ? (
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsToolModalOpen(true); }}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2 py-1 rounded transition-colors"
                    >
                        Modify
                    </button>
                ) : null}
            >
                <div className="space-y-4 pt-1">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-2">Enabled Tools</label>
                        <div className="flex flex-wrap gap-2">
                            {(isEditing ? formData.tools : agent.tools).map(tool => (
                                <span key={tool} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono text-slate-600 shadow-sm flex items-center gap-1.5">
                                    <svg className="w-3 h-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {tool}
                                </span>
                            ))}
                            {(isEditing ? formData.tools : agent.tools).length === 0 && <span className="text-slate-400 text-xs italic">No tools configured.</span>}
                        </div>
                    </div>

                    {!isEditing && (
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
                    )}
                </div>
            </CollapsibleSection>

            {/* Metadata (JSON) */}
            <CollapsibleSection title="Raw Metadata" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>} defaultOpen={false}>
                {isEditing ? (
                    <div>
                         <textarea 
                            className="w-full bg-slate-900 text-slate-300 rounded-lg p-3 text-[10px] font-mono outline-none border border-slate-700 focus:border-indigo-500 resize-none"
                            rows={10}
                            value={metadataJson}
                            onChange={(e) => {
                                setMetadataJson(e.target.value);
                                setMetadataError(null);
                            }}
                            spellCheck={false}
                        />
                        {metadataError && (
                            <div className="text-red-500 text-xs mt-1 font-bold">{metadataError}</div>
                        )}
                        <div className="text-slate-400 text-[10px] mt-1 italic">
                            Editable fields: extra_info, output_schema
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-900 rounded-lg p-3 text-[10px] text-slate-300 font-mono overflow-x-auto">
                        <pre>{JSON.stringify({ 
                            id: agent.id, 
                            tenant_id: '12345', 
                            extra_info: agent.extraInfo || {}, 
                            output_schema: agent.outputSchema || null 
                        }, null, 2)}</pre>
                    </div>
                )}
            </CollapsibleSection>
        </div>

        <RunAgentModal 
            isOpen={isRunModalOpen} 
            onClose={() => setIsRunModalOpen(false)} 
            agent={agent} 
        />

        <ToolSelectorModal
            isOpen={isToolModalOpen}
            onClose={() => setIsToolModalOpen(false)}
            selectedTools={formData.tools}
            onSave={(newTools) => setFormData({ ...formData, tools: newTools })}
        />
    </div>
  );
};
