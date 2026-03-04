import { useState } from "react";
import { Download, Users, UserX, Clock, AlertCircle } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { AttendanceLineChart } from "@/components/charts";
import { AttendancePieChart } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceStatus = "present" | "absent" | "late" | "excused";

interface Student {
  id: string;
  name: string;
  yearGroup: string;
  status: AttendanceStatus;
}

interface ClassAttendance {
  id: string;
  className: string;
  yearGroup: string;
  teacher: string;
  present: number;
  total: number;
  percentage: number;
}

interface YearAttendance {
  yearGroup: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  percentage: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const TREND_DATA = [
  { name: "Mon 19", attendance: 94.1, target: 96 },
  { name: "Tue 20", attendance: 95.3, target: 96 },
  { name: "Wed 21", attendance: 93.8, target: 96 },
  { name: "Thu 22", attendance: 96.1, target: 96 },
  { name: "Fri 23", attendance: 92.7, target: 96 },
  { name: "Mon 26", attendance: 95.0, target: 96 },
  { name: "Tue 27", attendance: 94.5, target: 96 },
  { name: "Wed 28", attendance: 93.2, target: 96 },
  { name: "Thu 29", attendance: 96.4, target: 96 },
  { name: "Fri 30", attendance: 94.2, target: 96 },
];

const REGISTER_STUDENTS: Student[] = [
  { id: "s001", name: "Aisha Patel", yearGroup: "Year 7", status: "present" },
  { id: "s002", name: "Ben Thompson", yearGroup: "Year 7", status: "present" },
  { id: "s003", name: "Callum Harris", yearGroup: "Year 7", status: "absent" },
  {
    id: "s004",
    name: "Danielle Morgan",
    yearGroup: "Year 7",
    status: "present",
  },
  { id: "s005", name: "Ethan Clarke", yearGroup: "Year 7", status: "late" },
  {
    id: "s006",
    name: "Fatima Al-Said",
    yearGroup: "Year 7",
    status: "present",
  },
  {
    id: "s007",
    name: "George Bennett",
    yearGroup: "Year 7",
    status: "present",
  },
  { id: "s008", name: "Hannah Wright", yearGroup: "Year 7", status: "excused" },
  { id: "s009", name: "Isaac Johnson", yearGroup: "Year 7", status: "present" },
  { id: "s010", name: "Jasmine Lee", yearGroup: "Year 7", status: "present" },
  { id: "s011", name: "Kyle Adams", yearGroup: "Year 7", status: "late" },
  { id: "s012", name: "Layla Hassan", yearGroup: "Year 7", status: "present" },
  { id: "s013", name: "Marcus White", yearGroup: "Year 7", status: "present" },
  { id: "s014", name: "Nadia Kowalski", yearGroup: "Year 7", status: "absent" },
  { id: "s015", name: "Oscar Davies", yearGroup: "Year 7", status: "present" },
];

const CLASS_ATTENDANCE: ClassAttendance[] = [
  {
    id: "c1",
    className: "7A",
    yearGroup: "Year 7",
    teacher: "Mr Ahmed",
    present: 28,
    total: 30,
    percentage: 93.3,
  },
  {
    id: "c2",
    className: "7B",
    yearGroup: "Year 7",
    teacher: "Ms Clarke",
    present: 29,
    total: 30,
    percentage: 96.7,
  },
  {
    id: "c3",
    className: "7C",
    yearGroup: "Year 7",
    teacher: "Dr Patel",
    present: 27,
    total: 30,
    percentage: 90.0,
  },
  {
    id: "c4",
    className: "8A",
    yearGroup: "Year 8",
    teacher: "Mrs Taylor",
    present: 31,
    total: 32,
    percentage: 96.9,
  },
  {
    id: "c5",
    className: "8B",
    yearGroup: "Year 8",
    teacher: "Mr Brown",
    present: 30,
    total: 32,
    percentage: 93.8,
  },
  {
    id: "c6",
    className: "8C",
    yearGroup: "Year 8",
    teacher: "Ms Green",
    present: 29,
    total: 32,
    percentage: 90.6,
  },
  {
    id: "c7",
    className: "9A",
    yearGroup: "Year 9",
    teacher: "Mr Wilson",
    present: 27,
    total: 28,
    percentage: 96.4,
  },
  {
    id: "c8",
    className: "9B",
    yearGroup: "Year 9",
    teacher: "Mrs Lewis",
    present: 26,
    total: 29,
    percentage: 89.7,
  },
  {
    id: "c9",
    className: "10A",
    yearGroup: "Year 10",
    teacher: "Mr Evans",
    present: 30,
    total: 31,
    percentage: 96.8,
  },
  {
    id: "c10",
    className: "10B",
    yearGroup: "Year 10",
    teacher: "Ms Roberts",
    present: 28,
    total: 31,
    percentage: 90.3,
  },
  {
    id: "c11",
    className: "11A",
    yearGroup: "Year 11",
    teacher: "Mr Hall",
    present: 29,
    total: 30,
    percentage: 96.7,
  },
  {
    id: "c12",
    className: "11B",
    yearGroup: "Year 11",
    teacher: "Mr Davis",
    present: 27,
    total: 30,
    percentage: 90.0,
  },
];

const YEAR_ATTENDANCE: YearAttendance[] = [
  {
    yearGroup: "Year 7",
    present: 84,
    absent: 6,
    late: 3,
    total: 90,
    percentage: 93.3,
  },
  {
    yearGroup: "Year 8",
    present: 90,
    absent: 4,
    late: 6,
    total: 94,
    percentage: 93.6,
  },
  {
    yearGroup: "Year 9",
    present: 53,
    absent: 4,
    late: 0,
    total: 57,
    percentage: 93.0,
  },
  {
    yearGroup: "Year 10",
    present: 58,
    absent: 3,
    late: 1,
    total: 62,
    percentage: 93.5,
  },
  {
    yearGroup: "Year 11",
    present: 56,
    absent: 4,
    late: 2,
    total: 60,
    percentage: 96.7,
  },
];

const REGISTER_CLASSES = [
  "7A",
  "7B",
  "7C",
  "8A",
  "8B",
  "8C",
  "9A",
  "9B",
  "10A",
  "10B",
  "11A",
  "11B",
];

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-green-100 text-green-700 border-green-200",
  absent: "bg-red-100 text-red-700 border-red-200",
  late: "bg-amber-100 text-amber-700 border-amber-200",
  excused: "bg-blue-100 text-blue-700 border-blue-200",
};

