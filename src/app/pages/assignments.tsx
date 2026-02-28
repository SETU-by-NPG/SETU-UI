import { useState } from "react";
import { useOutletContext } from "react-router";
import { Plus, X, BookOpen, Upload, CheckCircle } from "lucide-react";
import { StatusBadge } from "../components/status-badge";
import { EmptyState } from "../components/empty-state";
import { assignments, type Assignment, type Role } from "../data/mock-data";

function AssignmentCard({ assignment, role }: { assignment: Assignment; role: Role }) {
  const [expanded, setExpanded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p style={{ fontWeight: 500 }}>{assignment.title}</p>
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: "0.8125rem" }}>
              {assignment.subject} &middot; {assignment.class} &middot; Due {assignment.dueDate}
            </p>
          </div>
          <StatusBadge status={assignment.status} />
        </div>
        {(role === "admin" || role === "teacher") && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }} />
            </div>
            <span className="text-muted-foreground shrink-0" style={{ fontSize: "0.75rem" }}>{assignment.submissions}/{assignment.total} submitted</span>
          </div>
        )}
      </button>

      {expanded && (
        <div className="border-t border-border p-4">
          <p className="text-muted-foreground mb-4" style={{ fontSize: "0.875rem" }}>{assignment.description}</p>

          {role === "student" && !submitted && (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Drop file here or click to upload</p>
                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>PDF, DOC, or image files up to 10MB</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setSubmitted(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                  style={{ fontSize: "0.875rem" }}
                >
                  Submit Assignment
                </button>
              </div>
            </div>
          )}

          {role === "student" && submitted && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-green-700" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Submitted Successfully</p>
                <p className="text-green-600" style={{ fontSize: "0.75rem" }}>Submitted on Feb 27, 2026 at 10:30 AM</p>
              </div>
            </div>
          )}

          {(role === "admin" || role === "teacher") && (
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90" style={{ fontSize: "0.875rem" }}>
                View Submissions
              </button>
              <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted" style={{ fontSize: "0.875rem" }}>
                Edit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AssignmentsPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "graded" | "overdue">("all");

  const filtered = filter === "all" ? assignments : assignments.filter((a) => a.status === filter);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1>Assignments</h1>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            {role === "student" ? "View and submit your assignments." : "Create and manage class assignments."}
          </p>
        </div>
        {(role === "admin" || role === "teacher") && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
            style={{ fontSize: "0.875rem" }}
          >
            <Plus className="w-4 h-4" /> Create
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg w-fit">
        {(["all", "active", "graded", "overdue"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
              filter === f ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
            style={{ fontSize: "0.8125rem", fontWeight: 500 }}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-6 h-6 text-muted-foreground" />}
          title="No assignments found"
          description={filter === "all" ? "No assignments have been created yet." : `No ${filter} assignments right now.`}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <AssignmentCard key={a.id} assignment={a} role={role} />
          ))}
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-card rounded-xl border border-border shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2>Create Assignment</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label style={{ fontSize: "0.875rem" }}>Title</label>
                <input type="text" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Subject</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                    <option>Algebra</option>
                    <option>Physics</option>
                    <option>English</option>
                    <option>History</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Class</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                    <option>10-A</option>
                    <option>10-B</option>
                    <option>11-A</option>
                    <option>12-A</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Due Date</label>
                <input type="date" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Instructions</label>
                <textarea rows={3} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background resize-none" style={{ fontSize: "0.875rem" }} />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-border">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-muted" style={{ fontSize: "0.875rem" }}>Cancel</button>
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90" style={{ fontSize: "0.875rem" }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
