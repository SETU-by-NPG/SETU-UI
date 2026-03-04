import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  FileDown,
  FileText,
  LogIn,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Upload,
  Download,
  KeyRound,
  ShieldOff,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "VIEW"
  | "EXPORT"
  | "IMPORT"
  | "ACCESS_DENIED"
  | "PASSWORD_CHANGE";

type AuditStatus = "SUCCESS" | "FAILURE" | "BLOCKED";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: AuditAction;
  module: string;
  resourceId: string;
  ipAddress: string;
  details: string;
  status: AuditStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_AUDIT_LOGS: AuditEntry[] = [
  {
    id: "a01",
    timestamp: "2026-03-04 08:02:14",
    user: "Sarah Johnson",
    role: "MASTER_ADMIN",
    action: "LOGIN",
    module: "Auth",
    resourceId: "session-001",
    ipAddress: "10.0.0.5",
    details: "Successful login via MFA",
    status: "SUCCESS",
  },
  {
    id: "a02",
    timestamp: "2026-03-04 08:05:33",
    user: "Sarah Johnson",
    role: "MASTER_ADMIN",
    action: "VIEW",
    module: "Safeguarding",
    resourceId: "case-2041",
    ipAddress: "10.0.0.5",
    details: "Viewed safeguarding case",
    status: "SUCCESS",
  },
  {
    id: "a03",
    timestamp: "2026-03-04 08:11:07",
    user: "Michael Chen",
    role: "HEAD_OF_SCHOOL",
    action: "LOGIN",
    module: "Auth",
    resourceId: "session-002",
    ipAddress: "10.0.0.7",
    details: "Successful login",
    status: "SUCCESS",
  },
  {
    id: "a04",
    timestamp: "2026-03-04 08:21:44",
    user: "Unknown",
    role: "N/A",
    action: "ACCESS_DENIED",
    module: "Finance",
    resourceId: "report-budget",
    ipAddress: "192.168.3.77",
    details: "Unauthorised access attempt to Finance module",
    status: "BLOCKED",
  },
  {
    id: "a05",
    timestamp: "2026-03-04 08:29:55",
    user: "Emma Williams",
    role: "TEACHER",
    action: "CREATE",
    module: "Attendance",
    resourceId: "att-20260304-7A",
    ipAddress: "192.168.1.22",
    details: "Marked attendance for class 7A",
    status: "SUCCESS",
  },
  {
    id: "a06",
    timestamp: "2026-03-04 08:35:10",
    user: "Omar Rashid",
    role: "DATA_MANAGER",
    action: "EXPORT",
    module: "Students",
    resourceId: "bulk-export-001",
    ipAddress: "10.0.0.8",
    details: "Exported 312 student records to CSV",
    status: "SUCCESS",
  },
  {
    id: "a07",
    timestamp: "2026-03-04 08:41:22",
    user: "Priya Patel",
    role: "HR_MANAGER",
    action: "UPDATE",
    module: "HR",
    resourceId: "staff-098",
    ipAddress: "10.0.0.15",
    details: "Updated staff contract — J. Davies",
    status: "SUCCESS",
  },
  {
    id: "a08",
    timestamp: "2026-03-04 08:50:01",
    user: "James Davies",
    role: "TEACHER",
    action: "PASSWORD_CHANGE",
    module: "Auth",
    resourceId: "user-098",
    ipAddress: "192.168.1.50",
    details: "Password changed by user",
    status: "SUCCESS",
  },
  {
    id: "a09",
    timestamp: "2026-03-04 09:02:40",
    user: "Laura Singh",
    role: "ADMISSIONS_OFFICER",
    action: "CREATE",
    module: "Admissions",
    resourceId: "app-2026-487",
    ipAddress: "10.0.0.22",
    details: "New admissions application created",
    status: "SUCCESS",
  },
  {
    id: "a10",
    timestamp: "2026-03-04 09:10:18",
    user: "Unknown",
    role: "N/A",
    action: "LOGIN",
    module: "Auth",
    resourceId: "N/A",
    ipAddress: "86.12.44.200",
    details: "Failed login — invalid password (3rd attempt)",
    status: "FAILURE",
  },
  {
    id: "a11",
    timestamp: "2026-03-04 09:15:55",
    user: "Sarah Johnson",
    role: "MASTER_ADMIN",
    action: "DELETE",
    module: "Users",
    resourceId: "user-312",
    ipAddress: "10.0.0.5",
    details: "Deleted inactive user account — t.harris@setu.edu",
    status: "SUCCESS",
  },
  {
    id: "a12",
    timestamp: "2026-03-04 09:22:00",
    user: "Benjamin Clark",
    role: "FINANCE_MANAGER",
    action: "VIEW",
    module: "Finance",
    resourceId: "budget-2025-26",
    ipAddress: "10.0.0.30",
    details: "Viewed 2025/26 budget overview",
    status: "SUCCESS",
  },
  {
    id: "a13",
    timestamp: "2026-03-04 09:28:34",
    user: "Benjamin Clark",
    role: "FINANCE_MANAGER",
    action: "UPDATE",
    module: "Finance",
    resourceId: "invoice-4421",
    ipAddress: "10.0.0.30",
    details: "Updated invoice status to Paid",
    status: "SUCCESS",
  },
  {
    id: "a14",
    timestamp: "2026-03-04 09:35:44",
    user: "Fatima Nour",
    role: "SAFEGUARDING_LEAD",
    action: "CREATE",
    module: "Safeguarding",
    resourceId: "case-2055",
    ipAddress: "10.0.0.18",
    details: "New safeguarding case opened",
    status: "SUCCESS",
  },
  {
    id: "a15",
    timestamp: "2026-03-04 09:40:11",
    user: "Ryan Mitchell",
    role: "IT_ADMINISTRATOR",
    action: "IMPORT",
    module: "Users",
    resourceId: "bulk-import-002",
    ipAddress: "10.0.0.4",
    details: "Bulk imported 24 new staff accounts",
    status: "SUCCESS",
  },
  {
    id: "a16",
    timestamp: "2026-03-04 09:48:30",
    user: "Emma Williams",
    role: "TEACHER",
    action: "UPDATE",
    module: "Grades",
    resourceId: "grade-7A-maths-T2",
    ipAddress: "192.168.1.22",
    details: "Updated term 2 mathematics grades for 7A",
    status: "SUCCESS",
  },
  {
    id: "a17",
    timestamp: "2026-03-04 09:55:20",
    user: "Unknown",
    role: "N/A",
    action: "ACCESS_DENIED",
    module: "Safeguarding",
    resourceId: "case-2041",
    ipAddress: "192.168.5.90",
    details: "Attempt to access safeguarding without privilege",
    status: "BLOCKED",
  },
  {
    id: "a18",
    timestamp: "2026-03-04 10:02:00",
    user: "Olusegun Adeyemi",
    role: "SENCO",
    action: "VIEW",
    module: "SEN",
    resourceId: "sen-profile-156",
    ipAddress: "10.0.0.19",
    details: "Viewed SEN profile for student S-156",
    status: "SUCCESS",
  },
  {
    id: "a19",
    timestamp: "2026-03-04 10:08:44",
    user: "Priya Patel",
    role: "HR_MANAGER",
    action: "EXPORT",
    module: "HR",
    resourceId: "hr-census-2026",
    ipAddress: "10.0.0.15",
    details: "Exported workforce census data",
    status: "SUCCESS",
  },
  {
    id: "a20",
    timestamp: "2026-03-04 10:15:12",
    user: "Michael Chen",
    role: "HEAD_OF_SCHOOL",
    action: "VIEW",
    module: "Leadership",
    resourceId: "dashboard-overview",
    ipAddress: "10.0.0.7",
    details: "Viewed SLT leadership dashboard",
    status: "SUCCESS",
  },
  {
    id: "a21",
    timestamp: "2026-03-04 10:22:55",
    user: "Sarah Johnson",
    role: "MASTER_ADMIN",
    action: "UPDATE",
    module: "Settings",
    resourceId: "settings-mfa",
    ipAddress: "10.0.0.5",
    details: "Enabled mandatory MFA for admin roles",
    status: "SUCCESS",
  },
  {
    id: "a22",
    timestamp: "2026-03-04 10:30:07",
    user: "Laura Singh",
    role: "ADMISSIONS_OFFICER",
    action: "UPDATE",
    module: "Admissions",
    resourceId: "app-2026-487",
    ipAddress: "10.0.0.22",
    details: "Application status updated to Shortlisted",
    status: "SUCCESS",
  },
  {
    id: "a23",
    timestamp: "2026-03-04 10:38:19",
    user: "Ryan Mitchell",
    role: "IT_ADMINISTRATOR",
    action: "LOGOUT",
    module: "Auth",
    resourceId: "session-015",
    ipAddress: "10.0.0.4",
    details: "User logged out",
    status: "SUCCESS",
  },
  {
    id: "a24",
    timestamp: "2026-03-04 10:45:33",
    user: "Daniel Okonkwo",
    role: "TEACHER",
    action: "CREATE",
    module: "Incidents",
    resourceId: "inc-2026-334",
    ipAddress: "192.168.1.88",
    details: "New behaviour incident recorded",
    status: "SUCCESS",
  },
  {
    id: "a25",
    timestamp: "2026-03-04 10:52:44",
    user: "Unknown",
    role: "N/A",
    action: "LOGIN",
    module: "Auth",
    resourceId: "N/A",
    ipAddress: "45.88.12.5",
    details: "Failed login — account locked",
    status: "FAILURE",
  },
  {
    id: "a26",
    timestamp: "2026-03-04 11:01:00",
    user: "Benjamin Clark",
    role: "FINANCE_MANAGER",
    action: "CREATE",
    module: "Finance",
    resourceId: "budget-line-789",
    ipAddress: "10.0.0.30",
    details: "New budget line item added",
    status: "SUCCESS",
  },
  {
    id: "a27",
    timestamp: "2026-03-04 11:10:22",
    user: "Fatima Nour",
    role: "SAFEGUARDING_LEAD",
    action: "UPDATE",
    module: "Safeguarding",
    resourceId: "case-2055",
    ipAddress: "10.0.0.18",
    details: "Safeguarding case updated with new evidence",
    status: "SUCCESS",
  },
  {
    id: "a28",
    timestamp: "2026-03-04 11:18:55",
    user: "Sarah Johnson",
    role: "MASTER_ADMIN",
    action: "VIEW",
    module: "Audit Logs",
    resourceId: "audit-log-viewer",
    ipAddress: "10.0.0.5",
    details: "Accessed audit log viewer",
    status: "SUCCESS",
  },
  {
    id: "a29",
    timestamp: "2026-03-04 11:25:34",
    user: "Olusegun Adeyemi",
    role: "SENCO",
    action: "UPDATE",
    module: "SEN",
    resourceId: "sen-profile-156",
    ipAddress: "10.0.0.19",
    details: "Updated EHCP targets for student S-156",
    status: "SUCCESS",
  },
  {
    id: "a30",
    timestamp: "2026-03-04 11:30:00",
    user: "Omar Rashid",
    role: "DATA_MANAGER",
    action: "IMPORT",
    module: "Examinations",
    resourceId: "exam-results-summer-2026",
    ipAddress: "10.0.0.8",
    details: "Imported summer 2026 examination results",
    status: "SUCCESS",
  },
];

