import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  UserPlus,
  Upload,
  Users,
  Lock,
  Unlock,
  KeyRound,
  Pencil,
  ShieldCheck,
  ShieldOff,
  CheckCircle2,
  XCircle,
  Loader2,
  UserCog,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserStatus = "Active" | "Inactive" | "Locked";

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  yearGroup?: string;
  lastLogin: string;
  status: UserStatus;
  mfaEnabled: boolean;
  avatarInitials: string;
  avatarColor: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-rose-500",
];

const MOCK_USERS: ManagedUser[] = [
  {
    id: "u01",
    name: "Sarah Johnson",
    email: "s.johnson@setu.edu",
    role: "MASTER_ADMIN",
    lastLogin: "2 min ago",
    status: "Active",
    mfaEnabled: true,
    avatarInitials: "SJ",
    avatarColor: AVATAR_COLORS[0],
  },
  {
    id: "u02",
    name: "Michael Chen",
    email: "m.chen@setu.edu",
    role: "HEAD_OF_SCHOOL",
    lastLogin: "5 min ago",
    status: "Active",
    mfaEnabled: true,
    avatarInitials: "MC",
    avatarColor: AVATAR_COLORS[1],
  },
  {
    id: "u03",
    name: "Emma Williams",
    email: "e.williams@setu.edu",
    role: "TEACHER",
    yearGroup: "Year 7",
    lastLogin: "12 min ago",
    status: "Active",
    mfaEnabled: false,
    avatarInitials: "EW",
    avatarColor: AVATAR_COLORS[2],
  },
  {
    id: "u04",
    name: "Omar Rashid",
    email: "o.rashid@setu.edu",
    role: "DATA_MANAGER",
    lastLogin: "22 min ago",
    status: "Active",
    mfaEnabled: true,
    avatarInitials: "OR",
    avatarColor: AVATAR_COLORS[3],
  },
  {
    id: "u05",
    name: "Priya Patel",
    email: "p.patel@setu.edu",
    role: "HR_MANAGER",
    lastLogin: "35 min ago",
    status: "Active",
    mfaEnabled: true,
    avatarInitials: "PP",
    avatarColor: AVATAR_COLORS[4],
  },
  {
    id: "u06",
    name: "Benjamin Clark",
    email: "b.clark@setu.edu",
    role: "FINANCE_MANAGER",
    lastLogin: "1 hr ago",
    status: "Active",
    mfaEnabled: false,
    avatarInitials: "BC",
    avatarColor: AVATAR_COLORS[5],
  },
  {
    id: "u07",
    name: "Fatima Nour",
    email: "f.nour@setu.edu",
    role: "SAFEGUARDING_LEAD",
    lastLogin: "2 hrs ago",
    status: "Active",
    mfaEnabled: true,
    avatarInitials: "FN",
    avatarColor: AVATAR_COLORS[6],
  },
  {
    id: "u08",
    name: "Ryan Mitchell",
    email: "r.mitchell@setu.edu",
    role: "IT_ADMINISTRATOR",
    lastLogin: "3 hrs ago",
    status: "Active",
    mfaEnabled: true,
    avatarInitials: "RM",
    avatarColor: AVATAR_COLORS[7],
  },
  {
    id: "u09",
    name: "Laura Singh",
    email: "l.singh@setu.edu",
    role: "ADMISSIONS_OFFICER",
    lastLogin: "4 hrs ago",
    status: "Active",
    mfaEnabled: false,
    avatarInitials: "LS",
    avatarColor: AVATAR_COLORS[0],
  },
  {
    id: "u10",
    name: "Daniel Okonkwo",
    email: "d.okonkwo@setu.edu",
    role: "TEACHER",
    yearGroup: "Year 9",
    lastLogin: "5 hrs ago",
    status: "Active",
    mfaEnabled: false,
    avatarInitials: "DO",
    avatarColor: AVATAR_COLORS[1],
  },
  {
    id: "u11",
    name: "Olusegun Adeyemi",
    email: "o.adeyemi@setu.edu",
    role: "SENCO",
    lastLogin: "Yesterday",
    status: "Active",
    mfaEnabled: true,
    avatarInitials: "OA",
    avatarColor: AVATAR_COLORS[2],
  },
  {
    id: "u12",
    name: "James Davies",
    email: "j.davies@setu.edu",
    role: "TEACHER",
    yearGroup: "Year 8",
    lastLogin: "Yesterday",
    status: "Active",
    mfaEnabled: false,
    avatarInitials: "JD",
    avatarColor: AVATAR_COLORS[3],
  },
  {
    id: "u13",
    name: "Aisha Kamara",
    email: "a.kamara@setu.edu",
    role: "HEAD_OF_DEPARTMENT",
    yearGroup: "Year 10",
    lastLogin: "Yesterday",
    status: "Active",
    mfaEnabled: true,
    avatarInitials: "AK",
    avatarColor: AVATAR_COLORS[4],
  },
  {
    id: "u14",
    name: "Tom Harris",
    email: "t.harris@setu.edu",
    role: "TEACHER",
    lastLogin: "3 days ago",
    status: "Inactive",
    mfaEnabled: false,
    avatarInitials: "TH",
    avatarColor: AVATAR_COLORS[5],
  },
  {
    id: "u15",
    name: "Zara Hussain",
    email: "z.hussain@setu.edu",
    role: "TEACHER",
    yearGroup: "Year 11",
    lastLogin: "4 days ago",
    status: "Active",
    mfaEnabled: false,
    avatarInitials: "ZH",
    avatarColor: AVATAR_COLORS[6],
  },
  {
    id: "u16",
    name: "Patrick Nolan",
    email: "p.nolan@setu.edu",
    role: "COVER_SUPERVISOR",
    lastLogin: "4 days ago",
    status: "Active",
    mfaEnabled: false,
    avatarInitials: "PN",
    avatarColor: AVATAR_COLORS[7],
  },
  {
    id: "u17",
    name: "Clare Thompson",
    email: "c.thompson@setu.edu",
    role: "ATTENDANCE_WELFARE_OFFICER",
    lastLogin: "5 days ago",
    status: "Active",
    mfaEnabled: true,
    avatarInitials: "CT",
    avatarColor: AVATAR_COLORS[0],
  },
  {
    id: "u18",
    name: "Hamid Sultani",
    email: "h.sultani@setu.edu",
    role: "STUDENT",
    yearGroup: "Year 9",
    lastLogin: "5 days ago",
    status: "Active",
    mfaEnabled: false,
    avatarInitials: "HS",
    avatarColor: AVATAR_COLORS[1],
  },
  {
    id: "u19",
    name: "Grace Owusu",
    email: "g.owusu@setu.edu",
    role: "STUDENT",
    yearGroup: "Year 11",
    lastLogin: "6 days ago",
    status: "Active",
    mfaEnabled: false,
    avatarInitials: "GO",
    avatarColor: AVATAR_COLORS[2],
  },
  {
    id: "u20",
    name: "Kevin Walsh",
    email: "k.walsh@setu.edu",
    role: "PARENT",
    lastLogin: "1 week ago",
    status: "Active",
    mfaEnabled: false,
    avatarInitials: "KW",
    avatarColor: AVATAR_COLORS[3],
  },
  {
    id: "u21",
    name: "Nadia Bibi",
    email: "n.bibi@setu.edu",
    role: "PARENT",
    lastLogin: "2 weeks ago",
    status: "Inactive",
    mfaEnabled: false,
    avatarInitials: "NB",
    avatarColor: AVATAR_COLORS[4],
  },
  {
    id: "u22",
    name: "Victor Osei",
    email: "v.osei@setu.edu",
    role: "TEACHER",
    lastLogin: "2 weeks ago",
    status: "Locked",
    mfaEnabled: false,
    avatarInitials: "VO",
    avatarColor: AVATAR_COLORS[5],
  },
  {
    id: "u23",
    name: "Siobhan Murphy",
    email: "s.murphy@setu.edu",
    role: "LIBRARIAN",
    lastLogin: "3 weeks ago",
    status: "Active",
    mfaEnabled: false,
    avatarInitials: "SM",
    avatarColor: AVATAR_COLORS[6],
  },
  {
    id: "u24",
    name: "Aaron Levy",
    email: "a.levy@setu.edu",
    role: "SCIENCE_TECHNICIAN",
    lastLogin: "Never",
    status: "Inactive",
    mfaEnabled: false,
    avatarInitials: "AL",
    avatarColor: AVATAR_COLORS[7],
  },
];

