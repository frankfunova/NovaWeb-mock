
import React, { useState, useEffect } from 'react';
import { Reservation } from '../../../types';

interface ReservationHeaderProps {
  reservation: Reservation;
}

const STATUS_STYLES: Record<string, string> = {
  Confirmed: 'bg-green-100 text-green-800 border-green-200',
  Cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  'Checked In': 'bg-purple-100 text-purple-800 border-purple-200',
  'Checked Out': 'bg-gray-100 text-gray-800 border-gray-200'
};

export const ReservationHeader: React.FC<ReservationHeaderProps> = ({ reservation }) => {
  const [isGuestProfileOpen, setIsGuestProfileOpen] = useState(false);

  // Close popover when reservation changes
  useEffect(() => {
    setIsGuestProfileOpen(false);
  }, [reservation.id]);

  return (
    <div className="w-full pr-6">
        {/* Top Row: Property & Status */}
        <div className="flex items-start justify-between mb-2">
                <div 
                className="flex items-center gap-2 group cursor-pointer" 
                onClick={() => window.open('#', '_blank')}
                title="Open property details"
            >
                <div className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 group-hover:underline decoration-2 underline-offset-2 transition-colors">
                    {reservation.propertyCode}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
            </div>

                <div className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${STATUS_STYLES[reservation.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                {reservation.status}
                </div>
        </div>

        {/* Bottom Row: Guest & Res# */}
        <div className="flex items-center gap-2 text-sm relative">
            <div className="flex items-center gap-1">
                <span className="text-slate-400 text-xs">Guest:</span>
                <span className="text-slate-700 font-medium truncate max-w-[140px] cursor-pointer hover:text-indigo-600" title={reservation.guestName}>
                    {reservation.guestName}
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
                <span className="text-slate-400 text-xs">Res#:</span>
                <span className="text-slate-700 font-medium font-mono text-xs">{reservation.reservationCode}</span>
            </div>

            {/* Guest Info Popover */}
            {isGuestProfileOpen && (
                <div className="absolute top-full left-0 mt-2 w-[280px] bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-4 animate-in fade-in zoom-in-95 duration-200 text-left">
                    <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold border-b border-slate-100 pb-2 text-xs uppercase tracking-wider">
                        Guest Information
                    </div>
                    <div className="space-y-3">
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Email</div>
                            <div className="text-sm font-medium text-slate-800 truncate" title={reservation.email || 'guest@example.com'}>
                                {reservation.email || 'guest@example.com'}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Phone</div>
                            <div className="text-sm font-medium text-slate-800">{reservation.phone || '--'}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Profile Link</div>
                            <a href="#" className="text-xs font-medium text-indigo-600 hover:underline truncate block">
                                airbnb.com/users/{reservation.id}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
