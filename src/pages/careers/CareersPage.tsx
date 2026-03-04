import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Compass,
  CalendarCheck,
  GraduationCap,
  Briefcase,
  Plus,
  Eye,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type UCASStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "OFFER_RECEIVED"
  | "OFFER_ACCEPTED"
  | "UNSUCCESSFUL";

type PSStatus = "NOT_STARTED" | "DRAFT" | "COMPLETE" | "SUBMITTED";
type WEXStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
type SessionType =
  | "INITIAL"
  | "FOLLOW_UP"
  | "UCAS"
  | "CAREER_PLANNING"
  | "UNIVERSITY_VISIT";

interface StudentProfile {
  id: string;
  name: string;
  year: string;
  careerInterests: string[];
  lastSession: string;
  ucasStatus: UCASStatus;
  adviser: string;
  skills: string[];
  targetUniversities: string[];
  wexHistory: string[];
}

interface CareerSession {
  id: string;
  student: string;
  adviser: string;
  date: string;
  sessionType: SessionType;
  notes: string;
  followUpDate: string;
}

interface WorkExperience {
  id: string;
  student: string;
  employer: string;
  startDate: string;
  endDate: string;
  status: WEXStatus;
  reportSubmitted: boolean;
}

interface UCASApplication {
  id: string;
  student: string;
  year: string;
  choices: number;
  psStatus: PSStatus;
  referenceStatus: PSStatus;
  submissionDate: string;
  ucasStatus: UCASStatus;
}

const UCAS_STATUS_CONFIG: Record<
  UCASStatus,
  { label: string; className: string }
> = {
  NOT_STARTED: { label: "Not Started", className: "bg-gray-100 text-gray-600" },
  IN_PROGRESS: { label: "In Progress", className: "bg-blue-100 text-blue-700" },
  SUBMITTED: { label: "Submitted", className: "bg-purple-100 text-purple-700" },
  OFFER_RECEIVED: {
    label: "Offer Received",
    className: "bg-amber-100 text-amber-700",
  },
  OFFER_ACCEPTED: {
    label: "Offer Accepted",
    className: "bg-green-100 text-green-700",
  },
  UNSUCCESSFUL: { label: "Unsuccessful", className: "bg-red-100 text-red-700" },
};

const PS_STATUS_CONFIG: Record<PSStatus, { label: string; className: string }> =
  {
    NOT_STARTED: {
      label: "Not Started",
      className: "bg-gray-100 text-gray-500",
    },
    DRAFT: { label: "Draft", className: "bg-amber-100 text-amber-700" },
    COMPLETE: { label: "Complete", className: "bg-blue-100 text-blue-700" },
    SUBMITTED: { label: "Submitted", className: "bg-green-100 text-green-700" },
  };

const WEX_STATUS_CONFIG: Record<
  WEXStatus,
  { label: string; className: string }
> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-600" },
};

const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  INITIAL: "Initial Meeting",
  FOLLOW_UP: "Follow-Up",
  UCAS: "UCAS Support",
  CAREER_PLANNING: "Career Planning",
  UNIVERSITY_VISIT: "University Visit",
};

const ADVISERS = ["Ms. J. Reid", "Mr. P. Okafor", "Mrs. C. Yates"];

