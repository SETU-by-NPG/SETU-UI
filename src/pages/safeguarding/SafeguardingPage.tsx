import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ShieldAlert,
  Lock,
  AlertCircle,
  Phone,
  BookOpen,
  UserCheck,
  Plus,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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

type SafeguardingCategory =
  | "CHILD_PROTECTION"
  | "CHILD_IN_NEED"
  | "EARLY_HELP"
  | "PREVENT"
  | "FGM_CONCERN"
  | "DOMESTIC_ABUSE"
  | "CSE";

type CasePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type CaseStatus = "OPEN" | "IN_PROGRESS" | "ESCALATED" | "CLOSED";
type TrainingStatus = "COMPLETED" | "OVERDUE" | "DUE_SOON" | "PENDING";

interface SafeguardingCase {
  id: string;
  caseRef: string;
  studentMasked: string;
  category: SafeguardingCategory;
  priority: CasePriority;
  status: CaseStatus;
  lastUpdated: string;
  lead: string;
}

interface ConcernLog {
  id: string;
  date: string;
  studentMasked: string;
  concernType: string;
  raisedBy: string;
  status: "OPEN" | "REVIEWED" | "ESCALATED";
  notes: string;
}

interface TrainingRecord {
  id: string;
  staffName: string;
  trainingType: string;
  completionDate: string;
  expiryDate: string;
  status: TrainingStatus;
}

interface KeyContact {
  id: string;
  role: string;
  organisation: string;
  name: string;
  phone: string;
  email: string;
  availability: string;
}

// --- Mock Data ---
const MOCK_CASES: SafeguardingCase[] = [
  {
    id: "sg_1",
    caseRef: "SG-2026-0047",
    studentMasked: "S****  B****  (Y9)",
    category: "CHILD_PROTECTION",
    priority: "HIGH",
    status: "IN_PROGRESS",
    lastUpdated: "04/03/2026",
    lead: "Ms. L. Rivers",
  },
  {
    id: "sg_2",
    caseRef: "SG-2026-0045",
    studentMasked: "A****  T****  (Y8)",
    category: "DOMESTIC_ABUSE",
    priority: "URGENT",
    status: "ESCALATED",
    lastUpdated: "03/03/2026",
    lead: "Ms. L. Rivers",
  },
  {
    id: "sg_3",
    caseRef: "SG-2026-0041",
    studentMasked: "J****  M****  (Y10)",
    category: "EARLY_HELP",
    priority: "MEDIUM",
    status: "OPEN",
    lastUpdated: "28/02/2026",
    lead: "Mr. J. Okafor",
  },
  {
    id: "sg_4",
    caseRef: "SG-2026-0038",
    studentMasked: "K****  O****  (Y7)",
    category: "CHILD_IN_NEED",
    priority: "HIGH",
    status: "IN_PROGRESS",
    lastUpdated: "25/02/2026",
    lead: "Ms. L. Rivers",
  },
  {
    id: "sg_5",
    caseRef: "SG-2026-0033",
    studentMasked: "R****  P****  (Y11)",
    category: "PREVENT",
    priority: "LOW",
    status: "CLOSED",
    lastUpdated: "14/02/2026",
    lead: "Mrs. S. Clark",
  },
  {
    id: "sg_6",
    caseRef: "SG-2026-0029",
    studentMasked: "M****  H****  (Y9)",
    category: "CSE",
    priority: "URGENT",
    status: "CLOSED",
    lastUpdated: "10/02/2026",
    lead: "Ms. L. Rivers",
  },
  {
    id: "sg_7",
    caseRef: "SG-2026-0022",
    studentMasked: "T****  W****  (Y8)",
    category: "FGM_CONCERN",
    priority: "HIGH",
    status: "CLOSED",
    lastUpdated: "05/02/2026",
    lead: "Ms. L. Rivers",
  },
];

