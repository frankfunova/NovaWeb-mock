
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Reservation } from '../../types';
import { ReservationTable } from './components/ReservationTable';
import { ReservationDetail } from './components/ReservationDetail';
import { Flyout } from '../../components/Flyout';

export const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await api.fetchReservations();
        setReservations(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSelectReservation = (res: Reservation) => {
    setSelectedReservation(res);
    setIsFlyoutOpen(true);
  };

  const StatsPill = ({ label, value, color }: { label: string, value: string | number, color: string }) => (
      <span className={`text-xs font-bold ${color} px-1`}>{value}</span>
  );

  if (isLoading) {
      return (
          <div className="flex-1 flex items-center justify-center h-full bg-white">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-slate-500 font-medium">Loading reservations...</span>
          </div>
      );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        
        {/* Toolbar */}
        <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-3 flex items-center justify-between gap-6">
            
            <div className="flex items-center gap-4 flex-1">
                {/* View Selector */}
                <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors group">
                   <div className="grid grid-cols-2 gap-0.5 w-4 h-4 opacity-50 group-hover:opacity-100">
                      <div className="bg-slate-800 rounded-[1px]"></div><div className="bg-slate-800 rounded-[1px]"></div>
                      <div className="bg-slate-800 rounded-[1px]"></div><div className="bg-slate-800 rounded-[1px]"></div>
                   </div>
                   <span className="text-sm font-bold text-slate-800">All Reservations</span>
                   <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search reservations..." 
                        className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                </div>

                {/* Stats Inline */}
                <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500 select-none">
                   <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
                       <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                       <StatsPill label="" value="44349" color="text-indigo-600" />
                   </div>
                   <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
                       <StatsPill label="" value="31192" color="text-emerald-600" />
                   </div>
                   <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
                       <StatsPill label="" value="61303363.29" color="text-orange-600" />
                   </div>
                   <div className="flex items-center gap-1">
                       <StatsPill label="" value="0" color="text-purple-600" />
                   </div>
                   <svg className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-md transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    Save as view
                </button>
                 <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-md transition-all shadow-sm bg-white">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Edit view
                </button>
            </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2 overflow-x-auto hide-scrollbar">
            {['All Checkout Date', 'All Check-in Date', 'All Booking Date', 'All listings', 'All OTAs', 'All Status', 'All Groups'].map((filter, i) => (
                <button key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap shadow-sm">
                    {filter}
                    <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
            ))}
            
            <div className="flex-1"></div>

            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                 <button className="p-1.5 text-slate-500 hover:bg-white hover:text-indigo-600 rounded border border-transparent hover:border-slate-200 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                 </button>
                 <button className="p-1.5 text-slate-500 hover:bg-white hover:text-indigo-600 rounded border border-transparent hover:border-slate-200 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                 </button>
                 <button className="p-1.5 text-slate-500 hover:bg-white hover:text-indigo-600 rounded border border-transparent hover:border-slate-200 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
                 </button>
            </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto bg-white custom-scrollbar">
            <ReservationTable 
                reservations={reservations} 
                onSelectReservation={handleSelectReservation}
            />
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>Showing {reservations.length} reservations</span>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">Load more reservations...</button>
            </div>
        </div>

        {/* Detail Flyout */}
        <Flyout 
            isOpen={isFlyoutOpen} 
            onClose={() => setIsFlyoutOpen(false)} 
            title="Reservation Details"
            side="right"
        >
            {selectedReservation && <ReservationDetail reservation={selectedReservation} />}
        </Flyout>
    </div>
  );
};
