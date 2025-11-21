
import { ApiTaskOutput, ApiReservationOutput, ApiAttendanceOutput, Staff, ApiUserDashboardResponse, AttendanceRecord } from '../types';

// Helper to create today's date with specific hour
const getTodayAt = (hour: number, minute: number = 0) => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
};

// Snowflake ID Generator (Mock)
const genId = (suffix: string) => `7333${suffix.padStart(14, '0')}`;

// --- MOCK STAFF ---
export const MOCK_STAFF: Staff[] = [
  {
    id: genId('101'),
    name: 'Example Housekeeper',
    initials: 'EH',
    role: 'Housekeeper',
    avatarColor: 'bg-orange-400',
    totalHours: 8,
    workedHours: 0,
    isWorking: false,
    shiftStart: 9,
    shiftEnd: 17,
  },
  {
    id: genId('102'),
    name: 'Frank Fu',
    initials: 'FF',
    role: 'Technician',
    avatarColor: 'bg-blue-500',
    totalHours: 8,
    workedHours: 4.5,
    isWorking: true,
    shiftStart: 9,
    shiftEnd: 17,
  },
  {
    id: genId('103'),
    name: 'Team Housekeeper',
    initials: 'TH',
    role: 'Housekeeper',
    avatarColor: 'bg-green-500',
    totalHours: 8,
    workedHours: 3,
    isWorking: true,
    shiftStart: 10,
    shiftEnd: 18,
  },
  {
    id: genId('104'),
    name: 'Test OP',
    initials: 'TO',
    role: 'Operator',
    avatarColor: 'bg-teal-600',
    totalHours: 8,
    workedHours: 1,
    isWorking: false,
    shiftStart: 9,
    shiftEnd: 17,
  },
  {
    id: genId('105'),
    name: 'John Smith',
    initials: 'JS',
    role: 'Maintenance',
    avatarColor: 'bg-purple-500',
    totalHours: 8,
    workedHours: 2,
    isWorking: true,
    shiftStart: 12,
    shiftEnd: 20,
  },
  {
    id: genId('106'),
    name: 'Alice Doe',
    initials: 'AD',
    role: 'Inspector',
    avatarColor: 'bg-red-500',
    totalHours: 7,
    workedHours: 5,
    isWorking: false,
    shiftStart: 9,
    shiftEnd: 16,
  },
  {
    id: genId('107'),
    name: 'Mike K.',
    initials: 'MK',
    role: 'Delivery',
    avatarColor: 'bg-indigo-500',
    totalHours: 6,
    workedHours: 1,
    isWorking: true,
    shiftStart: 9,
    shiftEnd: 15,
  },
  {
    id: genId('108'),
    name: 'Sarah Lee',
    initials: 'SL',
    role: 'Housekeeper',
    avatarColor: 'bg-pink-500',
    totalHours: 8,
    workedHours: 6,
    isWorking: true,
    shiftStart: 10,
    shiftEnd: 18,
  },
  {
    id: genId('109'),
    name: 'Ben Ross',
    initials: 'BR',
    role: 'Technician',
    avatarColor: 'bg-cyan-600',
    totalHours: 9,
    workedHours: 3.5,
    isWorking: false,
    shiftStart: 11,
    shiftEnd: 20,
  },
];

