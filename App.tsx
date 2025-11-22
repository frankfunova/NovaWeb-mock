
import React, { useState } from 'react';
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

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('schedule');

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
          default: return activePage.replace('-', ' ');
      }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
        {/* Global Sidebar */}
        <GlobalNav activePage={activePage} onNavigate={setActivePage} />
        
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
            {/* Global Header */}
            <GlobalHeader title={getPageTitle()} />

            {/* Main Feature Content */}
            {renderContent()}
        </div>
    </div>
  );
};

export default App;