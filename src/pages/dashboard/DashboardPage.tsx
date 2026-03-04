import { useState, type ElementType } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  CalendarCheck,
  AlertTriangle,
  BookOpen,
  ClipboardList,
  Clock,
  Star,
  TrendingUp,
  CheckSquare,
  Megaphone,
  BarChart3,
  ChevronRight,
  Circle,
  Baby,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { PageHeader } from "@/components/shared";
import { StatCard } from "@/components/shared";
import { AttendanceLineChart } from "@/components/charts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/types";
import { cn } from "@/lib/utils";

// ─── Mock data ────────────────────────────────────────────────────────────────

const weeklyAttendanceData = [
  { name: "Mon", attendance: 95.1, target: 96 },
  { name: "Tue", attendance: 94.8, target: 96 },
  { name: "Wed", attendance: 93.6, target: 96 },
  { name: "Thu", attendance: 94.2, target: 96 },
  { name: "Fri", attendance: 92.9, target: 96 },
];

const recentIncidents = [
  {
    id: "inc_001",
    student: "Oliver Hayes",
    type: "Behaviour",
    severity: "Medium",
    date: "Today, 10:45",
    status: "Open",
  },
  {
    id: "inc_002",
    student: "Aisha Patel",
    type: "Safeguarding",
    severity: "High",
    date: "Today, 09:20",
    status: "Under Review",
  },
  {
    id: "inc_003",
    student: "Marcus Williams",
    type: "Bullying",
    severity: "Medium",
    date: "Yesterday",
    status: "Open",
  },
  {
    id: "inc_004",
    student: "Emma Clarke",
    type: "Behaviour",
    severity: "Low",
    date: "Yesterday",
    status: "Resolved",
  },
  {
    id: "inc_005",
    student: "Liam Johnson",
    type: "Equipment Damage",
    severity: "Low",
    date: "Mon 3 Mar",
    status: "Open",
  },
];

const todaysTimetable = [
  {
    period: 1,
    time: "09:00–10:00",
    subject: "English Lit",
    room: "B12",
    class: "7A",
  },
  {
    period: 2,
    time: "10:00–11:00",
    subject: "English Lit",
    room: "B12",
    class: "8B",
  },
  {
    period: 3,
    time: "11:20–12:20",
    subject: "Form Period",
    room: "B12",
    class: "7A",
  },
  {
    period: 4,
    time: "13:10–14:10",
    subject: "English Lang",
    room: "B14",
    class: "9C",
  },
  { period: 5, time: "14:10–15:10", subject: "Free", room: "—", class: "—" },
];

const recentAssignments = [
  {
    id: "a1",
    title: "Shakespeare Essay – Romeo & Juliet",
    class: "7A",
    due: "Tomorrow",
    submitted: 18,
    total: 25,
  },
  {
    id: "a2",
    title: "Creative Writing Portfolio",
    class: "8B",
    due: "Fri 7 Mar",
    submitted: 22,
    total: 28,
  },
  {
    id: "a3",
    title: "Reading Comprehension Test",
    class: "9C",
    due: "Mon 10 Mar",
    submitted: 5,
    total: 30,
  },
];

const attendanceWelfareStats = [
  { name: "Mon", attendance: 91.8, target: 96 },
  { name: "Tue", attendance: 92.1, target: 96 },
  { name: "Wed", attendance: 90.5, target: 96 },
  { name: "Thu", attendance: 91.3, target: 96 },
  { name: "Fri", attendance: 89.9, target: 96 },
];

const studentsNotArrived = [
  {
    id: "s1",
    name: "Tyler Barnes",
    year: "Year 10",
    lastSeen: "Yesterday",
    contact: "01234 567890",
  },
  {
    id: "s2",
    name: "Priya Mehta",
    year: "Year 8",
    lastSeen: "3 days ago",
    contact: "01234 567891",
  },
  {
    id: "s3",
    name: "Callum Robinson",
    year: "Year 9",
    lastSeen: "Today (late)",
    contact: "01234 567892",
  },
  {
    id: "s4",
    name: "Saoirse Murphy",
    year: "Year 7",
    lastSeen: "Yesterday",
    contact: "01234 567893",
  },
  {
    id: "s5",
    name: "Jake Peterson",
    year: "Year 11",
    lastSeen: "2 days ago",
    contact: "01234 567894",
  },
];