// --- MOCK TASKS (API Output Format) ---
export const MOCK_API_TASKS: ApiTaskOutput[] = [
  {
    id: genId('201'),
    pmsTaskId: 'T-1001',
    title: 'Fix lamp',
    description: 'Bedside lamp flickering in master bedroom',
    status: 'delayed',
    taskTypeCode: 'maintenance',
    priority: 'medium',
    assigneeId: genId('102'), // Frank Fu
    assignee: { id: genId('102'), fullName: 'Frank Fu', avatarUrl: null },
    listingId: 'L-001',
    listing: { id: 'L-001', title: 'Ocean View Villa', nickname: '2607 Guest Room' },
    plannedStartAt: getTodayAt(11, 0),
    plannedDurationSec: 3600, // 1h
    actualStart: getTodayAt(11, 15),
    actualDurationSec: 3600, // 1h (Actual)
    dueAt: getTodayAt(12, 0),
    feedbackNote: '+15m late start',
  },
  {
    id: genId('202'),
    pmsTaskId: 'T-1002',
    title: 'Check HVAC',
    description: 'Routine inspection of AC units',
    status: 'pending',
    taskTypeCode: 'inspection',
    priority: 'low',
    assigneeId: genId('102'), // Frank Fu
    assignee: { id: genId('102'), fullName: 'Frank Fu', avatarUrl: null },
    listingId: 'L-002',
    listing: { id: 'L-002', title: 'Beach House', nickname: 'Beach House' },
    plannedStartAt: getTodayAt(13, 0),
    plannedDurationSec: 7200, // 2h
    actualStart: null,
    actualDurationSec: 0,
    dueAt: getTodayAt(15, 0),
  },
  {
    id: genId('203'),
    pmsTaskId: 'T-1003',
    title: 'Deep cleaning',
    description: 'Full turnover cleaning including carpet shampoo',
    status: 'in_progress',
    taskTypeCode: 'cleaning',
    priority: 'high',
    assigneeId: genId('103'), // Team Housekeeper
    assignee: { id: genId('103'), fullName: 'Team Housekeeper', avatarUrl: null },
    listingId: 'L-001',
    listing: { id: 'L-001', title: 'Ocean View Villa', nickname: 'Ocean View Villa' },
    plannedStartAt: getTodayAt(10, 0),
    plannedDurationSec: 14400, // 4h
    actualStart: getTodayAt(10, 0),
    actualDurationSec: 16200, // 4.5h
    dueAt: getTodayAt(14, 0),
    feedbackNote: 'Running overtime due to extra mess',
  },
  {
    id: genId('204'),
    pmsTaskId: 'T-1004',
    title: 'Towel Delivery',
    description: 'Deliver 4 extra pool towels',
    status: 'pending',
    taskTypeCode: 'delivery',
    priority: 'low',
    assigneeId: null, // Unassigned
    assignee: null,
    listingId: 'L-003',
    listing: { id: 'L-003', title: 'Pool Area', nickname: 'Pool Area' },
    plannedStartAt: getTodayAt(9, 30),
    plannedDurationSec: 1800, // 0.5h
    actualStart: null,
    actualDurationSec: 0,
    dueAt: getTodayAt(10, 0),
  },
  {
    id: genId('205'),
    pmsTaskId: 'T-1005',
    title: 'Pool Filter',
    description: 'Clean and backwash pool filter',
    status: 'completed',
    taskTypeCode: 'maintenance',
    priority: 'medium',
    assigneeId: genId('105'), // John Smith
    assignee: { id: genId('105'), fullName: 'John Smith', avatarUrl: null },
    listingId: 'L-003',
    listing: { id: 'L-003', title: 'Main Pool', nickname: 'Main Pool' },
    plannedStartAt: getTodayAt(13, 0),
    plannedDurationSec: 7200,
    actualStart: getTodayAt(13, 0),
    actualDurationSec: 7200,
    dueAt: getTodayAt(15, 0),
  },
  {
    id: genId('206'),
    pmsTaskId: 'T-1006',
    title: 'Safety Check',
    description: 'Monthly safety inspection of lobby area',
    status: 'pending',
    taskTypeCode: 'inspection',
    priority: 'high',
    assigneeId: genId('106'), // Alice Doe
    assignee: { id: genId('106'), fullName: 'Alice Doe', avatarUrl: null },
    listingId: 'L-004',
    listing: { id: 'L-004', title: 'Lobby', nickname: 'Lobby' },
    plannedStartAt: getTodayAt(14, 30),
    plannedDurationSec: 3600,
    actualStart: null,
    actualDurationSec: 0,
    dueAt: getTodayAt(15, 30),
  },
  // List View specific tasks matching screenshot
  {
    id: genId('207'),
    pmsTaskId: 'T-1007',
    title: 'Replace the battery of the light fixture, 1st bedroom - 14...',
    description: 'Issue reported from Maintenance: Highlighted Answers ...',
    status: 'open',
    taskTypeCode: 'maintenance',
    priority: 'low',
    assigneeId: genId('102'),
    assignee: { id: genId('102'), fullName: 'MT - Luis', avatarUrl: null },
    listingId: '1415MV CG',
    listing: { id: '1415MV CG', title: '1415MV CG', nickname: '1415MV CG' },
    plannedStartAt: '2025-11-23T18:45:00Z',
    plannedDurationSec: 3600, // 1h
    actualStart: null,
    actualDurationSec: 0,
    dueAt: '2025-11-23T19:15:00Z'
  },
  {
    id: genId('208'),
    pmsTaskId: 'T-1008',
    title: 'check Propane - 3715LA WIR',
    description: '-',
    status: 'open',
    taskTypeCode: 'maintenance',
    priority: 'low',
    assigneeId: genId('999'),
    assignee: { id: genId('999'), fullName: 'Vendor - Golden Grill Carlos Gomes', avatarUrl: null },
    listingId: '3715LA WIR',
    listing: { id: '3715LA WIR', title: '3715LA WIR', nickname: '3715LA WIR' },
    plannedStartAt: '2025-11-20T18:00:00Z',
    plannedDurationSec: 3600,
    actualStart: null,
    actualDurationSec: 0,
    dueAt: '2025-11-20T19:00:00Z'
  },
  // New task for Frank Fu to ensure "Completed" segment shows up
  {
    id: genId('209'),
    pmsTaskId: 'T-1009',
    title: 'Previous Inspection',
    description: 'Morning check',
    status: 'completed',
    taskTypeCode: 'inspection',
    priority: 'medium',
    assigneeId: genId('102'), // Frank Fu
    assignee: { id: genId('102'), fullName: 'Frank Fu', avatarUrl: null },
    listingId: 'L-005',
    listing: { id: 'L-005', title: 'Clubhouse', nickname: 'Clubhouse' },
    plannedStartAt: getTodayAt(9, 0),
    plannedDurationSec: 7200, // 2h
    actualStart: getTodayAt(9, 0),
    actualDurationSec: 7200, // 2h (Actual)
    dueAt: getTodayAt(11, 0),
  }
];