const MOCK_CONCERNS: ConcernLog[] = [
  {
    id: "con_1",
    date: "04/03/2026",
    studentMasked: "C****  F****  (Y9)",
    concernType: "Emotional wellbeing / withdrawal",
    raisedBy: "Mr. K. Frost",
    status: "OPEN",
    notes: "Observed significant change in demeanour over two weeks.",
  },
  {
    id: "con_2",
    date: "03/03/2026",
    studentMasked: "B****  N****  (Y11)",
    concernType: "Suspected physical abuse (bruising)",
    raisedBy: "Ms. T. Brown",
    status: "ESCALATED",
    notes: "Referred to DSL immediately. Parents contacted.",
  },
  {
    id: "con_3",
    date: "02/03/2026",
    studentMasked: "F****  R****  (Y10)",
    concernType: "Online safety / potential grooming",
    raisedBy: "Dr. S. Johnson",
    status: "REVIEWED",
    notes: "Disclosure during PSHE lesson. Reviewed by safeguarding lead.",
  },
  {
    id: "con_4",
    date: "28/02/2026",
    studentMasked: "D****  L****  (Y7)",
    concernType: "Attendance and neglect indicators",
    raisedBy: "Mrs. P. Novak",
    status: "OPEN",
    notes: "12 unexplained absences this term. Welfare visit requested.",
  },
];

const MOCK_TRAINING: TrainingRecord[] = [
  {
    id: "tr_1",
    staffName: "Ms. L. Rivers",
    trainingType: "DSL Level 3 Safeguarding",
    completionDate: "15/09/2024",
    expiryDate: "14/09/2026",
    status: "COMPLETED",
  },
  {
    id: "tr_2",
    staffName: "Mr. R. Andrews",
    trainingType: "Basic Safeguarding Awareness",
    completionDate: "01/09/2024",
    expiryDate: "31/08/2026",
    status: "COMPLETED",
  },
  {
    id: "tr_3",
    staffName: "Dr. S. Johnson",
    trainingType: "Basic Safeguarding Awareness",
    completionDate: "12/03/2023",
    expiryDate: "11/03/2025",
    status: "OVERDUE",
  },
  {
    id: "tr_4",
    staffName: "Mr. K. Frost",
    trainingType: "PREVENT Awareness",
    completionDate: "05/06/2023",
    expiryDate: "04/06/2025",
    status: "OVERDUE",
  },
  {
    id: "tr_5",
    staffName: "Ms. T. Brown",
    trainingType: "Basic Safeguarding Awareness",
    completionDate: "10/09/2024",
    expiryDate: "09/09/2026",
    status: "COMPLETED",
  },
  {
    id: "tr_6",
    staffName: "Mr. J. Okafor",
    trainingType: "DSL Deputy Training",
    completionDate: "20/10/2024",
    expiryDate: "19/10/2026",
    status: "COMPLETED",
  },
  {
    id: "tr_7",
    staffName: "Mrs. P. Novak",
    trainingType: "Basic Safeguarding Awareness",
    completionDate: "N/A",
    expiryDate: "N/A",
    status: "PENDING",
  },
  {
    id: "tr_8",
    staffName: "Ms. H. Wright",
    trainingType: "Basic Safeguarding Awareness",
    completionDate: "04/04/2023",
    expiryDate: "03/04/2025",
    status: "OVERDUE",
  },
];

const MOCK_CONTACTS: KeyContact[] = [
  {
    id: "kc_1",
    role: "Local Authority Designated Officer (LADO)",
    organisation: "Setu Borough Council",
    name: "Ms. Patricia Cole",
    phone: "0300 123 4567",
    email: "lado@setubc.gov.uk",
    availability: "Mon–Fri 9:00–17:00",
  },
  {
    id: "kc_2",
    role: "Children's Social Services",
    organisation: "Setu Children's Services",
    name: "Duty Social Worker",
    phone: "0300 456 7890",
    email: "childrens-duty@setubc.gov.uk",
    availability: "24-hour duty line available",
  },
  {
    id: "kc_3",
    role: "Child Protection Police Unit",
    organisation: "Setu Metropolitan Police",
    name: "DC Samantha Hughes",
    phone: "0207 555 1234",
    email: "cppu.setu@police.uk",
    availability: "Mon–Fri 8:00–18:00 (emergency: 999)",
  },
  {
    id: "kc_4",
    role: "CAMHS (Mental Health)",
    organisation: "Setu NHS Trust",
    name: "CAMHs Referral Team",
    phone: "0300 789 0123",
    email: "camhs.referrals@setunhs.uk",
    availability: "Mon–Fri 9:00–16:30",
  },
  {
    id: "kc_5",
    role: "NSPCC Helpline",
    organisation: "NSPCC",
    name: "Professional Helpline",
    phone: "0808 800 5000",
    email: "help@nspcc.org.uk",
    availability: "Mon–Fri 8:00–22:00, Weekends 9:00–18:00",
  },
];