const MOCK_STUDENT_PROFILES: StudentProfile[] = [
  {
    id: "1",
    name: "Isla Thompson",
    year: "Year 11",
    careerInterests: ["Medicine", "Biology"],
    lastSession: "2025-01-15",
    ucasStatus: "NOT_STARTED",
    adviser: "Ms. J. Reid",
    skills: ["Biology", "Chemistry", "Teamwork"],
    targetUniversities: ["Oxford", "UCL", "Edinburgh"],
    wexHistory: ["GP Surgery — 1 week"],
  },
  {
    id: "2",
    name: "Noah Williams",
    year: "Year 12",
    careerInterests: ["Engineering", "Technology"],
    lastSession: "2025-01-20",
    ucasStatus: "IN_PROGRESS",
    adviser: "Mr. P. Okafor",
    skills: ["Maths", "Physics", "Problem Solving"],
    targetUniversities: ["Imperial", "Manchester", "Bath"],
    wexHistory: ["Arup — 2 weeks"],
  },
  {
    id: "3",
    name: "Amelia Singh",
    year: "Year 12",
    careerInterests: ["Law", "Politics"],
    lastSession: "2025-01-22",
    ucasStatus: "IN_PROGRESS",
    adviser: "Ms. J. Reid",
    skills: ["English", "History", "Debate"],
    targetUniversities: ["LSE", "Durham", "Exeter"],
    wexHistory: ["Local Solicitor — 1 week"],
  },
  {
    id: "4",
    name: "Ethan Miller",
    year: "Year 13",
    careerInterests: ["Computer Science", "AI"],
    lastSession: "2025-01-10",
    ucasStatus: "SUBMITTED",
    adviser: "Mr. P. Okafor",
    skills: ["Programming", "Maths", "Logic"],
    targetUniversities: ["Cambridge", "Imperial", "UCL"],
    wexHistory: ["Google (virtual)", "Local Tech Startup — 2 weeks"],
  },
  {
    id: "5",
    name: "Sophie Brown",
    year: "Year 11",
    careerInterests: ["Art", "Design"],
    lastSession: "2025-01-18",
    ucasStatus: "NOT_STARTED",
    adviser: "Mrs. C. Yates",
    skills: ["Art", "Photography", "Creativity"],
    targetUniversities: ["Central Saint Martins", "Goldsmiths"],
    wexHistory: ["Design Studio — 1 week"],
  },
  {
    id: "6",
    name: "Liam Jackson",
    year: "Year 13",
    careerInterests: ["Finance", "Economics"],
    lastSession: "2025-01-08",
    ucasStatus: "OFFER_RECEIVED",
    adviser: "Ms. J. Reid",
    skills: ["Maths", "Economics", "Analysis"],
    targetUniversities: ["LSE", "Warwick", "Bristol"],
    wexHistory: ["PwC (virtual)", "Local Accountant — 1 week"],
  },
  {
    id: "7",
    name: "Chloe Davis",
    year: "Year 12",
    careerInterests: ["Psychology", "Counselling"],
    lastSession: "2025-01-25",
    ucasStatus: "NOT_STARTED",
    adviser: "Mrs. C. Yates",
    skills: ["Psychology", "Sociology", "Empathy"],
    targetUniversities: ["Birmingham", "Southampton", "Leicester"],
    wexHistory: [],
  },
];

const MOCK_SESSIONS: CareerSession[] = [
  {
    id: "1",
    student: "Isla Thompson",
    adviser: "Ms. J. Reid",
    date: "2025-01-15",
    sessionType: "INITIAL",
    notes:
      "Explored medical career paths. Recommended work experience at GP surgery.",
    followUpDate: "2025-02-12",
  },
  {
    id: "2",
    student: "Noah Williams",
    adviser: "Mr. P. Okafor",
    date: "2025-01-20",
    sessionType: "UCAS",
    notes: "Reviewed UCAS personal statement draft. Good engineering focus.",
    followUpDate: "2025-02-10",
  },
  {
    id: "3",
    student: "Amelia Singh",
    adviser: "Ms. J. Reid",
    date: "2025-01-22",
    sessionType: "CAREER_PLANNING",
    notes: "Discussed law conversion route. Recommended mooting club.",
    followUpDate: "2025-02-20",
  },
  {
    id: "4",
    student: "Ethan Miller",
    adviser: "Mr. P. Okafor",
    date: "2025-01-10",
    sessionType: "UCAS",
    notes: "UCAS application submitted. Awaiting offers.",
    followUpDate: "2025-02-15",
  },
  {
    id: "5",
    student: "Liam Jackson",
    adviser: "Ms. J. Reid",
    date: "2025-01-08",
    sessionType: "FOLLOW_UP",
    notes:
      "Received offer from Warwick. Discussing firm and insurance choices.",
    followUpDate: "2025-02-05",
  },
  {
    id: "6",
    student: "Chloe Davis",
    adviser: "Mrs. C. Yates",
    date: "2025-01-25",
    sessionType: "INITIAL",
    notes: "First session. Exploring psychology and social work routes.",
    followUpDate: "2025-03-01",
  },
];

