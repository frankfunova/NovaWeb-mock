
import React, { useState, useEffect, useMemo } from 'react';
import { Reservation, Task } from '../../../types';
import { Icons } from '../../../constants';
import { api } from '../../../services/api';
import { ReservationHeader } from './ReservationHeader';

interface ReservationDetailProps {
  reservation: Reservation;
  onOpenIntent?: (intentId: string) => void;
  onOpenTask?: (taskId: string) => void;
}

// --- Reusable Components ---

interface CollapsibleCardProps {
  title: string;
  icon: React.ReactNode;
  summary: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  colorTheme?: 'indigo' | 'slate' | 'purple' | 'gray';
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ 
  title, 
  icon, 
  summary, 
  children, 
  defaultOpen = false,
  colorTheme = 'slate'
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const themeStyles = {
    indigo: 'bg-indigo-50/30 border-indigo-100 text-indigo-700',
    slate: 'bg-slate-50/50 border-slate-100 text-slate-700',
    purple: 'bg-purple-50/30 border-purple-100 text-purple-700',
    gray: 'bg-white border-slate-100 text-slate-800'
  };

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all duration-200">
       {/* Header - Always Visible */}
       <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`px-4 py-3 border-b ${isOpen ? 'border-slate-100' : 'border-transparent'} ${themeStyles[colorTheme]} flex items-center justify-between cursor-pointer select-none hover:bg-opacity-80 transition-colors`}
       >
           <div className="flex items-center gap-2">
               {icon}
               <h3 className="text-xs font-bold uppercase tracking-wider">{title}</h3>
           </div>
           <div className="flex items-center gap-3">
               {/* Summary Stats (Visible when collapsed or expanded, but styled differently) */}
               <div className={`transition-opacity duration-200 ${isOpen ? 'opacity-50' : 'opacity-100'}`}>
                   {summary}
               </div>
               <button className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                   <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
               </button>
           </div>
       </div>

       {/* Content - Collapsible */}
       {isOpen && (
         <div className="animate-in slide-in-from-top-2 duration-200">
            {children}
         </div>
       )}
    </div>
  );
};

// --- Sub-Components for Content ---

