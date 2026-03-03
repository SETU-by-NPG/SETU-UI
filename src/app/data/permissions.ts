/**
 * SETU Education Management System - Permission Configuration
 * 27-Role Hierarchy System
 *
 * Permission format: roles[] allowlist (replaces old defaultAccess matrix)
 * SLT permissions: use requiresSLT: true for strategic-layer permissions
 */

import type {
  Role,
  RoleCategory,
  Permission,
  AccessConfig,
  RolePermission,
} from "../types";

// ==================== ROLE CATEGORIES ====================

export const roleCategories: Record<
  RoleCategory,
  { label: string; roles: Role[] }
> = {
  administrative: {
    label: "Administrative",
    roles: [
      "master_admin",
      "it_admin",
      "it_technician",
      "principal",
      "finance_manager",
      "hr_manager",
      "admissions_officer",
      "data_manager",
      "facilities_manager",
    ],
  },
  academic_leadership: {
    label: "Academic Leadership",
    roles: [
      "slt_member",
      "head_of_department",
      "head_of_year",
      "examinations_officer",
    ],
  },
  safeguarding_welfare: {
    label: "Safeguarding & Welfare",
    roles: [
      "safeguarding_lead",
      "senco",
      "attendance_officer",
      "careers_advisor",
    ],
  },
  teaching_support: {
    label: "Teaching & Support",
    roles: ["teacher", "cover_supervisor", "teaching_assistant"],
  },
  technical_specialist: {
    label: "Technical Specialists",
    roles: ["librarian", "science_technician", "subject_technician"],
  },
  student: {
    label: "Students",
    roles: ["student", "student_leadership"],
  },
  parent: {
    label: "Parents & Guardians",
    roles: ["parent"],
  },
  support: {
    label: "Support Staff",
    roles: ["support_staff"],
  },
};

// ==================== ROLE DISPLAY NAMES ====================

export const roleDisplayNames: Record<Role, string> = {
  master_admin: "Master Administrator",
  it_admin: "IT Administrator",
  it_technician: "IT Technician",
  principal: "Principal",
  finance_manager: "Finance Manager",
  hr_manager: "HR Manager",
  admissions_officer: "Admissions Officer",
  data_manager: "Data Manager / MIS",
  facilities_manager: "Facilities Manager",
  slt_member: "SLT Member",
  head_of_department: "Head of Department",
  head_of_year: "Head of Year",
  examinations_officer: "Examinations Officer",
  safeguarding_lead: "Safeguarding Lead (DSL)",
  senco: "SENCO",
  attendance_officer: "Attendance Officer",
  careers_advisor: "Careers Advisor",
  teacher: "Teacher",
  cover_supervisor: "Cover Supervisor",
  teaching_assistant: "Teaching Assistant",
  librarian: "Librarian",
  science_technician: "Science Technician",
  subject_technician: "Subject Technician",
  student: "Student",
  student_leadership: "Student Leadership",
  parent: "Parent / Guardian",
  support_staff: "Support Staff",
};

// Roles used by the demo role-switcher (one representative per category)
export const demoRoleEmails: Record<Role, string> = {
  master_admin: "admin@setu.edu",
  it_admin: "it.admin@setu.edu",
  it_technician: "it.tech@setu.edu",
  principal: "principal@setu.edu",
  finance_manager: "finance@setu.edu",
  hr_manager: "hr@setu.edu",
  admissions_officer: "admissions@setu.edu",
  data_manager: "data@setu.edu",
  facilities_manager: "facilities@setu.edu",
  slt_member: "slt@setu.edu",
  head_of_department: "sarah.mitchell@setu.edu",
  head_of_year: "hoy@setu.edu",
  examinations_officer: "exams@setu.edu",
  safeguarding_lead: "dsl@setu.edu",
  senco: "senco@setu.edu",
  attendance_officer: "attendance@setu.edu",
  careers_advisor: "careers@setu.edu",
  teacher: "john.w@setu.edu",
  cover_supervisor: "cover@setu.edu",
  teaching_assistant: "ta@setu.edu",
  librarian: "priya.n@setu.edu",
  science_technician: "sci.tech@setu.edu",
  subject_technician: "subj.tech@setu.edu",
  student: "alice@setu.edu",
  student_leadership: "student.leader@setu.edu",
  parent: "robert@email.com",
  support_staff: "reception@setu.edu",
};

// ==================== NAVIGATION BY ROLE ====================

interface NavItem {
  label: string;
  path: string;
  icon: string;
  section?: string;
}