const ALL_MODULES = [
  "All Modules",
  ...Array.from(new Set(MOCK_AUDIT_LOGS.map((l) => l.module))).sort(),
];
const ALL_ACTIONS: string[] = [
  "All Actions",
  "LOGIN",
  "LOGOUT",
  "CREATE",
  "UPDATE",
  "DELETE",
  "VIEW",
  "EXPORT",
  "IMPORT",
  "ACCESS_DENIED",
  "PASSWORD_CHANGE",
];
const ALL_ROLES = [
  "All Roles",
  ...Array.from(new Set(MOCK_AUDIT_LOGS.map((l) => l.role)))
    .filter((r) => r !== "N/A")
    .sort(),
];

// ─── Action badge config ───────────────────────────────────────────────────────

const actionBadge: Record<AuditAction, string> = {
  LOGIN: "bg-blue-100 text-blue-700 border-blue-200",
  LOGOUT: "bg-blue-50 text-blue-500 border-blue-100",
  CREATE: "bg-green-100 text-green-700 border-green-200",
  UPDATE: "bg-amber-100 text-amber-700 border-amber-200",
  DELETE: "bg-red-100 text-red-700 border-red-200",
  VIEW: "bg-gray-100 text-gray-600 border-gray-200",
  EXPORT: "bg-purple-100 text-purple-700 border-purple-200",
  IMPORT: "bg-indigo-100 text-indigo-700 border-indigo-200",
  ACCESS_DENIED: "bg-red-100 text-red-800 border-red-300 font-bold",
  PASSWORD_CHANGE: "bg-teal-100 text-teal-700 border-teal-200",
};

