
import React, { useState, useEffect } from 'react';
import { GlobalNav } from './components/GlobalNav';
import { GlobalHeader } from './components/GlobalHeader';
import { SchedulePage } from './features/schedule/SchedulePage';
import { TasksPage } from './features/tasks/TasksPage';
import { ReservationsPage } from './features/reservations/ReservationsPage';
import { AttendancePage } from './features/staff-attendance/AttendancePage';
import { ReviewsPage } from './features/reviews/ReviewsPage';
import { InboxPage } from './features/inbox/InboxPage';
import { ResourceMapPage } from './features/resource-map/ResourceMapPage';
import { IntentsPage } from './features/intents/IntentsPage';
import { ListingsPage } from './features/listings/ListingsPage';
import { GuestGuidePage } from './features/guest-guide/GuestGuidePage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('schedule');

  // Initialize page from URL on load and sync state updates
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageFromUrl = params.get('page');
    if (pageFromUrl) {
        setActivePage(pageFromUrl);
    }
  }, []);

  const handleNavigate = (page: string) => {
      setActivePage(page);
      
      // Update URL to reflect page change, preserving other deep link params if we wanted,
      // but usually switching main module clears detailed deep links.
      const url = new URL(window.location.href);
      url.searchParams.set('page', page);
      
      // Clear entity IDs when switching main modules to avoid confusion
      url.searchParams.delete('taskId');
      url.searchParams.delete('intentId');
      url.searchParams.delete('reservationId');
      
      window.history.pushState({}, '', url.toString());
  };

  const renderContent = () => {
    switch (activePage) {
      case 'schedule':
        return <SchedulePage />;
      case 'tasks':
        return <TasksPage />;
      case 'reservations':
        return <ReservationsPage />;
      case 'staff-attendance':
        return <AttendancePage />;
      case 'reviews':
        return <ReviewsPage />;
      case 'inbox':
        return <InboxPage />;
      case 'map':
        return <ResourceMapPage />;
      case 'intents':
        return <IntentsPage />;
      case 'listings':
        return <ListingsPage />;
      case 'guest-guide':
        return <GuestGuidePage />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-slate-400">
            Page not implemented: {activePage}
          </div>
        );
    }
  };

  const getPageTitle = () => {
      switch(activePage) {
          case 'schedule': return 'Schedule';
          case 'tasks': return 'Tasks List';
          case 'map': return 'Resource Map View';
          case 'reservations': return 'Reservations';
          case 'reviews': return 'Reviews';
          case 'inbox': return 'Inbox';
          case 'staff-attendance': return 'Staff Attendance';
          case 'intents': return 'Intents';
          case 'listings': return 'Listings';
          case 'guest-guide': return 'Guest Guide';
          default: return activePage.replace('-', ' ');
      }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-800 dark:text-slate-200 transition-colors duration-200">
        {/* Global Sidebar */}
        <GlobalNav activePage={activePage} onNavigate={handleNavigate} />
        
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-white dark:bg-slate-900">
            {/* Global Header */}
            <GlobalHeader title={getPageTitle()} />

            {/* Main Feature Content */}
            {renderContent()}
        </div>
    </div>
  );
};

export default App;
