# SETU Education Management System - Technical Specification

## 1. Overview

This specification defines the complete relational data model, role-based access control (RBAC) system, and feature implementation guide for the SETU Education Management System.

---

## 2. Data Model

### 2.1 Core Entities & Relationships

```mermaid
erDiagram
  Admin ||--o{ SystemUser : manages
  Teacher ||--o{ Subject : heads
  Teacher ||--o{ Class : teaches
  Teacher ||--o{ TimetableEntry : owns
  Class ||--o{ Student : contains
  Class ||--o{ TimetableEntry : has
  Class ||--o{ Subject : studies
  Student ||--o{ Attendance : has
  Student ||--o{ Grade : has
  Student ||--o{ Assignment : receives
  Student ||--o{ Message : sends
  Student ||--o{ LibraryTransaction : borrows
  Student ||--o| Parent : belongs_to
  Parent ||--o{ Message : receives
  Parent ||--o{ LibraryTransaction : blocked
  Parent ||--o{ Ticket : blocked
  Subject ||--o{ TimetableEntry : scheduled_for
  Subject ||--o{ Assignment : has
  Subject ||--o{ Grade : records
  Librarian ||--o{ LibraryTransaction : manages
  Announcement ||--o{ Class : targets
  Message ||--o{ Class : to_class
```

### 2.2 TypeScript Interfaces

```typescript
// ==================== CORE TYPES ====================

export type Role = "admin" | "teacher" | "student" | "parent" | "librarian";

// ==================== USER ENTITIES ====================

export interface Admin {
  id: string;
  userId: string;          // Links to SystemUser
  name: string;
  email: string;
  department: string;
  position: string;
  adminLevel: "super" | "department" | "staff";
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
  subjects: string[];              // Subject IDs
  classes: string[];                // Class IDs
  isHeadOfSubject: string | null;   // Subject ID if Head
  isClassTeacher: string | null;    // Class ID if Class Teacher
  qualifications: string[];
  experience: number;               // Years
  status: "active" | "on_leave" | "inactive";
  joinDate: string;
  // Relational links
  students?: Student[];            // Through classes
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
  classId: string;                  // Current class
  section: string;
  rollNo: number;
  house?: string;
  bloodGroup?: string;
  emergencyContact: string;
  emergencyPhone: string;
  photo?: string;
  attendancePercent: number;
  gpa: number;
  status: "active" | "inactive" | "alumni" | "transferred";
  admissionDate: string;
  // Relational links
  parentId: string | null;         // Linked Parent
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
  relationship: string;            // "father" | "mother" | "guardian"
  // Relational links
  children: string[];              // Student IDs
  isAllowedToBorrow: boolean;       // Default: false (blocked by default)
  canSubmitTickets: boolean;       // Default: false (blocked by default)
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
  // Additional permissions
  canManageStudentAccess: boolean; // Can manage library access
}

// ==================== ACADEMIC ENTITIES ====================

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  description: string;
  credits: number;
  headTeacherId: string | null;    // Teacher who heads this subject
  // Curriculum details
  curriculum: string;
  textbook: string;
  learningObjectives: string[];
  // Class mappings
  classes: string[];               // Class IDs where this subject is taught
  teachers: string[];               // Teacher IDs
  // Status
  status: "active" | "inactive" | "archived";
}

export interface ClassGrade {
  id: string;
  name: string;                    // "Grade 9" or "Class 10-A"
  level: number;                   // 1-12
  section: string;
  classTeacherId: string | null;  // Teacher who is class teacher
  students: string[];              // Student IDs
  subjects: string[];              // Subject IDs
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
  dayOfWeek: number;               // 0-6 (Sunday-Saturday)
  period: number;                  // 1-8
  startTime: string;
  endTime: string;
  room: string;
  academicYear: string;
  notes?: string;                  // Teacher can add notes about students
}

export interface SchedulePeriod {
  id: string;
  period: number;
  startTime: string;
  endTime: string;
  breakDuration: number;           // Minutes
}

// ==================== ATTENDANCE ====================

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  period?: number;                 // If per-period attendance
  markedBy: string;               // Teacher ID
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
  status: "draft" | "published" | "graded" | "archived";
  attachments?: string[];
  createdAt: string;
  // Submissions
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
  status: "submitted" | "late" | "graded" | "pending";
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  assignmentId?: string;
  term: string;                   // "Term 1", "Midterm", "Final"
  marks: number;
  maxMarks: number;
  percentage: number;
  grade: string;                  // "A", "B+", "C", etc.
  remarks?: string;
  createdAt: string;
}

// ==================== COMMUNICATION ====================

export interface Announcement {
  id: string;
  title: string;
  message: string;
  authorId: string;                // Teacher or Admin
  targetType: "all" | "class" | "teacher" | "student" | "parent";
  targetIds: string[];            // Class IDs or role-specific
  publishType: "immediate" | "scheduled";
  publishAt?: string;
  status: "draft" | "published" | "archived";
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
  // For class-group messages
  classId?: string;                // If sent to a class
  subject?: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
  // Validation
  isValid: boolean;                // System-validated sender-recipient pair
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
  status: "available" | "unavailable";
}

export interface LibraryTransaction {
  id: string;
  bookId: string;
  studentId: string;
  borrowedDate: string;
  dueDate: string;
  returnedDate: string | null;
  status: "borrowed" | "returned" | "overdue" | "lost";
  lateFine: number;
  // Admin override (parents are blocked)
  overrideByAdmin?: string;
}

// ==================== SUPPORT ====================

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: "it" | "facility" | "academic" | "admin" | "other";
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdBy: string;
  createdByRole: Role;
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
  // Blocked for parents
  isBlocked: boolean;
  blockNote?: string;
}

// ==================== REPORTS ====================

export interface Report {
  id: string;
  type: "student" | "class" | "attendance" | "grade" | "library";
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
  key: string;                    // Unique identifier
  category: string;               // "search", "view", "edit", "create", "delete"
  module: string;                  // "students", "teachers", "attendance", etc.
  description: string;
  // Default access by role
  defaultAccess: Record<Role, "allow" | "deny" | "config">;
  // Configurable from admin panel
  isConfigurable: boolean;
}

export interface RolePermission {
  role: Role;
  permissionKey: string;
  access: "allow" | "deny";
  // Module-specific assignment (for teachers)
  moduleScope?: string;          // e.g., specific class or subject
  assignedBy?: string;            // Admin who assigned
  assignedAt?: string;
}

export interface AccessConfig {
  id: string;
  permissionKey: string;
  role: Role;
  access: "allow" | "deny";
  config?: Record<string, any>;   // Additional config
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
  // Additional info based on type
  className?: string;             // For students
  department?: string;            // For teachers/staff
  childName?: string;             // For parents
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
```

