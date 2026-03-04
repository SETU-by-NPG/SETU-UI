import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Building2, Plus, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
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
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type MaintenanceStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED";
type VisitorStatus = "SIGNED_IN" | "SIGNED_OUT";
type BookingStatus = "CONFIRMED" | "CANCELLED" | "PENDING";

interface RoomBooking {
  id: string;
  room: string;
  date: string;
  period: string;
  purpose: string;
  requestedBy: string;
  status: BookingStatus;
}

interface MaintenanceRequest {
  id: string;
  requestId: string;
  location: string;
  issue: string;
  priority: MaintenancePriority;
  reportedBy: string;
  date: string;
  status: MaintenanceStatus;
}

interface Visitor {
  id: string;
  visitor: string;
  host: string;
  purpose: string;
  timeIn: string;
  timeOut: string;
  badge: string;
  status: VisitorStatus;
}

interface SafetyAudit {
  id: string;
  date: string;
  type: string;
  auditor: string;
  score: number;
  actionItems: number;
  nextAudit: string;
  status: "PASSED" | "FAILED" | "ADVISORY";
}

const ROOMS = [
  "Main Hall",
  "Science Lab 1",
  "Science Lab 2",
  "Art Room",
  "IT Suite",
  "Sports Hall",
  "Library",
  "Drama Studio",
  "Music Room",
  "Conference Room",
];

const PERIODS = [
  "Period 1 (08:30)",
  "Period 2 (09:30)",
  "Period 3 (10:30)",
  "Period 4 (11:30)",
  "Lunch (12:30)",
  "Period 5 (13:30)",
  "Period 6 (14:30)",
  "Period 7 (15:30)",
  "After School (16:00)",
];

const PRIORITY_CONFIG: Record<
  MaintenancePriority,
  { label: string; className: string }
> = {
  LOW: { label: "Low", className: "bg-gray-100 text-gray-600" },
  MEDIUM: { label: "Medium", className: "bg-amber-100 text-amber-700" },
  HIGH: { label: "High", className: "bg-orange-100 text-orange-700" },
  URGENT: { label: "Urgent", className: "bg-red-100 text-red-700" },
};

const MAINT_STATUS_CONFIG: Record<
  MaintenanceStatus,
  { label: string; className: string }
> = {
  OPEN: { label: "Open", className: "bg-blue-100 text-blue-700" },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-purple-100 text-purple-700",
  },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700" },
  DEFERRED: { label: "Deferred", className: "bg-gray-100 text-gray-500" },
};

const MOCK_BOOKINGS: RoomBooking[] = [
  {
    id: "1",
    room: "Sports Hall",
    date: "2025-02-05",
    period: "Period 3 (10:30)",
    purpose: "Year 10 PE",
    requestedBy: "Mr. Chris Ward",
    status: "CONFIRMED",
  },
  {
    id: "2",
    room: "Science Lab 1",
    date: "2025-02-05",
    period: "Period 4 (11:30)",
    purpose: "GCSE Chemistry",
    requestedBy: "Mrs. Lisa Patel",
    status: "CONFIRMED",
  },
  {
    id: "3",
    room: "IT Suite",
    date: "2025-02-06",
    period: "Period 1 (08:30)",
    purpose: "Computing Lesson",
    requestedBy: "Mr. David Kim",
    status: "CONFIRMED",
  },
  {
    id: "4",
    room: "Main Hall",
    date: "2025-02-10",
    period: "After School (16:00)",
    purpose: "Year 11 Revision",
    requestedBy: "Ms. Rachel Green",
    status: "PENDING",
  },
  {
    id: "5",
    room: "Drama Studio",
    date: "2025-02-12",
    period: "Lunch (12:30)",
    purpose: "Drama Club Rehearsal",
    requestedBy: "Mr. Tom Clarke",
    status: "CONFIRMED",
  },
  {
    id: "6",
    room: "Library",
    date: "2025-02-07",
    period: "Period 5 (13:30)",
    purpose: "Study Session",
    requestedBy: "Ms. Sarah Bell",
    status: "CONFIRMED",
  },
  {
    id: "7",
    room: "Conference Room",
    date: "2025-02-11",
    period: "Lunch (12:30)",
    purpose: "Parent Meeting",
    requestedBy: "Mr. James Foster",
    status: "CANCELLED",
  },
];

