export type RoomType =
  | "CLASSROOM"
  | "SCIENCE_LAB"
  | "ICT_SUITE"
  | "SPORTS_HALL"
  | "MEETING_ROOM"
  | "LIBRARY"
  | "HALL"
  | "OTHER";
export type RoomStatus = "AVAILABLE" | "IN_USE" | "UNDER_MAINTENANCE";
export type MaintenancePriority = "ROUTINE" | "URGENT" | "EMERGENCY";
export type MaintenanceStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "AWAITING_PARTS"
  | "COMPLETE";
export type MaintenanceIssueType =
  | "ELECTRICAL"
  | "PLUMBING"
  | "HEATING"
  | "IT"
  | "FURNITURE"
  | "SAFETY"
  | "OTHER";
export type VisitorPurpose =
  | "GOVERNOR"
  | "CONTRACTOR"
  | "PARENT"
  | "EXTERNAL_AGENCY"
  | "INTERVIEW"
  | "OTHER";

export interface Room {
  id: string;
  organisationId: string;
  name: string;
  roomNumber: string;
  type: RoomType;
  capacity: number;
  floor: string;
  building: string;
  status: RoomStatus;
  hasProjector: boolean;
  hasWhiteboard: boolean;
  hasLaptopTrolley: boolean;
  createdAt: string;
}

export interface RoomBooking {
  id: string;
  organisationId: string;
  roomId: string;
  bookedBy: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  groupClass?: string;
  equipmentRequired: string[];
  createdAt: string;
}

export interface MaintenanceRequest {
  id: string;
  organisationId: string;
  roomId?: string;
  locationDescription: string;
  issueType: MaintenanceIssueType;
  description: string;
  reportedBy: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  assignedTo?: string;
  cost?: number;
  photoNames: string[];
  updates: MaintenanceUpdate[];
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceUpdate {
  id: string;
  requestId: string;
  updatedBy: string;
  update: string;
  createdAt: string;
}

export interface Visitor {
  id: string;
  organisationId: string;
  visitorName: string;
  companyRelationship?: string;
  hostStaffId: string;
  purpose: VisitorPurpose;
  expectedArrival?: string;
  signInTime?: string;
  signOutTime?: string;
  badgeNumber?: string;
  badgeIssued: boolean;
  idChecked: boolean;
  dbsRequired: boolean;
  createdAt: string;
}

export interface SafetyAudit {
  id: string;
  organisationId: string;
  auditorId: string;
  completedAt: string;
  totalItems: number;
  passCount: number;
  issuesFound: number;
  sections: SafetyAuditSection[];
}

export interface SafetyAuditSection {
  name: string;
  items: SafetyAuditItem[];
}

export interface SafetyAuditItem {
  description: string;
  result: "PASS" | "FAIL" | "NA";
  notes?: string;
  lastChecked: string;
}
