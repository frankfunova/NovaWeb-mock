
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Reservation } from '../../types';
import { ReservationTable } from './components/ReservationTable';
import { ReservationDetail } from './components/ReservationDetail';
import { Flyout } from '../../components/Flyout';

const STATUS_STYLES: Record<string, string> = {
  Confirmed: 'bg-green-100 text-green-800 border-green-200',
  Cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  'Checked In': 'bg-purple-100 text-purple-800 border-purple-200',
  'Checked Out': 'bg-gray-100 text-gray-800 border-gray-200'
};

export const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [isGuestProfileOpen, setIsGuestProfileOpen] = useState(false);

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

  // Reset guest profile state when flyout closes or reservation changes
  useEffect(() => {
      if (!isFlyoutOpen) setIsGuestProfileOpen(false);
  }, [isFlyoutOpen, selectedReservation]);

  const handleSelectReservation = (res: Reservation) => {
    setSelectedReservation(res);
    setIsFlyoutOpen(true);
  };

  const StatsPill = ({ label, value, color }: { label: string, value: string | number, color: string }) => (
      <span className={`text-xs font-bold ${color} px-1`}>{value}</span>
  );

  const renderFlyoutHeader = () => {
    if (!selectedReservation) return 'Reservation Details';
    const res = selectedReservation;
    
    return (
        <div className="w-full pt-1 pb-1 pr-6">
            {/* Top Row: Property & Status */}
            <div className="flex items-start justify-between mb-2">
                 <div 
                    className="flex items-center gap-2 group cursor-pointer" 
                    onClick={() => window.open('#', '_blank')}
                    title="Open property details"
                >
                    <div className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 group-hover:underline decoration-2 underline-offset-2 transition-colors">
                        {res.propertyCode}
                    </div>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2} 
                        stroke="currentColor" 
                        className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                </div>

                {/* Status Badge */}
                 <div className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${STATUS_STYLES[res.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                    {res.status}
                 </div>
            </div>

            {/* Bottom Row: Guest & Res# */}
            <div className="flex items-center gap-2 text-sm relative">
                <div className="flex items-center gap-1">
                    <span className="text-slate-400">Guest:</span>
                    <span className="text-slate-700 font-medium truncate max-w-[100px]" title={res.guestName}>
                        {res.guestName}
                    </span>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsGuestProfileOpen(!isGuestProfileOpen);
                        }}
                        className={`p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors ${isGuestProfileOpen ? 'bg-slate-100 text-slate-600' : ''}`}
                    >
                        <svg className={`w-4 h-4 transition-transform duration-200 ${isGuestProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                <span className="text-slate-300">|</span>

                <div className="flex items-center gap-1">
                    <span className="text-slate-400">Res#:</span>
                    <span className="text-slate-700 font-medium font-mono text-xs">{res.reservationCode}</span>
                </div>

                {/* Guest Info Card Popover */}
                {isGuestProfileOpen && (
                    <div className="absolute top-full left-0 mt-2 w-[300px] bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-5 animate-in fade-in zoom-in-95 duration-200 text-left">
                        <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-100 pb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                            </svg>
                            <span>Guest Information</span>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs text-slate-500 mb-0.5">Full Name</div>
                                <div className="text-sm font-medium text-slate-800">{res.guestName}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-0.5">Email Address</div>
                                <div className="text-sm font-medium text-slate-800 flex items-center gap-2">
                                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                                    {res.email || 'speciallkay0802@gmail.com'}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-0.5">Phone Number</div>
                                <div className="text-sm font-medium text-slate-800 flex items-center gap-2">
                                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z" /></svg>
                                    {res.phone || '18505869699'}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-0.5">Returned Guest</div>
                                <div className="text-sm font-medium text-slate-800">No</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-0.5">Preferred Language</div>
                                <div className="text-sm font-medium text-slate-800">N/A</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-0.5">OTA Profile Link</div>
                                <a href="#" className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-2 truncate" onClick={(e) => e.stopPropagation()}>
                                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                                    https://www.airbnb.com/users/show/284190938
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
  };

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
            title={renderFlyoutHeader()}
            side="right"
            size="md"
        >
            {selectedReservation && <ReservationDetail reservation={selectedReservation} />}
        </Flyout>
    </div>
  );
};
