










import { ApiTaskOutput, ApiReservationOutput, ApiAttendanceOutput, Staff, ApiUserDashboardResponse, AttendanceRecord, Review, InboxThread, InboxMessage, MapProperty, MapStaff, Intent, Listing, GuestGuideItem, Agent, AgentLog, DynamicVariablesResponse, McpToolsResponse } from '../types';

// Helper to create today's date with specific hour
const getTodayAt = (hour: number, minute: number = 0) => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
};

// Snowflake ID Generator (Mock)
const genId = (suffix: string) => `7333${suffix.padStart(14, '0')}`;

// --- MOCK DYNAMIC VARIABLES ---
export const MOCK_DYNAMIC_VARIABLES: DynamicVariablesResponse = {
  "entities": [
    {
      "entity_type": "listing",
      "input_key": "listing_id",
      "fields": [
        {
          "code": "title",
          "description": "Property title/name",
          "template": "{{listing.title}}"
        },
        {
          "code": "nickname",
          "description": "Short property alias",
          "template": "{{listing.nickname}}"
        },
        {
          "code": "full_address",
          "description": "Complete address",
          "template": "{{listing.full_address}}"
        },
        {
          "code": "city",
          "description": "City name",
          "template": "{{listing.city}}"
        },
        {
          "code": "state",
          "description": "State/Province",
          "template": "{{listing.state}}"
        },
        {
          "code": "country",
          "description": "Country",
          "template": "{{listing.country}}"
        },
        {
          "code": "bedrooms",
          "description": "Number of bedrooms",
          "template": "{{listing.bedrooms}}"
        },
        {
          "code": "bathrooms",
          "description": "Number of bathrooms",
          "template": "{{listing.bathrooms}}"
        },
        {
          "code": "accommodates",
          "description": "Maximum guest capacity",
          "template": "{{listing.accommodates}}"
        },
        {
          "code": "property_type_code",
          "description": "Property type code",
          "template": "{{listing.property_type_code}}"
        },
        {
          "code": "timezone",
          "description": "Property timezone",
          "template": "{{listing.timezone}}"
        }
      ]
    },
    {
      "entity_type": "guest",
      "input_key": "guest_id",
      "fields": [
        {
          "code": "full_name",
          "description": "Guest full name",
          "template": "{{guest.full_name}}"
        },
        {
          "code": "first_name",
          "description": "First name",
          "template": "{{guest.first_name}}"
        },
        {
          "code": "last_name",
          "description": "Last name",
          "template": "{{guest.last_name}}"
        },
        {
          "code": "email",
          "description": "Email address",
          "template": "{{guest.email}}"
        },
        {
          "code": "phone",
          "description": "Phone number",
          "template": "{{guest.phone}}"
        },
        {
          "code": "preferred_language",
          "description": "Preferred language",
          "template": "{{guest.preferred_language}}"
        }
      ]
    },
    {
      "entity_type": "reservation",
      "input_key": "reservation_id",
      "fields": [
        {
          "code": "guest_full_name",
          "description": "Guest name on reservation",
          "template": "{{reservation.guest_full_name}}"
        },
        {
          "code": "reservation_status_code",
          "description": "Reservation status",
          "template": "{{reservation.reservation_status_code}}"
        },
        {
          "code": "ota_confirmation_code",
          "description": "OTA booking reference",
          "template": "{{reservation.ota_confirmation_code}}"
        },
        {
          "code": "check_in",
          "description": "Check-in date",
          "template": "{{reservation.check_in}}"
        },
        {
          "code": "check_out",
          "description": "Check-out date",
          "template": "{{reservation.check_out}}"
        },
        {
          "code": "nights_count",
          "description": "Number of nights",
          "template": "{{reservation.nights_count}}"
        },
        {
          "code": "guestscount",
          "description": "Number of guests",
          "template": "{{reservation.guestscount}}"
        }
      ]
    },
    {
      "entity_type": "task",
      "input_key": "task_id",
      "fields": [
        {
          "code": "title",
          "description": "Task title",
          "template": "{{task.title}}"
        },
        {
          "code": "task_type_code",
          "description": "Task type",
          "template": "{{task.task_type_code}}"
        },
        {
          "code": "status",
          "description": "Task status",
          "template": "{{task.status}}"
        },
        {
          "code": "priority",
          "description": "Priority level",
          "template": "{{task.priority}}"
        },
        {
          "code": "planned_start_at",
          "description": "Planned start time",
          "template": "{{task.planned_start_at}}"
        },
        {
          "code": "due_at",
          "description": "Due date/time",
          "template": "{{task.due_at}}"
        },
        {
          "code": "planned_duration_sec",
          "description": "Planned duration in seconds",
          "template": "{{task.planned_duration_sec}}"
        },
        {
          "code": "actual_duration_sec",
          "description": "Actual duration in seconds",
          "template": "{{task.actual_duration_sec}}"
        }
      ]
    }
  ]
};

