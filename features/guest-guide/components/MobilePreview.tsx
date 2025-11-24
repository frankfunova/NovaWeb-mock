
import React from 'react';
import { GuestGuideItem } from '../../../types';
import { Icons } from '../../../constants';

interface MobilePreviewProps {
  items: GuestGuideItem[];
}

export const MobilePreview: React.FC<MobilePreviewProps> = ({ items }) => {
  // Replicate the structure shown in screenshot
  return (
    <div className="h-full flex items-center justify-center p-8 bg-slate-50 select-none">
        <div className="w-[320px] h-[640px] bg-black rounded-[3rem] p-3 shadow-2xl relative border-4 border-slate-800 ring-4 ring-slate-200">
            {/* Notch/Camera */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl z-20"></div>
            
            {/* Screen Content */}
            <div className="w-full h-full bg-slate-50 rounded-[2.2rem] overflow-hidden flex flex-col relative font-sans">
                
                {/* Hero Image / Header */}
                <div className="h-40 bg-gradient-to-b from-slate-400 to-slate-200 relative flex flex-col justify-end p-4 text-white">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md mb-3">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <h2 className="text-xl font-bold shadow-sm">The Pink Door</h2>
                        <div className="flex items-center gap-1 text-[10px] opacity-90">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            742 Evergreen Terrace, Springfield
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-4 py-3 bg-white shadow-sm z-10">
                    <div className="relative">
                        <input disabled type="text" placeholder="What are you looking for?" className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none" />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Icons.Search className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 pb-20 custom-scrollbar">
                    {items.map(item => (
                        <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group">
                            <div>
                                <div className="text-sm font-bold text-slate-800">{item.title}</div>
                                <div className="text-[10px] text-slate-500 mt-0.5">{item.subtitle || 'Tap to view details'}</div>
                            </div>
                            <Icons.ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                    ))}
                </div>

                {/* Bottom Tab Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 h-14 flex items-center justify-around px-2">
                    <div className="flex flex-col items-center gap-1 text-purple-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        <span className="text-[9px] font-bold">Home</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        <span className="text-[9px] font-medium">Add-on</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="text-[9px] font-medium">Service</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span className="text-[9px] font-medium">My Info</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
