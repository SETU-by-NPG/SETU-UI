import { useOutletContext } from "react-router";
import { Download, FileText, BarChart3, Users, ClipboardCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { attendanceChartData, gradeDistribution, type Role } from "../data/mock-data";

const reportTypes = [
  { icon: <FileText className="w-5 h-5" />, title: "Student Progress Report", description: "Individual student academic performance summary", format: "PDF" },
  { icon: <Users className="w-5 h-5" />, title: "Class Performance Report", description: "Aggregate class-level grade analysis", format: "Excel" },
  { icon: <ClipboardCheck className="w-5 h-5" />, title: "Attendance Summary", description: "Monthly attendance data by class and student", format: "CSV" },
  { icon: <BarChart3 className="w-5 h-5" />, title: "Report Cards (Bulk)", description: "Generate report cards for all students in a class", format: "PDF" },
];

export default function ReportsPage() {
  const { role } = useOutletContext<{ role: Role }>();

  if (role === "parent") {
    return (
      <div>
        <div className="mb-6">
          <h1>Report Card</h1>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Alice Johnson's academic report.</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2>Academic Report - Spring 2026</h2>
              <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Grade 10-A &middot; Roll #1001</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted" style={{ fontSize: "0.875rem" }}>
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase" }}>Subject</th>
                  <th className="text-left py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase" }}>Score</th>
                  <th className="text-left py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase" }}>Grade</th>
                  <th className="text-left py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase" }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { subject: "Mathematics", score: 92, grade: "A", remarks: "Excellent" },
                  { subject: "Physics", score: 88, grade: "A-", remarks: "Very Good" },
                  { subject: "English", score: 85, grade: "B+", remarks: "Good" },
                  { subject: "History", score: 90, grade: "A", remarks: "Excellent" },
                  { subject: "Computer Science", score: 95, grade: "A+", remarks: "Outstanding" },
                ].map((row) => (
                  <tr key={row.subject} className="border-b border-border last:border-b-0">
                    <td className="py-3" style={{ fontWeight: 500, fontSize: "0.875rem" }}>{row.subject}</td>
                    <td className="py-3" style={{ fontSize: "0.875rem" }}>{row.score}/100</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200" style={{ fontSize: "0.75rem", fontWeight: 500 }}>{row.grade}</span>
                    </td>
                    <td className="py-3 text-muted-foreground" style={{ fontSize: "0.875rem" }}>{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <div>
              <span className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Overall GPA: </span>
              <span style={{ fontWeight: 600, fontSize: "1.125rem" }}>3.8</span>
            </div>
            <div>
              <span className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Attendance: </span>
              <span style={{ fontWeight: 600, fontSize: "1.125rem" }}>94%</span>
            </div>
            <div>
              <span className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Rank: </span>
              <span style={{ fontWeight: 600, fontSize: "1.125rem" }}>3/25</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1>Reports & Analytics</h1>
        <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Generate and download academic reports.</p>
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {reportTypes.map((report) => (
          <div key={report.title} className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              {report.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontWeight: 500 }}>{report.title}</p>
              <p className="text-muted-foreground mt-0.5" style={{ fontSize: "0.8125rem" }}>{report.description}</p>
              <button className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors" style={{ fontSize: "0.8125rem" }}>
                <Download className="w-3.5 h-3.5" /> Generate {report.format}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="mb-4">Attendance Overview</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={attendanceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} name="Present %" />
              <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="mb-4">Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
