
import React, { useState, useMemo } from 'react';
import { GuestGuideItem } from '../../../types';
import { Icons } from '../../../constants';

interface GuideSidebarProps {
  items: GuestGuideItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  onCreateNew: () => void;
}

export const GuideSidebar: React.FC<GuideSidebarProps> = ({ items, selectedItemId, onSelectItem, onCreateNew }) => {
  const [activeTab, setActiveTab] = useState<'Home' | 'Add-on' | 'Service' | 'My Info'>('Home');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
      const newSet = new Set(collapsedCategories);
      if (newSet.has(category)) newSet.delete(category);
      else newSet.add(category);
      setCollapsedCategories(newSet);
  };

  // Group items by category
  const groupedItems = useMemo(() => {
      const groups: Record<string, GuestGuideItem[]> = {};
      // Define sort order for categories if needed, otherwise natural order
      const order = ['Welcome', 'Access', 'Policy'];
      
      // Initialize groups
      order.forEach(cat => groups[cat] = []);
      
      items.forEach(item => {
          if (!groups[item.category]) groups[item.category] = [];
          groups[item.category].push(item);
      });
      return groups;
  }, [items]);

  const tabs = [
      { id: 'Home', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
      { id: 'Add-on', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
      { id: 'Service', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
      { id: 'My Info', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  ];

  return (
    <div className="w-80 flex flex-col bg-white border-r border-slate-200 h-full">
        {/* Tabs Header */}
        <div className="flex border-b border-slate-100">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex flex-col items-center justify-center py-4 text-[10px] font-medium transition-colors relative ${
                        activeTab === tab.id 
                        ? 'text-purple-600 bg-purple-50/50' 
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {tab.icon}
                    <span className="mt-1">{tab.id}</span>
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>}
                </button>
            ))}
        </div>

        {/* New Item Button */}
        <div className="p-4">
            <button 
                onClick={onCreateNew}
                className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 border border-transparent hover:border-indigo-200 hover:bg-indigo-50 rounded-lg transition-all"
            >
                <Icons.Plus className="w-4 h-4" /> New item
            </button>
        </div>

        {/* Guide List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4 space-y-6">
            {Object.entries(groupedItems).map(([category, catItems]) => {
                const isCollapsed = collapsedCategories.has(category);
                return (
                    <div key={category}>
                        <button 
                            onClick={() => toggleCategory(category)}
                            className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2 w-full text-left hover:text-indigo-600 transition-colors"
                        >
                            <Icons.ChevronDown className={`w-4 h-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                            {category}
                        </button>
                        
                        {!isCollapsed && (
                            <div className="space-y-2 pl-2">
                                {catItems.map(item => (
                                    <div 
                                        key={item.id}
                                        onClick={() => onSelectItem(item.id)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                            selectedItemId === item.id 
                                            ? 'border-purple-200 bg-purple-50 shadow-sm' 
                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="text-sm font-bold text-slate-900">{item.title}</div>
                                        <div className="text-xs text-slate-500 mt-0.5 truncate">{item.subtitle || 'No description'}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
  );
};