// --- Category config ---
const categoryConfig: Record<
  SafeguardingCategory,
  {
    label: string;
    variant:
      | "default"
      | "destructive"
      | "warning"
      | "info"
      | "purple"
      | "ghost"
      | "success";
  }
> = {
  CHILD_PROTECTION: { label: "Child Protection", variant: "destructive" },
  CHILD_IN_NEED: { label: "Child in Need", variant: "warning" },
  EARLY_HELP: { label: "Early Help", variant: "info" },
  PREVENT: { label: "PREVENT", variant: "purple" },
  FGM_CONCERN: { label: "FGM Concern", variant: "destructive" },
  DOMESTIC_ABUSE: { label: "Domestic Abuse", variant: "destructive" },
  CSE: { label: "CSE", variant: "destructive" },
};

const priorityConfig: Record<
  CasePriority,
  { label: string; className: string }
> = {
  LOW: { label: "Low", className: "bg-green-100 text-green-800 border-0" },
  MEDIUM: {
    label: "Medium",
    className: "bg-amber-100 text-amber-800 border-0",
  },
  HIGH: { label: "High", className: "bg-orange-100 text-orange-800 border-0" },
  URGENT: { label: "Urgent", className: "bg-red-100 text-red-800 border-0" },
};

const caseStatusConfig: Record<
  CaseStatus,
  { label: string; className: string }
> = {
  OPEN: { label: "Open", className: "bg-amber-100 text-amber-800 border-0" },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 border-0",
  },
  ESCALATED: {
    label: "Escalated",
    className: "bg-red-100 text-red-800 border-0",
  },
  CLOSED: { label: "Closed", className: "bg-gray-100 text-gray-600 border-0" },
};

const trainingStatusConfig: Record<
  TrainingStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    className: "text-green-600",
  },
  OVERDUE: { label: "Overdue", icon: XCircle, className: "text-red-600" },
  DUE_SOON: { label: "Due Soon", icon: Clock, className: "text-amber-600" },
  PENDING: { label: "Not Started", icon: Clock, className: "text-gray-500" },
};

