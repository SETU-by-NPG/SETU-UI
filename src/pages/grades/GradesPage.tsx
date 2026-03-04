import { useState } from "react";
import { GraduationCap, Plus, X, BarChart2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { GradeBarChart } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GradeRow {
  id: string;
  student: string;
  subject: string;
  assessment: string;
  grade: string;
  mark: number;
  maxMark: number;
  teacher: string;
  date: string;
  comments: string;
}

interface ClassSummary {
  id: string;
  className: string;
  subject: string;
  students: number;
  avgGrade: string;
  avgMark: number;
  lastUpdated: string;
}

interface SubjectSummary {
  subject: string;
  avgMark: number;
  gradeDistribution: { grade: string; count: number }[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const GRADES: GradeRow[] = [
  {
    id: "g01",
    student: "Aisha Patel",
    subject: "Mathematics",
    assessment: "Mid-term Test",
    grade: "A",
    mark: 87,
    maxMark: 100,
    teacher: "Mr Ahmed",
    date: "2024-11-15",
    comments: "Excellent algebra work",
  },
  {
    id: "g02",
    student: "Ben Thompson",
    subject: "Mathematics",
    assessment: "Mid-term Test",
    grade: "B",
    mark: 74,
    maxMark: 100,
    teacher: "Mr Ahmed",
    date: "2024-11-15",
    comments: "",
  },
  {
    id: "g03",
    student: "Callum Harris",
    subject: "Mathematics",
    assessment: "Mid-term Test",
    grade: "C",
    mark: 61,
    maxMark: 100,
    teacher: "Mr Ahmed",
    date: "2024-11-15",
    comments: "Needs help with fractions",
  },
  {
    id: "g04",
    student: "Danielle Morgan",
    subject: "English",
    assessment: "Essay Assignment",
    grade: "A*",
    mark: 94,
    maxMark: 100,
    teacher: "Ms Clarke",
    date: "2024-11-14",
    comments: "Outstanding analysis",
  },
  {
    id: "g05",
    student: "Ethan Clarke",
    subject: "English",
    assessment: "Essay Assignment",
    grade: "B",
    mark: 72,
    maxMark: 100,
    teacher: "Ms Clarke",
    date: "2024-11-14",
    comments: "",
  },
  {
    id: "g06",
    student: "Fatima Al-Said",
    subject: "Science",
    assessment: "Practical Report",
    grade: "A",
    mark: 89,
    maxMark: 100,
    teacher: "Dr Patel",
    date: "2024-11-13",
    comments: "Great experimental technique",
  },
  {
    id: "g07",
    student: "George Bennett",
    subject: "Science",
    assessment: "Practical Report",
    grade: "C",
    mark: 62,
    maxMark: 100,
    teacher: "Dr Patel",
    date: "2024-11-13",
    comments: "Report structure needs work",
  },
  {
    id: "g08",
    student: "Hannah Wright",
    subject: "History",
    assessment: "Source Analysis",
    grade: "B",
    mark: 75,
    maxMark: 100,
    teacher: "Mr Brown",
    date: "2024-11-12",
    comments: "",
  },
  {
    id: "g09",
    student: "Isaac Johnson",
    subject: "Mathematics",
    assessment: "Mid-term Test",
    grade: "A",
    mark: 91,
    maxMark: 100,
    teacher: "Mr Ahmed",
    date: "2024-11-15",
    comments: "Top of the class",
  },
  {
    id: "g10",
    student: "Jasmine Lee",
    subject: "English",
    assessment: "Essay Assignment",
    grade: "A",
    mark: 86,
    maxMark: 100,
    teacher: "Ms Clarke",
    date: "2024-11-14",
    comments: "",
  },
  {
    id: "g11",
    student: "Kyle Adams",
    subject: "Science",
    assessment: "Practical Report",
    grade: "D",
    mark: 51,
    maxMark: 100,
    teacher: "Dr Patel",
    date: "2024-11-13",
    comments: "Needs extra support",
  },
  {
    id: "g12",
    student: "Layla Hassan",
    subject: "Mathematics",
    assessment: "Mid-term Test",
    grade: "B",
    mark: 78,
    maxMark: 100,
    teacher: "Mr Ahmed",
    date: "2024-11-15",
    comments: "",
  },
  {
    id: "g13",
    student: "Marcus White",
    subject: "History",
    assessment: "Source Analysis",
    grade: "A",
    mark: 88,
    maxMark: 100,
    teacher: "Mr Brown",
    date: "2024-11-12",
    comments: "Excellent contextualisation",
  },
  {
    id: "g14",
    student: "Nadia Kowalski",
    subject: "English",
    assessment: "Essay Assignment",
    grade: "C",
    mark: 65,
    maxMark: 100,
    teacher: "Ms Clarke",
    date: "2024-11-14",
    comments: "",
  },
  {
    id: "g15",
    student: "Oscar Davies",
    subject: "Science",
    assessment: "Practical Report",
    grade: "B",
    mark: 77,
    maxMark: 100,
    teacher: "Dr Patel",
    date: "2024-11-13",
    comments: "",
  },
];

const CLASS_SUMMARIES: ClassSummary[] = [
  {
    id: "cs1",
    className: "7A",
    subject: "Mathematics",
    students: 30,
    avgGrade: "B",
    avgMark: 76.4,
    lastUpdated: "2024-11-15",
  },
  {
    id: "cs2",
    className: "8B",
    subject: "Mathematics",
    students: 32,
    avgGrade: "B",
    avgMark: 74.2,
    lastUpdated: "2024-11-14",
  },
  {
    id: "cs3",
    className: "9A",
    subject: "Mathematics",
    students: 28,
    avgGrade: "A",
    avgMark: 82.1,
    lastUpdated: "2024-11-13",
  },
  {
    id: "cs4",
    className: "10A",
    subject: "Mathematics",
    students: 31,
    avgGrade: "B",
    avgMark: 78.6,
    lastUpdated: "2024-11-12",
  },
];

const SUBJECT_SUMMARIES: SubjectSummary[] = [
  {
    subject: "Mathematics",
    avgMark: 77.3,
    gradeDistribution: [
      { grade: "A*", count: 4 },
      { grade: "A", count: 18 },
      { grade: "B", count: 24 },
      { grade: "C", count: 16 },
      { grade: "D", count: 8 },
      { grade: "E", count: 3 },
      { grade: "U", count: 1 },
    ],
  },
  {
    subject: "English",
    avgMark: 74.8,
    gradeDistribution: [
      { grade: "A*", count: 6 },
      { grade: "A", count: 20 },
      { grade: "B", count: 22 },
      { grade: "C", count: 12 },
      { grade: "D", count: 5 },
      { grade: "E", count: 2 },
      { grade: "U", count: 0 },
    ],
  },
  {
    subject: "Science",
    avgMark: 71.2,
    gradeDistribution: [
      { grade: "A*", count: 3 },
      { grade: "A", count: 14 },
      { grade: "B", count: 26 },
      { grade: "C", count: 18 },
      { grade: "D", count: 10 },
      { grade: "E", count: 4 },
      { grade: "U", count: 1 },
    ],
  },
];

const YEAR_GROUPS = ["All", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11"];
const SUBJECTS = [
  "All Subjects",
  "Mathematics",
  "English",
  "Science",
  "History",
  "Geography",
  "French",
];
const ASSESSMENT_TYPES = [
  "All Types",
  "Mid-term Test",
  "End of Term Exam",
  "Essay Assignment",
  "Practical Report",
  "Source Analysis",
  "Project",
];

const GRADE_BADGE: Record<string, string> = {
  "A*": "bg-purple-100 text-purple-700 border-purple-200",
  A: "bg-blue-100 text-blue-700 border-blue-200",
  B: "bg-green-100 text-green-700 border-green-200",
  C: "bg-amber-100 text-amber-700 border-amber-200",
  D: "bg-orange-100 text-orange-700 border-orange-200",
  E: "bg-red-100 text-red-700 border-red-200",
  U: "bg-gray-100 text-gray-600 border-gray-200",
};

// ─── Column definitions ───────────────────────────────────────────────────────

const gradeColumns: ColumnDef<GradeRow>[] = [
  { accessorKey: "student", header: "Student" },
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "assessment", header: "Assessment" },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex px-2 py-0.5 rounded border text-xs font-bold",
          GRADE_BADGE[row.original.grade] ?? "bg-gray-100 text-gray-700",
        )}
      >
        {row.original.grade}
      </span>
    ),
  },
  {
    accessorKey: "mark",
    header: "Mark",
    cell: ({ row }) => `${row.original.mark} / ${row.original.maxMark}`,
  },
  { accessorKey: "teacher", header: "Teacher" },
  { accessorKey: "date", header: "Date" },
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => (
      <span
        className="text-xs text-gray-500 truncate max-w-[160px] inline-block"
        title={row.original.comments}
      >
        {row.original.comments || "—"}
      </span>
    ),
  },
];