// --- MOCK MCP TOOLS ---
export const MOCK_MCP_TOOLS: McpToolsResponse = {
  "tools": [
    {
      "name": "get_access_token_claims",
      "description": "Get the authenticated user's access token claims.",
      "inputSchema": null
    },
    {
      "name": "get_users",
      "description": "Search users (workers) with optional filtering. Supports MULTIPLE filter conditions.\n\nIMPORTANT - Understanding Users:\n- Users in this system are WORKERS (cleaners, maintenance staff, property managers, etc.)\n- The 'position_type_code' field indicates the worker's role/skills\n- This field is CRITICAL for task assignment - it helps match tasks to workers with appropriate skills\n- Examples: \"cleaner\", \"maintenance\", \"inspector\", \"manager\", etc.\n- Always consider position_type_code when assigning tasks to ensure the worker has the right skills\n\nKey fields: full_name, email, position_type_code, is_active, mobile, whatsapp_number\n\nArgs:\n    params: SearchParams with page, page_size, filters, order_by, columns.\n            filters supports multiple conditions: {\"field1\": {...}, \"field2\": {...}}",
      "inputSchema": null
    },
    {
      "name": "get_user",
      "description": "Get a specific user by ID.\n\nArgs:\n    user_id: User ID (snowflake ID)",
      "inputSchema": null
    },
    {
      "name": "get_listings",
      "description": "Search listings (properties) with optional filtering. Supports MULTIPLE filter conditions.\n\nKey fields: nickname, title, full_address, bedrooms, is_active, group_id\n\nArgs:\n    params: SearchParams with page, page_size, filters, order_by, columns.\n            filters supports multiple conditions: {\"field1\": {...}, \"field2\": {...}}",
      "inputSchema": null
    },
    {
      "name": "get_listing",
      "description": "Get a specific listing by ID.\n\nArgs:\n    listing_id: Listing ID (snowflake ID)",
      "inputSchema": null
    },
    {
      "name": "get_reviews",
      "description": "Search reviews with optional filtering. Supports MULTIPLE filter conditions.\n\nKey fields: ota_type_code, public_review, private_review, overall_rating\n\nArgs:\n    params: SearchParams with page, page_size, filters, order_by, columns.\n            filters supports multiple conditions: {\"field1\": {...}, \"field2\": {...}}",
      "inputSchema": null
    },
    {
      "name": "get_review",
      "description": "Get a specific review by ID.\n\nArgs:\n    review_id: Review ID (snowflake ID)",
      "inputSchema": null
    },
    {
        "name": "calendar_check",
        "description": "Check availability of a property for a given date range.",
        "inputSchema": null
    },
    {
        "name": "price_calculator",
        "description": "Calculate price for a stay based on dates and property.",
        "inputSchema": null
    },
    {
        "name": "property_search",
        "description": "Search for properties based on criteria.",
        "inputSchema": null
    },
    {
        "name": "staff_availability",
        "description": "Check staff availability.",
        "inputSchema": null
    },
    {
        "name": "create_work_order",
        "description": "Create a new work order task.",
        "inputSchema": null
    },
    {
        "name": "classify_issue",
        "description": "Classify a maintenance issue.",
        "inputSchema": null
    },
    {
        "name": "sentiment_analysis",
        "description": "Analyze sentiment of text.",
        "inputSchema": null
    },
    {
        "name": "draft_reply",
        "description": "Draft a reply to a review or message.",
        "inputSchema": null
    },
    {
        "name": "market_data_fetch",
        "description": "Fetch market data for pricing.",
        "inputSchema": null
    },
    {
        "name": "update_rates",
        "description": "Update nightly rates for a property.",
        "inputSchema": null
    },
    {
        "name": "schedule_task",
        "description": "Schedule a task for a staff member.",
        "inputSchema": null
    },
    {
        "name": "get_checkouts",
        "description": "Get checkout events for a date.",
        "inputSchema": null
    }
  ]
};

