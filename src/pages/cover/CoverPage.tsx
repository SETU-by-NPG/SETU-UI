import { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type CoverStatus = "arranged" | "pending" | "self-cover";

interface CoverSlot {
  id: string;
  absentTeacher: string;
  period: number;
  periodTime: string;
  className: string;
  room: string;
  coverTeacher: string | null;
  status: CoverStatus;
  subject: string;
  day: string;
}

interface WeeklyOverview {
  day: string;
  date: string;
  absences: number;
  arranged: number;
  pending: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const TODAY_COVER: CoverSlot[] = [
  {
    id: "cv01",
    absentTeacher: "Ms Clarke",
    period: 1,
    periodTime: "8:45–9:45",
    className: "7A",
    room: "E04",
    coverTeacher: "Mr Wilson",
    status: "arranged",
    subject: "English",
    day: "Today",
  },
  {
    id: "cv02",
    absentTeacher: "Ms Clarke",
    period: 3,
    periodTime: "11:05–12:05",
    className: "9B",
    room: "E04",
    coverTeacher: null,
    status: "pending",
    subject: "English",
    day: "Today",
  },
  {
    id: "cv03",
    absentTeacher: "Dr Patel",
    period: 2,
    periodTime: "9:45–10:45",
    className: "8A",
    room: "S01",
    coverTeacher: "Mrs Lewis",
    status: "arranged",
    subject: "Science",
    day: "Today",
  },
  {
    id: "cv04",
    absentTeacher: "Dr Patel",
    period: 4,
    periodTime: "12:05–13:05",
    className: "10B",
    room: "S01",
    coverTeacher: null,
    status: "pending",
    subject: "Science",
    day: "Today",
  },
  {
    id: "cv05",
    absentTeacher: "Mr Brown",
    period: 5,
    periodTime: "13:50–14:50",
    className: "7C",
    room: "H07",
    coverTeacher: "Ms Green",
    status: "arranged",
    subject: "History",
    day: "Today",
  },
];

const WEEKLY_OVERVIEW: WeeklyOverview[] = [
  { day: "Monday", date: "2 Dec", absences: 2, arranged: 4, pending: 0 },
  { day: "Tuesday", date: "3 Dec", absences: 3, arranged: 3, pending: 2 },
  { day: "Wednesday", date: "4 Dec", absences: 0, arranged: 0, pending: 0 },
  { day: "Thursday", date: "5 Dec", absences: 1, arranged: 2, pending: 0 },
  { day: "Friday", date: "6 Dec", absences: 2, arranged: 1, pending: 3 },
];

const AVAILABLE_COVER_TEACHERS = [
  "Mr Wilson",
  "Mrs Lewis",
  "Ms Green",
  "Mr Hall",
  "Ms Thompson",
  "Mr Garcia",
  "Mrs White",
  "Mr Davis",
  "Ms Roberts",
];

const PERIOD_OPTIONS = [
  { value: "1", label: "P1 — 8:45–9:45" },
  { value: "2", label: "P2 — 9:45–10:45" },
  { value: "3", label: "P3 — 11:05–12:05" },
  { value: "4", label: "P4 — 12:05–13:05" },
  { value: "5", label: "P5 — 13:50–14:50" },
  { value: "6", label: "P6 — 14:50–15:50" },
];

const STATUS_STYLES: Record<CoverStatus, { badge: string; label: string }> = {
  arranged: {
    badge: "bg-green-100 text-green-700 border-green-200",
    label: "Arranged",
  },
  pending: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    label: "Pending",
  },
  "self-cover": {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    label: "Self-cover",
  },
};

// ─── Column definitions ───────────────────────────────────────────────────────

const coverColumns: ColumnDef<CoverSlot>[] = [
  {
    accessorKey: "absentTeacher",
    header: "Absent Teacher",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">
        {row.original.absentTeacher}
      </span>
    ),
  },
  {
    accessorKey: "period",
    header: "Period",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-800">P{row.original.period}</div>
        <div className="text-xs text-gray-400">{row.original.periodTime}</div>
      </div>
    ),
  },
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "className", header: "Class" },
  { accessorKey: "room", header: "Room" },
  {
    accessorKey: "coverTeacher",
    header: "Cover Teacher",
    cell: ({ row }) =>
      row.original.coverTeacher ? (
        <span className="text-gray-800">{row.original.coverTeacher}</span>
      ) : (
        <span className="text-gray-400 italic">Unassigned</span>
      ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = STATUS_STYLES[row.original.status];
      return (
        <span
          className={cn(
            "inline-flex px-2 py-0.5 rounded-full text-xs font-medium border",
            s.badge,
          )}
        >
          {s.label}
        </span>
      );
    },
  },
];