---

## 3. Permission System

### 3.1 Permission Categories

| Module | Permission Key | Description | Default Admin | Default Teacher | Default Student | Default Parent | Default Librarian |
|--------|---------------|-------------|---------------|-----------------|-----------------|-----------------|-------------------|
| **Search** | | | | | | | |
| | search.students | Search all students | allow | allow | deny | deny | allow |
| | search.teachers | Search all teachers | allow | allow | deny | deny | allow |
| | search.parents | Search all parents | allow | deny | deny | deny | deny |
| | search.staff | Search all staff | allow | allow | deny | deny | allow |
| **Student View** | | | | | | | |
| | view.student.full | View complete student details | allow | allow | own | own_child | deny |
| | view.student.contact | View contact info | allow | allow | own | own_child | deny |
| | view.student.attendance | View attendance records | allow | allow | own | own_child | deny |
| | view.student.grades | View grades | allow | allow | own | own_child | deny |
| | view.student.notes | View behavioral notes | allow | allow | deny | deny | deny |
| **Teacher View** | | | | | | | |
| | view.teacher.full | View teacher profiles | allow | allow | deny | deny | allow |
| | view.teacher.schedule | View teacher schedules | allow | allow | deny | deny | allow |
| **Subject** | | | | | | | |
| | view.subject.all | View all subjects | allow | allow | deny | deny | allow |
| | view.subject.details | View subject curriculum | allow | allow | deny | deny | deny |
| | edit.subject | Manage subject (Head only) | allow | config | deny | deny | deny |
| **Attendance** | | | | | | | |
| | view.attendance.all | View all attendance | allow | allow | own | own_child | deny |
| | view.attendance.class | View class attendance | allow | allow | deny | deny | deny |
| | mark.attendance | Mark attendance | allow | allow | deny | deny | deny |
| | export.attendance | Export attendance reports | allow | allow | deny | deny | deny |
| **Assignments** | | | | | | | |
| | view.assignment.all | View all assignments | allow | config | own | deny | deny |
| | create.assignment | Create assignments | allow | config | deny | deny | deny |
| | edit.assignment | Edit assignments | allow | config | deny | deny | deny |
| | grade.assignment | Grade assignments | allow | config | deny | deny | deny |
| **Gradebook** | | | | | | | |
| | view.gradebook.all | View all grades | allow | config | own | own_child | deny |
| | edit.gradebook | Edit grades | allow | config | deny | deny | deny |
| | export.gradebook | Export grade reports | allow | config | deny | deny | deny |
| **Timetable** | | | | | | | |
| | admin.timetable | Full timetable control | allow | deny | deny | deny | deny |
| | view.timetable.all | View all timetables | allow | allow | deny | deny | allow |
| | edit.timetable.student | Edit student notes | allow | config | deny | deny | deny |
| **Reports** | | | | | | | |
| | view.reports.teacher | Teacher reports | allow | allow | deny | deny | deny |
| | view.reports.student | Student reports | allow | config | allow | config | deny |
| | view.reports.class | Class reports | allow | allow | deny | deny | deny |
| **Announcements** | | | | | | | |
| | create.announcement | Create announcements | allow | allow | deny | deny | deny |
| | edit.announcement | Edit announcements | allow | own | deny | deny | deny |
| | delete.announcement | Delete announcements | allow | own | deny | deny | deny |
| **Messages** | | | | | | | |
| | send.message | Send messages | allow | allow | denied_class | denied_class | allow |
| | message.allocate.teachers | Message allocated teachers only | - | - | true | - | - |
| **Library** | | | | | | | |
| | borrow.book | Borrow library books | allow | allow | allow | deny | allow |
| | manage.library | Manage library | allow | deny | deny | deny | allow |
| | manage.access | Manage library access | allow | deny | deny | deny | config |
| **Tickets** | | | | | | | |
| | create.ticket | Submit support tickets | allow | allow | deny | deny | allow |
| | view.ticket.all | View all tickets | allow | own | deny | deny | allow |
| | assign.ticket | Assign tickets | allow | deny | deny | deny | deny |

