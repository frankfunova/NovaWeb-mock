
// --- UI Domain Types (Used by React Components) ---

export type TaskType = 'cleaning' | 'maintenance' | 'inspection' | 'delivery';

export type TaskStatus = 'new' | 'pending' | 'in-progress' | 'completed' | 'delayed' | 'open' | 'cancelled' | 'closed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface FilterState {
  searchQuery: string;
  types: TaskType[];
  statuses: TaskStatus[];
  assigneeId: string | null;
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
  shiftStart: number;
  shiftEnd: number;
}

export interface Task {
  id: string;
  staffId: string | null;
  title: string;
  location: string;
  type: TaskType;
  startTime: number; // UI specific: float hours (e.g. 14.5 for 2:30 PM)
  duration: number; // UI specific: float hours
  plannedStartTime: number;
  plannedDuration: number;
  status: TaskStatus;
  notes?: string;
  priority?: TaskPriority;
  propertyName?: string;
  description?: string;
  scheduledAt?: string; // ISO string
  assigneeName?: string;
  isVendor?: boolean;
}

export interface TimeSlot {
  label: string;
  value: number;
}

export type ReservationSource = 'Airbnb' | 'VRBO' | 'Booking' | 'Direct';
export type ReservationStatus = 'Confirmed' | 'Cancelled' | 'Pending' | 'Checked In' | 'Checked Out';

export interface Reservation {
  id: string;
  propertyCode: string;
  reservationCode: string;
  startDate: string;
  endDate: string;
  source: ReservationSource;
  guestName: string;
  nights: number;
  status: ReservationStatus;
  guestCount: number;
  payout: number;
  email?: string;
  phone?: string;
}

export interface ReviewInsight {
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  topics: string[];
  summary: string; // The main issues or praise summary
  generatedAt: string;
}

export interface ReviewStaff {
  name: string;
  role: string;
  rating: number; // Performance score (e.g. 4.8)
  avatarColor: string;
  initials: string;
}

export interface Review {
  id: string;
  listingName: string;
  reservationCode: string;
  publicReview: string;
  privateReview?: string;
  rating: number; // 1-5 Overall
  // Breakdown ratings
  accuracyRating?: number;
  checkinRating?: number;
  cleanlinessRating?: number;
  communicationRating?: number;
  locationRating?: number;
  valueRating?: number;
  
  reviewDate: string; // ISO string
  ota: ReservationSource;
  status: 'new' | 'replied' | 'ignored';
  
  guestName?: string;
  guestAvatar?: string;
  guestLocation?: string;
  
  // New fields for Flyout Header/Detail
  checkIn?: string;
  checkOut?: string;
  relatedStaff?: ReviewStaff[];

  insight?: ReviewInsight | null; 
}

export type AttendanceStatus = 'Off duty' | 'Shift End' | 'Working' | 'In break' | '--';
export type Department = 'Toronto Office' | 'Orlando Operation Team' | 'Offshore CS Team' | 'Development Team' | '--';
export type Position = 'Maintenance' | 'Inspector' | 'Guest Service' | 'Owner Service' | 'Office Admin' | 'Accountant' | 'Dispatcher' | 'Cleaner' | 'Technician' | 'Housekeeper' | 'Operator' | 'Delivery' | '--';
export type ViewMode = 'daily' | 'timesheet';

export interface AttendanceUser {
  id: string;
  fullName: string;
  avatarColor: string;
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
  firstClockInAt?: string;
  finalClockOutAt?: string;
  clockInLocation?: string;
  clockInCount?: number;
  clockOutCount?: number;
  totalWorkingDurationSec: number;
  // Extended fields for timesheet view
  regularHours?: string;
  overtimeHours?: string;
  totalHours?: string;
  payableHours?: string;
  hasWarning?: boolean;
  isOff?: boolean;
}

// --- Inbox Types ---