const studentTimetable = [
  {
    period: 1,
    time: "09:00–10:00",
    subject: "Mathematics",
    room: "M04",
    teacher: "Mr Patel",
  },
  {
    period: 2,
    time: "10:00–11:00",
    subject: "English Literature",
    room: "B12",
    teacher: "Ms Fletcher",
  },
  {
    period: 3,
    time: "11:20–12:20",
    subject: "Science",
    room: "S06",
    teacher: "Mr Morrison",
  },
  {
    period: 4,
    time: "13:10–14:10",
    subject: "History",
    room: "H02",
    teacher: "Ms Campbell",
  },
  {
    period: 5,
    time: "14:10–15:10",
    subject: "PE",
    room: "Sports Hall",
    teacher: "Mr Cooper",
  },
];

const studentAssignments = [
  {
    id: "sa1",
    subject: "Mathematics",
    title: "Algebra Homework Set 4",
    due: "Tomorrow",
    priority: "high",
  },
  {
    id: "sa2",
    subject: "English Literature",
    title: "Shakespeare Essay",
    due: "Thu 6 Mar",
    priority: "medium",
  },
  {
    id: "sa3",
    subject: "Science",
    title: "Lab Report – Photosynthesis",
    due: "Mon 10 Mar",
    priority: "low",
  },
];

const studentAttendanceData = [
  { name: "Sep", attendance: 97 },
  { name: "Oct", attendance: 95 },
  { name: "Nov", attendance: 94 },
  { name: "Dec", attendance: 93 },
  { name: "Jan", attendance: 92 },
  { name: "Feb", attendance: 91 },
  { name: "Mar", attendance: 93 },
];

const linkedChildren = [
  {
    id: "c1",
    name: "Jamie Cooper",
    year: "Year 9",
    attendance: "88%",
    form: "9B",
    recentGrades: [
      { subject: "Maths", grade: "B+", date: "28 Feb" },
      { subject: "English", grade: "A-", date: "25 Feb" },
      { subject: "Science", grade: "B", date: "22 Feb" },
    ],
    upcomingEvents: [
      { event: "Parents Evening", date: "Tue 11 Mar" },
      { event: "Science Trip", date: "Fri 14 Mar" },
    ],
  },
  {
    id: "c2",
    name: "Sophie Cooper",
    year: "Year 7",
    attendance: "96%",
    form: "7A",
    recentGrades: [
      { subject: "Art", grade: "A", date: "27 Feb" },
      { subject: "Maths", grade: "A-", date: "24 Feb" },
    ],
    upcomingEvents: [{ event: "Music Concert", date: "Wed 12 Mar" }],
  },
];

// ─── Role grouping helpers ─────────────────────────────────────────────────────

const ADMIN_ROLES: Role[] = [
  "MASTER_ADMIN",
  "IT_ADMINISTRATOR",
  "HEAD_OF_SCHOOL",
  "SLT_MEMBER",
  "DATA_MANAGER",
];
const TEACHING_ROLES: Role[] = [
  "HEAD_OF_YEAR",
  "TEACHER",
  "COVER_SUPERVISOR",
  "HEAD_OF_DEPARTMENT",
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    High: "bg-red-100 text-red-700 border-red-200",
    Medium: "bg-amber-100 text-amber-700 border-amber-200",
    Low: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        map[severity] ?? "bg-gray-100 text-gray-600 border-gray-200",
      )}
    >
      {severity}
    </span>
  );
}

function StatusBadgePill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Open: "bg-amber-50 text-amber-700 border-amber-200",
    "Under Review": "bg-purple-50 text-purple-700 border-purple-200",
    Resolved: "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        map[status] ?? "bg-gray-100 text-gray-600 border-gray-200",
      )}
    >
      {status}
    </span>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
  color,
  onClick,
}: {
  icon: ElementType;
  label: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center hover:border-gray-300 hover:shadow-sm transition-all group"
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm",
          color,
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs font-medium text-gray-700 leading-tight">
        {label}
      </span>
    </button>
  );
}

// ─── Dashboard variants ────────────────────────────────────────────────────────