// --- MOCK RESERVATIONS (API Output) ---
export const MOCK_API_RESERVATIONS: ApiReservationOutput[] = [
  {
    id: genId('301'),
    guestFullName: 'Jose Nava',
    reservationCode: 'HMQN9PFC8Q',
    reservationStatusCode: 'Confirmed',
    checkIn: '2025-12-29T15:00:00',
    checkOut: '2026-01-02T11:00:00',
    listing: { id: '1820SD', title: '1820SD WIR', nickname: '1820SD WIR' },
    guestscount: 10,
    nightsCount: 4,
    otaTypeCode: 'Airbnb',
    netIncome: '890.00',
    totalFees: '150.00'
  },
  {
    id: genId('302'),
    guestFullName: 'Alice Johnson',
    reservationCode: 'HA-zYkvt',
    reservationStatusCode: 'Checked In',
    checkIn: '2025-11-18T15:00:00',
    checkOut: '2025-11-25T11:00:00',
    listing: { id: '231BD', title: '231BD BV', nickname: '231BD BV' },
    guestscount: 4,
    nightsCount: 7,
    otaTypeCode: 'VRBO',
    netIncome: '1250.00',
    totalFees: '200.00'
  },
  {
    id: genId('303'),
    guestFullName: 'Michael Brown',
    reservationCode: 'HMQN9PFC8Q',
    reservationStatusCode: 'Pending',
    checkIn: '2025-12-01T15:00:00',
    checkOut: '2025-12-05T11:00:00',
    listing: { id: '8817RS', title: '8817RS WAW', nickname: '8817RS WAW' },
    guestscount: 2,
    nightsCount: 4,
    otaTypeCode: 'Booking',
    netIncome: '600.00',
    totalFees: '80.00'
  },
];