// --- MOCK AGENTS ---
export const MOCK_AGENTS: Agent[] = [
    {
        id: '1',
        name: 'Reservation Assistant',
        isActive: true,
        description: 'Handles guest inquiries about availability and booking details. Automates responses for common questions.',
        optimizedDescription: 'You are an expert reservation assistant for a vacation rental company. Your goal is to help guests find the perfect property and answer their questions accurately. Be polite, professional, and concise. Use the available tools to check calendar availability and pricing.',
        tools: ['calendar_check', 'price_calculator', 'property_search'],
        agentType: 'Customer Service',
        modelName: 'gpt-4o',
        createdAt: '2023-10-15T08:30:00Z',
        updatedAt: '2023-11-20T14:15:00Z',
        requiredInput: [['guest_query'], ['check_in_date', 'check_out_date']],
        expectedOutput: 'A polite response answering the guest inquiry or providing booking options.'
    },
    {
        id: '2',
        name: 'Maintenance Dispatcher',
        isActive: true,
        description: 'Analyzes maintenance requests and assigns them to the appropriate staff member or vendor.',
        optimizedDescription: 'Act as a maintenance dispatcher. Analyze the incoming maintenance request to determine the urgency and category (Plumbing, HVAC, Electrical, etc.). Based on the location and skill required, recommend the best available staff member from the list. Create a draft work order.',
        tools: ['staff_availability', 'create_work_order', 'classify_issue'],
        agentType: 'Operations',
        modelName: 'gpt-4-turbo',
        createdAt: '2023-09-01T10:00:00Z',
        updatedAt: '2023-12-05T09:45:00Z',
        requiredInput: [['issue_description'], ['property_id']],
        expectedOutput: 'JSON object containing issue category, priority, and assigned staff ID.'
    },
    {
        id: '3',
        name: 'Review Responder',
        isActive: false,
        description: 'Drafts responses to guest reviews based on sentiment and specific feedback points.',
        optimizedDescription: 'You are a PR specialist for a hospitality brand. Draft a warm and professional response to the following guest review. If the review is positive, thank them specifically for what they liked. If negative, apologize for the specific issues mentioned and state that the team is looking into it. Do not admit liability.',
        tools: ['sentiment_analysis', 'draft_reply'],
        agentType: 'Marketing',
        modelName: 'gpt-3.5-turbo',
        createdAt: '2023-11-10T11:20:00Z',
        updatedAt: '2023-11-10T11:20:00Z',
        requiredInput: [['review_text', 'rating']],
        expectedOutput: 'A draft response string.'
    },
    {
        id: '4',
        name: 'Pricing Optimizer',
        isActive: true,
        description: 'Adjusts nightly rates based on occupancy, demand, and local events.',
        tools: ['market_data_fetch', 'update_rates'],
        agentType: 'Revenue Management',
        createdAt: '2023-08-20T15:00:00Z',
        updatedAt: '2024-01-10T08:00:00Z',
        requiredInput: [['date_range'], ['listing_id']],
    },
    {
        id: '5',
        name: 'Housekeeping Scheduler',
        isActive: true,
        description: 'Auto-schedules cleaning tasks based on checkout times and staff availability.',
        tools: ['schedule_task', 'get_checkouts'],
        agentType: 'Operations',
        modelName: 'gpt-4o',
        createdAt: '2023-12-01T09:00:00Z',
        updatedAt: '2024-01-15T16:30:00Z',
        requiredInput: [['date']],
    }
];

