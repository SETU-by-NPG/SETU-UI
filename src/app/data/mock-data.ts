// Mock data for SETU EMS

export type Role = "admin" | "teacher" | "student" | "parent" | "librarian";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  section: string;
  rollNo: string;
  attendancePercent: number;
  gpa: number;
  guardian: string;
  guardianEmail: string;
  status: "active" | "inactive";
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
  classes: string[];
  status: "active" | "inactive";
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  status: "active" | "graded" | "overdue";
  submissions: number;
  total: number;
  description: string;
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  rollNo: string;
  status: "present" | "absent" | "late" | "excused";
}

export interface GradeEntry {
  studentId: string;
  studentName: string;
  assignment: string;
  score: number;
  maxScore: number;
  grade: string;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  author: string;
  target: string;
}

export interface TimetableSlot {
  period: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

// ─── System Admin Data ────────────────────────────────

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: Role | "staff";
  department?: string;
  status: "active" | "inactive" | "suspended" | "pending";
  lastLogin: string;
  createdAt: string;
  twoFactorEnabled: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  severity: "info" | "warning" | "critical";
}

export interface RolePermission {
  id: string;
  roleName: string;
  description: string;
  userCount: number;
  permissions: {
    module: string;
    read: boolean;
    write: boolean;
    delete: boolean;
    manage: boolean;
  }[];
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  storageUsed: string;
  storageTotal: string;
  uptime: string;
  apiCallsToday: number;
  avgResponseTime: string;
  activeSessionsNow: number;
  pendingInvites: number;
  failedLogins24h: number;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  status: "connected" | "disconnected" | "error";
  lastSync: string;
  description: string;
}

export const systemMetrics: SystemMetrics = {
  totalUsers: 892,
  activeUsers: 743,
  storageUsed: "42.8 GB",
  storageTotal: "100 GB",
  uptime: "99.97%",
  apiCallsToday: 28453,
  avgResponseTime: "142ms",
  activeSessionsNow: 186,
  pendingInvites: 14,
  failedLogins24h: 7,
};

export const systemUsers: SystemUser[] = [
  { id: "su1", name: "Dr. Sarah Mitchell", email: "sarah.mitchell@setu.edu", role: "admin", department: "IT Administration", status: "active", lastLogin: "2026-02-27 09:15", createdAt: "2024-08-01", twoFactorEnabled: true },
  { id: "su2", name: "Raj Patel", email: "raj.patel@setu.edu", role: "admin", department: "IT Administration", status: "active", lastLogin: "2026-02-27 08:45", createdAt: "2024-08-01", twoFactorEnabled: true },
  { id: "su3", name: "Mr. John Williams", email: "john.w@setu.edu", role: "teacher", department: "Mathematics", status: "active", lastLogin: "2026-02-27 07:30", createdAt: "2024-09-01", twoFactorEnabled: false },
  { id: "su4", name: "Ms. Rachel Adams", email: "rachel.a@setu.edu", role: "teacher", department: "Science", status: "active", lastLogin: "2026-02-26 16:20", createdAt: "2024-09-01", twoFactorEnabled: true },
  { id: "su5", name: "Mr. Peter Brown", email: "peter.b@setu.edu", role: "teacher", department: "English", status: "active", lastLogin: "2026-02-27 08:10", createdAt: "2024-09-15", twoFactorEnabled: false },
  { id: "su6", name: "Ms. Diana Clark", email: "diana.c@setu.edu", role: "teacher", department: "History", status: "active", lastLogin: "2026-02-25 14:00", createdAt: "2025-01-10", twoFactorEnabled: false },
  { id: "su7", name: "Mr. Kevin Lee", email: "kevin.l@setu.edu", role: "teacher", department: "Computer Science", status: "active", lastLogin: "2026-02-27 09:00", createdAt: "2025-01-10", twoFactorEnabled: true },
  { id: "su8", name: "Alice Johnson", email: "alice@setu.edu", role: "student", status: "active", lastLogin: "2026-02-27 08:00", createdAt: "2025-09-01", twoFactorEnabled: false },
  { id: "su9", name: "Ben Carter", email: "ben@setu.edu", role: "student", status: "active", lastLogin: "2026-02-26 17:45", createdAt: "2025-09-01", twoFactorEnabled: false },
  { id: "su10", name: "Clara Davis", email: "clara@setu.edu", role: "student", status: "active", lastLogin: "2026-02-27 07:55", createdAt: "2025-09-01", twoFactorEnabled: false },
  { id: "su11", name: "David Evans", email: "david@setu.edu", role: "student", status: "inactive", lastLogin: "2026-01-15 10:00", createdAt: "2025-09-01", twoFactorEnabled: false },
  { id: "su12", name: "Emma Foster", email: "emma@setu.edu", role: "student", status: "active", lastLogin: "2026-02-27 08:20", createdAt: "2025-09-01", twoFactorEnabled: false },
  { id: "su13", name: "Frank Green", email: "frank@setu.edu", role: "student", status: "suspended", lastLogin: "2026-02-10 09:00", createdAt: "2025-09-01", twoFactorEnabled: false },
  { id: "su14", name: "Grace Hall", email: "grace@setu.edu", role: "student", status: "active", lastLogin: "2026-02-27 07:50", createdAt: "2025-09-01", twoFactorEnabled: false },
  { id: "su15", name: "Henry Irving", email: "henry@setu.edu", role: "student", status: "active", lastLogin: "2026-02-26 15:30", createdAt: "2025-09-01", twoFactorEnabled: false },
  { id: "su16", name: "Robert Johnson", email: "robert@email.com", role: "parent", status: "active", lastLogin: "2026-02-26 20:15", createdAt: "2025-09-05", twoFactorEnabled: false },
  { id: "su17", name: "Lisa Carter", email: "lisa@email.com", role: "parent", status: "active", lastLogin: "2026-02-25 18:00", createdAt: "2025-09-05", twoFactorEnabled: false },
  { id: "su18", name: "Mark Davis", email: "mark@email.com", role: "parent", status: "pending", lastLogin: "—", createdAt: "2026-02-20", twoFactorEnabled: false },
  { id: "su19", name: "Helen Evans", email: "helen@email.com", role: "parent", status: "active", lastLogin: "2026-02-24 19:30", createdAt: "2025-09-05", twoFactorEnabled: false },
  { id: "su20", name: "Anita Sharma", email: "anita.s@setu.edu", role: "staff", department: "Front Office", status: "active", lastLogin: "2026-02-27 08:30", createdAt: "2025-01-15", twoFactorEnabled: false },
];

