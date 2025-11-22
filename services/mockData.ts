
import { ApiTaskOutput, ApiReservationOutput, ApiAttendanceOutput, Staff, ApiUserDashboardResponse, AttendanceRecord, Review, InboxThread, InboxMessage, MapProperty, MapStaff } from '../types';

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

// --- MOCK MAP PROPERTIES ---
// Simulated Lat/Lng around Disney/Kissimmee area: 28.30, -81.55
export const MOCK_MAP_PROPERTIES: MapProperty[] = [
    {
        id: 'p1',
        title: '8808BC WAW',
        address: '8808 Bella Citta Blvd',
        coordinates: { lat: 28.304, lng: -81.551 },
        status: 'occupied',
        nextEvent: 'guest check out 11/21/2025 10AM',
        tasks: { completed: 1, total: 3 },
        pendingTasksCount: 2,
        completionPercent: 33
    },
    {
        id: 'p2',
        title: '8819IC CG',
        address: '8819 Indian Creek',
        coordinates: { lat: 28.310, lng: -81.560 },
        status: 'occupied',
        nextEvent: 'guest check out 11/21/2025 10AM',
        tasks: { completed: 0, total: 3 },
        pendingTasksCount: 3,
        completionPercent: 0
    },
    {
        id: 'p3',
        title: '3237LW WIR',
        address: '3237 Lake Wilson Rd',
        coordinates: { lat: 28.295, lng: -81.545 },
        status: 'occupied',
        nextEvent: 'guest check out 11/21/2025 10AM',
        tasks: { completed: 1, total: 3 },
        pendingTasksCount: 2,
        completionPercent: 33
    },
    {
        id: 'p4',
        title: '4041SB Sonoma',
        address: '4041 Sonoma Blvd',
        coordinates: { lat: 28.320, lng: -81.530 },
        status: 'occupied',
        nextEvent: 'guest check out 11/21/2025 10AM',
        tasks: { completed: 0, total: 1 },
        pendingTasksCount: 1,
        completionPercent: 0
    },
    {
        id: 'p5',
        title: '8942CBD Solara',
        address: '8942 Solara Resort',
        coordinates: { lat: 28.300, lng: -81.570 },
        status: 'vacant',
        nextEvent: 'guest check in 11/22/2025 4PM',
        tasks: { completed: 3, total: 3 },
        pendingTasksCount: 0,
        completionPercent: 100
    },
    {
        id: 'p6',
        title: '1522MV CG',
        address: '1522 Montego View',
        coordinates: { lat: 28.290, lng: -81.540 },
        status: 'occupied',
        nextEvent: 'guest check out 11/23/2025 10AM',
        tasks: { completed: 2, total: 5 },
        pendingTasksCount: 3,
        completionPercent: 40
    },
];

// --- MOCK MAP STAFF ---
export const MOCK_MAP_STAFF: MapStaff[] = MOCK_STAFF.slice(0, 6).map((s, idx) => ({
    ...s,
    coordinates: {
        lat: 28.30 + (Math.random() * 0.04 - 0.02), // Random spread around center
        lng: -81.55 + (Math.random() * 0.04 - 0.02)
    },
    tasksDone: Math.floor(Math.random() * 3),
    tasksTotal: Math.floor(Math.random() * 5) + 3,
    completionPercent: Math.floor(Math.random() * 100)
}));


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