// --- MOCK AGENT LOGS ---
export const MOCK_AGENT_LOGS: AgentLog[] = [
    {
        id: genId('701'),
        agentId: '1',
        toolName: 'Reservation Assistant',
        status: 'success',
        durationMs: 2450,
        tokenUsage: 450,
        promptTokens: 300,
        completionTokens: 150,
        modelName: 'gpt-4o',
        llmCallCount: 1,
        createdAt: '2025-11-20T14:30:00Z',
        inputContext: {
            guest_query: "Is the pool heated?",
            property_id: "L-001"
        },
        finalPrompt: "Context: Property L-001 has a heated pool. Guest asks: Is the pool heated? Answer politely.",
        userId: genId('1001'),
        userName: 'Guest (System)'
    },
    {
        id: genId('702'),
        agentId: '2',
        toolName: 'Maintenance Dispatcher',
        status: 'success',
        durationMs: 3100,
        tokenUsage: 620,
        promptTokens: 500,
        completionTokens: 120,
        modelName: 'gpt-4-turbo',
        llmCallCount: 2,
        createdAt: '2025-11-20T10:15:00Z',
        inputContext: {
            issue_description: "AC is leaking water in the living room",
            property_id: "L-003"
        },
        finalPrompt: "Classify issue: AC leak. Urgency: High. Recommend staff: Frank Fu (HVAC specialist nearby).",
        userId: genId('104'),
        userName: 'Test OP'
    },
    {
        id: genId('703'),
        agentId: '1',
        toolName: 'Reservation Assistant',
        status: 'failed',
        durationMs: 5000,
        tokenUsage: 100,
        promptTokens: 100,
        completionTokens: 0,
        modelName: 'gpt-4o',
        llmCallCount: 1,
        createdAt: '2025-11-19T18:20:00Z',
        inputContext: {
            guest_query: "What is the wifi password?",
            property_id: "UNKNOWN"
        },
        errorMessage: "Property ID not found in database",
        errorTraceback: "Error: Property ID not found\n    at Tool.execute (tools/property_search.ts:45)\n    at Agent.run (core/agent.ts:120)",
        userId: genId('1001'),
        userName: 'Guest (System)'
    },
    {
        id: genId('704'),
        agentId: '3',
        toolName: 'Review Responder',
        status: 'success',
        durationMs: 1800,
        tokenUsage: 350,
        promptTokens: 250,
        completionTokens: 100,
        modelName: 'gpt-3.5-turbo',
        llmCallCount: 1,
        createdAt: '2025-11-19T09:00:00Z',
        inputContext: {
            review_text: "Great stay, but noisy neighbors.",
            rating: 4
        },
        finalPrompt: "Draft reply to 4-star review mentioning noise. Apologize for noise, thank for stay.",
        userId: genId('105'),
        userName: 'John Smith'
    },
    {
        id: genId('705'),
        agentId: '2',
        toolName: 'Maintenance Dispatcher',
        status: 'success',
        durationMs: 2900,
        tokenUsage: 580,
        promptTokens: 400,
        completionTokens: 180,
        modelName: 'gpt-4-turbo',
        llmCallCount: 1,
        createdAt: '2025-11-18T16:45:00Z',
        inputContext: {
            issue_description: "Pool light is flickering",
            property_id: "L-005"
        },
        userId: genId('104'),
        userName: 'Test OP'
    }
];

