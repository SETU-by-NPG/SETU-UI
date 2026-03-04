import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  Download,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Star,
  Heart,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { StatCard, StatusBadge } from "@/components/shared";
import { GradeBarChart } from "@/components/charts";

// ─── Mock Full Student Data ────────────────────────────────────────────────────

interface MockStudent {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  upn: string;
  yearGroup: string;
  formClass: string;
  dateOfBirth: string;
  gender: string;
  ethnicity: string;
  nationality: string;
  firstLanguage: string;
  eal: boolean;
  status: "ACTIVE" | "WITHDRAWN";
  admissionDate: string;
  address: { line1: string; line2?: string; city: string; postcode: string };
  email: string;
  phone?: string;
  hasSEN: boolean;
  senType: string | null;
  senNeeds: string[];
  hasEHCP: boolean;
  ehcpReviewDate?: string;
  currentProvisions: string[];
  pupilPremium: boolean;
  lookedAfterChild: boolean;
  fsmEligible: boolean;
  medicalNotes?: string;
  allergies: string[];
  attendance: number;
  meritPoints: number;
  incidentsCount: number;
  guardians: Array<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
    isPrimary: boolean;
  }>;
  attendanceCalendar: Array<{
    date: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" | "WEEKEND";
  }>;
  grades: Array<{
    subject: string;
    teacher: string;
    currentGrade: string;
    targetGrade: string;
    comment: string;
  }>;
  incidents: Array<{
    date: string;
    type: string;
    description: string;
    teacher: string;
    outcome: string;
  }>;
  rewards: Array<{
    date: string;
    type: string;
    description: string;
    teacher: string;
    points: number;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    date: string;
    size: string;
  }>;
}

// Generate last 4 weeks (Mon-Fri only)
function generateAttendanceCalendar() {
  const statuses: Array<"PRESENT" | "ABSENT" | "LATE" | "EXCUSED"> = [
    "PRESENT",
    "PRESENT",
    "PRESENT",
    "PRESENT",
    "PRESENT",
    "PRESENT",
    "PRESENT",
    "LATE",
    "PRESENT",
    "PRESENT",
    "ABSENT",
    "PRESENT",
    "PRESENT",
    "PRESENT",
    "PRESENT",
    "PRESENT",
    "PRESENT",
    "PRESENT",
    "EXCUSED",
    "PRESENT",
  ];
  const result: MockStudent["attendanceCalendar"] = [];
  const today = new Date("2026-03-04");
  // Roll back to last Monday
  const dayOfWeek = today.getDay(); // 0=Sun
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const startMonday = new Date(today);
  startMonday.setDate(today.getDate() - daysToMonday - 21); // 4 weeks back

  let statusIdx = 0;
  for (let week = 0; week < 4; week++) {
    for (let day = 0; day < 7; day++) {
      const d = new Date(startMonday);
      d.setDate(startMonday.getDate() + week * 7 + day);
      if (day >= 5) {
        result.push({ date: d.toISOString().slice(0, 10), status: "WEEKEND" });
      } else {
        result.push({
          date: d.toISOString().slice(0, 10),
          status: statuses[statusIdx++],
        });
      }
    }
  }
  return result;
}

