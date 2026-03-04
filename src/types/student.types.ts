import type { Address } from "./user.types";

export type StudentStatus = "ACTIVE" | "WITHDRAWN" | "GRADUATED" | "ARCHIVED";
export type Gender = "MALE" | "FEMALE" | "NON_BINARY" | "PREFER_NOT_TO_SAY";
export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-"
  | "UNKNOWN";
export type SENType =
  | "ADHD"
  | "ASD"
  | "DYSLEXIA"
  | "EAL"
  | "HI"
  | "VI"
  | "MLD"
  | "SLD"
  | "SEMH"
  | "OTHER";
export type GuardianRelationship =
  | "MOTHER"
  | "FATHER"
  | "GUARDIAN"
  | "GRANDPARENT"
  | "SIBLING"
  | "OTHER";

export interface Student {
  id: string;
  userId: string;
  organisationId: string;
  rollNumber: string;
  admissionNumber: string;
  dateOfBirth: string;
  gender: Gender;
  nationality?: string;
  ethnicity?: string;
  religion?: string;
  bloodGroup?: BloodGroup;
  address?: Address;
  medicalConditions?: string;
  allergies?: string[];
  hasSEN: boolean;
  senTypes?: SENType[];
  hasEHCP: boolean;
  enrollmentDate: string;
  status: StudentStatus;
  previousSchool?: string;
  fsmEligible: boolean;
  pupilPremium: boolean;
  lookedAfterChild: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Guardian {
  id: string;
  userId: string;
  organisationId: string;
  relationship: GuardianRelationship;
  occupation?: string;
  createdAt: string;
}

export interface StudentGuardian {
  id: string;
  studentId: string;
  guardianId: string;
  isPrimary: boolean;
  hasPortalAccess: boolean;
}

export interface Staff {
  id: string;
  userId: string;
  organisationId: string;
  employeeId: string;
  jobTitle: string;
  departmentId?: string;
  lineManagerId?: string;
  hireDate: string;
  contractType: "PERMANENT" | "FIXED_TERM" | "SUPPLY";
  fte: number;
  qualifications: string[];
  qtsStatus: boolean;
  dbsNumber?: string;
  dbsExpiryDate?: string;
  subjects: string[];
  assignedClasses: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
