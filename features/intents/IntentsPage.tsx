
import React, { useState, useEffect } from 'react';
import { IntentsSidebar } from './components/IntentsSidebar';
import { IntentsToolbar } from './components/IntentsToolbar';
import { IntentsTable } from './components/IntentsTable';
import { IntentDetail } from './components/IntentDetail';
import { TaskDetail } from '../../features/tasks/components/TaskDetail';
import { ReservationDetail } from '../../features/reservations/components/ReservationDetail';
import { Flyout } from '../../components/Flyout';
import { api } from '../../services/api';
import { Intent, Task, Reservation } from '../../types';

export const IntentsPage: React.FC = () => {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Intent Flyout State
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Task Flyout State
  const [isTaskFlyoutOpen, setIsTaskFlyoutOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoadingTask, setIsLoadingTask] = useState(false);

  // Reservation Flyout State
  const [isResFlyoutOpen, setIsResFlyoutOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isLoadingRes, setIsLoadingRes] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await api.fetchIntents();
        setIntents(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleIntentClick = async (intent: Intent) => {
      setIsFlyoutOpen(true);
      setIsLoadingDetail(true);
      try {
          // Fetch detailed data (including timeline, attachments, etc.)
          const detail = await api.fetchIntent(intent.id);
          setSelectedIntent(detail || intent);
      } catch (e) {
          console.error("Failed to load intent details", e);
          setSelectedIntent(intent); // Fallback
      } finally {
          setIsLoadingDetail(false);
      }
  };

  const handleOpenTask = async (taskId: string) => {
      setIsTaskFlyoutOpen(true);
      setIsLoadingTask(true);
      try {
          const task = await api.fetchTask(taskId);
          setSelectedTask(task || null);
      } catch (e) {
          console.error("Failed to load task details", e);
      } finally {
          setIsLoadingTask(false);
      }
  };

  const handleOpenReservation = async (resId: string) => {
      setIsResFlyoutOpen(true);
      setIsLoadingRes(true);
      try {
          const res = await api.fetchReservation(resId);
          setSelectedReservation(res || null);
      } catch (e) {
          console.error("Failed to load reservation details", e);
      } finally {
          setIsLoadingRes(false);
      }
  };

  // Helper to map intent codes to display names for the header
  const getIntentTitle = (intent: Intent | null) => {
      if (!intent) return 'Intent Details';
      
      let titleText = 'Intent Details';
      if (intent.intentTypeCode === 'SR') titleText = 'Service Request';
      else if (intent.intentTypeCode) titleText = intent.intentTypeCode;

      return (
        <div className="flex flex-col whitespace-normal">
            <span className="leading-none">{titleText}</span>
            <span className="text-[10px] font-normal text-slate-400 font-mono leading-none mt-0.5">ID {intent.id}</span>
        </div>
      );
  };

  if (isLoading) {
      return (
          <div className="flex-1 flex items-center justify-center h-full bg-white">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-slate-500 font-medium">Loading intents...</span>
          </div>
      );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-white">
        {/* Sidebar */}
        <IntentsSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
             <IntentsToolbar />
             
             <div className="flex-1 overflow-auto bg-white custom-scrollbar">
                <IntentsTable intents={intents} onIntentClick={handleIntentClick} />
                
                {/* Pagination Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm bg-slate-50/50">
                    <span className="text-slate-500">Showing {intents.length} intents</span>
                    <div className="h-1 flex-1 mx-4 bg-slate-200 rounded-full overflow-hidden max-w-xs">
                        <div className="w-1/3 h-full bg-indigo-500"></div>
                    </div>
                    <button className="text-purple-600 hover:text-purple-800 font-medium hover:underline">Load more intents...</button>
                </div>
             </div>
        </div>

        {/* Intent Detail Flyout */}
        <Flyout
            isOpen={isFlyoutOpen}
            onClose={() => setIsFlyoutOpen(false)}
            title={getIntentTitle(selectedIntent)}
            side="right"
            size="xl"
            noPadding={true}
        >
            {isLoadingDetail ? (
                <div className="flex h-full items-center justify-center">
                     <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                selectedIntent && <IntentDetail intent={selectedIntent} onOpenTask={handleOpenTask} onOpenReservation={handleOpenReservation} />
            )}
        </Flyout>

        {/* Task Detail Flyout (Secondary) */}
        <Flyout
            isOpen={isTaskFlyoutOpen}
            onClose={() => setIsTaskFlyoutOpen(false)}
            title="Task Details"
            side="right"
            size="lg"
        >
            {isLoadingTask ? (
                 <div className="flex h-full items-center justify-center">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
               </div>
            ) : (
                selectedTask && <TaskDetail task={selectedTask} />
            )}
        </Flyout>

        {/* Reservation Detail Flyout (Secondary) */}
        <Flyout
            isOpen={isResFlyoutOpen}
            onClose={() => setIsResFlyoutOpen(false)}
            title="Reservation Details"
            side="right"
            size="lg"
            noPadding={true}
        >
            {isLoadingRes ? (
                 <div className="flex h-full items-center justify-center">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
               </div>
            ) : (
                selectedReservation && <ReservationDetail reservation={selectedReservation} />
            )}
        </Flyout>
    </div>
  );
};
