import { useState, useMemo } from "react";
import { useOutletContext } from "react-router";
import { Plus, Upload, Download, X, Users, GraduationCap, Filter, ChevronDown, ChevronRight, Search, UserPlus } from "lucide-react";
import { DataTable } from "../components/data-table";
import { StatusBadge } from "../components/status-badge";
import { EmptyState } from "../components/empty-state";
import { students, classes } from "../data/mock-data";
import type { Student, Role } from "../types";

// Helper to calculate age from dateOfBirth
const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Get grade level from student's class
const getStudentGradeLevel = (student: Student): number => {
  const studentClass = classes.find(c => c.id === student.classId);
  return studentClass?.level || 0;
};

// Year groups derived from classes data - computed once at module load time
const YEAR_GROUPS = (() => {
  const levels = [...new Set(classes.map(c => c.level))].sort((a, b) => a - b);
  return levels.map(level => ({
    level,
    name: `Year ${level}`,
    sections: classes.filter(c => c.level === level).map(c => c.section),
  }));
})();

// Filter options
const GENDER_OPTIONS = ["all", "male", "female", "other"] as const;
const AGE_RANGE_OPTIONS = [
  { value: "all", label: "All Ages" },
  { value: "11-13", label: "11-13 years" },
  { value: "14-15", label: "14-15 years" },
  { value: "16-18", label: "16-18 years" },
] as const;
const GRADE_LEVEL_OPTIONS = ["all", "7", "8", "9", "10", "11", "12"] as const;
const ATTENDANCE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "excellent", label: "Excellent (90%+)", min: 90 },
  { value: "good", label: "Good (75-89%)", min: 75, max: 89 },
  { value: "poor", label: "Poor (<75%)", max: 74 },
] as const;
const ENROLLMENT_OPTIONS = ["all", "active", "inactive", "suspended"] as const;

