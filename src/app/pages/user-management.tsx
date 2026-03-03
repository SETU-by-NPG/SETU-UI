import { useState } from "react";
import {
  Plus,
  Upload,
  Download,
  X,
  MoreVertical,
  Search,
  Filter,
  UserPlus,
  Mail,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import { DataTable } from "../components/data-table";
import { StatusBadge } from "../components/status-badge";
import { systemUsers } from "../data/mock-data";
import type { SystemUser } from "../types";

const roleFilterOptions = [
  "All",
  "admin",
  "teacher",
  "student",
  "parent",
  "staff",
] as const;

export default function UserManagementPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);

  const filteredUsers =
    roleFilter === "All"
      ? systemUsers
      : systemUsers.filter((u) => u.role === roleFilter);

  const stats = {
    total: systemUsers.length,
    active: systemUsers.filter((u) => u.status === "active").length,
    suspended: systemUsers.filter((u) => u.status === "suspended").length,
    pending: systemUsers.filter((u) => u.status === "pending").length,
  };

  const columns = [
    {
      key: "name",
      label: "User",
      render: (u: SystemUser) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>
              {u.name
                .split(" ")
                .filter((n) => !["Mr.", "Ms.", "Dr."].includes(n))
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </span>
          </div>
          <div className="min-w-0">
            <p style={{ fontWeight: 500 }}>{u.name}</p>
            <p
              className="text-muted-foreground truncate"
              style={{ fontSize: "0.75rem" }}
            >
              {u.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (u: SystemUser) => (
        <span
          className="px-2 py-0.5 rounded-full bg-muted capitalize"
          style={{ fontSize: "0.75rem", fontWeight: 500 }}
        >
          {u.role}
        </span>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (u: SystemUser) => (
        <span className="text-muted-foreground">{u.department || "—"}</span>
      ),
      className: "hidden lg:table-cell",
    },
    {
      key: "status",
      label: "Status",
      render: (u: SystemUser) => <StatusBadge status={u.status} />,
    },
    {
      key: "2fa",
      label: "2FA",
      render: (u: SystemUser) =>
        u.twoFactorEnabled ? (
          <ShieldCheck className="w-4 h-4 text-green-600" />
        ) : (
          <ShieldOff className="w-4 h-4 text-muted-foreground" />
        ),
    },
    {
      key: "lastLogin",
      label: "Last Login",
      render: (u: SystemUser) => (
        <span
          className="text-muted-foreground"
          style={{ fontSize: "0.8125rem" }}
        >
          {u.lastLogin}
        </span>
      ),
      className: "hidden xl:table-cell",
    },
    {
      key: "actions",
      label: "",
      render: (u: SystemUser) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActionMenu(showActionMenu === u.id ? null : u.id);
            }}
            className="p-1 rounded-md hover:bg-muted"
          >
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          {showActionMenu === u.id && (
            <div className="absolute right-0 top-8 z-20 bg-card border border-border rounded-lg shadow-lg w-44 overflow-hidden">
              <button
                onClick={() => {
                  setSelectedUser(u);
                  setShowActionMenu(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                style={{ fontSize: "0.8125rem" }}
              >
                View Details
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                style={{ fontSize: "0.8125rem" }}
              >
                Reset Password
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                style={{ fontSize: "0.8125rem" }}
              >
                Send Invite Email
              </button>
              {u.status === "active" ? (
                <button
                  className="w-full text-left px-3 py-2 hover:bg-muted text-red-600 transition-colors"
                  style={{ fontSize: "0.8125rem" }}
                >
                  Suspend User
                </button>
              ) : u.status === "suspended" ? (
                <button
                  className="w-full text-left px-3 py-2 hover:bg-muted text-green-600 transition-colors"
                  style={{ fontSize: "0.8125rem" }}
                >
                  Reactivate User
                </button>
              ) : null}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div onClick={() => setShowActionMenu(null)}>
      <div className="mb-6">
        <h1>User Management</h1>
        <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
          Manage all user accounts, permissions, and access across the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
            Total Users
          </p>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
            Active
          </p>
          <p
            className="text-green-600"
            style={{ fontSize: "1.5rem", fontWeight: 600 }}
          >
            {stats.active}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
            Suspended
          </p>
          <p
            className="text-red-600"
            style={{ fontSize: "1.5rem", fontWeight: 600 }}
          >
            {stats.suspended}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
            Pending
          </p>
          <p
            className="text-amber-600"
            style={{ fontSize: "1.5rem", fontWeight: 600 }}
          >
            {stats.pending}
          </p>
        </div>
      </div>

      {/* Role Filter */}
      <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg w-fit overflow-x-auto">
        {roleFilterOptions.map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-md capitalize whitespace-nowrap transition-colors ${
              roleFilter === r
                ? "bg-card shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={{ fontSize: "0.8125rem", fontWeight: 500 }}
          >
            {r === "All" ? "All Users" : `${r}s`}
          </button>
        ))}
      </div>

      <DataTable
        data={filteredUsers}
        columns={columns}
        searchKey={(u) =>
          `${u.name} ${u.email} ${u.role} ${u.department || ""}`
        }
        searchPlaceholder="Search users by name, email, or role..."
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[10, 25, 50, 100]}
        actions={
          <>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              style={{ fontSize: "0.875rem" }}
            >
              <UserPlus className="w-4 h-4" /> Add User
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              style={{ fontSize: "0.875rem" }}
            >
              <Upload className="w-4 h-4" /> Bulk Import
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              style={{ fontSize: "0.875rem" }}
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </>
        }
      />

      {/* Add User Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-card rounded-xl border border-border shadow-xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2>Add New User</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "0.875rem" }}>First Name</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Last Name</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Email</label>
                <input
                  type="email"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Role</label>
                  <select
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                    style={{ fontSize: "0.875rem" }}
                  >
                    <option>Student</option>
                    <option>Teacher</option>
                    <option>Parent</option>
                    <option>Staff</option>
                    <option>Administrator</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Department</label>
                  <select
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                    style={{ fontSize: "0.875rem" }}
                  >
                    <option>—</option>
                    <option>IT Administration</option>
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>History</option>
                    <option>Computer Science</option>
                    <option>Front Office</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <input
                  type="checkbox"
                  id="sendInvite"
                  defaultChecked
                  className="rounded"
                />
                <label htmlFor="sendInvite" style={{ fontSize: "0.875rem" }}>
                  Send invitation email with temporary password
                </label>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <input type="checkbox" id="require2fa" className="rounded" />
                <label htmlFor="require2fa" style={{ fontSize: "0.875rem" }}>
                  Require two-factor authentication
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-border">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted"
                style={{ fontSize: "0.875rem" }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                style={{ fontSize: "0.875rem" }}
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-card rounded-xl border border-border shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2>User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-md hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                    {selectedUser.name
                      .split(" ")
                      .filter((n) => !["Mr.", "Ms.", "Dr."].includes(n))
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p style={{ fontWeight: 600 }}>{selectedUser.name}</p>
                  <p
                    className="text-muted-foreground"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {selectedUser.email}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Role", value: selectedUser.role },
                  {
                    label: "Department",
                    value: selectedUser.department || "—",
                  },
                  { label: "Status", value: selectedUser.status },
                  {
                    label: "Two-Factor Auth",
                    value: selectedUser.twoFactorEnabled
                      ? "Enabled"
                      : "Disabled",
                  },
                  { label: "Last Login", value: selectedUser.lastLogin },
                  { label: "Account Created", value: selectedUser.createdAt },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="flex justify-between py-2 border-b border-border last:border-b-0"
                  >
                    <span
                      className="text-muted-foreground"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {field.label}
                    </span>
                    <span
                      className="capitalize"
                      style={{ fontSize: "0.875rem", fontWeight: 500 }}
                    >
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-border">
              <button
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted"
                style={{ fontSize: "0.875rem" }}
              >
                Reset Password
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                style={{ fontSize: "0.875rem" }}
              >
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