const MOCK_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: "1",
    requestId: "MNT-001",
    location: "Science Lab 2",
    issue: "Fume cupboard fan faulty",
    priority: "URGENT",
    reportedBy: "Mrs. Lisa Patel",
    date: "2025-01-30",
    status: "IN_PROGRESS",
  },
  {
    id: "2",
    requestId: "MNT-002",
    location: "Boys Toilets (Block B)",
    issue: "Tap dripping — cold water",
    priority: "MEDIUM",
    reportedBy: "Mr. David Kim",
    date: "2025-02-01",
    status: "OPEN",
  },
  {
    id: "3",
    requestId: "MNT-003",
    location: "Main Hall",
    issue: "Two ceiling lights not working",
    priority: "LOW",
    reportedBy: "Mr. Chris Ward",
    date: "2025-02-02",
    status: "OPEN",
  },
  {
    id: "4",
    requestId: "MNT-004",
    location: "Library",
    issue: "Radiator not heating",
    priority: "HIGH",
    reportedBy: "Ms. Sarah Bell",
    date: "2025-01-28",
    status: "COMPLETED",
  },
  {
    id: "5",
    requestId: "MNT-005",
    location: "Reception Area",
    issue: "CCTV camera offline (Camera 3)",
    priority: "HIGH",
    reportedBy: "Mrs. Emma Stone",
    date: "2025-01-25",
    status: "IN_PROGRESS",
  },
  {
    id: "6",
    requestId: "MNT-006",
    location: "Car Park",
    issue: "Pothole near entrance gate",
    priority: "MEDIUM",
    reportedBy: "Dr. Anna Hughes",
    date: "2025-01-20",
    status: "DEFERRED",
  },
  {
    id: "7",
    requestId: "MNT-007",
    location: "Year 9 Corridor",
    issue: "Door handle broken",
    priority: "MEDIUM",
    reportedBy: "Mr. Ryan Black",
    date: "2025-02-03",
    status: "OPEN",
  },
];

const MOCK_VISITORS: Visitor[] = [
  {
    id: "1",
    visitor: "Sarah Carter",
    host: "Mrs. Emma Stone",
    purpose: "Parent Meeting",
    timeIn: "09:15",
    timeOut: "10:00",
    badge: "V-001",
    status: "SIGNED_OUT",
  },
  {
    id: "2",
    visitor: "OFSTED Inspector",
    host: "Dr. Anna Hughes",
    purpose: "Inspection",
    timeIn: "08:30",
    timeOut: "",
    badge: "V-002",
    status: "SIGNED_IN",
  },
  {
    id: "3",
    visitor: "Mike Plumber (ABC Plumbing)",
    host: "Mr. David Kim",
    purpose: "Maintenance",
    timeIn: "10:00",
    timeOut: "12:30",
    badge: "V-003",
    status: "SIGNED_OUT",
  },
  {
    id: "4",
    visitor: "Raj Patel",
    host: "Mrs. Emma Stone",
    purpose: "Admissions Tour",
    timeIn: "14:00",
    timeOut: "",
    badge: "V-004",
    status: "SIGNED_IN",
  },
  {
    id: "5",
    visitor: "Helen Miller",
    host: "Ms. Rachel Green",
    purpose: "Parents Evening",
    timeIn: "17:00",
    timeOut: "17:45",
    badge: "V-005",
    status: "SIGNED_OUT",
  },
];

const MOCK_AUDITS: SafetyAudit[] = [
  {
    id: "1",
    date: "2025-01-20",
    type: "Fire Safety",
    auditor: "Mr. David Kim",
    score: 94,
    actionItems: 2,
    nextAudit: "2025-07-20",
    status: "PASSED",
  },
  {
    id: "2",
    date: "2024-11-05",
    type: "Health & Safety",
    auditor: "External — RMS Safety",
    score: 88,
    actionItems: 5,
    nextAudit: "2025-05-05",
    status: "PASSED",
  },
  {
    id: "3",
    date: "2024-09-10",
    type: "Legionella Risk",
    auditor: "External — Aqua Check Ltd",
    score: 96,
    actionItems: 1,
    nextAudit: "2025-09-10",
    status: "PASSED",
  },
  {
    id: "4",
    date: "2024-07-01",
    type: "Asbestos Survey",
    auditor: "External — EnviroSpec",
    score: 100,
    actionItems: 0,
    nextAudit: "2026-07-01",
    status: "PASSED",
  },
  {
    id: "5",
    date: "2024-06-15",
    type: "Electrical Inspection",
    auditor: "External — SafeElec",
    score: 72,
    actionItems: 8,
    nextAudit: "2025-06-15",
    status: "ADVISORY",
  },
];

