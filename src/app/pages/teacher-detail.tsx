import { useState } from "react";
import { useOutletContext, useParams, Link } from "react-router";
import {
  User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, Loader2,
  ArrowLeft, Award, BookOpen, Clock, Users, AlertCircle, CheckCircle,
  MessageSquare, FileText, Download, MoreVertical, GraduationCap
} from "lucide-react";
import { type Role, teachers, assignments, grades } from "../data/mock-data";

// Sample data
const teacherClasses = [
  { name: "Grade 9 - Section A", subject: "Mathematics", students: 28 },
  { name: "Grade 9 - Section B", subject: "Mathematics", students: 25 },
  { name: "Grade 10 - Section A", subject: "Mathematics", students: 30 },
];

const teacherSchedule = [
  { day: "Monday", periods: ["Period 1 - Grade 9-A", "Period 2 - Grade 9-B", "Period 4 - Grade 10-A", "Period 5 - Grade 10-A"] },
  { day: "Tuesday", periods: ["Period 1 - Grade 9-A", "Period 3 - Grade 9-B", "Period 6 - Grade 10-A"] },
  { day: "Wednesday", periods: ["Period 2 - Grade 9-A", "Period 4 - Grade 9-B", "Period 5 - Grade 10-A", "Period 7 - Grade 10-A"] },
  { day: "Thursday", periods: ["Period 1 - Grade 9-A", "Period 3 - Grade 9-B", "Period 6 - Grade 10-A"] },
  { day: "Friday", periods: ["Period 2 - Grade 9-A", "Period 4 - Grade 9-B", "Period 5 - Grade 10-A"] },
];

const teacherAssignments = [
  { id: 1, title: "Quadratic Equations Test", class: "Grade 9-A", subject: "Mathematics", dueDate: "2026-03-01", submissions: 25, total: 28 },
  { id: 2, title: "Algebra Homework Ch.5", class: "Grade 9-B", subject: "Mathematics", dueDate: "2026-02-28", submissions: 22, total: 25 },
  { id: 3, title: "Calculus Quiz", class: "Grade 10-A", subject: "Mathematics", dueDate: "2026-03-05", submissions: 0, total: 30 },
];

export default function TeacherDetailPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const { id } = useParams();
  
  // Use first teacher as demo
  const teacher = teachers[0];
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "classes", label: "Classes" },
    { id: "schedule", label: "Schedule" },
    { id: "assignments", label: "Assignments" },
    { id: "performance", label: "Performance" },
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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <Link
        to="/teachers"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        style={{ fontSize: "0.875rem" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Teachers
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-2xl font-semibold text-primary">
              {teacher.name.split(" ").filter(n => n !== "Mr." && n !== "Ms.").map(n => n[0]).join("")}
            </span>
          </div>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>{teacher.name}</h1>
            <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
              {teacher.department} Department
            </p>
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                <CheckCircle className="w-3 h-3" />
                Active
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
                Teacher
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
            <Users className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Total Students</span>
          </div>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>83</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>across 3 classes</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Subjects</span>
          </div>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{teacher.subjects.length}</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>taught</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Periods/Week</span>
          </div>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>20</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>teaching hours</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Avg. Grade</span>
          </div>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>B+</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>class average</p>
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
                <p style={{ fontSize: "0.9375rem" }}>{teacher.name}</p>
              </div>
              <div>
                <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Email</label>
                <p style={{ fontSize: "0.9375rem" }}>{teacher.email}</p>
              </div>
              <div>
                <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Department</label>
                <p style={{ fontSize: "0.9375rem" }}>{teacher.department}</p>
              </div>
              <div>
                <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Subjects</label>
                <p style={{ fontSize: "0.9375rem" }}>{teacher.subjects.join(", ")}</p>
              </div>
              <div>
                <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Assigned Classes</label>
                <p style={{ fontSize: "0.9375rem" }}>{teacher.classes.join(", ")}</p>
              </div>
              <div>
                <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Status</label>
                <p style={{ fontSize: "0.9375rem" }} className="capitalize">{teacher.status}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 style={{ fontSize: "1rem", fontWeight: 600 }} className="mb-4">This Week</h3>
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Classes</p>
                <p style={{ fontSize: "1.25rem", fontWeight: 600 }}>15</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Assignments to Grade</p>
                <p style={{ fontSize: "1.25rem", fontWeight: 600 }}>8</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Messages</p>
                <p style={{ fontSize: "1.25rem", fontWeight: 600 }}>3</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "classes" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Assigned Classes</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>CLASS</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>SUBJECT</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>STUDENTS</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>AVG GRADE</th>
              </tr>
            </thead>
            <tbody>
              {teacherClasses.map((cls, idx) => (
                <tr key={idx} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3" style={{ fontSize: "0.875rem" }}>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span style={{ fontWeight: 500 }}>{cls.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: "0.875rem" }}>{cls.subject}</td>
                  <td className="px-4 py-3" style={{ fontSize: "0.875rem" }}>{cls.students}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium">B+</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "schedule" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Weekly Schedule</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>DAY</th>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>PERIODS</th>
                </tr>
              </thead>
              <tbody>
                {teacherSchedule.map((day, idx) => (
                  <tr key={idx} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{day.day}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {day.periods.map((period, pIdx) => (
                          <span key={pIdx} className="px-2 py-1 bg-muted rounded text-xs">{period}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Recent Assignments</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>TITLE</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>CLASS</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>DUE DATE</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>SUBMISSIONS</th>
              </tr>
            </thead>
            <tbody>
              {teacherAssignments.map((assignment) => (
                <tr key={assignment.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3" style={{ fontSize: "0.875rem" }}>
                    <span style={{ fontWeight: 500 }}>{assignment.title}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: "0.875rem" }}>{assignment.class}</td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: "0.875rem" }}>{assignment.dueDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}
                        />
                      </div>
                      <span style={{ fontSize: "0.8125rem" }}>{assignment.submissions}/{assignment.total}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "performance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 style={{ fontSize: "1rem", fontWeight: 600 }} className="mb-4">Grade Distribution</h3>
            <div className="space-y-3">
              {["A (25%)", "B+ (35%)", "B (20%)", "C (15%)", "D (5%)"].map((grade, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-8 text-sm">{grade.split(" ")[0]}</span>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: grade.split(" ")[1].replace("%", "") + "%" }}
                    />
                  </div>
                  <span className="w-10 text-right text-muted-foreground text-sm">{grade.split(" ")[1]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 style={{ fontSize: "1rem", fontWeight: 600 }} className="mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>Assignment Completion</span>
                  <span style={{ fontSize: "0.8125rem" }}>92%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "92%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>On-time Grading</span>
                  <span style={{ fontSize: "0.8125rem" }}>88%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "88%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>Student Satisfaction</span>
                  <span style={{ fontSize: "0.8125rem" }}>4.5/5</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "90%" }} />
                </div>
              </div>
            </div>
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
