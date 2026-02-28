import { useState } from "react";
import { Plus, X, GraduationCap } from "lucide-react";
import { DataTable } from "../components/data-table";
import { StatusBadge } from "../components/status-badge";
import { EmptyState } from "../components/empty-state";
import { teachers, type Teacher } from "../data/mock-data";

export default function TeachersPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  const columns = [
    {
      key: "name",
      label: "Teacher",
      render: (t: Teacher) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{t.name.split(" ").filter(n => n !== "Mr." && n !== "Ms.").map(n => n[0]).join("")}</span>
          </div>
          <div>
            <p style={{ fontWeight: 500 }}>{t.name}</p>
            <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{t.email}</p>
          </div>
        </div>
      ),
    },
    { key: "department", label: "Department", render: (t: Teacher) => <span>{t.department}</span> },
    { key: "subjects", label: "Subjects", render: (t: Teacher) => <span className="text-muted-foreground">{t.subjects.join(", ")}</span> },
    { key: "classes", label: "Classes", render: (t: Teacher) => <span className="text-muted-foreground">{t.classes.join(", ")}</span>, className: "hidden lg:table-cell" },
    { key: "status", label: "Status", render: (t: Teacher) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1>Teachers</h1>
        <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Manage teacher profiles, assignments, and departments.</p>
      </div>

      <DataTable
        data={teachers}
        columns={columns}
        searchKey={(t) => `${t.name} ${t.email} ${t.department}`}
        searchPlaceholder="Search teachers..."
        actions={
          <>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              style={{ fontSize: "0.875rem" }}
            >
              <Plus className="w-4 h-4" /> Add Teacher
            </button>
          </>
        }
        emptyState={
          <EmptyState
            icon={<GraduationCap className="w-6 h-6 text-muted-foreground" />}
            title="No teachers yet"
            description="Add teachers to assign them to classes and subjects."
          />
        }
      />

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-card rounded-xl border border-border shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2>Add Teacher</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "0.875rem" }}>First Name</label>
                  <input type="text" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Last Name</label>
                  <input type="text" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Email</label>
                <input type="email" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Department</label>
                <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                  <option>Mathematics</option>
                  <option>Science</option>
                  <option>English</option>
                  <option>History</option>
                  <option>Computer Science</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Subjects</label>
                <input type="text" placeholder="e.g., Algebra, Calculus" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-border">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-muted" style={{ fontSize: "0.875rem" }}>Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90" style={{ fontSize: "0.875rem" }}>Add Teacher</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