export interface InboxThread {
  id: string;
  guestName: string;
  reservationCode: string;
  listingName: string; // Used for property code in UI
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  tags: string[]; // e.g., "1 unresolved"
  unreadCount: number;
  lastMessageTime: string;
  avatarColor: string;
  sentiment: 'Satisfied' | 'Neutral' | 'Frustrated';
  reservationId: string; // Link to full reservation details
}

export interface InboxMessage {
  id: string;
  threadId: string;
  sender: 'host' | 'guest' | 'system';
  senderName?: string; // e.g., "CS - Mary Mae Tano"
  avatarUrl?: string; 
  content: string;
  timestamp: string;
  type: 'text' | 'event' | 'note' | 'special'; // special for yellow box/code
  metadata?: any; // for resolve/follow-up buttons
}

// --- Map Types ---

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapProperty {
  id: string;
  title: string;
  address: string;
  coordinates: Coordinates;
  status: 'occupied' | 'vacant';
  nextEvent: string;
  tasks: {
    completed: number;
    total: number;
  };
  pendingTasksCount: number;
  completionPercent: number;
}

export interface MapStaff extends Staff {
  coordinates: Coordinates;
  tasksDone: number;
  tasksTotal: number;
  completionPercent: number;
}

// --- Dashboard & Stats Types (OpenAPI) ---

export interface PerformanceKPIs {
  completionRate: number;
  efficiency: number;
  avgDelay: number;
}

export interface PerformanceScore {
  score: number;
  letterGrade: string;
  kpis: PerformanceKPIs;
}

export interface TaskStats {
  notStarted: number;
  inProgress: number;
  completed: number;
  pending: number;
  totalTaskActual: string;
  totalTaskEstimated: string;
  totalOtherWork: string;
}

export interface ReviewStats {
  overallRate: number;
  totalReviewCount: number;
  "5stars": number;
  "4stars": number;
  "3stars": number;
  "2stars": number;
  "1stars": number;
}

export interface TimelineEvent {
  type: string;
  title: string;
  time: string;
  duration: string;
  color: string;
  iconType: 'task' | 'meeting' | 'break' | 'default';
}

export interface ApiUserDashboardResponse {
  performanceScore: PerformanceScore;
  taskStats: TaskStats;
  reviewStats: ReviewStats;
  // Mock fields for UI timeline
  timelineEvents?: TimelineEvent[]; 
  clockIns?: { in: string; out: string }[];
  statsBreakdown?: { label: string; time: string; pct: string; color: string }[];
}

// --- Backend DTOs (Derived from OpenAPI) ---

export interface ApiUserRef {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  department?: string;
  position?: string;
}

export interface ApiListingRef {
  id: string;
  title: string | null;
  nickname: string | null;
}

export interface ApiTaskOutput {
  id: string;
  pmsTaskId: string | null;
  title: string | null;
  description: string | null;
  status: string | null;
  taskTypeCode: string | null;
  priority: string | null;
  assigneeId: string | null;
  assignee: ApiUserRef | null;
  listingId: string | null;
  listing: ApiListingRef | null;
  plannedStartAt: string | null;
  plannedDurationSec: number | null;
  actualStart: string | null;
  actualDurationSec: number | null;
  dueAt: string | null;
  feedbackNote?: string | null;
  extraInfo?: Record<string, any> | null;
}

export interface ApiReservationOutput {
  id: string;
  guestFullName: string | null;
  reservationCode: string | null;
  reservationStatusCode: string | null;
  checkIn: string | null;
  checkOut: string | null;
  listing: ApiListingRef | null;
  guestscount: number | null;
  nightsCount: number | null;
  otaTypeCode: string | null;
  netIncome?: string | null;
  totalFees?: string | null;
}

export interface ApiAttendanceOutput {
  id: string;
  userId: string;
  user: ApiUserRef | null;
  attendanceDate: string | null;
  attendanceStatus: string | null;
  firstClockInAt: string | null;
  finalClockOutAt: string | null;
  totalWorkingDurationSec: number | null;
  clockInCount?: number;
  clockOutCount?: number;
}
