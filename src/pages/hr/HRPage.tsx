import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Users,
  Plane,
  Briefcase,
  Star,
  Plus,
  Check,
  X,
  Eye,
  GraduationCap,
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
import { cn, formatCurrency } from "@/lib/utils";

type LeaveType =
  | "ANNUAL"
  | "SICK"
  | "PERSONAL"
  | "MATERNITY"
  | "PATERNITY"
  | "COMPASSIONATE"
  | "TOIL";
type LeaveStatus = "PENDING" | "APPROVED" | "DECLINED" | "CANCELLED";
type AppraisalStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
type CPDStatus = "PLANNED" | "COMPLETED" | "CANCELLED";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  contractType: string;
  salaryBand: string;
  reviewDate: string;
  startDate: string;
  email: string;
}

interface LeaveRequest {
  id: string;
  staff: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  approver: string;
  notes: string;
}

interface Appraisal {
  id: string;
  staff: string;
  appraisalType: string;
  dueDate: string;
  appraiser: string;
  status: AppraisalStatus;
  rating: string;
}

interface CPDRecord {
  id: string;
  staff: string;
  training: string;
  provider: string;
  date: string;
  hours: number;
  status: CPDStatus;
  cost: number;
}

const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  ANNUAL: "Annual Leave",
  SICK: "Sick Leave",
  PERSONAL: "Personal",
  MATERNITY: "Maternity",
  PATERNITY: "Paternity",
  COMPASSIONATE: "Compassionate",
  TOIL: "TOIL",
};

const LEAVE_STATUS_CONFIG: Record<
  LeaveStatus,
  { label: string; className: string }
> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  APPROVED: { label: "Approved", className: "bg-green-100 text-green-700" },
  DECLINED: { label: "Declined", className: "bg-red-100 text-red-700" },
  CANCELLED: { label: "Cancelled", className: "bg-gray-100 text-gray-500" },
};

const APPRAISAL_STATUS_CONFIG: Record<
  AppraisalStatus,
  { label: string; className: string }
> = {
  SCHEDULED: { label: "Scheduled", className: "bg-blue-100 text-blue-700" },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-purple-100 text-purple-700",
  },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700" },
  OVERDUE: { label: "Overdue", className: "bg-red-100 text-red-700" },
};

const CPD_STATUS_CONFIG: Record<
  CPDStatus,
  { label: string; className: string }