export const auditLogs: AuditLogEntry[] = [
  { id: "al1", timestamp: "2026-02-27 09:15:22", user: "Dr. Sarah Mitchell", userRole: "Admin", action: "Login", module: "Authentication", details: "Successful login via SSO", ipAddress: "192.168.1.105", severity: "info" },
  { id: "al2", timestamp: "2026-02-27 09:10:05", user: "Raj Patel", userRole: "Admin", action: "User Created", module: "User Management", details: "Created new parent account: Mark Davis (mark@email.com)", ipAddress: "192.168.1.110", severity: "info" },
  { id: "al3", timestamp: "2026-02-27 08:55:41", user: "System", userRole: "System", action: "Backup Completed", module: "Data Management", details: "Daily automated backup completed successfully (2.3 GB)", ipAddress: "—", severity: "info" },
  { id: "al4", timestamp: "2026-02-27 08:45:12", user: "Mr. Kevin Lee", userRole: "Teacher", action: "Grade Updated", module: "Gradebook", details: "Updated grades for Python Basics Project - 12-A", ipAddress: "192.168.2.45", severity: "info" },
  { id: "al5", timestamp: "2026-02-27 08:30:00", user: "Unknown", userRole: "—", action: "Failed Login", module: "Authentication", details: "Failed login attempt for admin@setu.edu (invalid password, 3rd attempt)", ipAddress: "203.45.67.89", severity: "warning" },
  { id: "al6", timestamp: "2026-02-27 08:22:17", user: "Dr. Sarah Mitchell", userRole: "Admin", action: "Role Modified", module: "Roles & Permissions", details: "Updated Teacher role: enabled 'Export Reports' permission", ipAddress: "192.168.1.105", severity: "info" },
  { id: "al7", timestamp: "2026-02-27 08:15:33", user: "Dr. Sarah Mitchell", userRole: "Admin", action: "User Suspended", module: "User Management", details: "Suspended student account: Frank Green (policy violation)", ipAddress: "192.168.1.105", severity: "warning" },
  { id: "al8", timestamp: "2026-02-27 07:58:09", user: "System", userRole: "System", action: "SSL Certificate", module: "Security", details: "SSL certificate renewal initiated - expires in 30 days", ipAddress: "—", severity: "warning" },
  { id: "al9", timestamp: "2026-02-26 22:00:00", user: "System", userRole: "System", action: "Maintenance Window", module: "Platform", details: "Scheduled maintenance completed: DB optimization, cache purge", ipAddress: "—", severity: "info" },
  { id: "al10", timestamp: "2026-02-26 18:45:22", user: "Unknown", userRole: "—", action: "Brute Force Detected", module: "Security", details: "Multiple failed login attempts detected from IP 203.45.67.89 — IP auto-blocked", ipAddress: "203.45.67.89", severity: "critical" },
  { id: "al11", timestamp: "2026-02-26 16:30:00", user: "Raj Patel", userRole: "Admin", action: "Module Toggled", module: "System Settings", details: "Enabled 'Library Management' module for all users", ipAddress: "192.168.1.110", severity: "info" },
  { id: "al12", timestamp: "2026-02-26 14:20:15", user: "Ms. Rachel Adams", userRole: "Teacher", action: "Bulk Import", module: "Attendance", details: "Imported attendance records for Grade 10-A (25 records)", ipAddress: "192.168.2.30", severity: "info" },
  { id: "al13", timestamp: "2026-02-26 11:05:00", user: "Dr. Sarah Mitchell", userRole: "Admin", action: "API Key Rotated", module: "Integrations", details: "Rotated API key for Google Workspace integration", ipAddress: "192.168.1.105", severity: "warning" },
  { id: "al14", timestamp: "2026-02-26 09:00:00", user: "System", userRole: "System", action: "Storage Alert", module: "Platform", details: "Storage usage crossed 40% threshold (42.8 GB / 100 GB)", ipAddress: "—", severity: "warning" },
  { id: "al15", timestamp: "2026-02-25 15:30:00", user: "Raj Patel", userRole: "Admin", action: "Password Policy", module: "Security", details: "Updated password policy: minimum 10 characters, require special character", ipAddress: "192.168.1.110", severity: "info" },
];

