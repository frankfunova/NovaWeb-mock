
import React from 'react';
import { InboxThread, InboxMessage } from '../../../types';
import { Icons } from '../../../constants';

interface MessageBoardProps {
  thread: InboxThread;
  messages: InboxMessage[];
  onToggleDetail: () => void;
  isDetailOpen?: boolean;
}

const MessageBubble: React.FC<{ message: InboxMessage }> = ({ message }) => {
    if (message.type === 'event') {
        return (
            <div className="flex items-center justify-center my-4">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <span className="font-bold">{message.timestamp}</span>
                    {message.metadata?.type === 'SR' && (
                        <span className="bg-orange-100 text-orange-700 px-1 rounded font-bold">SR</span>
                    )}
                    <span className="font-medium">{message.content}</span>
                    <div className="flex gap-1 ml-2">
                        <button className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">Follow up</button>
                        <button className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">Resolve</button>
                    </div>
                </div>
            </div>
        );
    }

    const isHost = message.sender === 'host';
    const isSpecial = message.type === 'special';

    return (
        <div className={`flex gap-3 mb-4 ${isHost ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className="flex-shrink-0 mt-1">
                {message.avatarUrl ? (
                    <img src={message.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" />
                ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${isHost ? 'bg-indigo-500' : 'bg-slate-400'}`}>
                        {isHost ? 'CS' : 'G'}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className={`flex flex-col max-w-[85%] ${isHost ? 'items-end' : 'items-start'}`}>
                {isSpecial ? (
                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl rounded-tr-none text-slate-800 text-sm shadow-sm">
                        <div className="font-mono font-medium whitespace-pre-line">{message.content}</div>
                        
                        <div className="mt-3 flex justify-end gap-2">
                             <button className="px-2 py-1 bg-white border border-yellow-200 rounded text-xs font-bold text-slate-600 hover:bg-yellow-100 transition-colors">Resolve</button>
                             <button className="px-2 py-1 bg-white border border-yellow-200 rounded text-xs font-bold text-slate-600 hover:bg-yellow-100 transition-colors">Follow up</button>
                        </div>
                    </div>
                ) : (
                    <div className={`px-4 py-2.5 text-sm shadow-sm ${
                        isHost 
                        ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none' 
                        : 'bg-slate-100 text-slate-800 rounded-2xl rounded-tl-none'
                    }`}>
                        {message.content}
                    </div>
                )}
                
                {/* Footer */}
                <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-slate-400">{message.timestamp}</span>
                    {isHost && (
                        <span className="text-[10px] text-slate-400">• Reply by {message.senderName}</span>
                    )}
                     {message.type === 'special' && (
                         <span className="ml-1">🏠</span> // Mock icon
                     )}
                </div>
            </div>
        </div>
    );
};

export const MessageBoard: React.FC<MessageBoardProps> = ({ thread, messages, onToggleDetail, isDetailOpen }) => {
  
  const getSentimentColor = (s: string) => {
      if (s === 'Satisfied') return 'text-emerald-600';
      if (s === 'Frustrated') return 'text-red-600';
      return 'text-slate-600';
  };

  const getSentimentIcon = (s: string) => {
      if (s === 'Satisfied') return '😊';
      if (s === 'Frustrated') return '😡';
      return '😐';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative min-w-[400px]">
        {/* Header */}
        <div className="px-6 py-3 border-b border-slate-200 flex justify-between items-center bg-white flex-shrink-0 h-[60px]">
            <div>
                <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="text-lg font-bold text-slate-800">{thread.guestName}</h2>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 ${getSentimentColor(thread.sentiment)}`}>
                        <span>{getSentimentIcon(thread.sentiment)}</span>
                        {thread.sentiment}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Nov 21 → 24</span>
                    <span>•</span>
                    <span>Res#: {thread.reservationCode}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-indigo-600 px-2 py-1 rounded hover:bg-slate-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Assign to
                </button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-50 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                </button>
                
                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                
                <button 
                    onClick={onToggleDetail}
                    className={`p-1.5 rounded transition-colors ${isDetailOpen ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
                    title={isDetailOpen ? "Hide Details" : "Show Details"}
                >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
                </button>
            </div>
        </div>

        {/* Sub-Header Toolbar */}
        <div className="px-6 py-2 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 border border-slate-200 bg-white px-2 py-1 rounded shadow-sm">
                <Icons.Translate />
                <span>Language:</span>
                <span className="font-bold text-slate-700">EN</span>
                <span className="text-slate-300">|</span>
                <span className="font-medium text-slate-700">Original</span>
            </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-slate-200 flex gap-6 text-xs font-bold tracking-wide text-slate-500 bg-white flex-shrink-0">
            <button className="py-3 border-b-2 border-indigo-600 text-indigo-600">Messages</button>
            <div className="relative py-3 group cursor-pointer hover:text-slate-700">
                Resv Question <span className="ml-1 bg-indigo-100 text-indigo-700 px-1.5 rounded-full text-[9px]">1</span>
            </div>
            <div className="relative py-3 group cursor-pointer hover:text-slate-700">
                Service Request <span className="ml-1 bg-indigo-100 text-indigo-700 px-1.5 rounded-full text-[9px]">6</span>
            </div>
            <button className="py-3 hover:text-slate-700">Uncategorized <span className="ml-1 bg-indigo-100 text-indigo-700 px-1.5 rounded-full text-[9px]">2</span></button>
            <button className="py-3 hover:text-slate-700">Internal Notes <span className="ml-1 bg-indigo-100 text-indigo-700 px-1.5 rounded-full text-[9px]">2</span></button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
            {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
            ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 bg-white flex-shrink-0">
            <div className="border border-slate-200 rounded-xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                <textarea 
                    className="w-full text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none min-h-[40px] max-h-[120px]"
                    placeholder="Type your message here..."
                    rows={1}
                />
                <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-2">
                        <button className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-2 py-1 rounded transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            Templates
                        </button>
                         <button className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-2 py-1 rounded transition-colors">
                            <Icons.Clock />
                            Automated Messages
                        </button>
                    </div>
                    <div className="flex items-center gap-0">
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold px-4 py-1.5 rounded-l-lg transition-colors shadow-sm">
                            Send
                        </button>
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-1.5 py-1.5 rounded-r-lg border-l border-indigo-400 transition-colors shadow-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
