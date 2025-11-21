
export type TaskType = 'cleaning' | 'maintenance' | 'inspection' | 'delivery';

export type TaskStatus = 'new' | 'pending' | 'in-progress' | 'completed' | 'delayed';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface FilterState {
  searchQuery: string;
  types: TaskType[];
  statuses: TaskStatus[];
  assigneeId: string | null; // null = all, 'unassigned' = unassigned, 'id' = specific staff
}

export interface Staff {
  id: string;
  name: string;
  initials: string;
  role: string;
  avatarColor: string;
  totalHours: number;
  workedHours: number;
  isWorking: boolean;
  shiftStart: number; // 24h format integer (e.g. 9 for 9 AM)
  shiftEnd: number;   // 24h format integer (e.g. 17 for 5 PM)
}

export interface Task {
  id: string;
  staffId: string | null; // null means unassigned
  title: string;
  location: string;
  type: TaskType;
  startTime: number; // 24h format float (e.g., 9.5 = 9:30 AM) -> ACTUAL start time
  duration: number; // in hours -> ACTUAL duration
  plannedStartTime: number; 
  plannedDuration: number;
  status: TaskStatus;
  notes?: string;
  
  // Extended fields for List View
  priority?: TaskPriority;
  propertyName?: string;
  description?: string; // Secondary text in list view
  scheduledAt?: string; // ISO Date string for list view display
  assigneeName?: string; // Optional override for display
  isVendor?: boolean; // To show vendor badge/icon
}

export interface TimeSlot {
  label: string;
  value: number; // hour integer
}

// --- Reservation Types ---

export type ReservationSource = 'Airbnb' | 'VRBO' | 'Booking' | 'Direct';
export type ReservationStatus = 'Confirmed' | 'Cancelled' | 'Pending' | 'Checked In' | 'Checked Out';

export interface Reservation {
  id: string;
  propertyCode: string;
  reservationCode: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  source: ReservationSource;
  guestName: string;
  nights: number;
  status: ReservationStatus;
  guestCount: number;
  payout: number;
  email?: string;
  phone?: string;
}

// --- Attendance Types ---

export type AttendanceStatus = 'Off duty' | 'Shift End' | 'Working' | 'In break' | '--';
export type Department = 'Toronto Office' | 'Orlando Operation Team' | 'Offshore CS Team' | 'Development Team' | '--';
export type Position = 'Maintenance' | 'Inspector' | 'Guest Service' | 'Owner Service' | 'Office Admin' | 'Accountant' | 'Dispatcher' | 'Cleaner' | '--';
export type ViewMode = 'daily' | 'timesheet';

export interface AttendanceUser {
  id: string;
  fullName: string;
  avatarColor: string; // Helper for UI
  initials: string;
  department: Department;
  position: Position;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  user: AttendanceUser;
  attendanceDate: string;
  status: AttendanceStatus;
  firstClockInAt?: string; // ISO string
  finalClockOutAt?: string; // ISO string
  clockInLocation?: string;
  clockInCount?: number;
  clockOutCount?: number;
  totalWorkingDurationSec: number;
}