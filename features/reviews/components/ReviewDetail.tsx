import React, { useState, useEffect, useRef } from 'react';
import { Review, ReviewInsight } from '../../../types';
import { Icons } from '../../../constants';
import { api } from '../../../services/api';
import { DisputeModal } from './DisputeModal';
import { ReviewHeader } from './ReviewHeader';

interface ReviewDetailProps {
  review: Review;
}

interface Comment {
    id: string;
    author: string;
    role?: string;
    avatarUrl?: string;
    avatarColor?: string;
    initials?: string;
    content: string;
    timestamp: string;
}

const StarRatingLarge: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                 <svg 
                    key={star} 
                    className={`w-6 h-6 ${star <= rating ? 'text-amber-400 fill-current' : 'text-slate-200 fill-current'}`} 
                    viewBox="0 0 24 24"
                >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
            ))}
        </div>
    );
};

const StarRatingSmall: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`w-3 h-3 ${star <= rating ? 'fill-current' : 'text-slate-200 fill-current'}`} viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
        ))}
    </div>
);

const RatingBar: React.FC<{ label: string; value?: number }> = ({ label, value = 0 }) => {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 w-32 font-medium">{label}</span>
            <div className="flex-1 mx-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full ${value >= 4 ? 'bg-emerald-500' : value >= 3 ? 'bg-amber-400' : 'bg-red-400'}`} 
                    style={{ width: `${(value / 5) * 100}%` }}
                ></div>
            </div>
            <span className="font-bold text-slate-800 w-6 text-right">{value.toFixed(1)}</span>
        </div>
    );
};

