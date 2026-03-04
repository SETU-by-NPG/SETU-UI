export type LeaveType =
  | "ANNUAL"
  | "SICK"
  | "COMPASSIONATE"
  | "TOIL"
  | "CPD"
  | "MATERNITY"
  | "PATERNITY";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type ContractType = "PERMANENT" | "FIXED_TERM" | "SUPPLY";
export type AppraisalRating =
  | "OUTSTANDING"
  | "GOOD"
  | "REQUIRES_IMPROVEMENT"
  | "INADEQUATE";
export type RecruitmentStatus =
  | "OPEN"
  | "SHORTLISTING"
  | "INTERVIEW"
  | "FILLED"
  | "CLOSED";

export interface LeaveRequest {
  id: string;
  staffId: string;
  organisationId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  coverRequired: boolean;
  coverArrangements?: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface Appraisal {
  id: string;
  staffId: string;
  organisationId: string;
  appraisalDate: string;
  nextDueDate: string;
  appraiserId: string;
  overallRating?: AppraisalRating;
  status: "SCHEDULED" | "COMPLETE" | "OVERDUE";
  objectives: string;
  evidence: string;
  developmentTargets: string;
  appraiserSigned: boolean;
  appraiseeSignedAt?: string;
  createdAt: string;
}

export interface CPDEntry {
  id: string;
  staffId: string;
  organisationId: string;
  courseName: string;
  provider: string;
  date: string;
  hours: number;
  certificateUploaded: boolean;
  cost?: number;
  subjectArea?: string;
  createdAt: string;
}

export interface JobPosting {
  id: string;
  organisationId: string;
  roleTitle: string;
  departmentId?: string;
  fte: number;
  contractType: ContractType;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  closingDate: string;
  jobDescription: string;
  internalExternal: "INTERNAL" | "EXTERNAL" | "BOTH";
  status: RecruitmentStatus;
  applicationsCount: number;
  createdAt: string;
}
