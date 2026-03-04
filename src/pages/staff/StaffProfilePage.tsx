import { type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  ShieldCheck,
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Award,
  TrendingDown,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { StatCard, StatusBadge } from "@/components/shared";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StaffProfile {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  jobTitle: string;
  department: string;
  email: string;
  phone: string;
  contractType: "PERMANENT" | "FIXED_TERM" | "SUPPLY";
  fte: number;
  startDate: string;
  isActive: boolean;
  subjects: string[];
  qualifications: Array<{ name: string; institution: string; year: number }>;
  qtsStatus: boolean;
  dbsNumber: string;
  dbsExpiry: string;
  timetable: Array<{
    day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
    period: string;
    subject: string;
    yearGroup: string;
    room: string;
  }>;
  attendanceSummary: {
    totalWorkingDays: number;
    daysPresent: number;
    daysAbsent: number;
    absences: Array<{
      date: string;
      duration: string;
      reason: string;
      authorised: boolean;
    }>;
  };
  leaveRequests: Array<{
    id: string;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    status: "APPROVED" | "PENDING" | "REJECTED";
    requestedOn: string;
  }>;
  cpd: Array<{
    id: string;
    title: string;
    provider: string;
    date: string;
    hours: number;
    type: string;
    notes?: string;
  }>;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_STAFF_PROFILES: StaffProfile[] = [
  {
    id: "st1",
    firstName: "Rachel",
    lastName: "Clarke",
    employeeId: "EMP-0042",
    jobTitle: "Head of English",
    department: "English",
    email: "r.clarke@setu.ac.uk",
    phone: "01234 567 001",
    contractType: "PERMANENT",
    fte: 1.0,
    startDate: "2015-09-01",
    isActive: true,
    subjects: ["English Language", "English Literature"],
    qualifications: [
      {
        name: "BA English Language & Literature",
        institution: "University of Exeter",
        year: 2009,
      },
      {
        name: "PGCE Secondary English",
        institution: "University of Bristol",
        year: 2011,
      },
      { name: "QTS", institution: "Teaching Regulation Agency", year: 2011 },
      {
        name: "NPQ for Middle Leadership",
        institution: "SETU TSH",
        year: 2020,
      },
    ],
    qtsStatus: true,
    dbsNumber: "001234567890",
    dbsExpiry: "2026-08-31",
    timetable: [
      {
        day: "Mon",
        period: "1",
        subject: "English Language",
        yearGroup: "Y11",
        room: "E1",
      },
      {
        day: "Mon",
        period: "2",
        subject: "English Literature",
        yearGroup: "Y10",
        room: "E1",
      },
      {
        day: "Mon",
        period: "3",
        subject: "English Literature",
        yearGroup: "Y9",
        room: "E2",
      },
      {
        day: "Tue",
        period: "1",
        subject: "English Language",
        yearGroup: "Y12",
        room: "E1",
      },
      {
        day: "Tue",
        period: "3",
        subject: "English Language",
        yearGroup: "Y11",
        room: "E1",
      },
      {
        day: "Tue",
        period: "4",
        subject: "English Literature",
        yearGroup: "Y10",
        room: "E2",
      },
      {
        day: "Wed",
        period: "2",
        subject: "English Language",
        yearGroup: "Y9",
        room: "E1",
      },
      {
        day: "Wed",
        period: "4",
        subject: "English Literature",
        yearGroup: "Y8",
        room: "E3",
      },
      {
        day: "Thu",
        period: "1",
        subject: "English Language",
        yearGroup: "Y12",
        room: "E1",
      },
      {
        day: "Thu",
        period: "2",
        subject: "English Literature",
        yearGroup: "Y11",
        room: "E1",
      },
      {
        day: "Thu",
        period: "3",
        subject: "English Language",
        yearGroup: "Y10",
        room: "E2",
      },
      {
        day: "Fri",
        period: "1",
        subject: "English Literature",
        yearGroup: "Y9",
        room: "E1",
      },
      {
        day: "Fri",
        period: "2",
        subject: "English Language",
        yearGroup: "Y8",
        room: "E3",
      },
      {
        day: "Fri",
        period: "4",
        subject: "English Literature",
        yearGroup: "Y12",
        room: "E1",
      },
    ],
    attendanceSummary: {
      totalWorkingDays: 190,
      daysPresent: 184,
      daysAbsent: 6,
      absences: [
        {
          date: "2025-10-14",
          duration: "1 day",
          reason: "Sickness – migraine",
          authorised: true,
        },
        {
          date: "2025-10-15",
          duration: "1 day",
          reason: "Sickness – migraine",
          authorised: true,
        },
        {
          date: "2025-11-20",
          duration: "3 days",
          reason: "Medical appointment",
          authorised: true,
        },
        {
          date: "2026-01-09",
          duration: "1 day",
          reason: "Compassionate leave",
          authorised: true,
        },
      ],
    },
    leaveRequests: [
      {
        id: "lr1",
        type: "Annual Leave",
        startDate: "2025-10-21",
        endDate: "2025-10-25",
        days: 5,
        reason: "Pre-approved half-term holiday",
        status: "APPROVED",
        requestedOn: "2025-09-01",
      },
      {
        id: "lr2",
        type: "Compassionate Leave",
        startDate: "2026-01-09",
        endDate: "2026-01-09",
        days: 1,
        reason: "Bereavement",
        status: "APPROVED",
        requestedOn: "2026-01-08",
      },
      {
        id: "lr3",
        type: "Professional Leave",
        startDate: "2026-03-10",
        endDate: "2026-03-11",
        days: 2,
        reason: "Attend external literacy conference",
        status: "PENDING",
        requestedOn: "2026-02-20",
      },
    ],
    cpd: [
      {
        id: "cpd1",
        title: "Mastery Approaches in English",
        provider: "NATE",
        date: "2025-06-12",
        hours: 6,
        type: "External Course",
        notes: "Certificate of attendance issued.",
      },
      {
        id: "cpd2",
        title: "Trauma-Informed Teaching",
        provider: "SETU TSH",
        date: "2025-11-05",
        hours: 3,
        type: "In-Service Training",
      },
      {
        id: "cpd3",
        title: "Examiner Training – AQA GCSE English",
        provider: "AQA",
        date: "2025-04-18",
        hours: 8,
        type: "Examiner Training",
        notes: "Qualified as principal examiner.",
      },
      {
        id: "cpd4",
        title: "Safeguarding Level 3 Refresher",
        provider: "SETU",
        date: "2025-09-02",
        hours: 2,
        type: "Mandatory Training",
      },
      {
        id: "cpd5",
        title: "AI Tools for Education",
        provider: "SETU TSH",
        date: "2026-02-10",
        hours: 2,
        type: "In-Service Training",
      },
    ],
  },
];

function getStaffById(id: string): StaffProfile {
  const found = MOCK_STAFF_PROFILES.find((s) => s.id === id);
  if (found) return found;
  // Fallback: return first profile with modified name
  return {
    ...MOCK_STAFF_PROFILES[0],
    id,
    firstName: "Staff",
    lastName: `#${id}`,
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
const PERIODS = ["1", "2", "3", "4", "5"] as const;

const SUBJECT_COLORS = [
  "bg-blue-50 text-blue-800 border-blue-200",
  "bg-green-50 text-green-800 border-green-200",
  "bg-purple-50 text-purple-800 border-purple-200",
  "bg-amber-50 text-amber-800 border-amber-200",
  "bg-red-50 text-red-800 border-red-200",
  "bg-indigo-50 text-indigo-800 border-indigo-200",
];

function getSubjectColor(subject: string): string {
  const idx = subject.charCodeAt(0) % SUBJECT_COLORS.length;
  return SUBJECT_COLORS[idx];
}

const LEAVE_STATUS_ICON: Record<string, ReactNode> = {
  APPROVED: <CheckCircle className="h-4 w-4 text-green-500" />,
  PENDING: <AlertCircle className="h-4 w-4 text-amber-500" />,
  REJECTED: <XCircle className="h-4 w-4 text-red-500" />,
};

// ─── Tab Components ────────────────────────────────────────────────────────────

function OverviewTab({ staff }: { staff: StaffProfile }) {
  const dbsDaysLeft = Math.floor(
    (new Date(staff.dbsExpiry).getTime() - Date.now()) / 86400000,
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Contract Type"
          value={staff.contractType.replace("_", " ")}
          icon={Building2}
          variant="default"
        />
        <StatCard
          title="FTE"
          value={`${(staff.fte * 100).toFixed(0)}%`}
          icon={Clock}
          variant="info"
        />
        <StatCard
          title="CPD Hours (This Year)"
          value={staff.cpd.reduce((sum, c) => sum + c.hours, 0)}
          icon={Award}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contact & Employment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              Contact &amp; Employment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-gray-700">{staff.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{staff.phone}</span>
            </div>
            <Separator />
            {[
              ["Department", staff.department],
              ["Start Date", staff.startDate],
              ["Contract", staff.contractType.replace("_", " ")],
              ["Employee ID", staff.employeeId],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-800">{value}</span>
              </div>
            ))}
            {staff.subjects.length > 0 && (
              <div className="pt-1">
                <p className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide font-semibold">
                  Subjects
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {staff.subjects.map((s) => (
                    <Badge key={s} variant="ghost">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Qualifications & DBS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-gray-400" />
              Qualifications &amp; Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QTS */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">QTS Status</span>
              {staff.qtsStatus ? (
                <Badge variant="success">Qualified</Badge>
              ) : (
                <Badge variant="ghost">Not Qualified</Badge>
              )}
            </div>

            {/* DBS */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  DBS Certificate
                </span>
                <Badge
                  variant={
                    dbsDaysLeft > 30
                      ? "success"
                      : dbsDaysLeft > 0
                        ? "warning"
                        : "destructive"
                  }
                >
                  {dbsDaysLeft > 0 ? `Expires ${staff.dbsExpiry}` : "EXPIRED"}
                </Badge>
              </div>
              <p className="text-xs text-gray-400 font-mono pl-5">
                {staff.dbsNumber}
              </p>
            </div>

            <Separator />

            {/* Qualifications list */}
            <div className="space-y-2">
              {staff.qualifications.map((q) => (
                <div key={q.name} className="flex items-start gap-2.5">
                  <div className="h-5 w-5 shrink-0 rounded-full bg-indigo-50 flex items-center justify-center mt-0.5">
                    <GraduationCap className="h-3 w-3 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {q.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {q.institution} · {q.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TimetableTab({ staff }: { staff: StaffProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          Weekly Timetable
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[560px]">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="w-20 text-left text-gray-400 font-semibold uppercase tracking-wide pb-2 pr-2">
                  Period
                </th>
                {DAYS.map((d) => (
                  <th
                    key={d}
                    className="text-center text-gray-500 font-semibold uppercase tracking-wide pb-2 px-1"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PERIODS.map((period) => (
                <tr key={period}>
                  <td className="py-2 pr-2 text-gray-400 font-medium">
                    P{period}
                  </td>
                  {DAYS.map((day) => {
                    const lesson = staff.timetable.find(
                      (t) => t.day === day && t.period === period,
                    );
                    return (
                      <td key={day} className="py-1 px-1">
                        {lesson ? (
                          <div
                            className={`rounded-lg border px-2 py-1.5 text-center ${getSubjectColor(lesson.subject)}`}
                          >
                            <p className="font-semibold text-xs leading-tight truncate">
                              {lesson.subject}
                            </p>
                            <p className="text-[10px] opacity-70 mt-0.5">
                              {lesson.yearGroup} · {lesson.room}
                            </p>
                          </div>
                        ) : (
                          <div className="rounded-lg bg-gray-50 h-10" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...new Set(staff.timetable.map((t) => t.subject))].map((s) => (
              <div
                key={s}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getSubjectColor(s)}`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AttendanceStaffTab({ staff }: { staff: StaffProfile }) {
  const { totalWorkingDays, daysPresent, daysAbsent, absences } =
    staff.attendanceSummary;
  const pct = Math.round((daysPresent / totalWorkingDays) * 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Working Days"
          value={totalWorkingDays}
          icon={Calendar}
          variant="default"
        />
        <StatCard
          title="Days Present"
          value={daysPresent}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Days Absent"
          value={daysAbsent}
          icon={TrendingDown}
          variant={daysAbsent > 10 ? "danger" : "warning"}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Attendance Rate</CardTitle>
            <span
              className={`text-sm font-bold ${pct >= 96 ? "text-green-600" : pct >= 90 ? "text-amber-600" : "text-red-600"}`}
            >
              {pct}%
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Progress value={pct} className="h-2" />
          {pct < 96 && (
            <p className="text-xs text-amber-600 mt-2">
              Attendance is below the recommended 96% threshold.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-400" />
            Absence Record
          </CardTitle>
        </CardHeader>
        <CardContent>
          {absences.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No absences recorded this year.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Date", "Duration", "Reason", "Authorised"].map((h) => (
                    <th
                      key={h}
                      className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide pr-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {absences.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50/80">
                    <td className="py-2.5 pr-4 text-gray-500 whitespace-nowrap">
                      {a.date}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-700">{a.duration}</td>
                    <td className="py-2.5 pr-4 text-gray-700">{a.reason}</td>
                    <td className="py-2.5">
                      {a.authorised ? (
                        <Badge variant="success">Authorised</Badge>
                      ) : (
                        <Badge variant="destructive">Unauthorised</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LeaveTab({ staff }: { staff: StaffProfile }) {
  const totalApproved = staff.leaveRequests
    .filter((l) => l.status === "APPROVED")
    .reduce((sum, l) => sum + l.days, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Leave Taken"
          value={`${totalApproved} days`}
          variant="default"
        />
        <StatCard
          title="Pending Requests"
          value={
            staff.leaveRequests.filter((l) => l.status === "PENDING").length
          }
          variant="warning"
        />
        <StatCard
          title="Rejected"
          value={
            staff.leaveRequests.filter((l) => l.status === "REJECTED").length
          }
          variant="danger"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {staff.leaveRequests.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No leave requests submitted.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    "Type",
                    "Dates",
                    "Days",
                    "Reason",
                    "Requested",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide pr-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {staff.leaveRequests.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50/80">
                    <td className="py-2.5 pr-4">
                      <Badge variant="ghost">{l.type}</Badge>
                    </td>
                    <td className="py-2.5 pr-4 whitespace-nowrap text-gray-600 text-xs">
                      {l.startDate}
                      {l.startDate !== l.endDate && ` → ${l.endDate}`}
                    </td>
                    <td className="py-2.5 pr-4 font-medium text-gray-800">
                      {l.days}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-600 max-w-[180px] truncate">
                      {l.reason}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-400 whitespace-nowrap text-xs">
                      {l.requestedOn}
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-1.5">
                        {LEAVE_STATUS_ICON[l.status]}
                        <StatusBadge status={l.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CPDTab({ staff }: { staff: StaffProfile }) {
  const totalHours = staff.cpd.reduce((sum, c) => sum + c.hours, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          title="CPD Entries"
          value={staff.cpd.length}
          icon={BookOpen}
          variant="info"
        />
        <StatCard
          title="Total Hours"
          value={totalHours}
          icon={Clock}
          variant="success"
        />
        <StatCard
          title="Mandatory Complete"
          value={
            staff.cpd.filter((c) => c.type === "Mandatory Training").length
          }
          icon={Award}
          variant="warning"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            CPD &amp; Training Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {staff.cpd.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 rounded-xl border border-gray-200 p-3.5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <p className="font-medium text-gray-800 text-sm">
                      {entry.title}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="ghost">{entry.type}</Badge>
                      <span className="text-xs font-semibold text-indigo-600">
                        {entry.hours}h
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {entry.provider} · {entry.date}
                  </p>
                  {entry.notes && (
                    <p className="text-xs text-gray-400 mt-1 italic">
                      {entry.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default function StaffProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const staff = getStaffById(id ?? "st1");

  const initials =
    staff.firstName[0].toUpperCase() + staff.lastName[0].toUpperCase();

  const CONTRACT_VARIANT: Record<string, "success" | "warning" | "info"> = {
    PERMANENT: "success",
    FIXED_TERM: "warning",
    SUPPLY: "info",
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 space-y-3 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/staff")}
          className="gap-1.5 text-gray-500 -ml-1 h-7"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Staff
        </Button>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-base bg-indigo-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {staff.firstName} {staff.lastName}
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-sm text-gray-500">{staff.jobTitle}</span>
                <span className="text-gray-300">·</span>
                <span className="text-sm text-gray-500">
                  {staff.department}
                </span>
                <span className="text-gray-300">·</span>
                <span className="flex items-center gap-1 text-xs text-gray-400 font-mono">
                  <Hash className="h-3 w-3" />
                  {staff.employeeId}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge variant={CONTRACT_VARIANT[staff.contractType]}>
                  {staff.contractType.replace("_", " ")}
                </Badge>
                <StatusBadge status={staff.isActive ? "ACTIVE" : "INACTIVE"} />
                {staff.qtsStatus && <Badge variant="info">QTS</Badge>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="h-4 w-4" />
            <span>{staff.email}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="leave">Leave</TabsTrigger>
            <TabsTrigger value="cpd">CPD</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab staff={staff} />
          </TabsContent>
          <TabsContent value="timetable">
            <TimetableTab staff={staff} />
          </TabsContent>
          <TabsContent value="attendance">
            <AttendanceStaffTab staff={staff} />
          </TabsContent>
          <TabsContent value="leave">
            <LeaveTab staff={staff} />
          </TabsContent>
          <TabsContent value="cpd">
            <CPDTab staff={staff} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
