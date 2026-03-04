import {
  ClipboardCheck,
  FileText,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type EntryStatus = "confirmed" | "pending" | "withdrawn";
type ExamTier = "Higher" | "Foundation" | "N/A";
type JCQStatus = "compliant" | "non-compliant" | "in-progress";

interface ExamEntry {
  id: string;
  student: string;
  yearGroup: string;
  subject: string;
  tier: ExamTier;
  board: string;
  candidateNo: string;
  status: EntryStatus;
  uci: string;
}

interface ExamSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  board: string;
  paper: string;
  room: string;
  candidates: number;
  invigilators: string[];
}

interface InvigilationSlot {
  id: string;
  date: string;
  time: string;
  subject: string;
  room: string;
  lead: string;
  assistant: string;
  candidates: number;
  duration: string;
}

interface JCQCheckItem {
  id: string;
  category: string;
  requirement: string;
  status: JCQStatus;
  dueDate?: string;
  notes?: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const EXAM_ENTRIES: ExamEntry[] = [
  {
    id: "ee01",
    student: "Aisha Patel",
    yearGroup: "Year 11",
    subject: "Mathematics",
    tier: "Higher",
    board: "AQA",
    candidateNo: "8300/1H",
    status: "confirmed",
    uci: "4803001",
  },
  {
    id: "ee02",
    student: "Ben Thompson",
    yearGroup: "Year 11",
    subject: "Mathematics",
    tier: "Foundation",
    board: "AQA",
    candidateNo: "8300/1F",
    status: "confirmed",
    uci: "4803002",
  },
  {
    id: "ee03",
    student: "Callum Harris",
    yearGroup: "Year 11",
    subject: "English Language",
    tier: "N/A",
    board: "AQA",
    candidateNo: "8700/1",
    status: "confirmed",
    uci: "4803003",
  },
  {
    id: "ee04",
    student: "Danielle Morgan",
    yearGroup: "Year 11",
    subject: "English Literature",
    tier: "N/A",
    board: "AQA",
    candidateNo: "8702/1",
    status: "confirmed",
    uci: "4803004",
  },
  {
    id: "ee05",
    student: "Ethan Clarke",
    yearGroup: "Year 11",
    subject: "Combined Science",
    tier: "Higher",
    board: "AQA",
    candidateNo: "8464/B/1H",
    status: "pending",
    uci: "4803005",
  },
  {
    id: "ee06",
    student: "Fatima Al-Said",
    yearGroup: "Year 11",
    subject: "History",
    tier: "N/A",
    board: "AQA",
    candidateNo: "8145/1A",
    status: "confirmed",
    uci: "4803006",
  },
  {
    id: "ee07",
    student: "George Bennett",
    yearGroup: "Year 11",
    subject: "Geography",
    tier: "N/A",
    board: "AQA",
    candidateNo: "8035/1",
    status: "confirmed",
    uci: "4803007",
  },
  {
    id: "ee08",
    student: "Hannah Wright",
    yearGroup: "Year 11",
    subject: "French",
    tier: "Higher",
    board: "AQA",
    candidateNo: "8658/LH",
    status: "confirmed",
    uci: "4803008",
  },
  {
    id: "ee09",
    student: "Isaac Johnson",
    yearGroup: "Year 11",
    subject: "Mathematics",
    tier: "Higher",
    board: "AQA",
    candidateNo: "8300/1H",
    status: "confirmed",
    uci: "4803009",
  },
  {
    id: "ee10",
    student: "Jasmine Lee",
    yearGroup: "Year 11",
    subject: "Art & Design",
    tier: "N/A",
    board: "AQA",
    candidateNo: "8201/A",
    status: "confirmed",
    uci: "4803010",
  },
  {
    id: "ee11",
    student: "Kyle Adams",
    yearGroup: "Year 11",
    subject: "Computer Science",
    tier: "N/A",
    board: "OCR",
    candidateNo: "J277/01",
    status: "pending",
    uci: "4803011",
  },
  {
    id: "ee12",
    student: "Layla Hassan",
    yearGroup: "Year 11",
    subject: "Business Studies",
    tier: "N/A",
    board: "Edexcel",
    candidateNo: "1BS0/01",
    status: "confirmed",
    uci: "4803012",
  },
  {
    id: "ee13",
    student: "Marcus White",
    yearGroup: "Year 11",
    subject: "Mathematics",
    tier: "Higher",
    board: "AQA",
    candidateNo: "8300/1H",
    status: "confirmed",
    uci: "4803013",
  },
  {
    id: "ee14",
    student: "Nadia Kowalski",
    yearGroup: "Year 11",
    subject: "Combined Science",
    tier: "Foundation",
    board: "AQA",
    candidateNo: "8464/B/1F",
    status: "withdrawn",
    uci: "4803014",
  },
  {
    id: "ee15",
    student: "Oscar Davies",
    yearGroup: "Year 11",
    subject: "Physical Education",
    tier: "N/A",
    board: "AQA",
    candidateNo: "8582/1",
    status: "confirmed",
    uci: "4803015",
  },
];

const EXAM_SLOTS: ExamSlot[] = [
  {
    id: "es01",
    date: "2025-05-12",
    startTime: "09:00",
    endTime: "11:30",
    subject: "Mathematics Paper 1",
    board: "AQA",
    paper: "8300/1H & 1F",
    room: "Main Hall",
    candidates: 62,
    invigilators: ["Mrs Thompson", "Mr Hall"],
  },
  {
    id: "es02",
    date: "2025-05-13",
    startTime: "13:30",
    endTime: "15:30",
    subject: "English Language Paper 1",
    board: "AQA",
    paper: "8700/1",
    room: "Main Hall",
    candidates: 58,
    invigilators: ["Mrs Lewis", "Mr Davis"],
  },
  {
    id: "es03",
    date: "2025-05-15",
    startTime: "09:00",
    endTime: "10:45",
    subject: "Combined Science Biology 1",
    board: "AQA",
    paper: "8464/B/1H & 1F",
    room: "Sports Hall",
    candidates: 55,
    invigilators: ["Ms Roberts", "Mr Wilson"],
  },
  {
    id: "es04",
    date: "2025-05-16",
    startTime: "13:30",
    endTime: "15:00",
    subject: "History Component 1",
    board: "AQA",
    paper: "8145/1A/B",
    room: "Library",
    candidates: 28,
    invigilators: ["Ms Green", "Mr Evans"],
  },
  {
    id: "es05",
    date: "2025-05-19",
    startTime: "09:00",
    endTime: "11:30",
    subject: "Mathematics Paper 2",
    board: "AQA",
    paper: "8300/2H & 2F",
    room: "Main Hall",
    candidates: 62,
    invigilators: ["Mrs Thompson", "Mr Hall"],
  },
  {
    id: "es06",
    date: "2025-05-20",
    startTime: "09:00",
    endTime: "10:45",
    subject: "French Listening & Reading",
    board: "AQA",
    paper: "8658/LH & RH",
    room: "Room E04",
    candidates: 14,
    invigilators: ["Mme Dupont"],
  },
  {
    id: "es07",
    date: "2025-05-21",
    startTime: "13:30",
    endTime: "15:30",
    subject: "English Literature Paper 1",
    board: "AQA",
    paper: "8702/1",
    room: "Sports Hall",
    candidates: 60,
    invigilators: ["Mrs Lewis", "Mr Davis", "Ms Lee"],
  },
  {
    id: "es08",
    date: "2025-05-22",
    startTime: "09:00",
    endTime: "10:45",
    subject: "Geography Paper 1",
    board: "AQA",
    paper: "8035/1",
    room: "Library",
    candidates: 32,
    invigilators: ["Ms Green"],
  },
  {
    id: "es09",
    date: "2025-05-26",
    startTime: "09:00",
    endTime: "10:30",
    subject: "Computer Science Paper 1",
    board: "OCR",
    paper: "J277/01",
    room: "IT Suite 1",
    candidates: 18,
    invigilators: ["Mr Hall"],
  },
  {
    id: "es10",
    date: "2025-05-27",
    startTime: "13:30",
    endTime: "15:30",
    subject: "Business Studies Paper 1",
    board: "Edexcel",
    paper: "1BS0/01",
    room: "Room M12",
    candidates: 22,
    invigilators: ["Mr Ahmed", "Mrs White"],
  },
  {
    id: "es11",
    date: "2025-06-02",
    startTime: "09:00",
    endTime: "11:30",
    subject: "Mathematics Paper 3",
    board: "AQA",
    paper: "8300/3H & 3F",
    room: "Main Hall",
    candidates: 62,
    invigilators: ["Mrs Thompson", "Mr Hall", "Ms Roberts"],
  },
  {
    id: "es12",
    date: "2025-06-03",
    startTime: "13:30",
    endTime: "15:30",
    subject: "English Language Paper 2",
    board: "AQA",
    paper: "8700/2",
    room: "Sports Hall",
    candidates: 58,
    invigilators: ["Mrs Lewis", "Mr Davis"],
  },
];

const INVIGILATION_SLOTS: InvigilationSlot[] = EXAM_SLOTS.slice(0, 8).map(
  (s, i) => ({
    id: `inv${i + 1}`,
    date: s.date,
    time: `${s.startTime} – ${s.endTime}`,
    subject: s.subject,
    room: s.room,
    lead: s.invigilators[0],
    assistant: s.invigilators[1] ?? "TBC",
    candidates: s.candidates,
    duration: `${Math.round((new Date(`2000-01-01T${s.endTime}`).getTime() - new Date(`2000-01-01T${s.startTime}`).getTime()) / 60000)} mins`,
  }),
);

const JCQ_CHECKLIST: JCQCheckItem[] = [
  {
    id: "jq01",
    category: "Entries & Timetabling",
    requirement: "All candidate entries submitted to awarding bodies",
    status: "compliant",
    notes: "Submitted 28 Oct 2024",
  },
  {
    id: "jq02",
    category: "Entries & Timetabling",
    requirement: "Clash table checked and resolved",
    status: "compliant",
  },
  {
    id: "jq03",
    category: "Entries & Timetabling",
    requirement: "Private candidates registered",
    status: "compliant",
    notes: "0 private candidates this series",
  },
  {
    id: "jq04",
    category: "Access Arrangements",
    requirement: "Access arrangement forms completed and signed",
    status: "compliant",
    notes: "14 candidates with access arrangements",
  },
  {
    id: "jq05",
    category: "Access Arrangements",
    requirement: "Evidence of need on file (Form 8)",
    status: "compliant",
  },
  {
    id: "jq06",
    category: "Access Arrangements",
    requirement: "Reader/Scribe training completed",
    status: "in-progress",
    dueDate: "2025-03-01",
    notes: "Training scheduled for Feb 2025",
  },
  {
    id: "jq07",
    category: "Centre Inspectors",
    requirement: "JCQ Centre Inspector visit booked",
    status: "compliant",
    notes: "Visit confirmed 15 Jan 2025",
  },
  {
    id: "jq08",
    category: "Exam Room",
    requirement: "Seating plans produced for all rooms",
    status: "in-progress",
    dueDate: "2025-04-01",
  },
  {
    id: "jq09",
    category: "Exam Room",
    requirement: "Invigilator training completed",
    status: "in-progress",
    dueDate: "2025-04-15",
    notes: "12 of 18 invigilators trained",
  },
  {
    id: "jq10",
    category: "Exam Room",
    requirement: "Exam stationery ordered",
    status: "compliant",
  },
  {
    id: "jq11",
    category: "Security & Confidentiality",
    requirement: "Secure storage for question papers arranged",
    status: "compliant",
    notes: "Safe in exams office",
  },
  {
    id: "jq12",
    category: "Security & Confidentiality",
    requirement: "Question paper opening protocol documented",
    status: "compliant",
  },
  {
    id: "jq13",
    category: "Results & Post-results",
    requirement: "Results day plan approved",
    status: "in-progress",
    dueDate: "2025-06-01",
  },
  {
    id: "jq14",
    category: "Results & Post-results",
    requirement: "Post-results services information shared with students",
    status: "non-compliant",
    dueDate: "2025-07-01",
    notes: "Action required — send to Year 11 tutor groups",
  },
  {
    id: "jq15",
    category: "Malpractice",
    requirement: "Candidate malpractice regulations shared",
    status: "compliant",
    notes: "Assembly held Sep 2024",
  },
];

// ─── Column definitions ───────────────────────────────────────────────────────

const entryStatusStyles: Record<EntryStatus, string> = {
  confirmed: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  withdrawn: "bg-gray-100 text-gray-600 border-gray-200",
};

const tierStyles: Record<ExamTier, string> = {
  Higher: "bg-purple-100 text-purple-700 border-purple-200",
  Foundation: "bg-blue-100 text-blue-700 border-blue-200",
  "N/A": "bg-gray-50 text-gray-500 border-gray-200",
};

const examEntryColumns: ColumnDef<ExamEntry>[] = [
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.student}</span>
    ),
  },
  { accessorKey: "yearGroup", header: "Year" },
  { accessorKey: "subject", header: "Subject" },
  {
    accessorKey: "tier",
    header: "Tier",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex px-2 py-0.5 rounded border text-xs font-medium",
          tierStyles[row.original.tier],
        )}
      >
        {row.original.tier}
      </span>
    ),
  },
  { accessorKey: "board", header: "Board" },
  { accessorKey: "candidateNo", header: "Candidate No." },
  { accessorKey: "uci", header: "UCI" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex px-2 py-0.5 rounded-full border text-xs font-medium",
          entryStatusStyles[row.original.status],
        )}
      >
        {row.original.status.charAt(0).toUpperCase() +
          row.original.status.slice(1)}
      </span>
    ),
  },
];