// --- MOCK REVIEWS ---
export const MOCK_REVIEWS: Review[] = [
  {
    id: genId('601'),
    listingName: '2609DS WH',
    reservationCode: 'HMJEMQ3KMB',
    publicReview: 'Very nice would stay here again. The location was perfect for our family trip to Disney.',
    privateReview: 'The master bathroom sink drains a bit slowly.',
    rating: 5,
    cleanlinessRating: 5,
    accuracyRating: 5,
    communicationRating: 5,
    locationRating: 5,
    checkinRating: 5,
    valueRating: 5,
    reviewDate: '2025-11-17',
    ota: 'Airbnb',
    status: 'new',
    guestName: 'John Doe',
    guestLocation: 'New York, US',
    guestEmail: 'john.doe@example.com',
    guestPhone: '+1 555-0101',
    checkIn: '2025-11-13',
    checkOut: '2025-11-17',
    relatedStaff: [
        { name: 'Team HK', role: 'Cleaner', rating: 4.9, avatarColor: 'bg-green-500', initials: 'TH' },
        { name: 'Alice Doe', role: 'Inspector', rating: 4.8, avatarColor: 'bg-red-500', initials: 'AD' },
        { name: 'Support Team', role: 'Custom Service', rating: 5.0, avatarColor: 'bg-purple-500', initials: 'ST' },
        { name: 'Mike K.', role: 'Watcher', rating: 4.7, avatarColor: 'bg-indigo-500', initials: 'MK' }
    ]
  },
  {
    id: genId('602'),
    listingName: '15972SCD WCR',
    reservationCode: 'HMPJ3MDNHA',
    publicReview: 'Great house no problems from my group. Plenty of space and the pool was amazing.',
    rating: 3,
    cleanlinessRating: 5,
    accuracyRating: 5,
    communicationRating: 4,
    locationRating: 3,
    checkinRating: 5,
    valueRating: 5,
    reviewDate: '2025-11-16',
    ota: 'Airbnb',
    status: 'disputing',
    guestName: 'Sarah Smith',
    guestLocation: 'London, UK',
    guestEmail: 'sarah.smith@example.co.uk',
    checkIn: '2025-11-10',
    checkOut: '2025-11-16',
    relatedStaff: [
        { name: 'Team HK', role: 'Cleaner', rating: 4.9, avatarColor: 'bg-green-500', initials: 'TH' },
        { name: 'Frank Fu', role: 'Inspector', rating: 4.9, avatarColor: 'bg-blue-500', initials: 'FF' }
    ]
  },
  {
    id: genId('603'),
    listingName: '2903FS SL',
    reservationCode: 'HM2ZXD3S2K',
    publicReview: 'We absolutely loved the place! While yes it could use some upkeep with painting and a few tweaks for it to be SPOTLESS. But overall it was a great stay.',
    rating: 5,
    cleanlinessRating: 4,
    accuracyRating: 5,
    communicationRating: 5,
    locationRating: 5,
    checkinRating: 5,
    valueRating: 5,
    reviewDate: '2025-11-16',
    ota: 'Airbnb',
    status: 'new',
    guestName: 'Mike Johnson',
    guestLocation: 'Toronto, CA',
    guestEmail: 'mike.j@example.ca',
    guestPhone: '+1 416-555-0123',
    checkIn: '2025-11-12',
    checkOut: '2025-11-16',
    relatedStaff: [
        { name: 'Example Housekeeper', role: 'Cleaner', rating: 4.5, avatarColor: 'bg-orange-400', initials: 'EH' },
        { name: 'John Smith', role: 'Maintenance', rating: 4.8, avatarColor: 'bg-purple-500', initials: 'JS' }
    ]
  },
  {
    id: genId('604'),
    listingName: '2791PP SL',
    reservationCode: 'HMRPTHK8Y5',
    publicReview: 'Great place. Close to everything.',
    rating: 5,
    cleanlinessRating: 5,
    accuracyRating: 5,
    communicationRating: 5,
    locationRating: 5,
    checkinRating: 5,
    valueRating: 5,
    reviewDate: '2025-11-16',
    ota: 'Airbnb',
    status: 'new',
    guestName: 'Emily Davis',
    guestLocation: 'Chicago, US',
    guestEmail: 'emily.davis@example.com',
    checkIn: '2025-11-14',
    checkOut: '2025-11-16',
    relatedStaff: [
         { name: 'Team HK', role: 'Cleaner', rating: 4.9, avatarColor: 'bg-green-500', initials: 'TH' }
    ]
  },
  {
    id: genId('605'),
    listingName: '8801CD WAW',
    reservationCode: 'HMXJYKEW8R',
    publicReview: 'Arrived and given incorrect access code but dealt with quickly. The house was clean bar the skirting boards, but quite noisy due to construction nearby.',
    privateReview: 'Please update the code in the automated message.',
    rating: 3,
    cleanlinessRating: 4,
    accuracyRating: 2,
    communicationRating: 5,
    locationRating: 3,
    checkinRating: 2,
    valueRating: 3,
    reviewDate: '2025-11-15',
    ota: 'Airbnb',
    status: 'replied',
    guestName: 'Robert Brown',
    guestLocation: 'Manchester, UK',
    guestEmail: 'robert.brown@example.co.uk',
    checkIn: '2025-11-10',
    checkOut: '2025-11-15',
    relatedStaff: [
        { name: 'Sarah Lee', role: 'Cleaner', rating: 4.6, avatarColor: 'bg-pink-500', initials: 'SL' },
        { name: 'Support Team', role: 'Custom Service', rating: 5.0, avatarColor: 'bg-purple-500', initials: 'ST' }
    ]
  },
  {
    id: genId('606'),
    listingName: '2528SD VP',
    reservationCode: 'HMXNXZSYW5',
    publicReview: 'Great place to stay and communication was great',
    rating: 5,
    cleanlinessRating: 5,
    accuracyRating: 5,
    communicationRating: 5,
    locationRating: 5,
    checkinRating: 5,
    valueRating: 5,
    reviewDate: '2025-11-15',
    ota: 'Airbnb',
    status: 'new',
    guestName: 'Linda Wilson',
    guestLocation: 'Sydney, AU',
    guestEmail: 'linda.wilson@example.com.au',
    checkIn: '2025-11-08',
    checkOut: '2025-11-15',
    relatedStaff: [
        { name: 'Team HK', role: 'Cleaner', rating: 4.9, avatarColor: 'bg-green-500', initials: 'TH' }
    ]
  },
  {
    id: genId('607'),
    listingName: '2060LC WIR',
    reservationCode: 'HMEJS852YM',
    publicReview: 'Great house, plenty of space. Great communication. Great location. Thank you',
    rating: 5,
    cleanlinessRating: 5,
    accuracyRating: 5,
    communicationRating: 5,
    locationRating: 5,
    checkinRating: 5,
    valueRating: 5,
    reviewDate: '2025-11-15',
    ota: 'Airbnb',
    status: 'new',
    guestName: 'David Lee',
    guestLocation: 'Seoul, KR',
    guestEmail: 'david.lee@example.kr',
    checkIn: '2025-11-11',
    checkOut: '2025-11-15',
    relatedStaff: [
        { name: 'Team HK', role: 'Cleaner', rating: 4.9, avatarColor: 'bg-green-500', initials: 'TH' }
    ]
  },
  {
    id: genId('608'),
    listingName: '1060LS CG',
    reservationCode: 'HMXTDSZCP8',
    publicReview: 'Beautiful Home to stay with everything you may ever need in the house or in the community. Loved it',
    originalContent: 'Hermosa casa para alojarse con todo lo que pueda necesitar en la casa o en la comunidad. Me encantó.',
    originalLanguage: 'es',
    rating: 5,
    cleanlinessRating: 5,
    accuracyRating: 5,
    communicationRating: 5,
    locationRating: 5,
    checkinRating: 5,
    valueRating: 5,
    reviewDate: '2025-11-14',
    ota: 'Airbnb',
    status: 'new',
    guestName: 'Jennifer Garcia',
    guestLocation: 'Madrid, ES',
    guestEmail: 'jennifer.garcia@example.es',
    checkIn: '2025-11-09',
    checkOut: '2025-11-14',
    relatedStaff: [
        { name: 'Team HK', role: 'Cleaner', rating: 4.9, avatarColor: 'bg-green-500', initials: 'TH' }
    ]
  },
  {
    id: genId('609'),
    listingName: '1571MCW Solara',
    reservationCode: 'HA-aqZTLzp',
    publicReview: 'We had a great stay overall. I wish we had more information regarding the resort amenities. It was difficult to get in contact with the host at times.',
    rating: 4,
    cleanlinessRating: 5,
    accuracyRating: 4,
    communicationRating: 3,
    locationRating: 5,
    checkinRating: 4,
    valueRating: 4,
    reviewDate: '2025-11-14',
    ota: 'VRBO',
    status: 'new',
    guestName: 'James Martinez',
    guestLocation: 'Miami, US',
    guestEmail: 'james.martinez@example.com',
    checkIn: '2025-11-10',
    checkOut: '2025-11-14',
    relatedStaff: [
        { name: 'Team HK', role: 'Cleaner', rating: 4.9, avatarColor: 'bg-green-500', initials: 'TH' },
        { name: 'Support Team', role: 'Custom Service', rating: 5.0, avatarColor: 'bg-purple-500', initials: 'ST' }
    ]
  }
];