> = {
  PLANNED: { label: "Planned", className: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", className: "bg-gray-100 text-gray-500" },
};

const MOCK_STAFF: StaffMember[] = [
  {
    id: "1",
    name: "Dr. Anna Hughes",
    role: "Head Teacher",
    department: "Leadership",
    contractType: "Permanent",
    salaryBand: "L20",
    reviewDate: "2025-07-01",
    startDate: "2015-09-01",
    email: "a.hughes@school.edu",
  },
  {
    id: "2",
    name: "Mr. James Foster",
    role: "Deputy Head",
    department: "Leadership",
    contractType: "Permanent",
    salaryBand: "L12",
    reviewDate: "2025-07-01",
    startDate: "2017-09-01",
    email: "j.foster@school.edu",
  },
  {
    id: "3",
    name: "Ms. Rachel Green",
    role: "Head of Maths",
    department: "Mathematics",
    contractType: "Permanent",
    salaryBand: "UPS3",
    reviewDate: "2025-07-01",
    startDate: "2012-09-01",
    email: "r.green@school.edu",
  },
  {
    id: "4",
    name: "Mr. Tom Clarke",
    role: "English Teacher",
    department: "English",
    contractType: "Permanent",
    salaryBand: "MPS4",
    reviewDate: "2025-07-01",
    startDate: "2020-09-01",
    email: "t.clarke@school.edu",
  },
  {
    id: "5",
    name: "Mrs. Lisa Patel",
    role: "Science Teacher",
    department: "Science",
    contractType: "Fixed Term",
    salaryBand: "MPS2",
    reviewDate: "2025-03-31",
    startDate: "2023-01-09",
    email: "l.patel@school.edu",
  },
  {
    id: "6",
    name: "Mr. David Kim",
    role: "IT Coordinator",
    department: "IT",
    contractType: "Permanent",
    salaryBand: "Scale 6",
    reviewDate: "2025-07-01",
    startDate: "2019-04-01",
    email: "d.kim@school.edu",
  },
  {
    id: "7",
    name: "Ms. Sarah Bell",
    role: "SENCO",
    department: "SEND",
    contractType: "Permanent",
    salaryBand: "UPS2",
    reviewDate: "2025-07-01",
    startDate: "2016-09-01",
    email: "s.bell@school.edu",
  },
  {
    id: "8",
    name: "Mr. Chris Ward",
    role: "PE Teacher",
    department: "PE",
    contractType: "Permanent",
    salaryBand: "MPS5",
    reviewDate: "2025-07-01",
    startDate: "2018-09-01",
    email: "c.ward@school.edu",
  },
  {
    id: "9",
    name: "Mrs. Emma Stone",
    role: "Office Manager",
    department: "Admin",
    contractType: "Permanent",
    salaryBand: "Scale 4",
    reviewDate: "2025-07-01",
    startDate: "2014-09-01",
    email: "e.stone@school.edu",
  },
  {
    id: "10",
    name: "Mr. Ryan Black",
    role: "Geography Teacher",
    department: "Humanities",
    contractType: "Part-Time",
    salaryBand: "MPS3",
    reviewDate: "2025-07-01",
    startDate: "2021-09-01",
    email: "r.black@school.edu",
  },
];

const MOCK_LEAVE: LeaveRequest[] = [
  {
    id: "1",
    staff: "Mr. Tom Clarke",
    leaveType: "ANNUAL",
    startDate: "2025-02-17",
    endDate: "2025-02-21",
    days: 5,
    status: "APPROVED",
    approver: "Mr. James Foster",
    notes: "Family holiday",
  },
  {
    id: "2",
    staff: "Mrs. Lisa Patel",
    leaveType: "SICK",
    startDate: "2025-02-03",
    endDate: "2025-02-04",
    days: 2,
    status: "APPROVED",
    approver: "Mr. James Foster",
    notes: "",
  },
  {
    id: "3",
    staff: "Mr. Ryan Black",
    leaveType: "PERSONAL",
    startDate: "2025-02-12",
    endDate: "2025-02-12",
    days: 1,
    status: "PENDING",
    approver: "Ms. Rachel Green",
    notes: "Medical appointment",
  },
  {
    id: "4",
    staff: "Ms. Sarah Bell",
    leaveType: "MATERNITY",
    startDate: "2025-03-01",
    endDate: "2025-11-30",
    days: 183,
    status: "APPROVED",
    approver: "Dr. Anna Hughes",
    notes: "",
  },
  {
    id: "5",
    staff: "Mr. Chris Ward",
    leaveType: "TOIL",
    startDate: "2025-02-06",
    endDate: "2025-02-06",
    days: 1,
    status: "PENDING",
    approver: "Mr. James Foster",
    notes: "Sports day overtime",
  },
  {
    id: "6",
    staff: "Mrs. Emma Stone",
    leaveType: "COMPASSIONATE",
    startDate: "2025-01-20",
    endDate: "2025-01-22",
    days: 3,
    status: "APPROVED",
    approver: "Dr. Anna Hughes",
    notes: "Bereavement",
  },
];

const MOCK_APPRAISALS: Appraisal[] = [
  {
    id: "1",
    staff: "Mr. Tom Clarke",
    appraisalType: "Annual Review",
    dueDate: "2025-03-15",
    appraiser: "Mr. James Foster",
    status: "SCHEDULED",
    rating: "-",
  },
  {
    id: "2",
    staff: "Ms. Rachel Green",
    appraisalType: "Annual Review",
    dueDate: "2025-03-20",
    appraiser: "Dr. Anna Hughes",
    status: "IN_PROGRESS",
    rating: "-",
  },
  {
    id: "3",
    staff: "Mrs. Lisa Patel",
    appraisalType: "Probation Review",
    dueDate: "2025-03-09",
    appraiser: "Ms. Rachel Green",
    status: "OVERDUE",
    rating: "-",
  },
  {
    id: "4",
    staff: "Mr. David Kim",
    appraisalType: "Annual Review",
    dueDate: "2025-02-28",
    appraiser: "Mr. James Foster",
    status: "COMPLETED",
    rating: "Good",
  },
  {
    id: "5",
    staff: "Mr. Chris Ward",
    appraisalType: "Annual Review",
    dueDate: "2025-04-01",
    appraiser: "Mr. James Foster",
    status: "SCHEDULED",
    rating: "-",
  },
  {
    id: "6",
    staff: "Ms. Sarah Bell",
    appraisalType: "Annual Review",
    dueDate: "2025-02-20",
    appraiser: "Dr. Anna Hughes",
    status: "COMPLETED",
    rating: "Outstanding",
  },
  {
    id: "7",
    staff: "Mrs. Emma Stone",
    appraisalType: "Annual Review",
    dueDate: "2025-04-10",
    appraiser: "Mr. James Foster",
    status: "SCHEDULED",
    rating: "-",
  },
  {
    id: "8",
    staff: "Mr. Ryan Black",
    appraisalType: "Annual Review",
    dueDate: "2025-03-25",
    appraiser: "Ms. Rachel Green",
    status: "SCHEDULED",
    rating: "-",
  },
];

const MOCK_CPD: CPDRecord[] = [
  {
    id: "1",
    staff: "Ms. Rachel Green",
    training: "Mathematics Pedagogy Update",
    provider: "NCETM",
    date: "2025-02-08",
    hours: 6,
    status: "COMPLETED",
    cost: 0,
  },
  {
    id: "2",
    staff: "Mr. Tom Clarke",
    training: "AQA Examiner Training",
    provider: "AQA",
    date: "2025-02-15",
    hours: 7,
    status: "PLANNED",
    cost: 120,
  },
  {
    id: "3",
    staff: "Mrs. Lisa Patel",
    training: "First Aid Renewal",
    provider: "St John Ambulance",
    date: "2025-01-20",
    hours: 16,
    status: "COMPLETED",
    cost: 95,
  },
  {
    id: "4",
    staff: "Ms. Sarah Bell",
    training: "SEND Code of Practice",
    provider: "NASENCO",
    date: "2025-03-05",
    hours: 6,
    status: "PLANNED",
    cost: 150,
  },
  {
    id: "5",
    staff: "Mr. David Kim",
    training: "Cyber Security Awareness",
    provider: "JISC",
    date: "2025-01-15",
    hours: 3,
    status: "COMPLETED",
    cost: 0,
  },
  {
    id: "6",
    staff: "Dr. Anna Hughes",
    training: "NPQH Leadership Programme",
    provider: "SSAT",
    date: "2025-02-20",
    hours: 20,
    status: "PLANNED",
    cost: 1800,
  },
  {
    id: "7",
    staff: "Mr. Chris Ward",
    training: "Safeguarding Level 2",
    provider: "LA",
    date: "2025-01-10",
    hours: 6,
    status: "COMPLETED",
    cost: 0,
  },
];

function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  const cfg = LEAVE_STATUS_CONFIG[status];
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

function AppraisalStatusBadge({ status }: { status: AppraisalStatus }) {
  const cfg = APPRAISAL_STATUS_CONFIG[status];
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

function CpdStatusBadge({ status }: { status: CPDStatus }) {
  const cfg = CPD_STATUS_CONFIG[status];
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

export default function HRPage() {
  const [activeTab, setActiveTab] = useState("staff");
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showAppraisalDialog, setShowAppraisalDialog] = useState(false);

  const staffColumns: ColumnDef<StaffMember>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "department", header: "Department" },
    { accessorKey: "contractType", header: "Contract Type" },
    { accessorKey: "salaryBand", header: "Salary Band" },
    {
      accessorKey: "reviewDate",
      header: "Review Date",
      cell: ({ row }) =>
        new Date(row.original.reviewDate).toLocaleDateString("en-GB"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
          <Eye className="h-3.5 w-3.5 mr-1" /> View
        </Button>
      ),
    },
  ];

  const leaveColumns: ColumnDef<LeaveRequest>[] = [
    { accessorKey: "staff", header: "Staff Member" },
    {
      accessorKey: "leaveType",
      header: "Leave Type",
      cell: ({ row }) => LEAVE_TYPE_LABELS[row.original.leaveType],
    },
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
      accessorKey: "days",
      header: "Days",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.days}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <LeaveStatusBadge status={row.original.status} />,
    },
    { accessorKey: "approver", header: "Approver" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) =>
        row.original.status === "PENDING" ? (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs text-green-700 border-green-200 hover:bg-green-50"
              onClick={(e) => {
                e.stopPropagation();
                toast.success("Leave approved");
              }}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs text-red-700 border-red-200 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                toast.error("Leave declined");
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : null,
    },
  ];

  const appraisalColumns: ColumnDef<Appraisal>[] = [
    { accessorKey: "staff", header: "Staff Member" },
    { accessorKey: "appraisalType", header: "Type" },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) =>
        new Date(row.original.dueDate).toLocaleDateString("en-GB"),
    },
    { accessorKey: "appraiser", header: "Appraiser" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <AppraisalStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <span
          className={cn(
            "text-sm",
            row.original.rating !== "-"
              ? "font-medium text-gray-900"
              : "text-gray-400",
          )}
        >
          {row.original.rating}
        </span>
      ),
    },
  ];

  const cpdColumns: ColumnDef<CPDRecord>[] = [
    { accessorKey: "staff", header: "Staff Member" },
    { accessorKey: "training", header: "Training" },
    { accessorKey: "provider", header: "Provider" },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.date).toLocaleDateString("en-GB"),
    },
    {
      accessorKey: "hours",
      header: "Hours",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.hours}h</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <CpdStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "cost",
      header: "Cost",
      cell: ({ row }) => (
        <span
          className={
            row.original.cost === 0
              ? "text-green-600 text-xs font-medium"
              : "font-medium"
          }
        >
          {row.original.cost === 0 ? "Free" : formatCurrency(row.original.cost)}
        </span>
      ),
    },
  ];

  // CPD hours per staff member
  const cpdHoursMap: Record<string, number> = {};
  MOCK_CPD.filter((r) => r.status === "COMPLETED").forEach((r) => {
    cpdHoursMap[r.staff] = (cpdHoursMap[r.staff] ?? 0) + r.hours;
  });

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Human Resources"
        subtitle="Staff management, leave, appraisals and professional development"
        icon={Users}
        iconColor="bg-violet-600"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Staff"
            value={62}
            icon={Users}
            variant="default"
            subtitle="Full and part-time"
          />
          <StatCard
            title="On Leave Today"
            value={3}
            icon={Plane}
            variant="info"
            subtitle="3 absent"
          />
          <StatCard
            title="Vacancies"
            value={2}
            icon={Briefcase}
            variant="warning"
            subtitle="Active recruitment"
          />
          <StatCard
            title="Appraisals Due"
            value={8}
            icon={Star}
            variant="danger"
            subtitle="Due this term"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100">
            <TabsTrigger value="staff">Staff Overview</TabsTrigger>
            <TabsTrigger value="leave">Leave</TabsTrigger>
            <TabsTrigger value="appraisals">Appraisals</TabsTrigger>
            <TabsTrigger value="cpd">CPD</TabsTrigger>
            <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          </TabsList>

          <TabsContent value="staff" className="mt-4">
            <DataTable
              columns={staffColumns}
              data={MOCK_STAFF}
              searchPlaceholder="Search staff..."
              emptyMessage="No staff found"
            />
          </TabsContent>

          <TabsContent value="leave" className="mt-4">
            <DataTable
              columns={leaveColumns}
              data={MOCK_LEAVE}
              searchPlaceholder="Search leave requests..."
              toolbar={
                <Button size="sm" onClick={() => setShowLeaveDialog(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Request Leave
                </Button>
              }
              emptyMessage="No leave requests"
            />
          </TabsContent>

          <TabsContent value="appraisals" className="mt-4">
            <DataTable
              columns={appraisalColumns}
              data={MOCK_APPRAISALS}
              searchPlaceholder="Search appraisals..."
              toolbar={
                <Button size="sm" onClick={() => setShowAppraisalDialog(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Schedule Appraisal
                </Button>
              }
              emptyMessage="No appraisals found"
            />
          </TabsContent>

          <TabsContent value="cpd" className="mt-4 space-y-6">
            {/* CPD hours summary per staff */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-violet-600" />
                CPD Hours (Completed)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(cpdHoursMap).map(([name, hours]) => (
                  <div
                    key={name}
                    className="rounded-lg bg-gray-50 p-3 border border-gray-100"
                  >
                    <p className="text-xs text-gray-500 truncate">{name}</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">
                      {hours}h
                    </p>
                  </div>
                ))}
              </div>
            </Card>
            <DataTable
              columns={cpdColumns}
              data={MOCK_CPD}
              searchPlaceholder="Search CPD records..."
              emptyMessage="No CPD records found"
            />
          </TabsContent>

          <TabsContent value="recruitment" className="mt-4">
            <div className="space-y-4">
              {[
                {
                  title: "English Teacher (Maternity Cover)",
                  dept: "English",
                  type: "Fixed Term",
                  posted: "2025-01-20",
                  apps: 12,
                  status: "Interviewing",
                },
                {
                  title: "Teaching Assistant (KS3)",
                  dept: "SEND",
                  type: "Permanent",
                  posted: "2025-02-01",
                  apps: 7,
                  status: "Shortlisting",
                },
              ].map((v) => (
                <Card key={v.title} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{v.title}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {v.dept} · {v.type} · Posted{" "}
                        {new Date(v.posted).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          {v.apps}
                        </p>
                        <p className="text-xs text-gray-400">Applications</p>
                      </div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700">
                        {v.status}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.info("Opening vacancy details...")}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Request Leave Dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Staff Member</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_STAFF.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Leave Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LEAVE_TYPE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label>Notes</Label>
              <Textarea placeholder="Reason for leave..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeaveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowLeaveDialog(false);
                toast.success("Leave request submitted");
              }}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Appraisal Dialog */}
      <Dialog open={showAppraisalDialog} onOpenChange={setShowAppraisalDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Appraisal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Staff Member</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_STAFF.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Appraisal Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual Review</SelectItem>
                  <SelectItem value="probation">Probation Review</SelectItem>
                  <SelectItem value="mid-year">Mid-Year Check-In</SelectItem>
                  <SelectItem value="performance">
                    Performance Review
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Appraiser</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select appraiser" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_STAFF.filter((s) => s.department === "Leadership").map(
                    (s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Due Date</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAppraisalDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowAppraisalDialog(false);
                toast.success("Appraisal scheduled");
              }}
            >
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
