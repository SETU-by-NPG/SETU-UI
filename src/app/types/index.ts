/**
 * SETU Education Management System - TypeScript Interfaces
 * Based on technical specification
 * Updated: 27-role hierarchy system
 */

// ==================== CORE TYPES ====================

export type Role =
  // Administrative Roles (9)
  | "master_admin"
  | "it_admin"
  | "it_technician"
  | "principal"
  | "finance_manager"
  | "hr_manager"
  | "admissions_officer"
  | "data_manager"
  | "facilities_manager"
  // Academic Leadership (4)
  | "slt_member"
  | "head_of_department"
  | "head_of_year"
  | "examinations_officer"
  // Safeguarding & Welfare (4)
  | "safeguarding_lead"
  | "senco"
  | "attendance_officer"
  | "careers_advisor"
  // Teaching & Support (3)
  | "teacher"
  | "cover_supervisor"
  | "teaching_assistant"
  // Technical Specialists (3)
  | "librarian"
  | "science_technician"
  | "subject_technician"
  // Students (2)
  | "student"
  | "student_leadership"
  // Parent/Guardian (1)
  | "parent"
  // Support (1)
  | "support_staff";

export type RoleCategory =
  | "administrative"
  | "academic_leadership"
  | "safeguarding_welfare"
  | "teaching_support"
  | "technical_specialist"
  | "student"
  | "parent"
  | "support";

export type StudentLeadershipType =
  | "subject_ambassador"
  | "principal_ambassador"
  | "prefect"
  | "head_boy"
  | "head_girl"
  | "house_captain"
  | "sports_captain";

export interface SLTPermissions {
  isSLT: boolean;
  sltAccessLevel?: "full" | "strategic" | "operational";
}

export type Status =
  | "active"
  | "inactive"
  | "suspended"
  | "pending"
  | "on_leave"
  | "alumni"
  | "transferred";

export type SubjectStatus = "active" | "inactive" | "archived";

export type SubjectCategoryIcon =
  | "flask"
  | "calculator"
  | "book"
  | "languages"
  | "palette"
  | "dumbbell"
  | "computer"
  | "music"
  | "globe"
  | "leaf"; // Added by Kilo Code

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export type AssignmentStatus = "draft" | "published" | "graded" | "archived";

export type SubmissionStatus = "submitted" | "late" | "graded" | "pending";

export type BookStatus = "available" | "unavailable";

export type TransactionStatus = "borrowed" | "returned" | "overdue" | "lost";

export type TicketCategory = "it" | "facility" | "academic" | "admin" | "other";

export type TicketPriority = "low" | "medium" | "high" | "critical";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type ReportType =
  | "student"
  | "class"
  | "attendance"
  | "grade"
  | "library";

export type TargetType = "all" | "class" | "teacher" | "student" | "parent";

export type PublishType = "immediate" | "scheduled";

export type AnnouncementStatus = "draft" | "published" | "archived";

// ==================== USER ENTITIES ====================

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  roleCategory: RoleCategory;
  avatar?: string;
  status: Status;
  lastLogin: string;
  createdAt: string;
  twoFactorEnabled?: boolean;
  department?: string;
  // Role-specific metadata
  sltPermissions?: SLTPermissions;
  studentLeadershipType?: StudentLeadershipType;
  assignedSubjects?: string[];
  assignedDepartment?: string;
  assignedYearGroup?: string;
}

export interface Admin {
  id: string;
  userId: string;
  name: string;
  email: string;
  department: string;
  position: string;
  permissions: string[];
  createdAt: string;
  lastLogin: string;
}

export interface Teacher {
  id: string;
  userId: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  subjects: string[];
  classes: string[];
  isHeadOfSubject: string | null;
  isClassTeacher: string | null;
  qualifications: string[];
  experience: number;
  status: "active" | "on_leave" | "inactive";
  joinDate: string;
  // Relational links
  students?: Student[];
  timetableEntries?: TimetableEntry[];
  announcements?: Announcement[];
}

export interface Student {
  id: string;
  userId: string;
  studentId: string;
  admissionNo: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: string;
  classId: string;
  section: string;
  rollNo: number;
  house?: string;
  bloodGroup?: string;
  emergencyContact: string;
  emergencyPhone: string;
  photo?: string;
  attendancePercent: number;
  gpa: number;
  status: Status;
  admissionDate: string;
  // Relational links
  parentId: string | null;
  parents?: Parent[];
  grades?: Grade[];
  attendances?: Attendance[];
  assignments?: Assignment[];
  libraryTransactions?: LibraryTransaction[];
}

export interface Parent {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  address: string;
  relationship: "father" | "mother" | "guardian";
  // Relational links
  children: string[];
  isAllowedToBorrow: boolean;
  canSubmitTickets: boolean;
}

export interface Librarian {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  librarySection: string;
  status: "active" | "inactive";
  canManageStudentAccess: boolean;
}

