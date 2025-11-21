
import { 
  Task, Staff, Reservation, AttendanceRecord, 
  ApiTaskOutput, ApiReservationOutput, ApiAttendanceOutput, ApiUserDashboardResponse,
  TaskType, TaskStatus, ReservationSource, AttendanceStatus
} from '../types';
import { 
  MOCK_STAFF, 
  MOCK_API_TASKS, 
  MOCK_API_RESERVATIONS, 
  MOCK_API_ATTENDANCE,
  MOCK_USER_DASHBOARD,
  MOCK_TIMESHEET_LOGS
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
    startDate: dto.checkIn ? dto.checkIn.split('T')[0] : '',
    endDate: dto.checkOut ? dto.checkOut.split('T')[0] : '',
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
  }
};