export const rolePermissions: RolePermission[] = [
  {
    id: "rp1",
    roleName: "Administrator",
    description: "Full system access — IT administration, user management, platform configuration, and all modules",
    userCount: 2,
    permissions: [
      { module: "User Management", read: true, write: true, delete: true, manage: true },
      { module: "Roles & Permissions", read: true, write: true, delete: true, manage: true },
      { module: "Students", read: true, write: true, delete: true, manage: true },
      { module: "Teachers", read: true, write: true, delete: true, manage: true },
      { module: "Attendance", read: true, write: true, delete: true, manage: true },
      { module: "Assignments", read: true, write: true, delete: true, manage: true },
      { module: "Gradebook", read: true, write: true, delete: true, manage: true },
      { module: "Timetable", read: true, write: true, delete: true, manage: true },
      { module: "Reports & Analytics", read: true, write: true, delete: true, manage: true },
      { module: "Announcements", read: true, write: true, delete: true, manage: true },
      { module: "Messages", read: true, write: true, delete: false, manage: true },
      { module: "Audit Logs", read: true, write: false, delete: false, manage: true },
      { module: "System Settings", read: true, write: true, delete: true, manage: true },
      { module: "Data & Backups", read: true, write: true, delete: true, manage: true },
      { module: "Integrations", read: true, write: true, delete: true, manage: true },
    ],
  },
  {
    id: "rp2",
    roleName: "Teacher",
    description: "Manage assigned classes, mark attendance, create assignments, grade students, view timetable",
    userCount: 5,
    permissions: [
      { module: "User Management", read: false, write: false, delete: false, manage: false },
      { module: "Roles & Permissions", read: false, write: false, delete: false, manage: false },
      { module: "Students", read: true, write: false, delete: false, manage: false },
      { module: "Teachers", read: true, write: false, delete: false, manage: false },
      { module: "Attendance", read: true, write: true, delete: false, manage: false },
      { module: "Assignments", read: true, write: true, delete: true, manage: false },
      { module: "Gradebook", read: true, write: true, delete: false, manage: false },
      { module: "Timetable", read: true, write: false, delete: false, manage: false },
      { module: "Reports & Analytics", read: true, write: false, delete: false, manage: false },
      { module: "Announcements", read: true, write: true, delete: false, manage: false },
      { module: "Messages", read: true, write: true, delete: false, manage: false },
      { module: "Audit Logs", read: false, write: false, delete: false, manage: false },
      { module: "System Settings", read: false, write: false, delete: false, manage: false },
      { module: "Data & Backups", read: false, write: false, delete: false, manage: false },
      { module: "Integrations", read: false, write: false, delete: false, manage: false },
    ],
  },
  {
    id: "rp3",
    roleName: "Student",
    description: "View own grades, attendance, timetable, submit assignments, read announcements",
    userCount: 650,
    permissions: [
      { module: "User Management", read: false, write: false, delete: false, manage: false },
      { module: "Roles & Permissions", read: false, write: false, delete: false, manage: false },
      { module: "Students", read: false, write: false, delete: false, manage: false },
      { module: "Teachers", read: false, write: false, delete: false, manage: false },
      { module: "Attendance", read: true, write: false, delete: false, manage: false },
      { module: "Assignments", read: true, write: true, delete: false, manage: false },
      { module: "Gradebook", read: true, write: false, delete: false, manage: false },
      { module: "Timetable", read: true, write: false, delete: false, manage: false },
      { module: "Reports & Analytics", read: false, write: false, delete: false, manage: false },
      { module: "Announcements", read: true, write: false, delete: false, manage: false },
      { module: "Messages", read: false, write: false, delete: false, manage: false },
      { module: "Audit Logs", read: false, write: false, delete: false, manage: false },
      { module: "System Settings", read: false, write: false, delete: false, manage: false },
      { module: "Data & Backups", read: false, write: false, delete: false, manage: false },
      { module: "Integrations", read: false, write: false, delete: false, manage: false },
    ],
  },
  {
    id: "rp4",
    roleName: "Parent",
    description: "View child's grades, attendance, report cards, communicate with teachers",
    userCount: 235,
    permissions: [
      { module: "User Management", read: false, write: false, delete: false, manage: false },
      { module: "Roles & Permissions", read: false, write: false, delete: false, manage: false },
      { module: "Students", read: true, write: false, delete: false, manage: false },
      { module: "Teachers", read: false, write: false, delete: false, manage: false },
      { module: "Attendance", read: true, write: false, delete: false, manage: false },
      { module: "Assignments", read: true, write: false, delete: false, manage: false },
      { module: "Gradebook", read: true, write: false, delete: false, manage: false },
      { module: "Timetable", read: true, write: false, delete: false, manage: false },
      { module: "Reports & Analytics", read: true, write: false, delete: false, manage: false },
      { module: "Announcements", read: true, write: false, delete: false, manage: false },
      { module: "Messages", read: true, write: true, delete: false, manage: false },
      { module: "Audit Logs", read: false, write: false, delete: false, manage: false },
      { module: "System Settings", read: false, write: false, delete: false, manage: false },
      { module: "Data & Backups", read: false, write: false, delete: false, manage: false },
      { module: "Integrations", read: false, write: false, delete: false, manage: false },
    ],
  },
  {
    id: "rp5",
    roleName: "Librarian",
    description: "Full access to library management — book catalog, issuing, returns, and fines",
    userCount: 1,
    permissions: [
      { module: "User Management", read: false, write: false, delete: false, manage: false },
      { module: "Roles & Permissions", read: false, write: false, delete: false, manage: false },
      { module: "Students", read: true, write: false, delete: false, manage: false },
      { module: "Teachers", read: true, write: false, delete: false, manage: false },
      { module: "Attendance", read: false, write: false, delete: false, manage: false },
      { module: "Assignments", read: false, write: false, delete: false, manage: false },
      { module: "Gradebook", read: false, write: false, delete: false, manage: false },
      { module: "Timetable", read: false, write: false, delete: false, manage: false },
      { module: "Reports & Analytics", read: true, write: false, delete: false, manage: false },
      { module: "Announcements", read: true, write: true, delete: false, manage: false },
      { module: "Messages", read: true, write: true, delete: false, manage: false },
      { module: "Library", read: true, write: true, delete: true, manage: true },
      { module: "Audit Logs", read: false, write: false, delete: false, manage: false },
      { module: "System Settings", read: false, write: false, delete: false, manage: false },
      { module: "Data & Backups", read: false, write: false, delete: false, manage: false },
      { module: "Integrations", read: false, write: false, delete: false, manage: false },
    ],
  },
];

export const integrations: Integration[] = [
  { id: "int1", name: "Google Workspace", category: "Productivity", status: "connected", lastSync: "2026-02-27 06:00", description: "SSO, Google Classroom sync, Drive storage" },
  { id: "int2", name: "Microsoft 365", category: "Productivity", status: "disconnected", lastSync: "—", description: "Teams integration, OneDrive, Outlook sync" },
  { id: "int3", name: "Zoom", category: "Communication", status: "connected", lastSync: "2026-02-27 08:00", description: "Virtual classrooms and meeting scheduling" },
  { id: "int4", name: "Twilio / SMS Gateway", category: "Notifications", status: "connected", lastSync: "2026-02-27 09:10", description: "SMS alerts for attendance, announcements" },
  { id: "int5", name: "Razorpay", category: "Payments", status: "connected", lastSync: "2026-02-26 23:59", description: "Fee collection and payment processing" },
  { id: "int6", name: "AWS S3", category: "Storage", status: "connected", lastSync: "2026-02-27 09:00", description: "File storage for assignments and documents" },
  { id: "int7", name: "SendGrid", category: "Email", status: "error", lastSync: "2026-02-26 15:00", description: "Transactional email delivery service" },
];

