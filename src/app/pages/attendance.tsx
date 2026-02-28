import { useState } from "react";
import { useOutletContext } from "react-router";
import { Check, X as XIcon, Clock, Shield, Save } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatusBadge } from "../components/status-badge";
import { attendanceRecords, attendanceChartData, type AttendanceRecord, type Role } from "../data/mock-data";

type AttendanceStatus = "present" | "absent" | "late" | "excused";

const statusButtons: { status: AttendanceStatus; icon: React.ReactNode; label: string; color: string }[] = [
  { status: "present", icon: <Check className="w-3.5 h-3.5" />, label: "P", color: "bg-green-100 text-green-700 hover:bg-green-200" },
  { status: "absent", icon: <XIcon className="w-3.5 h-3.5" />, label: "A", color: "bg-red-100 text-red-700 hover:bg-red-200" },
  { status: "late", icon: <Clock className="w-3.5 h-3.5" />, label: "L", color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
  { status: "excused", icon: <Shield className="w-3.5 h-3.5" />, label: "E", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
];

function MarkAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>(
    attendanceRecords.map((r) => ({ ...r }))
  );
  const [saved, setSaved] = useState(false);

  const updateStatus = (studentId: string, status: AttendanceStatus) => {
    setRecords((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, status } : r)));
    setSaved(false);
  };

  const summary = {
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
    excused: records.filter((r) => r.status === "excused").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Mark Attendance</h1>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>February 27, 2026 &middot; Period 1 &middot; Grade 10-A</p>
        </div>
        <button
          onClick={() => setSaved(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            saved ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
          style={{ fontSize: "0.875rem" }}
        >
          <Save className="w-4 h-4" /> {saved ? "Saved" : "Save"}
        </button>
      </div>

      {/* Summary bar */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <span className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200" style={{ fontSize: "0.8125rem" }}>Present: {summary.present}</span>
        <span className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200" style={{ fontSize: "0.8125rem" }}>Absent: {summary.absent}</span>
        <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200" style={{ fontSize: "0.8125rem" }}>Late: {summary.late}</span>
        <span className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200" style={{ fontSize: "0.8125rem" }}>Excused: {summary.excused}</span>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Roll</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Student</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.studentId} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: "0.875rem" }}>{r.rollNo}</td>
                  <td className="px-4 py-3" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{r.studentName}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {statusButtons.map((btn) => (
                        <button
                          key={btn.status}
                          onClick={() => updateStatus(r.studentId, btn.status)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            r.status === btn.status ? btn.color : "bg-muted/50 text-muted-foreground hover:bg-muted"
                          }`}
                          title={btn.status}
                        >
                          {btn.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AttendanceOverview() {
  return (
    <div>
      <div className="mb-6">
        <h1>Attendance</h1>
        <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Attendance records and trends overview.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h3 className="mb-4">Monthly Attendance Trends</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={attendanceChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} name="Present %" />
            <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent %" />
            <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Late %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="mb-4">Today's Records</h3>
        <div className="space-y-2">
          {attendanceRecords.map((r) => (
            <div key={r.studentId} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground w-10" style={{ fontSize: "0.8125rem" }}>{r.rollNo}</span>
                <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>{r.studentName}</span>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const { role } = useOutletContext<{ role: Role }>();

  if (role === "teacher") return <MarkAttendance />;
  return <AttendanceOverview />;
}
