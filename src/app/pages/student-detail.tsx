import { useState } from "react";
import { useOutletContext, useParams, Link } from "react-router";
import {
  User, Shield, Edit2, Save, Loader2,
  ArrowLeft, Award, BookOpen, Clock, TrendingUp, CheckCircle,
  MessageSquare, FileText, Download
} from "lucide-react";
import { type Role, students, assignments, grades, attendanceRecords } from "../data/mock-data";

// Sample data for the detail view
const studentGrades = [
  { subject: "Mathematics", score: 92, maxScore: 100, grade: "A", date: "2026-02-20" },
  { subject: "English", score: 85, maxScore: 100, grade: "B+", date: "2026-02-18" },
  { subject: "Physics", score: 88, maxScore: 100, grade: "A-", date: "2026-02-15" },
  { subject: "Chemistry", score: 90, maxScore: 100, grade: "A", date: "2026-02-12" },
  { subject: "Biology", score: 87, maxScore: 100, grade: "A-", date: "2026-02-10" },
];

const studentAttendance = [
  { month: "Sep", present: 22, absent: 1, late: 2 },
  { month: "Oct", present: 21, absent: 2, late: 1 },
  { month: "Nov", present: 20, absent: 0, late: 3 },
  { month: "Dec", present: 18, absent: 1, late: 1 },
  { month: "Jan", present: 19, absent: 2, late: 0 },
  { month: "Feb", present: 15, absent: 0, late: 1 },
];

const studentAssignments = [
  { id: 1, title: "Quadratic Equations Essay", subject: "Mathematics", dueDate: "2026-02-28", status: "submitted", grade: "A" },
  { id: 2, title: "English Literature Review", subject: "English", dueDate: "2026-02-25", status: "submitted", grade: "B+" },
  { id: 3, title: "Physics Lab Report", subject: "Physics", dueDate: "2026-03-01", status: "pending", grade: null },
  { id: 4, title: "Chemistry Project", subject: "Chemistry", dueDate: "2026-02-20", status: "late", grade: "A-" },
];

