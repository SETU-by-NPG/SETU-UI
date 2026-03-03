/**
 * SETU Education Management System - Data Query Utilities
 * Provides helper functions for querying and filtering mock data
 */

import { mockData } from "../data/mock-data";
import type {
  Student,
  Teacher,
  Parent,
  ClassGrade,
  Subject,
  Assignment,
  Attendance,
  Grade,
  TimetableEntry,
  Book,
  LibraryTransaction,
  Ticket,
  Message,
  Announcement,
  SystemUser,
  Role,
  RoleCategory,
} from "../types";

// ==================== STUDENT QUERIES ====================

/**
 * Get a student by ID
 */
export const getStudentById = (id: string): Student | undefined => {
  return mockData.students.find((s) => s.id === id);
};

/**
 * Get students by class ID
 */
export const getStudentsByClass = (classId: string): Student[] => {
  return mockData.students.filter((s) => s.classId === classId);
};

/**
 * Get students by parent ID
 */
export const getStudentsByParent = (parentId: string): Student[] => {
  return mockData.students.filter((s) => s.parentId === parentId);
};

/**
 * Get students by teacher (students in teacher's classes)
 */
export const getStudentsByTeacher = (teacherId: string): Student[] => {
  const teacher = mockData.teachers.find((t) => t.id === teacherId);
  if (!teacher) return [];
  return mockData.students.filter((s) => teacher.classes.includes(s.classId));
};

/**
 * Search students by name or ID
 */
export const searchStudents = (query: string): Student[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockData.students.filter(
    (s) =>
      s.name.toLowerCase().includes(lowercaseQuery) ||
      s.studentId.toLowerCase().includes(lowercaseQuery) ||
      s.email.toLowerCase().includes(lowercaseQuery),
  );
};

// ==================== TEACHER QUERIES ====================

/**
 * Get a teacher by ID
 */
export const getTeacherById = (id: string): Teacher | undefined => {
  return mockData.teachers.find((t) => t.id === id);
};

/**
 * Get teachers by class ID
 */
export const getTeachersByClass = (classId: string): Teacher[] => {
  return mockData.teachers.filter((t) => t.classes.includes(classId));
};

/**
 * Get teachers by subject ID
 */
export const getTeachersBySubject = (subjectId: string): Teacher[] => {
  return mockData.teachers.filter((t) => t.subjects.includes(subjectId));
};

/**
 * Get head teacher of a subject
 */
export const getSubjectHead = (subjectId: string): Teacher | undefined => {
  const subject = mockData.subjects.find((s) => s.id === subjectId);
  if (!subject?.headTeacherId) return undefined;
  return mockData.teachers.find((t) => t.id === subject.headTeacherId);
};

/**
 * Search teachers by name or department
 */
export const searchTeachers = (query: string): Teacher[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockData.teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(lowercaseQuery) ||
      t.department.toLowerCase().includes(lowercaseQuery) ||
      t.email.toLowerCase().includes(lowercaseQuery),
  );
};

// ==================== PARENT QUERIES ====================

/**
 * Get a parent by ID
 */
export const getParentById = (id: string): Parent | undefined => {
  return mockData.parents.find((p) => p.id === id);
};

/**
 * Get parents by student ID
 */
export const getParentsByStudent = (studentId: string): Parent[] => {
  return mockData.parents.filter((p) => p.children.includes(studentId));
};

/**
 * Search parents by name
 */
export const searchParents = (query: string): Parent[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockData.parents.filter(
    (p) =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.email.toLowerCase().includes(lowercaseQuery),
  );
};

// ==================== CLASS QUERIES ====================

/**
 * Get a class by ID
 */
export const getClassById = (id: string): ClassGrade | undefined => {
  return mockData.classes.find((c) => c.id === id);
};

/**
 * Get class by student ID (student's class)
 */
export const getClassByStudent = (
  studentId: string,
): ClassGrade | undefined => {
  const student = mockData.students.find((s) => s.id === studentId);
  if (!student) return undefined;
  return mockData.classes.find((c) => c.id === student.classId);
};

/**
 * Get class teacher
 */
export const getClassTeacher = (classId: string): Teacher | undefined => {
  const cls = mockData.classes.find((c) => c.id === classId);
  if (!cls?.classTeacherId) return undefined;
  return mockData.teachers.find((t) => t.id === cls.classTeacherId);
};

/**
 * Get subjects for a class
 */
export const getSubjectsByClass = (classId: string): Subject[] => {
  const cls = mockData.classes.find((c) => c.id === classId);
  if (!cls) return [];
  return mockData.subjects.filter((s) => cls.subjects.includes(s.id));
};

// ==================== SUBJECT QUERIES ====================

/**
 * Get a subject by ID
 */
export const getSubjectById = (id: string): Subject | undefined => {
  return mockData.subjects.find((s) => s.id === id);
};

