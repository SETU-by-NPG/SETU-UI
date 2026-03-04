import { type ElementType } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  Building2,
  BookOpen,
  Users,
  Settings,
  LogIn,
  ClipboardList,
  MessageSquare,
  Star,
  CalendarCheck,
  AlertTriangle,
  CheckSquare,
  Edit3,
  GraduationCap,
  Baby,
  TrendingUp,
  Award,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { PageHeader } from "@/components/shared";
import { StatCard } from "@/components/shared";
import { AttendanceLineChart } from "@/components/charts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

// ─── Mock data ─────────────────────────────────────────────────────────────────

const RECENT_ACTIVITY = [
  {
    id: "a1",
    icon: LogIn,
    color: "text-blue-500 bg-blue-50",
    label: "Signed in to SETU",
    time: "Today, 08:22",
    detail: "Chrome on Windows",
  },
  {
    id: "a2",
    icon: CalendarCheck,
    color: "text-green-500 bg-green-50",
    label: "Registered attendance for 7A",
    time: "Today, 09:15",
    detail: "Period 1 · 25/25 students",
  },
  {
    id: "a3",
    icon: ClipboardList,
    color: "text-purple-500 bg-purple-50",
    label: "Set new assignment",
    time: "Today, 10:00",
    detail: "Shakespeare Essay · 7A · Due Fri",
  },
  {
    id: "a4",
    icon: MessageSquare,
    color: "text-pink-500 bg-pink-50",
    label: "Sent message",
    time: "Today, 11:30",
    detail: "To: Sarah Whitfield",
  },
  {
    id: "a5",
    icon: CalendarCheck,
    color: "text-green-500 bg-green-50",
    label: "Registered attendance for 8B",
    time: "Today, 13:10",
    detail: "Period 4 · 27/28 students",
  },
  {
    id: "a6",
    icon: AlertTriangle,
    color: "text-amber-500 bg-amber-50",
    label: "Logged incident report",
    time: "Yesterday, 14:45",
    detail: "Marcus Williams · Behaviour",
  },
  {
    id: "a7",
    icon: BookOpen,
    color: "text-indigo-500 bg-indigo-50",
    label: "Entered grades",
    time: "Yesterday, 15:30",
    detail: "Reading Comprehension · 9C",
  },
  {
    id: "a8",
    icon: Settings,
    color: "text-gray-500 bg-gray-50",
    label: "Updated profile settings",
    time: "Mon 3 Mar",
    detail: "Avatar initials changed",
  },
  {
    id: "a9",
    icon: LogIn,
    color: "text-blue-500 bg-blue-50",
    label: "Signed in to SETU",
    time: "Mon 3 Mar, 08:17",
    detail: "Safari on iPhone",
  },
  {
    id: "a10",
    icon: CheckSquare,
    color: "text-teal-500 bg-teal-50",
    label: "Marked 22 assignments",
    time: "Fri 28 Feb",
    detail: "Creative Writing · 8B",
  },
];

const STUDENT_GRADES = [
  { subject: "Mathematics", grade: "B+", teacher: "Mr Patel", date: "28 Feb" },
  {
    subject: "English Literature",
    grade: "A-",
    teacher: "Ms Fletcher",
    date: "25 Feb",
  },
  { subject: "Science", grade: "B", teacher: "Mr Morrison", date: "22 Feb" },
  { subject: "History", grade: "A", teacher: "Ms Campbell", date: "20 Feb" },
  { subject: "Art", grade: "A*", teacher: "Ms Turner", date: "18 Feb" },
];

const STUDENT_ATTENDANCE_HISTORY = [
  { name: "Sep", attendance: 98 },
  { name: "Oct", attendance: 96 },
  { name: "Nov", attendance: 95 },
  { name: "Dec", attendance: 94 },
  { name: "Jan", attendance: 92 },
  { name: "Feb", attendance: 91 },
  { name: "Mar", attendance: 93 },
];

const LINKED_CHILDREN_PROFILES = [
  {
    id: "c1",
    name: "Jamie Cooper",
    initials: "JC",
    year: "Year 9",
    form: "9B",
    attendance: "88%",
    dob: "12 Apr 2012",
    teacher: "Mr James",
    color: "bg-blue-500",
  },
  {
    id: "c2",
    name: "Sophie Cooper",
    initials: "SC",
    year: "Year 7",
    form: "7A",
    attendance: "96%",
    dob: "5 Sep 2014",
    teacher: "Ms Patel",
    color: "bg-pink-500",
  },
];

// ─── Role display helpers ──────────────────────────────────────────────────────