const timetableColumns: ColumnDef<ExamSlot>[] = [
  { accessorKey: "date", header: "Date" },
  {
    id: "time",
    header: "Time",
    cell: ({ row }) => `${row.original.startTime} – ${row.original.endTime}`,
  },
  { accessorKey: "subject", header: "Subject / Paper" },
  { accessorKey: "board", header: "Board" },
  { accessorKey: "room", header: "Room" },
  { accessorKey: "candidates", header: "Candidates" },
  {
    accessorKey: "invigilators",
    header: "Invigilators",
    cell: ({ row }) => (
      <span className="text-xs text-gray-600">
        {row.original.invigilators.join(", ")}
      </span>
    ),
  },
];

const invigilationColumns: ColumnDef<InvigilationSlot>[] = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "time", header: "Time" },
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "room", header: "Room" },
  { accessorKey: "lead", header: "Lead Invigilator" },
  { accessorKey: "assistant", header: "Assistant" },
  { accessorKey: "candidates", header: "Candidates" },
  { accessorKey: "duration", header: "Duration" },
];

// ─── JCQ Checklist ────────────────────────────────────────────────────────────

const JCQ_STATUS_CONFIG: Record<
  JCQStatus,
  { icon: React.ElementType; color: string; label: string; badgeClass: string }
