import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ClipboardList,
  Users,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  CalendarDays,
  Upload,
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type AppStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "OFFER_MADE"
  | "ACCEPTED"
  | "DECLINED"
  | "WITHDRAWN";

interface Application {
  id: string;
  ref: string;
  applicantName: string;
  dob: string;
  siblingAtSchool: boolean;
  dateApplied: string;
  yearAppliedFor: string;
  status: AppStatus;
  parentName: string;
  email: string;
  phone: string;
  currentSchool: string;
  notes: string;
}

type OpenDayStatus = "UPCOMING" | "FULL" | "COMPLETED" | "CANCELLED";

interface OpenDay {
  id: string;
  date: string;
  title: string;
  capacity: number;
  registered: number;
  status: OpenDayStatus;
}

const STATUS_CONFIG: Record<AppStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-gray-100 text-gray-700" },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "bg-blue-100 text-blue-700",
  },
  OFFER_MADE: {
    label: "Offer Made",
    className: "bg-purple-100 text-purple-700",
  },
  ACCEPTED: { label: "Accepted", className: "bg-green-100 text-green-700" },
  DECLINED: { label: "Declined", className: "bg-red-100 text-red-700" },
  WITHDRAWN: { label: "Withdrawn", className: "bg-gray-100 text-gray-500" },
};

const OPEN_DAY_STATUS_CONFIG: Record<
  OpenDayStatus,
  { label: string; className: string }
