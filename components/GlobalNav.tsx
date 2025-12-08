




import React, { useState } from 'react';
import { Icons } from '../constants';

interface MenuItem {
  label: string;
  icon: React.FC<any>;
  id: string;
  hasSubmenu?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const SECTIONS: MenuSection[] = [
  {
    title: 'CUSTOM SERVICE',
    items: [
      { label: 'Dashboard', icon: Icons.Dashboard, id: 'dashboard' },
      { label: 'Inbox', icon: Icons.Inbox, id: 'inbox' },
      { label: 'Reservations', icon: Icons.Calendar, id: 'reservations' },
      { label: 'Reviews', icon: Icons.Star, id: 'reviews' },
    ]
  },
  {
    title: 'ACCOUNTING & HR',
    items: [
      { label: 'Staff Attendance', icon: Icons.Users, id: 'staff-attendance' },
    ]
  },
  {
    title: 'OPERATION CENTER',
    items: [
      { label: 'Tasks', icon: Icons.ClipboardCheck, id: 'tasks' },
      { label: 'Schedule', icon: Icons.Calendar, id: 'schedule' },
      { label: 'Resource Map View', icon: Icons.Map, id: 'map' },
      { label: 'Listings', icon: Icons.Dashboard, id: 'listings' },
      { label: 'Intents', icon: Icons.Dashboard, id: 'intents' },
    ]
  },
  {
    title: 'GUEST EXPERIENCE',
    items: [
      { label: 'Guest Guide', icon: Icons.BookOpen, id: 'guest-guide' },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Users', icon: Icons.Users, id: 'users' },
      { label: 'AI Agents', icon: Icons.Bot, id: 'ai-agents' },
      { label: 'Agent Logs', icon: Icons.ClipboardCheck, id: 'ai-agent-logs' },
      { label: 'Roles', icon: Icons.Settings, id: 'roles' },
      { label: 'Owners', icon: Icons.User, id: 'owners' },
      { label: 'Guests', icon: Icons.User, id: 'guests' },
      { label: 'Tenants', icon: Icons.User, id: 'tenants' },
    ]
  }
];

interface GlobalNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const GlobalNav: React.FC<GlobalNavProps> = ({ activePage, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-slate-900 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full transition-all duration-300 ease-in-out z-50`}>
      {/* Sidebar Header / Logo Area */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'} border-b border-slate-200 dark:border-slate-700 flex-shrink-0 transition-all duration-300`}>
        <div 
            className={`flex items-center gap-3 ${isCollapsed ? 'cursor-pointer' : ''}`}
            onClick={() => isCollapsed && setIsCollapsed(false)}
            title={isCollapsed ? "Click to expand" : ""}
        >
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0 transition-transform duration-300">
                N
            </div>
            {!isCollapsed && (
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight whitespace-nowrap animate-in fade-in duration-300">Nova Vacation</span>
            )}
        </div>

        {/* Toggle Button (Visible only when expanded) */}
        {!isCollapsed && (
            <button 
                onClick={() => setIsCollapsed(true)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                <div className="w-5 h-5"><Icons.Menu /></div>
            </button>
        )}
      </div>

      {/* Scrollable Menu Items */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10 pt-2 overflow-x-hidden">
        {SECTIONS.map((section, idx) => (
            <div key={idx} className={`mb-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            
            {/* Section Title */}
            {section.title && (
                <h3 className={`text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-4 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'px-2 opacity-100'}`}>
                  {section.title}
                </h3>
            )}
            {isCollapsed && section.title && <div className="h-px bg-slate-100 dark:bg-slate-800 my-4 mx-2"></div>}
            
            <ul className="space-y-0.5">
                {section.items.map((item) => (
                <li key={item.id}>
                    <button
                    onClick={() => onNavigate(item.id)}
                    title={isCollapsed ? item.label : ''}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 w-full ${
                        activePage === item.id
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 shadow-sm ring-1 ring-purple-200 dark:ring-purple-800'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                    } ${isCollapsed ? 'justify-center px-0 py-3' : ''}`}
                    >
                    <div className={`w-5 h-5 flex-shrink-0 ${activePage === item.id ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500'}`}>
                        <item.icon />
                    </div>
                    
                    {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                    </button>
                </li>
                ))}
            </ul>
            </div>
        ))}
      </div>
    </nav>
  );
};