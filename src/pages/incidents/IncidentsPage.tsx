import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  AlertTriangle,
  Star,
  UserX,
  Clock,
  Plus,
  Award,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Types ---
type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type IncidentStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
type IncidentType =
  | "Disruption"
  | "Bullying"
  | "Fighting"
  | "Language"
  | "Property"
  | "Discrimination"
  | "Other";
type MeritType = "Academic" | "Effort" | "Citizenship" | "Sports" | "Arts";

interface Incident {
  id: string;
  date: string;
  student: string;
  year: string;
  type: IncidentType;
  severity: Severity;
  recordedBy: string;
  status: IncidentStatus;
  description: string;
}

interface Merit {
  id: string;
  date: string;
  student: string;
  year: string;
  meritType: MeritType;
  points: number;
  awardedBy: string;
  notes: string;
}

interface Exclusion {
  id: string;
  date: string;
  student: string;
  year: string;
  type: "Fixed" | "Permanent";
  startDate: string;
  endDate: string;
  reason: string;
  status: "OPEN" | "RESOLVED";
}

interface Detention {
  id: string;
  date: string;
  timeSlot: string;
  room: string;
  students: string[];
  supervisedBy: string;
  reason: string;
}

// --- Mock Data ---
const MOCK_INCIDENTS: Incident[] = [
  {
    id: "inc_1",
    date: "04/03/2026",
    student: "Tyler Banks",
    year: "Year 9",
    type: "Disruption",
    severity: "LOW",
    recordedBy: "Mr. K. Frost",
    status: "RESOLVED",
    description: "Repeated talking during silent work.",
  },
  {
    id: "inc_2",
    date: "04/03/2026",
    student: "Chloe Marsh",
    year: "Year 10",
    type: "Language",
    severity: "MEDIUM",
    recordedBy: "Dr. S. Johnson",
    status: "IN_PROGRESS",
    description: "Inappropriate language directed at a peer.",
  },
  {
    id: "inc_3",
    date: "03/03/2026",
    student: "Marcus Reid",
    year: "Year 8",
    type: "Fighting",
    severity: "HIGH",
    recordedBy: "Mr. J. Okafor",
    status: "OPEN",
    description: "Physical altercation in the corridor during break.",
  },
  {
    id: "inc_4",
    date: "03/03/2026",
    student: "Sophie Adams",
    year: "Year 7",
    type: "Property",
    severity: "MEDIUM",
    recordedBy: "Ms. L. Mills",
    status: "IN_PROGRESS",
    description: "Damage to school property – chair in Room 12.",
  },
  {
    id: "inc_5",
    date: "02/03/2026",
    student: "Dean Collins",
    year: "Year 11",
    type: "Bullying",
    severity: "HIGH",
    recordedBy: "Mrs. P. Novak",
    status: "IN_PROGRESS",
    description: "Alleged sustained verbal bullying of Year 9 student.",
  },
  {
    id: "inc_6",
    date: "01/03/2026",
    student: "Amara Diallo",
    year: "Year 10",
    type: "Discrimination",
    severity: "CRITICAL",
    recordedBy: "Mr. R. Andrews",
    status: "OPEN",
    description: "Racial slur used in classroom setting. Referred to SLT.",
  },
  {
    id: "inc_7",
    date: "28/02/2026",
    student: "Leo Hudson",
    year: "Year 9",
    type: "Disruption",
    severity: "LOW",
    recordedBy: "Mr. K. Frost",
    status: "RESOLVED",
    description: "Using phone during lesson despite two warnings.",
  },
  {
    id: "inc_8",
    date: "27/02/2026",
    student: "Priya Sharma",
    year: "Year 8",
    type: "Other",
    severity: "LOW",
    recordedBy: "Ms. T. Brown",
    status: "RESOLVED",
    description: "Persistent lateness to form period.",
  },
];

