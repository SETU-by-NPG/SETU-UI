import { useState } from "react";
import {
  Shield,
  Users,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Lock,
  Edit2,
  Plus,
  Eye,
  EyeOff,
  UserCog,
  GraduationCap,
  User,
  BookOpen,
  Search,
  Filter,
} from "lucide-react";
import { DEFAULT_PERMISSIONS } from "../data/permissions";
import { systemUsers } from "../data/mock-data";
import type { Role } from "../types";

// Standard roles configuration
const STANDARD_ROLES: {
  id: Role;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    id: "master_admin",
    name: "Administrator",
    description:
      "Full system access with all permissions. Can manage users, settings, and configure the entire platform.",
    icon: <Shield className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    id: "teacher",
    name: "Teacher",
    description:
      "Manages classes, assignments, grades, and attendance. Can view student records and communicate with parents.",
    icon: <UserCog className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: "student",
    name: "Student",
    description:
      "Access to personal academic records, assignments, timetable, and school announcements.",
    icon: <GraduationCap className="w-5 h-5" />,
    color: "bg-green-100 text-green-700 border-green-200",
  },
  {
    id: "parent",
    name: "Parent",
    description:
      "View-only access to children's academic progress, attendance, and school communications.",
    icon: <User className="w-5 h-5" />,
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    id: "librarian",
    name: "Librarian",
    description:
      "Manages library resources, book loans, and reading materials. Can view student borrowing history.",
    icon: <BookOpen className="w-5 h-5" />,
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
];

// Permission categories for organization
const PERMISSION_CATEGORIES = [
  { key: "search", label: "Search & Discovery" },
  { key: "view", label: "View Access" },
  { key: "edit", label: "Edit & Modify" },
  { key: "create", label: "Create & Add" },
  { key: "delete", label: "Delete & Remove" },
  { key: "export", label: "Export & Reports" },
  { key: "manage", label: "Management" },
];

// Calculate permission counts for each role
const getPermissionStats = (role: Role) => {
  const allPerms = DEFAULT_PERMISSIONS;
  const allowed = allPerms.filter((p) => p.roles.includes(role)).length;
  const configurable = allPerms.filter(
    (p) => p.isConfigurable === true && p.roles.includes(role),
  ).length;
  const denied = allPerms.filter((p) => !p.roles.includes(role)).length;
  return { allowed, configurable, denied, total: allPerms.length };
};

// Get user count for each role
const getUserCount = (role: Role) => {
  return systemUsers.filter((u) => u.role === role).length;
};