export const userActivityChart = [
  { hour: "6 AM", users: 12 },
  { hour: "7 AM", users: 45 },
  { hour: "8 AM", users: 186 },
  { hour: "9 AM", users: 320 },
  { hour: "10 AM", users: 285 },
  { hour: "11 AM", users: 265 },
  { hour: "12 PM", users: 180 },
  { hour: "1 PM", users: 210 },
  { hour: "2 PM", users: 245 },
  { hour: "3 PM", users: 190 },
  { hour: "4 PM", users: 120 },
  { hour: "5 PM", users: 65 },
  { hour: "6 PM", users: 40 },
];

export const usersByRoleChart = [
  { role: "Students", count: 650 },
  { role: "Teachers", count: 5 },
  { role: "Parents", count: 235 },
  { role: "Admins", count: 2 },
];

export const storageBreakdown = [
  { category: "Assignments", size: 18.2 },
  { category: "Documents", size: 10.5 },
  { category: "Backups", size: 8.4 },
  { category: "Media", size: 4.2 },
  { category: "System", size: 1.5 },
];

export const recentBackups = [
  { id: "bk1", date: "2026-02-27 03:00", size: "2.3 GB", type: "Automated", status: "completed" },
  { id: "bk2", date: "2026-02-26 03:00", size: "2.3 GB", type: "Automated", status: "completed" },
  { id: "bk3", date: "2026-02-25 14:30", size: "2.2 GB", type: "Manual", status: "completed" },
  { id: "bk4", date: "2026-02-25 03:00", size: "2.2 GB", type: "Automated", status: "completed" },
  { id: "bk5", date: "2026-02-24 03:00", size: "2.2 GB", type: "Automated", status: "failed" },
];

// ─── Original Academic Data ───────────────────────────

export const currentUser: User = {
  id: "u1",
  name: "Dr. Sarah Mitchell",
  email: "sarah.mitchell@setu.edu",
  role: "admin",
};

export const students: Student[] = [
  { id: "s1", name: "Alice Johnson", email: "alice@setu.edu", grade: "10", section: "A", rollNo: "1001", attendancePercent: 94, gpa: 3.8, guardian: "Robert Johnson", guardianEmail: "robert@email.com", status: "active" },
  { id: "s2", name: "Ben Carter", email: "ben@setu.edu", grade: "10", section: "A", rollNo: "1002", attendancePercent: 87, gpa: 3.2, guardian: "Lisa Carter", guardianEmail: "lisa@email.com", status: "active" },
  { id: "s3", name: "Clara Davis", email: "clara@setu.edu", grade: "10", section: "B", rollNo: "1003", attendancePercent: 96, gpa: 3.9, guardian: "Mark Davis", guardianEmail: "mark@email.com", status: "active" },
  { id: "s4", name: "David Evans", email: "david@setu.edu", grade: "11", section: "A", rollNo: "1101", attendancePercent: 78, gpa: 2.9, guardian: "Helen Evans", guardianEmail: "helen@email.com", status: "active" },
  { id: "s5", name: "Emma Foster", email: "emma@setu.edu", grade: "11", section: "A", rollNo: "1102", attendancePercent: 91, gpa: 3.5, guardian: "Tom Foster", guardianEmail: "tom@email.com", status: "active" },
  { id: "s6", name: "Frank Green", email: "frank@setu.edu", grade: "11", section: "B", rollNo: "1103", attendancePercent: 85, gpa: 3.0, guardian: "Nancy Green", guardianEmail: "nancy@email.com", status: "active" },
  { id: "s7", name: "Grace Hall", email: "grace@setu.edu", grade: "12", section: "A", rollNo: "1201", attendancePercent: 98, gpa: 4.0, guardian: "James Hall", guardianEmail: "james@email.com", status: "active" },
  { id: "s8", name: "Henry Irving", email: "henry@setu.edu", grade: "12", section: "A", rollNo: "1202", attendancePercent: 72, gpa: 2.5, guardian: "Patricia Irving", guardianEmail: "pat@email.com", status: "active" },
];

export const teachers: Teacher[] = [
  { id: "t1", name: "Mr. John Williams", email: "john.w@setu.edu", department: "Mathematics", subjects: ["Algebra", "Calculus"], classes: ["10-A", "11-A", "12-A"], status: "active" },
  { id: "t2", name: "Ms. Rachel Adams", email: "rachel.a@setu.edu", department: "Science", subjects: ["Physics", "Chemistry"], classes: ["10-A", "10-B", "11-A"], status: "active" },
  { id: "t3", name: "Mr. Peter Brown", email: "peter.b@setu.edu", department: "English", subjects: ["English Literature", "Grammar"], classes: ["10-A", "10-B", "11-B"], status: "active" },
  { id: "t4", name: "Ms. Diana Clark", email: "diana.c@setu.edu", department: "History", subjects: ["World History", "Geography"], classes: ["11-A", "11-B", "12-A"], status: "active" },
  { id: "t5", name: "Mr. Kevin Lee", email: "kevin.l@setu.edu", department: "Computer Science", subjects: ["Programming", "Data Structures"], classes: ["11-A", "12-A"], status: "active" },
];

export const assignments: Assignment[] = [
  { id: "a1", title: "Quadratic Equations Problem Set", subject: "Algebra", class: "10-A", dueDate: "2026-03-02", status: "active", submissions: 18, total: 25, description: "Solve problems 1-20 from Chapter 5. Show all working." },
  { id: "a2", title: "Newton's Laws Lab Report", subject: "Physics", class: "10-A", dueDate: "2026-02-28", status: "overdue", submissions: 22, total: 25, description: "Write a lab report on the experiments conducted in class." },
  { id: "a3", title: "Shakespeare Essay", subject: "English Literature", class: "10-B", dueDate: "2026-03-05", status: "active", submissions: 8, total: 23, description: "Write a 1000-word essay analyzing themes in Macbeth." },
  { id: "a4", title: "Chemical Bonding Worksheet", subject: "Chemistry", class: "11-A", dueDate: "2026-02-25", status: "graded", submissions: 24, total: 24, description: "Complete the worksheet on ionic and covalent bonds." },
  { id: "a5", title: "World War II Timeline", subject: "World History", class: "11-B", dueDate: "2026-03-10", status: "active", submissions: 5, total: 22, description: "Create a detailed timeline of major WWII events." },
  { id: "a6", title: "Python Basics Project", subject: "Programming", class: "12-A", dueDate: "2026-03-08", status: "active", submissions: 12, total: 20, description: "Build a command-line calculator application in Python." },
];