const MOCK_MERITS: Merit[] = [
  {
    id: "mer_1",
    date: "04/03/2026",
    student: "Jade Thompson",
    year: "Year 8",
    meritType: "Academic",
    points: 3,
    awardedBy: "Dr. S. Johnson",
    notes: "Outstanding essay on 'Of Mice and Men'.",
  },
  {
    id: "mer_2",
    date: "04/03/2026",
    student: "Oliver Nwosu",
    year: "Year 9",
    meritType: "Effort",
    points: 2,
    awardedBy: "Mr. K. Frost",
    notes: "Consistent effort in Science throughout the term.",
  },
  {
    id: "mer_3",
    date: "03/03/2026",
    student: "Fatima Hassan",
    year: "Year 10",
    meritType: "Citizenship",
    points: 5,
    awardedBy: "Mr. J. Okafor",
    notes: "Organised charity collection drive for the local foodbank.",
  },
  {
    id: "mer_4",
    date: "03/03/2026",
    student: "Ethan Park",
    year: "Year 7",
    meritType: "Sports",
    points: 3,
    awardedBy: "Mr. D. Campbell",
    notes: "Exceptional performance in the inter-school swimming competition.",
  },
  {
    id: "mer_5",
    date: "02/03/2026",
    student: "Lena Müller",
    year: "Year 8",
    meritType: "Arts",
    points: 4,
    awardedBy: "Ms. R. Torres",
    notes: "Selected for regional art exhibition.",
  },
  {
    id: "mer_6",
    date: "01/03/2026",
    student: "Aaron Birch",
    year: "Year 11",
    meritType: "Academic",
    points: 5,
    awardedBy: "Mrs. H. Davies",
    notes: "Top mock score in Mathematics.",
  },
  {
    id: "mer_7",
    date: "28/02/2026",
    student: "Niamh O'Brien",
    year: "Year 9",
    meritType: "Effort",
    points: 2,
    awardedBy: "Ms. L. Mills",
    notes: "Remarkable improvement in reading comprehension.",
  },
  {
    id: "mer_8",
    date: "27/02/2026",
    student: "Samuel Osei",
    year: "Year 10",
    meritType: "Citizenship",
    points: 3,
    awardedBy: "Mr. J. Okafor",
    notes: "Peer mentor of the month.",
  },
];

const MOCK_EXCLUSIONS: Exclusion[] = [
  {
    id: "exc_1",
    date: "03/03/2026",
    student: "Marcus Reid",
    year: "Year 8",
    type: "Fixed",
    startDate: "04/03/2026",
    endDate: "06/03/2026",
    reason: "Physical altercation with a fellow student.",
    status: "OPEN",
  },
  {
    id: "exc_2",
    date: "01/03/2026",
    student: "Amara Diallo",
    year: "Year 10",
    type: "Fixed",
    startDate: "03/03/2026",
    endDate: "04/03/2026",
    reason: "Racial discrimination – pending further investigation.",
    status: "OPEN",
  },
];

const MOCK_DETENTIONS: Detention[] = [
  {
    id: "det_1",
    date: "04/03/2026",
    timeSlot: "Lunch (12:30–13:00)",
    room: "Room 6",
    students: ["Tyler Banks", "Leo Hudson"],
    supervisedBy: "Mr. K. Frost",
    reason: "Repeated disruption in lessons",
  },
  {
    id: "det_2",
    date: "04/03/2026",
    timeSlot: "After School (15:30–16:00)",
    room: "Room 12",
    students: ["Sophie Adams", "Priya Sharma", "Dean Collins"],
    supervisedBy: "Mr. J. Okafor",
    reason: "Various conduct issues",
  },
  {
    id: "det_3",
    date: "05/03/2026",
    timeSlot: "Lunch (12:30–13:00)",
    room: "Room 3",
    students: ["Chloe Marsh"],
    supervisedBy: "Dr. S. Johnson",
    reason: "Inappropriate language",
  },
  {
    id: "det_4",
    date: "06/03/2026",
    timeSlot: "After School (15:30–16:30)",
    room: "Hall",
    students: ["Marcus Reid"],
    supervisedBy: "Mr. R. Andrews",
    reason: "Post-exclusion reintegration detention",
  },
  {
    id: "det_5",
    date: "07/03/2026",
    timeSlot: "Lunch (12:30–13:00)",
    room: "Room 8",
    students: ["Tyler Banks"],
    supervisedBy: "Ms. T. Brown",
    reason: "Missed homework – third warning",
  },
];