> = {
  UPCOMING: { label: "Upcoming", className: "bg-blue-100 text-blue-700" },
  FULL: { label: "Full", className: "bg-amber-100 text-amber-700" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

const MOCK_APPLICATIONS: Application[] = [
  {
    id: "1",
    ref: "ADM-2025-001",
    applicantName: "Emily Carter",
    dob: "2018-03-14",
    siblingAtSchool: true,
    dateApplied: "2025-01-08",
    yearAppliedFor: "Year 1",
    status: "ACCEPTED",
    parentName: "Sarah Carter",
    email: "sarah.carter@email.com",
    phone: "07700 900001",
    currentSchool: "Sunny Start Nursery",
    notes: "Brother in Year 3.",
  },
  {
    id: "2",
    ref: "ADM-2025-002",
    applicantName: "Oliver Patel",
    dob: "2018-07-22",
    siblingAtSchool: false,
    dateApplied: "2025-01-10",
    yearAppliedFor: "Year 1",
    status: "OFFER_MADE",
    parentName: "Raj Patel",
    email: "raj.patel@email.com",
    phone: "07700 900002",
    currentSchool: "Little Learners Pre-School",
    notes: "",
  },
  {
    id: "3",
    ref: "ADM-2025-003",
    applicantName: "Isla Thompson",
    dob: "2013-09-01",
    siblingAtSchool: false,
    dateApplied: "2025-01-12",
    yearAppliedFor: "Year 7",
    status: "UNDER_REVIEW",
    parentName: "Jane Thompson",
    email: "jane.thompson@email.com",
    phone: "07700 900003",
    currentSchool: "Meadow Primary",
    notes: "Strong academic record.",
  },
  {
    id: "4",
    ref: "ADM-2025-004",
    applicantName: "Noah Williams",
    dob: "2013-11-30",
    siblingAtSchool: true,
    dateApplied: "2025-01-15",
    yearAppliedFor: "Year 7",
    status: "PENDING",
    parentName: "Mark Williams",
    email: "mark.williams@email.com",
    phone: "07700 900004",
    currentSchool: "Grove Primary",
    notes: "Sister in Year 9.",
  },
  {
    id: "5",
    ref: "ADM-2025-005",
    applicantName: "Sophia Chen",
    dob: "2014-02-18",
    siblingAtSchool: false,
    dateApplied: "2025-01-18",
    yearAppliedFor: "Year 7",
    status: "DECLINED",
    parentName: "Li Chen",
    email: "li.chen@email.com",
    phone: "07700 900005",
    currentSchool: "Riverside Primary",
    notes: "",
  },
  {
    id: "6",
    ref: "ADM-2025-006",
    applicantName: "Jack Davies",
    dob: "2018-05-05",
    siblingAtSchool: false,
    dateApplied: "2025-01-20",
    yearAppliedFor: "Year 1",
    status: "WITHDRAWN",
    parentName: "Claire Davies",
    email: "claire.davies@email.com",
    phone: "07700 900006",
    currentSchool: "Oak Tree Nursery",
    notes: "Family relocating.",
  },
  {
    id: "7",
    ref: "ADM-2025-007",
    applicantName: "Amelia Singh",
    dob: "2013-08-25",
    siblingAtSchool: false,
    dateApplied: "2025-01-22",
    yearAppliedFor: "Year 7",
    status: "UNDER_REVIEW",
    parentName: "Priya Singh",
    email: "priya.singh@email.com",
    phone: "07700 900007",
    currentSchool: "Parkfield Primary",
    notes: "",
  },
  {
    id: "8",
    ref: "ADM-2025-008",
    applicantName: "Lucas Brown",
    dob: "2018-12-08",
    siblingAtSchool: true,
    dateApplied: "2025-01-25",
    yearAppliedFor: "Year 1",
    status: "ACCEPTED",
    parentName: "David Brown",
    email: "david.brown@email.com",
    phone: "07700 900008",
    currentSchool: "Sunshine Nursery",
    notes: "Twin sister also applied.",
  },
  {
    id: "9",
    ref: "ADM-2025-009",
    applicantName: "Mia Brown",
    dob: "2018-12-08",
    siblingAtSchool: true,
    dateApplied: "2025-01-25",
    yearAppliedFor: "Year 1",
    status: "ACCEPTED",
    parentName: "David Brown",
    email: "david.brown@email.com",
    phone: "07700 900008",
    currentSchool: "Sunshine Nursery",
    notes: "Twin brother also applied.",
  },
  {
    id: "10",
    ref: "ADM-2025-010",
    applicantName: "Ethan Miller",
    dob: "2014-04-12",
    siblingAtSchool: false,
    dateApplied: "2025-01-28",
    yearAppliedFor: "Year 7",
    status: "PENDING",
    parentName: "Helen Miller",
    email: "helen.miller@email.com",
    phone: "07700 900009",
    currentSchool: "Elm Street Primary",
    notes: "",
  },
];

const MOCK_OPEN_DAYS: OpenDay[] = [
  {
    id: "1",
    date: "2025-02-08",
    title: "Year 7 Open Morning",
    capacity: 60,
    registered: 60,
    status: "FULL",
  },
  {
    id: "2",
    date: "2025-02-22",
    title: "Reception Open Afternoon",
    capacity: 40,
    registered: 28,
    status: "UPCOMING",
  },
  {
    id: "3",
    date: "2025-03-15",
    title: "Sixth Form Taster Day",
    capacity: 80,
    registered: 55,
    status: "UPCOMING",
  },
  {
    id: "4",
    date: "2024-11-10",
    title: "Year 7 Open Evening",
    capacity: 100,
    registered: 97,
    status: "COMPLETED",
  },
  {
    id: "5",
    date: "2024-10-05",
    title: "Reception Morning Tour",
    capacity: 30,
    registered: 30,
    status: "COMPLETED",
  },
];

const WAITING_LIST: Application[] = MOCK_APPLICATIONS.filter(
  (a) => a.status === "PENDING",
);

function StatusBadge({ status }: { status: AppStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

function OpenDayStatus({ status }: { status: OpenDayStatus }) {
  const config = OPEN_DAY_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

export default function AdmissionsPage() {
  const [activeTab, setActiveTab] = useState("applications");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showNewAppDialog, setShowNewAppDialog] = useState(false);
  const [showOpenDayDialog, setShowOpenDayDialog] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const appColumns: ColumnDef<Application>[] = [
    { accessorKey: "ref", header: "Ref", size: 120 },
    { accessorKey: "applicantName", header: "Applicant Name" },
    {
      accessorKey: "dob",
      header: "DOB",
      cell: ({ row }) => new Date(row.original.dob).toLocaleDateString("en-GB"),
    },
    {
      accessorKey: "siblingAtSchool",
      header: "Sibling",
      cell: ({ row }) => (
        <span
          className={
            row.original.siblingAtSchool
              ? "text-green-600 font-medium"
              : "text-gray-400"
          }
        >
          {row.original.siblingAtSchool ? "Yes" : "No"}
        </span>
      ),
    },
    {
      accessorKey: "dateApplied",
      header: "Date Applied",
      cell: ({ row }) =>
        new Date(row.original.dateApplied).toLocaleDateString("en-GB"),
    },
    { accessorKey: "yearAppliedFor", header: "Year Group" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
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
            setSelectedApp(row.original);
          }}
        >
          <Eye className="h-3.5 w-3.5 mr-1" /> View
        </Button>
      ),
    },
  ];

  const openDayColumns: ColumnDef<OpenDay>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.date).toLocaleDateString("en-GB"),
    },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "capacity", header: "Capacity" },
    {
      accessorKey: "registered",
      header: "Registered",
      cell: ({ row }) => (
        <span>
          {row.original.registered}{" "}
          <span className="text-gray-400">/ {row.original.capacity}</span>
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <OpenDayStatus status={row.original.status} />,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Admissions"
        subtitle="Manage applications, open days and waiting lists"
        icon={ClipboardList}
        iconColor="bg-blue-600"
        actions={[
          {
            label: "New Application",
            icon: Plus,
            onClick: () => setShowNewAppDialog(true),
          },
        ]}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Applications"
            value={47}
            icon={ClipboardList}
            variant="default"
            subtitle="This academic year"
          />
          <StatCard
            title="Offers Made"
            value={23}
            icon={Users}
            variant="info"
            subtitle="Awaiting response"
          />
          <StatCard
            title="Accepted"
            value={18}
            icon={CheckCircle}
            variant="success"
            subtitle="Places confirmed"
          />
          <StatCard
            title="Waitlisted"
            value={12}
            icon={Clock}
            variant="warning"
            subtitle="Awaiting place"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="opendays">Open Days</TabsTrigger>
            <TabsTrigger value="waitinglist">Waiting List</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-4">
            <DataTable
              columns={appColumns}
              data={MOCK_APPLICATIONS}
              searchPlaceholder="Search applications..."
              onRowClick={setSelectedApp}
              emptyMessage="No applications found"
            />
          </TabsContent>

          <TabsContent value="opendays" className="mt-4">
            <DataTable
              columns={openDayColumns}
              data={MOCK_OPEN_DAYS}
              searchPlaceholder="Search open days..."
              toolbar={
                <Button size="sm" onClick={() => setShowOpenDayDialog(true)}>
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                  Schedule Open Day
                </Button>
              }
              emptyMessage="No open days scheduled"
            />
          </TabsContent>

          <TabsContent value="waitinglist" className="mt-4">
            <DataTable
              columns={appColumns}
              data={WAITING_LIST}
              searchPlaceholder="Search waiting list..."
              emptyMessage="Waiting list is empty"
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Admissions Settings
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Accept online applications",
                    desc: "Allow parents to apply via the parent portal",
                  },
                  {
                    label: "Sibling priority",
                    desc: "Give priority to applicants with siblings already at school",
                  },
                  {
                    label: "Email notifications",
                    desc: "Send automatic emails on status changes",
                  },
                  {
                    label: "Open day registration",
                    desc: "Allow parents to self-register for open days",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {s.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Application Detail Side Sheet */}
      <Sheet
        open={!!selectedApp}
        onOpenChange={(o) => !o && setSelectedApp(null)}
      >
        <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
          {selectedApp && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle>{selectedApp.applicantName}</SheetTitle>
                <SheetDescription>
                  Application {selectedApp.ref}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <StatusBadge status={selectedApp.status} />
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    {
                      label: "Date of Birth",
                      value: new Date(selectedApp.dob).toLocaleDateString(
                        "en-GB",
                      ),
                    },
                    {
                      label: "Year Applied For",
                      value: selectedApp.yearAppliedFor,
                    },
                    {
                      label: "Date Applied",
                      value: new Date(
                        selectedApp.dateApplied,
                      ).toLocaleDateString("en-GB"),
                    },
                    {
                      label: "Current School",
                      value: selectedApp.currentSchool,
                    },
                    {
                      label: "Sibling at School",
                      value: selectedApp.siblingAtSchool ? "Yes" : "No",
                    },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                        {f.label}
                      </p>
                      <p className="font-medium text-gray-900">{f.value}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                    Parent / Guardian
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-gray-900">
                      {selectedApp.parentName}
                    </p>
                    <p className="text-gray-500">{selectedApp.email}</p>
                    <p className="text-gray-500">{selectedApp.phone}</p>
                  </div>
                </div>
                {selectedApp.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                        Notes
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedApp.notes}
                      </p>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      toast.success("Status updated");
                      setSelectedApp(null);
                    }}
                  >
                    Update Status
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      toast.info("Email sent to parent");
                    }}
                  >
                    Email Parent
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* New Application Dialog */}
      <Dialog open={showNewAppDialog} onOpenChange={setShowNewAppDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Application</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Child's Full Name</Label>
              <Input placeholder="First and last name" />
            </div>
            <div className="space-y-1.5">
              <Label>Date of Birth</Label>
              <Input type="date" />
            </div>
            <div className="space-y-1.5">
              <Label>Parent / Guardian Name</Label>
              <Input placeholder="Full name" />
            </div>
            <div className="space-y-1.5">
              <Label>Email Address</Label>
              <Input type="email" placeholder="parent@email.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone Number</Label>
              <Input placeholder="07700 900000" />
            </div>
            <div className="space-y-1.5">
              <Label>Year Applying For</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Reception",
                    "Year 1",
                    "Year 2",
                    "Year 3",
                    "Year 4",
                    "Year 5",
                    "Year 6",
                    "Year 7",
                    "Year 8",
                    "Year 9",
                    "Year 10",
                    "Year 11",
                    "Year 12",
                    "Year 13",
                  ].map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Current School</Label>
              <Input placeholder="School name" />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <Switch id="sibling" />
              <Label htmlFor="sibling">Sibling at this school</Label>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Notes</Label>
              <Textarea placeholder="Any additional information..." rows={3} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Supporting Documents</Label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  toast.success("File uploaded");
                }}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                  dragOver
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  Drag and drop files here, or{" "}
                  <span className="text-blue-600 underline cursor-pointer">
                    browse
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PDF, Word, JPEG up to 10 MB each
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewAppDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowNewAppDialog(false);
                toast.success("Application submitted successfully");
              }}
            >
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Open Day Dialog */}
      <Dialog open={showOpenDayDialog} onOpenChange={setShowOpenDayDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Open Day</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input placeholder="e.g. Year 7 Open Morning" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-1.5">
                <Label>Capacity</Label>
                <Input type="number" placeholder="50" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea placeholder="Details about the open day..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowOpenDayDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowOpenDayDialog(false);
                toast.success("Open day scheduled");
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
