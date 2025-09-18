
export enum UserRole {
  Student = 'Student',
  Lecturer = 'Lecturer',
  Admin = 'Admin',
}

export enum NotificationTarget {
  All = 'All',
  Student = 'Student',
  Lecturer = 'Lecturer',
  Admin = 'Admin',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  section?: string;
}

export interface Subject {
  id:string;
  name: string;
  code: string;
  lecturerId: string;
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  isAvailable: boolean;
}

export interface TimetableEntry {
  day: string;
  timeSlot: string;
  subject: string;
  lecturer: string;
  classroom: string;
  section: string;
}

export interface Faculty {
    id: string;
    name: string;
    department: string;
    workload: number; // e.g., hours per week
    availability: string[]; // e.g., ['Monday', 'Tuesday']
}

export type TimetableStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected';

export interface TimetableObject {
    id: string;
    version: number;
    status: TimetableStatus;
    entries: TimetableEntry[];
    createdAt: string;
    notes?: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  target: NotificationTarget;
  section?: string;
}

export interface Conflict {
    day: string;
    timeSlot: string;
    message: string;
}