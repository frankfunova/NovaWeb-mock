
import React, { useState } from 'react';
import { Listing } from '../../../types';
import { Icons } from '../../../constants';

interface ListingsTableProps {
  listings: Listing[];
  isWatchlist?: boolean;
}

const WatchToggle: React.FC = () => {
    const [isWatched, setIsWatched] = useState(true); 
    return (
        <button 
            onClick={(e) => { e.stopPropagation(); setIsWatched(!isWatched); }}
            className={`p-1.5 rounded-full transition-colors ${isWatched ? 'text-amber-400 bg-amber-50 hover:bg-amber-100' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'}`}
            title={isWatched ? "Unwatch" : "Watch"}
        >
            {isWatched ? <Icons.StarFilled className="w-4 h-4" /> : <Icons.Star className="w-4 h-4" />}
        </button>
    );
};

export const ListingsTable: React.FC<ListingsTableProps> = ({ listings, isWatchlist }) => {
  return (
    <div className="min-w-full inline-block align-middle">
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left w-10">
                 <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </th>
              {isWatchlist && (
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider w-12">
                      Watch
                  </th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Nickname/Address
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Group
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                 <div className="flex items-center gap-1">
                    Bedroom
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                 <div className="flex items-center gap-1">
                    Is Active
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {listings.map((listing) => (
              <tr 
                key={listing.id} 
                className="hover:bg-slate-50 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                   <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                </td>
                {isWatchlist && (
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                        <WatchToggle />
                    </td>
                )}
                
                {/* Nickname/Address */}
                <td className="px-6 py-4">
                    <div>
                        <div className="text-sm font-bold text-slate-900">{listing.nickname}</div>
                        <div className="text-xs text-slate-500 mt-0.5 truncate max-w-md">{listing.address}</div>
                    </div>
                </td>

                {/* Group */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-slate-100 text-slate-600 border-slate-200">
                        {listing.group}
                    </span>
                </td>

                {/* Bedroom */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {listing.bedroomCount}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${listing.isActive ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {listing.status}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
