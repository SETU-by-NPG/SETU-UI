export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "VIEW"
  | "LOGIN"
  | "LOGOUT"
  | "EXPORT"
  | "IMPORT";
export type ServiceStatus = "OPERATIONAL" | "DOWN" | "DEGRADED";

export interface AuditLog {
  id: string;
  organisationId: string;
  userId: string;
  userRole: string;
  action: AuditAction;
  module: string;
  entityType: string;
  entityId: string;
  description: string;
  changes?: Record<string, unknown>;
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
}

export interface SystemHealth {
  cpuUsage: number;
  memoryUsedGb: number;
  memoryTotalGb: number;
  diskUsedTb: number;
  diskTotalTb: number;
  networkIn: string;
  networkOut: string;
  uptime: string;
  services: SystemService[];
  recentEvents: SystemEvent[];
}

export interface SystemService {
  name: string;
  status: ServiceStatus;
  responseTime?: number;
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  type: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  message: string;
  service: string;
}

export interface BackupRecord {
  id: string;
  organisationId: string;
  type: "FULL" | "INCREMENTAL";
  sizeGb: number;
  durationMinutes: number;
  status: "COMPLETED" | "FAILED" | "IN_PROGRESS";
  integrityCheck: "PASS" | "FAIL" | "PENDING";
  createdAt: string;
}

export interface SecurityEvent {
  id: string;
  organisationId: string;
  eventType:
    | "ROLE_CHANGE"
    | "PERMISSION_CHANGE"
    | "PASSWORD_RESET"
    | "ACCOUNT_CREATED"
    | "ACCOUNT_DELETED"
    | "SSO_CONNECTED"
    | "MFA_DISABLED";
  performedBy: string;
  targetUserId: string;
  ipAddress: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
}

export interface ActiveSession {
  id: string;
  userId: string;
  organisationId: string;
  loginTime: string;
  lastActivity: string;
  ipAddress: string;
  device: string;
  browser: string;
  location: string;
  isCurrentSession: boolean;
}

export interface FailedLogin {
  id: string;
  emailAttempted: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  failureReason: "INVALID_PASSWORD" | "ACCOUNT_LOCKED" | "MFA_FAILED";
}
