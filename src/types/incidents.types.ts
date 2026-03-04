export type IncidentType =
  | "BEHAVIOUR"
  | "BULLYING"
  | "UNIFORM"
  | "EQUIPMENT"
  | "LATE_TO_LESSON"
  | "SAFEGUARDING_CONCERN"
  | "REWARD"
  | "OTHER";
export type IncidentSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IncidentStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
export type IncidentLocation =
  | "CLASSROOM"
  | "CORRIDOR"
  | "PLAYGROUND"
  | "CANTEEN"
  | "TOILET"
  | "OFF_SITE"
  | "OTHER";

export interface Incident {
  id: string;
  organisationId: string;
  studentId: string;
  reportedBy: string;
  incidentType: IncidentType;
  severity: IncidentSeverity;
  description: string;
  location: IncidentLocation;
  witnesses: string[];
  actionTaken?: string;
  assignedTo: string;
  status: IncidentStatus;
  parentNotified: boolean;
  parentNotifiedAt?: string;
  occurredAt: string;
  resolvedAt?: string;
  sanctions?: string;
  followUpRequired: boolean;
  followUpDueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentUpdate {
  id: string;
  incidentId: string;
  updatedBy: string;
  update: string;
  createdAt: string;
}

export interface RewardEntry {
  id: string;
  organisationId: string;
  studentId: string;
  awardedBy: string;
  awardType: "ACHIEVEMENT" | "EFFORT" | "CITIZENSHIP" | "OTHER";
  points?: number;
  description: string;
  date: string;
  createdAt: string;
}