// ─── Column definitions ───────────────────────────────────────────────────────

const classColumns: ColumnDef<ClassAttendance>[] = [
  { accessorKey: "className", header: "Class" },
  { accessorKey: "yearGroup", header: "Year Group" },
  { accessorKey: "teacher", header: "Form Teacher" },
  {
    accessorKey: "present",
    header: "Present",
    cell: ({ row }) => `${row.original.present} / ${row.original.total}`,
  },
  {
    accessorKey: "percentage",
    header: "Attendance %",
    cell: ({ row }) => {
      const pct = row.original.percentage;
      const color =
        pct >= 95
          ? "text-green-600"
          : pct >= 90
            ? "text-amber-600"
            : "text-red-600";
      return (
        <span className={cn("font-semibold", color)}>{pct.toFixed(1)}%</span>
      );
    },
  },
];

const yearColumns: ColumnDef<YearAttendance>[] = [
  { accessorKey: "yearGroup", header: "Year Group" },
  { accessorKey: "present", header: "Present" },
  { accessorKey: "absent", header: "Absent" },
  { accessorKey: "late", header: "Late" },
  { accessorKey: "total", header: "Total" },
  {
    accessorKey: "percentage",
    header: "Attendance %",
    cell: ({ row }) => {
      const pct = row.original.percentage;
      const color =
        pct >= 95
          ? "text-green-600"
          : pct >= 90
            ? "text-amber-600"
            : "text-red-600";
      return (
        <span className={cn("font-semibold", color)}>{pct.toFixed(1)}%</span>
      );
    },
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("7A");
  const [registerData, setRegisterData] =
    useState<Student[]>(REGISTER_STUDENTS);

  const setStatus = (id: string, status: AttendanceStatus) => {
    setRegisterData((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );
  };

  const presentCount = registerData.filter(
    (s) => s.status === "present",
  ).length;
  const absentCount = registerData.filter((s) => s.status === "absent").length;
  const lateCount = registerData.filter((s) => s.status === "late").length;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Attendance"
        subtitle="Monitor and manage school attendance"
        icon={Users}
        iconColor="bg-green-600"
        actions={[
          {
            label: "Download Report",
            icon: Download,
            onClick: () => {},
            variant: "outline",
          },
        ]}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Present Today"
            value="94.2%"
            subtitle="426 of 452 students"
            icon={Users}
            variant="success"
            trend={{ value: 0.4, label: "vs last week", direction: "up" }}
          />
          <StatCard
            title="Absent Today"
            value="5.8%"
            subtitle="26 students absent"
            icon={UserX}
            variant="danger"
            trend={{ value: 0.4, label: "vs last week", direction: "down" }}
          />
          <StatCard
            title="Late Arrivals"
            value="12"
            subtitle="Marked late this morning"
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Unregistered"
            value="3"
            subtitle="Classes not yet taken"
            icon={AlertCircle}
            variant="info"
          />
        </div>

        {/* Trend chart */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Attendance Trend — Last 2 Weeks
          </h3>
          <AttendanceLineChart data={TREND_DATA} height={200} />
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="register">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="by-class">By Class</TabsTrigger>
            <TabsTrigger value="by-year">By Year</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* ── Register tab ── */}
          <TabsContent value="register" className="mt-4">
            <Card className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    Class:
                  </span>
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger className="h-8 w-28 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REGISTER_CLASSES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-gray-400">
                    {presentCount} present · {absentCount} absent · {lateCount}{" "}
                    late
                  </span>
                </div>
                <Button size="sm">Save Register</Button>
              </div>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        #
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Student
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Current Status
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Mark Attendance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registerData.map((student, idx) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 text-gray-400 text-xs">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={cn(
                              "inline-flex px-2 py-0.5 rounded-full text-xs font-medium border",
                              STATUS_STYLES[student.status],
                            )}
                          >
                            {student.status.charAt(0).toUpperCase() +
                              student.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            {(
                              [
                                "present",
                                "absent",
                                "late",
                                "excused",
                              ] as AttendanceStatus[]
                            ).map((s) => (
                              <button
                                key={s}
                                onClick={() => setStatus(student.id, s)}
                                className={cn(
                                  "px-2 py-0.5 rounded text-xs font-medium border transition-colors",
                                  student.status === s
                                    ? STATUS_STYLES[s]
                                    : "border-gray-200 text-gray-400 hover:border-gray-300",
                                )}
                              >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <Button>Submit Register</Button>
              </div>
            </Card>
          </TabsContent>

          {/* ── By Class tab ── */}
          <TabsContent value="by-class" className="mt-4">
            <DataTable
              columns={classColumns}
              data={CLASS_ATTENDANCE}
              searchPlaceholder="Search classes..."
              emptyMessage="No class data available"
            />
          </TabsContent>

          {/* ── By Year tab ── */}
          <TabsContent value="by-year" className="mt-4">
            <DataTable
              columns={yearColumns}
              data={YEAR_ATTENDANCE}
              showSearch={false}
              emptyMessage="No year group data available"
            />
          </TabsContent>

          {/* ── Trends tab ── */}
          <TabsContent value="trends" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Daily Attendance Trend
                </h3>
                <AttendanceLineChart data={TREND_DATA} height={220} />
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Today's Breakdown
                </h3>
                <AttendancePieChart
                  data={[
                    { name: 'Present', value: 94, color: '#16a34a' },
                    { name: 'Absent', value: 3, color: '#dc2626' },
                    { name: 'Late', value: 2, color: '#ca8a04' },
                    { name: 'Excused', value: 1, color: '#2563eb' },
                  ]}
                  height={220}
                />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
