export interface Organisation {
  id: string;
  name: string;
  type: string;
  location: string;
  subdomain: string;
  logoInitials: string;
  email: string;
  phone: string;
  website: string;
  address: {
    line1: string;
    city: string;
    postcode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AcademicYear {
  id: string;
  organisationId: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  createdAt: string;
}

export interface Term {
  id: string;
  academicYearId: string;
  organisationId: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface YearGroup {
  id: string;
  organisationId: string;
  name: string;
  numericYear: number;
  headOfYearId: string;
  createdAt: string;
}

export interface Class {
  id: string;
  organisationId: string;
  name: string;
  yearGroupId: string;
  formTutorId: string;
  room: string;
  academicYearId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  organisationId: string;
  name: string;
  headOfDepartmentId: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  organisationId: string;
  name: string;
  code: string;
  departmentId: string;
  color: string;
  createdAt: string;
}

export type PeriodType = "LESSON" | "BREAK" | "LUNCH";

export interface Period {
  id: string;
  organisationId: string;
  name: string;
  type: PeriodType;
  startTime: string;
  endTime: string;
  order: number;
}

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY";

export interface TimetableSlot {
  id: string;
  organisationId: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  roomId: string;
  periodId: string;
  dayOfWeek: DayOfWeek;
  academicYearId: string;
  termId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassEnrollment {
  id: string;
  studentId: string;
  classId: string;
  academicYearId: string;
  enrolledAt: string;
  withdrawnAt?: string;
}
