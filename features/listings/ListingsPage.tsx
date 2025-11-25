
import React, { useState, useEffect } from 'react';
import { ListingsToolbar } from './components/ListingsToolbar';
import { ListingsTable } from './components/ListingsTable';
import { api } from '../../services/api';
import { Listing } from '../../types';

export const ListingsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('All Active Listings');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'watchlist') {
        setView('My Watchlist');
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await api.fetchListings();
        setListings(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
      const handlePopState = () => {
          const params = new URLSearchParams(window.location.search);
          if (params.get('view') === 'watchlist') {
              setView('My Watchlist');
          } else {
              setView('All Active Listings');
          }
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (isLoading) {
      return (
          <div className="flex-1 flex items-center justify-center h-full bg-white">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-slate-500 font-medium">Loading listings...</span>
          </div>
      );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        <ListingsToolbar view={view} onViewChange={setView} />
        
        <div className="flex-1 overflow-auto bg-white custom-scrollbar">
            <ListingsTable listings={listings} isWatchlist={view === 'My Watchlist'} />
            
            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm bg-slate-50/50">
                <span className="text-slate-500">Showing {listings.length} of 283 listings</span>
                <div className="h-1 flex-1 mx-4 bg-slate-200 rounded-full overflow-hidden max-w-xs">
                    <div className="w-1/3 h-full bg-indigo-500"></div>
                </div>
                <button className="text-purple-600 hover:text-purple-800 font-medium hover:underline">Load more listings...</button>
            </div>
        </div>
    </div>
  );
};