const MOCK_STUDENT_FULL: MockStudent = {
  id: "s1",
  firstName: "Emma",
  lastName: "Thompson",
  preferredName: "Em",
  upn: "A820199011001",
  yearGroup: "Y7",
  formClass: "7A",
  dateOfBirth: "2013-06-14",
  gender: "Female",
  ethnicity: "White British",
  nationality: "British",
  firstLanguage: "English",
  eal: false,
  status: "ACTIVE",
  admissionDate: "2024-09-04",
  address: { line1: "14 Maple Street", city: "Bristol", postcode: "BS1 4JQ" },
  email: "e.thompson@student.setu.ac.uk",
  phone: undefined,
  hasSEN: false,
  senType: null,
  senNeeds: [],
  hasEHCP: false,
  pupilPremium: false,
  lookedAfterChild: false,
  fsmEligible: false,
  medicalNotes: undefined,
  allergies: [],
  attendance: 96.2,
  meritPoints: 47,
  incidentsCount: 1,
  currentProvisions: [],
  guardians: [
    {
      name: "Sarah Thompson",
      relationship: "Mother",
      phone: "07712 345 678",
      email: "sarah.thompson@email.com",
      isPrimary: true,
    },
    {
      name: "David Thompson",
      relationship: "Father",
      phone: "07799 123 456",
      email: "david.thompson@email.com",
      isPrimary: false,
    },
  ],
  attendanceCalendar: generateAttendanceCalendar(),
  grades: [
    {
      subject: "English",
      teacher: "Ms Clarke",
      currentGrade: "B",
      targetGrade: "A",
      comment: "Good progress. Focus on essay structure.",
    },
    {
      subject: "Maths",
      teacher: "Mr Patel",
      currentGrade: "A",
      targetGrade: "A*",
      comment: "Excellent algebra skills. Push for problem-solving.",
    },
    {
      subject: "Science",
      teacher: "Dr Hughes",
      currentGrade: "B",
      targetGrade: "B",
      comment: "Meeting expectations. Continue revision.",
    },
    {
      subject: "History",
      teacher: "Mrs Ford",
      currentGrade: "A*",
      targetGrade: "A",
      comment: "Exceptional analytical writing.",
    },
    {
      subject: "Geography",
      teacher: "Mr Bell",
      currentGrade: "B",
      targetGrade: "B",
      comment: "Solid understanding of case studies.",
    },
    {
      subject: "French",
      teacher: "Mme Dupont",
      currentGrade: "C",
      targetGrade: "B",
      comment: "Oral skills improving. More vocabulary work needed.",
    },
    {
      subject: "Art",
      teacher: "Ms Stone",
      currentGrade: "A",
      targetGrade: "A",
      comment: "Creative and technically strong.",
    },
    {
      subject: "PE",
      teacher: "Mr James",
      currentGrade: "A",
      targetGrade: "A",
      comment: "Outstanding attitude and performance.",
    },
  ],
  incidents: [
    {
      date: "2026-01-15",
      type: "Low-level disruption",
      description: "Talking during silent work in English lesson.",
      teacher: "Ms Clarke",
      outcome: "Verbal warning issued.",
    },
  ],
  rewards: [
    {
      date: "2026-02-10",
      type: "Achievement Point",
      description: "Outstanding work on History essay.",
      teacher: "Mrs Ford",
      points: 5,
    },
    {
      date: "2026-01-28",
      type: "Star of the Week",
      description: "Consistent effort across all subjects.",
      teacher: "Mr Patel",
      points: 10,
    },
    {
      date: "2026-01-12",
      type: "Achievement Point",
      description: "Excellent contribution in Science discussion.",
      teacher: "Dr Hughes",
      points: 5,
    },
    {
      date: "2025-12-05",
      type: "Head Teacher Award",
      description: "Exceptional end-of-term performance.",
      teacher: "Mrs Simmons",
      points: 20,
    },
  ],
  documents: [
    {
      id: "d1",
      name: "Admission Form",
      type: "PDF",
      date: "2024-09-04",
      size: "245 KB",
    },
    {
      id: "d2",
      name: "Home-School Agreement",
      type: "PDF",
      date: "2024-09-04",
      size: "156 KB",
    },
    {
      id: "d3",
      name: "Photo Consent Form",
      type: "PDF",
      date: "2024-09-04",
      size: "88 KB",
    },
    {
      id: "d4",
      name: "Emergency Contacts",
      type: "PDF",
      date: "2025-01-10",
      size: "112 KB",
    },
  ],
};

