import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG: Record<
  string,
  {
    variant:
      | "default"
      | "success"
      | "warning"
      | "destructive"
      | "info"
      | "ghost"
      | "purple";
    label?: string;
  }
> = {
  // Student / staff
  ACTIVE: { variant: "success", label: "Active" },
  INACTIVE: { variant: "ghost", label: "Inactive" },
  SUSPENDED: { variant: "destructive", label: "Suspended" },
  WITHDRAWN: { variant: "ghost", label: "Withdrawn" },
  LOCKED: { variant: "destructive", label: "Locked" },
  // Attendance
  PRESENT: { variant: "success", label: "Present" },
  ABSENT: { variant: "destructive", label: "Absent" },
  LATE: { variant: "destructive", label: "Late" },
  EXCUSED: { variant: "info", label: "Excused" },
  // Incidents
  OPEN: { variant: "warning", label: "Open" },
  IN_PROGRESS: { variant: "info", label: "In Progress" },
  RESOLVED: { variant: "success", label: "Resolved" },
  // Assignments / submissions
  SUBMITTED: { variant: "success", label: "Submitted" },
  PENDING: { variant: "warning", label: "Pending" },
  GRADED: { variant: "info", label: "Graded" },
  RETURNED: { variant: "success", label: "Returned" },
  // SEN / Safeguarding
  HIGH: { variant: "destructive", label: "High" },
  MEDIUM: { variant: "warning", label: "Medium" },
  LOW: { variant: "success", label: "Low" },
  CRITICAL: { variant: "destructive", label: "Critical" },
  // Leave
  APPROVED: { variant: "success", label: "Approved" },
  REJECTED: { variant: "destructive", label: "Rejected" },
  CANCELLED: { variant: "ghost", label: "Cancelled" },
  // Finance
  PAID: { variant: "success", label: "Paid" },
  UNPAID: { variant: "warning", label: "Unpaid" },
  OVERDUE: { variant: "destructive", label: "Overdue" },
  VOID: { variant: "ghost", label: "Void" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { variant: "ghost" as const };
  return (
    <Badge variant={config.variant} className={className}>
      {config.label ?? status.replace(/_/g, " ")}
    </Badge>
  );
}
