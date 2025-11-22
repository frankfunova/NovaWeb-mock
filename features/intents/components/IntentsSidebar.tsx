
import React from 'react';

export const IntentsSidebar: React.FC = () => {
  return (
    <div className="w-64 flex flex-col border-r border-slate-200 bg-white h-full flex-shrink-0 py-6">
        <div className="px-6 mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">BY ENTITY</h3>
            <div className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-bold cursor-pointer shadow-sm">
                All Intents
            </div>
        </div>

        <div className="px-6 mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">SHARED VIEWS</h3>
             <div className="text-sm text-slate-700 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                My Reported Issues (Intent)
            </div>
        </div>

        <div className="px-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">SAVED VIEWS</h3>
            <div className="space-y-1">
                <div className="text-sm text-slate-700 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    test-review
                </div>
                <div className="text-sm text-slate-700 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    999
                </div>
            </div>
        </div>
    </div>
  );
};