> = {
  compliant: {
    icon: CheckCircle2,
    color: "text-green-500",
    label: "Compliant",
    badgeClass: "bg-green-100 text-green-700 border-green-200",
  },
  "non-compliant": {
    icon: XCircle,
    color: "text-red-500",
    label: "Non-Compliant",
    badgeClass: "bg-red-100 text-red-700 border-red-200",
  },
  "in-progress": {
    icon: AlertCircle,
    color: "text-amber-500",
    label: "In Progress",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
  },
};

function JCQChecklistTab() {
  const categories = [...new Set(JCQ_CHECKLIST.map((i) => i.category))];

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {(["compliant", "in-progress", "non-compliant"] as JCQStatus[]).map(
          (s) => {
            const count = JCQ_CHECKLIST.filter((i) => i.status === s).length;
            const cfg = JCQ_STATUS_CONFIG[s];
            const Icon = cfg.icon;
            return (
              <Card key={s} className="p-3">
                <div
                  className={cn(
                    "flex items-center gap-2 font-semibold",
                    cfg.color,
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xl">{count}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{cfg.label}</p>
              </Card>
            );
          },
        )}
      </div>

      {/* Grouped checklist */}
      {categories.map((cat) => {
        const items = JCQ_CHECKLIST.filter((i) => i.category === cat);
        return (
          <div key={cat} className="space-y-1">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
              {cat}
            </h4>
            <Card className="divide-y divide-gray-100 overflow-hidden">
              {items.map((item) => {
                const cfg = JCQ_STATUS_CONFIG[item.status];
                const Icon = cfg.icon;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3",
                      item.status === "non-compliant" && "bg-red-50",
                    )}
                  >
                    <Icon
                      className={cn("h-4 w-4 mt-0.5 shrink-0", cfg.color)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">
                        {item.requirement}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.notes}
                        </p>
                      )}
                      {item.dueDate && (
                        <p className="text-xs text-amber-600 mt-0.5">
                          Due: {item.dueDate}
                        </p>
                      )}
                    </div>
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded-full border text-xs font-medium shrink-0",
                        cfg.badgeClass,
                      )}
                    >
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </Card>
          </div>
        );
      })}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExaminationsPage() {
  const pendingEntries = EXAM_ENTRIES.filter(
    (e) => e.status === "pending",
  ).length;
  const totalInvigilationHours = EXAM_SLOTS.reduce((acc, s) => {
    const dur =
      (new Date(`2000-01-01T${s.endTime}`).getTime() -
        new Date(`2000-01-01T${s.startTime}`).getTime()) /
      3600000;
    return acc + dur * s.invigilators.length;
  }, 0);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Examinations"
        subtitle="Entries, timetable, invigilation and JCQ compliance"
        icon={ClipboardCheck}
        iconColor="bg-indigo-600"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            title="Total Entries"
            value={EXAM_ENTRIES.length}
            subtitle={`${pendingEntries} pending confirmation`}
            icon={FileText}
            variant="default"
          />
          <StatCard
            title="Exams This Week"
            value="12"
            subtitle="Week of 12–16 May 2025"
            icon={Clock}
            variant="info"
          />
          <StatCard
            title="Invigilation Hours"
            value={`${totalInvigilationHours.toFixed(0)}`}
            subtitle="Total across exam series"
            icon={Users}
            variant="warning"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="entries">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="entries">Entries</TabsTrigger>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="invigilation">Invigilation</TabsTrigger>
            <TabsTrigger value="jcq">
              JCQ Compliance
              {JCQ_CHECKLIST.filter((i) => i.status === "non-compliant")
                .length > 0 && (
                <Badge className="ml-1.5 text-[10px] bg-red-100 text-red-700">
                  {
                    JCQ_CHECKLIST.filter((i) => i.status === "non-compliant")
                      .length
                  }
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Entries tab ── */}
          <TabsContent value="entries" className="mt-4">
            <DataTable
              columns={examEntryColumns}
              data={EXAM_ENTRIES}
              searchPlaceholder="Search candidates, subjects..."
              emptyMessage="No examination entries"
              rowClassName={(row) =>
                row.status === "withdrawn" ? "opacity-50" : ""
              }
            />
          </TabsContent>

          {/* ── Timetable tab ── */}
          <TabsContent value="timetable" className="mt-4">
            <DataTable
              columns={timetableColumns}
              data={EXAM_SLOTS}
              searchPlaceholder="Search exams, subjects, rooms..."
              emptyMessage="No exam slots scheduled"
            />
          </TabsContent>

          {/* ── Invigilation tab ── */}
          <TabsContent value="invigilation" className="mt-4">
            <DataTable
              columns={invigilationColumns}
              data={INVIGILATION_SLOTS}
              searchPlaceholder="Search invigilation slots..."
              emptyMessage="No invigilation slots"
            />
          </TabsContent>

          {/* ── JCQ Compliance tab ── */}
          <TabsContent value="jcq" className="mt-4">
            <JCQChecklistTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
