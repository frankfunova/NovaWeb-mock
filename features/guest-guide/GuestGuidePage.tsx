
import React, { useState, useEffect } from 'react';
import { GuideSidebar } from './components/GuideSidebar';
import { MobilePreview } from './components/MobilePreview';
import { api } from '../../services/api';
import { GuestGuideItem } from '../../types';
import { Icons } from '../../constants';

export const GuestGuidePage: React.FC = () => {
  const [items, setItems] = useState<GuestGuideItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await api.fetchGuestGuide();
        setItems(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreateNew = () => {
      const newItem: GuestGuideItem = {
          id: `new-${Date.now()}`,
          title: 'New Guide Item',
          category: 'Welcome',
          subtitle: 'Description goes here'
      };
      setItems([...items, newItem]);
      setSelectedItemId(newItem.id);
  };

  const selectedItem = items.find(i => i.id === selectedItemId);

  if (isLoading) {
      return (
          <div className="flex-1 flex items-center justify-center h-full bg-white">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-slate-500 font-medium">Loading guide...</span>
          </div>
      );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-white">
        
        {/* Left Sidebar */}
        <GuideSidebar 
            items={items}
            selectedItemId={selectedItemId}
            onSelectItem={setSelectedItemId}
            onCreateNew={handleCreateNew}
        />

        {/* Middle Editor Area */}
        <div className="flex-1 flex flex-col border-r border-slate-200 min-w-0 relative bg-white">
            {selectedItem ? (
                <div className="p-8 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Item</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                            <input 
                                type="text" 
                                className="w-full text-lg font-bold border-b border-slate-200 py-2 focus:border-indigo-500 focus:outline-none transition-colors bg-transparent"
                                value={selectedItem.title}
                                onChange={(e) => {
                                    const updated = { ...selectedItem, title: e.target.value };
                                    setItems(items.map(i => i.id === selectedItem.id ? updated : i));
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subtitle</label>
                            <input 
                                type="text" 
                                className="w-full text-sm text-slate-600 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                value={selectedItem.subtitle || ''}
                                onChange={(e) => {
                                    const updated = { ...selectedItem, subtitle: e.target.value };
                                    setItems(items.map(i => i.id === selectedItem.id ? updated : i));
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                            <select 
                                className="w-full text-sm text-slate-600 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                                value={selectedItem.category}
                                onChange={(e) => {
                                    const updated = { ...selectedItem, category: e.target.value as any };
                                    setItems(items.map(i => i.id === selectedItem.id ? updated : i));
                                }}
                            >
                                <option value="Welcome">Welcome</option>
                                <option value="Access">Access</option>
                                <option value="Policy">Policy</option>
                                <option value="House Manual">House Manual</option>
                                <option value="Local">Local</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Content</label>
                            <textarea 
                                rows={8}
                                className="w-full text-sm text-slate-700 border border-slate-200 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none leading-relaxed"
                                value={selectedItem.content || ''}
                                onChange={(e) => {
                                    const updated = { ...selectedItem, content: e.target.value };
                                    setItems(items.map(i => i.id === selectedItem.id ? updated : i));
                                }}
                                placeholder="Enter the details for this guide item..."
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Icons.BookOpen className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Select a guide item</h3>
                    <p className="text-slate-500 max-w-xs mb-6">Choose an item from the sidebar to edit its content or create a new one.</p>
                    <button 
                        onClick={handleCreateNew}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-sm transition-all"
                    >
                        Create New Item
                    </button>
                </div>
            )}
        </div>

        {/* Right Mobile Preview */}
        <div className="w-[400px] flex-shrink-0 border-l border-slate-200 bg-slate-50 hidden xl:block">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                <h3 className="text-sm font-bold text-slate-800">Mobile Preview</h3>
                <div className="flex gap-2">
                    <button className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg></button>
                    <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></button>
                </div>
            </div>
            <MobilePreview items={items} />
        </div>

    </div>
  );
};