// ─── Enter Grades Dialog ───────────────────────────────────────────────────────

interface EnterGradesDialogProps {
  open: boolean;
  onClose: () => void;
}

const DIALOG_STUDENTS = [
  "Aisha Patel",
  "Ben Thompson",
  "Callum Harris",
  "Danielle Morgan",
  "Ethan Clarke",
  "Fatima Al-Said",
  "George Bennett",
  "Hannah Wright",
];

function EnterGradesDialog({ open, onClose }: EnterGradesDialogProps) {
  const [marks, setMarks] = useState<Record<string, string>>({});
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Enter Grades — 7A Mathematics Mid-term Test</DialogTitle>
        </DialogHeader>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-3 text-xs font-semibold text-gray-500 uppercase px-2 py-1 bg-gray-50 rounded">
            <span>Student</span>
            <span>Mark / 100</span>
            <span>Grade</span>
          </div>
          {DIALOG_STUDENTS.map((name) => {
            const m = parseInt(marks[name] ?? "", 10);
            const grade =
              m >= 90
                ? "A*"
                : m >= 80
                  ? "A"
                  : m >= 70
                    ? "B"
                    : m >= 60
                      ? "C"
                      : m >= 50
                        ? "D"
                        : m >= 40
                          ? "E"
                          : isNaN(m)
                            ? "—"
                            : "U";
            return (
              <div
                key={name}
                className="grid grid-cols-3 items-center px-2 py-1.5 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm text-gray-800">{name}</span>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0-100"
                  className="h-7 w-24 text-sm"
                  value={marks[name] ?? ""}
                  onChange={(e) =>
                    setMarks((prev) => ({ ...prev, [name]: e.target.value }))
                  }
                />
                <span
                  className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded border inline-flex w-fit",
                    GRADE_BADGE[grade] ?? "bg-gray-100 text-gray-700",
                  )}
                >
                  {grade}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save Grades</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GradesPage() {
  const { role } = useAuthStore();
  const isTeacher = role === "TEACHER";

  const [yearFilter, setYearFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [assessmentFilter, setAssessmentFilter] = useState("All Types");
  const [enterGradesOpen, setEnterGradesOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");

  const filteredGrades = GRADES.filter((g) => {
    if (subjectFilter !== "All Subjects" && g.subject !== subjectFilter)
      return false;
    if (assessmentFilter !== "All Types" && g.assessment !== assessmentFilter)
      return false;
    return true;
  });

  const currentSubjectSummary =
    SUBJECT_SUMMARIES.find((s) => s.subject === selectedSubject) ??
    SUBJECT_SUMMARIES[0];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Grades & Assessments"
        subtitle="Track student performance and assessments"
        icon={GraduationCap}
        iconColor="bg-purple-600"
        actions={[
          {
            label: "Enter Grades",
            icon: Plus,
            onClick: () => setEnterGradesOpen(true),
          },
        ]}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap bg-white border border-gray-200 rounded-xl p-3">
          <span className="text-sm font-medium text-gray-600">Filter:</span>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="h-8 w-36 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEAR_GROUPS.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="h-8 w-44 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={assessmentFilter} onValueChange={setAssessmentFilter}>
            <SelectTrigger className="h-8 w-48 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASSESSMENT_TYPES.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(yearFilter !== "All" ||
            subjectFilter !== "All Subjects" ||
            assessmentFilter !== "All Types") && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-gray-500"
              onClick={() => {
                setYearFilter("All");
                setSubjectFilter("All Subjects");
                setAssessmentFilter("All Types");
              }}
            >
              <X className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>

        {/* Teacher view: class cards */}
        {isTeacher && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CLASS_SUMMARIES.map((cls) => (
              <Card key={cls.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {cls.className}
                    </p>
                    <p className="text-xs text-gray-500">{cls.subject}</p>
                  </div>
                  <span
                    className={cn(
                      "text-lg font-bold px-2 py-0.5 rounded border",
                      GRADE_BADGE[cls.avgGrade] ?? "",
                    )}
                  >
                    {cls.avgGrade}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {cls.students} students · avg {cls.avgMark.toFixed(1)}%
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-7 text-xs"
                  onClick={() => setEnterGradesOpen(true)}
                >
                  Enter Grades
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* Admin / HOD view: grade distribution per subject */}
        {!isTeacher && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-purple-500" />
                  Grade Distribution
                </h3>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger className="h-7 w-36 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECT_SUMMARIES.map((s) => (
                      <SelectItem key={s.subject} value={s.subject}>
                        {s.subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <GradeBarChart
                data={currentSubjectSummary.gradeDistribution}
                height={200}
              />
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Subject Averages
              </h3>
              <div className="space-y-3">
                {SUBJECT_SUMMARIES.map((s) => (
                  <div
                    key={s.subject}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">{s.subject}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${s.avgMark}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                        {s.avgMark.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Grades table */}
        <DataTable
          columns={gradeColumns}
          data={filteredGrades}
          searchPlaceholder="Search students, subjects..."
          emptyMessage="No grades found for the selected filters"
          toolbar={
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEnterGradesOpen(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Enter Grades
            </Button>
          }
        />
      </div>

      <EnterGradesDialog
        open={enterGradesOpen}
        onClose={() => setEnterGradesOpen(false)}
      />
    </div>
  );
}
