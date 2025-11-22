

import { 
  Task, Staff, Reservation, AttendanceRecord, Review, ReviewInsight,
  ApiTaskOutput, ApiReservationOutput, ApiAttendanceOutput, ApiUserDashboardResponse,
  TaskType, TaskStatus, ReservationSource, AttendanceStatus,
  InboxThread, InboxMessage, MapProperty, MapStaff, Intent
} from '../types';
import { 
  MOCK_STAFF, 
  MOCK_API_TASKS, 
  MOCK_API_RESERVATIONS, 
  MOCK_API_ATTENDANCE,
  MOCK_USER_DASHBOARD,
  MOCK_TIMESHEET_LOGS,
  MOCK_REVIEWS,
  MOCK_INBOX_THREADS,
  MOCK_INBOX_MESSAGES,
  MOCK_MAP_PROPERTIES,
  MOCK_MAP_STAFF,
  MOCK_INTENTS
} from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- MAPPERS ---

const mapTaskStatus = (apiStatus: string | null): TaskStatus => {
  switch (apiStatus) {
    case 'open': return 'new'; 
    case 'in_progress': return 'in-progress';
    case 'completed': return 'completed';
    case 'delayed': return 'delayed'; // Added delayed
    case 'cancelled': return 'cancelled';
    case 'closed': return 'closed';
    default: return 'pending';
  }
};

const mapTaskType = (code: string | null): TaskType => {
  switch (code) {
    case 'cleaning': return 'cleaning';
    case 'inspection': return 'inspection';
    case 'delivery': return 'delivery';
    default: return 'maintenance';
  }
};

const getHoursFromISO = (isoString: string | null): number => {
  if (!isoString) return 0;
  const d = new Date(isoString);
  return d.getHours() + d.getMinutes() / 60;
};

export const mapApiTaskToUiTask = (dto: ApiTaskOutput): Task => {
  let uiStatus = mapTaskStatus(dto.status);
  
  return {
    id: dto.id,
    staffId: dto.assigneeId || 'unassigned',
    title: dto.title || 'Untitled Task',
    location: dto.listing?.nickname || dto.listing?.title || 'Unknown Location',
    type: mapTaskType(dto.taskTypeCode),
    startTime: dto.actualStart ? getHoursFromISO(dto.actualStart) : getHoursFromISO(dto.plannedStartAt),
    duration: dto.actualDurationSec ? dto.actualDurationSec / 3600 : (dto.plannedDurationSec ? dto.plannedDurationSec / 3600 : 1),
    plannedStartTime: getHoursFromISO(dto.plannedStartAt),
    plannedDuration: dto.plannedDurationSec ? dto.plannedDurationSec / 3600 : 1,
    status: uiStatus,
    notes: dto.description || '',
    priority: (dto.priority as any) || 'low',
    propertyName: dto.listing?.nickname || '',
    description: dto.description || '',
    scheduledAt: dto.plannedStartAt || undefined,
    assigneeName: dto.assignee?.fullName || 'Unassigned',
    isVendor: dto.assignee?.fullName?.toLowerCase().includes('vendor') || false
  };
};

export const mapApiReservationToUiReservation = (dto: ApiReservationOutput): Reservation => {
  return {
    id: dto.id,
    propertyCode: dto.listing?.nickname || '',
    reservationCode: dto.reservationCode || '',
    startDate: dto.checkIn || '',
    endDate: dto.checkOut || '',
    source: (dto.otaTypeCode as ReservationSource) || 'Direct',
    guestName: dto.guestFullName || 'Guest',
    nights: dto.nightsCount || 0,
    status: (dto.reservationStatusCode as any) || 'Confirmed',
    guestCount: dto.guestscount || 0,
    payout: dto.netIncome ? parseFloat(dto.netIncome) : 0,
    email: '',
    phone: ''
  };
};

const mapAttendanceStatus = (status: string | null): AttendanceStatus => {
  switch (status) {
    case 'working': return 'Working';
    case 'in_break': return 'In break';
    case 'shift_end': return 'Shift End';
    case 'off_duty': return 'Off duty';
    default: return '--';
  }
};

