
import React, { useState } from 'react';
import { Review } from '../../../types';
import { Icons } from '../../../constants';

interface ReviewsTableProps {
  reviews: Review[];
  onReviewClick?: (review: Review) => void;
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

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                     <svg 
                        key={star} 
                        className={`w-3.5 h-3.5 ${star <= rating ? 'fill-current' : 'text-slate-200 fill-current'}`} 
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                ))}
            </div>
            <span className="text-sm font-bold text-slate-700">{rating}</span>
        </div>
    );
};

const OtaBadge: React.FC<{ ota: string }> = ({ ota }) => {
    let styles = 'bg-slate-100 text-slate-600 border-slate-200';
    if (ota === 'Airbnb') styles = 'bg-rose-50 text-rose-600 border-rose-100';
    if (ota === 'VRBO') styles = 'bg-blue-50 text-blue-600 border-blue-100';
    if (ota === 'Booking') styles = 'bg-indigo-50 text-indigo-600 border-indigo-100';

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles}`}>
            {ota}
        </span>
    );
};

const REVIEW_STATUS_STYLES: Record<string, string> = {
    new: 'bg-purple-50 text-purple-700 border-purple-200',
    replied: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    disputing: 'bg-red-50 text-red-700 border-red-200',
    removed: 'bg-slate-50 text-slate-600 border-slate-200',
    ignored: 'bg-gray-50 text-gray-600 border-gray-200',
};

const ReviewStatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const styles = REVIEW_STATUS_STYLES[status.toLowerCase()] || 'bg-slate-50 text-slate-600 border-slate-200';
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${styles}`}>
            {status}
        </span>
    );
};

export const ReviewsTable: React.FC<ReviewsTableProps> = ({ reviews, onReviewClick, isWatchlist }) => {
  
  const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
      });
  };

  return (
    <div className="min-w-full inline-block align-middle">
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
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
                Listing
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-1/3">
                Public Review
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                <div className="flex items-center gap-1">
                    Rating
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                <div className="flex items-center gap-1">
                    Review Date
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                    OTA
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                <div className="flex items-center gap-1">
                    Status
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {reviews.map((review) => (
              <tr 
                key={review.id} 
                className="hover:bg-slate-50 transition-colors group cursor-pointer"
                onClick={() => onReviewClick && onReviewClick(review)}
              >
                <td className="px-6 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                   <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                </td>
                {isWatchlist && (
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                        <WatchToggle />
                    </td>
                )}
                
                {/* Listing - Removed Icon */}
                <td className="px-6 py-4">
                    <div>
                        <div className="text-sm font-bold text-slate-900">{review.listingName}</div>
                        <div className="text-xs text-slate-400 font-mono">{review.reservationCode}</div>
                    </div>
                </td>

                {/* Public Review */}
                <td className="px-6 py-4">
                    <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">
                        {review.publicReview.length > 100 ? (
                            <>
                                {review.publicReview.substring(0, 100)}... 
                                <span className="text-indigo-600 ml-1 font-medium">More</span>
                            </>
                        ) : review.publicReview}
                    </p>
                </td>

                {/* Rating */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <StarRating rating={review.rating} />
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {formatDate(review.reviewDate)}
                </td>

                {/* OTA */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <OtaBadge ota={review.ota} />
                </td>

                {/* Status - Updated to Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <ReviewStatusBadge status={review.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
