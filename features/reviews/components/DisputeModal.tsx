
import React, { useState, useEffect } from 'react';
import { Review } from '../../../types';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({ isOpen, onClose, review }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [content, setContent] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsGenerating(true);
      setContent('');
      
      // Simulate AI generation delay
      const timer = setTimeout(() => {
        const generatedText = `To Airbnb Support Team,

I am writing to formally dispute the review left by ${review.guestName || 'the guest'} for reservation ${review.reservationCode} on ${new Date(review.reviewDate).toLocaleDateString()}.

The guest's claims regarding "${review.publicReview.substring(0, 30)}..." are factually incorrect and violate the review policy due to lack of relevance/accuracy.

Evidence from our service logs:
1. Guest checked in at ${review.checkIn || 'scheduled time'}.
2. No complaints were registered in our messaging history regarding these specific issues during their stay.
3. Our cleaning log confirms the property was inspected and verified clean by staff ${review.relatedStaff?.[0]?.name || 'Staff'} prior to arrival (Timestamp available).

We request that this review be removed as it misrepresents the actual service provided and impacts our listing unfairly.

Best regards,
Nova Vacation Team`;

        setContent(generatedText);
        setIsGenerating(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, review]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopyFeedback('Copied!');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Generate Dispute Document</h3>
              <p className="text-xs text-slate-500">Powered by Nova AI • Analysis of logs & messaging</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 min-h-[300px]">
          {isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center py-10 gap-4">
              <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700">Analyzing reservation history...</p>
                <p className="text-xs text-slate-400 mt-1">Checking chat logs, service tickets, and review content</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Generated Dispute Content</label>
                <span className="text-xs text-emerald-600 font-medium transition-opacity duration-300" style={{ opacity: copyFeedback ? 1 : 0 }}>
                    {copyFeedback}
                </span>
              </div>
              <textarea 
                className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none font-mono"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
              <p className="text-xs text-slate-400 italic">
                * You can edit the text above before copying. This document is generated based on available system records.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-800 border border-transparent hover:border-slate-200 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleCopy}
            disabled={isGenerating}
            className="px-4 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
};