// Weekly calendar data: rooms vs periods for current week
const CALENDAR_PERIODS = ["P1", "P2", "P3", "P4", "Lunch", "P5", "P6"];
const CALENDAR_ROOMS = [
  "Main Hall",
  "Science Lab 1",
  "IT Suite",
  "Sports Hall",
  "Library",
  "Drama Studio",
];

function PriorityBadge({ priority }: { priority: MaintenancePriority }) {
  const cfg = PRIORITY_CONFIG[priority];
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

function MaintStatusBadge({ status }: { status: MaintenanceStatus }) {
  const cfg = MAINT_STATUS_CONFIG[status];
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

export default function FacilitiesPage() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [showVisitorDialog, setShowVisitorDialog] = useState(false);

  const bookingColumns: ColumnDef<RoomBooking>[] = [
    { accessorKey: "room", header: "Room" },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.date).toLocaleDateString("en-GB"),
    },
    { accessorKey: "period", header: "Period" },
    { accessorKey: "purpose", header: "Purpose" },
    { accessorKey: "requestedBy", header: "Requested By" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const cfg =
          row.original.status === "CONFIRMED"
            ? { label: "Confirmed", className: "bg-green-100 text-green-700" }
            : row.original.status === "PENDING"
              ? { label: "Pending", className: "bg-amber-100 text-amber-700" }
              : { label: "Cancelled", className: "bg-red-100 text-red-600" };
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
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) =>
        row.original.status !== "CANCELLED" ? (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              toast.success("Booking cancelled");
            }}
          >
            <X className="h-3.5 w-3.5 mr-1" /> Cancel
          </Button>
        ) : null,
    },
  ];

  const maintenanceColumns: ColumnDef<MaintenanceRequest>[] = [
    { accessorKey: "requestId", header: "ID", size: 90 },
    { accessorKey: "location", header: "Location" },
    { accessorKey: "issue", header: "Issue" },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
    },
    { accessorKey: "reportedBy", header: "Reported By" },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.date).toLocaleDateString("en-GB"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <MaintStatusBadge status={row.original.status} />,
    },
  ];

  const visitorColumns: ColumnDef<Visitor>[] = [
    { accessorKey: "visitor", header: "Visitor" },
    { accessorKey: "host", header: "Host Staff" },
    { accessorKey: "purpose", header: "Purpose" },
    { accessorKey: "timeIn", header: "Time In" },
    {
      accessorKey: "timeOut",
      header: "Time Out",
      cell: ({ row }) =>
        row.original.timeOut || <span className="text-gray-400">—</span>,
    },
    { accessorKey: "badge", header: "Badge" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            row.original.status === "SIGNED_IN"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600",
          )}
        >
          {row.original.status === "SIGNED_IN" ? "Signed In" : "Signed Out"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) =>
        row.original.status === "SIGNED_IN" ? (
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              toast.success(`${row.original.visitor} signed out`);
            }}
          >
            Sign Out
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Facilities"
        subtitle="Room bookings, maintenance, visitors and safety audits"
        icon={Building2}
        iconColor="bg-teal-600"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100">
            <TabsTrigger value="bookings">Room Bookings</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="audits">Safety Audits</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-4 space-y-6">
            {/* Weekly room booking calendar */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Weekly Room Availability
                </h3>
                <Button size="sm" onClick={() => setShowBookingDialog(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Book Room
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left px-3 py-2 text-gray-500 font-semibold w-36">
                        Room
                      </th>
                      {CALENDAR_PERIODS.map((p) => (
                        <th
                          key={p}
                          className="px-2 py-2 text-center text-gray-500 font-semibold min-w-[80px]"
                        >
                          {p}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {CALENDAR_ROOMS.map((room) => (
                      <tr key={room} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap">
                          {room}
                        </td>
                        {CALENDAR_PERIODS.map((period) => {
                          const booking = MOCK_BOOKINGS.find(
                            (b) =>
                              b.room === room &&
                              b.status === "CONFIRMED" &&
                              b.period.startsWith(
                                period === "P1"
                                  ? "Period 1"
                                  : period === "P2"
                                    ? "Period 2"
                                    : period === "P3"
                                      ? "Period 3"
                                      : period === "P4"
                                        ? "Period 4"
                                        : period === "Lunch"
                                          ? "Lunch"
                                          : period === "P5"
                                            ? "Period 5"
                                            : "Period 6",
                              ),
                          );
                          return (
                            <td key={period} className="px-2 py-2 text-center">
                              {booking ? (
                                <div className="rounded bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[10px] leading-tight truncate max-w-[80px]">
                                  {booking.requestedBy.split(" ").slice(-1)[0]}
                                </div>
                              ) : (
                                <div className="rounded bg-green-50 text-green-600 px-1.5 py-0.5 text-[10px]">
                                  Free
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Upcoming bookings list */}
            <DataTable
              columns={bookingColumns}
              data={MOCK_BOOKINGS}
              searchPlaceholder="Search bookings..."
              emptyMessage="No bookings found"
            />
          </TabsContent>

          <TabsContent value="maintenance" className="mt-4">
            <DataTable
              columns={maintenanceColumns}
              data={MOCK_MAINTENANCE}
              searchPlaceholder="Search maintenance requests..."
              toolbar={
                <Button
                  size="sm"
                  onClick={() => setShowMaintenanceDialog(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Raise Request
                </Button>
              }
              emptyMessage="No maintenance requests"
            />
          </TabsContent>

          <TabsContent value="visitors" className="mt-4">
            <DataTable
              columns={visitorColumns}
              data={MOCK_VISITORS}
              searchPlaceholder="Search visitors..."
              toolbar={
                <Button size="sm" onClick={() => setShowVisitorDialog(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Sign In Visitor
                </Button>
              }
              emptyMessage="No visitor records"
            />
          </TabsContent>

          <TabsContent value="audits" className="mt-4 space-y-4">
            {MOCK_AUDITS.map((audit) => (
              <Card key={audit.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {audit.type}
                      </h4>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          audit.status === "PASSED"
                            ? "bg-green-100 text-green-700"
                            : audit.status === "ADVISORY"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700",
                        )}
                      >
                        {audit.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <span>
                        Conducted:{" "}
                        <span className="text-gray-700 font-medium">
                          {new Date(audit.date).toLocaleDateString("en-GB")}
                        </span>
                      </span>
                      <span>
                        Auditor:{" "}
                        <span className="text-gray-700 font-medium">
                          {audit.auditor}
                        </span>
                      </span>
                      <span>
                        Action Items:{" "}
                        <span
                          className={cn(
                            "font-medium",
                            audit.actionItems > 0
                              ? "text-amber-600"
                              : "text-green-600",
                          )}
                        >
                          {audit.actionItems}
                        </span>
                      </span>
                      <span>
                        Next Audit:{" "}
                        <span className="text-gray-700 font-medium">
                          {new Date(audit.nextAudit).toLocaleDateString(
                            "en-GB",
                          )}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress
                        value={audit.score}
                        className={cn(
                          "h-2 flex-1 max-w-xs",
                          audit.score >= 90
                            ? "[&>div]:bg-green-500"
                            : audit.score >= 75
                              ? "[&>div]:bg-amber-500"
                              : "[&>div]:bg-red-500",
                        )}
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        {audit.score}%
                      </span>
                    </div>
                  </div>
                  {audit.actionItems > 0 && (
                    <div className="shrink-0 flex items-center gap-1.5 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        {audit.actionItems} action
                        {audit.actionItems > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Book Room Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Room</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {ROOMS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
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
                <Label>Period</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {PERIODS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Purpose</Label>
              <Input placeholder="e.g. GCSE Revision Session" />
            </div>
            <div className="space-y-1.5">
              <Label>Requesting Teacher</Label>
              <Input placeholder="Full name" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBookingDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowBookingDialog(false);
                toast.success("Room booked successfully");
              }}
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Raise Maintenance Request Dialog */}
      <Dialog
        open={showMaintenanceDialog}
        onOpenChange={setShowMaintenanceDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Raise Maintenance Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input placeholder="e.g. Science Lab 2" />
            </div>
            <div className="space-y-1.5">
              <Label>Issue Description</Label>
              <Textarea placeholder="Describe the issue..." rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Reported By</Label>
              <Input placeholder="Your name" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMaintenanceDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowMaintenanceDialog(false);
                toast.success("Maintenance request raised");
              }}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sign In Visitor Dialog */}
      <Dialog open={showVisitorDialog} onOpenChange={setShowVisitorDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sign In Visitor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Visitor Name</Label>
              <Input placeholder="Full name" />
            </div>
            <div className="space-y-1.5">
              <Label>Company / Organisation</Label>
              <Input placeholder="Optional" />
            </div>
            <div className="space-y-1.5">
              <Label>Host Staff Member</Label>
              <Input placeholder="Who are they visiting?" />
            </div>
            <div className="space-y-1.5">
              <Label>Purpose of Visit</Label>
              <Input placeholder="e.g. Parent Meeting" />
            </div>
            <div className="space-y-1.5">
              <Label>Badge Number</Label>
              <Input placeholder="e.g. V-006" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowVisitorDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowVisitorDialog(false);
                toast.success("Visitor signed in");
              }}
            >
              Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