const ROLE_LABELS: Partial<Record<Role, string>> = {
  MASTER_ADMIN: "System Administrator",
  IT_ADMINISTRATOR: "IT Administrator",
  IT_TECHNICIAN: "IT Technician",
  HEAD_OF_SCHOOL: "Head of School",
  SLT_MEMBER: "Senior Leadership",
  DATA_MANAGER: "Data Manager",
  HEAD_OF_YEAR: "Head of Year",
  TEACHER: "Teacher",
  HEAD_OF_DEPARTMENT: "Head of Department",
  COVER_SUPERVISOR: "Cover Supervisor",
  ATTENDANCE_WELFARE_OFFICER: "Attendance & Welfare",
  STUDENT: "Student",
  STUDENT_LEADERSHIP: "Student Leadership",
  PARENT: "Parent / Guardian",
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
  SUPPORT_STAFF: "Support Staff",
};

const DEPT_LABELS: Record<string, string> = {
  dept_english: "English",
  dept_maths: "Mathematics",
  dept_science: "Science",
  dept_humanities: "Humanities",
};

const YEAR_GROUP_LABELS: Record<string, string> = {
  yg_7: "Year 7",
  yg_8: "Year 8",
  yg_9: "Year 9",
  yg_10: "Year 10",
  yg_11: "Year 11",
};

// ─── Info field ────────────────────────────────────────────────────────────────