// --- Severity Badge ---
const severityConfig: Record<Severity, { label: string; className: string }> = {
  LOW: {
    label: "Low",
    className: "bg-green-100 text-green-800 border-0",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-amber-100 text-amber-800 border-0",
  },
  HIGH: {
    label: "High",
    className: "bg-orange-100 text-orange-800 border-0",
  },
  CRITICAL: {
    label: "Critical",
    className: "bg-red-100 text-red-800 border-0",
  },
};

function SeverityBadge({ severity }: { severity: Severity }) {
  const cfg = severityConfig[severity];
  return (
    <Badge className={`text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </Badge>
  );
}

const meritTypeConfig: Record<MeritType, string> = {
  Academic: "bg-blue-100 text-blue-800",
  Effort: "bg-purple-100 text-purple-800",
  Citizenship: "bg-green-100 text-green-800",
  Sports: "bg-amber-100 text-amber-800",
  Arts: "bg-rose-100 text-rose-800",
};

// --- Column defs ---
const incidentColumns: ColumnDef<Incident>[] = [
  { accessorKey: "date", header: "Date", size: 110 },
  { accessorKey: "student", header: "Student" },
  { accessorKey: "year", header: "Year", size: 80 },
  { accessorKey: "type", header: "Type", size: 120 },
  {
    accessorKey: "severity",
    header: "Severity",
    size: 100,
    cell: ({ row }) => <SeverityBadge severity={row.original.severity} />,
  },
  { accessorKey: "recordedBy", header: "Recorded By" },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "",
    size: 50,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => toast.info("Viewing incident")}>
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.info("Status updated")}>
            Update status
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => toast.info("Incident deleted")}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const meritColumns: ColumnDef<Merit>[] = [
  { accessorKey: "date", header: "Date", size: 110 },
  { accessorKey: "student", header: "Student" },
  { accessorKey: "year", header: "Year", size: 80 },
  {
    accessorKey: "meritType",
    header: "Merit Type",
    cell: ({ row }) => (
      <Badge
        className={`text-xs font-semibold border-0 ${meritTypeConfig[row.original.meritType]}`}
      >
        {row.original.meritType}
      </Badge>
    ),
  },
  {
    accessorKey: "points",
    header: "Points",
    size: 70,
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        {row.original.points}
      </span>
    ),
  },
  { accessorKey: "awardedBy", header: "Awarded By" },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <span className="text-xs text-gray-500 max-w-[200px] truncate block">
        {row.original.notes}
      </span>
    ),
  },
];

const exclusionColumns: ColumnDef<Exclusion>[] = [
  { accessorKey: "date", header: "Logged", size: 110 },
  { accessorKey: "student", header: "Student" },
  { accessorKey: "year", header: "Year", size: 80 },
  {
    accessorKey: "type",
    header: "Type",
    size: 100,
    cell: ({ row }) => (
      <Badge
        variant={row.original.type === "Permanent" ? "destructive" : "warning"}
        className="text-xs"
      >
        {row.original.type}
      </Badge>
    ),
  },
  { accessorKey: "startDate", header: "Start Date", size: 110 },
  { accessorKey: "endDate", header: "End Date", size: 110 },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span className="text-xs text-gray-600 max-w-[200px] truncate block">
        {row.original.reason}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

const detentionColumns: ColumnDef<Detention>[] = [
  { accessorKey: "date", header: "Date", size: 110 },
  { accessorKey: "timeSlot", header: "Time Slot", size: 180 },
  { accessorKey: "room", header: "Room", size: 90 },
  {
    accessorKey: "students",
    header: "Students",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.students.map((s) => (
          <Badge key={s} variant="ghost" className="text-xs">
            {s}
          </Badge>
        ))}
      </div>
    ),
  },
  { accessorKey: "supervisedBy", header: "Supervisor" },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span className="text-xs text-gray-600">{row.original.reason}</span>
    ),
  },
];

// --- Main Component ---
export default function IncidentsPage() {
  const [activeTab, setActiveTab] = useState("incidents");
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [meritDialogOpen, setMeritDialogOpen] = useState(false);

  // Log incident form
  const [incStudent, setIncStudent] = useState("");
  const [incType, setIncType] = useState<IncidentType>("Disruption");
  const [incSeverity, setIncSeverity] = useState<Severity>("LOW");
  const [incDescription, setIncDescription] = useState("");
  const [incWitnesses, setIncWitnesses] = useState("");
  const [incAction, setIncAction] = useState("");

  // Award merit form
  const [merStudent, setMerStudent] = useState("");
  const [merType, setMerType] = useState<MeritType>("Academic");
  const [merPoints, setMerPoints] = useState("2");
  const [merNotes, setMerNotes] = useState("");

  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [merits, setMerits] = useState<Merit[]>(MOCK_MERITS);

  function handleLogIncident() {
    if (!incStudent.trim() || !incDescription.trim()) {
      toast.error("Please fill in required fields");
      return;
    }
    const newInc: Incident = {
      id: `inc_${Date.now()}`,
      date: new Date().toLocaleDateString("en-GB"),
      student: incStudent,
      year: "Year 9",
      type: incType,
      severity: incSeverity,
      recordedBy: "You",
      status: "OPEN",
      description: incDescription,
    };
    setIncidents((p) => [newInc, ...p]);
    setIncStudent("");
    setIncType("Disruption");
    setIncSeverity("LOW");
    setIncDescription("");
    setIncWitnesses("");
    setIncAction("");
    setLogDialogOpen(false);
    toast.success("Incident logged successfully");
  }

  function handleAwardMerit() {
    if (!merStudent.trim()) {
      toast.error("Please select a student");
      return;
    }
    const newMerit: Merit = {
      id: `mer_${Date.now()}`,
      date: new Date().toLocaleDateString("en-GB"),
      student: merStudent,
      year: "Year 9",
      meritType: merType,
      points: Number(merPoints),
      awardedBy: "You",
      notes: merNotes,
    };
    setMerits((p) => [newMerit, ...p]);
    setMerStudent("");
    setMerType("Academic");
    setMerPoints("2");
    setMerNotes("");
    setMeritDialogOpen(false);
    toast.success("Merit awarded successfully");
  }

  const incidentsThisWeek = incidents.filter((i) =>
    ["04/03/2026", "03/03/2026", "02/03/2026", "01/03/2026"].includes(i.date),
  ).length;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Behaviour & Rewards"
        subtitle="Track incidents, merits, exclusions and detentions"
        icon={AlertTriangle}
        iconColor="bg-orange-500"
        actions={[
          {
            label: "Award Merit",
            icon: Award,
            variant: "outline",
            onClick: () => setMeritDialogOpen(true),
          },
          {
            label: "Log Incident",
            icon: Plus,
            onClick: () => setLogDialogOpen(true),
          },
        ]}
      />

      <div className="flex-1 overflow-auto bg-gray-50 p-6 space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Incidents This Week"
            value={incidentsThisWeek}
            icon={AlertTriangle}
            variant="warning"
            trend={{ value: 3, label: "vs last week", direction: "up" }}
          />
          <StatCard
            title="Merits This Week"
            value={47}
            icon={Star}
            variant="success"
            trend={{ value: 12, label: "vs last week", direction: "up" }}
          />
          <StatCard
            title="Exclusions Active"
            value={MOCK_EXCLUSIONS.filter((e) => e.status === "OPEN").length}
            icon={UserX}
            variant="danger"
          />
          <StatCard
            title="Detentions Today"
            value={
              MOCK_DETENTIONS.filter((d) => d.date === "04/03/2026").length
            }
            icon={Clock}
            variant="info"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="incidents" className="gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Incidents
              <Badge
                variant="destructive"
                className="ml-1 text-[10px] px-1.5 py-0 h-4"
              >
                {incidents.filter((i) => i.status === "OPEN").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="gap-1.5">
              <Star className="h-3.5 w-3.5" /> Rewards
            </TabsTrigger>
            <TabsTrigger value="exclusions" className="gap-1.5">
              <UserX className="h-3.5 w-3.5" /> Exclusions
            </TabsTrigger>
            <TabsTrigger value="detentions" className="gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Detentions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incidents">
            <DataTable
              columns={incidentColumns}
              data={incidents}
              searchPlaceholder="Search incidents..."
              emptyMessage="No incidents recorded"
            />
          </TabsContent>

          <TabsContent value="rewards">
            <DataTable
              columns={meritColumns}
              data={merits}
              searchPlaceholder="Search merits..."
              emptyMessage="No merits recorded"
            />
          </TabsContent>

          <TabsContent value="exclusions">
            <DataTable
              columns={exclusionColumns}
              data={MOCK_EXCLUSIONS}
              searchPlaceholder="Search exclusions..."
              emptyMessage="No exclusions recorded"
            />
          </TabsContent>

          <TabsContent value="detentions">
            <DataTable
              columns={detentionColumns}
              data={MOCK_DETENTIONS}
              searchPlaceholder="Search detentions..."
              emptyMessage="No detentions scheduled"
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Log Incident Dialog */}
      <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Incident</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Student *</Label>
              <Input
                placeholder="Search for a student..."
                value={incStudent}
                onChange={(e) => setIncStudent(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Incident Type *</Label>
                <Select
                  value={incType}
                  onValueChange={(v) => setIncType(v as IncidentType)}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        "Disruption",
                        "Bullying",
                        "Fighting",
                        "Language",
                        "Property",
                        "Discrimination",
                        "Other",
                      ] as IncidentType[]
                    ).map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Severity *</Label>
                <Select
                  value={incSeverity}
                  onValueChange={(v) => setIncSeverity(v as Severity)}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as Severity[]).map(
                      (s) => (
                        <SelectItem key={s} value={s}>
                          {severityConfig[s].label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Description *</Label>
              <Textarea
                placeholder="Describe what happened..."
                value={incDescription}
                onChange={(e) => setIncDescription(e.target.value)}
                className="min-h-[80px] text-sm resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Witnesses</Label>
              <Input
                placeholder="Names of any witnesses..."
                value={incWitnesses}
                onChange={(e) => setIncWitnesses(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Action Taken</Label>
              <Textarea
                placeholder="What immediate action was taken?"
                value={incAction}
                onChange={(e) => setIncAction(e.target.value)}
                className="min-h-[60px] text-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLogDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleLogIncident} className="gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Log Incident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Award Merit Dialog */}
      <Dialog open={meritDialogOpen} onOpenChange={setMeritDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Award Merit</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Student *</Label>
              <Input
                placeholder="Search for a student..."
                value={merStudent}
                onChange={(e) => setMerStudent(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Merit Type</Label>
                <Select
                  value={merType}
                  onValueChange={(v) => setMerType(v as MeritType)}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        "Academic",
                        "Effort",
                        "Citizenship",
                        "Sports",
                        "Arts",
                      ] as MeritType[]
                    ).map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Points</Label>
                <Select value={merPoints} onValueChange={setMerPoints}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "4", "5"].map((p) => (
                      <SelectItem key={p} value={p}>
                        {p} {p === "1" ? "point" : "points"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Notes</Label>
              <Textarea
                placeholder="What is this merit for?"
                value={merNotes}
                onChange={(e) => setMerNotes(e.target.value)}
                className="min-h-[80px] text-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMeritDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAwardMerit}
              className="gap-1.5 bg-amber-500 hover:bg-amber-600"
            >
              <Star className="h-3.5 w-3.5" />
              Award Merit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