// --- MOCK INBOX THREADS ---

export const MOCK_INBOX_THREADS: InboxThread[] = [
  {
    id: 'th_1',
    guestName: 'Antionette Squaire',
    reservationCode: 'HMDRAYR3PC',
    listingName: '2433DS WAW',
    startDate: '2025-11-21',
    endDate: '2025-11-24',
    status: 'Confirmed',
    tags: ['1 unresolved'],
    unreadCount: 1,
    lastMessageTime: '24m ago',
    avatarColor: 'bg-emerald-500',
    sentiment: 'Satisfied',
    reservationId: genId('301') // Linking to mock reservation
  },
  {
    id: 'th_2',
    guestName: 'Roldan Millan',
    reservationCode: 'HMJ234KS9',
    listingName: '1820SD WIR',
    startDate: '2025-11-21',
    endDate: '2025-11-24',
    status: 'Confirmed',
    tags: ['1 unresolved'],
    unreadCount: 1,
    lastMessageTime: '5m ago',
    avatarColor: 'bg-blue-500',
    sentiment: 'Neutral',
    reservationId: genId('302')
  },
  {
    id: 'th_3',
    guestName: 'Phillip Bradwell',
    reservationCode: 'HMP938JK2',
    listingName: '231BD BV',
    startDate: '2025-11-21',
    endDate: '2025-11-23',
    status: 'Confirmed',
    tags: ['1 unresolved'],
    unreadCount: 1,
    lastMessageTime: '5m ago',
    avatarColor: 'bg-purple-500',
    sentiment: 'Satisfied',
    reservationId: genId('303')
  },
  {
    id: 'th_4',
    guestName: 'Jose Marinho',
    reservationCode: 'HMK8293JS',
    listingName: '8817RS WAW',
    startDate: '2025-12-05',
    endDate: '2025-12-16',
    status: 'Confirmed',
    tags: [],
    unreadCount: 0,
    lastMessageTime: '7m ago',
    avatarColor: 'bg-orange-500',
    sentiment: 'Satisfied',
    reservationId: genId('301')
  },
  {
    id: 'th_5',
    guestName: 'Shayla Wilson',
    reservationCode: 'HM9283KS',
    listingName: '1234 Main St',
    startDate: '2025-11-21',
    endDate: '2025-11-23',
    status: 'Confirmed',
    tags: ['1 unresolved'],
    unreadCount: 1,
    lastMessageTime: '11m ago',
    avatarColor: 'bg-pink-500',
    sentiment: 'Frustrated',
    reservationId: genId('302')
  },
  {
    id: 'th_6',
    guestName: 'LORENZO GRAINGER',
    reservationCode: 'HM19283JS',
    listingName: '9921 Ave',
    startDate: '2025-11-19',
    endDate: '2025-11-23',
    status: 'Confirmed',
    tags: ['2 unresolved'],
    unreadCount: 2,
    lastMessageTime: '30m ago',
    avatarColor: 'bg-indigo-500',
    sentiment: 'Neutral',
    reservationId: genId('303')
  },
  {
    id: 'th_7',
    guestName: 'Percy Scruggins',
    reservationCode: 'HM91283JS',
    listingName: '555 Ocean Dr',
    startDate: '2025-11-21',
    endDate: '2025-11-24',
    status: 'Confirmed',
    tags: ['1 unresolved'],
    unreadCount: 1,
    lastMessageTime: '31m ago',
    avatarColor: 'bg-teal-500',
    sentiment: 'Satisfied',
    reservationId: genId('301')
  }
];