### 3.2 Configurable Permissions (Admin Panel)

These permissions can be configured per-teacher from the Admin Panel:

1. **Teacher-specific permissions:**
   - `view.assignment.all` - Can view all assignments
   - `create.assignment` - Can create assignments
   - `edit.assignment` - Can edit assignments
   - `grade.assignment` - Can grade assignments
   - `view.gradebook.all` - Can view all gradebook
   - `edit.gradebook` - Can edit grades
   - `export.gradebook` - Can export grades
   - `edit.timetable.student` - Can edit student notes in timetable

2. **Librarian-specific permissions:**
   - `manage.access` - Can manage student library access

3. **Student report visibility:**
   - `view.reports.student` - Can be enabled/disabled per role

---

## 4. Implementation Roadmap

### 4.1 Git Branching Strategy

| Feature | Base Branch | New Branch | Order |
|---------|-------------|------------|-------|
| Relational Mock Data | `main` | `feature/relational-mock-data` | 1 |
| Permission System | `feature/relational-mock-data` | `feature/permission-system` | 2 |
| Global Search | `feature/permission-system` | `feature/global-search` | 3 |
| Student Search (Teacher/Librarian) | `feature/global-search` | `feature/student-search` | 4 |
| Student Detail Access | `feature/student-search` | `feature/student-detail-access` | 5 |
| Parent Child View | `feature/student-detail-access` | `feature/parent-child-view` | 6 |
| Teacher Schedule View | `feature/permission-system` | `feature/teacher-schedule-view` | 7 |
| Subject Management | `feature/teacher-schedule-view` | `feature/subject-management` | 8 |
| Attendance System | `feature/subject-management` | `feature/attendance-system` | 9 |
| Assignment/Gradebook Module | `feature/attendance-system` | `feature/assignment-gradebook` | 10 |
| Timetable Builder | `feature/assignment-gradebook` | `feature/timetable-builder` | 11 |
| Timetable Teacher Edit | `feature/timetable-builder` | `feature/timetable-teacher-edit` | 12 |
| Teacher Reports | `feature/timetable-teacher-edit` | `feature/teacher-reports` | 13 |
| Student Reports | `feature/teacher-reports` | `feature/student-reports` | 14 |
| Announcements | `feature/student-reports` | `feature/announcements` | 15 |
| Messaging Restrictions | `feature/announcements` | `feature/messaging-restrictions` | 16 |
| Library Restrictions | `feature/messaging-restrictions` | `feature/library-restrictions` | 17 |
| Ticket Restrictions | `feature/library-restrictions` | `feature/ticket-restrictions` | 18 |
| Access Management Panel | `feature/ticket-restrictions` | `feature/access-management-panel` | 19 |