export default function RolesPermissionsPage() {
  const [activeTab, setActiveTab] = useState<"standard" | "custom">("standard");
  const [selectedRole, setSelectedRole] = useState<Role | null>("master_admin");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "search",
  ]);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(false);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleCreateRole = () => {
    setShowCreateRole(false);
    setNewRoleName("");
    setNewRoleDesc("");
  };

  const selectedRoleConfig = STANDARD_ROLES.find((r) => r.id === selectedRole);
  const selectedRoleStats = selectedRole
    ? getPermissionStats(selectedRole)
    : null;

  // Filter permissions by search and category
  const filteredPermissions = DEFAULT_PERMISSIONS.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.module?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getPermissionIcon = (access: string) => {
    switch (access) {
      case "allow":
        return <Check className="w-4 h-4 text-green-600" />;
      case "deny":
        return <X className="w-4 h-4 text-red-500" />;
      case "config":
        return (
          <div className="w-4 h-4 rounded-full border-2 border-amber-500" />
        );
      default:
        return null;
    }
  };

  const getPermissionLabel = (access: string) => {
    switch (access) {
      case "allow":
        return "Allowed";
      case "deny":
        return "Denied";
      case "config":
        return "Configurable";
      default:
        return "Unknown";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1>Roles & Permissions</h1>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            Configure access control and permission levels for each user role.
          </p>
        </div>
        <button
          onClick={() => setShowCreateRole(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          style={{ fontSize: "0.875rem" }}
        >
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 p-1 bg-muted rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("standard")}
          className={`px-4 py-2 rounded-md transition-all ${
            activeTab === "standard"
              ? "bg-card shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          style={{ fontSize: "0.875rem", fontWeight: 500 }}
        >
          Standard Roles
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`px-4 py-2 rounded-md transition-all ${
            activeTab === "custom"
              ? "bg-card shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          style={{ fontSize: "0.875rem", fontWeight: 500 }}
        >
          Custom Roles
        </button>
      </div>

      {activeTab === "standard" ? (
        <>
          {/* Standard Roles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            {STANDARD_ROLES.map((role) => {
              const stats = getPermissionStats(role.id);
              const userCount = getUserCount(role.id);
              const isSelected = selectedRole === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`cursor-pointer border rounded-xl p-4 transition-all hover:shadow-md ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${role.color}`}
                    >
                      {role.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium truncate"
                        style={{ fontSize: "0.875rem" }}
                      >
                        {role.name}
                      </p>
                      <p
                        className="text-muted-foreground flex items-center gap-1"
                        style={{ fontSize: "0.75rem" }}
                      >
                        <Users className="w-3 h-3" /> {userCount} users
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-muted-foreground line-clamp-2 mb-3"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {role.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      {stats.allowed} allowed
                    </span>
                    {stats.configurable > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        {stats.configurable} config
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Role Details */}
          {selectedRoleConfig && selectedRoleStats && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Role Header */}
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedRoleConfig.color}`}
                    >
                      {selectedRoleConfig.icon}
                    </div>
                    <div>
                      <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                        {selectedRoleConfig.name}
                      </h2>
                      <p
                        className="text-muted-foreground"
                        style={{ fontSize: "0.8125rem" }}
                      >
                        {selectedRoleConfig.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p
                        className="text-muted-foreground"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Permissions
                      </p>
                      <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                        {selectedRoleStats.allowed} / {selectedRoleStats.total}
                      </p>
                    </div>
                    {selectedRole !== "master_admin" && (
                      <button
                        onClick={() => setEditMode(!editMode)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                          editMode
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:bg-muted"
                        }`}
                        style={{ fontSize: "0.8125rem" }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        {editMode ? "Done" : "Edit"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Permission Stats Bar */}
              <div className="flex items-center gap-6 px-4 py-3 border-b border-border bg-muted/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span style={{ fontSize: "0.8125rem" }}>
                    <strong>{selectedRoleStats.allowed}</strong> Allowed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-amber-500" />
                  <span style={{ fontSize: "0.8125rem" }}>
                    <strong>{selectedRoleStats.configurable}</strong>{" "}
                    Configurable
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span style={{ fontSize: "0.8125rem" }}>
                    <strong>{selectedRoleStats.denied}</strong> Denied
                  </span>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="p-4 border-b border-border">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-input-background"
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>
              </div>

              {/* Permission Matrix */}
              <div className="divide-y divide-border">
                {PERMISSION_CATEGORIES.map((category) => {
                  const categoryPermissions = filteredPermissions.filter(
                    (p) => p.category === category.key,
                  );
                  if (categoryPermissions.length === 0) return null;

                  const isExpanded = expandedCategories.includes(category.key);

                  return (
                    <div key={category.key}>
                      <button
                        onClick={() => toggleCategory(category.key)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span
                            style={{ fontSize: "0.875rem", fontWeight: 500 }}
                          >
                            {category.label}
                          </span>
                          <span
                            className="text-muted-foreground"
                            style={{ fontSize: "0.75rem" }}
                          >
                            ({categoryPermissions.length} permissions)
                          </span>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-border">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border bg-muted/30">
                                <th
                                  className="text-left px-4 py-2 text-muted-foreground"
                                  style={{
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  Permission
                                </th>
                                <th
                                  className="text-left px-4 py-2 text-muted-foreground"
                                  style={{
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  Module
                                </th>
                                <th
                                  className="text-center px-4 py-2 text-muted-foreground"
                                  style={{
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  Access
                                </th>
                                {editMode &&
                                  selectedRole !== "master_admin" && (
                                    <th
                                      className="text-center px-4 py-2 text-muted-foreground"
                                      style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 500,
                                      }}
                                    >
                                      Action
                                    </th>
                                  )}
                              </tr>
                            </thead>
                            <tbody>
                              {categoryPermissions.map((perm) => {
                                const access = perm.roles.includes(
                                  selectedRole!,
                                )
                                  ? "allow"
                                  : "deny";
                                return (
                                  <tr
                                    key={perm.id}
                                    className="border-b border-border last:border-b-0 hover:bg-muted/20"
                                  >
                                    <td className="px-4 py-2.5">
                                      <p
                                        style={{
                                          fontSize: "0.8125rem",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {perm.name}
                                      </p>
                                      <p
                                        className="text-muted-foreground"
                                        style={{ fontSize: "0.75rem" }}
                                      >
                                        {perm.description}
                                      </p>
                                    </td>
                                    <td className="px-4 py-2.5">
                                      <span
                                        className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                                        style={{ fontSize: "0.75rem" }}
                                      >
                                        {perm.module}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                      <div className="flex items-center justify-center gap-2">
                                        {getPermissionIcon(access)}
                                        <span style={{ fontSize: "0.75rem" }}>
                                          {getPermissionLabel(access)}
                                        </span>
                                      </div>
                                    </td>
                                    {editMode &&
                                      selectedRole !== "master_admin" && (
                                        <td className="px-4 py-2.5 text-center">
                                          {perm.isConfigurable ? (
                                            <select
                                              className="px-2 py-1 rounded border border-border bg-input-background"
                                              style={{ fontSize: "0.75rem" }}
                                              defaultValue={access}
                                            >
                                              <option value="allow">
                                                Allow
                                              </option>
                                              <option value="deny">Deny</option>
                                            </select>
                                          ) : (
                                            <span
                                              className="text-muted-foreground"
                                              style={{ fontSize: "0.75rem" }}
                                            >
                                              Fixed
                                            </span>
                                          )}
                                        </td>
                                      )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredPermissions.length === 0 && (
                <div
                  className="p-8 text-center text-muted-foreground"
                  style={{ fontSize: "0.875rem" }}
                >
                  No permissions found matching your search.
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* Custom Roles Tab */
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 style={{ fontSize: "1rem", fontWeight: 500 }} className="mb-2">
            No Custom Roles Yet
          </h3>
          <p
            className="text-muted-foreground mb-4 max-w-md mx-auto"
            style={{ fontSize: "0.875rem" }}
          >
            Create custom roles to define specific permission sets for unique
            positions in your organization.
          </p>
          <button
            onClick={() => setShowCreateRole(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground mx-auto"
            style={{ fontSize: "0.875rem" }}
          >
            <Plus className="w-4 h-4" /> Create First Custom Role
          </button>
        </div>
      )}

      {/* Admin Notice */}
      {selectedRole === "master_admin" && (
        <div className="mt-6 flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50">
          <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p
              className="text-amber-800"
              style={{ fontWeight: 500, fontSize: "0.875rem" }}
            >
              Administrator role is protected
            </p>
            <p
              className="text-amber-700 mt-0.5"
              style={{ fontSize: "0.8125rem" }}
            >
              The Administrator role has full system access and cannot be
              modified. This ensures system stability and security.
            </p>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateRole && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateRole(false)}
        >
          <div
            className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <div>
                <h2>Create New Role</h2>
                <p
                  className="text-muted-foreground mt-1"
                  style={{ fontSize: "0.8125rem" }}
                >
                  Define a custom role with specific permissions.
                </p>
              </div>
              <button
                onClick={() => setShowCreateRole(false)}
                className="p-1 rounded-md hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Role Name *</label>
                  <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="e.g., Lab Assistant"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Based on</label>
                  <select
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                    style={{ fontSize: "0.875rem" }}
                  >
                    <option value="">Start from scratch</option>
                    <option value="teacher">Copy from Teacher</option>
                    <option value="librarian">Copy from Librarian</option>
                    <option value="student">Copy from Student</option>
                    <option value="parent">Copy from Parent</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Description</label>
                <input
                  type="text"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="What can this role do?"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>

              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-amber-800" style={{ fontSize: "0.8125rem" }}>
                  <strong>Note:</strong> After creating the role, you'll be able
                  to configure specific permissions in the permission matrix
                  above.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-border shrink-0">
              <button
                onClick={() => setShowCreateRole(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted"
                style={{ fontSize: "0.875rem" }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRole}
                disabled={!newRoleName.trim()}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontSize: "0.875rem" }}
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
