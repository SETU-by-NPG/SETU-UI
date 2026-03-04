export type SafeguardingRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type SafeguardingCategory =
  | "CHILD_PROTECTION"
  | "CHILD_IN_NEED"
  | "EARLY_HELP"
  | "LOOKED_AFTER_CHILD"
  | "FGM"
  | "CSE"
  | "RADICALISATION"
  | "DOMESTIC_ABUSE"
  | "SELF_HARM"
  | "OTHER";
export type SafeguardingCaseStatus =
  | "OPEN"
  | "CLOSED"
  | "MONITORING"
  | "REFERRED";
export type ChronologyEntryType =
  | "CONCERN"
  | "MEETING"
  | "REFERRAL"
  | "REVIEW"
  | "STRATEGY_DISCUSSION"
  | "HOME_VISIT"
  | "PHONE_CALL"
  | "OTHER";

export interface SafeguardingCase {
  id: string;
  organisationId: string;
  studentId: string;
  category: SafeguardingCategory;
  riskLevel: SafeguardingRiskLevel;
  leadProfessional: string;
  openDate: string;
  nextReviewDate: string;
  status: SafeguardingCaseStatus;
  concernSummary: string;
  parentAware: boolean;
  linkedSiblingIds: string[];
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SafeguardingChronologyEntry {
  id: string;
  caseId: string;
  entryType: ChronologyEntryType;
  description: string;
  staffPresent: string[];
  isConfidential: boolean;
  addedBy: string;
  attachmentNames: string[];
  entryDate: string;
  entryTime?: string;
  createdAt: string;
}

export interface SafeguardingAction {
  id: string;
  caseId: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "COMPLETE";
  completedDate?: string;
  notes?: string;
  createdAt: string;
}

export interface SafeguardingReferral {
  id: string;
  caseId: string;
  referralDate: string;
  referredTo: string;
  referralType: string;
  outcome?: string;
  responseDate?: string;
  status: "PENDING" | "RESPONDED" | "CLOSED";
  createdAt: string;
}

export interface SafeguardingTraining {
  id: string;
  staffId: string;
  organisationId: string;
  trainingLevel: "LEVEL_1" | "LEVEL_2" | "DSL";
  completionDate: string;
  provider: string;
  certificateName?: string;
  expiryDate: string;
  createdAt: string;
}
