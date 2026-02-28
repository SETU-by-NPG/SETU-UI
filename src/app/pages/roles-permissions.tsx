import { useState } from "react";
import { Shield, Users, ChevronDown, ChevronRight, Check, X, Lock, Edit2, Plus } from "lucide-react";
import { rolePermissions, type RolePermission } from "../data/mock-data";

const allModules = [
  "User Management", "Roles & Permissions", "Students", "Teachers", "Attendance",
  "Assignments", "Gradebook", "Timetable", "Reports & Analytics", "Announcements",
  "Messages", "Library", "IT Equipment", "Support Tickets", "Room Management",
  "Audit Logs", "System Settings", "Data & Backups", "Integrations",
];

export default function RolesPermissionsPage() {
  const [expandedRole, setExpandedRole] = useState<string | null>("rp1");
  const [editMode, setEditMode] = useState<string | null>(null);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newPerms, setNewPerms] = useState<Record<string, { read: boolean; write: boolean; delete: boolean; manage: boolean }>>(
    allModules.reduce((a, m) => ({ ...a, [m]: { read: false, write: false, delete: false, manage: false } }), {})
  );

  const toggleRole = (id: string) => {
    setExpandedRole(expandedRole === id ? null : id);
  };

  const toggleNewPerm = (module: string, perm: "read" | "write" | "delete" | "manage") => {
    setNewPerms(prev => ({
      ...prev,
      [module]: { ...prev[module], [perm]: !prev[module][perm] }
    }));
  };

  const handleCreateRole = () => {
    // In a real app, this would POST to backend
    setShowCreateRole(false);
    setNewRoleName("");
    setNewRoleDesc("");
    setNewPerms(allModules.reduce((a, m) => ({ ...a, [m]: { read: false, write: false, delete: false, manage: false } }), {}));
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1>Roles & Permissions</h1>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            Configure access control and permission levels for each user role.
          </p>
        </div>
        <button
          onClick={() => setShowCreateRole(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
          style={{ fontSize: "0.875rem" }}
        >
          <Plus className="w-4 h-4" /> Create Role
        </button>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {rolePermissions.map((role) => (
          <div key={role.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{role.roleName}</p>
                <p className="text-muted-foreground flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                  <Users className="w-3 h-3" /> {role.userCount} users
                </p>
              </div>
            </div>
            <p className="text-muted-foreground line-clamp-2" style={{ fontSize: "0.75rem" }}>{role.description}</p>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <div className="space-y-3">
        {rolePermissions.map((role) => (
          <div key={role.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <div
              onClick={() => toggleRole(role.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {expandedRole === role.id ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                <div className="text-left">
                  <p style={{ fontWeight: 500 }}>{role.roleName}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>{role.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>{role.userCount} users</span>
                {role.roleName !== "Administrator" && (
                  <button onClick={(e) => { e.stopPropagation(); setEditMode(editMode === role.id ? null : role.id); }} className="p-1.5 rounded-md hover:bg-muted">
                    <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {expandedRole === role.id && (
              <div className="border-t border-border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        {["Module", "Read", "Write", "Delete", "Manage"].map(h => (
                          <th key={h} className={`${h === "Module" ? "text-left" : "text-center"} px-4 py-3 text-muted-foreground`} style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {role.permissions.map((perm) => (
                        <tr key={perm.module} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                          <td className="px-4 py-3" style={{ fontSize: "0.875rem" }}>{perm.module}</td>
                          <td className="px-4 py-3 text-center"><PermIcon enabled={perm.read} editable={editMode === role.id} /></td>
                          <td className="px-4 py-3 text-center"><PermIcon enabled={perm.write} editable={editMode === role.id} /></td>
                          <td className="px-4 py-3 text-center"><PermIcon enabled={perm.delete} editable={editMode === role.id} /></td>
                          <td className="px-4 py-3 text-center"><PermIcon enabled={perm.manage} editable={editMode === role.id} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {editMode === role.id && (
                  <div className="flex justify-end gap-3 p-4 border-t border-border bg-muted/30">
                    <button onClick={() => setEditMode(null)} className="px-4 py-2 rounded-lg border border-border hover:bg-muted" style={{ fontSize: "0.875rem" }}>Cancel</button>
                    <button onClick={() => setEditMode(null)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90" style={{ fontSize: "0.875rem" }}>Save Changes</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Security Note */}
      <div className="mt-6 flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50">
        <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-800" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Administrator role is protected</p>
          <p className="text-amber-700 mt-0.5" style={{ fontSize: "0.8125rem" }}>
            The Administrator role has full system access and cannot be modified. To change admin privileges, contact the platform owner.
          </p>
        </div>
      </div>

      {/* Create Role Modal */}
      {showCreateRole && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateRole(false)}>
          <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <div>
                <h2>Create New Role</h2>
                <p className="text-muted-foreground mt-1" style={{ fontSize: "0.8125rem" }}>Define a custom role with specific permissions.</p>
              </div>
              <button onClick={() => setShowCreateRole(false)} className="p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Role Name *</label>
                  <input type="text" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="e.g., Lab Assistant" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Based on</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                    <option value="">Start from scratch</option>
                    <option value="teacher">Copy from Teacher</option>
                    <option value="student">Copy from Student</option>
                    <option value="parent">Copy from Parent</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Description</label>
                <input type="text" value={newRoleDesc} onChange={(e) => setNewRoleDesc(e.target.value)} placeholder="What can this role do?" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
              </div>

              <div>
                <h3 className="mb-3">Permissions</h3>
                <div className="border border-border rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-4 py-2.5 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase" }}>Module</th>
                        {["Read", "Write", "Delete", "Manage"].map(h => (
                          <th key={h} className="text-center px-3 py-2.5 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allModules.map((mod) => (
                        <tr key={mod} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                          <td className="px-4 py-2.5" style={{ fontSize: "0.8125rem" }}>{mod}</td>
                          {(["read", "write", "delete", "manage"] as const).map((p) => (
                            <td key={p} className="px-3 py-2.5 text-center">
                              <button
                                onClick={() => toggleNewPerm(mod, p)}
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-md border transition-colors ${
                                  newPerms[mod]?.[p]
                                    ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                                    : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                                }`}
                              >
                                {newPerms[mod]?.[p] ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                              </button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-border shrink-0">
              <button onClick={() => setShowCreateRole(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-muted" style={{ fontSize: "0.875rem" }}>Cancel</button>
              <button
                onClick={handleCreateRole}
                disabled={!newRoleName.trim()}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
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

function PermIcon({ enabled, editable }: { enabled: boolean; editable: boolean }) {
  if (editable) {
    return (
      <button className={`inline-flex items-center justify-center w-7 h-7 rounded-md border transition-colors ${
        enabled ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100" : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
      }`}>
        {enabled ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
      </button>
    );
  }
  return enabled ? (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-50 text-green-600"><Check className="w-3.5 h-3.5" /></span>
  ) : (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-muted-foreground/40"><X className="w-3.5 h-3.5" /></span>
  );
}