/**
 * Get subjects by teacher ID
 */
export const getSubjectsByTeacher = (teacherId: string): Subject[] => {
  const teacher = mockData.teachers.find((t) => t.id === teacherId);
  if (!teacher) return [];
  return mockData.subjects.filter((s) => teacher.subjects.includes(s.id));
};

/**
 * Get classes for a subject
 */
export const getClassesBySubject = (subjectId: string): ClassGrade[] => {
  const subject = mockData.subjects.find((s) => s.id === subjectId);
  if (!subject) return [];
  return mockData.classes.filter((c) => subject.classes.includes(c.id));
};

// ==================== ASSIGNMENT QUERIES ====================

/**
 * Get assignments by class
 */
export const getAssignmentsByClass = (classId: string): Assignment[] => {
  return mockData.assignments.filter((a) => a.classId === classId);
};

/**
 * Get assignments by teacher
 */
export const getAssignmentsByTeacher = (teacherId: string): Assignment[] => {
  return mockData.assignments.filter((a) => a.teacherId === teacherId);
};

/**
 * Get assignments by subject
 */
export const getAssignmentsBySubject = (subjectId: string): Assignment[] => {
  return mockData.assignments.filter((a) => a.subjectId === subjectId);
};

/**
 * Get assignments for a student
 */
export const getAssignmentsByStudent = (studentId: string): Assignment[] => {
  const student = mockData.students.find((s) => s.id === studentId);
  if (!student) return [];
  return mockData.assignments.filter((a) => a.classId === student.classId);
};

/**
 * Get student's submissions
 */
export const getSubmissionsByStudent = (studentId: string) => {
  return mockData.submissions.filter((s) => s.studentId === studentId);
};

/**
 * Get submissions for an assignment
 */
export const getSubmissionsByAssignment = (assignmentId: string) => {
  return mockData.submissions.filter((s) => s.assignmentId === assignmentId);
};

// ==================== ATTENDANCE QUERIES ====================

/**
 * Get attendance by student
 */
export const getAttendanceByStudent = (studentId: string): Attendance[] => {
  return mockData.attendance.filter((a) => a.studentId === studentId);
};

/**
 * Get attendance by class and date
 */
export const getAttendanceByClassAndDate = (
  classId: string,
  date: string,
): Attendance[] => {
  return mockData.attendance.filter(
    (a) => a.classId === classId && a.date === date,
  );
};

/**
 * Calculate attendance percentage for a student
 */
export const calculateAttendancePercentage = (studentId: string): number => {
  const studentAttendance = getAttendanceByStudent(studentId);
  if (studentAttendance.length === 0) return 0;

  const present = studentAttendance.filter(
    (a) => a.status === "present",
  ).length;
  return Math.round((present / studentAttendance.length) * 100);
};

// ==================== GRADE QUERIES ====================

/**
 * Get grades by student
 */
export const getGradesByStudent = (studentId: string): Grade[] => {
  return mockData.grades.filter((g) => g.studentId === studentId);
};

/**
 * Get grades by subject
 */
export const getGradesBySubject = (subjectId: string): Grade[] => {
  return mockData.grades.filter((g) => g.subjectId === subjectId);
};

/**
 * Get grades by class
 */
export const getGradesByClass = (classId: string): Grade[] => {
  return mockData.grades.filter((g) => g.classId === classId);
};

/**
 * Calculate GPA for a student
 */
export const calculateGPA = (studentId: string): number => {
  const grades = getGradesByStudent(studentId);
  if (grades.length === 0) return 0;

  const totalPoints = grades.reduce((sum, grade) => {
    const points =
      grade.percentage >= 90
        ? 4.0
        : grade.percentage >= 80
          ? 3.0
          : grade.percentage >= 70
            ? 2.0
            : grade.percentage >= 60
              ? 1.0
              : 0;
    return sum + points;
  }, 0);

  return parseFloat((totalPoints / grades.length).toFixed(2));
};

// ==================== TIMETABLE QUERIES ====================

/**
 * Get timetable by class
 */
export const getTimetableByClass = (classId: string): TimetableEntry[] => {
  return mockData.timetable.filter((t) => t.classId === classId);
};

/**
 * Get timetable by teacher
 */
export const getTimetableByTeacher = (teacherId: string): TimetableEntry[] => {
  return mockData.timetable.filter((t) => t.teacherId === teacherId);
};

/**
 * Get timetable for a day
 */
export const getTimetableByDay = (dayOfWeek: number): TimetableEntry[] => {
  return mockData.timetable.filter((t) => t.dayOfWeek === dayOfWeek);
};

/**
 * Check for timetable conflicts
 */