// --- MOCK LISTINGS ---
export const MOCK_LISTINGS: Listing[] = [
    {
        id: 'l1',
        nickname: '5481MOC Solterra',
        address: '5481 Misty Oak Circle, Davenport, Florida 33837, United States',
        group: 'No Group',
        bedroomCount: 5,
        isActive: true,
        status: 'Active'
    },
    {
        id: 'l2',
        nickname: '1820SD WIR (New)',
        address: '1820 Summer Dr, Davenport, FL 33897, USA',
        group: 'No Group',
        bedroomCount: 5,
        isActive: true,
        status: 'Active'
    },
    {
        id: 'l3',
        nickname: '1594MCW Solara',
        address: '1594 Mermaid Cove Way, Kissimmee, Florida 34747, United States',
        group: 'No Group',
        bedroomCount: 9,
        isActive: true,
        status: 'Active'
    },
    {
        id: 'l4',
        nickname: '7510BD MVV',
        address: '7510 Brooklyn Drive, Kissimmee, Florida 34747, United States',
        group: 'MVV',
        bedroomCount: 4,
        isActive: true,
        status: 'Active'
    },
    {
        id: 'l5',
        nickname: '2735NPB Unit 95',
        address: '2735 North Poinciana Boulevard, Kissimmee, Florida 34746, United States',
        group: 'No Group',
        bedroomCount: 3,
        isActive: true,
        status: 'Active'
    },
    {
        id: 'l6',
        nickname: '7580BD MVV',
        address: '7580 Brooklyn Drive, Kissimmee, Florida 34747, United States',
        group: 'MVV',
        bedroomCount: 4,
        isActive: true,
        status: 'Active'
    },
    {
        id: 'l7',
        nickname: '3991SB Sonoma',
        address: '3991 Sonoma Blvd, Kissimmee, FL 34741, USA',
        group: 'Sonoma',
        bedroomCount: 15,
        isActive: true,
        status: 'Active'
    },
    {
        id: 'l8',
        nickname: '2828SS SL',
        address: '2828 Simile Street, Kissimmee, Florida 34746, United States',
        group: 'SL',
        bedroomCount: 9,
        isActive: true,
        status: 'Active'
    },
    {
        id: 'l9',
        nickname: '8831IC CG',
        address: '8831 Interlocking Court, Davenport, Florida 33896, United States',
        group: 'CG',
        bedroomCount: 8,
        isActive: true,
        status: 'Active'
    },
    {
        id: 'l10',
        nickname: '1852NC WAW',
        address: '1852 Nice Ct, Kissimmee, FL 34747, USA',
        group: 'WAW',
        bedroomCount: 8,
        isActive: true,
        status: 'Active'
    },
    {
        id: 'l11',
        nickname: '9012 Palm Tree Rd',
        address: '9012 Palm Tree Road, Orlando, FL 32801, USA',
        group: 'No Group',
        bedroomCount: 6,
        isActive: true,
        status: 'Active'
    },
    {
        id: 'l12',
        nickname: '101 Ocean Dr',
        address: '101 Ocean Drive, Miami, FL 33139, USA',
        group: 'Miami',
        bedroomCount: 4,
        isActive: false,
        status: 'Inactive'
    },
    {
        id: 'l13',
        nickname: '4421 Sunset Blvd',
        address: '4421 Sunset Boulevard, Los Angeles, CA 90027, USA',
        group: 'LA',
        bedroomCount: 3,
        isActive: true,
        status: 'Active'
    }
];

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

// --- MOCK INTENTS ---