// --- Column defs ---
const caseColumns: ColumnDef<SafeguardingCase>[] = [
  { accessorKey: "caseRef", header: "Case Ref", size: 130 },
  { accessorKey: "studentMasked", header: "Student" },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const cfg = categoryConfig[row.original.category];
      return (
        <Badge variant={cfg.variant} className="text-xs whitespace-nowrap">
          {cfg.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    size: 90,
    cell: ({ row }) => {
      const cfg = priorityConfig[row.original.priority];
      return (
        <Badge className={`text-xs font-semibold ${cfg.className}`}>
          {cfg.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 110,
    cell: ({ row }) => {
      const cfg = caseStatusConfig[row.original.status];
      return (
        <Badge className={`text-xs font-semibold ${cfg.className}`}>
          {cfg.label}
        </Badge>
      );
    },
  },
  { accessorKey: "lastUpdated", header: "Last Updated", size: 120 },
  { accessorKey: "lead", header: "Lead" },
];

const concernColumns: ColumnDef<ConcernLog>[] = [
  { accessorKey: "date", header: "Date", size: 110 },
  { accessorKey: "studentMasked", header: "Student" },
  { accessorKey: "concernType", header: "Concern Type" },
  { accessorKey: "raisedBy", header: "Raised By" },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
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

const trainingColumns: ColumnDef<TrainingRecord>[] = [
  { accessorKey: "staffName", header: "Staff Member" },
  { accessorKey: "trainingType", header: "Training Type" },
  { accessorKey: "completionDate", header: "Completed", size: 110 },
  { accessorKey: "expiryDate", header: "Expires", size: 110 },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ row }) => {
      const cfg = trainingStatusConfig[row.original.status];
      const Icon = cfg.icon;
      return (
        <span
          className={`flex items-center gap-1 text-xs font-medium ${cfg.className}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {cfg.label}
        </span>
      );
    },
  },
];

// --- Access Denied Component ---
function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 bg-gray-50">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <Lock className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Access Restricted</h2>
      <p className="text-sm text-gray-500 text-center max-w-sm leading-relaxed">
        This area is restricted to designated safeguarding leads, heads of
        school, and system administrators. Your access attempt has been logged.
      </p>
      <Badge variant="destructive" className="text-sm px-4 py-1">
        CONFIDENTIAL – UNAUTHORISED ACCESS DENIED
      </Badge>
    </div>
  );
}

// --- Main Component ---
const ALLOWED_ROLES = [
  "SAFEGUARDING_LEAD",
  "HEAD_OF_SCHOOL",
  "MASTER_ADMIN",
] as const;

export default function SafeguardingPage() {
  const { role } = useAuthStore();
  const [activeTab, setActiveTab] = useState("cases");
  const [concernDialogOpen, setConcernDialogOpen] = useState(false);

  // Concern form
  const [conStudent, setConStudent] = useState("");
  const [conType, setConType] = useState("");
  const [conNotes, setConNotes] = useState("");

  const isAuthorised =
    role && (ALLOWED_ROLES as readonly string[]).includes(role);

  if (!isAuthorised) {
    return <AccessDenied />;
  }

  const openCases = MOCK_CASES.filter((c) => c.status !== "CLOSED").length;
  const escalatedCases = MOCK_CASES.filter(
    (c) => c.status === "ESCALATED",
  ).length;
  const closedThisTerm = MOCK_CASES.filter((c) => c.status === "CLOSED").length;
  const trainingOverdue = MOCK_TRAINING.filter(
    (t) => t.status === "OVERDUE" || t.status === "PENDING",
  ).length;

  function handleLogConcern() {
    if (!conStudent.trim() || !conType.trim()) {
      toast.error("Please fill in required fields");
      return;
    }
    setConStudent("");
    setConType("");
    setConNotes("");
    setConcernDialogOpen(false);
    toast.success("Concern logged and DSL notified");
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Safeguarding"
        subtitle="Confidential case management and pastoral oversight"
        icon={ShieldAlert}
        iconColor="bg-red-600"
      >
        <Badge
          variant="destructive"
          className="text-xs font-bold tracking-wide px-3"
        >
          CONFIDENTIAL
        </Badge>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 border-red-300 text-red-700 hover:bg-red-50"
          onClick={() => setConcernDialogOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Log Concern
        </Button>
      </PageHeader>

      <div className="flex-1 overflow-auto bg-gray-50 p-6 space-y-5">
        {/* Confidentiality Alert */}
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              All safeguarding records are strictly confidential. Access is
              logged and monitored.
            </p>
            <p className="text-xs text-red-600 mt-0.5">
              Information must only be shared on a need-to-know basis. Do not
              print, screenshot, or share records without explicit DSL
              authorisation.
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Open Cases"
            value={openCases}
            icon={ShieldAlert}
            variant="danger"
          />
          <StatCard
            title="Escalated"
            value={escalatedCases}
            icon={AlertCircle}
            variant="danger"
            trend={
              escalatedCases > 0
                ? {
                    value: escalatedCases,
                    label: "need urgent review",
                    direction: "up",
                  }
                : undefined
            }
          />
          <StatCard
            title="Closed This Term"
            value={closedThisTerm}
            icon={UserCheck}
            variant="success"
          />
          <StatCard
            title="Training Due / Overdue"
            value={trainingOverdue}
            icon={BookOpen}
            variant="warning"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="cases" className="gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              Cases
              {openCases > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 h-4 text-[10px] px-1.5 py-0"
                >
                  {openCases}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="concerns" className="gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Concerns
            </TabsTrigger>
            <TabsTrigger value="training" className="gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Training
            </TabsTrigger>
            <TabsTrigger value="contacts" className="gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Key Contacts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cases">
            <DataTable
              columns={caseColumns}
              data={MOCK_CASES}
              searchPlaceholder="Search cases..."
              emptyMessage="No cases recorded"
              rowClassName={(row) =>
                row.status === "ESCALATED"
                  ? "bg-red-50/60"
                  : row.status === "OPEN"
                    ? "bg-amber-50/30"
                    : ""
              }
            />
          </TabsContent>

          <TabsContent value="concerns">
            <DataTable
              columns={concernColumns}
              data={MOCK_CONCERNS}
              searchPlaceholder="Search concerns..."
              emptyMessage="No concerns logged"
            />
          </TabsContent>

          <TabsContent value="training">
            <div className="mb-3 flex items-center gap-2 text-sm">
              <span className="text-gray-500 text-xs">
                {MOCK_TRAINING.filter((t) => t.status === "OVERDUE").length}{" "}
                staff have overdue training.
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5 ml-auto"
              >
                <ExternalLink className="h-3 w-3" />
                Send Reminders
              </Button>
            </div>
            <DataTable
              columns={trainingColumns}
              data={MOCK_TRAINING}
              searchPlaceholder="Search staff..."
              emptyMessage="No training records"
              rowClassName={(row) =>
                row.status === "OVERDUE" ? "bg-red-50/50" : ""
              }
            />
          </TabsContent>

          <TabsContent value="contacts">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {MOCK_CONTACTS.map((contact) => (
                <Card key={contact.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                      <Phone className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-red-700 uppercase tracking-wide leading-tight">
                        {contact.role}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {contact.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {contact.organisation}
                      </p>
                      <div className="mt-2 space-y-0.5">
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
                        >
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </a>
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {contact.email}
                        </a>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1.5">
                        {contact.availability}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Log Concern Dialog */}
      <Dialog open={concernDialogOpen} onOpenChange={setConcernDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              Log Safeguarding Concern
            </DialogTitle>
          </DialogHeader>
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 mb-2">
            <p className="text-xs text-red-700 font-medium">
              If a child is in immediate danger, call emergency services (999)
              first.
            </p>
          </div>
          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Student *</Label>
              <Input
                placeholder="Search for a student..."
                value={conStudent}
                onChange={(e) => setConStudent(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Concern Type *</Label>
              <Select value={conType} onValueChange={setConType}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select concern type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Physical abuse concern">
                    Physical abuse concern
                  </SelectItem>
                  <SelectItem value="Emotional abuse concern">
                    Emotional abuse concern
                  </SelectItem>
                  <SelectItem value="Neglect indicators">
                    Neglect indicators
                  </SelectItem>
                  <SelectItem value="Sexual abuse concern">
                    Sexual abuse concern
                  </SelectItem>
                  <SelectItem value="Domestic abuse (home environment)">
                    Domestic abuse (home environment)
                  </SelectItem>
                  <SelectItem value="Online safety / grooming">
                    Online safety / grooming
                  </SelectItem>
                  <SelectItem value="Radicalisation / PREVENT">
                    Radicalisation / PREVENT
                  </SelectItem>
                  <SelectItem value="FGM concern">FGM concern</SelectItem>
                  <SelectItem value="CSE indicators">CSE indicators</SelectItem>
                  <SelectItem value="Mental health crisis">
                    Mental health crisis
                  </SelectItem>
                  <SelectItem value="Other welfare concern">
                    Other welfare concern
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Details / Observations *
              </Label>
              <Textarea
                placeholder="Describe what you observed or what was disclosed to you. Use the child's own words where possible."
                value={conNotes}
                onChange={(e) => setConNotes(e.target.value)}
                className="min-h-[100px] text-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConcernDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleLogConcern}
              className="gap-1.5 bg-red-600 hover:bg-red-700"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              Submit Concern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