const MOCK_WORK_EXPERIENCE: WorkExperience[] = [
  {
    id: "1",
    student: "Isla Thompson",
    employer: "City Medical Practice",
    startDate: "2025-02-10",
    endDate: "2025-02-14",
    status: "CONFIRMED",
    reportSubmitted: false,
  },
  {
    id: "2",
    student: "Noah Williams",
    employer: "Arup Engineering",
    startDate: "2024-07-01",
    endDate: "2024-07-12",
    status: "COMPLETED",
    reportSubmitted: true,
  },
  {
    id: "3",
    student: "Amelia Singh",
    employer: "Clarke & Co Solicitors",
    startDate: "2024-10-28",
    endDate: "2024-11-01",
    status: "COMPLETED",
    reportSubmitted: true,
  },
  {
    id: "4",
    student: "Sophie Brown",
    employer: "Studio Ink Design",
    startDate: "2025-03-03",
    endDate: "2025-03-07",
    status: "PENDING",
    reportSubmitted: false,
  },
  {
    id: "5",
    student: "Liam Jackson",
    employer: "Local Accountancy Firm",
    startDate: "2024-07-08",
    endDate: "2024-07-12",
    status: "COMPLETED",
    reportSubmitted: true,
  },
  {
    id: "6",
    student: "Chloe Davis",
    employer: "Mind Charity — Local Branch",
    startDate: "2025-04-07",
    endDate: "2025-04-11",
    status: "PENDING",
    reportSubmitted: false,
  },
];

// 45 Year 12/13 students for UCAS tab
const UCAS_FIRST_NAMES = [
  "Emily",
  "Oliver",
  "Noah",
  "Ethan",
  "Liam",
  "Charlotte",
  "Isla",
  "Amelia",
  "Mia",
  "Sophia",
  "James",
  "Lucas",
  "Henry",
  "Oscar",
  "Jack",
  "Grace",
  "Ruby",
  "Poppy",
  "Lily",
  "Alice",
  "George",
  "Harry",
  "Alfie",
  "Max",
  "Jake",
  "Ella",
  "Ava",
  "Imogen",
  "Freya",
  "Daisy",
];
const UCAS_LAST_NAMES = [
  "Smith",
  "Jones",
  "Williams",
  "Taylor",
  "Brown",
  "Davies",
  "Evans",
  "Wilson",
  "Thomas",
  "Roberts",
  "Johnson",
  "White",
  "Lewis",
  "Harris",
  "Clarke",
  "Hall",
  "Martin",
  "Wood",
  "Allen",
  "Scott",
];
const UCAS_STATUSES: UCASStatus[] = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "SUBMITTED",
  "OFFER_RECEIVED",
  "OFFER_ACCEPTED",
  "UNSUCCESSFUL",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return Math.abs(s) / 0xffffffff;
  };
}