// --- MOCK INBOX MESSAGES ---

export const MOCK_INBOX_MESSAGES: InboxMessage[] = [
  {
    id: 'msg_1',
    threadId: 'th_1',
    sender: 'system',
    content: 'Follow up Resolve',
    timestamp: 'Nov 21, 7:55 PM',
    type: 'event',
    metadata: { type: 'SR' }
  },
  {
    id: 'msg_2',
    threadId: 'th_1',
    sender: 'host',
    senderName: 'Mary Mae Tano',
    avatarUrl: 'https://i.pravatar.cc/150?u=mary',
    content: "Hi Antionette! Sorry for the trouble. Please use this code 411556 (√ or *) after 5 minutes. At this time, I understand your guests are already inside the house after we remotely unlocked the door for you. Let us know if the new code works or not, so we'll know if we need to send a technician.",
    timestamp: 'Nov 21, 8:11 PM',
    type: 'text'
  },
  {
    id: 'msg_3',
    threadId: 'th_1',
    sender: 'host',
    senderName: 'Mary Mae Tano',
    avatarUrl: 'https://i.pravatar.cc/150?u=mary',
    content: "IB (904) 554-6383\n\nHMDRAYR3PC | 2433DS WAW\nDoor code not working. Remotely unlocked door so the guests can get in. Generated backup door code for the guest.",
    timestamp: 'Nov 21, 8:29 PM',
    type: 'special'
  },
  {
    id: 'msg_4',
    threadId: 'th_1',
    sender: 'guest',
    content: "Ok thx Frank now the ac not getting cold",
    timestamp: 'Nov 21, 8:29 PM',
    type: 'text'
  },
  {
    id: 'msg_5',
    threadId: 'th_1',
    sender: 'system',
    content: 'Follow up Resolve',
    timestamp: 'Nov 21, 8:29 PM',
    type: 'event',
    metadata: { type: 'SR' }
  },
  {
    id: 'msg_6',
    threadId: 'th_1',
    sender: 'guest',
    content: "We are calling Mary whom I spoke with about the lock",
    timestamp: 'Nov 21, 8:30 PM',
    type: 'text'
  }
];