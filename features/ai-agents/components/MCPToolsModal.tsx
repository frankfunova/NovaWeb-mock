
import React, { useState, useEffect } from 'react';
import { McpTool } from '../../../types';
import { Icons } from '../../../constants';

interface MCPToolsModalProps {
    isOpen: boolean;
    onClose: () => void;
    tools: McpTool[];
    selectedTools: string[];
    onSave: (tools: string[]) => void;
}

export const MCPToolsModal: React.FC<MCPToolsModalProps> = ({ isOpen, onClose, tools, selectedTools, onSave }) => {
    const [search, setSearch] = useState('');
    const [selection, setSelection] = useState<Set<string>>(new Set(selectedTools));

    useEffect(() => {
        if (isOpen) {
            setSelection(new Set(selectedTools));
            setSearch('');
        }
    }, [isOpen, selectedTools]);

    const filteredTools = tools.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        t.description.toLowerCase().includes(search.toLowerCase())
    );

    const toggleTool = (name: string) => {
        const next = new Set(selection);
        if (next.has(name)) next.delete(name);
        else next.add(name);
        setSelection(next);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-white">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Select MCP Tools</h3>
                        <p className="text-sm text-slate-500">Enable capabilities for this agent</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                        <Icons.X />
                    </button>
                </div>
                
                <div className="p-4 border-b border-slate-100 bg-white">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Icons.Search className="w-4 h-4" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search tools..." 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredTools.map(tool => (
                        <div 
                            key={tool.name}
                            className="flex items-start gap-3 p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                            onClick={() => toggleTool(tool.name)}
                        >
                            <div className="pt-0.5">
                                <input 
                                    type="checkbox" 
                                    checked={selection.has(tool.name)}
                                    readOnly
                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-bold text-slate-800">{tool.name}</div>
                                <div className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-3">{tool.description}</div>
                            </div>
                        </div>
                    ))}
                    {filteredTools.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm">No tools found matching your search.</div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => onSave(Array.from(selection))}
                        className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                    >
                        Save Selection ({selection.size})
                    </button>
                </div>
            </div>
        </div>
    );
};