export default function StudentsPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeView, setActiveView] = useState<"all" | "year-groups">("all");
  const [selectedYearGroup, setSelectedYearGroup] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);

  // Filter states
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [ageRangeFilter, setAgeRangeFilter] = useState<string>("all");
  const [gradeLevelFilter, setGradeLevelFilter] = useState<string>("all");
  const [attendanceFilter, setAttendanceFilter] = useState<string>("all");
  const [enrollmentFilter, setEnrollmentFilter] = useState<string>("all");

  // Filter students based on all criteria
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Year group filter
      if (selectedYearGroup !== null) {
        const studentGrade = getStudentGradeLevel(student);
        if (studentGrade !== selectedYearGroup) return false;
      }

      // Section filter
      if (selectedSection !== null) {
        if (student.section !== selectedSection) return false;
      }

      // Gender filter
      if (genderFilter !== "all" && student.gender !== genderFilter) return false;

      // Age range filter
      if (ageRangeFilter !== "all") {
        const age = calculateAge(student.dateOfBirth);
        switch (ageRangeFilter) {
          case "11-13":
            if (age < 11 || age > 13) return false;
            break;
          case "14-15":
            if (age < 14 || age > 15) return false;
            break;
          case "16-18":
            if (age < 16 || age > 18) return false;
            break;
        }
      }

      // Grade level filter
      if (gradeLevelFilter !== "all") {
        const studentGrade = getStudentGradeLevel(student);
        if (studentGrade !== parseInt(gradeLevelFilter)) return false;
      }

          // Attendance filter
          if (attendanceFilter !== "all") {
            switch (attendanceFilter) {
              case "excellent":
                if (student.attendancePercent < 90) return false;
                break;
              case "good":
                if (student.attendancePercent < 75 || student.attendancePercent > 89) return false;
                break;
              case "poor":
                if (student.attendancePercent >= 75) return false;
                break;
            }
          }

      // Enrollment status filter
      if (enrollmentFilter !== "all" && student.status !== enrollmentFilter) return false;

      return true;
    });
  }, [selectedYearGroup, selectedSection, genderFilter, ageRangeFilter, gradeLevelFilter, attendanceFilter, enrollmentFilter]);

  // Get sections for selected year group
  const availableSections = useMemo(() => {
    if (selectedYearGroup === null) return [];
    return classes.filter(c => c.level === selectedYearGroup).map(c => c.section);
  }, [selectedYearGroup]);

  // Stats for display
  const stats = useMemo(() => ({
    total: filteredStudents.length,
    byGender: {
      male: filteredStudents.filter(s => s.gender === "male").length,
      female: filteredStudents.filter(s => s.gender === "female").length,
      other: filteredStudents.filter(s => s.gender === "other").length,
    },
    avgAttendance: filteredStudents.length > 0
      ? Math.round(filteredStudents.reduce((sum, s) => sum + s.attendancePercent, 0) / filteredStudents.length)
      : 0,
    avgGpa: filteredStudents.length > 0
      ? (filteredStudents.reduce((sum, s) => sum + s.gpa, 0) / filteredStudents.length).toFixed(2)
      : "0.00",
  }), [filteredStudents]);

  const columns = [
    {
      key: "name",
      label: "Student",
      render: (s: Student) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>
              {s.name.split(" ").map((n: string) => n[0]).join("")}
            </span>
          </div>
          <div>
            <p style={{ fontWeight: 500 }}>{s.name}</p>
            <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{s.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "grade",
      label: "Class",
      render: (s: Student) => {
        const grade = getStudentGradeLevel(s);
        return <span>Year {grade}-{s.section}</span>;
      },
    },
    {
      key: "age",
      label: "Age",
      render: (s: Student) => <span className="text-muted-foreground">{calculateAge(s.dateOfBirth)}</span>,
    },
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
    { key: "gpa", label: "GPA", render: (s: Student) => <span style={{ fontWeight: 500 }}>{s.gpa.toFixed(2)}</span> },
    {
      key: "gender",
      label: "Gender",
      render: (s: Student) => (
        <span className="capitalize px-2 py-0.5 rounded-full bg-muted text-muted-foreground" style={{ fontSize: "0.75rem" }}>
          {s.gender}
        </span>
      ),
    },
    { key: "status", label: "Status", render: (s: Student) => <StatusBadge status={s.status} /> },
  ];

  const hasActiveFilters = genderFilter !== "all" || ageRangeFilter !== "all" || gradeLevelFilter !== "all" ||
    attendanceFilter !== "all" || enrollmentFilter !== "all";

  const clearFilters = () => {
    setGenderFilter("all");
    setAgeRangeFilter("all");
    setGradeLevelFilter("all");
    setAttendanceFilter("all");
    setEnrollmentFilter("all");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1>{role === "teacher" ? "My Classes" : "Students"}</h1>
        <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
          {role === "admin" ? "Manage student records, enrollment, and academic progress." : "View students in your assigned classes."}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Total Students</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Avg Attendance</p>
          <p className={stats.avgAttendance >= 90 ? "text-green-600" : stats.avgAttendance >= 75 ? "text-amber-600" : "text-red-600"} style={{ fontSize: "1.5rem", fontWeight: 600 }}>
            {stats.avgAttendance}%
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Avg GPA</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{stats.avgGpa}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Gender Split</p>
          <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>
            M: {stats.byGender.male} | F: {stats.byGender.female}
          </p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => {
              setActiveView("all");
              setSelectedYearGroup(null);
              setSelectedSection(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeView === "all"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            <Users className="w-4 h-4" /> All Students
          </button>
          <button
            onClick={() => setActiveView("year-groups")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeView === "year-groups"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            <GraduationCap className="w-4 h-4" /> Year Groups
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              showFilters || hasActiveFilters
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-muted"
            }`}
            style={{ fontSize: "0.875rem" }}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
                {[genderFilter, ageRangeFilter, gradeLevelFilter, attendanceFilter, enrollmentFilter]
                  .filter(f => f !== "all").length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Year Groups Selector */}
      {activeView === "year-groups" && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => {
                setSelectedYearGroup(null);
                setSelectedSection(null);
              }}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedYearGroup === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-muted bg-card"
              }`}
              style={{ fontSize: "0.875rem" }}
            >
              All Years
            </button>
            {YEAR_GROUPS.map((year) => (
              <button
                key={year.level}
                onClick={() => {
                  setSelectedYearGroup(year.level);
                  setSelectedSection(null);
                }}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedYearGroup === year.level
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-muted bg-card"
                }`}
                style={{ fontSize: "0.875rem" }}
              >
                {year.name}
              </button>
            ))}
          </div>

          {/* Sections for selected year */}
          {selectedYearGroup !== null && availableSections.length > 0 && (
            <div className="flex flex-wrap gap-2 pl-0 sm:pl-4 border-l-2 border-primary/20">
              <button
                onClick={() => setSelectedSection(null)}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  selectedSection === null
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "border-border hover:bg-muted bg-card"
                }`}
                style={{ fontSize: "0.8125rem" }}
              >
                All Sections
              </button>
              {availableSections.map((section) => (
                <button
                  key={section}
                  onClick={() => setSelectedSection(section)}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    selectedSection === section
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "border-border hover:bg-muted bg-card"
                  }`}
                  style={{ fontSize: "0.8125rem" }}
                >
                  {selectedYearGroup}{section}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: "0.875rem", fontWeight: 500 }}>Filter Students</h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  style={{ fontSize: "0.75rem" }}
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 rounded-md hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Gender Filter */}
            <div>
              <label className="block text-muted-foreground mb-1" style={{ fontSize: "0.75rem" }}>Gender</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background"
                style={{ fontSize: "0.8125rem" }}
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Age Range Filter */}
            <div>
              <label className="block text-muted-foreground mb-1" style={{ fontSize: "0.75rem" }}>Age Range</label>
              <select
                value={ageRangeFilter}
                onChange={(e) => setAgeRangeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background"
                style={{ fontSize: "0.8125rem" }}
              >
                {AGE_RANGE_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>

            {/* Grade Level Filter */}
            <div>
              <label className="block text-muted-foreground mb-1" style={{ fontSize: "0.75rem" }}>Grade Level</label>
              <select
                value={gradeLevelFilter}
                onChange={(e) => setGradeLevelFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background"
                style={{ fontSize: "0.8125rem" }}
              >
                {GRADE_LEVEL_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g === "all" ? "All Grades" : `Year ${g}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Attendance Filter */}
            <div>
              <label className="block text-muted-foreground mb-1" style={{ fontSize: "0.75rem" }}>Attendance</label>
              <select
                value={attendanceFilter}
                onChange={(e) => setAttendanceFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background"
                style={{ fontSize: "0.8125rem" }}
              >
                {ATTENDANCE_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>

            {/* Enrollment Status Filter */}
            <div>
              <label className="block text-muted-foreground mb-1" style={{ fontSize: "0.75rem" }}>Status</label>
              <select
                value={enrollmentFilter}
                onChange={(e) => setEnrollmentFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background"
                style={{ fontSize: "0.8125rem" }}
              >
                {ENROLLMENT_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Active filters:</span>
          {genderFilter !== "all" && (
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs flex items-center gap-1">
              Gender: {genderFilter}
              <button onClick={() => setGenderFilter("all")} className="hover:text-primary/70"><X className="w-3 h-3" /></button>
            </span>
          )}
          {ageRangeFilter !== "all" && (
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs flex items-center gap-1">
              Age: {AGE_RANGE_OPTIONS.find(a => a.value === ageRangeFilter)?.label}
              <button onClick={() => setAgeRangeFilter("all")} className="hover:text-primary/70"><X className="w-3 h-3" /></button>
            </span>
          )}
          {gradeLevelFilter !== "all" && (
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs flex items-center gap-1">
              Grade: Year {gradeLevelFilter}
              <button onClick={() => setGradeLevelFilter("all")} className="hover:text-primary/70"><X className="w-3 h-3" /></button>
            </span>
          )}
          {attendanceFilter !== "all" && (
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs flex items-center gap-1">
              Attendance: {ATTENDANCE_OPTIONS.find(a => a.value === attendanceFilter)?.label}
              <button onClick={() => setAttendanceFilter("all")} className="hover:text-primary/70"><X className="w-3 h-3" /></button>
            </span>
          )}
          {enrollmentFilter !== "all" && (
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs flex items-center gap-1">
              Status: {enrollmentFilter}
              <button onClick={() => setEnrollmentFilter("all")} className="hover:text-primary/70"><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      )}

      {/* Data Table */}
      <DataTable
        data={filteredStudents}
        columns={columns}
        searchKey={(s) => `${s.name} ${s.email} ${s.rollNo} ${getStudentGradeLevel(s)}`}
        searchPlaceholder="Search students by name, email, or roll number..."
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[10, 25, 50, 100]}
        actions={
          role === "admin" ? (
            <>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                style={{ fontSize: "0.875rem" }}
              >
                <UserPlus className="w-4 h-4" /> Add Student
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
            title="No students found"
            description={hasActiveFilters ? "Try adjusting your filters to see more results." : "Add students individually or import them in bulk using a CSV file."}
            action={
              role === "admin" && !hasActiveFilters ? (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground"
                  style={{ fontSize: "0.875rem" }}
                >
                  <Plus className="w-4 h-4" /> Add First Student
                </button>
              ) : hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted"
                  style={{ fontSize: "0.875rem" }}
                >
                  <Filter className="w-4 h-4" /> Clear Filters
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
                    <option>Year 10</option>
                    <option>Year 11</option>
                    <option>Year 12</option>
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