const MOCK_UCAS: UCASApplication[] = Array.from({ length: 45 }, (_, i) => {
  const rng = seededRandom(i * 137 + 42);
  const firstName =
    UCAS_FIRST_NAMES[Math.floor(rng() * UCAS_FIRST_NAMES.length)];
  const lastName = UCAS_LAST_NAMES[Math.floor(rng() * UCAS_LAST_NAMES.length)];
  const ucasStatus = UCAS_STATUSES[Math.floor(rng() * UCAS_STATUSES.length)];
  const psStatus =
    ucasStatus === "NOT_STARTED"
      ? "NOT_STARTED"
      : ucasStatus === "IN_PROGRESS"
        ? rng() > 0.5
          ? "DRAFT"
          : "COMPLETE"
        : "SUBMITTED";
  const refStatus =
    ucasStatus === "NOT_STARTED"
      ? "NOT_STARTED"
      : ucasStatus === "IN_PROGRESS"
        ? rng() > 0.5
          ? "DRAFT"
          : "COMPLETE"
        : "SUBMITTED";
  const year = rng() > 0.5 ? "Year 12" : "Year 13";
  const choices = Math.floor(rng() * 3) + 3;
  const month = Math.floor(rng() * 3) + 1;
  const day = Math.floor(rng() * 28) + 1;
  return {
    id: String(i + 1),
    student: `${firstName} ${lastName}`,
    year,
    choices,
    psStatus: psStatus as PSStatus,
    referenceStatus: refStatus as PSStatus,
    submissionDate:
      ucasStatus === "NOT_STARTED" || ucasStatus === "IN_PROGRESS"
        ? "—"
        : `2025-0${month}-${String(day).padStart(2, "0")}`,
    ucasStatus,
  };
});

function UCASStatusBadge({ status }: { status: UCASStatus }) {
  const cfg = UCAS_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        cfg.className,
      )}
    >
      {cfg.label}
    </span>
  );
}

function PSStatusBadge({ status }: { status: PSStatus }) {
  const cfg = PS_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        cfg.className,
      )}
    >
      {cfg.label}
    </span>
  );
}

function WEXStatusBadge({ status }: { status: WEXStatus }) {
  const cfg = WEX_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        cfg.className,
      )}
    >
      {cfg.label}
    </span>
  );
}

