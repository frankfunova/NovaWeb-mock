
import React, { useState, useEffect } from 'react';
import { Staff, Task, ApiUserDashboardResponse } from '../../../types';
import { Icons } from '../../../constants';
import { api } from '../../../services/api';

interface StaffDetailProps {
  staff: Staff;
  tasks: Task[];
}

export const StaffDetail: React.FC<StaffDetailProps> = ({ staff, tasks }) => {
  const [showClockDetails, setShowClockDetails] = useState(false);
  const [dashboardData, setDashboardData] = useState<ApiUserDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
        setLoading(true);
        try {
            const data = await api.fetchUserDashboard(staff.id);
            setDashboardData(data);
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    loadStats();
  }, [staff.id]);

  // Calculate Status Breakdown from actual Tasks for the Segmented Bar
  const calculateStatusStats = () => {
    const stats: Record<string, number> = {
        completed: 0,
        'in-progress': 0,
        pending: 0,
        delayed: 0,
        new: 0
    };
    let total = 0;

    tasks.forEach(t => {
        const dur = t.duration || 0;
        const status = t.status;
        
        if (stats[status] !== undefined) {
            stats[status] += dur;
        } else {
            // Handle unknown statuses by grouping them into pending or a separate bucket
            // For now, we will just initialize it if missing, though Typescript suggests limited statuses
            stats[status] = (stats[status] || 0) + dur;
        }
        total += dur;
    });
    
    return { stats, total };
  };

  const { stats, total } = calculateStatusStats();

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'completed': return 'bg-emerald-500';
          case 'in-progress': return 'bg-amber-400';
          case 'pending': return 'bg-sky-400';
          case 'delayed': return 'bg-red-500';
          case 'new': return 'bg-purple-400';
          case 'cancelled': return 'bg-slate-400';
          default: return 'bg-slate-300';
      }
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'task': return Icons.ClipboardCheck;
          case 'meeting': return Icons.Briefcase;
          case 'break': return Icons.Coffee;
          default: return Icons.Clock;
      }
  };

  if (loading) {
      return <div className="p-6 text-center text-slate-400">Loading stats...</div>;
  }

  return (
    <div className="flex flex-col gap-6 font-sans p-6">
      
      {/* Stats Row (Clean Grid) */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border border-slate-200 rounded-xl bg-white shadow-sm">
         <div className="text-center p-3">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-1">Total</div>
            <div className="text-xl font-semibold text-slate-800">8:24</div>
         </div>
         <div className="text-center p-3">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-1">Overtime</div>
            <div className="text-xl font-semibold text-indigo-600">0:24</div>
         </div>
         <div className="text-center p-3">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-1">Payable</div>
            <div className="text-xl font-semibold text-slate-800">8:24</div>
         </div>
      </div>

      {/* Clock In/Out Section */}
      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
          {/* Summary */}
          {!showClockDetails && dashboardData?.clockIns && dashboardData.clockIns.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Icons.Clock />
                      <span>In: {dashboardData.clockIns[0].in}</span>
                  </div>
                  <span className="text-slate-300 mx-2">|</span>
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Icons.Clock />
                      <span>Out: {dashboardData.clockIns[dashboardData.clockIns.length - 1].out}</span>
                  </div>
              </div>
          )}

          {/* Expanded Details */}
          {showClockDetails && (
            <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
                {dashboardData?.clockIns?.map((time, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-200/60 last:border-0 pb-1 last:pb-0">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Icons.Clock />
                            <span>In: {time.in}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Icons.Clock />
                            <span>Out: {time.out}</span>
                        </div>
                    </div>
                ))}
            </div>
          )}

          {/* Expand Toggle */}
          {dashboardData?.clockIns && dashboardData.clockIns.length > 0 && (
             <div className="flex justify-end pt-1 border-t border-slate-200/50 mt-2">
                 <button 
                    onClick={() => setShowClockDetails(!showClockDetails)}
                    className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                 >
                    {showClockDetails ? 'Less' : 'More'} 
                    <span className={`transform transition-transform ${showClockDetails ? 'rotate-180' : ''}`}>▼</span>
                 </button>
             </div>
          )}
      </div>

      {/* Summary Boxes */}
      <div className="grid grid-cols-4 gap-2">
          {dashboardData?.statsBreakdown?.map((item, idx) => (
             <div key={idx} className="bg-white rounded-lg p-2 border border-slate-200 flex flex-col items-center justify-center text-center shadow-sm hover:border-indigo-200 transition-colors">
                <div className="text-[9px] text-slate-400 font-bold uppercase mb-1 truncate w-full">{item.label}</div>
                <div className="text-lg font-semibold text-slate-800 mb-1 leading-none">{item.time}</div>
                <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.color}`}>
                   {item.pct}
                </div>
             </div>
          ))}
      </div>
      
      {/* Status Distribution Section */}
      <div>
         <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-700">Status Distribution</h3>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Total Hours: {total.toFixed(1)}</span>
         </div>

         {total > 0 ? (
            <>
                {/* Segmented Bar */}
                <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-100 mb-3">
                    {Object.entries(stats).map(([status, duration]) => {
                        if (duration <= 0) return null;
                        const pct = (duration / total) * 100;
                        return (
                            <div 
                                key={status}
                                style={{ width: `${pct}%` }}
                                className={`h-full ${getStatusColor(status)}`}
                            ></div>
                        );
                    })}
                </div>
                
                {/* Legend */}
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(stats).map(([status, duration]) => {
                        if (duration <= 0) return null;
                        const pct = (duration / total) * 100;
                        return (
                            <div key={status} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
                                    <span className="text-slate-600 capitalize">{status}</span>
                                </div>
                                <span className="text-slate-400 font-medium">{duration.toFixed(1)}h ({Math.round(pct)}%)</span>
                            </div>
                        );
                    })}
                </div>
            </>
         ) : (
            <div className="text-sm text-slate-400 italic p-4 bg-slate-50 rounded-lg text-center border border-slate-100">No tasks scheduled.</div>
         )}
      </div>

      {/* Activity Timeline */}
      <div className="pt-2 pb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Activity Timeline</h3>
          
          <div className="relative pl-3">
             {/* Vertical Line */}
             <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-200"></div>

             <div className="space-y-4">
                 {dashboardData?.timelineEvents?.map((event, idx) => {
                     const Icon = getIcon(event.iconType as any);
                     return (
                     <div key={idx} className="relative pl-6 group">
                         {/* Timeline Dot */}
                         <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-indigo-500 shadow-sm z-10 ring-1 ring-slate-100"></div>
                         
                         <div className="bg-white border border-slate-200 rounded-lg p-3 hover:shadow-sm hover:border-indigo-200 transition-all">
                             <div className="flex justify-between items-start mb-0.5">
                                 <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${event.color.replace('text-', 'bg-').replace('600', '50')} ${event.color} flex items-center gap-1 w-fit`}>
                                     <span className="w-3 h-3"><Icon /></span>
                                     {event.type}
                                 </div>
                                 <div className="text-xs font-bold text-slate-700 font-mono">{event.duration}</div>
                             </div>
                             
                             <div className="text-[11px] font-medium text-slate-400 mb-1 mt-1">{event.time}</div>
                             <div className="text-sm font-semibold text-slate-800">{event.title}</div>
                         </div>
                     </div>
                 )})}
             </div>
          </div>
      </div>

    </div>
  );
};
