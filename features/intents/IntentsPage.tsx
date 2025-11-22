
import React, { useState, useEffect } from 'react';
import { IntentsSidebar } from './components/IntentsSidebar';
import { IntentsToolbar } from './components/IntentsToolbar';
import { IntentsTable } from './components/IntentsTable';
import { api } from '../../services/api';
import { Intent } from '../../types';

export const IntentsPage: React.FC = () => {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await api.fetchIntents();
        setIntents(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
      return (
          <div className="flex-1 flex items-center justify-center h-full bg-white">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-slate-500 font-medium">Loading intents...</span>
          </div>
      );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-white">
        {/* Sidebar */}
        <IntentsSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
             <IntentsToolbar />
             
             <div className="flex-1 overflow-auto bg-white custom-scrollbar">
                <IntentsTable intents={intents} />
                
                {/* Pagination Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm bg-slate-50/50">
                    <span className="text-slate-500">Showing {intents.length} intents</span>
                    <div className="h-1 flex-1 mx-4 bg-slate-200 rounded-full overflow-hidden max-w-xs">
                        <div className="w-1/3 h-full bg-indigo-500"></div>
                    </div>
                    <button className="text-purple-600 hover:text-purple-800 font-medium hover:underline">Load more intents...</button>
                </div>
             </div>
        </div>
    </div>
  );
};