export const attendanceRecords: AttendanceRecord[] = [
  { studentId: "s1", studentName: "Alice Johnson", rollNo: "1001", status: "present" },
  { studentId: "s2", studentName: "Ben Carter", rollNo: "1002", status: "present" },
  { studentId: "s3", studentName: "Clara Davis", rollNo: "1003", status: "absent" },
  { studentId: "s4", studentName: "David Evans", rollNo: "1101", status: "late" },
  { studentId: "s5", studentName: "Emma Foster", rollNo: "1102", status: "present" },
  { studentId: "s6", studentName: "Frank Green", rollNo: "1103", status: "excused" },
  { studentId: "s7", studentName: "Grace Hall", rollNo: "1201", status: "present" },
  { studentId: "s8", studentName: "Henry Irving", rollNo: "1202", status: "absent" },
];

export const grades: GradeEntry[] = [
  { studentId: "s1", studentName: "Alice Johnson", assignment: "Quadratic Equations", score: 92, maxScore: 100, grade: "A", date: "2026-02-20" },
  { studentId: "s2", studentName: "Ben Carter", assignment: "Quadratic Equations", score: 78, maxScore: 100, grade: "B+", date: "2026-02-20" },
  { studentId: "s3", studentName: "Clara Davis", assignment: "Quadratic Equations", score: 95, maxScore: 100, grade: "A+", date: "2026-02-20" },
  { studentId: "s1", studentName: "Alice Johnson", assignment: "Newton's Laws Lab", score: 88, maxScore: 100, grade: "A-", date: "2026-02-22" },
  { studentId: "s2", studentName: "Ben Carter", assignment: "Newton's Laws Lab", score: 72, maxScore: 100, grade: "B", date: "2026-02-22" },
  { studentId: "s5", studentName: "Emma Foster", assignment: "Chemical Bonding", score: 85, maxScore: 100, grade: "A-", date: "2026-02-24" },
  { studentId: "s7", studentName: "Grace Hall", assignment: "Python Basics", score: 98, maxScore: 100, grade: "A+", date: "2026-02-26" },
];

export const announcements: Announcement[] = [
  { id: "an1", title: "Spring Term Begins", message: "Welcome back! Spring term classes begin on March 3rd, 2026.", date: "2026-02-25", author: "Dr. Sarah Mitchell", target: "All" },
  { id: "an2", title: "Parent-Teacher Conference", message: "Annual parent-teacher meetings scheduled for March 15th. Please book your slots.", date: "2026-02-24", author: "Administration", target: "Parents" },
  { id: "an3", title: "Science Fair Registration", message: "Register for the annual science fair by March 10th. Open to grades 10-12.", date: "2026-02-23", author: "Ms. Rachel Adams", target: "Students" },
  { id: "an4", title: "System Maintenance", message: "Scheduled maintenance on March 1st from 2:00-4:00 AM. Brief downtime expected.", date: "2026-02-22", author: "IT Department", target: "All" },
];

export const timetable: TimetableSlot[] = [
  { period: 1, time: "8:00 - 8:45", subject: "Mathematics", teacher: "Mr. Williams", room: "101" },
  { period: 2, time: "8:50 - 9:35", subject: "English", teacher: "Mr. Brown", room: "204" },
  { period: 3, time: "9:40 - 10:25", subject: "Physics", teacher: "Ms. Adams", room: "Lab 1" },
  { period: 4, time: "10:40 - 11:25", subject: "History", teacher: "Ms. Clark", room: "305" },
  { period: 5, time: "11:30 - 12:15", subject: "Computer Science", teacher: "Mr. Lee", room: "Lab 3" },
  { period: 6, time: "1:00 - 1:45", subject: "Chemistry", teacher: "Ms. Adams", room: "Lab 2" },
  { period: 7, time: "1:50 - 2:35", subject: "Geography", teacher: "Ms. Clark", room: "305" },
];

export const attendanceChartData = [
  { month: "Sep", present: 92, absent: 5, late: 3 },
  { month: "Oct", present: 89, absent: 7, late: 4 },
  { month: "Nov", present: 94, absent: 4, late: 2 },
  { month: "Dec", present: 88, absent: 8, late: 4 },
  { month: "Jan", present: 91, absent: 6, late: 3 },
  { month: "Feb", present: 93, absent: 4, late: 3 },
];

export const gradeDistribution = [
  { grade: "A+", count: 12 },
  { grade: "A", count: 28 },
  { grade: "A-", count: 18 },
  { grade: "B+", count: 22 },
  { grade: "B", count: 15 },
  { grade: "B-", count: 8 },
  { grade: "C+", count: 5 },
  { grade: "C", count: 3 },
];

// ─── Library Management Data ──────────────────────────

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  location: string;
  publishedYear: number;
}

export interface BookIssue {
  id: string;
  bookId: string;
  bookTitle: string;
  borrower: string;
  borrowerRole: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "issued" | "returned" | "overdue";
  fine: number;
}

