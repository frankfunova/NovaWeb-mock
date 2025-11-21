
import React from 'react';

export const TasksPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Tasks Feature</h2>
        <p className="text-slate-500 mb-6 max-w-md">
            This is a placeholder for the future Tasks List view. 
            The code structure is already set up to support it independently.
        </p>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Initialize Feature
        </button>
      </div>
    </div>
  );
};