export const navigationByRole: Record<Role, NavItem[]> = {
  master_admin: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "User Management",
      path: "/user-management",
      icon: "Users",
      section: "Identity",
    },
    {
      label: "Roles & Permissions",
      path: "/roles-permissions",
      icon: "Shield",
    },
    {
      label: "Student Profiles",
      path: "/students",
      icon: "GraduationCap",
      section: "People",
    },
    { label: "Teacher Profiles", path: "/teachers", icon: "BookOpen" },
    {
      label: "Room Management",
      path: "/rooms",
      icon: "DoorOpen",
      section: "Resources",
    },
    { label: "IT Equipment", path: "/equipment", icon: "Monitor" },
    {
      label: "Support Tickets",
      path: "/tickets",
      icon: "TicketCheck",
      section: "Operations",
    },
    { label: "Messages", path: "/messages", icon: "MessageSquare" },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
    { label: "Reports", path: "/reports", icon: "BarChart3" },
    {
      label: "Audit Logs",
      path: "/audit-logs",
      icon: "ScrollText",
      section: "System",
    },
    { label: "School Setup", path: "/setup", icon: "School" },
    { label: "Academic Year", path: "/academic", icon: "Calendar" },
    { label: "Classes & Sections", path: "/classes", icon: "Users" },
    { label: "Subjects", path: "/subjects", icon: "BookOpen" },
    {
      label: "Timetable Builder",
      path: "/timetable-builder",
      icon: "Calendar",
    },
    { label: "System Settings", path: "/settings", icon: "Settings" },
  ],
  it_admin: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "User Management",
      path: "/user-management",
      icon: "Users",
      section: "Administration",
    },
    {
      label: "Roles & Permissions",
      path: "/roles-permissions",
      icon: "Shield",
    },
    {
      label: "IT Equipment",
      path: "/equipment",
      icon: "Monitor",
      section: "IT",
    },
    { label: "Support Tickets", path: "/tickets", icon: "TicketCheck" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
    {
      label: "Audit Logs",
      path: "/audit-logs",
      icon: "ScrollText",
      section: "System",
    },
    { label: "System Settings", path: "/settings", icon: "Settings" },
  ],
  it_technician: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "IT Equipment",
      path: "/equipment",
      icon: "Monitor",
      section: "IT",
    },
    { label: "Support Tickets", path: "/tickets", icon: "TicketCheck" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  principal: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "User Management",
      path: "/user-management",
      icon: "Users",
      section: "Administration",
    },
    {
      label: "Student Profiles",
      path: "/students",
      icon: "GraduationCap",
      section: "People",
    },
    { label: "Teacher Profiles", path: "/teachers", icon: "BookOpen" },
    {
      label: "Attendance",
      path: "/attendance",
      icon: "ClipboardCheck",
      section: "Academic",
    },
    { label: "Timetable", path: "/timetable", icon: "Calendar" },
    { label: "Academic Year", path: "/academic", icon: "Calendar" },
    { label: "Classes & Sections", path: "/classes", icon: "Users" },
    { label: "Subjects", path: "/subjects", icon: "BookOpen" },
    {
      label: "Reports",
      path: "/reports",
      icon: "BarChart3",
      section: "Reporting",
    },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
    {
      label: "System Settings",
      path: "/settings",
      icon: "Settings",
      section: "System",
    },
  ],
  finance_manager: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "Reports",
      path: "/reports",
      icon: "BarChart3",
      section: "Finance",
    },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  hr_manager: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "User Management",
      path: "/user-management",
      icon: "Users",
      section: "HR",
    },
    { label: "Teacher Profiles", path: "/teachers", icon: "BookOpen" },
    { label: "Reports", path: "/reports", icon: "BarChart3" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  admissions_officer: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "Student Profiles",
      path: "/students",
      icon: "GraduationCap",
      section: "Admissions",
    },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  data_manager: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "Reports",
      path: "/reports",
      icon: "BarChart3",
      section: "Data & MIS",
    },
    { label: "Audit Logs", path: "/audit-logs", icon: "ScrollText" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  facilities_manager: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "Room Management",
      path: "/rooms",
      icon: "DoorOpen",
      section: "Facilities",
    },
    { label: "IT Equipment", path: "/equipment", icon: "Monitor" },
    { label: "Support Tickets", path: "/tickets", icon: "TicketCheck" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  slt_member: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "Student Profiles",
      path: "/students",
      icon: "GraduationCap",
      section: "Academic",
    },
    { label: "Teacher Profiles", path: "/teachers", icon: "BookOpen" },
    { label: "Attendance", path: "/attendance", icon: "ClipboardCheck" },
    { label: "Timetable", path: "/timetable", icon: "Calendar" },
    {
      label: "Reports",
      path: "/reports",
      icon: "BarChart3",
      section: "Reporting",
    },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  head_of_department: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "My Classes",
      path: "/students",
      icon: "Users",
      section: "Academic",
    },
    { label: "Attendance", path: "/attendance", icon: "ClipboardCheck" },
    { label: "Assignments", path: "/assignments", icon: "BookOpen" },
    { label: "Gradebook", path: "/gradebook", icon: "FileText" },
    { label: "Timetable", path: "/timetable", icon: "Calendar" },
    { label: "Subjects", path: "/subjects", icon: "BookOpen" },
    {
      label: "Reports",
      path: "/reports",
      icon: "BarChart3",
      section: "Reporting",
    },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  head_of_year: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "My Year Group",
      path: "/students",
      icon: "GraduationCap",
      section: "Academic",
    },
    { label: "Attendance", path: "/attendance", icon: "ClipboardCheck" },
    { label: "Reports", path: "/reports", icon: "BarChart3" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  examinations_officer: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "Students",
      path: "/students",
      icon: "GraduationCap",
      section: "Examinations",
    },
    { label: "Gradebook", path: "/gradebook", icon: "FileText" },
    { label: "Reports", path: "/reports", icon: "BarChart3" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  safeguarding_lead: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "Student Profiles",
      path: "/students",
      icon: "GraduationCap",
      section: "Safeguarding",
    },
    { label: "Attendance", path: "/attendance", icon: "ClipboardCheck" },
    { label: "Reports", path: "/reports", icon: "BarChart3" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  senco: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "Student Profiles",
      path: "/students",
      icon: "GraduationCap",
      section: "SEND",
    },
    { label: "Attendance", path: "/attendance", icon: "ClipboardCheck" },
    { label: "Reports", path: "/reports", icon: "BarChart3" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  attendance_officer: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "Attendance",
      path: "/attendance",
      icon: "ClipboardCheck",
      section: "Welfare",
    },
    { label: "Student Profiles", path: "/students", icon: "GraduationCap" },
    { label: "Reports", path: "/reports", icon: "BarChart3" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  careers_advisor: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "Student Profiles",
      path: "/students",
      icon: "GraduationCap",
      section: "Guidance",
    },
    { label: "Reports", path: "/reports", icon: "BarChart3" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  teacher: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "My Classes",
      path: "/students",
      icon: "Users",
      section: "Teaching",
    },
    { label: "Attendance", path: "/attendance", icon: "ClipboardCheck" },
    { label: "Assignments", path: "/assignments", icon: "BookOpen" },
    { label: "Gradebook", path: "/gradebook", icon: "FileText" },
    { label: "Timetable", path: "/timetable", icon: "Calendar" },
    {
      label: "Library",
      path: "/library",
      icon: "Library",
      section: "Resources",
    },
    { label: "IT Equipment", path: "/equipment", icon: "Monitor" },
    { label: "Support Tickets", path: "/tickets", icon: "TicketCheck" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  cover_supervisor: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "My Classes",
      path: "/students",
      icon: "Users",
      section: "Teaching",
    },
    { label: "Attendance", path: "/attendance", icon: "ClipboardCheck" },
    { label: "Timetable", path: "/timetable", icon: "Calendar" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  teaching_assistant: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "My Classes",
      path: "/students",
      icon: "Users",
      section: "Teaching",
    },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  librarian: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { label: "Library", path: "/library", icon: "Library", section: "Library" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  science_technician: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "IT Equipment",
      path: "/equipment",
      icon: "Monitor",
      section: "Resources",
    },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  subject_technician: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "IT Equipment",
      path: "/equipment",
      icon: "Monitor",
      section: "Resources",
    },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  student: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "Assignments",
      path: "/assignments",
      icon: "BookOpen",
      section: "Learning",
    },
    { label: "Grades", path: "/gradebook", icon: "FileText" },
    { label: "Timetable", path: "/timetable", icon: "Calendar" },
    { label: "Attendance", path: "/attendance", icon: "ClipboardCheck" },
    { label: "Library", path: "/library", icon: "Library" },
    {
      label: "Announcements",
      path: "/announcements",
      icon: "Bell",
      section: "Communication",
    },
  ],
  student_leadership: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "Assignments",
      path: "/assignments",
      icon: "BookOpen",
      section: "Learning",
    },
    { label: "Grades", path: "/gradebook", icon: "FileText" },
    { label: "Timetable", path: "/timetable", icon: "Calendar" },
    { label: "Attendance", path: "/attendance", icon: "ClipboardCheck" },
    { label: "Library", path: "/library", icon: "Library" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
  parent: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "Attendance",
      path: "/attendance",
      icon: "ClipboardCheck",
      section: "My Child",
    },
    { label: "Grades", path: "/gradebook", icon: "FileText" },
    { label: "Assignments", path: "/assignments", icon: "BookOpen" },
    { label: "Library", path: "/library", icon: "Library" },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Report Card", path: "/reports", icon: "BarChart3" },
  ],
  support_staff: [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    {
      label: "Support Tickets",
      path: "/tickets",
      icon: "TicketCheck",
      section: "Support",
    },
    {
      label: "Messages",
      path: "/messages",
      icon: "MessageSquare",
      section: "Communication",
    },
    { label: "Announcements", path: "/announcements", icon: "Bell" },
  ],
};