export default function CareersPage() {
  const [activeTab, setActiveTab] = useState("profiles");
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null,
  );
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [showWEXDialog, setShowWEXDialog] = useState(false);

  const profileColumns: ColumnDef<StudentProfile>[] = [
    { accessorKey: "name", header: "Student" },
    { accessorKey: "year", header: "Year" },
    {
      accessorKey: "careerInterests",
      header: "Career Interests",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.careerInterests.map((i) => (
            <span
              key={i}
              className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-xs"
            >
              {i}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "lastSession",
      header: "Last Session",
      cell: ({ row }) =>
        new Date(row.original.lastSession).toLocaleDateString("en-GB"),
    },
    {
      accessorKey: "ucasStatus",
      header: "UCAS Status",
      cell: ({ row }) => <UCASStatusBadge status={row.original.ucasStatus} />,
    },
    { accessorKey: "adviser", header: "Adviser" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStudent(row.original);
          }}
        >
          <Eye className="h-3.5 w-3.5 mr-1" /> Profile
        </Button>
      ),
    },
  ];

  const sessionColumns: ColumnDef<CareerSession>[] = [
    { accessorKey: "student", header: "Student" },
    { accessorKey: "adviser", header: "Adviser" },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.date).toLocaleDateString("en-GB"),
    },
    {
      accessorKey: "sessionType",
      header: "Session Type",
      cell: ({ row }) => SESSION_TYPE_LABELS[row.original.sessionType],
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => (
        <span className="text-gray-500 text-xs max-w-[240px] truncate block">
          {row.original.notes}
        </span>
      ),
    },
    {
      accessorKey: "followUpDate",
      header: "Follow-up Date",
      cell: ({ row }) =>
        new Date(row.original.followUpDate).toLocaleDateString("en-GB"),
    },
  ];

  const wexColumns: ColumnDef<WorkExperience>[] = [
    { accessorKey: "student", header: "Student" },
    { accessorKey: "employer", header: "Employer" },
    {
      accessorKey: "startDate",
      header: "Start",
      cell: ({ row }) =>
        new Date(row.original.startDate).toLocaleDateString("en-GB"),
    },
    {
      accessorKey: "endDate",
      header: "End",
      cell: ({ row }) =>
        new Date(row.original.endDate).toLocaleDateString("en-GB"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <WEXStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "reportSubmitted",
      header: "Report",
      cell: ({ row }) => (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            row.original.reportSubmitted
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500",
          )}
        >
          {row.original.reportSubmitted ? "Submitted" : "Pending"}
        </span>
      ),
    },
  ];

  const ucasColumns: ColumnDef<UCASApplication>[] = [
    { accessorKey: "student", header: "Student" },
    { accessorKey: "year", header: "Year" },
    {
      accessorKey: "choices",
      header: "Choices",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span className="font-medium">{row.original.choices}</span>
          <span className="text-gray-400 text-xs">/ 5</span>
        </div>
      ),
    },
    {
      accessorKey: "psStatus",
      header: "Personal Statement",
      cell: ({ row }) => <PSStatusBadge status={row.original.psStatus} />,
    },
    {
      accessorKey: "referenceStatus",
      header: "Reference",
      cell: ({ row }) => (
        <PSStatusBadge status={row.original.referenceStatus} />
      ),
    },
    {
      accessorKey: "submissionDate",
      header: "Submission Date",
      cell: ({ row }) =>
        row.original.submissionDate === "—" ? (
          <span className="text-gray-400">—</span>
        ) : (
          new Date(row.original.submissionDate).toLocaleDateString("en-GB")
        ),
    },
    {
      accessorKey: "ucasStatus",
      header: "Status",
      cell: ({ row }) => <UCASStatusBadge status={row.original.ucasStatus} />,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Careers & CEIAG"
        subtitle="Career profiles, guidance sessions, work experience and UCAS support"
        icon={Compass}
        iconColor="bg-indigo-600"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Students with Career Profile"
            value={127}
            icon={User}
            variant="default"
            subtitle="Active profiles"
          />
          <StatCard
            title="Sessions Booked"
            value={23}
            icon={CalendarCheck}
            variant="info"
            subtitle="This term"
          />
          <StatCard
            title="UCAS Applications"
            value={45}
            icon={GraduationCap}
            variant="success"
            subtitle="Year 12 & 13"
          />
          <StatCard
            title="Work Experience Placements"
            value={18}
            icon={Briefcase}
            variant="warning"
            subtitle="This academic year"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100">
            <TabsTrigger value="profiles">Student Profiles</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="wex">Work Experience</TabsTrigger>
            <TabsTrigger value="ucas">UCAS</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="mt-4">
            <DataTable
              columns={profileColumns}
              data={MOCK_STUDENT_PROFILES}
              searchPlaceholder="Search student profiles..."
              onRowClick={setSelectedStudent}
              emptyMessage="No student profiles found"
            />
          </TabsContent>

          <TabsContent value="sessions" className="mt-4">
            <DataTable
              columns={sessionColumns}
              data={MOCK_SESSIONS}
              searchPlaceholder="Search sessions..."
              toolbar={
                <Button size="sm" onClick={() => setShowSessionDialog(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Book Session
                </Button>
              }
              emptyMessage="No sessions found"
            />
          </TabsContent>

          <TabsContent value="wex" className="mt-4">
            <DataTable
              columns={wexColumns}
              data={MOCK_WORK_EXPERIENCE}
              searchPlaceholder="Search placements..."
              toolbar={
                <Button size="sm" onClick={() => setShowWEXDialog(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Placement
                </Button>
              }
              emptyMessage="No work experience placements found"
            />
          </TabsContent>

          <TabsContent value="ucas" className="mt-4">
            <DataTable
              columns={ucasColumns}
              data={MOCK_UCAS}
              searchPlaceholder="Search UCAS applications..."
              emptyMessage="No UCAS applications found"
            />
          </TabsContent>

          <TabsContent value="activities" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "University Fair 2025",
                  date: "2025-03-12",
                  time: "09:00 – 15:00",
                  venue: "Main Hall",
                  registered: 86,
                  capacity: 120,
                  type: "EVENT",
                },
                {
                  title: "Mock Interview Day",
                  date: "2025-02-20",
                  time: "09:00 – 16:00",
                  venue: "Conference Rooms",
                  registered: 34,
                  capacity: 40,
                  type: "EVENT",
                },
                {
                  title: "CV Writing Workshop",
                  date: "2025-02-13",
                  time: "12:30 – 13:15",
                  venue: "Library",
                  registered: 18,
                  capacity: 25,
                  type: "WORKSHOP",
                },
                {
                  title: "Apprenticeship Showcase",
                  date: "2025-04-02",
                  time: "14:00 – 16:00",
                  venue: "Sports Hall",
                  registered: 42,
                  capacity: 100,
                  type: "EVENT",
                },
                {
                  title: "Finance Industry Talk (HSBC)",
                  date: "2025-02-11",
                  time: "13:30 – 14:30",
                  venue: "Lecture Theatre",
                  registered: 55,
                  capacity: 60,
                  type: "TALK",
                },
                {
                  title: "UCAS Personal Statement Clinic",
                  date: "2025-02-18",
                  time: "15:30 – 17:00",
                  venue: "Library",
                  registered: 12,
                  capacity: 15,
                  type: "WORKSHOP",
                },
              ].map((a) => (
                <Card
                  key={a.title}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => toast.info(`Opening ${a.title}`)}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {a.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(a.date).toLocaleDateString("en-GB")} ·{" "}
                        {a.time} · {a.venue}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0",
                        a.type === "EVENT"
                          ? "bg-blue-100 text-blue-700"
                          : a.type === "WORKSHOP"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700",
                      )}
                    >
                      {a.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{a.registered} registered</span>
                    <span className="text-gray-300">/</span>
                    <span>{a.capacity} capacity</span>
                    <div className="flex-1 mx-2 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          a.registered / a.capacity > 0.9
                            ? "bg-red-400"
                            : a.registered / a.capacity > 0.7
                              ? "bg-amber-400"
                              : "bg-green-400",
                        )}
                        style={{
                          width: `${Math.min((a.registered / a.capacity) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Career Profile Side Sheet */}
      <Sheet
        open={!!selectedStudent}
        onOpenChange={(o) => !o && setSelectedStudent(null)}
      >
        <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
          {selectedStudent && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle>{selectedStudent.name}</SheetTitle>
                <SheetDescription>
                  {selectedStudent.year} · Adviser: {selectedStudent.adviser}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                    Career Interests
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudent.careerInterests.map((i) => (
                      <span
                        key={i}
                        className="rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-sm font-medium"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                    Skills & Strengths
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudent.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                    Target Universities / Colleges
                  </p>
                  <ul className="space-y-1">
                    {selectedStudent.targetUniversities.map((u) => (
                      <li
                        key={u}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <GraduationCap className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                    Work Experience History
                  </p>
                  {selectedStudent.wexHistory.length > 0 ? (
                    <ul className="space-y-1">
                      {selectedStudent.wexHistory.map((w) => (
                        <li
                          key={w}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <Briefcase className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400">
                      No work experience recorded yet.
                    </p>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">UCAS Status</span>
                  <UCASStatusBadge status={selectedStudent.ucasStatus} />
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedStudent(null);
                      setShowSessionDialog(true);
                    }}
                  >
                    Book Session
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => toast.info("Opening full profile...")}
                  >
                    Full Profile
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Book Session Dialog */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Career Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Student</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_STUDENT_PROFILES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Adviser</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select adviser" />
                </SelectTrigger>
                <SelectContent>
                  {ADVISERS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-1.5">
                <Label>Session Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SESSION_TYPE_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Follow-up Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea placeholder="Session notes..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSessionDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowSessionDialog(false);
                toast.success("Session booked");
              }}
            >
              Book Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add WEX Placement Dialog */}
      <Dialog open={showWEXDialog} onOpenChange={setShowWEXDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Work Experience Placement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Student</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_STUDENT_PROFILES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Employer / Organisation</Label>
              <Input placeholder="e.g. City Medical Practice" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Contact Name at Employer</Label>
              <Input placeholder="Employer contact name" />
            </div>
            <div className="space-y-1.5">
              <Label>Contact Email</Label>
              <Input type="email" placeholder="contact@employer.com" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWEXDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowWEXDialog(false);
                toast.success("Placement added");
              }}
            >
              Add Placement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
