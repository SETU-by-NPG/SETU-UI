export type Role =
  | "MASTER_ADMIN"
  | "IT_ADMINISTRATOR"
  | "IT_TECHNICIAN"
  | "HEAD_OF_SCHOOL"
  | "FINANCE_MANAGER"
  | "HR_MANAGER"
  | "ADMISSIONS_OFFICER"
  | "DATA_MANAGER"
  | "FACILITIES_MANAGER"
  | "SLT_MEMBER"
  | "HEAD_OF_DEPARTMENT"
  | "HEAD_OF_YEAR"
  | "EXAMINATIONS_OFFICER"
  | "SAFEGUARDING_LEAD"
  | "SENCO"
  | "ATTENDANCE_WELFARE_OFFICER"
  | "CAREERS_ADVISOR"
  | "TEACHER"
  | "COVER_SUPERVISOR"
  | "TEACHING_ASSISTANT"
  | "LIBRARIAN"
  | "SCIENCE_TECHNICIAN"
  | "SUBJECT_TECHNICIAN"
  | "STUDENT"
  | "STUDENT_LEADERSHIP"
  | "PARENT"
  | "SUPPORT_STAFF";

export interface AuthUser {
  userId: string;
  role: Role;
  name: string;
  email: string;
  avatarInitials: string;
  schoolId: string;
  mfaEnabled: boolean;
  linkedStudentIds: string[];
  assignedYearGroupId: string | null;
  assignedDepartmentId: string | null;
  assignedClassIds: string[];
}

export interface DemoUser {
  email: string;
  password: string;
  role: Role;
  userId: string;
  name: string;
  avatarInitials: string;
}