// ==================== PERMISSION MATRIX ====================
// Uses roles[] allowlist format. master_admin implicitly has access to everything.

export const DEFAULT_PERMISSIONS: Permission[] = [
  // ==================== SYSTEM ADMINISTRATION ====================
  {
    id: "perm_system_full_access",
    name: "Full System Access",
    key: "system.full_access",
    category: "System",
    description: "Complete access to all system functions",
    roles: ["master_admin"],
  },
  {
    id: "perm_manage_all_users",
    name: "Manage All Users",
    key: "system.manage_users",
    category: "System",
    description: "Create, edit, and delete any user account",
    roles: ["master_admin", "it_admin", "principal"],
  },
  {
    id: "perm_view_audit_logs",
    name: "View Audit Logs",
    key: "system.view_audit_logs",
    category: "System",
    description: "View all audit trail and activity logs",
    roles: ["master_admin", "it_admin", "principal", "data_manager"],
  },
  {
    id: "perm_manage_system_settings",
    name: "Manage System Settings",
    key: "system.manage_settings",
    category: "System",
    description: "Change global system configuration",
    roles: ["master_admin", "it_admin"],
  },
  {
    id: "perm_view_system_analytics",
    name: "View System Analytics",
    key: "system.view_analytics",
    category: "System",
    description: "View system-wide usage metrics and statistics",
    roles: ["master_admin", "it_admin", "principal", "data_manager"],
  },

  // ==================== IT MANAGEMENT ====================
  {
    id: "perm_it_full_access",
    name: "IT Full Access",
    key: "it.full_access",
    category: "IT",
    description: "Complete IT system control",
    roles: ["master_admin", "it_admin"],
  },
  {
    id: "perm_manage_network",
    name: "Manage Network",
    key: "it.manage_network",
    category: "IT",
    description: "Configure and manage network infrastructure",
    roles: ["master_admin", "it_admin"],
  },
  {
    id: "perm_manage_servers",
    name: "Manage Servers",
    key: "it.manage_servers",
    category: "IT",
    description: "Manage server infrastructure and deployments",
    roles: ["master_admin", "it_admin"],
  },
  {
    id: "perm_manage_devices",
    name: "Manage Devices",
    key: "it.manage_devices",
    category: "IT",
    description: "Manage physical IT devices and equipment",
    roles: ["master_admin", "it_admin", "it_technician"],
  },
  {
    id: "perm_view_it_tickets",
    name: "View IT Tickets",
    key: "it.view_tickets",
    category: "IT",
    description: "View all IT support tickets",
    roles: ["master_admin", "it_admin", "it_technician", "facilities_manager"],
  },
  {
    id: "perm_resolve_it_tickets",
    name: "Resolve IT Tickets",
    key: "it.resolve_tickets",
    category: "IT",
    description: "Close and respond to IT support tickets",
    roles: ["master_admin", "it_admin", "it_technician"],
  },
  {
    id: "perm_create_tickets",
    name: "Create Support Tickets",
    key: "it.create_tickets",
    category: "IT",
    description: "Create new IT or facility support requests",
    roles: [
      "master_admin",
      "it_admin",
      "it_technician",
      "principal",
      "finance_manager",
      "hr_manager",
      "admissions_officer",
      "data_manager",
      "facilities_manager",
      "slt_member",
      "head_of_department",
      "head_of_year",
      "examinations_officer",
      "safeguarding_lead",
      "senco",
      "attendance_officer",
      "careers_advisor",
      "teacher",
      "cover_supervisor",
      "teaching_assistant",
      "librarian",
      "science_technician",
      "subject_technician",
      "student",
      "student_leadership",
      "support_staff",
    ],
  },

  // ==================== FINANCE ====================
  {
    id: "perm_finance_full_access",
    name: "Finance Full Access",
    key: "finance.full_access",
    category: "Finance",
    description: "Complete financial management access",
    roles: ["master_admin", "finance_manager"],
  },
  {
    id: "perm_manage_budgets",
    name: "Manage Budgets",
    key: "finance.manage_budgets",
    category: "Finance",
    description: "Create and manage departmental budgets",
    roles: ["master_admin", "finance_manager"],
  },
  {
    id: "perm_approve_expenses",
    name: "Approve Expenses",
    key: "finance.approve_expenses",
    category: "Finance",
    description: "Approve expense requests",
    roles: ["master_admin", "finance_manager", "principal"],
  },
  {
    id: "perm_view_financial_reports",
    name: "View Financial Reports",
    key: "finance.view_reports",
    category: "Finance",
    description: "Access financial summaries and reports",
    roles: ["master_admin", "finance_manager", "principal", "data_manager"],
  },
  {
    id: "perm_manage_invoices",
    name: "Manage Invoices",
    key: "finance.manage_invoices",
    category: "Finance",
    description: "Create and manage invoices and billing",
    roles: ["master_admin", "finance_manager"],
  },

  // ==================== HR ====================
  {
    id: "perm_hr_full_access",
    name: "HR Full Access",
    key: "hr.full_access",
    category: "HR",
    description: "Complete human resources management",
    roles: ["master_admin", "hr_manager"],
  },
  {
    id: "perm_manage_staff",
    name: "Manage Staff",
    key: "hr.manage_staff",
    category: "HR",
    description: "Add, edit, and manage staff records",
    roles: ["master_admin", "hr_manager", "principal"],
  },
  {
    id: "perm_manage_leave",
    name: "Manage Leave",
    key: "hr.manage_leave",
    category: "HR",
    description: "Approve and manage staff leave requests",
    roles: ["master_admin", "hr_manager"],
  },
  {
    id: "perm_manage_recruitment",
    name: "Manage Recruitment",
    key: "hr.manage_recruitment",
    category: "HR",
    description: "Post vacancies and manage recruitment pipeline",
    roles: ["master_admin", "hr_manager"],
  },
  {
    id: "perm_view_staff_records",
    name: "View Staff Records",
    key: "hr.view_staff_records",
    category: "HR",
    description: "Access confidential staff information",
    roles: ["master_admin", "hr_manager", "principal", "data_manager"],
  },

  // ==================== ADMISSIONS ====================
  {
    id: "perm_manage_admissions",
    name: "Manage Admissions",
    key: "admissions.manage",
    category: "Admissions",
    description: "Process and manage student admission applications",
    roles: ["master_admin", "admissions_officer", "principal"],
  },
  {
    id: "perm_view_applicants",
    name: "View Applicants",
    key: "admissions.view_applicants",
    category: "Admissions",
    description: "View student application records",
    roles: ["master_admin", "admissions_officer", "principal"],
  },
  {
    id: "perm_process_applications",
    name: "Process Applications",
    key: "admissions.process",
    category: "Admissions",
    description: "Accept, reject, and process applications",
    roles: ["master_admin", "admissions_officer"],
  },
  {
    id: "perm_manage_enrollment",
    name: "Manage Enrollment",
    key: "admissions.manage_enrollment",
    category: "Admissions",
    description: "Enroll and withdraw students",
    roles: ["master_admin", "admissions_officer", "principal"],
  },

  // ==================== DATA / MIS ====================
  {
    id: "perm_data_full_access",
    name: "Data Full Access",
    key: "data.full_access",
    category: "Data",
    description: "Full MIS and data management access",
    roles: ["master_admin", "data_manager"],
  },
  {
    id: "perm_run_reports",
    name: "Run Reports",
    key: "data.run_reports",
    category: "Data",
    description: "Generate institutional reports",
    roles: [
      "master_admin",
      "data_manager",
      "principal",
      "slt_member",
      "head_of_department",
      "head_of_year",
      "examinations_officer",
    ],
  },
  {
    id: "perm_export_data",
    name: "Export Data",
    key: "data.export",
    category: "Data",
    description: "Export institutional data to external formats",
    roles: ["master_admin", "data_manager", "principal"],
  },
  {
    id: "perm_manage_compliance",
    name: "Manage Compliance",
    key: "data.manage_compliance",
    category: "Data",
    description: "Manage data compliance and GDPR obligations",
    roles: ["master_admin", "data_manager"],
  },

  // ==================== FACILITIES ====================
  {
    id: "perm_manage_rooms",
    name: "Manage Rooms",
    key: "facilities.manage_rooms",
    category: "Facilities",
    description: "Book and manage school rooms and spaces",
    roles: ["master_admin", "facilities_manager"],
  },
  {
    id: "perm_manage_equipment",
    name: "Manage Equipment",
    key: "facilities.manage_equipment",
    category: "Facilities",
    description: "Track and manage physical equipment inventory",
    roles: ["master_admin", "facilities_manager", "it_admin", "it_technician"],
  },
  {
    id: "perm_schedule_maintenance",
    name: "Schedule Maintenance",
    key: "facilities.schedule_maintenance",
    category: "Facilities",
    description: "Plan and schedule building maintenance",
    roles: ["master_admin", "facilities_manager"],
  },
  {
    id: "perm_view_facility_reports",
    name: "View Facility Reports",
    key: "facilities.view_reports",
    category: "Facilities",
    description: "View facility usage and maintenance reports",
    roles: ["master_admin", "facilities_manager", "principal"],
  },

  // ==================== ACADEMIC LEADERSHIP ====================
  {
    id: "perm_view_whole_school",
    name: "View Whole School Data",
    key: "academic.view_whole_school",
    category: "Academic",
    description: "Access school-wide performance and analytics",
    roles: [
      "master_admin",
      "it_admin",
      "principal",
      "data_manager",
      "slt_member",
    ],
  },
  {
    id: "perm_manage_policy",
    name: "Manage School Policy",
    key: "academic.manage_policy",
    category: "Academic",
    description: "Create and update school policies",
    roles: ["master_admin", "principal"],
  },
  {
    id: "perm_approve_staff_actions",
    name: "Approve Staff Actions",
    key: "academic.approve_staff_actions",
    category: "Academic",
    description: "Approve staff requests and disciplinary actions",
    roles: ["master_admin", "principal", "hr_manager"],
  },
  {
    id: "perm_manage_communications_admin",
    name: "Manage School Communications",
    key: "academic.manage_communications",
    category: "Academic",
    description: "Manage school-wide communications strategy",
    roles: ["master_admin", "principal", "slt_member"],
  },
  {
    id: "perm_manage_department",
    name: "Manage Department",
    key: "academic.manage_department",
    category: "Academic",
    description: "Oversee department curriculum and staff",
    roles: ["master_admin", "principal", "head_of_department"],
  },
  {
    id: "perm_manage_year_group",
    name: "Manage Year Group",
    key: "academic.manage_year_group",
    category: "Academic",
    description: "Oversee year group behaviour and welfare",
    roles: ["master_admin", "principal", "head_of_year"],
  },
  {
    id: "perm_manage_exams",
    name: "Manage Examinations",
    key: "academic.manage_exams",
    category: "Academic",
    description: "Organise and oversee examinations",
    roles: [
      "master_admin",
      "principal",
      "examinations_officer",
      "head_of_department",
    ],
  },
  {
    id: "perm_approve_curriculum",
    name: "Approve Curriculum",
    key: "academic.approve_curriculum",
    category: "Academic",
    description: "Approve curriculum plans and learning objectives",
    roles: ["master_admin", "principal", "head_of_department"],
  },

  // ==================== SLT STRATEGIC LAYER ====================
  {
    id: "perm_slt_strategic_planning",
    name: "SLT Strategic Planning",
    key: "slt.strategic_planning",
    category: "SLT",
    description: "Access strategic planning tools (requires SLT flag)",
    roles: [
      "master_admin",
      "principal",
      "slt_member",
      "head_of_department",
      "head_of_year",
    ],
    requiresSLT: true,
  },
  {
    id: "perm_slt_policy_decisions",
    name: "SLT Policy Decisions",
    key: "slt.policy_decisions",
    category: "SLT",
    description:
      "Participate in school-wide policy decisions (requires SLT flag)",
    roles: [
      "master_admin",
      "principal",
      "slt_member",
      "head_of_department",
      "head_of_year",
    ],
    requiresSLT: true,
  },
  {
    id: "perm_slt_whole_school_reports",
    name: "SLT Whole School Reports",
    key: "slt.whole_school_reports",
    category: "SLT",
    description:
      "Access strategic whole-school reporting dashboards (requires SLT flag)",
    roles: [
      "master_admin",
      "principal",
      "slt_member",
      "head_of_department",
      "head_of_year",
    ],
    requiresSLT: true,
  },

  // ==================== SAFEGUARDING ====================
  {
    id: "perm_safeguarding_full_access",
    name: "Safeguarding Full Access",
    key: "safeguarding.full_access",
    category: "Safeguarding",
    description: "Full access to all safeguarding records and tools",
    roles: ["master_admin", "safeguarding_lead"],
  },
  {
    id: "perm_report_concerns",
    name: "Report Safeguarding Concerns",
    key: "safeguarding.report_concerns",
    category: "Safeguarding",
    description: "Log child protection and welfare concerns",
    roles: [
      "master_admin",
      "principal",
      "safeguarding_lead",
      "senco",
      "head_of_year",
      "teacher",
      "cover_supervisor",
      "teaching_assistant",
      "careers_advisor",
      "attendance_officer",
      "support_staff",
    ],
  },
  {
    id: "perm_view_safeguarding_records",
    name: "View Safeguarding Records",
    key: "safeguarding.view_records",
    category: "Safeguarding",
    description: "View confidential safeguarding case records",
    roles: ["master_admin", "safeguarding_lead", "principal"],
  },
  {
    id: "perm_manage_sen_records",
    name: "Manage SEN Records",
    key: "safeguarding.manage_sen",
    category: "Safeguarding",
    description: "Create and update SEND support plans and records",
    roles: ["master_admin", "safeguarding_lead", "senco"],
  },

  // ==================== ATTENDANCE ====================
  {
    id: "perm_manage_attendance",
    name: "Manage Attendance",
    key: "attendance.manage",
    category: "Attendance",
    description: "Edit attendance records and authorise absences",
    roles: ["master_admin", "attendance_officer", "head_of_year", "principal"],
  },
  {
    id: "perm_view_all_attendance",
    name: "View All Attendance",
    key: "attendance.view_all",
    category: "Attendance",
    description: "View attendance records across the school",
    roles: [
      "master_admin",
      "principal",
      "attendance_officer",
      "head_of_year",
      "safeguarding_lead",
      "senco",
      "slt_member",
      "data_manager",
      "teacher",
      "cover_supervisor",
    ],
  },
  {
    id: "perm_send_attendance_alerts",
    name: "Send Attendance Alerts",
    key: "attendance.send_alerts",
    category: "Attendance",
    description: "Send absence notifications to parents",
    roles: ["master_admin", "attendance_officer", "head_of_year"],
  },
  {
    id: "perm_take_attendance",
    name: "Take Attendance",
    key: "attendance.take",
    category: "Attendance",
    description: "Mark class register for assigned classes",
    roles: [
      "master_admin",
      "teacher",
      "cover_supervisor",
      "attendance_officer",
      "head_of_department",
      "head_of_year",
    ],
  },

  // ==================== SEARCH ====================
  {
    id: "perm_search_students",
    name: "Search Students",
    key: "search.students",
    category: "Search",
    description: "Search all students in the system",
    roles: [
      "master_admin",
      "it_admin",
      "principal",
      "hr_manager",
      "admissions_officer",
      "data_manager",
      "slt_member",
      "head_of_department",
      "head_of_year",
      "examinations_officer",
      "safeguarding_lead",
      "senco",
      "attendance_officer",
      "careers_advisor",
      "teacher",
      "cover_supervisor",
      "librarian",
      "science_technician",
      "subject_technician",
    ],
  },
  {
    id: "perm_search_teachers",
    name: "Search Teachers",
    key: "search.teachers",
    category: "Search",
    description: "Search all teachers in the system",
    roles: [
      "master_admin",
      "it_admin",
      "principal",
      "hr_manager",
      "data_manager",
      "slt_member",
      "head_of_department",
      "head_of_year",
      "teacher",
      "cover_supervisor",
    ],
  },
  {
    id: "perm_search_parents",
    name: "Search Parents",
    key: "search.parents",
    category: "Search",
    description: "Search all parents/guardians in the system",
    roles: [
      "master_admin",
      "principal",
      "hr_manager",
      "admissions_officer",
      "data_manager",
      "head_of_year",
      "safeguarding_lead",
    ],
  },
  {
    id: "perm_search_staff",
    name: "Search Staff",
    key: "search.staff",
    category: "Search",
    description: "Search all staff members",
    roles: [
      "master_admin",
      "it_admin",
      "principal",
      "data_manager",
      "slt_member",
      "head_of_department",
      "teacher",
      "cover_supervisor",
      "librarian",
    ],
  },

  // ==================== STUDENT PROFILE ACCESS ====================
  {
    id: "perm_view_student_full",
    name: "View Student Full Details",
    key: "view.student.full",
    category: "Student",
    description: "View complete student profile",
    roles: [
      "master_admin",
      "it_admin",
      "principal",
      "admissions_officer",
      "data_manager",
      "slt_member",
      "head_of_department",
      "head_of_year",
      "safeguarding_lead",
      "senco",
      "attendance_officer",
      "careers_advisor",
      "teacher",
      "cover_supervisor",
    ],
  },
  {
    id: "perm_view_student_contact",
    name: "View Student Contact Info",
    key: "view.student.contact",
    category: "Student",
    description: "View student contact and emergency details",
    roles: [
      "master_admin",
      "principal",
      "admissions_officer",
      "data_manager",
      "head_of_year",
      "safeguarding_lead",
      "senco",
      "attendance_officer",
      "teacher",
    ],
  },
  {
    id: "perm_view_student_academic",
    name: "View Student Academic Records",
    key: "view.student.academic",
    category: "Student",
    description: "View grades, assignments and academic history",
    roles: [
      "master_admin",
      "principal",
      "data_manager",
      "slt_member",
      "head_of_department",
      "head_of_year",
      "examinations_officer",
      "teacher",
      "cover_supervisor",
      "student",
      "student_leadership",
      "parent",
    ],
  },
  {
    id: "perm_edit_student",
    name: "Edit Student Profile",
    key: "edit.student",
    category: "Student",
    description: "Update student profile details",
    roles: ["master_admin", "it_admin", "principal", "admissions_officer"],
  },

  // ==================== TEACHER PROFILE ACCESS ====================
  {
    id: "perm_view_teacher_full",
    name: "View Teacher Full Details",
    key: "view.teacher.full",
    category: "Teacher",
    description: "View complete teacher profile",
    roles: [
      "master_admin",
      "it_admin",
      "principal",
      "hr_manager",
      "data_manager",
      "slt_member",
      "head_of_department",
    ],
  },
  {
    id: "perm_edit_teacher",
    name: "Edit Teacher Profile",
    key: "edit.teacher",
    category: "Teacher",
    description: "Update teacher profile and assignments",
    roles: ["master_admin", "it_admin", "principal", "hr_manager"],
  },

  // ==================== TEACHING ====================
  {
    id: "perm_teaching_access",
    name: "Teaching Access",
    key: "teaching.access",
    category: "Teaching",
    description: "Access teaching tools and resources",
    roles: [
      "master_admin",
      "teacher",
      "cover_supervisor",
      "head_of_department",
    ],
  },
  {
    id: "perm_create_assignments",
    name: "Create Assignments",
    key: "teaching.create_assignments",
    category: "Teaching",
    description: "Create and publish new assignments",
    roles: ["master_admin", "teacher", "head_of_department"],
  },
  {
    id: "perm_grade_assignments",
    name: "Grade Assignments",
    key: "teaching.grade_assignments",
    category: "Teaching",
    description: "Mark and grade student submissions",
    roles: [
      "master_admin",
      "teacher",
      "head_of_department",
      "examinations_officer",
    ],
  },
  {
    id: "perm_view_own_classes",
    name: "View Own Classes",
    key: "teaching.view_classes",
    category: "Teaching",
    description: "See class lists for assigned classes",
    roles: [
      "master_admin",
      "teacher",
      "cover_supervisor",
      "teaching_assistant",
      "head_of_department",
      "head_of_year",
    ],
  },
  {
    id: "perm_view_student_performance",
    name: "View Student Performance",
    key: "teaching.view_performance",
    category: "Teaching",
    description: "Access student progress and performance data",
    roles: [
      "master_admin",
      "principal",
      "head_of_department",
      "head_of_year",
      "teacher",
      "cover_supervisor",
      "teaching_assistant",
      "safeguarding_lead",
      "senco",
      "careers_advisor",
    ],
  },

  // ==================== TIMETABLE ====================
  {
    id: "perm_view_timetable",
    name: "View Timetable",
    key: "timetable.view",
    category: "Timetable",
    description: "View class and teacher timetables",
    roles: [
      "master_admin",
      "it_admin",
      "principal",
      "slt_member",
      "head_of_department",
      "head_of_year",
      "examinations_officer",
      "teacher",
      "cover_supervisor",
      "teaching_assistant",
      "student",
      "student_leadership",
      "parent",
    ],
  },
  {
    id: "perm_edit_timetable",
    name: "Edit Timetable",
    key: "timetable.edit",
    category: "Timetable",
    description: "Modify the school timetable",
    roles: [
      "master_admin",
      "principal",
      "head_of_department",
      "examinations_officer",
    ],
  },
  {
    id: "perm_build_timetable",
    name: "Build Timetable",
    key: "timetable.build",
    category: "Timetable",
    description: "Create new timetable from scratch",
    roles: ["master_admin", "principal", "examinations_officer"],
  },

  // ==================== GRADEBOOK ====================
  {
    id: "perm_view_gradebook",
    name: "View Gradebook",
    key: "gradebook.view",
    category: "Gradebook",
    description: "View grade records",
    roles: [
      "master_admin",
      "principal",
      "data_manager",
      "head_of_department",
      "head_of_year",
      "examinations_officer",
      "teacher",
      "student",
      "student_leadership",
      "parent",
    ],
  },
  {
    id: "perm_edit_gradebook",
    name: "Edit Gradebook",
    key: "gradebook.edit",
    category: "Gradebook",
    description: "Enter and edit student grades",
    roles: [
      "master_admin",
      "teacher",
      "head_of_department",
      "examinations_officer",
    ],
  },
  {
    id: "perm_publish_grades",
    name: "Publish Grades",
    key: "gradebook.publish",
    category: "Gradebook",
    description: "Release grades to students and parents",
    roles: [
      "master_admin",
      "principal",
      "head_of_department",
      "examinations_officer",
    ],
  },

  // ==================== ANNOUNCEMENTS ====================
  {
    id: "perm_create_announcement",
    name: "Create Announcement",
    key: "announcement.create",
    category: "Communication",
    description: "Create and publish announcements",
    roles: [
      "master_admin",
      "it_admin",
      "principal",
      "slt_member",
      "head_of_department",
      "head_of_year",
      "teacher",
    ],
  },
  {
    id: "perm_view_announcement",
    name: "View Announcements",
    key: "announcement.view",
    category: "Communication",
    description: "View published announcements",
    roles: [
      "master_admin",
      "it_admin",
      "it_technician",
      "principal",
      "finance_manager",
      "hr_manager",
      "admissions_officer",
      "data_manager",
      "facilities_manager",
      "slt_member",
      "head_of_department",
      "head_of_year",
      "examinations_officer",
      "safeguarding_lead",
      "senco",
      "attendance_officer",
      "careers_advisor",
      "teacher",
      "cover_supervisor",
      "teaching_assistant",
      "librarian",
      "science_technician",
      "subject_technician",
      "student",
      "student_leadership",
      "parent",
      "support_staff",
    ],
  },
  {
    id: "perm_archive_announcement",
    name: "Archive Announcement",
    key: "announcement.archive",
    category: "Communication",
    description: "Archive old announcements",
    roles: ["master_admin", "principal", "head_of_department", "teacher"],
  },

  // ==================== MESSAGING ====================
  {
    id: "perm_send_message",
    name: "Send Messages",
    key: "message.send",
    category: "Communication",
    description: "Send direct messages to other users",
    roles: [
      "master_admin",
      "principal",
      "slt_member",
      "head_of_department",
      "head_of_year",
      "safeguarding_lead",
      "senco",
      "attendance_officer",
      "careers_advisor",
      "teacher",
      "cover_supervisor",
      "librarian",
      "support_staff",
      "student_leadership",
      "parent",
    ],
  },
  {
    id: "perm_view_all_messages",
    name: "View All Messages",
    key: "message.view_all",
    category: "Communication",
    description: "Access all system messages for moderation",
    roles: ["master_admin", "principal"],
  },

  // ==================== LIBRARY ====================
  {
    id: "perm_library_full_access",
    name: "Library Full Access",
    key: "library.full_access",
    category: "Library",
    description: "Complete library management access",
    roles: ["master_admin", "librarian"],
  },
  {
    id: "perm_manage_books",
    name: "Manage Books",
    key: "library.manage_books",
    category: "Library",
    description: "Add, edit, and remove books from catalog",
    roles: ["master_admin", "librarian"],
  },
  {
    id: "perm_issue_books",
    name: "Issue Books",
    key: "library.issue_books",
    category: "Library",
    description: "Issue and return library books",
    roles: ["master_admin", "librarian"],
  },
  {
    id: "perm_view_library_records",
    name: "View Library Records",
    key: "library.view_records",
    category: "Library",
    description: "View all borrowing history and fines",
    roles: ["master_admin", "librarian", "principal", "data_manager"],
  },
  {
    id: "perm_borrow_books",
    name: "Borrow Books",
    key: "library.borrow",
    category: "Library",
    description: "Borrow books from the library",
    roles: [
      "master_admin",
      "teacher",
      "cover_supervisor",
      "teaching_assistant",
      "librarian",
      "science_technician",
      "subject_technician",
      "student",
      "student_leadership",
    ],
    isConfigurable: true,
  },

  // ==================== REPORTS ====================
  {
    id: "perm_view_reports",
    name: "View Reports",
    key: "report.view",
    category: "Reports",
    description: "Access the reports module",
    roles: [
      "master_admin",
      "it_admin",
      "principal",
      "finance_manager",
      "hr_manager",
      "data_manager",
      "slt_member",
      "head_of_department",
      "head_of_year",
      "examinations_officer",
      "safeguarding_lead",
      "teacher",
      "student",
      "student_leadership",
      "parent",
    ],
  },
  {
    id: "perm_generate_reports",
    name: "Generate Reports",
    key: "report.generate",
    category: "Reports",
    description: "Generate new reports from system data",
    roles: [
      "master_admin",
      "principal",
      "data_manager",
      "slt_member",
      "head_of_department",
      "head_of_year",
      "examinations_officer",
      "teacher",
    ],
  },

  // ==================== STUDENT ACCESS (self-view) ====================
  {
    id: "perm_student_access",
    name: "Student Portal Access",
    key: "student.access",
    category: "Student Portal",
    description: "Access the student portal features",
    roles: ["student", "student_leadership"],
  },
  {
    id: "perm_view_assignments",
    name: "View Assignments",
    key: "student.view_assignments",
    category: "Student Portal",
    description: "View assigned work and due dates",
    roles: ["student", "student_leadership", "parent"],
  },
  {
    id: "perm_submit_work",
    name: "Submit Work",
    key: "student.submit_work",
    category: "Student Portal",
    description: "Submit assignment work for marking",
    roles: ["student", "student_leadership"],
  },
  {
    id: "perm_view_own_grades",
    name: "View Own Grades",
    key: "student.view_grades",
    category: "Student Portal",
    description: "View own grade records",
    roles: ["student", "student_leadership", "parent"],
  },
  {
    id: "perm_view_own_timetable",
    name: "View Own Timetable",
    key: "student.view_timetable",
    category: "Student Portal",
    description: "View personal class schedule",
    roles: ["student", "student_leadership"],
  },

  // ==================== PARENT ACCESS ====================
  {
    id: "perm_view_child_data",
    name: "View Child Data",
    key: "parent.view_child",
    category: "Parent Portal",
    description: "View own child's school records",
    roles: ["parent"],
  },
  {
    id: "perm_contact_teacher",
    name: "Contact Teacher",
    key: "parent.contact_teacher",
    category: "Parent Portal",
    description: "Send messages to the child's teachers",
    roles: ["parent"],
    isConfigurable: true,
  },
  {
    id: "perm_view_child_reports",
    name: "View Child Reports",
    key: "parent.view_reports",
    category: "Parent Portal",
    description: "View report cards and progress reports",
    roles: ["parent"],
  },
  {
    id: "perm_submit_tickets",
    name: "Submit Support Tickets",
    key: "parent.submit_tickets",
    category: "Parent Portal",
    description: "Raise support requests (admin-configurable)",
    roles: ["parent"],
    isConfigurable: true,
  },

  // ==================== ROLES & PERMISSIONS MANAGEMENT ====================
  {
    id: "perm_manage_roles",
    name: "Manage Roles & Permissions",
    key: "roles.manage",
    category: "System",
    description: "View and configure the permission matrix",
    roles: ["master_admin", "it_admin", "principal"],
  },
];

