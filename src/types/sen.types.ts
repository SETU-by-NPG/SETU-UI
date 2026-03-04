import type { SENType } from "./student.types";

export type SENRecordStatus = "ACTIVE" | "GRADUATED" | "ARCHIVED";
export type ProvisionType =
  | "IN_CLASS_SUPPORT"
  | "SMALL_GROUP"
  | "ONE_TO_ONE"
  | "EXTERNAL"
  | "OTHER";
export type RAGStatus = "RED" | "AMBER" | "GREEN";
export type FundingSource = "SCHOOL" | "EHCP" | "OTHER";

export interface SENRecord {
  id: string;
  studentId: string;
  organisationId: string;
  senTypes: SENType[];
  hasEHCP: boolean;
  ehcpUrn?: string;
  dateAddedToRegister: string;
  keyWorkerIds: string[];
  presentingNeeds: string;
  strengths: string;
  agreedOutcomes: string;
  parentCarerViews: string;
  studentVoice: string;
  status: SENRecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SENTarget {
  id: string;
  senRecordId: string;
  description: string;
  successCriteria: string;
  strategies: string;
  responsibleStaff: string;
  targetDate: string;
  ragStatus: RAGStatus;
  progressNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SENProvision {
  id: string;
  senRecordId: string;
  provisionType: ProvisionType;
  subjectArea: string;
  frequency: string;
  duration: string;
  deliveryStaff: string;
  startDate: string;
  endDate?: string;
  fundedBy: FundingSource;
  cost?: number;
  createdAt: string;
}

export interface SENReview {
  id: string;
  senRecordId: string;
  reviewType: "ANNUAL" | "INTERIM" | "EMERGENCY";
  reviewDate: string;
  attendees: string[];
  outcomes: string;
  planUpdated: boolean;
  nextReviewDate: string;
  createdAt: string;
}