### 4.2 Git Commands for Each Step

```bash
# Step 1: Create relational mock data
git checkout main
git pull origin main
git checkout -b feature/relational-mock-data

# Step 2: Permission system (from feature/relational-m checkout featureock-data)
git/relational-mock-data
git checkout -b feature/permission-system

# Step 3: Global search (from feature/permission-system)
git checkout feature/permission-system
git checkout -b feature/global-search

# ... and so on
```

---

## 5. Mock Data Requirements

### 5.1 Data Counts

| Entity | Count | Notes |
|--------|-------|-------|
| Admins | 5 | Different admin levels |
| Teachers | 20 | Include 3 heads of subjects |
| Students | 150 | Across 6 grade levels |
| Parents | 50 | Linked to students |
| Librarians | 2 | Different sections |
| Subjects | 15-20 | Core + elective |
| Classes | 12-18 | Grade-wise sections |
| Timetable Entries | ~200 | Full week for all classes |
| Attendance Records | 4500+ | 30 days × 150 students |
| Assignments | 50+ | Per subject/class |
| Grade Entries | 500+ | Multiple subjects |
| Announcements | 30+ | Historical |
| Messages | 100+ | Valid sender-recipient only |
| Library Transactions | 200+ | Excluding parent borrows |
| Tickets | 50+ | Excluding parent tickets |

### 5.2 Relational Integrity Rules

1. **Students → Parents:** Each student has 1-2 linked parents
2. **Parents → Students:** Parents can have 1-3 children
3. **Teachers → Classes:** Teachers can teach multiple classes
4. **Classes → Students:** Each class has 20-35 students
5. **Subjects → Teachers:** Each subject has 1-3 teachers, one is Head
6. **Timetable:** No conflicts in room/teacher/time slots
7. **Messages:** Only valid teacher-student (allocated class) or staff-staff
8. **Library:** No transactions for parents (enforced)
9. **Tickets:** No tickets from parents (enforced)

---

## 6. Console Demo Requirements

Each feature implementation should include `console.log` demonstrations showing:

1. **Role-based access:**
   ```typescript
   console.log(`[PERMISSION] User ${user.name} (${role}) attempted ${action}: ${hasPermission ? 'ALLOWED' : 'DENIED'}`);
   ```

2. **Data relationships:**
   ```typescript
   console.log(`[RELATION] Student ${student.name} → Parent: ${parent.name}`);
   console.log(`[RELATION] Teacher ${teacher.name} → Head of Subject: ${subject.name}`);
   ```

3. **Permission changes:**
   ```typescript
   console.log(`[CONFIG] Admin changed permission '${permKey}' for ${role}: ${access}`);
   console.log(`[ACCESS] Effective permissions for ${role}:`, permissions);
   ```

4. **Validation:**
   ```typescript
   console.log(`[VALIDATION] Message from ${sender} to ${recipient}: ${isValid ? 'SENT' : 'BLOCKED - ' + reason}`);
   ```

---

## 7. Implementation Checklist

- [ ] Create relational data model in mock-data.ts
- [ ] Implement Permission type and default configurations
- [ ] Create AccessConfigContext for real-time permission updates
- [ ] Build global search with role-based filtering
- [ ] Implement student search for teachers/librarians
- [ ] Add parent-child relationship viewing
- [ ] Create teacher schedule view with conflict detection
- [ ] Implement subject management with Head designation
- [ ] Build attendance system with full CRUD
- [ ] Add assignment/gradebook module assignment
- [ ] Enhance timetable builder with teacher edit
- [ ] Create report generation for teachers/students
- [ ] Implement announcement creation for teachers
- [ ] Add message validation (allocated teachers only)
- [ ] Block parent library borrows
- [ ] Block parent ticket creation
- [ ] Build Access Management admin panel

---

*Document Version: 1.0*
*Last Updated: 2026-03-01*
