
import React, { useState } from 'react';
import { MapProperty, MapStaff } from '../../../types';
import { MapPropertyCard } from './MapPropertyCard';
import { MapStaffCard } from './MapStaffCard';
import { Icons } from '../../../constants';

interface MapSidebarProps {
  properties: MapProperty[];
  staffList: MapStaff[];
}

export const MapSidebar: React.FC<MapSidebarProps> = ({ properties, staffList }) => {
  const [activeTab, setActiveTab] = useState<'property' | 'staff'>('property');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
  const filteredProperties = properties.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStaff = staffList.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[360px] flex flex-col border-r border-slate-200 bg-white h-full flex-shrink-0 shadow-xl z-10">
        
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search by name, driver, or location..." 
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Icons.Search />
                </div>
            </div>
        </div>

        {/* Tab Switcher & Controls */}
        <div className="px-4 pb-3 flex items-center gap-2 border-b border-slate-100">
            <div className="flex-1 bg-slate-100 p-1 rounded-lg flex">
                <button 
                    onClick={() => setActiveTab('property')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'property' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    By Property
                </button>
                <button 
                    onClick={() => setActiveTab('staff')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'staff' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    By Staff
                </button>
            </div>
            
            <button className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-500">
                <Icons.Filter />
            </button>
            <button className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
            {activeTab === 'property' ? (
                <>
                    {filteredProperties.map(prop => (
                        <MapPropertyCard key={prop.id} property={prop} />
                    ))}
                    {filteredProperties.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm">No properties found</div>
                    )}
                </>
            ) : (
                <>
                    {filteredStaff.map(staff => (
                        <MapStaffCard key={staff.id} staff={staff} />
                    ))}
                    {filteredStaff.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm">No staff found</div>
                    )}
                </>
            )}
        </div>

        {/* Footer Summary */}
        <div className="p-3 border-t border-slate-200 bg-white grid grid-cols-4 divide-x divide-slate-100 text-center">
             <div>
                 <div className="text-[10px] text-slate-400 uppercase font-bold">Properties Done/Total</div>
                 <div className="text-xs font-bold text-emerald-600">0 <span className="text-slate-800">/ 132</span></div>
             </div>
             <div>
                 <div className="text-[10px] text-slate-400 uppercase font-bold">Tasks Done/Total</div>
                 <div className="text-xs font-bold text-indigo-600">79 <span className="text-slate-800">/ 205</span></div>
             </div>
             <div className="col-span-2">
                 <div className="text-[10px] text-slate-400 uppercase font-bold">Task Completion</div>
                 <div className="text-sm font-bold text-purple-600">39%</div>
             </div>
        </div>
    </div>
  );
};
