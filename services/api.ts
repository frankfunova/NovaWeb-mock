
import { Task, Staff, Reservation, AttendanceRecord } from '../types';
import { MOCK_STAFF, INITIAL_TASKS, MOCK_RESERVATIONS, MOCK_ATTENDANCE } from './mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  fetchStaff: async (): Promise<Staff[]> => {
    await delay(500); // Simulate 500ms latency
    return [...MOCK_STAFF];
  },

  fetchTasks: async (date: Date): Promise<Task[]> => {
    await delay(600); // Simulate latency
    // In a real app, we would filter by date here. 
    // For mock, we just return all tasks.
    return [...INITIAL_TASKS];
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
    return [...MOCK_RESERVATIONS];
  },

  fetchAttendance: async (date: Date): Promise<AttendanceRecord[]> => {
    await delay(500);
    // Return mock attendance data
    return [...MOCK_ATTENDANCE];
  },

  // Mock aggregator for Timesheet view
  fetchTimesheetSummary: async (startDate: Date, endDate: Date): Promise<AttendanceRecord[]> => {
    await delay(600);
    
    // In a real backend, this would query the DB for sums between dates.
    // Here we simulate it by taking the MOCK_ATTENDANCE users and giving them random weekly totals.
    return MOCK_ATTENDANCE.map(record => {
        // Random hours between 20 and 50 for the period
        const randomHours = 20 + Math.random() * 30; 
        
        return {
            ...record,
            id: `${record.id}-summary`,
            status: '--', // Status usually irrelevant for historical timesheet summary
            attendanceDate: startDate.toISOString().split('T')[0], // Use start date as anchor
            firstClockInAt: startDate.toISOString(), // Use period start
            finalClockOutAt: endDate.toISOString(),   // Use period end
            totalWorkingDurationSec: Math.floor(randomHours * 3600)
        };
    });
  }
};