const actionIcon: Record<AuditAction, React.ElementType> = {
  LOGIN: LogIn,
  LOGOUT: LogOut,
  CREATE: Plus,
  UPDATE: Pencil,
  DELETE: Trash2,
  VIEW: Eye,
  EXPORT: Download,
  IMPORT: Upload,
  ACCESS_DENIED: ShieldOff,
  PASSWORD_CHANGE: KeyRound,
};

const statusBadge: Record<AuditStatus, string> = {
  SUCCESS: "bg-green-100 text-green-700 border-green-200",
  FAILURE: "bg-red-100 text-red-700 border-red-200",
  BLOCKED: "bg-orange-100 text-orange-700 border-orange-200",
};

// ─── Table columns ────────────────────────────────────────────────────────────

const columns: ColumnDef<AuditEntry>[] = [
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-gray-600 whitespace-nowrap">
        {row.original.timestamp}
      </span>
    ),
    size: 160,
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-gray-800">{row.original.user}</p>
        <p className="text-xs text-gray-400">
          {row.original.role.replace(/_/g, " ")}
        </p>
      </div>
    ),
    size: 180,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.original.action;
      const ActionIcon = actionIcon[action];
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]",
            actionBadge[action],
          )}
        >
          <ActionIcon className="h-3 w-3" />
          {action.replace("_", " ")}
        </span>
      );
    },
    size: 140,
  },
  {
    accessorKey: "module",
    header: "Module",
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-[11px]">
        {row.original.module}
      </Badge>
    ),
    size: 120,
  },
  {
    accessorKey: "resourceId",
    header: "Resource ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-gray-500">
        {row.original.resourceId}
      </span>
    ),
    size: 140,
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-gray-600">
        {row.original.ipAddress}
      </span>
    ),
    size: 130,
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => (
      <span
        className="text-xs text-gray-600 max-w-[260px] block truncate"
        title={row.original.details}
      >
        {row.original.details}
      </span>
    ),
    size: 260,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const st = row.original.status;
      return (
        <span
          className={cn(
            "inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium",
            statusBadge[st],
          )}
        >
          {st}
        </span>
      );
    },
    size: 90,
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AuditLogsPage() {
  const [dateFrom, setDateFrom] = useState("2026-03-04");
  const [dateTo, setDateTo] = useState("2026-03-04");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [moduleFilter, setModuleFilter] = useState("All Modules");

  const filtered = useMemo(() => {
    return MOCK_AUDIT_LOGS.filter((log) => {
      const logDate = log.timestamp.split(" ")[0];
      if (dateFrom && logDate < dateFrom) return false;
      if (dateTo && logDate > dateTo) return false;
      if (actionFilter !== "All Actions" && log.action !== actionFilter)
        return false;
      if (roleFilter !== "All Roles" && log.role !== roleFilter) return false;
      if (moduleFilter !== "All Modules" && log.module !== moduleFilter)
        return false;
      return true;
    });
  }, [dateFrom, dateTo, actionFilter, roleFilter, moduleFilter]);

  const handleExport = () => {
    const headers = [
      "Timestamp",
      "User",
      "Role",
      "Action",
      "Module",
      "Resource ID",
      "IP Address",
      "Details",
      "Status",
    ];
    const rows = filtered.map((l) =>
      [
        l.timestamp,
        l.user,
        l.role,
        l.action,
        l.module,
        l.resourceId,
        l.ipAddress,
        `"${l.details}"`,
        l.status,
      ].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${dateFrom}-${dateTo}.csv`;
    a.click();
    toast.success(`Exported ${filtered.length} audit entries to CSV`);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Audit Logs"
        subtitle={`Showing ${filtered.length} of ${MOCK_AUDIT_LOGS.length} entries`}
        icon={FileText}
        iconColor="bg-slate-600"
        actions={[
          {
            label: "Export CSV",
            onClick: handleExport,
            icon: FileDown,
            variant: "outline",
          },
        ]}
      />

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Filter Bar */}
        <Card className="p-4">
          <div className="flex items-end gap-3 flex-wrap">
            <Filter className="h-4 w-4 text-gray-400 mb-2 shrink-0" />

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-gray-500">Date From</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-8 text-sm w-36"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-gray-500">Date To</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-8 text-sm w-36"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-gray-500">Action Type</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="h-8 w-40 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_ACTIONS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-gray-500">Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-8 w-44 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-gray-500">Module</Label>
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="h-8 w-40 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_MODULES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-gray-500"
              onClick={() => {
                setDateFrom("2026-03-04");
                setDateTo("2026-03-04");
                setActionFilter("All Actions");
                setRoleFilter("All Roles");
                setModuleFilter("All Modules");
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Summary Chips */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-gray-400">Results:</span>
            <span className="text-xs font-semibold text-gray-700 bg-gray-100 rounded-full px-2 py-0.5">
              {filtered.length} entries
            </span>
            <span className="text-xs text-gray-400">
              (of {MOCK_AUDIT_LOGS.length} total)
            </span>
            {filtered.filter(
              (l) => l.status === "FAILURE" || l.status === "BLOCKED",
            ).length > 0 && (
              <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-full px-2 py-0.5">
                {
                  filtered.filter(
                    (l) => l.status === "FAILURE" || l.status === "BLOCKED",
                  ).length
                }{" "}
                failures / blocked
              </span>
            )}
          </div>
        </Card>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filtered}
          searchPlaceholder="Search logs…"
          pageSize={15}
          emptyMessage="No audit entries match the selected filters."
          rowClassName={(row) =>
            row.status === "BLOCKED" || row.action === "ACCESS_DENIED"
              ? "bg-red-50/40"
              : row.status === "FAILURE"
                ? "bg-amber-50/40"
                : ""
          }
        />
      </div>
    </div>
  );
}