// Create a lookup - fall back to the same mock student for any id
function getStudentById(id: string): MockStudent {
  if (id === "s1") return MOCK_STUDENT_FULL;
  // Return a slightly modified version for other IDs
  return { ...MOCK_STUDENT_FULL, id, firstName: "Student", lastName: `#${id}` };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const ATTENDANCE_CELL_STYLE: Record<string, string> = {
  PRESENT: "bg-green-100 text-green-800",
  ABSENT: "bg-red-100  text-red-800",
  LATE: "bg-amber-100 text-amber-800",
  EXCUSED: "bg-blue-100  text-blue-800",
  WEEKEND: "bg-gray-50   text-gray-300",
};

const ATTENDANCE_LABEL: Record<string, string> = {
  PRESENT: "P",
  ABSENT: "A",
  LATE: "L",
  EXCUSED: "E",
  WEEKEND: "",
};

function buildGradeDistribution(grades: MockStudent["grades"]) {
  const counts: Record<string, number> = {};
  grades.forEach((g) => {
    counts[g.currentGrade] = (counts[g.currentGrade] ?? 0) + 1;
  });
  return ["A*", "A", "B", "C", "D"].map((g) => ({
    grade: g,
    count: counts[g] ?? 0,
  }));
}

// ─── Sub-tab components ────────────────────────────────────────────────────────

function OverviewTab({ student }: { student: MockStudent }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Attendance"
          value={`${student.attendance}%`}
          icon={TrendingUp}
          variant={
            student.attendance >= 95
              ? "success"
              : student.attendance >= 90
                ? "warning"
                : "danger"
          }
        />
        <StatCard
          title="Merit Points"
          value={student.meritPoints}
          icon={Star}
          variant="info"
        />
        <StatCard
          title="Incidents"
          value={student.incidentsCount}
          icon={AlertCircle}
          variant={
            student.incidentsCount === 0
              ? "success"
              : student.incidentsCount <= 2
                ? "warning"
                : "danger"
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Date of Birth", student.dateOfBirth],
              ["Gender", student.gender],
              ["Ethnicity", student.ethnicity],
              ["Nationality", student.nationality],
              ["First Language", student.firstLanguage],
              ["EAL", student.eal ? "Yes" : "No"],
              ["FSM Eligible", student.fsmEligible ? "Yes" : "No"],
              ["Looked After Child", student.lookedAfterChild ? "Yes" : "No"],
              ["Admission Date", student.admissionDate],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-800">{value}</span>
              </div>
            ))}
            <Separator />
            <div className="space-y-1.5">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-gray-700">
                  {student.address.line1}
                  {student.address.line2 && `, ${student.address.line2}`}
                  {`, ${student.address.city}, ${student.address.postcode}`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{student.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guardian Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              Guardian Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {student.guardians.map((g, i) => (
              <div key={i} className="space-y-1.5">
                {i > 0 && <Separator className="mb-3" />}
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800 text-sm">
                    {g.name}
                  </span>
                  <Badge variant="ghost" className="text-xs">
                    {g.relationship}
                  </Badge>
                  {g.isPrimary && (
                    <Badge variant="info" className="text-xs">
                      Primary
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{g.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{g.email}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AttendanceTab({ student }: { student: MockStudent }) {
  const calendar = student.attendanceCalendar;
  const weeks: MockStudent["attendanceCalendar"][] = [];
  for (let i = 0; i < 4; i++) {
    weeks.push(calendar.slice(i * 7, i * 7 + 7));
  }

  const schoolDays = calendar.filter((d) => d.status !== "WEEKEND");
  const presentCount = schoolDays.filter((d) => d.status === "PRESENT").length;
  const absentCount = schoolDays.filter((d) => d.status === "ABSENT").length;
  const lateCount = schoolDays.filter((d) => d.status === "LATE").length;
  const excusedCount = schoolDays.filter((d) => d.status === "EXCUSED").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Present" value={presentCount} variant="success" />
        <StatCard title="Absent" value={absentCount} variant="danger" />
        <StatCard title="Late" value={lateCount} variant="warning" />
        <StatCard title="Excused" value={excusedCount} variant="info" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            Last 4 Weeks — Attendance Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[420px]">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div
                  key={d}
                  className={`text-center text-xs font-semibold pb-1 ${d === "Sat" || d === "Sun" ? "text-gray-300" : "text-gray-500"}`}
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Weeks */}
            <div className="space-y-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-1">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      title={
                        day.status !== "WEEKEND"
                          ? `${day.date} — ${day.status}`
                          : day.date
                      }
                      className={`rounded-lg h-9 flex flex-col items-center justify-center text-xs font-semibold ${ATTENDANCE_CELL_STYLE[day.status]}`}
                    >
                      <span className="text-[10px] text-gray-400 leading-none">
                        {day.date.slice(8)}
                      </span>
                      <span>{ATTENDANCE_LABEL[day.status]}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-100">
              {[
                ["Present", "bg-green-100 text-green-800"],
                ["Absent", "bg-red-100 text-red-800"],
                ["Late", "bg-amber-100 text-amber-800"],
                ["Excused", "bg-blue-100 text-blue-800"],
              ].map(([label, cls]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div
                    className={`h-4 w-4 rounded-sm ${cls} flex items-center justify-center text-[10px] font-bold`}
                  >
                    {label[0]}
                  </div>
                  <span className="text-xs text-gray-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GradesTab({ student }: { student: MockStudent }) {
  const gradeDistribution = buildGradeDistribution(student.grades);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-400" />
                Current Grades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Subject
                      </th>
                      <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Teacher
                      </th>
                      <th className="text-center py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Current
                      </th>
                      <th className="text-center py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Target
                      </th>
                      <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Comment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {student.grades.map((g) => (
                      <tr key={g.subject} className="hover:bg-gray-50/80">
                        <td className="py-2.5 font-medium text-gray-800">
                          {g.subject}
                        </td>
                        <td className="py-2.5 text-gray-500">{g.teacher}</td>
                        <td className="py-2.5 text-center">
                          <Badge
                            variant={
                              g.currentGrade.startsWith("A")
                                ? "success"
                                : g.currentGrade === "B"
                                  ? "info"
                                  : "warning"
                            }
                          >
                            {g.currentGrade}
                          </Badge>
                        </td>
                        <td className="py-2.5 text-center">
                          <span className="text-xs text-gray-400 font-medium">
                            {g.targetGrade}
                          </span>
                        </td>
                        <td className="py-2.5 text-gray-500 text-xs max-w-[200px] truncate">
                          {g.comment}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <GradeBarChart data={gradeDistribution} height={220} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BehaviourTab({ student }: { student: MockStudent }) {
  return (
    <div className="space-y-4">
      {/* Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            Incidents
            <Badge variant="destructive" className="ml-1">
              {student.incidents.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {student.incidents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No incidents recorded.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Date", "Type", "Description", "Teacher", "Outcome"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide pr-4"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {student.incidents.map((inc, i) => (
                  <tr key={i} className="hover:bg-gray-50/80">
                    <td className="py-2.5 pr-4 text-gray-500 whitespace-nowrap">
                      {inc.date}
                    </td>
                    <td className="py-2.5 pr-4">
                      <Badge variant="warning">{inc.type}</Badge>
                    </td>
                    <td className="py-2.5 pr-4 text-gray-700 max-w-[200px]">
                      {inc.description}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-500 whitespace-nowrap">
                      {inc.teacher}
                    </td>
                    <td className="py-2.5 text-gray-500">{inc.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            Rewards &amp; Achievements
            <Badge variant="success" className="ml-1">
              {student.rewards.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Date", "Type", "Description", "Teacher", "Points"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide pr-4"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {student.rewards.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50/80">
                  <td className="py-2.5 pr-4 text-gray-500 whitespace-nowrap">
                    {r.date}
                  </td>
                  <td className="py-2.5 pr-4">
                    <Badge variant="info">{r.type}</Badge>
                  </td>
                  <td className="py-2.5 pr-4 text-gray-700">{r.description}</td>
                  <td className="py-2.5 pr-4 text-gray-500 whitespace-nowrap">
                    {r.teacher}
                  </td>
                  <td className="py-2.5">
                    <span className="font-semibold text-amber-600">
                      +{r.points}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function SENTab({ student }: { student: MockStudent }) {
  if (!student.hasSEN && !student.hasEHCP) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-gray-400">
            No SEN information recorded for this student.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Heart className="h-4 w-4 text-purple-400" />
            SEN Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {student.senType && (
              <Badge variant="purple">{student.senType}</Badge>
            )}
            {student.hasEHCP && <Badge variant="destructive">EHCP</Badge>}
            {student.eal && <Badge variant="info">EAL</Badge>}
          </div>
          {student.senNeeds.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Identified Needs
              </p>
              <ul className="space-y-1">
                {student.senNeeds.map((n) => (
                  <li
                    key={n}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {student.currentProvisions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Current Provisions
              </p>
              <ul className="space-y-1">
                {student.currentProvisions.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {student.hasEHCP && student.ehcpReviewDate && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
              <strong>EHCP Annual Review:</strong> {student.ehcpReviewDate}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DocumentsTab({ student }: { student: MockStudent }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-400" />
          Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {student.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                  <FileText className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {doc.type} · {doc.size} · {doc.date}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon-sm" title="Download">
                <Download className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Need a CheckCircle for SEN tab (not in imports above, adding inline import)
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const student = getStudentById(id ?? "s1");

  const initials =
    student.firstName[0].toUpperCase() + student.lastName[0].toUpperCase();

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 space-y-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/students")}
          className="gap-1.5 text-gray-500 -ml-1 h-7"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Students
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-base bg-blue-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">
                  {student.firstName} {student.lastName}
                </h1>
                {student.preferredName && (
                  <span className="text-sm text-gray-400">
                    ({student.preferredName})
                  </span>
                )}
                <StatusBadge status={student.status} />
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-sm text-gray-500">
                  {student.yearGroup} · {student.formClass}
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-sm font-mono text-gray-400">
                  {student.upn}
                </span>
                {student.pupilPremium && (
                  <Badge variant="warning">Pupil Premium</Badge>
                )}
                {student.fsmEligible && <Badge variant="info">FSM</Badge>}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/students/${student.id}/edit`)}
            className="gap-1.5 shrink-0"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>
        </div>

        {/* Alert Banners */}
        <div className="space-y-2">
          {student.lookedAfterChild && (
            <Alert variant="warning">
              <Flag className="h-4 w-4" />
              <AlertTitle>Looked After Child</AlertTitle>
              <AlertDescription>
                This student is a Looked After Child (LAC). Ensure all relevant
                safeguarding procedures are followed.
              </AlertDescription>
            </Alert>
          )}
          {student.hasEHCP && (
            <Alert>
              <Heart className="h-4 w-4" />
              <AlertTitle>Education, Health &amp; Care Plan (EHCP)</AlertTitle>
              <AlertDescription>
                This student has an active EHCP.
                {student.ehcpReviewDate &&
                  ` Annual review: ${student.ehcpReviewDate}.`}
              </AlertDescription>
            </Alert>
          )}
          {student.medicalNotes && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Medical Alert</AlertTitle>
              <AlertDescription>{student.medicalNotes}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="behaviour">Behaviour</TabsTrigger>
            <TabsTrigger value="sen">SEN</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab student={student} />
          </TabsContent>
          <TabsContent value="attendance">
            <AttendanceTab student={student} />
          </TabsContent>
          <TabsContent value="grades">
            <GradesTab student={student} />
          </TabsContent>
          <TabsContent value="behaviour">
            <BehaviourTab student={student} />
          </TabsContent>
          <TabsContent value="sen">
            <SENTab student={student} />
          </TabsContent>
          <TabsContent value="documents">
            <DocumentsTab student={student} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