export const MOCK_INTENTS: Intent[] = [
    {
        id: 'i1',
        description: 'Hello Jessica and Paul, we are traveling with 2 families t...',
        status: 'new',
        priority: 'low',
        source: 'Airbnb',
        intentTypeCode: 'SR',
        listingId: '-',
        createdAt: 'Nov 22',
    },
    {
        id: 'i2',
        description: 'Good Afternoon! Wow our people are trinkling in, I am s...',
        status: 'new',
        priority: 'low',
        source: 'Airbnb',
        intentTypeCode: 'SR',
        listingId: '1563PW CG',
        createdAt: 'Nov 22',
    },
    {
        id: 'i3',
        description: 'Thank you for opening the door. We were able to get ins...',
        status: 'new',
        priority: 'high',
        source: 'Airbnb',
        intentTypeCode: 'SR',
        listingId: '2311LC WIR',
        createdAt: 'Nov 22',
    },
    {
        id: 'i4',
        description: 'Reservation HMWFYMEDQM status changed to confirm...',
        status: 'new',
        priority: 'low',
        source: 'System',
        intentTypeCode: 'SR',
        listingId: '2231LC WIR',
        createdAt: 'Nov 22',
    },
    {
        id: 'i5',
        description: 'Hello, currently people are still in the house. The repair...',
        status: 'new',
        priority: 'low',
        source: 'Airbnb',
        intentTypeCode: 'SR',
        listingId: '8819IC CG',
        createdAt: 'Nov 22',
    },
    {
        id: 'i6',
        description: 'Messages not syncing - 2025-11-22T17:41:42.729202+...',
        status: 'new',
        priority: 'medium',
        source: 'System',
        intentTypeCode: 'SR',
        listingId: '8819IC CG',
        createdAt: 'Nov 22',
    },
    {
        id: 'i7',
        description: 'System Notes: 8819IC CG / HMR8F5MXC2 / CS - Claire ...',
        status: 'new',
        priority: 'high',
        source: 'System',
        intentTypeCode: 'SR',
        listingId: '8819IC CG',
        createdAt: 'Nov 22',
    },
    {
        id: 'i8',
        description: 'WO ID:6744e2d0d2a2e00012b903d6-251 WO NAME: st...',
        status: 'new',
        priority: 'low',
        source: 'Vendor',
        intentTypeCode: 'SR',
        listingId: '8819IC CG',
        createdAt: 'Nov 22',
    },
    {
        id: 'i9',
        description: 'Good afternoon i wanted to make sure it is established ...',
        status: 'new',
        priority: 'low',
        source: 'Airbnb',
        intentTypeCode: 'SR',
        listingId: '1155DL CG',
        createdAt: 'Nov 22',
    },
    {
        id: 'i10',
        description: 'PH Invoice: https://www.airbnb.com/resolutions/CLA-F...',
        status: 'new',
        priority: 'medium',
        source: 'Airbnb',
        intentTypeCode: 'SR',
        listingId: '547MB BV',
        createdAt: 'Nov 22',
    },
    {
        id: 'i11',
        description: 'Good afternoon I was wondering if you could have som...',
        status: 'new',
        priority: 'medium',
        source: 'Airbnb',
        intentTypeCode: 'SR',
        listingId: '751PBD CG',
        createdAt: 'Nov 22',
    },
];

// --- MOCK GUEST GUIDE ITEMS ---
export const MOCK_GUEST_GUIDE_ITEMS: GuestGuideItem[] = [
    {
        id: 'g1',
        title: 'Welcome',
        subtitle: 'Welcome message for guests',
        category: 'Welcome',
        content: 'We are delighted to have you stay at The Pink Door! Please make yourself at home.',
    },
    {
        id: 'g2',
        title: 'Reservation Info',
        subtitle: 'Details about your reservation',
        category: 'Welcome',
        content: 'Check-in: 4:00 PM\nCheck-out: 11:00 AM',
    },
    {
        id: 'g3',
        title: 'Getting Here',
        subtitle: 'Directions and transportation info',
        category: 'Welcome',
        content: 'From the airport, take I-4 West to exit 64...',
    },
    {
        id: 'g4',
        title: 'Access Code',
        subtitle: 'Property access information',
        category: 'Access',
        content: 'Your door code is 1234#',
    },
    {
        id: 'g5',
        title: 'Wifi',
        subtitle: 'Internet connection details',
        category: 'Access',
        content: 'Network: PinkDoorGuest\nPassword: happyguest',
    },
    {
        id: 'g6',
        title: 'Pool Rules',
        subtitle: 'Pool usage guidelines',
        category: 'Policy',
        content: 'No glass near the pool. Pool hours are 8am - 10pm.',
    }
];