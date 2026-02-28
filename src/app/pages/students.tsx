import { useState } from "react";
import { useOutletContext } from "react-router";
import { Plus, Upload, Download, X, Users } from "lucide-react";
import { DataTable } from "../components/data-table";
import { StatusBadge } from "../components/status-badge";
import { EmptyState } from "../components/empty-state";
import { students, type Student, type Role } from "../data/mock-data";

export default function StudentsPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [showAddModal, setShowAddModal] = useState(false);

  const columns = [
    {
      key: "name",
      label: "Student",
      render: (s: Student) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{s.name.split(" ").map(n => n[0]).join("")}</span>
          </div>
          <div>
            <p style={{ fontWeight: 500 }}>{s.name}</p>
            <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{s.email}</p>
          </div>
        </div>
      ),
    },
    { key: "grade", label: "Grade", render: (s: Student) => <span>{s.grade}-{s.section}</span> },
    { key: "rollNo", label: "Roll No", render: (s: Student) => <span className="text-muted-foreground">{s.rollNo}</span> },
    {
      key: "attendance",
      label: "Attendance",
      render: (s: Student) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${s.attendancePercent >= 90 ? "bg-green-500" : s.attendancePercent >= 75 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${s.attendancePercent}%` }}
            />
          </div>
          <span style={{ fontSize: "0.8125rem" }}>{s.attendancePercent}%</span>
        </div>
      ),
    },
    { key: "gpa", label: "GPA", render: (s: Student) => <span style={{ fontWeight: 500 }}>{s.gpa.toFixed(1)}</span> },
    { key: "guardian", label: "Guardian", render: (s: Student) => <span className="text-muted-foreground">{s.guardian}</span>, className: "hidden lg:table-cell" },
    { key: "status", label: "Status", render: (s: Student) => <StatusBadge status={s.status} /> },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1>{role === "teacher" ? "My Classes" : "Students"}</h1>
        <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
          {role === "admin" ? "Manage student records, enrollment, and profiles." : "View students in your assigned classes."}
        </p>
      </div>

      <DataTable
        data={students}
        columns={columns}
        searchKey={(s) => `${s.name} ${s.email} ${s.rollNo} ${s.grade}`}
        searchPlaceholder="Search students..."
        pageSize={10}
        actions={
          role === "admin" ? (
            <>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                style={{ fontSize: "0.875rem" }}
              >
                <Plus className="w-4 h-4" /> Add Student
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors" style={{ fontSize: "0.875rem" }}>
                <Upload className="w-4 h-4" /> Import CSV
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors" style={{ fontSize: "0.875rem" }}>
                <Download className="w-4 h-4" /> Export
              </button>
            </>
          ) : undefined
        }
        emptyState={
          <EmptyState
            icon={<Users className="w-6 h-6 text-muted-foreground" />}
            title="No students yet"
            description="Add students individually or import them in bulk using a CSV file."
            action={
              role === "admin" ? (
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground" style={{ fontSize: "0.875rem" }}>
                  <Plus className="w-4 h-4" /> Add First Student
                </button>
              ) : undefined
            }
          />
        }
      />

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-card rounded-xl border border-border shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2>Add Student</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-md hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Grade</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Section</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                    <option>A</option>
                    <option>B</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Guardian Name</label>
                <input type="text" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Guardian Email</label>
                <input type="email" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-border">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-muted" style={{ fontSize: "0.875rem" }}>Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90" style={{ fontSize: "0.875rem" }}>Add Student</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