const ALL_ROLES = [
  "All Roles",
  ...Array.from(new Set(MOCK_USERS.map((u) => u.role))).sort(),
];
const ALL_YEAR_GROUPS = [
  "All Year Groups",
  "Year 7",
  "Year 8",
  "Year 9",
  "Year 10",
  "Year 11",
  "Year 12",
  "Year 13",
];

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusConfig: Record<
  UserStatus,
  { className: string; icon: React.ElementType }
> = {
  Active: {
    className: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
  Inactive: {
    className: "bg-gray-100 text-gray-500 border-gray-200",
    icon: XCircle,
  },
  Locked: { className: "bg-red-100 text-red-700 border-red-200", icon: Lock },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UserManagementPage() {
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [yearGroupFilter, setYearGroupFilter] = useState("All Year Groups");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Add User dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "TEACHER",
    yearGroup: "",
    sendWelcome: true,
  });
  const [addLoading, setAddLoading] = useState(false);

  // Reset password dialog
  const [resetTarget, setResetTarget] = useState<ManagedUser | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  // Deactivate dialog
  const [deactivateTarget, setDeactivateTarget] = useState<ManagedUser | null>(
    null,
  );

  const filtered = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      if (roleFilter !== "All Roles" && u.role !== roleFilter) return false;
      if (statusFilter !== "All" && u.status !== statusFilter) return false;
      if (
        yearGroupFilter !== "All Year Groups" &&
        u.yearGroup !== yearGroupFilter
      )
        return false;
      return true;
    });
  }, [roleFilter, statusFilter, yearGroupFilter]);

  const handleAddUser = () => {
    setAddLoading(true);
    setTimeout(() => {
      setAddLoading(false);
      setAddOpen(false);
      setNewUser({
        name: "",
        email: "",
        role: "TEACHER",
        yearGroup: "",
        sendWelcome: true,
      });
      toast.success(
        `User ${newUser.name} created${newUser.sendWelcome ? " — welcome email sent" : ""}`,
      );
    }, 1500);
  };

  const handleResetPassword = () => {
    setResetLoading(true);
    setTimeout(() => {
      setResetLoading(false);
      setResetTarget(null);
      toast.success(`Password reset link sent to ${resetTarget?.email}`);
    }, 1200);
  };

  const handleDeactivate = () => {
    toast.success(`${deactivateTarget?.name}'s account deactivated`);
    setDeactivateTarget(null);
  };

  const handleBulkAction = (action: "activate" | "deactivate" | "export") => {
    const count = selectedIds.size;
    if (action === "export") {
      toast.success(`Exported ${count} user records`);
    } else {
      toast.success(
        `${action === "activate" ? "Activated" : "Deactivated"} ${count} user accounts`,
      );
    }
    setSelectedIds(new Set());
  };

  const columns: ColumnDef<ManagedUser>[] = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          className="h-3.5 w-3.5 rounded border-gray-300"
          checked={selectedIds.size === filtered.length && filtered.length > 0}
          onChange={(e) => {
            if (e.target.checked)
              setSelectedIds(new Set(filtered.map((u) => u.id)));
            else setSelectedIds(new Set());
          }}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="h-3.5 w-3.5 rounded border-gray-300"
          checked={selectedIds.has(row.original.id)}
          onChange={(e) => {
            const next = new Set(selectedIds);
            if (e.target.checked) next.add(row.original.id);
            else next.delete(row.original.id);
            setSelectedIds(next);
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ),
      size: 40,
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-xs font-semibold",
                u.avatarColor,
              )}
            >
              {u.avatarInitials}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{u.name}</p>
              <p className="text-xs text-gray-400">{u.email}</p>
            </div>
          </div>
        );
      },
      size: 220,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-[10px] gap-1">
          <UserCog className="h-2.5 w-2.5" />
          {row.original.role.replace(/_/g, " ")}
        </Badge>
      ),
      size: 160,
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
      cell: ({ row }) => (
        <span className="text-xs text-gray-500">{row.original.lastLogin}</span>
      ),
      size: 110,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const { className, icon: StatusIcon } =
          statusConfig[row.original.status];
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
              className,
            )}
          >
            <StatusIcon className="h-3 w-3" />
            {row.original.status}
          </span>
        );
      },
      size: 90,
    },
    {
      accessorKey: "mfaEnabled",
      header: "2FA",
      cell: ({ row }) =>
        row.original.mfaEnabled ? (
          <ShieldCheck className="h-4 w-4 text-green-500" />
        ) : (
          <ShieldOff className="h-4 w-4 text-gray-300" />
        ),
      size: 60,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1 text-gray-500 hover:text-blue-600"
              title="Edit user"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1 text-gray-500 hover:text-amber-600"
              title="Reset password"
              onClick={() => setResetTarget(u)}
            >
              <KeyRound className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1 text-gray-500 hover:text-red-600"
              title={u.status === "Active" ? "Deactivate" : "Activate"}
              onClick={() => setDeactivateTarget(u)}
            >
              {u.status === "Active" ? (
                <Lock className="h-3.5 w-3.5" />
              ) : (
                <Unlock className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        );
      },
      size: 100,
      enableSorting: false,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="User Management"
        subtitle={`${MOCK_USERS.length} total users · ${MOCK_USERS.filter((u) => u.status === "Active").length} active`}
        icon={Users}
        iconColor="bg-indigo-600"
        actions={[
          {
            label: "Bulk Import",
            onClick: () => toast.info("Bulk import: upload a CSV file"),
            icon: Upload,
            variant: "outline",
          },
          {
            label: "Add User",
            onClick: () => setAddOpen(true),
            icon: UserPlus,
          },
        ]}
      />

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-end gap-3 flex-wrap">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-gray-500">Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-8 w-48 text-sm">
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
              <Label className="text-xs text-gray-500">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-36 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["All", "Active", "Inactive", "Locked"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-gray-500">Year Group</Label>
              <Select
                value={yearGroupFilter}
                onValueChange={setYearGroupFilter}
              >
                <SelectTrigger className="h-8 w-40 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_YEAR_GROUPS.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
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
                setRoleFilter("All Roles");
                setStatusFilter("All");
                setYearGroupFilter("All Year Groups");
              }}
            >
              Clear
            </Button>

            {selectedIds.size > 0 && (
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {selectedIds.size} selected
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1"
                    >
                      Bulk Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("activate")}
                    >
                      <Unlock className="h-3.5 w-3.5 mr-2 text-green-500" />{" "}
                      Activate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("deactivate")}
                    >
                      <Lock className="h-3.5 w-3.5 mr-2 text-red-500" />{" "}
                      Deactivate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("export")}
                    >
                      <Upload className="h-3.5 w-3.5 mr-2 text-blue-500" />{" "}
                      Export Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </Card>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filtered}
          searchPlaceholder="Search users…"
          pageSize={12}
          emptyMessage="No users match the selected filters."
        />
      </div>

      {/* ── Add User Dialog ── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-indigo-500" />
              Add New User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input
                placeholder="e.g. Jane Smith"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="j.smith@setu.edu"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(v) => setNewUser({ ...newUser, role: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "TEACHER",
                    "HEAD_OF_DEPARTMENT",
                    "SLT_MEMBER",
                    "HEAD_OF_SCHOOL",
                    "FINANCE_MANAGER",
                    "HR_MANAGER",
                    "ADMISSIONS_OFFICER",
                    "DATA_MANAGER",
                    "IT_ADMINISTRATOR",
                    "SAFEGUARDING_LEAD",
                    "SENCO",
                    "ATTENDANCE_WELFARE_OFFICER",
                    "COVER_SUPERVISOR",
                    "TEACHING_ASSISTANT",
                    "LIBRARIAN",
                    "STUDENT",
                    "PARENT",
                  ].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(newUser.role === "STUDENT" ||
              newUser.role === "TEACHER" ||
              newUser.role === "HEAD_OF_DEPARTMENT") && (
              <div className="space-y-1">
                <Label>Year Group</Label>
                <Select
                  value={newUser.yearGroup}
                  onValueChange={(v) =>
                    setNewUser({ ...newUser, yearGroup: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year group" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_YEAR_GROUPS.filter((y) => y !== "All Year Groups").map(
                      (y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center gap-3 pt-1">
              <Switch
                checked={newUser.sendWelcome}
                onCheckedChange={(v) =>
                  setNewUser({ ...newUser, sendWelcome: v })
                }
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Send welcome email
                </p>
                <p className="text-xs text-gray-400">
                  User receives login credentials via email
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              disabled={addLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={addLoading || !newUser.name || !newUser.email}
              className="gap-1.5"
            >
              {addLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <UserPlus className="h-3.5 w-3.5" />
              )}
              {addLoading ? "Creating…" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reset Password Confirm ── */}
      <ConfirmDialog
        open={!!resetTarget}
        onOpenChange={(o) => {
          if (!o) setResetTarget(null);
        }}
        title="Reset Password"
        description={`Send a password reset link to ${resetTarget?.email}? The user will be prompted to set a new password on their next login.`}
        confirmLabel="Send Reset Link"
        onConfirm={handleResetPassword}
        isLoading={resetLoading}
      />

      {/* ── Deactivate Confirm ── */}
      <ConfirmDialog
        open={!!deactivateTarget}
        onOpenChange={(o) => {
          if (!o) setDeactivateTarget(null);
        }}
        title={`${deactivateTarget?.status === "Active" ? "Deactivate" : "Activate"} Account`}
        description={`Are you sure you want to ${deactivateTarget?.status === "Active" ? "deactivate" : "activate"} ${deactivateTarget?.name}'s account?${deactivateTarget?.status === "Active" ? " They will immediately lose access to the system." : ""}`}
        confirmLabel={
          deactivateTarget?.status === "Active" ? "Deactivate" : "Activate"
        }
        variant={
          deactivateTarget?.status === "Active" ? "destructive" : "default"
        }
        onConfirm={handleDeactivate}
      />
    </div>
  );
}