function InfoField({
  icon: Icon,
  label,
  value,
  iconColor = "text-gray-400",
}: {
  icon: ElementType;
  label: string;
  value: string | null | undefined;
  iconColor?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50">
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-800 mt-0.5">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

// ─── Student-specific section ──────────────────────────────────────────────────

function StudentSection() {
  return (
    <div className="space-y-4">
      <Separator />
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-blue-500" />
        Academic Overview
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Attendance"
          value="93%"
          icon={CalendarCheck}
          variant="success"
          trend={{ value: 1.5, label: "vs last month", direction: "up" }}
        />
        <StatCard
          title="Merit Points"
          value="142"
          icon={Star}
          variant="info"
          trend={{ value: 8, label: "this week", direction: "up" }}
        />
        <StatCard
          title="Grade Average"
          value="B+"
          icon={Award}
          variant="default"
        />
      </div>

      <Card className="p-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Attendance History
        </h4>
        <AttendanceLineChart data={STUDENT_ATTENDANCE_HISTORY} height={160} />
      </Card>

      <Card className="p-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Recent Grades
        </h4>
        <div className="space-y-0">
          {STUDENT_GRADES.map((g, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{g.subject}</p>
                <p className="text-xs text-gray-400">
                  {g.teacher} · {g.date}
                </p>
              </div>
              <span
                className={cn(
                  "text-base font-bold",
                  g.grade.startsWith("A")
                    ? "text-green-600"
                    : g.grade.startsWith("B")
                      ? "text-blue-600"
                      : "text-amber-600",
                )}
              >
                {g.grade}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Parent-specific section ───────────────────────────────────────────────────

function ParentSection() {
  return (
    <div className="space-y-4">
      <Separator />
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Baby className="h-4 w-4 text-pink-500" />
        Linked Children
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LINKED_CHILDREN_PROFILES.map((child) => (
          <Card key={child.id} className="p-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white text-base font-bold",
                  child.color,
                )}
              >
                {child.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">
                  {child.name}
                </p>
                <p className="text-xs text-gray-400">
                  {child.year} · Form {child.form}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-gray-400 uppercase tracking-wide text-xs">
                  Attendance
                </p>
                <p className="font-semibold text-gray-800 mt-0.5">
                  {child.attendance}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-gray-400 uppercase tracking-wide text-xs">
                  Form Tutor
                </p>
                <p className="font-semibold text-gray-800 mt-0.5 truncate">
                  {child.teacher}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Main ProfilePage ──────────────────────────────────────────────────────────

export default function ProfilePage() {
  const navigate = useNavigate();
  const {
    name,
    email,
    role,
    avatarInitials,
    assignedDepartmentId,
    assignedYearGroupId,
    assignedClassIds,
    linkedStudentIds,
  } = useAuthStore();

  const currentRole = role ?? "SUPPORT_STAFF";
  const roleLabel = ROLE_LABELS[currentRole] ?? currentRole;
  const initials =
    avatarInitials ??
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("") ??
    "U";
  const deptLabel = assignedDepartmentId
    ? (DEPT_LABELS[assignedDepartmentId] ?? assignedDepartmentId)
    : null;
  const yearGroupLabel = assignedYearGroupId
    ? (YEAR_GROUP_LABELS[assignedYearGroupId] ?? assignedYearGroupId)
    : null;
  const classesLabel =
    assignedClassIds.length > 0
      ? assignedClassIds
          .map((c) => c.replace("cls_", "").toUpperCase())
          .join(", ")
      : null;

  const joinedDate = "1 September 2020";

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="My Profile"
        subtitle="View and manage your profile information"
        icon={User}
        iconColor="bg-indigo-600"
        actions={[
          {
            label: "Edit in Settings",
            onClick: () => navigate("/settings"),
            icon: Settings,
            variant: "outline",
          },
        ]}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Avatar hero section */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
                {initials.slice(0, 2).toUpperCase()}
              </div>
              <button
                onClick={() => navigate("/settings")}
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-gray-200 hover:border-gray-300 shadow-sm transition-colors"
                title="Edit profile"
              >
                <Edit3 className="h-3 w-3 text-gray-500" />
              </button>
            </div>

            {/* Name and role */}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {name ?? "Unknown User"}
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className="text-xs font-medium">
                  {roleLabel}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs text-green-700 border-green-200 bg-green-50"
                >
                  Active
                </Badge>
                {currentRole === "MASTER_ADMIN" && (
                  <Badge className="text-xs bg-blue-600 hover:bg-blue-700">
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">{email}</p>
            </div>
          </div>
        </Card>

        {/* Two-column info cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Personal Info */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              Personal Information
            </h3>
            <InfoField
              icon={User}
              label="Full Name"
              value={name}
              iconColor="text-blue-500"
            />
            <InfoField
              icon={Mail}
              label="Email Address"
              value={email}
              iconColor="text-green-500"
            />
            <InfoField
              icon={ShieldCheck}
              label="Role"
              value={roleLabel}
              iconColor="text-indigo-500"
            />
            <InfoField
              icon={CalendarDays}
              label="Joined"
              value={joinedDate}
              iconColor="text-amber-500"
            />
            <InfoField
              icon={Building2}
              label="School"
              value="Hartfield Academy"
              iconColor="text-purple-500"
            />
          </Card>

          {/* Work Info */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              Work Information
            </h3>
            <InfoField
              icon={Building2}
              label="Department"
              value={
                deptLabel ??
                (currentRole === "STUDENT" ? "N/A" : "All Departments")
              }
              iconColor="text-blue-500"
            />
            <InfoField
              icon={GraduationCap}
              label="Year Group"
              value={
                yearGroupLabel ??
                (currentRole === "STUDENT"
                  ? "Year 9"
                  : currentRole === "PARENT"
                    ? "N/A"
                    : "All Years")
              }
              iconColor="text-green-500"
            />
            <InfoField
              icon={Users}
              label="Classes"
              value={
                classesLabel ??
                (currentRole === "STUDENT"
                  ? "9B"
                  : currentRole === "PARENT"
                    ? "N/A"
                    : "All")
              }
              iconColor="text-purple-500"
            />
            <InfoField
              icon={BookOpen}
              label="Subjects"
              value={
                deptLabel
                  ? deptLabel
                  : currentRole === "STUDENT"
                    ? "Maths, English, Science, History, Art, PE"
                    : currentRole === "PARENT"
                      ? "N/A"
                      : "Various"
              }
              iconColor="text-pink-500"
            />
            {currentRole === "PARENT" && (
              <InfoField
                icon={Baby}
                label="Linked Children"
                value={
                  linkedStudentIds.length > 0
                    ? `${linkedStudentIds.length} child(ren)`
                    : "2 children"
                }
                iconColor="text-rose-500"
              />
            )}
          </Card>
        </div>

        {/* Role-specific sections */}
        {(currentRole === "STUDENT" ||
          currentRole === "STUDENT_LEADERSHIP") && (
          <div className="space-y-4">
            <StudentSection />
          </div>
        )}

        {currentRole === "PARENT" && (
          <div className="space-y-4">
            <ParentSection />
          </div>
        )}

        {/* Recent Activity */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              Recent Activity
            </h3>
            <span className="text-xs text-gray-400">Last 10 entries</span>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gray-100" />

            <div className="space-y-1">
              {RECENT_ACTIVITY.map((item, _i) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 pl-1 py-1.5"
                  >
                    <div
                      className={cn(
                        "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl z-10 border-2 border-white",
                        item.color.split(" ")[1],
                      )}
                    >
                      <ItemIcon
                        className={cn("h-4 w-4", item.color.split(" ")[0])}
                      />
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-gray-800 leading-tight">
                          {item.label}
                        </p>
                        <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
