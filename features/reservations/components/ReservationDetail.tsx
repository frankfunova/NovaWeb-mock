
import React from 'react';
import { Reservation } from '../../../types';

interface ReservationDetailProps {
  reservation: Reservation;
}

export const ReservationDetail: React.FC<ReservationDetailProps> = ({ reservation }) => {
  return (
    <div className="flex flex-col h-full gap-6">
        {/* Top Profile Section */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-2xl font-bold text-slate-500 shadow-inner">
                {reservation.guestName.charAt(0)}
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-800">{reservation.guestName}</h3>
                <div className="text-sm text-slate-500 flex flex-col gap-0.5 mt-1">
                    {reservation.email && <span className="hover:text-indigo-600 cursor-pointer transition-colors">{reservation.email}</span>}
                    {reservation.phone && <span>{reservation.phone}</span>}
                </div>
            </div>
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Confirmation</div>
                <div className="font-mono font-semibold text-slate-700 text-sm truncate" title={reservation.reservationCode || 'N/A'}>
                    {reservation.reservationCode || 'N/A'}
                </div>
            </div>
             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Source</div>
                <div className="font-semibold text-slate-700 text-sm">{reservation.source}</div>
            </div>
             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Guests</div>
                <div className="font-semibold text-slate-700 text-sm">{reservation.guestCount} Adults</div>
            </div>
             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Nights</div>
                <div className="font-semibold text-slate-700 text-sm">{reservation.nights} Nights</div>
            </div>
        </div>

        {/* Dates Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Stay Dates
            </h4>
            <div className="flex items-center justify-between relative">
                <div className="text-center z-10 bg-white pr-2">
                    <div className="text-xs text-slate-400 font-bold uppercase mb-1">Check In</div>
                    <div className="text-lg font-bold text-slate-800">{new Date(reservation.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div className="text-xs text-slate-500">{new Date(reservation.startDate).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                    <div className="text-xs font-mono text-slate-400 mt-1">3:00 PM</div>
                </div>
                
                <div className="flex-1 h-px bg-slate-200 absolute top-1/2 left-0 right-0 -z-0"></div>
                <div className="bg-white px-2 z-10 text-xs font-bold text-slate-400 text-center">
                     {reservation.nights} Nights
                </div>

                <div className="text-center z-10 bg-white pl-2">
                    <div className="text-xs text-slate-400 font-bold uppercase mb-1">Check Out</div>
                    <div className="text-lg font-bold text-slate-800">{new Date(reservation.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div className="text-xs text-slate-500">{new Date(reservation.endDate).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                     <div className="text-xs font-mono text-slate-400 mt-1">11:00 AM</div>
                </div>
            </div>
        </div>

        {/* Financials */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
             <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Financials
            </h4>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Accommodation Fare</span>
                    <span className="font-medium text-slate-900">${(reservation.payout * 0.85).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Cleaning Fee</span>
                    <span className="font-medium text-slate-900">$150.00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Service Fee</span>
                    <span className="font-medium text-slate-900">${(reservation.payout * 0.10).toFixed(2)}</span>
                </div>
                <div className="h-px bg-slate-100 my-2"></div>
                <div className="flex justify-between items-center text-base font-bold">
                    <span className="text-slate-800">Total Payout</span>
                    <span className="text-indigo-600">${reservation.payout.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        {/* Actions */}
        <div className="mt-auto pt-6">
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                Message Guest
            </button>
        </div>
    </div>
  );
};
