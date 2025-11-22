
import React from 'react';
import { Review } from '../../../types';
import { Icons } from '../../../constants';

interface ReviewsTableProps {
  reviews: Review[];
  onReviewClick?: (review: Review) => void;
}

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
    let styles = 'bg-slate-100 text-slate-600';
    if (ota === 'Airbnb') styles = 'bg-rose-50 text-rose-600 border border-rose-100';
    if (ota === 'VRBO') styles = 'bg-blue-50 text-blue-600 border border-blue-100';
    if (ota === 'Booking') styles = 'bg-indigo-50 text-indigo-600 border border-indigo-100';

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${styles}`}>
            {ota}
        </span>
    );
};

export const ReviewsTable: React.FC<ReviewsTableProps> = ({ reviews, onReviewClick }) => {
  
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
                
                {/* Listing */}
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded border border-slate-200 bg-white flex items-center justify-center">
                            <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900">{review.listingName}</div>
                            <div className="text-xs text-slate-400 font-mono">{review.reservationCode}</div>
                        </div>
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

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <span className={`capitalize ${review.status === 'new' ? 'text-indigo-600 font-bold' : ''}`}>{review.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