// ==================== CONFIGURABLE PERMISSIONS ====================

export const CONFIGURABLE_PERMISSIONS: Partial<Record<Role, string[]>> = {
  teacher: ["teaching.view_classes"],
  librarian: ["library.issue_books"],
  parent: ["parent.submit_tickets", "parent.contact_teacher", "library.borrow"],
  cover_supervisor: ["teaching.view_classes"],
  teaching_assistant: ["teaching.view_classes"],
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if a permission key is an "own-record" type
 * (student can access own data, parent can access child data)
 */
const OWN_RECORD_PERMISSIONS = new Set([
  "view.student.full",
  "view.student.contact",
  "view.student.academic",
  "student.view_assignments",
  "student.view_grades",
  "student.view_timetable",
  "student.access",
]);

const OWN_CHILD_PERMISSIONS = new Set([
  "parent.view_child",
  "parent.view_reports",
  "student.view_assignments",
  "student.view_grades",
  "parent.contact_teacher",
]);

export const isOwnPermission = (key: string): boolean =>
  OWN_RECORD_PERMISSIONS.has(key);
export const isOwnChildPermission = (key: string): boolean =>
  OWN_CHILD_PERMISSIONS.has(key);

/**
 * Check if a role has the given permission (basic check, no SLT)
 */
export const hasPermission = (
  role: Role,
  permissionKey: string,
  context?: {
    isOwnRecord?: boolean;
    isOwnChildRecord?: boolean;
    sltPermissions?: { isSLT?: boolean };
  },
): boolean => {
  const permission = DEFAULT_PERMISSIONS.find((p) => p.key === permissionKey);
  if (!permission) return false;

  const hasRoleAccess = permission.roles.includes(role);

  // SLT check: must also have isSLT flag
  if (permission.requiresSLT) {
    return hasRoleAccess && context?.sltPermissions?.isSLT === true;
  }

  // Context-aware own-record checks
  if (!hasRoleAccess) {
    if (role === "student" && isOwnPermission(permissionKey)) {
      return context?.isOwnRecord ?? false;
    }
    if (role === "parent" && isOwnChildPermission(permissionKey)) {
      return context?.isOwnChildRecord ?? false;
    }
  }

  return hasRoleAccess;
};

export const hasAnyPermission = (
  role: Role,
  permissionKeys: string[],
  context?: {
    isOwnRecord?: boolean;
    isOwnChildRecord?: boolean;
    sltPermissions?: { isSLT?: boolean };
  },
): boolean => {
  return permissionKeys.some((key) => hasPermission(role, key, context));
};

export const hasAllPermissions = (
  role: Role,
  permissionKeys: string[],
  context?: {
    isOwnRecord?: boolean;
    isOwnChildRecord?: boolean;
    sltPermissions?: { isSLT?: boolean };
  },
): boolean => {
  return permissionKeys.every((key) => hasPermission(role, key, context));
};

export const getRolePermissions = (role: Role): Permission[] => {
  return DEFAULT_PERMISSIONS.filter((p) => p.roles.includes(role));
};

export const getConfigurablePermissionsForRole = (role: Role): Permission[] => {
  const keys = CONFIGURABLE_PERMISSIONS[role] ?? [];
  return DEFAULT_PERMISSIONS.filter((p) => keys.includes(p.key));
};

export const getEffectivePermission = (
  permissionKey: string,
  role: Role,
  accessConfigs: AccessConfig[] = [],
): "allow" | "deny" => {
  // Check access config override first
  const override = accessConfigs.find(
    (c) => c.permissionKey === permissionKey && c.role === role,
  );
  if (override) return override.access;

  // Fall back to permission matrix
  const permission = DEFAULT_PERMISSIONS.find((p) => p.key === permissionKey);
  if (!permission) return "deny";
  return permission.roles.includes(role) ? "allow" : "deny";
};

export const createAccessConfig = (
  permissionKey: string,
  role: Role,
  access: "allow" | "deny",
  config?: Record<string, unknown>,
): AccessConfig => ({
  id: `ac_${Date.now()}_${Math.random().toString(36).slice(2)}`,
  permissionKey,
  role,
  access,
  config,
  updatedAt: new Date().toISOString(),
});

// Legacy alias kept for any existing consumers
export { DEFAULT_PERMISSIONS as permissions };
