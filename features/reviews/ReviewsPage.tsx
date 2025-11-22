
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Review } from '../../types';
import { ReviewsTable } from './components/ReviewsTable';
import { ReviewsToolbar } from './components/ReviewsToolbar';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await api.fetchReviews();
        setReviews(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
      return (
          <div className="flex-1 flex items-center justify-center h-full bg-white">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-slate-500 font-medium">Loading reviews...</span>
          </div>
      );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        <ReviewsToolbar />
        
        <div className="flex-1 overflow-auto bg-white custom-scrollbar">
            <ReviewsTable reviews={reviews} />
            
            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm bg-slate-50/50">
                <span className="text-slate-500">Showing {reviews.length} of 250 reviews</span>
                 <div className="h-1 flex-1 mx-4 bg-slate-200 rounded-full overflow-hidden max-w-xs">
                    <div className="w-1/3 h-full bg-indigo-500"></div>
                </div>
                <button className="text-purple-600 hover:text-purple-800 font-medium hover:underline">Load more reviews...</button>
            </div>
        </div>
    </div>
  );
};