// --- MOCK ATTENDANCE (API Output) ---
export const MOCK_API_ATTENDANCE: ApiAttendanceOutput[] = [
  {
    id: genId('401'),
    userId: genId('102'),
    user: { id: genId('102'), fullName: 'Frank Fu', avatarUrl: null, department: 'Orlando Operation Team', position: 'Technician' },
    attendanceDate: '2025-11-19',
    attendanceStatus: 'working',
    firstClockInAt: '2025-11-19T09:00:00',
    finalClockOutAt: null,
    totalWorkingDurationSec: 16200, // 4.5h
    clockInCount: 1,
    clockOutCount: 0
  },
  {
    id: genId('402'),
    userId: genId('103'),
    user: { id: genId('103'), fullName: 'Team Housekeeper', avatarUrl: null, department: 'Toronto Office', position: 'Housekeeper' },
    attendanceDate: '2025-11-19',
    attendanceStatus: 'in_break',
    firstClockInAt: '2025-11-19T10:00:00',
    finalClockOutAt: null,
    totalWorkingDurationSec: 10800, // 3h
    clockInCount: 1,
    clockOutCount: 0
  },
  {
    id: genId('403'),
    userId: genId('105'),
    user: { id: genId('105'), fullName: 'John Smith', avatarUrl: null, department: 'Offshore CS Team', position: 'Maintenance' },
    attendanceDate: '2025-11-19',
    attendanceStatus: 'working',
    firstClockInAt: '2025-11-19T12:00:00',
    finalClockOutAt: null,
    totalWorkingDurationSec: 7200, // 2h
    clockInCount: 1,
    clockOutCount: 0
  },
  {
    id: genId('404'),
    userId: genId('101'),
    user: { id: genId('101'), fullName: 'Example Housekeeper', avatarUrl: null, department: 'Toronto Office', position: 'Housekeeper' },
    attendanceDate: '2025-11-19',
    attendanceStatus: 'off_duty',
    firstClockInAt: null,
    finalClockOutAt: null,
    totalWorkingDurationSec: 0,
    clockInCount: 0,
    clockOutCount: 0
  },
];

// --- MOCK USER DASHBOARD (StaffDetail) ---
export const MOCK_USER_DASHBOARD: ApiUserDashboardResponse = {
  performanceScore: {
    score: 92.5,
    letterGrade: 'A+',
    kpis: {
      avgDelay: -12, // 12 mins early
      completionRate: 87,
      efficiency: 94
    }
  },
  taskStats: {
    notStarted: 15,
    inProgress: 5,
    completed: 12,
    pending: 3,
    totalTaskActual: '100h 30m',
    totalTaskEstimated: '107h 15m',
    totalOtherWork: '15h 20m'
  },
  reviewStats: {
    overallRate: 4.8,
    totalReviewCount: 20,
    "5stars": 12,
    "4stars": 4,
    "3stars": 2,
    "2stars": 0,
    "1stars": 2
  },
  clockIns: [
    { in: '9:00 AM', out: '5:24 PM' },
    { in: '7:00 PM', out: '9:00 PM' }
  ],
  statsBreakdown: [
    { label: 'Assigned', time: '5:30', pct: '65%', color: 'bg-purple-50 text-purple-700' },
    { label: 'Other', time: '2:00', pct: '24%', color: 'bg-slate-50 text-slate-600' },
    { label: 'Travel', time: '0:09', pct: '2%', color: 'bg-amber-50 text-amber-700' },
    { label: 'Break', time: '0:45', pct: '9%', color: 'bg-rose-50 text-rose-700' },
  ],
  timelineEvents: [
    {
      type: 'TASK',
      title: 'Property Inspection - Unit 305',
      time: '9:00 AM - 11:15 AM',
      duration: '2:15',
      iconType: 'task',
      color: 'text-indigo-600'
    },
    {
      type: 'MEETING',
      title: 'Team Standup Meeting',
      time: '11:30 AM - 12:15 PM',
      duration: '0:45',
      iconType: 'meeting',
      color: 'text-purple-600'
    },
    {
      type: 'BREAK',
      title: 'Lunch Break',
      time: '12:15 PM - 1:00 PM',
      duration: '0:45',
      iconType: 'break',
      color: 'text-orange-600'
    },
    {
      type: 'TASK',
      title: 'HVAC Maintenance - Building A',
      time: '1:00 PM - 2:30 PM',
      duration: '1:30',
      iconType: 'task',
      color: 'text-indigo-600'
    }
  ]
};