// ==================== ACADEMIC ENTITIES ====================

export interface SubjectCategory {
  id: string;
  name: string;
  description: string;
  colorCode: string;
  icon: SubjectCategoryIcon;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  description: string;
  credits: number;
  headTeacherId: string | null;
  curriculum: string;
  textbook: string;
  learningObjectives: string[];
  classes: string[];
  teachers: string[];
  status: SubjectStatus;
  categoryId: string | null;
}

export interface ClassGrade {
  id: string;
  name: string;
  level: number;
  section: string;
  classTeacherId: string | null;
  students: string[];
  subjects: string[];
  room: string;
  capacity: number;
  academicYear: string;
  status: "active" | "inactive";
}

// ==================== SCHEDULING ====================

export interface TimetableEntry {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number;
  period: number;
  startTime: string;
  endTime: string;
  room: string;
  academicYear: string;
  notes?: string;
}

export interface SchedulePeriod {
  id: string;
  period: number;
  startTime: string;
  endTime: string;
  breakDuration: number;
}

// ==================== ATTENDANCE ====================

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  period?: number;
  markedBy: string;
  remarks?: string;
}

// ==================== ACADEMICS ====================

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  dueDate: string;
  totalMarks: number;
  status: AssignmentStatus;
  attachments?: string[];
  createdAt: string;
  submissions?: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  marks: number | null;
  grade: string | null;
  feedback: string;
  status: SubmissionStatus;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  assignmentId?: string;
  term: string;
  marks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  remarks?: string;
  createdAt: string;
}

// ==================== COMMUNICATION ====================

export interface Announcement {
  id: string;
  title: string;
  message: string;
  authorId: string;
  targetType: TargetType;
  targetIds: string[];
  publishType: PublishType;
  publishAt?: string;
  status: AnnouncementStatus;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderRole: Role;
  senderName: string;
  recipientId: string;
  recipientRole: Role;
  recipientName: string;
  classId?: string;
  subject?: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
  isValid: boolean;
  validationNote?: string;
}

// ==================== LIBRARY ====================

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  shelfLocation: string;
  totalCopies: number;
  availableCopies: number;
  status: BookStatus;
  publishedYear?: number;
}

export interface LibraryTransaction {
  id: string;
  bookId: string;
  studentId: string;
  borrowedDate: string;
  dueDate: string;
  returnedDate: string | null;
  status: TransactionStatus;
  lateFine: number;
  overrideByAdmin?: string;
}

// ==================== SUPPORT ====================

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: string;
  createdByRole: Role;
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
  isBlocked: boolean;
  blockNote?: string;
}

// ==================== REPORTS ====================

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  generatedBy: string;
  generatedFor?: string;
  data: Record<string, any>;
  createdAt: string;
}

// ==================== PERMISSIONS SYSTEM ====================

export interface Permission {
  id: string;
  name: string;
  key: string;
  category: string;
  module?: string;
  description: string;
  /** Allowlist of roles that have this permission by default */
  roles: Role[];
  /** If true, role must also have sltPermissions.isSLT === true */
  requiresSLT?: boolean;
  isConfigurable?: boolean;
}

export interface RolePermission {
  role: Role;
  permissionKey: string;
  access: "allow" | "deny";
  moduleScope?: string;
  assignedBy?: string;
  assignedAt?: string;
}

export interface AccessConfig {
  id: string;
  permissionKey: string;
  role: Role;
  access: "allow" | "deny";
  config?: Record<string, any>;
  updatedBy?: string;
  updatedAt: string;
}

// ==================== GLOBAL SEARCH ====================

export interface SearchResult {
  type: "student" | "teacher" | "parent" | "staff";
  id: string;
  name: string;
  email: string;
  role: Role;
  className?: string;
  department?: string;
  childName?: string;
}

// ==================== AUDIT ====================

export interface AuditLog {
  id: string;
  userId: string;
  userRole: Role;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}

// ==================== DASHBOARD & METRICS ====================

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

// ==================== MOCK DATA CONTEXT ====================

export interface MockDataStore {
  systemUsers: SystemUser[];
  admins: Admin[];
  teachers: Teacher[];
  students: Student[];
  parents: Parent[];
  librarians: Librarian[];
  subjectCategories: SubjectCategory[];
  subjects: Subject[];
  classes: ClassGrade[];
  timetable: TimetableEntry[];
  schedulePeriods: SchedulePeriod[];
  attendance: Attendance[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  grades: Grade[];
  announcements: Announcement[];
  messages: Message[];
  books: Book[];
  libraryTransactions: LibraryTransaction[];
  tickets: Ticket[];
  reports: Report[];
  auditLogs: AuditLog[];
  permissions: Permission[];
  rolePermissions: RolePermission[];
  accessConfigs: AccessConfig[];
  integrations: Integration[];
}

// ==================== API RESPONSES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