function AdminDashboard({ name: _name }: { name: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value="1,247"
          icon={Users}
          variant="default"
          trend={{ value: 2.1, label: "vs last term", direction: "up" }}
        />
        <StatCard
          title="Staff on Site"
          value="62"
          icon={UserCheck}
          variant="success"
          subtitle="of 68 total staff"
        />
        <StatCard
          title="Attendance Today"
          value="94.2%"
          icon={CalendarCheck}
          variant="info"
          trend={{ value: 0.4, label: "vs yesterday", direction: "down" }}
        />
        <StatCard
          title="Open Incidents"
          value="8"
          icon={AlertTriangle}
          variant="warning"
          subtitle="2 require urgent action"
        />
      </div>

      {/* Chart + Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                Attendance This Week
              </h3>
              <p className="text-xs text-gray-400">
                Daily attendance percentage vs 96% target
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/attendance")}
              className="text-xs gap-1"
            >
              View Report <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <AttendanceLineChart data={weeklyAttendanceData} height={200} />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Recent Incidents
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/incidents")}
              className="text-xs gap-1"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-2.5">
            {recentIncidents.map((incident) => (
              <div
                key={incident.id}
                className="flex items-start gap-2 p-2.5 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-xs font-medium text-gray-800 leading-tight">
                    {incident.student}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {incident.type} · {incident.date}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <SeverityBadge severity={incident.severity} />
                    <StatusBadgePill status={incident.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickActionButton
            icon={CalendarCheck}
            label="Register Attendance"
            color="bg-blue-500"
            onClick={() => navigate("/attendance")}
          />
          <QuickActionButton
            icon={Users}
            label="Add Student"
            color="bg-green-500"
            onClick={() => navigate("/students")}
          />
          <QuickActionButton
            icon={Megaphone}
            label="Send Announcement"
            color="bg-purple-500"
            onClick={() => navigate("/announcements")}
          />
          <QuickActionButton
            icon={BarChart3}
            label="View Reports"
            color="bg-amber-500"
            onClick={() => navigate("/reports")}
          />
        </div>
      </div>
    </div>
  );
}

function TeachingDashboard({ name: _name }: { name: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="My Classes"
          value="3"
          icon={BookOpen}
          variant="default"
          subtitle="Active this term"
        />
        <StatCard
          title="Students Today"
          value="87"
          icon={Users}
          variant="success"
          subtitle="Across all classes"
        />
        <StatCard
          title="Avg Attendance"
          value="92%"
          icon={TrendingUp}
          variant="info"
          trend={{ value: 1.2, label: "vs last week", direction: "up" }}
        />
      </div>

      {/* Timetable + Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Today's Timetable
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/timetable")}
              className="text-xs gap-1"
            >
              Full timetable <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-1.5">
            {todaysTimetable.map((row) => (
              <div
                key={row.period}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs",
                  row.class === "—"
                    ? "bg-gray-50 text-gray-400"
                    : "bg-blue-50 border border-blue-100 text-gray-700",
                )}
              >
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 font-semibold text-xs shrink-0">
                  {row.period}
                </span>
                <span className="text-gray-400 w-24 shrink-0">{row.time}</span>
                <span className="font-medium flex-1">{row.subject}</span>
                <Badge variant="outline" className="text-xs">
                  {row.class}
                </Badge>
                <span className="text-gray-400">{row.room}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Recent Assignments
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/assignments")}
              className="text-xs gap-1"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentAssignments.map((a) => (
              <div
                key={a.id}
                className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-gray-800 leading-tight">
                      {a.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {a.class} · Due {a.due}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {a.class}
                  </Badge>
                </div>
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Submitted</span>
                    <span>
                      {a.submitted}/{a.total}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${(a.submitted / a.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AttendanceDashboard() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Present"
          value="91.3%"
          icon={CheckSquare}
          variant="success"
          trend={{ value: 0.5, label: "vs yesterday", direction: "up" }}
        />
        <StatCard
          title="Absent"
          value="5.2%"
          icon={AlertTriangle}
          variant="danger"
          trend={{ value: 0.2, label: "vs yesterday", direction: "down" }}
        />
        <StatCard
          title="Late"
          value="2.1%"
          icon={Clock}
          variant="warning"
          subtitle="23 students"
        />
        <StatCard
          title="Unregistered"
          value="1.4%"
          icon={Circle}
          variant="info"
          subtitle="15 sessions"
        />
      </div>

      {/* Trend chart */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              Attendance Trend This Week
            </h3>
            <p className="text-xs text-gray-400">
              Daily present rate vs 96% target
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/attendance")}
            className="text-xs gap-1"
          >
            Full report <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <AttendanceLineChart data={attendanceWelfareStats} height={200} />
      </Card>

      {/* Students not arrived */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Students Not Arrived Today
          </h3>
          <Badge variant="destructive" className="text-xs">
            {studentsNotArrived.length} students
          </Badge>
        </div>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Student
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Year
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Last Seen
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Contact
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {studentsNotArrived.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                        {s.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="text-xs font-medium text-gray-800">
                        {s.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.year}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {s.lastSeen}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {s.contact}
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      Contact
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StudentDashboard({ name: _name }: { name: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Attendance"
          value="93%"
          icon={CalendarCheck}
          variant="success"
          trend={{ value: 1.2, label: "vs last month", direction: "up" }}
        />
        <StatCard
          title="Assignments Due"
          value="3"
          icon={ClipboardList}
          variant="warning"
          subtitle="Next 7 days"
        />
        <StatCard
          title="Merit Points"
          value="142"
          icon={Star}
          variant="info"
          trend={{ value: 8, label: "this week", direction: "up" }}
        />
      </div>

      {/* Timetable + Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Today's Timetable
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/timetable")}
              className="text-xs gap-1"
            >
              Full timetable <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-1.5">
            {studentTimetable.map((row) => (
              <div
                key={row.period}
                className="flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 text-xs text-gray-700"
              >
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 font-semibold text-xs shrink-0">
                  {row.period}
                </span>
                <span className="text-gray-400 w-24 shrink-0">{row.time}</span>
                <span className="font-medium flex-1">{row.subject}</span>
                <span className="text-gray-400">{row.room}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Upcoming Assignments
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/assignments")}
              className="text-xs gap-1"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-3">
            {studentAssignments.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div
                  className={cn(
                    "mt-0.5 h-2 w-2 rounded-full shrink-0",
                    a.priority === "high"
                      ? "bg-red-400"
                      : a.priority === "medium"
                        ? "bg-amber-400"
                        : "bg-green-400",
                  )}
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">
                    {a.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.subject} · Due {a.due}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Attendance chart */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          My Attendance This Year
        </h3>
        <AttendanceLineChart data={studentAttendanceData} height={160} />
      </Card>
    </div>
  );
}

function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState(0);
  const child = linkedChildren[selectedChild];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Child selector */}
      {linkedChildren.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Viewing:</span>
          {linkedChildren.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setSelectedChild(i)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                i === selectedChild
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300",
              )}
            >
              <Baby className="h-3.5 w-3.5" />
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Child stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Attendance"
          value={child.attendance}
          icon={CalendarCheck}
          variant="success"
        />
        <StatCard
          title="Year Group"
          value={child.year}
          icon={Users}
          variant="default"
          subtitle={`Form ${child.form}`}
        />
        <StatCard
          title="Recent Grades"
          value={`${child.recentGrades.length} entries`}
          icon={BookOpen}
          variant="info"
        />
      </div>

      {/* Recent grades + Upcoming events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Recent Grades
          </h3>
          <div className="space-y-2.5">
            {child.recentGrades.map((g, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-xs font-medium text-gray-800">
                    {g.subject}
                  </p>
                  <p className="text-xs text-gray-400">{g.date}</p>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  {g.grade}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Upcoming Events
          </h3>
          <div className="space-y-2.5">
            {child.upcomingEvents.map((e, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-blue-50 border border-blue-100"
              >
                <CalendarCheck className="h-4 w-4 text-blue-500 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-800">{e.event}</p>
                  <p className="text-xs text-gray-400">{e.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function GenericDashboard({ role }: { role: Role }) {
  const roleLabels: Partial<
    Record<
      Role,
      {
        stat1: string;
        stat2: string;
        stat3: string;
        v1: string;
        v2: string;
        v3: string;
      }
    >
  > = {
    HR_MANAGER: {
      stat1: "Total Staff",
      stat2: "On Leave",
      stat3: "Open Positions",
      v1: "68",
      v2: "4",
      v3: "3",
    },
    FINANCE_MANAGER: {
      stat1: "Budget Used",
      stat2: "Invoices Pending",
      stat3: "Overspend Alerts",
      v1: "73%",
      v2: "12",
      v3: "2",
    },
    FACILITIES_MANAGER: {
      stat1: "Open Tickets",
      stat2: "Rooms Booked",
      stat3: "Maintenance Due",
      v1: "7",
      v2: "24",
      v3: "5",
    },
    LIBRARIAN: {
      stat1: "Books Loaned",
      stat2: "Overdue Returns",
      stat3: "New Acquisitions",
      v1: "142",
      v2: "18",
      v3: "6",
    },
    SENCO: {
      stat1: "EHCP Students",
      stat2: "Reviews Due",
      stat3: "Interventions",
      v1: "34",
      v2: "7",
      v3: "12",
    },
    SAFEGUARDING_LEAD: {
      stat1: "Open Cases",
      stat2: "Reviews Due",
      stat3: "Training Due",
      v1: "5",
      v2: "3",
      v3: "8",
    },
    EXAMINATIONS_OFFICER: {
      stat1: "Exam Entries",
      stat2: "Upcoming Exams",
      stat3: "Access Arrangements",
      v1: "847",
      v2: "12",
      v3: "43",
    },
    CAREERS_ADVISOR: {
      stat1: "Students Seen",
      stat2: "Upcoming Appts",
      stat3: "Destinations Tracked",
      v1: "156",
      v2: "8",
      v3: "94",
    },
    ADMISSIONS_OFFICER: {
      stat1: "Applications",
      stat2: "Pending Review",
      stat3: "Offers Made",
      v1: "234",
      v2: "45",
      v3: "182",
    },
  };

  const stats = roleLabels[role] ?? {
    stat1: "Actions Today",
    stat2: "Pending Tasks",
    stat3: "Notifications",
    v1: "12",
    v2: "5",
    v3: "3",
  };

  const recentActivity = [
    { id: 1, action: "Logged in", time: "Just now" },
    { id: 2, action: "Viewed dashboard", time: "Just now" },
    { id: 3, action: "Notification received", time: "5 min ago" },
    { id: 4, action: "System update applied", time: "1 hour ago" },
    { id: 5, action: "Profile last updated", time: "3 days ago" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title={stats.stat1}
          value={stats.v1}
          icon={BarChart3}
          variant="default"
        />
        <StatCard
          title={stats.stat2}
          value={stats.v2}
          icon={ClipboardList}
          variant="warning"
        />
        <StatCard
          title={stats.stat3}
          value={stats.v3}
          icon={AlertTriangle}
          variant="info"
        />
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-1">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span className="text-xs text-gray-700">{item.action}</span>
              </div>
              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Role label map ────────────────────────────────────────────────────────────

const ROLE_DISPLAY: Partial<Record<Role, string>> = {
  MASTER_ADMIN: "System Administrator",
  IT_ADMINISTRATOR: "IT Administrator",
  HEAD_OF_SCHOOL: "Head of School",
  SLT_MEMBER: "Senior Leadership",
  DATA_MANAGER: "Data Manager",
  HEAD_OF_YEAR: "Head of Year",
  TEACHER: "Teacher",
  HEAD_OF_DEPARTMENT: "Head of Department",
  COVER_SUPERVISOR: "Cover Supervisor",
  ATTENDANCE_WELFARE_OFFICER: "Attendance & Welfare",
  STUDENT: "Student",
  PARENT: "Parent",
  HR_MANAGER: "HR Manager",
  FINANCE_MANAGER: "Finance Manager",
  FACILITIES_MANAGER: "Facilities Manager",
  LIBRARIAN: "Librarian",
  SENCO: "SENCO",
  SAFEGUARDING_LEAD: "Safeguarding Lead",
  EXAMINATIONS_OFFICER: "Examinations Officer",
  CAREERS_ADVISOR: "Careers Advisor",
  ADMISSIONS_OFFICER: "Admissions Officer",
  TEACHING_ASSISTANT: "Teaching Assistant",
  SCIENCE_TECHNICIAN: "Science Technician",
  SUBJECT_TECHNICIAN: "Subject Technician",
  IT_TECHNICIAN: "IT Technician",
  SUPPORT_STAFF: "Support Staff",
  STUDENT_LEADERSHIP: "Student Leadership",
};

// ─── Main component ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { name, role } = useAuthStore();

  const currentRole = role ?? "SUPPORT_STAFF";
  const displayRole = ROLE_DISPLAY[currentRole] ?? currentRole;
  const firstName = name?.split(" ")[0] ?? "User";

  const renderDashboard = () => {
    if (ADMIN_ROLES.includes(currentRole)) {
      return <AdminDashboard name={firstName} />;
    }
    if (TEACHING_ROLES.includes(currentRole)) {
      return <TeachingDashboard name={firstName} />;
    }
    if (currentRole === "ATTENDANCE_WELFARE_OFFICER") {
      return <AttendanceDashboard />;
    }
    if (currentRole === "STUDENT" || currentRole === "STUDENT_LEADERSHIP") {
      return <StudentDashboard name={firstName} />;
    }
    if (currentRole === "PARENT") {
      return <ParentDashboard />;
    }
    return <GenericDashboard role={currentRole} />;
  };

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title={`Good morning, ${firstName}`}
        subtitle={`${displayRole} · Hartfield Academy · Wednesday, 4 March 2026`}
        icon={BarChart3}
        iconColor="bg-blue-600"
      />
      {renderDashboard()}
    </div>
  );
}