export const checkTimetableConflicts = (
  entry: Partial<TimetableEntry>,
): boolean => {
  if (!entry.teacherId || !entry.dayOfWeek || !entry.period) return false;

  return mockData.timetable.some(
    (t) =>
      t.id !== entry.id &&
      t.teacherId === entry.teacherId &&
      t.dayOfWeek === entry.dayOfWeek &&
      t.period === entry.period,
  );
};

// ==================== LIBRARY QUERIES ====================

/**
 * Get a book by ID
 */
export const getBookById = (id: string): Book | undefined => {
  return mockData.books.find((b) => b.id === id);
};

/**
 * Search books by title or author
 */
export const searchBooks = (query: string): Book[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockData.books.filter(
    (b) =>
      b.title.toLowerCase().includes(lowercaseQuery) ||
      b.author.toLowerCase().includes(lowercaseQuery) ||
      b.isbn.toLowerCase().includes(lowercaseQuery),
  );
};

/**
 * Get transactions by student
 */
export const getTransactionsByStudent = (
  studentId: string,
): LibraryTransaction[] => {
  return mockData.libraryTransactions.filter((t) => t.studentId === studentId);
};

/**
 * Get overdue transactions
 */
export const getOverdueTransactions = (): LibraryTransaction[] => {
  return mockData.libraryTransactions.filter((t) => t.status === "overdue");
};

/**
 * Get available books
 */
export const getAvailableBooks = (): Book[] => {
  return mockData.books.filter((b) => b.availableCopies > 0);
};

// ==================== TICKET QUERIES ====================

/**
 * Get tickets by status
 */
export const getTicketsByStatus = (status: Ticket["status"]): Ticket[] => {
  return mockData.tickets.filter((t) => t.status === status);
};

/**
 * Get tickets by creator
 */
export const getTicketsByCreator = (createdBy: string): Ticket[] => {
  return mockData.tickets.filter((t) => t.createdBy === createdBy);
};

/**
 * Get tickets assigned to user
 */
export const getTicketsAssignedTo = (assignedTo: string): Ticket[] => {
  return mockData.tickets.filter((t) => t.assignedTo === assignedTo);
};

/**
 * Get open tickets count
 */
export const getOpenTicketsCount = (): number => {
  return mockData.tickets.filter(
    (t) => t.status === "open" || t.status === "in_progress",
  ).length;
};

// ==================== MESSAGE QUERIES ====================

/**
 * Get messages by sender
 */
export const getMessagesBySender = (senderId: string): Message[] => {
  return mockData.messages.filter((m) => m.senderId === senderId);
};

/**
 * Get messages by recipient
 */
export const getMessagesByRecipient = (recipientId: string): Message[] => {
  return mockData.messages.filter((m) => m.recipientId === recipientId);
};

/**
 * Get unread messages count
 */
export const getUnreadMessagesCount = (recipientId: string): number => {
  return mockData.messages.filter(
    (m) => m.recipientId === recipientId && !m.read,
  ).length;
};

/**
 * Get valid messages only (for teacher-student)
 */
export const getValidMessages = (): Message[] => {
  return mockData.messages.filter((m) => m.isValid);
};

// ==================== ANNOUNCEMENT QUERIES ====================

/**
 * Get announcements by target type
 */
export const getAnnouncementsByTarget = (
  targetType: Announcement["targetType"],
): Announcement[] => {
  return mockData.announcements.filter((a) => a.targetType === targetType);
};

/**
 * Get recent announcements
 */
export const getRecentAnnouncements = (count: number = 5): Announcement[] => {
  return mockData.announcements
    .filter((a) => a.status === "published")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, count);
};

// ==================== GLOBAL SEARCH ====================

/**
 * Global search across all entities
 */
export const globalSearch = (query: string) => {
  const lowercaseQuery = query.toLowerCase();

  return {
    students: searchStudents(query),
    teachers: searchTeachers(query),
    parents: searchParents(query),
    books: searchBooks(query),
  };
};

// ==================== STATISTICS ====================

/**
 * Get dashboard statistics
 */
export const getDashboardStats = () => {
  return {
    totalStudents: mockData.students.length,
    totalTeachers: mockData.teachers.length,
    totalParents: mockData.parents.length,
    totalClasses: mockData.classes.length,
    totalBooks: mockData.books.length,
    activeLoans: mockData.libraryTransactions.filter(
      (t) => t.status === "borrowed",
    ).length,
    pendingTickets: getOpenTicketsCount(),
    attendanceToday: Math.round(
      (mockData.attendance.filter((a) => a.status === "present").length /
        mockData.attendance.length) *
        100,
    ),
  };
};

/**
 * Get student performance stats
 */