// ─── Arrange Cover Dialog ─────────────────────────────────────────────────────

interface ArrangeCoverDialogProps {
  open: boolean;
  onClose: () => void;
}

function ArrangeCoverDialog({ open, onClose }: ArrangeCoverDialogProps) {
  const [form, setForm] = useState({ period: "", coverClass: "", teacher: "" });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Arrange Cover</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Period</Label>
            <Select
              value={form.period}
              onValueChange={(v) => setForm((p) => ({ ...p, period: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Class to Cover</Label>
            <Select
              value={form.coverClass}
              onValueChange={(v) => setForm((p) => ({ ...p, coverClass: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {["7A", "7B", "7C", "8A", "8B", "9A", "10A", "10B", "11A"].map(
                  (c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Available Cover Teacher</Label>
            <Select
              value={form.teacher}
              onValueChange={(v) => setForm((p) => ({ ...p, teacher: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_COVER_TEACHERS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-gray-400">
            Note: Only teachers without a timetabled lesson in this period are
            listed.
          </p>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onClose} className="flex-1">
              Assign Cover
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CoverPage() {
  const [arrangeOpen, setArrangeOpen] = useState(false);

  const arranged = TODAY_COVER.filter((c) => c.status === "arranged").length;
  const pending = TODAY_COVER.filter((c) => c.status === "pending").length;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Cover Manager"
        subtitle="Manage teacher absences and cover arrangements"
        icon={ShieldCheck}
        iconColor="bg-amber-500"
        actions={[
          {
            label: "Arrange Cover",
            icon: Plus,
            onClick: () => setArrangeOpen(true),
          },
        ]}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            title="Cover Needed Today"
            value={TODAY_COVER.length}
            subtitle="Lessons requiring cover"
            icon={AlertTriangle}
            variant="warning"
          />
          <StatCard
            title="Arranged"
            value={arranged}
            subtitle="Cover teachers assigned"
            icon={CheckCircle2}
            variant="success"
          />
          <StatCard
            title="Pending"
            value={pending}
            subtitle="Still to be arranged"
            icon={Clock}
            variant="danger"
          />
        </div>

        {/* Today's cover table */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">
            Today's Cover Requirements
          </h3>
          <DataTable
            columns={coverColumns}
            data={TODAY_COVER}
            searchPlaceholder="Search cover slots..."
            emptyMessage="No cover required today"
            toolbar={
              <Button size="sm" onClick={() => setArrangeOpen(true)}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Arrange Cover
              </Button>
            }
          />
        </div>

        {/* Weekly overview */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Weekly Cover Overview
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {WEEKLY_OVERVIEW.map((day) => (
              <Card
                key={day.day}
                className={cn(
                  "p-3",
                  day.day === "Tuesday" && "ring-2 ring-primary/20",
                )}
              >
                <div className="text-xs font-semibold text-gray-700">
                  {day.day}
                </div>
                <div className="text-xs text-gray-400 mb-2">{day.date} Dec</div>
                {day.absences === 0 ? (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    All clear
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">
                      {day.absences} absent
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className="h-1.5 bg-green-400 rounded-full"
                        style={{
                          width: `${(day.arranged / (day.arranged + day.pending || 1)) * 60}px`,
                        }}
                      />
                      <div
                        className="h-1.5 bg-amber-400 rounded-full"
                        style={{
                          width: `${(day.pending / (day.arranged + day.pending || 1)) * 60}px`,
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {day.arranged} arranged · {day.pending} pending
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Absent staff today */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">
            Absent Staff Today
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                name: "Ms Clarke",
                subject: "English",
                periods: [1, 3],
                reason: "Sick leave",
              },
              {
                name: "Dr Patel",
                subject: "Science",
                periods: [2, 4],
                reason: "Hospital appointment",
              },
              {
                name: "Mr Brown",
                subject: "History",
                periods: [5],
                reason: "Training course",
              },
            ].map((staff) => (
              <Card key={staff.name} className="p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {staff.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {staff.subject}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {staff.reason}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {staff.periods.map((p) => (
                      <Badge
                        key={p}
                        className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200"
                      >
                        P{p}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <ArrangeCoverDialog
        open={arrangeOpen}
        onClose={() => setArrangeOpen(false)}
      />
    </div>
  );
}