export default function StudentDetailPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const { id } = useParams();
  const student = students.find(s => s.id === id);
  
  if (!student) {
    return (
      <div className="max-w-6xl mx-auto">
        <Link
          to="/students"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          style={{ fontSize: "0.875rem" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </Link>
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <p className="text-muted-foreground" style={{ fontSize: "1rem" }}>Student not found</p>
          <Link
            to="/students"
            className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
            style={{ fontSize: "0.875rem" }}
          >
            Return to Students
          </Link>
        </div>
      </div>
    );
  }
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "grades", label: "Grades" },
    { id: "attendance", label: "Attendance" },
    { id: "assignments", label: "Assignments" },
    { id: "documents", label: "Documents" },
  ];

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600 bg-green-50";
    if (grade.startsWith("B")) return "text-blue-600 bg-blue-50";
    if (grade.startsWith("C")) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "text-green-600 bg-green-50";
      case "pending": return "text-amber-600 bg-amber-50";
      case "late": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <Link
        to="/students"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        style={{ fontSize: "0.875rem" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Students
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-2xl font-semibold text-primary">
              {student.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>{student.name}</h1>
            <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
              Grade {student.grade}-{student.section} • Roll No: {student.rollNo}
            </p>
            <div className="flex gap-3 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                <CheckCircle className="w-3 h-3" />
                Active
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
                Student
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted"
            style={{ fontSize: "0.875rem" }}
          >
            <Edit2 className="w-4 h-4" />
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted"
            style={{ fontSize: "0.875rem" }}
          >
            <MessageSquare className="w-4 h-4" />
            Message
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
            style={{ fontSize: "0.875rem" }}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Success message */}
      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 mb-4">
          <CheckCircle className="w-4 h-4" />
          <p style={{ fontSize: "0.875rem" }}>Changes saved successfully!</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>GPA</span>
          </div>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{student.gpa.toFixed(1)}</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>out of 4.0</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Attendance</span>
          </div>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{student.attendancePercent}%</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>this semester</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Subjects</span>
          </div>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>5</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>enrolled</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Rank</span>
          </div>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>#3</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>of 28 students</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontSize: "0.875rem" }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Info */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
            <h3 style={{ fontSize: "1rem", fontWeight: 600 }} className="mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Full Name</label>
                <p style={{ fontSize: "0.9375rem" }}>{student.name}</p>
              </div>
              <div>
                <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Email</label>
                <p style={{ fontSize: "0.9375rem" }}>{student.email}</p>
              </div>
              <div>
                <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Grade</label>
                <p style={{ fontSize: "0.9375rem" }}>{student.grade}</p>
              </div>
              <div>
                <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Section</label>
                <p style={{ fontSize: "0.9375rem" }}>{student.section}</p>
              </div>
              <div>
                <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Roll Number</label>
                <p style={{ fontSize: "0.9375rem" }}>{student.rollNo}</p>
              </div>
              <div>
                <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Status</label>
                <p style={{ fontSize: "0.9375rem" }} className="capitalize">{student.status}</p>
              </div>
            </div>
          </div>

          {/* Guardian Info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 style={{ fontSize: "1rem", fontWeight: 600 }} className="mb-4">Guardian Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Guardian Name</label>
                <p style={{ fontSize: "0.9375rem" }}>{student.guardian}</p>
              </div>
              <div>
                <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Guardian Email</label>
                <p style={{ fontSize: "0.9375rem" }}>{student.guardianEmail}</p>
              </div>
              <button
                className="w-full mt-2 px-4 py-2 rounded-lg border border-border hover:bg-muted"
                style={{ fontSize: "0.875rem" }}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Contact Guardian
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "grades" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Academic Performance</h3>
            <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>Current semester grades</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>SUBJECT</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>SCORE</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>GRADE</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>DATE</th>
              </tr>
            </thead>
            <tbody>
              {studentGrades.map((grade, idx) => (
                <tr key={idx} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3" style={{ fontSize: "0.875rem" }}>{grade.subject}</td>
                  <td className="px-4 py-3" style={{ fontSize: "0.875rem" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(grade.score / grade.maxScore) * 100}%` }}
                        />
                      </div>
                      <span>{grade.score}/{grade.maxScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(grade.grade)}`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: "0.875rem" }}>{grade.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "attendance" && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 style={{ fontSize: "1rem", fontWeight: 600 }} className="mb-4">Attendance Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">115</p>
                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Days Present</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">6</p>
                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Days Absent</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">8</p>
                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Days Late</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Monthly Breakdown</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>MONTH</th>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>PRESENT</th>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>ABSENT</th>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>LATE</th>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>ATTENDANCE</th>
                </tr>
              </thead>
              <tbody>
                {studentAttendance.map((record, idx) => {
                  const total = record.present + record.absent + record.late;
                  const percentage = Math.round((record.present / total) * 100);
                  return (
                    <tr key={idx} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3" style={{ fontSize: "0.875rem" }}>{record.month}</td>
                      <td className="px-4 py-3 text-green-600" style={{ fontSize: "0.875rem" }}>{record.present}</td>
                      <td className="px-4 py-3 text-red-600" style={{ fontSize: "0.875rem" }}>{record.absent}</td>
                      <td className="px-4 py-3 text-amber-600" style={{ fontSize: "0.875rem" }}>{record.late}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                percentage >= 90 ? "bg-green-500" : percentage >= 75 ? "bg-amber-500" : "bg-red-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span style={{ fontSize: "0.875rem" }}>{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Assignments</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>TITLE</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>SUBJECT</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>DUE DATE</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>STATUS</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>GRADE</th>
              </tr>
            </thead>
            <tbody>
              {studentAssignments.map((assignment) => (
                <tr key={assignment.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3" style={{ fontSize: "0.875rem" }}>{assignment.title}</td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: "0.875rem" }}>{assignment.subject}</td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: "0.875rem" }}>{assignment.dueDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {assignment.grade ? (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(assignment.grade)}`}>
                        {assignment.grade}
                      </span>
                    ) : (
                      <span className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
              No documents uploaded yet
            </p>
            <button
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
              style={{ fontSize: "0.875rem" }}
            >
              Upload Document
            </button>
          </div>
        </div>
      )}

      {/* Save button when editing */}
      {isEditing && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 shadow-lg disabled:opacity-60"
            style={{ fontSize: "0.875rem" }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