export const getStudentStats = (studentId: string) => {
  const grades = getGradesByStudent(studentId);
  const attendance = getAttendanceByStudent(studentId);
  const assignments = getAssignmentsByStudent(studentId);

  return {
    gpa: calculateGPA(studentId),
    attendanceRate: calculateAttendancePercentage(studentId),
    assignmentsCompleted: assignments.filter((a) =>
      a.submissions?.some((s) => s.studentId === studentId),
    ).length,
    totalAssignments: assignments.length,
    averageGrade:
      grades.length > 0
        ? grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length
        : 0,
  };
};

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validate if a teacher can message a student
 */
export const canTeacherMessageStudent = (
  teacherId: string,
  studentId: string,
): boolean => {
  const teacher = getTeacherById(teacherId);
  const student = getStudentById(studentId);

  if (!teacher || !student) return false;
  return teacher.classes.includes(student.classId);
};

/**
 * Validate if a student can message a teacher
 */
export const canStudentMessageTeacher = (
  studentId: string,
  teacherId: string,
): boolean => {
  const student = getStudentById(studentId);
  const teacher = getTeacherById(teacherId);

  if (!student || !teacher) return false;
  return teacher.classes.includes(student.classId);
};

/**
 * Check if parent can borrow books (BLOCKED by default)
 */
export const canParentBorrow = (parentId: string): boolean => {
  const parent = getParentById(parentId);
  return parent?.isAllowedToBorrow ?? false;
};

/**
 * Check if parent can submit tickets (BLOCKED by default)
 */
export const canParentSubmitTicket = (parentId: string): boolean => {
  const parent = getParentById(parentId);
  return parent?.canSubmitTickets ?? false;
};

// ==================== SYSTEM USER QUERIES ====================

/**
 * Get system users by role
 */
export const getUsersByRole = (role: Role): SystemUser[] => {
  return mockData.systemUsers.filter((u) => u.role === role);
};

/**
 * Get system users by role category
 */
export const getUsersByCategory = (category: RoleCategory): SystemUser[] => {
  return mockData.systemUsers.filter((u) => u.roleCategory === category);
};

/**
 * Get all SLT members (users with isSLT: true)
 */
export const getSLTMembers = (): SystemUser[] => {
  return mockData.systemUsers.filter((u) => u.sltPermissions?.isSLT === true);
};

/**
 * Get system users by department
 */
export const getUsersByDepartment = (department: string): SystemUser[] => {
  return mockData.systemUsers.filter(
    (u) => u.department?.toLowerCase() === department.toLowerCase(),
  );
};

/**
 * Get system users by assigned year group
 */
export const getUsersByYearGroup = (yearGroup: string): SystemUser[] => {
  return mockData.systemUsers.filter(
    (u) => u.assignedYearGroup?.toLowerCase() === yearGroup.toLowerCase(),
  );
};

// Export all utilities
export default {
  // Student queries
  getStudentById,
  getStudentsByClass,
  getStudentsByParent,
  getStudentsByTeacher,
  searchStudents,

  // Teacher queries
  getTeacherById,
  getTeachersByClass,
  getTeachersBySubject,
  getSubjectHead,
  searchTeachers,

  // Parent queries
  getParentById,
  getParentsByStudent,
  searchParents,

  // Class queries
  getClassById,
  getClassByStudent,
  getClassTeacher,
  getSubjectsByClass,

  // Subject queries
  getSubjectById,
  getSubjectsByTeacher,
  getClassesBySubject,

  // Assignment queries
  getAssignmentsByClass,
  getAssignmentsByTeacher,
  getAssignmentsBySubject,
  getAssignmentsByStudent,
  getSubmissionsByStudent,
  getSubmissionsByAssignment,

  // Attendance queries
  getAttendanceByStudent,
  getAttendanceByClassAndDate,
  calculateAttendancePercentage,

  // Grade queries
  getGradesByStudent,
  getGradesBySubject,
  getGradesByClass,
  calculateGPA,

  // Timetable queries
  getTimetableByClass,
  getTimetableByTeacher,
  getTimetableByDay,
  checkTimetableConflicts,

  // Library queries
  getBookById,
  searchBooks,
  getTransactionsByStudent,
  getOverdueTransactions,
  getAvailableBooks,

  // Ticket queries
  getTicketsByStatus,
  getTicketsByCreator,
  getTicketsAssignedTo,
  getOpenTicketsCount,

  // Message queries
  getMessagesBySender,
  getMessagesByRecipient,
  getUnreadMessagesCount,
  getValidMessages,

  // Announcement queries
  getAnnouncementsByTarget,
  getRecentAnnouncements,

  // Global search
  globalSearch,

  // Statistics
  getDashboardStats,
  getStudentStats,

  // Validation
  canTeacherMessageStudent,
  canStudentMessageTeacher,
  canParentBorrow,
  canParentSubmitTicket,

  // System user queries
  getUsersByRole,
  getUsersByCategory,
  getSLTMembers,
  getUsersByDepartment,
  getUsersByYearGroup,
};
