import { useState } from "react";
import { useOutletContext } from "react-router";
import { Plus, X, Bell } from "lucide-react";
import { EmptyState } from "../components/empty-state";
import { announcements, type Role } from "../data/mock-data";

export default function AnnouncementsPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1>Announcements</h1>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>School-wide and targeted announcements.</p>
        </div>
        {role === "admin" && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
            style={{ fontSize: "0.875rem" }}
          >
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        )}
      </div>

      {announcements.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-6 h-6 text-muted-foreground" />}
          title="No announcements"
          description="There are no announcements at this time."
        />
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p style={{ fontWeight: 500 }}>{a.title}</p>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>{a.message}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{a.date}</span>
                    <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>&middot;</span>
                    <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{a.author}</span>
                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground" style={{ fontSize: "0.7rem" }}>{a.target}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-card rounded-xl border border-border shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2>New Announcement</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label style={{ fontSize: "0.875rem" }}>Title</label>
                <input type="text" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Message</label>
                <textarea rows={4} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background resize-none" style={{ fontSize: "0.875rem" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Target Audience</label>
                <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                  <option>All</option>
                  <option>Students</option>
                  <option>Parents</option>
                  <option>Teachers</option>
                  <option>Grade 10</option>
                  <option>Grade 11</option>
                  <option>Grade 12</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-border">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-muted" style={{ fontSize: "0.875rem" }}>Cancel</button>
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90" style={{ fontSize: "0.875rem" }}>Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