const GuestExperienceContent = ({ onOpenIntent }: { onOpenIntent?: (id: string) => void }) => {
    const [activeTab, setActiveTab] = useState<'intents' | 'timeline'>('intents');
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<{intents: any[], timeline: any[]}>({ intents: [], timeline: [] });

    // Simulate independent API call
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 600)); // 600ms delay
            setData({
                intents: [
                    { id: 'i1', type: 'request', title: 'Early Check-in Request', date: 'Today, 10:23 AM', status: 'Pending', icon: Icons.Clock },
                    { id: 'i2', type: 'inquiry', title: 'Asking about Wi-Fi', date: 'Yesterday, 4:15 PM', status: 'Resolved', icon: Icons.Map },
                    { id: 'i3', type: 'complaint', title: 'Noise Complaint', date: 'Nov 12, 8:00 PM', status: 'Resolved', icon: Icons.Bell },
                ],
                timeline: [
                    { id: 1, type: 'message_in', title: 'Guest sent a message', desc: '"Hi, is the pool heated?"', date: 'Today, 10:30 AM', icon: Icons.Inbox },
                    { id: 2, type: 'message_out', title: 'Auto-Reply Sent', desc: 'Sent "Pool Heating Policy"', date: 'Today, 10:30 AM', icon: Icons.Translate },
                    { id: 3, type: 'system', title: 'Check-in Instructions Sent', desc: 'Automated Email & SMS', date: 'Yesterday, 9:00 AM', icon: Icons.ClipboardCheck },
                    { id: 4, type: 'system', title: 'Reservation Confirmed', desc: 'Booking.com Sync', date: 'Nov 10, 2:15 PM', icon: Icons.CheckCircle || Icons.Calendar },
                ]
            });
            setIsLoading(false);
        };
        loadData();
    }, []);

    if (isLoading) return <div className="p-8 flex justify-center"><div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div>
            {/* Internal Tabs */}
            <div className="flex border-b border-slate-100 px-4">
                <button 
                    onClick={() => setActiveTab('intents')}
                    className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-colors ${activeTab === 'intents' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                    Active Intents (3)
                </button>
                <button 
                    onClick={() => setActiveTab('timeline')}
                    className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                    Timeline
                </button>
            </div>

            <div className="p-4">
                {activeTab === 'intents' ? (
                    <div className="space-y-3">
                        {/* Pending Issue Badge */}
                        <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg text-amber-700 text-xs font-medium">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                            1 Pending Guest Request requires attention
                        </div>

                        {data.intents.map(intent => (
                            <div 
                                key={intent.id} 
                                onClick={() => onOpenIntent && onOpenIntent(intent.id)}
                                className="flex items-start gap-3 group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors"
                            >
                                <div className="mt-0.5 p-1.5 rounded-md bg-white text-slate-400 border border-slate-200 shadow-sm group-hover:border-indigo-200 group-hover:text-indigo-500 transition-colors">
                                    <intent.icon />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{intent.title}</div>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded capitalize ${intent.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {intent.status}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">{intent.date} • {intent.type}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-0 pl-2 relative">
                        {/* Timeline Vertical Line */}
                        <div className="absolute top-2 bottom-2 left-[19px] w-px bg-slate-200"></div>

                        {data.timeline.map((event, idx) => (
                             <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0 group">
                                {/* Icon Node */}
                                <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
                                    event.type.includes('system') ? 'bg-slate-100 text-slate-500' : 
                                    event.type === 'message_in' ? 'bg-indigo-100 text-indigo-600' : 'bg-white border-slate-200 text-slate-500'
                                }`}>
                                    <div className="w-5 h-5"><event.icon /></div>
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-bold text-slate-700">{event.title}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">{event.date}</span>
                                    </div>
                                    <div className="text-sm text-slate-600 mt-0.5">{event.desc}</div>
                                </div>
                             </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const OperationsContent = ({ tasks, onOpenTask }: { tasks: Task[], onOpenTask?: (id: string) => void }) => {
    const StatusDot = ({ status }: { status: string }) => {
        const colors: Record<string, string> = {
            completed: 'bg-emerald-500',
            pending: 'bg-amber-400',
            new: 'bg-blue-400',
            cancelled: 'bg-slate-300',
            'in-progress': 'bg-amber-500',
            delayed: 'bg-red-500'
        };
        return <div className={`w-2 h-2 rounded-full ${colors[status.toLowerCase()] || 'bg-slate-300'}`}></div>;
    };

    return (
        <div className="divide-y divide-slate-50">
            {/* Filter / Sort Bar Mock */}
            <div className="px-4 py-2 bg-slate-50/50 flex gap-2">
                 <select className="text-xs border-none bg-transparent text-slate-500 font-medium focus:ring-0 cursor-pointer hover:text-indigo-600">
                     <option>All Tasks ({tasks.length})</option>
                     <option>Incomplete</option>
                 </select>
            </div>

            {tasks.length > 0 ? tasks.map(task => (
                <div 
                    key={task.id} 
                    onClick={() => onOpenTask && onOpenTask(task.id)}
                    className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                        <div className="flex items-center gap-3">
                            <StatusDot status={task.status || 'new'} />
                            <div>
                                <div className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600">{task.title}</div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="text-[10px] text-slate-400 capitalize">{task.type}</div>
                                    <span className="text-slate-300 text-[9px]">•</span>
                                    <div className={`text-[9px] font-medium uppercase tracking-wide ${
                                        task.status === 'completed' ? 'text-emerald-600' :
                                        task.status === 'pending' ? 'text-amber-600' :
                                        task.status === 'new' ? 'text-blue-600' : 'text-slate-500'
                                    }`}>
                                        {task.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {task.assigneeName && task.assigneeName !== 'Unassigned' ? (
                                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{task.assigneeName}</span>
                            ) : (
                                <span className="text-[10px] italic text-slate-400">Unassigned</span>
                            )}
                        </div>
                </div>
            )) : (
                <div className="p-6 text-center text-slate-400 text-xs italic">No tasks for this reservation.</div>
            )}
            
            <div className="p-2 text-center border-t border-slate-100">
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wide py-1">
                    + Create Task
                </button>
            </div>
        </div>
    );
};

// --- Main Component ---

export const ReservationDetail: React.FC<ReservationDetailProps> = ({ reservation, onOpenIntent, onOpenTask }) => {
  const [isFinancialsExpanded, setIsFinancialsExpanded] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  const checkIn = new Date(reservation.startDate);
  const checkOut = new Date(reservation.endDate);
  
  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // Mock "Today" for logic (Nov 19, 2025)
  const TODAY = new Date(2025, 10, 19);

  useEffect(() => {
    const loadTasks = async () => {
        setIsLoadingTasks(true);
        try {
            const allTasks = await api.fetchTasksList();
            // Approximate filter: In real app, filter by reservationId or listingId
            const relevant = allTasks.filter(t => 
                t.location === reservation.propertyCode || 
                t.propertyName === reservation.propertyCode ||
                t.title.includes(reservation.reservationCode)
            );
            setTasks(relevant);
        } catch(e) {
            console.error(e);
        } finally {
            setIsLoadingTasks(false);
        }
    }
    loadTasks();
  }, [reservation.propertyCode, reservation.reservationCode]);

  // Compute Team Members based on fetched tasks + mock CS
  const teamMembers = useMemo(() => {
      const members: Array<{ role: string, user: { name: string, avatarColor?: string, initials: string } | null }> = [];

      // 1. Custom Service (Mocked)
      members.push({
          role: 'Custom Service',
          user: { name: 'Mary Mae Tano', avatarColor: 'bg-purple-500', initials: 'MM' }
      });
      members.push({
          role: 'Custom Service',
          user: { name: 'Support Team', avatarColor: 'bg-indigo-500', initials: 'ST' }
      });

      // 2. Cleaner
      const uniqueCleaners = new Set<string>();
      tasks.filter(t => t.type === 'cleaning').forEach(t => {
          if (t.assigneeName && t.assigneeName !== 'Unassigned' && !uniqueCleaners.has(t.assigneeName)) {
              uniqueCleaners.add(t.assigneeName);
              members.push({
                  role: 'Cleaner',
                  user: { name: t.assigneeName, avatarColor: 'bg-green-500', initials: t.assigneeName.substring(0,2).toUpperCase() }
              });
          }
      });

      // 3. Inspector
      const uniqueInspectors = new Set<string>();
      tasks.filter(t => t.type === 'inspection').forEach(t => {
          if (t.assigneeName && t.assigneeName !== 'Unassigned' && !uniqueInspectors.has(t.assigneeName)) {
              uniqueInspectors.add(t.assigneeName);
              members.push({
                  role: 'Inspector',
                  user: { name: t.assigneeName, avatarColor: 'bg-red-500', initials: t.assigneeName.substring(0,2).toUpperCase() }
              });
          }
      });

      // 4. Maintenance
      const uniqueMaint = new Set<string>();
      tasks.filter(t => t.type === 'maintenance').forEach(t => {
          if (t.assigneeName && t.assigneeName !== 'Unassigned' && !uniqueMaint.has(t.assigneeName)) {
              uniqueMaint.add(t.assigneeName);
              members.push({
                  role: 'Maintenance',
                  user: { name: t.assigneeName, avatarColor: 'bg-orange-500', initials: t.assigneeName.substring(0,2).toUpperCase() }
              });
          }
      });

      return members;
  }, [tasks]);

  const getJourneyStatus = () => {
      const start = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate());
      const end = new Date(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate());
      const now = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());

      if (reservation.status === 'Cancelled') return { label: 'Cancelled', color: 'text-slate-400 bg-slate-50 border-slate-200' };
      if (reservation.status === 'Pending') return { label: 'Inquiry', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      if (now > end || reservation.status === 'Checked Out') return { label: 'Past Guest', color: 'text-slate-500 bg-slate-100 border-slate-200' };
      if ((now >= start && now <= end) || reservation.status === 'Checked In') return { label: 'Current Stay', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      
      if (now < start) {
          const diffTime = Math.abs(start.getTime() - now.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return { label: `Arriving in ${diffDays} days`, color: 'text-blue-700 bg-blue-50 border-blue-200' };
      }
      return { label: '', color: '' };
  };

  const journey = getJourneyStatus();

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
        
        {/* Sticky Header Section */}
        <div className="px-6 py-5 border-b border-slate-200 bg-white flex-shrink-0 shadow-sm z-10">
             <ReservationHeader reservation={reservation} />
        </div>

        {/* Scrollable Main Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">
            
            {/* 1. Unified Info Card (Dates & Financials) */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-shrink-0 mb-6">
                
                {/* Timeline Section */}
                <div className="p-5 pb-6">
                    <div className="flex items-center justify-between relative">
                        {/* Check In */}
                        <div className="text-left z-10 bg-white pr-2">
                            <div className="text-xs text-slate-400 font-bold uppercase mb-1">Check In</div>
                            <div className="text-base font-bold text-slate-800 leading-none mb-1">{formatDate(checkIn)}</div>
                            <div className="text-xs text-slate-500 font-medium">{formatTime(checkIn)}</div>
                        </div>

                        {/* Connecting Line & Status */}
                        <div className="flex-1 flex flex-col items-center justify-center relative px-2">
                             <div className="w-full h-px bg-slate-200 absolute top-1/2 -translate-y-1/2"></div>
                             
                             {/* Journey Status */}
                             {journey.label && (
                                <div className={`relative z-10 mb-2 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border shadow-sm ${journey.color}`}>
                                    {journey.label}
                                </div>
                             )}

                             {/* Nights Pill */}
                             <div className="bg-white text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-full relative z-10 border border-slate-200 shadow-sm flex items-center gap-1">
                                <span>{reservation.nights} Nights</span>
                                <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                             </div>
                        </div>

                        {/* Check Out */}
                        <div className="text-right z-10 bg-white pl-2">
                            <div className="text-xs text-slate-400 font-bold uppercase mb-1">Check Out</div>
                            <div className="text-base font-bold text-slate-800 leading-none mb-1">{formatDate(checkOut)}</div>
                            <div className="text-xs text-slate-500 font-medium">{formatTime(checkOut)}</div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 mx-5"></div>

                {/* Financials & Guest Count Row */}
                <div className="p-4 flex items-center justify-between bg-slate-50/50">
                    
                    {/* Guest Count (Left Side) */}
                     <div className="flex items-center gap-2 text-sm text-slate-600">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <span className="font-medium">{reservation.guestCount} Guests</span>
                    </div>

                    {/* Payout (Right Side) */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-bold uppercase">Payout</span>
                        <span className="text-base font-bold text-indigo-600">${reservation.payout.toFixed(2)}</span>
                        <button 
                            onClick={() => setIsFinancialsExpanded(!isFinancialsExpanded)}
                            className={`p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all ${isFinancialsExpanded ? 'bg-slate-200 text-slate-600 rotate-180' : ''}`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                 {/* Expanded Financial Details */}
                 {isFinancialsExpanded && (
                    <div className="px-5 pb-5 pt-2 bg-slate-50/50 border-t border-slate-100 animate-in slide-in-from-top-2">
                         <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Accommodation Fare</span>
                                <span className="font-medium text-slate-700">${(reservation.payout * 0.85).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Cleaning Fee</span>
                                <span className="font-medium text-slate-700">$150.00</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Service Fee</span>
                                <span className="font-medium text-slate-700">${(reservation.payout * 0.10).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                 )}
            </div>

            {/* 3. Departmental Sections - Collapsible */}
            <div className="flex-1 flex flex-col gap-4 mb-6">
                
                {/* Assigned Team Section - UPDATED */}
                <CollapsibleCard 
                    title="Assigned Team" 
                    icon={<Icons.Users />}
                    summary={
                        <div className="flex gap-3 text-[10px] font-medium text-slate-500">
                            {isLoadingTasks ? <span>Loading...</span> : <span>{teamMembers.filter(m => m.user).length} Staff</span>}
                        </div>
                    }
                    defaultOpen={true}
                    colorTheme="gray"
                >
                    <div className="divide-y divide-slate-50">
                        {teamMembers.map((member, idx) => (
                            <div key={idx} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-24 text-[10px] font-bold text-slate-400 uppercase tracking-wide flex-shrink-0">
                                        {member.role}
                                    </div>
                                    {member.user ? (
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm ${member.user.avatarColor || 'bg-slate-400'}`}>
                                                {member.user.initials}
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700">{member.user.name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2.5 opacity-50">
                                            <div className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center">
                                                <Icons.User className="w-4 h-4 text-slate-300" />
                                            </div>
                                            <span className="text-xs italic text-slate-400">Unassigned</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CollapsibleCard>

                {/* Customer Service Section */}
                <CollapsibleCard 
                    title="Guest Experience" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.678 3.348-3.97Z" clipRule="evenodd" /></svg>}
                    summary={
                        <div className="flex gap-3 text-[10px] font-medium text-slate-500">
                            <span>12 Msgs</span>
                            <span className="text-slate-300">|</span>
                            <span>8m Avg Reply</span>
                        </div>
                    }
                    defaultOpen={true}
                    colorTheme="indigo"
                >
                    <GuestExperienceContent onOpenIntent={onOpenIntent} />
                </CollapsibleCard>

                {/* Operations Section */}
                <CollapsibleCard
                    title="Operations"
                    icon={<Icons.ClipboardCheck />}
                    summary={
                         <div className="text-[10px] font-medium text-slate-400">
                            {tasks.filter(t => t.status === 'completed').length}/{tasks.length} Tasks Done
                         </div>
                    }
                    defaultOpen={false}
                    colorTheme="slate"
                >
                    <OperationsContent tasks={tasks} onOpenTask={onOpenTask} />
                </CollapsibleCard>
            </div>

             {/* Contact Info Footer */}
             {(reservation.email || reservation.phone) && (
                 <div className="flex flex-col gap-2 text-sm text-slate-500 px-1 border-t border-slate-100 pt-4 pb-4">
                    <div className="text-xs font-bold text-slate-400 uppercase">Guest Contact</div>
                    <div className="flex flex-wrap gap-4">
                        {reservation.email && (
                            <div className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-pointer">
                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                                {reservation.email}
                            </div>
                        )}
                        {reservation.phone && (
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z" /></svg>
                                {reservation.phone}
                            </div>
                        )}
                    </div>
                 </div>
            )}
        </div>
    </div>
  );
};