export const libraryBooks: LibraryBook[] = [
  { id: "lb1", title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0262033848", category: "Computer Science", totalCopies: 5, availableCopies: 2, location: "Shelf A-12", publishedYear: 2009 },
  { id: "lb2", title: "A Brief History of Time", author: "Stephen Hawking", isbn: "978-0553380163", category: "Science", totalCopies: 3, availableCopies: 1, location: "Shelf B-04", publishedYear: 1998 },
  { id: "lb3", title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0061120084", category: "Literature", totalCopies: 8, availableCopies: 5, location: "Shelf C-01", publishedYear: 1960 },
  { id: "lb4", title: "Calculus: Early Transcendentals", author: "James Stewart", isbn: "978-1285741550", category: "Mathematics", totalCopies: 6, availableCopies: 3, location: "Shelf A-05", publishedYear: 2015 },
  { id: "lb5", title: "Physics for Scientists and Engineers", author: "Raymond Serway", isbn: "978-1133947271", category: "Physics", totalCopies: 4, availableCopies: 0, location: "Shelf B-08", publishedYear: 2013 },
  { id: "lb6", title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0743273565", category: "Literature", totalCopies: 10, availableCopies: 7, location: "Shelf C-02", publishedYear: 1925 },
  { id: "lb7", title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", isbn: "978-0062316097", category: "History", totalCopies: 4, availableCopies: 2, location: "Shelf D-03", publishedYear: 2015 },
  { id: "lb8", title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", category: "Computer Science", totalCopies: 3, availableCopies: 1, location: "Shelf A-14", publishedYear: 2008 },
  { id: "lb9", title: "Pride and Prejudice", author: "Jane Austen", isbn: "978-0141439518", category: "Literature", totalCopies: 6, availableCopies: 4, location: "Shelf C-03", publishedYear: 1813 },
  { id: "lb10", title: "Organic Chemistry", author: "Paula Yurkanis Bruice", isbn: "978-0134042282", category: "Chemistry", totalCopies: 5, availableCopies: 3, location: "Shelf B-10", publishedYear: 2016 },
  { id: "lb11", title: "World History: Patterns of Interaction", author: "Roger Beck", isbn: "978-0547491127", category: "History", totalCopies: 7, availableCopies: 5, location: "Shelf D-01", publishedYear: 2012 },
  { id: "lb12", title: "The Art of Problem Solving", author: "Richard Rusczyk", isbn: "978-0977304578", category: "Mathematics", totalCopies: 3, availableCopies: 2, location: "Shelf A-07", publishedYear: 2006 },
];

export const bookIssues: BookIssue[] = [
  { id: "bi1", bookId: "lb1", bookTitle: "Introduction to Algorithms", borrower: "Alice Johnson", borrowerRole: "Student", issueDate: "2026-02-10", dueDate: "2026-02-24", returnDate: null, status: "overdue", fine: 30 },
  { id: "bi2", bookId: "lb2", bookTitle: "A Brief History of Time", borrower: "Ben Carter", borrowerRole: "Student", issueDate: "2026-02-15", dueDate: "2026-03-01", returnDate: null, status: "issued", fine: 0 },
  { id: "bi3", bookId: "lb1", bookTitle: "Introduction to Algorithms", borrower: "Mr. Kevin Lee", borrowerRole: "Teacher", issueDate: "2026-02-12", dueDate: "2026-03-12", returnDate: null, status: "issued", fine: 0 },
  { id: "bi4", bookId: "lb3", bookTitle: "To Kill a Mockingbird", borrower: "Clara Davis", borrowerRole: "Student", issueDate: "2026-02-01", dueDate: "2026-02-15", returnDate: "2026-02-14", status: "returned", fine: 0 },
  { id: "bi5", bookId: "lb5", bookTitle: "Physics for Scientists and Engineers", borrower: "Emma Foster", borrowerRole: "Student", issueDate: "2026-02-18", dueDate: "2026-03-04", returnDate: null, status: "issued", fine: 0 },
  { id: "bi6", bookId: "lb4", bookTitle: "Calculus: Early Transcendentals", borrower: "Grace Hall", borrowerRole: "Student", issueDate: "2026-02-05", dueDate: "2026-02-19", returnDate: null, status: "overdue", fine: 80 },
  { id: "bi7", bookId: "lb5", bookTitle: "Physics for Scientists and Engineers", borrower: "Ms. Rachel Adams", borrowerRole: "Teacher", issueDate: "2026-02-14", dueDate: "2026-03-14", returnDate: null, status: "issued", fine: 0 },
  { id: "bi8", bookId: "lb8", bookTitle: "Clean Code", borrower: "Henry Irving", borrowerRole: "Student", issueDate: "2026-01-20", dueDate: "2026-02-03", returnDate: "2026-02-03", status: "returned", fine: 0 },
  { id: "bi9", bookId: "lb6", bookTitle: "The Great Gatsby", borrower: "David Evans", borrowerRole: "Student", issueDate: "2026-02-20", dueDate: "2026-03-06", returnDate: null, status: "issued", fine: 0 },
  { id: "bi10", bookId: "lb5", bookTitle: "Physics for Scientists and Engineers", borrower: "Frank Green", borrowerRole: "Student", issueDate: "2026-02-08", dueDate: "2026-02-22", returnDate: null, status: "overdue", fine: 50 },
];

// ─── SaaS Tenant / Subscription Data ──────────────────

export interface Subscription {
  planName: string;
  planTier: "starter" | "professional" | "enterprise";
  tenantId: string;
  orgName: string;
  region: string;
  status: "active" | "trial" | "expired";
  billingCycle: "monthly" | "annually";
  nextBillingDate: string;
  maxUsers: number;
  maxStorage: string;
  maxApiCalls: number;
  supportTier: string;
  startDate: string;
  contractEnd: string;
}

export interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "outage" | "maintenance";
  latency: string;
  uptime: string;
}

export interface ResourceQuota {
  resource: string;
  used: number;
  limit: number;
  unit: string;
}

export const subscription: Subscription = {
  planName: "Education Pro",
  planTier: "professional",
  tenantId: "tenant-setu-edu-7f3a",
  orgName: "SETU Academy",
  region: "Asia South (Mumbai)",
  status: "active",
  billingCycle: "annually",
  nextBillingDate: "2026-09-01",
  maxUsers: 1500,
  maxStorage: "100 GB",
  maxApiCalls: 100000,
  supportTier: "Priority (24/7)",
  startDate: "2025-09-01",
  contractEnd: "2026-08-31",
};

export const serviceStatuses: ServiceStatus[] = [
  { name: "Authentication & SSO", status: "operational", latency: "45ms", uptime: "99.99%" },
  { name: "Core Platform", status: "operational", latency: "82ms", uptime: "99.97%" },
  { name: "File Storage (CDN)", status: "operational", latency: "120ms", uptime: "99.95%" },
  { name: "Email Delivery", status: "degraded", latency: "340ms", uptime: "99.80%" },
  { name: "SMS Gateway", status: "operational", latency: "95ms", uptime: "99.92%" },
  { name: "Real-time Sync", status: "operational", latency: "28ms", uptime: "99.98%" },
  { name: "Scheduled Jobs", status: "maintenance", latency: "—", uptime: "99.90%" },
];

export const resourceQuotas: ResourceQuota[] = [
  { resource: "User Seats", used: 892, limit: 1500, unit: "users" },
  { resource: "Storage", used: 42.8, limit: 100, unit: "GB" },
  { resource: "API Calls (daily)", used: 28453, limit: 100000, unit: "calls" },
  { resource: "Email Sends (monthly)", used: 3240, limit: 10000, unit: "emails" },
  { resource: "File Uploads (monthly)", used: 1820, limit: 5000, unit: "files" },
];

// ─── Room Management Data ─────────────────────────────

export interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  type: "classroom" | "lab" | "auditorium" | "conference" | "staff-room";
  equipment: string[];
  status: "available" | "occupied" | "maintenance";
}

export const rooms: Room[] = [
  { id: "rm1", name: "Room 101", building: "Main Block", floor: 1, capacity: 40, type: "classroom", equipment: ["Projector", "Whiteboard", "AC"], status: "available" },
  { id: "rm2", name: "Room 102", building: "Main Block", floor: 1, capacity: 40, type: "classroom", equipment: ["Projector", "Whiteboard"], status: "occupied" },
  { id: "rm3", name: "Room 204", building: "Main Block", floor: 2, capacity: 35, type: "classroom", equipment: ["Projector", "Whiteboard", "AC"], status: "available" },
  { id: "rm4", name: "Room 305", building: "Main Block", floor: 3, capacity: 30, type: "classroom", equipment: ["Whiteboard"], status: "available" },
  { id: "rm5", name: "Lab 1 — Physics", building: "Science Block", floor: 1, capacity: 30, type: "lab", equipment: ["Lab Benches", "Safety Shower", "Projector"], status: "occupied" },
  { id: "rm6", name: "Lab 2 — Chemistry", building: "Science Block", floor: 1, capacity: 28, type: "lab", equipment: ["Fume Hood", "Lab Benches", "Safety Shower"], status: "available" },
  { id: "rm7", name: "Lab 3 — Computer", building: "Tech Block", floor: 1, capacity: 32, type: "lab", equipment: ["32 PCs", "Projector", "AC"], status: "occupied" },
  { id: "rm8", name: "Auditorium", building: "Main Block", floor: 0, capacity: 300, type: "auditorium", equipment: ["Stage", "Sound System", "Projector", "AC"], status: "available" },
  { id: "rm9", name: "Conference Room A", building: "Admin Block", floor: 2, capacity: 15, type: "conference", equipment: ["TV Display", "Webcam", "Whiteboard", "AC"], status: "available" },
  { id: "rm10", name: "Staff Room", building: "Admin Block", floor: 1, capacity: 20, type: "staff-room", equipment: ["Lockers", "Kitchenette", "AC"], status: "available" },
  { id: "rm11", name: "Room 201", building: "Main Block", floor: 2, capacity: 40, type: "classroom", equipment: ["Projector", "Whiteboard", "AC"], status: "maintenance" },
  { id: "rm12", name: "Lab 4 — Biology", building: "Science Block", floor: 2, capacity: 25, type: "lab", equipment: ["Microscopes", "Lab Benches", "Projector"], status: "available" },
];

// ─── IT Equipment Booking Data ────────────────────────

export interface Equipment {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  condition: "excellent" | "good" | "fair" | "needs-repair";
  location: string;
  available: boolean;
}

export interface EquipmentBooking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  bookedBy: string;
  bookedByRole: string;
  date: string;
  timeSlot: string;
  purpose: string;
  status: "confirmed" | "pending" | "returned" | "overdue";
}

export const equipment: Equipment[] = [
  { id: "eq1", name: "Portable Projector #1", category: "Projector", serialNumber: "PJ-2024-001", condition: "excellent", location: "IT Storage", available: true },
  { id: "eq2", name: "Portable Projector #2", category: "Projector", serialNumber: "PJ-2024-002", condition: "good", location: "Room 204", available: false },
  { id: "eq3", name: "MacBook Pro 14\"", category: "Laptop", serialNumber: "MB-2025-001", condition: "excellent", location: "IT Storage", available: true },
  { id: "eq4", name: "MacBook Pro 14\"", category: "Laptop", serialNumber: "MB-2025-002", condition: "excellent", location: "IT Storage", available: true },
  { id: "eq5", name: "iPad Pro 12.9\"", category: "Tablet", serialNumber: "IP-2025-001", condition: "good", location: "IT Storage", available: true },
  { id: "eq6", name: "iPad Pro 12.9\"", category: "Tablet", serialNumber: "IP-2025-002", condition: "fair", location: "Lab 3", available: false },
  { id: "eq7", name: "Document Camera", category: "Camera", serialNumber: "DC-2024-001", condition: "good", location: "IT Storage", available: true },
  { id: "eq8", name: "Wireless Presenter", category: "Accessory", serialNumber: "WP-2024-001", condition: "excellent", location: "IT Storage", available: true },
  { id: "eq9", name: "Bluetooth Speaker", category: "Audio", serialNumber: "BS-2025-001", condition: "good", location: "IT Storage", available: true },
  { id: "eq10", name: "Webcam HD 1080p", category: "Camera", serialNumber: "WC-2024-001", condition: "excellent", location: "Conference Room A", available: false },
  { id: "eq11", name: "Portable Whiteboard", category: "Accessory", serialNumber: "PW-2024-001", condition: "needs-repair", location: "Maintenance", available: false },
  { id: "eq12", name: "3D Printer", category: "Printer", serialNumber: "3D-2025-001", condition: "excellent", location: "Lab 3", available: true },
];

export const equipmentBookings: EquipmentBooking[] = [
  { id: "eb1", equipmentName: "Portable Projector #2", equipmentId: "eq2", bookedBy: "Mr. John Williams", bookedByRole: "Teacher", date: "2026-02-28", timeSlot: "8:00 AM - 12:00 PM", purpose: "Math class presentation", status: "confirmed" },
  { id: "eb2", equipmentName: "iPad Pro 12.9\"", equipmentId: "eq6", bookedBy: "Ms. Rachel Adams", bookedByRole: "Teacher", date: "2026-02-28", timeSlot: "Full Day", purpose: "Science experiment recording", status: "confirmed" },
  { id: "eb3", equipmentName: "MacBook Pro 14\"", equipmentId: "eq3", bookedBy: "Mr. Peter Brown", bookedByRole: "Teacher", date: "2026-03-01", timeSlot: "1:00 PM - 3:00 PM", purpose: "Student essay review", status: "pending" },
  { id: "eb4", equipmentName: "Document Camera", equipmentId: "eq7", bookedBy: "Ms. Diana Clark", bookedByRole: "Teacher", date: "2026-02-27", timeSlot: "10:00 AM - 11:00 AM", purpose: "Document demonstration", status: "returned" },
  { id: "eb5", equipmentName: "Webcam HD 1080p", equipmentId: "eq10", bookedBy: "Dr. Sarah Mitchell", bookedByRole: "Admin", date: "2026-02-28", timeSlot: "2:00 PM - 4:00 PM", purpose: "Board meeting", status: "confirmed" },
  { id: "eb6", equipmentName: "3D Printer", equipmentId: "eq12", bookedBy: "Mr. Kevin Lee", bookedByRole: "Teacher", date: "2026-03-02", timeSlot: "Full Day", purpose: "CS class project prints", status: "pending" },
];

// ─── Ticketing / IT Support Data ──────────────────────

export interface Ticket {
  id: string;
  ticketNo: string;
  title: string;
  description: string;
  category: "hardware" | "software" | "network" | "account" | "other";
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "resolved" | "closed";
  createdBy: string;
  createdByRole: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  resolution: string | null;
}

export const tickets: Ticket[] = [
  { id: "tk1", ticketNo: "TK-2026-042", title: "Projector not working in Room 201", description: "The ceiling projector in Room 201 shows no signal when connected. Tried HDMI and VGA.", category: "hardware", priority: "high", status: "in-progress", createdBy: "Mr. John Williams", createdByRole: "Teacher", assignedTo: "Raj Patel", createdAt: "2026-02-27 08:30", updatedAt: "2026-02-27 09:00", resolution: null },
  { id: "tk2", ticketNo: "TK-2026-041", title: "Cannot access Google Classroom", description: "SSO login to Google Classroom returns error 403 since yesterday.", category: "software", priority: "high", status: "open", createdBy: "Ms. Rachel Adams", createdByRole: "Teacher", assignedTo: null, createdAt: "2026-02-27 07:45", updatedAt: "2026-02-27 07:45", resolution: null },
  { id: "tk3", ticketNo: "TK-2026-040", title: "WiFi dropping in Science Block", description: "WiFi keeps disconnecting in Science Block, especially Lab 1 and Lab 2. Students can't submit assignments.", category: "network", priority: "critical", status: "in-progress", createdBy: "Ms. Rachel Adams", createdByRole: "Teacher", assignedTo: "Dr. Sarah Mitchell", createdAt: "2026-02-26 14:20", updatedAt: "2026-02-27 08:00", resolution: null },
  { id: "tk4", ticketNo: "TK-2026-039", title: "New teacher account needed", description: "New substitute teacher Mr. Alan Park needs an account set up for English dept. Starting March 3.", category: "account", priority: "medium", status: "open", createdBy: "Mr. Peter Brown", createdByRole: "Teacher", assignedTo: null, createdAt: "2026-02-26 10:15", updatedAt: "2026-02-26 10:15", resolution: null },
  { id: "tk5", ticketNo: "TK-2026-038", title: "Lab 3 PCs running slow", description: "Several computers in Lab 3 are extremely slow. Suspect they need RAM upgrades or disk cleanup.", category: "hardware", priority: "medium", status: "in-progress", createdBy: "Mr. Kevin Lee", createdByRole: "Teacher", assignedTo: "Raj Patel", createdAt: "2026-02-25 16:00", updatedAt: "2026-02-26 11:30", resolution: null },
  { id: "tk6", ticketNo: "TK-2026-037", title: "Reset password for student", description: "Student David Evans forgot his password and can't reset via email. Needs manual reset.", category: "account", priority: "low", status: "resolved", createdBy: "Ms. Diana Clark", createdByRole: "Teacher", assignedTo: "Dr. Sarah Mitchell", createdAt: "2026-02-25 09:30", updatedAt: "2026-02-25 10:00", resolution: "Password reset and emailed to guardian." },
  { id: "tk7", ticketNo: "TK-2026-036", title: "Printer jam in Staff Room", description: "Staff room printer is jammed and showing error E-04.", category: "hardware", priority: "low", status: "closed", createdBy: "Mr. Peter Brown", createdByRole: "Teacher", assignedTo: "Raj Patel", createdAt: "2026-02-24 13:00", updatedAt: "2026-02-24 15:00", resolution: "Paper jam cleared and test print successful." },
  { id: "tk8", ticketNo: "TK-2026-035", title: "Install Zoom on Lab 3 PCs", description: "Need Zoom installed on all Lab 3 PCs for upcoming virtual guest lecture.", category: "software", priority: "medium", status: "resolved", createdBy: "Mr. Kevin Lee", createdByRole: "Teacher", assignedTo: "Raj Patel", createdAt: "2026-02-23 11:00", updatedAt: "2026-02-24 09:00", resolution: "Zoom installed on all 32 PCs via remote deployment." },
];

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const notifications: Notification[] = [
  { id: 1, title: 'New assignment posted', message: 'Mathematics homework due Friday', time: '5 min ago', read: false },
  { id: 2, title: 'Grade updated', message: 'Your English essay has been graded', time: '1 hour ago', read: false },
  { id: 3, title: 'System maintenance', message: 'Scheduled maintenance tonight at 10 PM', time: '3 hours ago', read: true },
  { id: 4, title: 'Library book due', message: 'Return "Introduction to React" by Friday', time: '1 day ago', read: true },
];