export const mapApiAttendanceToUiRecord = (dto: ApiAttendanceOutput): AttendanceRecord => {
  return {
    id: dto.id,
    userId: dto.userId,
    user: {
      id: dto.userId,
      fullName: dto.user?.fullName || 'Unknown',
      avatarColor: 'bg-indigo-500',
      initials: dto.user?.fullName?.substring(0, 2).toUpperCase() || 'UN',
      department: (dto.user?.department as any) || '--',
      position: (dto.user?.position as any) || '--'
    },
    attendanceDate: dto.attendanceDate || '',
    status: mapAttendanceStatus(dto.attendanceStatus),
    firstClockInAt: dto.firstClockInAt || undefined,
    finalClockOutAt: dto.finalClockOutAt || undefined,
    totalWorkingDurationSec: dto.totalWorkingDurationSec || 0,
    clockInCount: dto.clockInCount,
    clockOutCount: dto.clockOutCount
  };
};

// --- API METHODS ---

export const api = {
  fetchStaff: async (): Promise<Staff[]> => {
    await delay(500); 
    return [...MOCK_STAFF];
  },

  fetchTasks: async (date: Date): Promise<Task[]> => {
    await delay(600); 
    return MOCK_API_TASKS.map(mapApiTaskToUiTask);
  },
  
  fetchTasksList: async (): Promise<Task[]> => {
    await delay(400);
    return MOCK_API_TASKS.map(mapApiTaskToUiTask);
  },
  
  fetchTask: async (taskId: string): Promise<Task | undefined> => {
      await delay(300);
      const task = MOCK_API_TASKS.find(t => t.id === taskId);
      if (task) return mapApiTaskToUiTask(task);
      
      // Fallback mock if ID doesn't match predefined list
      return {
          id: taskId,
          staffId: '102',
          title: 'Task Detail View',
          location: '1234 Ocean Dr',
          type: 'maintenance',
          startTime: 14,
          duration: 1.5,
          plannedStartTime: 14,
          plannedDuration: 1,
          status: 'in-progress',
          assigneeName: 'Frank Fu',
          priority: 'medium',
          notes: 'This is a mock task detail returned for ID ' + taskId,
          scheduledAt: new Date().toISOString()
      } as Task;
  },

  createTask: async (task: Task): Promise<Task> => {
    await delay(300);
    return task;
  },

  updateTask: async (task: Task): Promise<Task> => {
    await delay(200);
    return task;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await delay(200);
    return;
  },

  fetchReservations: async (): Promise<Reservation[]> => {
    await delay(400);
    return MOCK_API_RESERVATIONS.map(mapApiReservationToUiReservation);
  },

  fetchReviews: async (): Promise<Review[]> => {
    await delay(400);
    return [...MOCK_REVIEWS];
  },
  
  generateReviewInsight: async (reviewId: string): Promise<ReviewInsight> => {
      await delay(1200); // Simulate AI processing time
      const review = MOCK_REVIEWS.find(r => r.id === reviewId);
      
      // Determine simple mock logic based on rating or content keywords
      if (review && review.rating <= 3) {
          return {
              sentiment: 'negative',
              topics: ['Maintenance', 'Cleanliness', 'Access'],
              summary: 'Guest reported issues with access code and general cleanliness. Construction noise was also a factor.',
              generatedAt: new Date().toISOString()
          };
      } else if (review && review.rating === 4) {
           return {
              sentiment: 'mixed',
              topics: ['Amenities', 'Communication'],
              summary: 'Overall good stay but communication could be improved. Guest wanted more info on resort amenities.',
              generatedAt: new Date().toISOString()
          };
      } else {
          return {
              sentiment: 'positive',
              topics: ['Location', 'Comfort', 'Value'],
              summary: 'Guest had an excellent experience, highlighting the location and property condition.',
              generatedAt: new Date().toISOString()
          };
      }
  },

  fetchAttendance: async (date: Date): Promise<AttendanceRecord[]> => {
    await delay(500);
    return MOCK_API_ATTENDANCE.map(mapApiAttendanceToUiRecord);
  },

  fetchTimesheetSummary: async (startDate: Date, endDate: Date): Promise<AttendanceRecord[]> => {
    await delay(600);
    // Return mock summary records
    return MOCK_API_ATTENDANCE.map(mapApiAttendanceToUiRecord).map(record => ({
        ...record,
        totalWorkingDurationSec: 144000 // Mock high number for summary
    }));
  },

  // New: Fetch User Dashboard Stats
  fetchUserDashboard: async (userId: string): Promise<ApiUserDashboardResponse> => {
    await delay(400);
    // In a real app, userId would filter the data
    return MOCK_USER_DASHBOARD;
  },

  // New: Fetch User Timesheet Detail
  fetchUserTimesheet: async (userId: string, startDate: Date, endDate: Date): Promise<AttendanceRecord[]> => {
    await delay(500);
    // Return detailed logs for a specific user
    return MOCK_TIMESHEET_LOGS.map(log => ({
        ...log,
        userId: userId, // override mock to match requested user
        user: { ...log.user, id: userId }
    }));
  },

  // --- Inbox ---
  fetchInboxThreads: async (): Promise<InboxThread[]> => {
    await delay(500);
    return [...MOCK_INBOX_THREADS];
  },

  fetchInboxMessages: async (threadId: string): Promise<InboxMessage[]> => {
    await delay(400);
    return [...MOCK_INBOX_MESSAGES];
  },

  // --- Resource Map ---
  fetchMapProperties: async (): Promise<MapProperty[]> => {
      await delay(600);
      return [...MOCK_MAP_PROPERTIES];
  },

  fetchMapStaff: async (): Promise<MapStaff[]> => {
      await delay(500);
      return [...MOCK_MAP_STAFF];
  },

  // --- Intents ---
  fetchIntents: async (): Promise<Intent[]> => {
      await delay(500);
      return [...MOCK_INTENTS];
  },

  fetchIntent: async (intentId: string): Promise<Intent | undefined> => {
      await delay(600);
      const baseIntent = MOCK_INTENTS.find(i => i.id === intentId);
      if (!baseIntent) return undefined;

      // Enrich with mock detail data
      return {
          ...baseIntent,
          listing: { id: baseIntent.listingId || 'L-101', nickname: baseIntent.listingId || '1234 Property', address: '1234 Ocean Drive, Orlando, FL' },
          reservation: { id: 'RES-123', guestName: 'Jessica Williams', reservationCode: 'HMQ823JKS', status: 'Checked In' },
          category: { name: 'Maintenance', code: 'MAINT' },
          attachments: [
             { 
                 id: 'att-1', 
                 type: 'image', 
                 url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                 name: 'faucet_leak.jpg',
                 uploadedAt: '2025-11-22T10:30:00Z' 
             },
             { 
                 id: 'att-2', 
                 type: 'image', 
                 url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', 
                 name: 'bathroom_overview.jpg',
                 uploadedAt: '2025-11-22T10:31:00Z'
             }
          ],
          linkedTasks: [
              { 
                  id: 't1', 
                  title: 'Fix bathroom faucet leak', 
                  status: 'in-progress', 
                  assigneeName: 'Frank Fu', 
                  priority: 'medium',
                  assignedAt: '2025-11-22T10:22:00Z'
              },
              { 
                  id: 't2', 
                  title: 'Inspect water damage', 
                  status: 'completed', 
                  assigneeName: 'Alice Doe', 
                  priority: 'high',
                  assignedAt: '2025-11-21T15:00:00Z' 
              }
          ],
          timeline: [
              { 
                  id: 'evt-1', 
                  type: 'creation', 
                  title: 'Intent Created', 
                  timestamp: baseIntent.createdAt, 
                  actorName: 'Airbnb System', 
                  description: 'Imported from guest message'
              },
              { 
                  id: 'evt-2', 
                  type: 'status_change', 
                  title: 'Status changed to In Progress', 
                  timestamp: 'Nov 22, 10:15 AM', 
                  actorName: 'Sarah Lee',
                  actorInitials: 'SL',
                  actorColor: 'bg-pink-500'
              },
              { 
                  id: 'evt-3', 
                  type: 'comment', 
                  title: 'Internal Note', 
                  timestamp: 'Nov 22, 10:20 AM', 
                  actorName: 'Sarah Lee',
                  actorInitials: 'SL',
                  actorColor: 'bg-pink-500',
                  description: 'Frank is nearby, assigning him to check this today.'
              },
              { 
                  id: 'evt-4', 
                  type: 'task_linked', 
                  title: 'Task Created', 
                  timestamp: 'Nov 22, 10:22 AM', 
                  actorName: 'System',
                  description: 'Task #T-1001 linked to this intent'
              }
          ]
      };
  }
};