const OtaBadge: React.FC<{ ota: string }> = ({ ota }) => {
    let styles = 'bg-slate-100 text-slate-600 border-slate-200';
    if (ota === 'Airbnb') styles = 'bg-rose-50 text-rose-600 border-rose-100';
    if (ota === 'VRBO') styles = 'bg-blue-50 text-blue-600 border-blue-100';
    if (ota === 'Booking') styles = 'bg-indigo-50 text-indigo-600 border-indigo-100';

    return (
        <a 
            href={`https://www.${ota.toLowerCase().replace(' ', '')}.com`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wide flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer ${styles}`}
            title={`Open listing on ${ota}`}
        >
            {ota}
            <svg className="w-2 h-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
    );
};

const SentimentIcon = ({ sentiment }: { sentiment: string }) => {
    if (sentiment === 'positive') {
        return (
            <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
    }
    if (sentiment === 'negative') {
        return (
             <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
    }
    // Neutral/Mixed - Straight face
    return (
        <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path strokeLinecap="round" strokeLinejoin="round" d="M9 15h6M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
};

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
    return (
        <div className="flex gap-3 group">
            {/* Avatar */}
            <div className="flex-shrink-0 mt-0.5">
                {comment.avatarUrl ? (
                    <img src={comment.avatarUrl} alt={comment.author} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${comment.avatarColor || 'bg-slate-400'}`}>
                         {comment.initials ? comment.initials : (
                             comment.author === 'Nova Admin' ? 
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> 
                             : comment.author.charAt(0)
                         )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{comment.author}</span>
                        <span className="text-xs text-slate-400 font-medium">{comment.timestamp}</span>
                    </div>
                </div>
                <div className="text-sm text-slate-700 mt-0.5 whitespace-pre-wrap leading-relaxed">
                    {comment.content}
                </div>
            </div>
        </div>
    );
};

// Helper for Team Slots
const TeamSlot = ({ staff }: { staff: any }) => (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-100 bg-slate-50 text-center h-24 relative overflow-hidden group hover:border-indigo-200 transition-colors">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 z-10">{staff.role}</div>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm mb-1 z-10 ${staff.avatarColor}`}>
            {staff.initials}
        </div>
        <div className="text-xs font-medium text-slate-700 truncate w-full px-1 z-10">{staff.name}</div>
        
        <div className="absolute bottom-1 right-1 bg-white/80 backdrop-blur-sm rounded-full px-1.5 py-0.5 border border-slate-200 flex items-center gap-0.5 shadow-sm z-10">
            <svg className="w-2.5 h-2.5 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            <span className="text-[9px] font-bold text-slate-700">{staff.rating.toFixed(1)}</span>
        </div>
    </div>
);

export const ReviewDetail: React.FC<ReviewDetailProps> = ({ review: initialReview }) => {
  // Use local state to simulate updates (like posting a reply)
  const [review, setReview] = useState<Review>(initialReview);
  const [insight, setInsight] = useState<ReviewInsight | null>(review.insight || null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  
  // Reply States
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

  // Ratings Hover State
  const [showRatingDetails, setShowRatingDetails] = useState(false);

  // Previous Reviews State
  const [isPrevReviewsOpen, setIsPrevReviewsOpen] = useState(false);
  const [prevReviewsLoading, setPrevReviewsLoading] = useState(false);
  const [prevReviews, setPrevReviews] = useState<any[]>([]);
  const [historicSummary, setHistoricSummary] = useState<{avg: number, count: number} | null>(null);

  // Translation State
  const [showOriginal, setShowOriginal] = useState(false);

  // Dispute Modal State
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  // Comments State
  const [comments, setComments] = useState<Comment[]>([
      {
          id: 'c1',
          author: 'Nova Admin',
          role: 'Admin',
          content: '@Queena Zhu Please check this. - Frank',
          timestamp: 'less than a minute ago',
          avatarColor: 'bg-slate-800',
          initials: 'NA'
      },
      {
          id: 'c2',
          author: 'CS - Mary Mae Tano',
          role: 'CS',
          content: 'Pool heat not working – fixed 10/26 11:52 AM\nPatio door issue – fixed 10/22 11:28 AM\nCutlery shortage – resolved 10/21 02:50 PM\nIncorrect access code – resolved immediately less than 5 mins\nGuest refunded in full for the PH fee + goodwill refund.',
          timestamp: '4 days ago',
          avatarUrl: 'https://i.pravatar.cc/150?u=mary',
          initials: 'MM'
      }
  ]);
  const [commentInput, setCommentInput] = useState('');

  // Reset state when prop review changes (switching between reviews)
  useEffect(() => {
    setReview(initialReview);
    setInsight(initialReview.insight || null);
    setIsReplying(false);
    setReplyText('');
    setShowRatingDetails(false);
    setIsPrevReviewsOpen(false);
    setPrevReviews([]);
    setHistoricSummary(null);
    setShowOriginal(false);
    setIsDisputeModalOpen(false);
  }, [initialReview.id]);

  const handleGenerateInsight = async () => {
      setIsGeneratingInsight(true);
      try {
          const newInsight = await api.generateReviewInsight(review.id);
          setInsight(newInsight);
      } catch (e) {
          console.error("Failed to generate insight", e);
      } finally {
          setIsGeneratingInsight(false);
      }
  };

  const handleGenerateReply = async () => {
      setIsGeneratingReply(true);
      // Simulate AI generation delay
      setTimeout(() => {
          setReplyText(`Thank you for your feedback, ${review.guestName || 'guest'}! We are glad you enjoyed your stay. We hope to host you again soon!`);
          setIsGeneratingReply(false);
      }, 1000);
  };

  const handlePostReply = () => {
      if (!replyText.trim()) return;
      
      // Optimistic update
      const updatedReview = {
          ...review,
          reviewStatus: 'replied',
          reviewReplyText: replyText,
          reviewReplyTime: new Date().toISOString(),
      };
      setReview(updatedReview as Review); 
      setIsReplying(false);
      setReplyText('');
  };

  const handlePostComment = () => {
      if (!commentInput.trim()) return;
      const newComment: Comment = {
          id: Date.now().toString(),
          author: 'Me',
          content: commentInput,
          timestamp: 'Just now',
          avatarColor: 'bg-indigo-600',
          initials: 'ME'
      };
      setComments([newComment, ...comments]);
      setCommentInput('');
  };

  // Mock Data Generator
  const generateMockReviews = (startId: number, count: number) => {
      return Array.from({ length: count }).map((_, i) => {
          const id = startId + i;
          
          const today = new Date();
          const reviewDateObj = new Date(today);
          reviewDateObj.setDate(today.getDate() - (id * 14) - 30);
          
          const checkOutObj = new Date(reviewDateObj);
          checkOutObj.setDate(checkOutObj.getDate() - 2); 
          
          const checkInObj = new Date(checkOutObj);
          checkInObj.setDate(checkInObj.getDate() - 5); 
          
          const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const year = checkOutObj.getFullYear();
          const dateRange = `${fmt(checkInObj)} - ${fmt(checkOutObj)}, ${year}`;

          return {
              id,
              guestName: ['Alice M.', 'Bob D.', 'Charlie R.', 'Diana P.', 'Evan S.', 'Frank W.', 'Grace L.'][id % 7],
              resCode: `HM${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
              dateStr: dateRange,
              rating: [5, 5, 4, 5, 3, 4, 5][id % 7],
              ota: ['Airbnb', 'VRBO', 'Booking'][id % 3],
              text: [
                  'Absolutely loved our stay! The host was very responsive.',
                  'Great location but the pool was a bit cold.',
                  'Perfect for our family reunion. Highly recommend.',
                  'Clean, spacious, and comfortable. Will be back.',
                  'Good value, but some furniture needs updating.'
              ][id % 5]
          };
      });
  };

  const handleTogglePrevReviews = () => {
      if (!isPrevReviewsOpen && prevReviews.length === 0) {
          setPrevReviewsLoading(true);
          setTimeout(() => {
               const newReviews = generateMockReviews(0, 5);
               setPrevReviews(newReviews);
               setHistoricSummary({ avg: 4.7, count: 42 });
               setPrevReviewsLoading(false);
          }, 600);
      }
      setIsPrevReviewsOpen(!isPrevReviewsOpen);
  };

  const handleLoadMoreReviews = () => {
      setPrevReviewsLoading(true);
      setTimeout(() => {
          const newReviews = generateMockReviews(prevReviews.length, 5);
          setPrevReviews(prev => [...prev, ...newReviews]);
          setPrevReviewsLoading(false);
      }, 600);
  };

  const hasReply = review.status === 'replied' || !!(review as any).reviewReplyText;
  const existingReplyText = (review as any).reviewReplyText || "Thank you for your feedback! We are glad you enjoyed your stay.";
  const replyDate = (review as any).reviewReplyTime || new Date().toISOString();
  const sentiment = review.insight?.sentiment || (review.rating >= 4 ? 'positive' : review.rating <= 2 ? 'negative' : 'neutral');
  const hasTranslation = !!review.originalLanguage && review.originalLanguage !== 'en' && !!review.originalContent;
  const displayContent = showOriginal && hasTranslation ? review.originalContent : review.publicReview;

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
        
        {/* Sticky Header Section (Previously ReviewHeader) */}
        <div className="px-6 py-5 border-b border-slate-200 bg-white flex-shrink-0 shadow-sm z-10">
             <ReviewHeader review={review} />
        </div>

        {/* Main Content - Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-6 pb-6">
            
            {/* 1. Interactive Rating Summary & Details */}
            <div 
                className="mb-2 mt-0 rounded-xl p-4 transition-all hover:bg-slate-50/50 hover:shadow-sm border border-transparent hover:border-slate-100 cursor-default group -mx-4"
                onMouseEnter={() => setShowRatingDetails(true)}
                onMouseLeave={() => setShowRatingDetails(false)}
            >
                <div className="flex justify-between items-start">
                     <div className="flex items-center gap-4">
                         <div className="text-4xl font-bold text-slate-900 leading-none tracking-tight">{review.rating.toFixed(1)}</div>
                         <div>
                             <StarRatingLarge rating={review.rating} />
                             <div className="text-xs text-indigo-600 font-medium mt-1.5 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                <span>View detailed breakdown</span>
                                <svg className={`w-3 h-3 transition-transform duration-300 ${showRatingDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                             </div>
                         </div>
                     </div>
                     
                     <div className="flex flex-col items-end gap-1">
                         <div className="flex items-center gap-2">
                            <OtaBadge ota={review.ota} />
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">REVIEWED ON</div>
                                <div className="text-xs font-bold text-slate-600 mt-0.5">{new Date(review.reviewDate).toLocaleDateString()}</div>
                            </div>
                         </div>
                     </div>
                </div>

                {/* Detailed Ratings - Hidden by default */}
                <div className={`grid grid-cols-2 gap-x-8 gap-y-3 overflow-hidden transition-all duration-500 ease-in-out px-2 ${showRatingDetails ? 'max-h-64 opacity-100 mt-6 pb-2' : 'max-h-0 opacity-0'}`}>
                    <RatingBar label="Cleanliness" value={review.cleanlinessRating} />
                    <RatingBar label="Accuracy" value={review.accuracyRating} />
                    <RatingBar label="Check-in" value={review.checkinRating} />
                    <RatingBar label="Communication" value={review.communicationRating} />
                    <RatingBar label="Location" value={review.locationRating} />
                    <RatingBar label="Value" value={review.valueRating} />
                </div>
            </div>

            {/* 2. Guest Review (Public + Private + Reply) */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Icons.User className="w-4 h-4" />
                        Guest Review
                        <div className="ml-1" title={`${sentiment} sentiment`}>
                            <SentimentIcon sentiment={sentiment} />
                        </div>
                    </h3>

                    <div className="flex items-center gap-3">
                        {hasTranslation && (
                            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[10px] font-bold mr-2">
                                <button 
                                    onClick={() => setShowOriginal(false)}
                                    className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${!showOriginal ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                Translated
                                </button>
                                <button 
                                    onClick={() => setShowOriginal(true)}
                                    className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${showOriginal ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                Original <span className="opacity-60 ml-0.5 uppercase">{review.originalLanguage}</span>
                                </button>
                            </div>
                        )}
                        
                        {/* Share & Dispute Buttons with Styling */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); alert('Share review'); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase text-slate-600 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-slate-50 rounded transition-all shadow-sm"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                            Share
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsDisputeModalOpen(true); }}
                            disabled={review.rating === 5}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase rounded border shadow-sm transition-all ${review.rating === 5 ? 'text-slate-300 bg-slate-50 border-slate-100 cursor-not-allowed' : 'text-slate-600 bg-white border-slate-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50'}`}
                            title={review.rating === 5 ? "Cannot dispute a 5-star review" : "Dispute this review"}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-11a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                            Dispute
                        </button>
                    </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed relative shadow-sm">
                    {/* Quote Icon */}
                    <svg className="absolute top-4 left-4 w-4 h-4 text-slate-300 transform rotate-180" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9 14.8954 9.89543 14 11 14C11.5523 14 12 13.5523 12 13V7C12 6.44772 11.5523 6 11 6H5C4.44772 6 4 6.44772 4 7V13C4 14.1046 4.89543 15 6 15V21H14.017ZM21 21L21 18C21 16.8954 20.1046 16 19 16H15.983C15.983 14.8954 16.8784 14 17.983 14C18.5353 14 18.983 13.5523 18.983 13V7C18.983 6.44772 18.5353 6 17.983 6H11.983C11.4307 6 10.983 6.44772 10.983 7V13C10.983 14.1046 11.8784 15 12.983 15V21H21Z"/></svg>
                    
                    <div className="pl-8 space-y-4">
                        <p>{displayContent}</p>

                        {/* Embedded Private Review */}
                        {review.privateReview && (
                            <div className="mt-4 pt-4 border-t border-slate-200/60">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                        <svg className="w-3 h-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Private Note</span>
                                </div>
                                <p className="italic text-slate-600 font-serif text-[13px]">
                                    "{review.privateReview}"
                                </p>
                            </div>
                        )}
                    </div>
                    
                    {/* Reply Button (Only if no reply yet) */}
                    {!hasReply && !isReplying && (
                        <div className="mt-4 flex justify-end border-t border-slate-200/50 pt-3">
                            <button 
                                onClick={() => setIsReplying(true)}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:bg-indigo-50 px-2.5 py-1.5 rounded transition-colors"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                Reply
                            </button>
                        </div>
                    )}
                </div>

                {/* Reply Section */}
                {(isReplying || hasReply) && (
                    <div className="pl-8 relative animate-in fade-in slide-in-from-top-2 duration-200 mt-4">
                        {/* Connecting Line */}
                        <div className="absolute top-[-16px] left-4 w-0.5 h-6 bg-slate-200"></div>
                        <div className="absolute top-[8px] left-4 w-4 h-0.5 bg-slate-200"></div>

                        {isReplying ? (
                            <div className="bg-white rounded-lg border border-indigo-200 shadow-md p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wide">Drafting Response</h4>
                                    <button 
                                        onClick={handleGenerateReply}
                                        disabled={isGeneratingReply}
                                        className="flex items-center gap-1.5 text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100 hover:bg-indigo-100 transition-colors"
                                    >
                                        {isGeneratingReply ? <div className="w-2 h-2 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div> : <Icons.Star />}
                                        AI Assistant
                                    </button>
                                </div>
                                
                                <textarea 
                                    rows={4}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                                    placeholder="Write your response here..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                />
                                
                                <div className="flex justify-end gap-2 mt-3">
                                    <button 
                                        onClick={() => setIsReplying(false)}
                                        className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded border border-transparent hover:border-slate-200"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handlePostReply}
                                        className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm transition-colors"
                                    >
                                        Post Response
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-4 text-sm text-slate-600 leading-relaxed italic shadow-sm">
                                <div className="flex items-center gap-2 mb-2 not-italic">
                                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-white text-[10px] font-bold">
                                        H
                                    </div>
                                    <span className="text-xs font-bold text-slate-900">Host Response</span>
                                    <span className="text-[10px] text-slate-400 ml-auto">{new Date(replyDate).toLocaleDateString()}</span>
                                </div>
                                <p>{existingReplyText}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 3. Previous Reviews Section */}
            <div className="mb-8">
                <button 
                    onClick={handleTogglePrevReviews}
                    className="flex items-center justify-between w-full group hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-700 transition-colors">Show previous reviews</h3>
                    </div>
                    <div className={`p-1 rounded-full text-slate-400 group-hover:text-slate-600 transition-all duration-200 ${isPrevReviewsOpen ? 'rotate-180' : ''}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </button>

                {isPrevReviewsOpen && (
                    <div className="mt-2 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        {/* Historic Summary */}
                        {historicSummary && (
                            <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 mb-4">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Overall History</span>
                                    <div className="h-4 w-px bg-slate-200"></div>
                                    <div className="flex items-center gap-1.5">
                                        <StarRatingSmall rating={historicSummary.avg} />
                                        <span className="text-xs font-bold text-slate-700">{historicSummary.avg}</span>
                                        <span className="text-[10px] text-slate-400">({historicSummary.count} reviews)</span>
                                    </div>
                            </div>
                        )}

                        {prevReviewsLoading && prevReviews.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <>
                                {prevReviews.map((prev) => (
                                    <div key={prev.id} className="p-4 rounded-lg bg-white border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="text-xs text-slate-600">
                                                <span className="font-bold text-slate-900">{prev.guestName}</span>,{' '} 
                                                <span className="font-mono text-slate-500">Res# {prev.resCode}</span>
                                                <span className="mx-2 text-slate-300">|</span>
                                                <span className="text-slate-500">{prev.dateStr}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <StarRatingSmall rating={prev.rating} />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                             <OtaBadge ota={prev.ota} />
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed mt-2 border-t border-slate-50 pt-2">
                                            {prev.text}
                                        </p>
                                    </div>
                                ))}
                                
                                <div className="text-center pt-2 pb-4">
                                    <button 
                                        onClick={handleLoadMoreReviews}
                                        disabled={prevReviewsLoading}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline disabled:opacity-50 disabled:no-underline flex items-center justify-center gap-2 mx-auto"
                                    >
                                        {prevReviewsLoading && <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>}
                                        View more reviews
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* 4. Related Staff Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <Icons.Users className="w-4 h-4 text-slate-400" />
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">RELATED STAFF</h3>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {review.relatedStaff ? (
                        review.relatedStaff.map((staff, idx) => (
                            <TeamSlot key={idx} staff={staff} />
                        ))
                    ) : (
                        <div className="col-span-4 text-center text-slate-400 text-xs italic py-4 bg-white border border-slate-200 rounded-lg border-dashed">
                            No team data available
                        </div>
                    )}
                </div>
            </div>

            {/* 5. AI Insight */}
            <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100 rounded-xl p-5 shadow-sm relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                    <svg className="w-24 h-24 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.8L19.2 19H4.8L12 5.8z"/></svg>
                </div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                         </div>
                         <div>
                             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">AI Analysis</h3>
                             <div className="text-[10px] text-slate-500">Powered by Nova AI</div>
                         </div>
                    </div>
                    
                    {!insight && (
                         <button 
                            onClick={handleGenerateInsight}
                            disabled={isGeneratingInsight}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-all shadow-sm disabled:opacity-50"
                         >
                             {isGeneratingInsight ? (
                                 <>
                                    <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                    Analyzing...
                                 </>
                             ) : (
                                 <>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                    Generate Insight
                                 </>
                             )}
                         </button>
                    )}
                </div>

                {insight ? (
                    <div className="relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex gap-2 mb-3">
                            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border capitalize ${
                                insight.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                insight.sentiment === 'negative' ? 'bg-red-100 text-red-700 border-red-200' :
                                'bg-amber-100 text-amber-700 border-amber-200'
                            }`}>
                                {insight.sentiment} Sentiment
                            </span>
                            {insight.topics.map(topic => (
                                <span key={topic} className="px-2 py-0.5 rounded-md text-xs font-medium bg-white border border-slate-200 text-slate-600">
                                    {topic}
                                </span>
                            ))}
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed bg-white/60 p-3 rounded-lg border border-white/50 shadow-sm backdrop-blur-sm">
                            {insight.summary}
                        </p>
                         <div className="mt-2 text-[10px] text-slate-400 text-right">
                            Generated at {new Date(insight.generatedAt).toLocaleTimeString()}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 text-slate-400 text-sm italic">
                        Generate insight to identify main issues and guest sentiment.
                    </div>
                )}
            </div>

            {/* 6. Comments Section */}
            <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Internal Comments</h3>
                <div className="space-y-6">
                    {comments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}
                </div>
            </div>

        </div>

        {/* Fixed Comment Input Footer */}
        <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-white z-10">
             <div className="border border-slate-200 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all bg-white flex gap-3 items-end">
                <textarea 
                    className="flex-1 text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none bg-transparent py-1"
                    placeholder="Write a comment... (Type @ to mention users)"
                    rows={1}
                    style={{ minHeight: '24px', maxHeight: '100px' }}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handlePostComment();
                        }
                    }}
                />
                <div className="flex justify-end mt-1">
                     <button 
                        onClick={handlePostComment}
                        disabled={!commentInput.trim()}
                        className="text-indigo-600 hover:text-indigo-800 disabled:text-slate-300 transition-colors p-1"
                    >
                        <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                             <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                     </button>
                </div>
            </div>
        </div>

        {/* Dispute Modal */}
        <DisputeModal 
            isOpen={isDisputeModalOpen} 
            onClose={() => setIsDisputeModalOpen(false)} 
            review={review} 
        />
    </div>
  );
};