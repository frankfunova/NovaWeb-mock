
import React, { useState } from 'react';
import { InboxThread } from '../../../types';
import { Icons } from '../../../constants';

interface InboxSidebarProps {
  threads: InboxThread[];
  selectedThreadId: string | null;
  onSelectThread: (thread: InboxThread) => void;
}

export const InboxSidebar: React.FC<InboxSidebarProps> = ({ threads, selectedThreadId, onSelectThread }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Current' | 'Unresolved'>('All');

  const formatRange = (start: string, end: string) => {
      const s = new Date(start);
      const e = new Date(end);
      return `${s.toLocaleDateString('en-US', {month: 'numeric', day: 'numeric'})}-${e.toLocaleDateString('en-US', {month: 'numeric', day: 'numeric'})}`;
  };

  const filteredThreads = threads.filter(t => {
      if (activeTab === 'Unresolved') return t.tags.some(tag => tag.includes('unresolved'));
      return true;
  });

  return (
    <div className="w-[300px] flex flex-col border-r border-slate-200 bg-white h-full flex-shrink-0 transition-all duration-300">
      
      {/* Header Controls */}
      <div className="p-3 pb-2 space-y-2 border-b border-slate-100">
         <div className="flex items-center justify-between gap-1 bg-slate-100 p-0.5 rounded-lg">
            {['All', 'Current', 'Unresolved'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${
                        activeTab === tab 
                        ? 'bg-white text-slate-800 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    {tab}
                </button>
            ))}
         </div>

         <div className="flex items-center gap-2">
             <div className="relative flex-1">
                 <input 
                    type="text" 
                    placeholder="Search..."
                    className="w-full pl-7 pr-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                 />
                 <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <button className="p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-600 flex items-center gap-1 text-xs font-medium">
                 <div className="w-3.5 h-3.5"><Icons.Filter /></div>
             </button>
         </div>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredThreads.map(thread => (
              <div 
                key={thread.id}
                onClick={() => onSelectThread(thread)}
                className={`px-3 py-2.5 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors group ${
                    selectedThreadId === thread.id ? 'bg-purple-50/60 hover:bg-purple-50/80 border-l-2 border-l-purple-600' : 'border-l-2 border-l-transparent'
                }`}
              >
                  <div className="flex justify-between items-baseline mb-0.5">
                      <div className={`text-sm font-bold truncate max-w-[160px] ${selectedThreadId === thread.id ? 'text-purple-900' : 'text-slate-800'}`}>{thread.guestName}</div>
                      <span className="text-[9px] text-slate-400 whitespace-nowrap">{thread.lastMessageTime}</span>
                  </div>

                  <div className="flex justify-between items-center mb-1">
                       <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                           <span className="font-medium text-slate-600">{thread.listingName}</span>
                           <span className="text-slate-300">•</span>
                           <span className={`${thread.status === 'Confirmed' ? 'text-emerald-600' : 'text-slate-500'}`}>
                               {formatRange(thread.startDate, thread.endDate)}
                           </span>
                       </div>
                       
                       {/* Unread Badge */}
                       {thread.unreadCount > 0 && (
                           <div className="min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm px-1">
                               {thread.unreadCount}
                           </div>
                       )}
                  </div>

                  <div className="flex justify-between items-center min-h-[16px]">
                      {thread.tags.length > 0 ? (
                          <div className="flex gap-1">
                              {thread.tags.map(tag => (
                                  <span key={tag} className="px-1.5 py-px rounded bg-white border border-slate-200 text-slate-500 text-[9px] font-medium shadow-sm">
                                      {tag}
                                  </span>
                              ))}
                          </div>
                      ) : <div></div>}
                      
                      {/* Hover Action Mock */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};
