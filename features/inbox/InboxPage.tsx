
import React, { useState, useEffect } from 'react';
import { InboxSidebar } from './components/InboxSidebar';
import { MessageBoard } from './components/MessageBoard';
import { api } from '../../services/api';
import { InboxThread, InboxMessage, Reservation } from '../../types';
import { ReservationDetail } from '../../features/reservations/components/ReservationDetail';
import { Icons } from '../../constants';

export const InboxPage: React.FC = () => {
  const [threads, setThreads] = useState<InboxThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<InboxThread | null>(null);
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Layout State: 3-pane toggle
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);
  const [reservationDetail, setReservationDetail] = useState<Reservation | null>(null);

  useEffect(() => {
    const loadThreads = async () => {
      setIsLoading(true);
      try {
        const data = await api.fetchInboxThreads();
        setThreads(data);
        if (data.length > 0) {
            handleSelectThread(data[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadThreads();
  }, []);

  const handleSelectThread = async (thread: InboxThread) => {
      setSelectedThread(thread);
      // Fetch messages
      const msgs = await api.fetchInboxMessages(thread.id);
      setMessages(msgs);

      // Fetch reservation for side panel
      const allReservations = await api.fetchReservations();
      const res = allReservations.find(r => r.id === thread.reservationId);
      setReservationDetail(res || null);
  };

  const toggleInfoPanel = () => {
      setIsInfoPanelOpen(!isInfoPanelOpen);
  };

  if (isLoading) {
      return (
          <div className="flex-1 flex items-center justify-center h-full bg-white">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-slate-500 font-medium">Loading inbox...</span>
          </div>
      );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-white">
        {/* Left Panel: Sidebar */}
        <InboxSidebar 
            threads={threads} 
            selectedThreadId={selectedThread?.id || null}
            onSelectThread={handleSelectThread}
        />
        
        {/* Middle Panel: Message Board */}
        {selectedThread ? (
            <MessageBoard 
                thread={selectedThread}
                messages={messages}
                onToggleDetail={toggleInfoPanel}
                isDetailOpen={isInfoPanelOpen}
            />
        ) : (
            <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">
                Select a conversation to start
            </div>
        )}

        {/* Right Panel: Reservation Info (Persistent) */}
        {isInfoPanelOpen && (
            <div className="w-[400px] border-l border-slate-200 bg-white h-full overflow-hidden flex flex-col transition-all duration-300 ease-in-out flex-shrink-0 shadow-xl z-20">
                
                {/* Global Header - Standardized Layout */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-white min-h-[56px] flex-shrink-0 z-20">
                    <div className="flex-1 flex items-center gap-3 min-w-0">
                        <h2 className="text-base font-bold text-slate-800 truncate">Reservation Details</h2>
                    </div>
                    
                    <div className="flex items-center gap-1 pl-4">
                        {/* Standard Share Button */}
                        <button className="p-2 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors" title="Share">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                        </button>

                        {/* Standard Open New Tab Button */}
                        <button className="p-2 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors" title="Open in new tab">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </button>

                        <div className="h-5 w-px bg-slate-200 mx-1"></div>
                        
                        {/* Close Button */}
                        <button
                            type="button"
                            className="p-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            onClick={toggleInfoPanel}
                            title="Close"
                        >
                            <Icons.X />
                        </button>
                    </div>
                </div>
                
                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                    {reservationDetail ? (
                        <ReservationDetail reservation={reservationDetail} />
                    ) : (
                        <div className="p-10 text-center text-slate-400 flex flex-col items-center gap-2 mt-10">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium">Select a conversation</span>
                            <span className="text-xs">to view reservation details</span>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};
