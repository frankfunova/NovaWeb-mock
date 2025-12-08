

export type TaskType = 'cleaning' | 'maintenance' | 'inspection' | 'delivery';

// Added 'new' to TaskStatus, and backend statuses
export type TaskStatus = 'new' | 'pending' | 'in-progress' | 'completed' | 'delayed' | 'open' | 'cancelled' | 'closed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

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

export interface JobResult {
  resultType?: 'Fixed' | 'Not Fixed' | 'Partial Fixed';
  staffNotes?: string;
  followUpRequired?: boolean;
  managerFeedback?: {
    rating?: number;
    note?: string;
  };
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
  jobResult?: JobResult;
}

export interface TimeSlot {
  label: string;
  value: number; // hour integer
}

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
  rating: number; // 1-5
  // Breakdown ratings
  accuracyRating?: number;
  checkinRating?: number;
  cleanlinessRating?: number;
  communicationRating?: number;
  locationRating?: number;
  valueRating?: number;
  
  reviewDate: string; // ISO string
  ota: ReservationSource;
  status: 'new' | 'replied' | 'ignored' | 'disputing';
  
  guestName?: string;
  guestAvatar?: string;
  guestLocation?: string;
  guestEmail?: string;
  guestPhone?: string;
  
  checkIn?: string;
  checkOut?: string;
  relatedStaff?: ReviewStaff[];

  insight?: ReviewInsight | null; 

  // Translation fields
  originalLanguage?: string;
  originalContent?: string;
}

// --- Attendance Types ---

export type AttendanceStatus = 'Off duty' | 'Shift End' | 'Working' | 'In break' | '--';
export type Department = 'Toronto Office' | 'Orlando Operation Team' | 'Offshore CS Team' | 'Development Team' | '--';
// Expanded Position type to include roles found in mock data
export type Position = 'Maintenance' | 'Inspector' | 'Guest Service' | 'Owner Service' | 'Office Admin' | 'Accountant' | 'Dispatcher' | 'Cleaner' | 'Technician' | 'Housekeeper' | 'Operator' | 'Delivery' | '--';
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

// --- Intent Types ---

export interface IntentAttachment {
    id: string;
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnailUrl?: string;
    name: string;
    uploadedAt: string;
}

export interface IntentTask {
    id: string;
    title: string;
    status: TaskStatus;
    assigneeName?: string;
    priority?: TaskPriority;
    assignedAt?: string;
}

export interface IntentTimelineEvent {
    id: string;
    type: 'creation' | 'status_change' | 'comment' | 'task_linked' | 'resolution' | 'reopen';
    title: string;
    description?: string;
    timestamp: string;
    actorName: string;
    actorAvatar?: string;
    actorInitials?: string;
    actorColor?: string;
}

export interface Intent {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed' | 'new';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: string;
  intentTypeCode: string;
  listingId?: string;
  reservationId?: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedNote?: string;
  resolvedBy?: string;
  
  // Detailed fields
  listing?: { id: string; nickname: string; address?: string };
  reservation?: { id: string; guestName: string; reservationCode: string; status: string };
  category?: { name: string; code: string };
  subcategory?: { name: string; code: string };
  attachments?: IntentAttachment[];
  linkedTasks?: IntentTask[];
  timeline?: IntentTimelineEvent[];
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

// --- Listing Types ---

export interface Listing {
  id: string;
  nickname: string;
  address: string;
  group: string;
  bedroomCount: number;
  isActive: boolean;
  status: 'Active' | 'Inactive';
}

// --- Guest Guide Types ---

export interface GuestGuideItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Welcome' | 'Access' | 'Policy' | 'House Manual' | 'Local';
  content?: string;
  icon?: string;
}

// --- AI Agent Types ---

export interface Agent {
  id: string;
  name: string;
  isActive: boolean;
  description: string;
  optimizedDescription?: string;
  tools: string[];
  expectedOutput?: string;
  agentType: string;
  modelName?: string;
  createdAt: string;
  updatedAt: string;
  requiredInput?: string[][]; // Array of acceptable alternatives, e.g. [["listing_id", "listing.nickname"]]
}

export interface AgentLog {
    id: string;
    agentId?: string;
    toolName: string;
    status: 'success' | 'failed';
    durationMs: number;
    tokenUsage: number;
    promptTokens: number;
    completionTokens: number;
    modelName: string;
    llmCallCount: number;
    createdAt: string;
    inputContext?: Record<string, any>;
    errorMessage?: string;
    errorTraceback?: string;
    finalPrompt?: string;
    userId?: string;
    userName?: string; 
}

// --- Dashboard & Stats Types ---

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
  // Extra fields often returned in relations
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
  status: string | null; // open, in_progress, completed, cancelled, closed
  taskTypeCode: string | null; // maintenance, cleaning, inspection, delivery
  priority: string | null; // high, medium, low
  assigneeId: string | null;
  assignee: ApiUserRef | null;
  listingId: string | null;
  listing: ApiListingRef | null;
  plannedStartAt: string | null; // ISO 8601
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
  reservationCode: string | null; // pmsReservationId or otaConfirmationCode
  reservationStatusCode: string | null;
  checkIn: string | null;
  checkOut: string | null;
  listing: ApiListingRef | null;
  guestscount: number | null;
  nightsCount: number | null;
  otaTypeCode: string | null;
  netIncome?: string | null;
  totalFees?: string | null;
  // Add other fields from ReservationOutput as needed
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