// --- MOCK TIMESHEET LOGS ---
export const MOCK_TIMESHEET_LOGS: AttendanceRecord[] = [
  {
    id: genId('501'),
    userId: genId('102'),
    user: { id: genId('102'), fullName: 'Frank Fu', avatarColor: '', initials: 'FF', department: '--', position: '--' },
    attendanceDate: '2025-11-20',
    status: 'Working',
    regularHours: '8:00',
    overtimeHours: '0:45',
    totalHours: '8:45',
    payableHours: '8:45',
    hasWarning: false,
    totalWorkingDurationSec: 31500
  },
  {
    id: genId('502'),
    userId: genId('102'),
    user: { id: genId('102'), fullName: 'Frank Fu', avatarColor: '', initials: 'FF', department: '--', position: '--' },
    attendanceDate: '2025-11-19',
    status: 'Shift End',
    regularHours: '8:00',
    overtimeHours: '--',
    totalHours: '8:00',
    payableHours: '8:00',
    hasWarning: false,
    totalWorkingDurationSec: 28800
  },
  {
    id: genId('503'),
    userId: genId('102'),
    user: { id: genId('102'), fullName: 'Frank Fu', avatarColor: '', initials: 'FF', department: '--', position: '--' },
    attendanceDate: '2025-11-18',
    status: 'Shift End',
    regularHours: '7:30',
    overtimeHours: '--',
    totalHours: '7:30',
    payableHours: '7:30',
    hasWarning: true,
    totalWorkingDurationSec: 27000
  },
  {
    id: genId('504'),
    userId: genId('102'),
    user: { id: genId('102'), fullName: 'Frank Fu', avatarColor: '', initials: 'FF', department: '--', position: '--' },
    attendanceDate: '2025-11-17',
    status: 'Off duty',
    regularHours: '--',
    overtimeHours: '--',
    totalHours: '--',
    payableHours: '--',
    hasWarning: false,
    isOff: true,
    totalWorkingDurationSec: 0
  },
  {
    id: genId('505'),
    userId: genId('102'),
    user: { id: genId('102'), fullName: 'Frank Fu', avatarColor: '', initials: 'FF', department: '--', position: '--' },
    attendanceDate: '2025-11-16',
    status: 'Off duty',
    regularHours: '--',
    overtimeHours: '--',
    totalHours: '--',
    payableHours: '--',
    hasWarning: false,
    isOff: true,
    totalWorkingDurationSec: 0
  },
  {
    id: genId('506'),
    userId: genId('102'),
    user: { id: genId('102'), fullName: 'Frank Fu', avatarColor: '', initials: 'FF', department: '--', position: '--' },
    attendanceDate: '2025-11-15',
    status: 'Shift End',
    regularHours: '8:00',
    overtimeHours: '1:00',
    totalHours: '9:00',
    payableHours: '9:00',
    hasWarning: false,
    totalWorkingDurationSec: 32400
  }
];
