
import React, { useState, useEffect } from 'react';
import { Icons } from '../../../constants';
import { DynamicVariableEntity } from '../../../types';

interface VariableModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (variable: string) => void;
    entities: DynamicVariableEntity[];
}

export const VariableModal: React.FC<VariableModalProps> = ({ isOpen, onClose, onSelect, entities }) => {
    const [selectedEntityKey, setSelectedEntityKey] = useState<string | null>(null);

    // Default to first entity if available and none selected
    useEffect(() => {
        if (isOpen && !selectedEntityKey && entities.length > 0) {
            setSelectedEntityKey(entities[0].input_key);
        }
    }, [isOpen, entities, selectedEntityKey]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const selectedEntity = entities.find(e => e.input_key === selectedEntityKey);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[500px] flex flex-col relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Dynamic Variables</h3>
                        <p className="text-xs text-slate-500">Select a variable to insert into your prompt template</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors">
                        <Icons.X />
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-48 bg-slate-50 border-r border-slate-100 flex flex-col py-4 overflow-y-auto">
                        <div className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">ENTITIES</div>
                        {entities.map(entity => (
                            <button
                                key={entity.input_key}
                                onClick={() => setSelectedEntityKey(entity.input_key)}
                                className={`px-4 py-3 text-left text-sm font-medium transition-colors border-l-2 ${
                                    selectedEntityKey === entity.input_key
                                    ? 'bg-white text-indigo-600 border-indigo-600'
                                    : 'text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                <span className="capitalize">{entity.entity_type.replace('_', ' ')}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white overflow-y-auto p-0">
                        {selectedEntity ? (
                            <div className="divide-y divide-slate-50">
                                {selectedEntity.fields.map(field => (
                                    <div 
                                        key={field.code}
                                        onClick={() => onSelect(field.template)}
                                        className="p-4 hover:bg-indigo-50/50 cursor-pointer transition-colors group flex items-start justify-between gap-4"
                                    >
                                        <div>
                                            <div className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit mb-1 group-hover:bg-indigo-100 transition-colors">
                                                {field.template}
                                            </div>
                                            <div className="text-sm text-slate-600">{field.description}</div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 text-indigo-500 self-center">
                                            <Icons.Plus className="w-5 h-5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" /></svg>
                                </div>
                                <p className="text-sm">Select an entity from the list to view variables</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
