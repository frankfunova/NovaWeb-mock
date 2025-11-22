
import React, { useState, useEffect } from 'react';
import { Review } from '../../../types';

interface ReviewHeaderProps {
  review: Review;
}

export const ReviewHeader: React.FC<ReviewHeaderProps> = ({ review }) => {
  const [isGuestProfileOpen, setIsGuestProfileOpen] = useState(false);

  useEffect(() => {
    setIsGuestProfileOpen(false);
  }, [review.id]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-full pr-6">
        {/* Top Row: Property */}
        <div className="flex items-start justify-between mb-2">
            <div 
                className="flex items-center gap-2 group cursor-pointer" 
                onClick={() => window.open('#', '_blank')}
                title="Open property details"
            >
                <div className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 group-hover:underline decoration-2 underline-offset-2 transition-colors">
                    {review.listingName}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
            </div>
        </div>

        {/* Bottom Row: Guest & Res# & Dates */}
        <div className="flex items-center gap-2 text-sm relative flex-wrap">
            <div className="flex items-center gap-1">
                <span className="text-slate-400 text-xs">Guest:</span>
                <span className="text-slate-700 font-medium truncate max-w-[140px] cursor-pointer hover:text-indigo-600" title={review.guestName}>
                    {review.guestName || 'Guest'}
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
                <span className="text-slate-700 font-medium font-mono text-xs">{review.reservationCode}</span>
            </div>

            {(review.checkIn && review.checkOut) && (
                <>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-1">
                         <span className="text-slate-700 font-medium text-xs">
                            {formatDate(review.checkIn)} - {formatDate(review.checkOut)}
                         </span>
                    </div>
                </>
            )}

            {/* Guest Info Popover */}
            {isGuestProfileOpen && (
                <div className="absolute top-full left-0 mt-2 w-[280px] bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-4 animate-in fade-in zoom-in-95 duration-200 text-left">
                    <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold border-b border-slate-100 pb-2 text-xs uppercase tracking-wider">
                        Guest Information
                    </div>
                    <div className="space-y-3">
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Location</div>
                            <div className="text-sm font-medium text-slate-800 truncate">
                                {review.guestLocation || '--'}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Profile Link</div>
                            <a href="#" className="text-xs font-medium text-indigo-600 hover:underline truncate block">
                                airbnb.com/users/guest
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
