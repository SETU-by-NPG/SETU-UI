import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TimetableSlot {
  day: number; // 0=Mon … 4=Fri
  period: number; // 1-6
  subject: string;
  room: string;
  className: string;
  teacher?: string;
  color: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "bg-blue-100 border-blue-300 text-blue-800",
  English: "bg-purple-100 border-purple-300 text-purple-800",
  Science: "bg-green-100 border-green-300 text-green-800",
  History: "bg-amber-100 border-amber-300 text-amber-800",
  Geography: "bg-teal-100 border-teal-300 text-teal-800",
  "Physical Education": "bg-orange-100 border-orange-300 text-orange-800",
  Art: "bg-pink-100 border-pink-300 text-pink-800",
  Music: "bg-indigo-100 border-indigo-300 text-indigo-800",
  Computing: "bg-cyan-100 border-cyan-300 text-cyan-800",
  French: "bg-rose-100 border-rose-300 text-rose-800",
  Spanish: "bg-red-100 border-red-300 text-red-800",
  Drama: "bg-violet-100 border-violet-300 text-violet-800",
  "Religious Studies": "bg-slate-100 border-slate-300 text-slate-800",
};

const DEFAULT_COLOR = "bg-gray-100 border-gray-300 text-gray-800";

const TEACHER_TIMETABLE: TimetableSlot[] = [
  {
    day: 0,
    period: 1,
    subject: "Mathematics",
    room: "M12",
    className: "7A",
    color: "",
  },
  {
    day: 0,
    period: 2,
    subject: "Mathematics",
    room: "M12",
    className: "8B",
    color: "",
  },
  {
    day: 0,
    period: 4,
    subject: "Mathematics",
    room: "M12",
    className: "9A",
    color: "",
  },
  {
    day: 0,
    period: 5,
    subject: "Mathematics",
    room: "M12",
    className: "7C",
    color: "",
  },
  {
    day: 1,
    period: 1,
    subject: "Mathematics",
    room: "M12",
    className: "8B",
    color: "",
  },
  {
    day: 1,
    period: 3,
    subject: "Mathematics",
    room: "M12",
    className: "7A",
    color: "",
  },
  {
    day: 1,
    period: 4,
    subject: "Mathematics",
    room: "M12",
    className: "10A",
    color: "",
  },
  {
    day: 1,
    period: 6,
    subject: "Mathematics",
    room: "M12",
    className: "9A",
    color: "",
  },
  {
    day: 2,
    period: 2,
    subject: "Mathematics",
    room: "M12",
    className: "7C",
    color: "",
  },
  {
    day: 2,
    period: 3,
    subject: "Mathematics",
    room: "M12",
    className: "8B",
    color: "",
  },
  {
    day: 2,
    period: 5,
    subject: "Mathematics",
    room: "M12",
    className: "7A",
    color: "",
  },
  {
    day: 3,
    period: 1,
    subject: "Mathematics",
    room: "M12",
    className: "10A",
    color: "",
  },
  {
    day: 3,
    period: 2,
    subject: "Mathematics",
    room: "M12",
    className: "9A",
    color: "",
  },
  {
    day: 3,
    period: 4,
    subject: "Mathematics",
    room: "M12",
    className: "7C",
    color: "",
  },
  {
    day: 3,
    period: 6,
    subject: "Mathematics",
    room: "M12",
    className: "8B",
    color: "",
  },
  {
    day: 4,
    period: 2,
    subject: "Mathematics",
    room: "M12",
    className: "7A",
    color: "",
  },
  {
    day: 4,
    period: 3,
    subject: "Mathematics",
    room: "M12",
    className: "10A",
    color: "",
  },
  {
    day: 4,
    period: 5,
    subject: "Mathematics",
    room: "M12",
    className: "9A",
    color: "",
  },
  {
    day: 4,
    period: 6,
    subject: "Mathematics",
    room: "M12",
    className: "7C",
    color: "",
  },
];

const SCHOOL_TIMETABLE: TimetableSlot[] = [
  // 7A
  {
    day: 0,
    period: 1,
    subject: "Mathematics",
    room: "M12",
    className: "7A",
    teacher: "Mr Ahmed",
    color: "",
  },
  {
    day: 0,
    period: 2,
    subject: "English",
    room: "E04",
    className: "7A",
    teacher: "Ms Clarke",
    color: "",
  },
  {
    day: 0,
    period: 3,
    subject: "Science",
    room: "S01",
    className: "7A",
    teacher: "Dr Patel",
    color: "",
  },
  {
    day: 0,
    period: 4,
    subject: "History",
    room: "H07",
    className: "7A",
    teacher: "Mr Brown",
    color: "",
  },
  {
    day: 0,
    period: 5,
    subject: "French",
    room: "L02",
    className: "7A",
    teacher: "Mme Dupont",
    color: "",
  },
  {
    day: 0,
    period: 6,
    subject: "Art",
    room: "A01",
    className: "7A",
    teacher: "Ms Lee",
    color: "",
  },
  // 7B
  {
    day: 0,
    period: 1,
    subject: "English",
    room: "E05",
    className: "7B",
    teacher: "Mr Wilson",
    color: "",
  },
  {
    day: 0,
    period: 2,
    subject: "Mathematics",
    room: "M10",
    className: "7B",
    teacher: "Mrs Taylor",
    color: "",
  },
  {
    day: 0,
    period: 3,
    subject: "Geography",
    room: "G03",
    className: "7B",
    teacher: "Ms Green",
    color: "",
  },
  {
    day: 0,
    period: 4,
    subject: "Science",
    room: "S02",
    className: "7B",
    teacher: "Mr Evans",
    color: "",
  },
  {
    day: 0,
    period: 5,
    subject: "Music",
    room: "Mu1",
    className: "7B",
    teacher: "Ms Roberts",
    color: "",
  },
  {
    day: 0,
    period: 6,
    subject: "Computing",
    room: "IT1",
    className: "7B",
    teacher: "Mr Hall",
    color: "",
  },
  // 8A
  {
    day: 0,
    period: 1,
    subject: "Science",
    room: "S03",
    className: "8A",
    teacher: "Mrs Lewis",
    color: "",
  },
  {
    day: 0,
    period: 2,
    subject: "Mathematics",
    room: "M11",
    className: "8A",
    teacher: "Mr Ahmed",
    color: "",
  },
  {
    day: 0,
    period: 3,
    subject: "English",
    room: "E06",
    className: "8A",
    teacher: "Ms Clarke",
    color: "",
  },
  {
    day: 0,
    period: 4,
    subject: "Physical Education",
    room: "Gym",
    className: "8A",
    teacher: "Mr Davis",
    color: "",
  },
  {
    day: 0,
    period: 5,
    subject: "Drama",
    room: "D01",
    className: "8A",
    teacher: "Ms Thompson",
    color: "",
  },
  {
    day: 0,
    period: 6,
    subject: "Spanish",
    room: "L01",
    className: "8A",
    teacher: "Mr Garcia",
    color: "",
  },
  // Tuesday slots for 7A
  {
    day: 1,
    period: 1,
    subject: "Physical Education",
    room: "Gym",
    className: "7A",
    teacher: "Mr Davis",
    color: "",
  },
  {
    day: 1,
    period: 2,
    subject: "Music",
    room: "Mu1",
    className: "7A",
    teacher: "Ms Roberts",
    color: "",
  },
  {
    day: 1,
    period: 3,
    subject: "Mathematics",
    room: "M12",
    className: "7A",
    teacher: "Mr Ahmed",
    color: "",
  },
  {
    day: 1,
    period: 4,
    subject: "English",
    room: "E04",
    className: "7A",
    teacher: "Ms Clarke",
    color: "",
  },
  {
    day: 1,
    period: 5,
    subject: "Computing",
    room: "IT1",
    className: "7A",
    teacher: "Mr Hall",
    color: "",
  },
  {
    day: 1,
    period: 6,
    subject: "Religious Studies",
    room: "R01",
    className: "7A",
    teacher: "Mrs White",
    color: "",
  },
];

const STAFF_LIST = [
  "All Staff",
  "Mr Ahmed",
  "Ms Clarke",
  "Dr Patel",
  "Mr Brown",
  "Mme Dupont",
  "Ms Lee",
];
const CLASS_LIST = [
  "All Classes",
  "7A",
  "7B",
  "7C",
  "8A",
  "8B",
  "8C",
  "9A",
  "10A",
];
const ROOM_LIST = [
  "All Rooms",
  "M12",
  "M10",
  "M11",
  "E04",
  "E05",
  "E06",
  "S01",
  "S02",
  "S03",
  "Gym",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = [1, 2, 3, 4, 5, 6];

const PERIOD_TIMES: Record<number, string> = {
  1: "8:45 – 9:45",
  2: "9:45 – 10:45",
  3: "11:05 – 12:05",
  4: "12:05 – 13:05",
  5: "13:50 – 14:50",
  6: "14:50 – 15:50",
};

// ─── Helper to get the Monday of a given week offset ──────────────────────────

function getWeekDates(offset: number): Date[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset + offset * 7);
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TimetablePage() {
  const { role } = useAuthStore();
  const isAdmin =
    role === "MASTER_ADMIN" ||
    role === "SLT_MEMBER" ||
    role === "HEAD_OF_DEPARTMENT";

  const [weekOffset, setWeekOffset] = useState(0);
  const [staffFilter, setStaffFilter] = useState("All Staff");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [roomFilter, setRoomFilter] = useState("All Rooms");

  const weekDates = getWeekDates(weekOffset);
  const weekLabel = `${formatDateShort(weekDates[0])} – ${formatDateShort(weekDates[4])}`;

  const rawSlots = isAdmin ? SCHOOL_TIMETABLE : TEACHER_TIMETABLE;

  const slots = rawSlots.filter((s) => {
    if (isAdmin && staffFilter !== "All Staff" && s.teacher !== staffFilter)
      return false;
    if (isAdmin && classFilter !== "All Classes" && s.className !== classFilter)
      return false;
    if (isAdmin && roomFilter !== "All Rooms" && s.room !== roomFilter)
      return false;
    return true;
  });

  function getSlot(day: number, period: number): TimetableSlot | undefined {
    return slots.find((s) => s.day === day && s.period === period);
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Timetable"
        subtitle={
          isAdmin
            ? "Full school timetable view"
            : "Your personal teaching timetable"
        }
        icon={Calendar}
        iconColor="bg-blue-600"
      >
        {/* Week navigation */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setWeekOffset((o) => o - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-gray-700 min-w-[140px] text-center">
            {weekOffset === 0
              ? "This Week"
              : weekOffset === 1
                ? "Next Week"
                : weekOffset === -1
                  ? "Last Week"
                  : weekLabel}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setWeekOffset((o) => o + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        {weekOffset !== 0 && (
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)}>
            Today
          </Button>
        )}
      </PageHeader>

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Admin filters */}
        {isAdmin && (
          <div className="flex items-center gap-3 flex-wrap bg-white border border-gray-200 rounded-xl p-3">
            <span className="text-sm font-medium text-gray-600">
              Filter by:
            </span>
            <Select value={staffFilter} onValueChange={setStaffFilter}>
              <SelectTrigger className="h-8 w-44 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAFF_LIST.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="h-8 w-36 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLASS_LIST.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={roomFilter} onValueChange={setRoomFilter}>
              <SelectTrigger className="h-8 w-36 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROOM_LIST.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Week dates header */}
        <p className="text-sm text-gray-500">Week of {weekLabel}</p>

        {/* Timetable grid */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="w-28 px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-r border-gray-200">
                    Period
                  </th>
                  {DAYS.map((day, i) => (
                    <th
                      key={day}
                      className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide border-r border-gray-200 last:border-r-0"
                    >
                      <div className="font-semibold text-gray-700">{day}</div>
                      <div className="text-xs text-gray-400 font-normal mt-0.5">
                        {formatDateShort(weekDates[i])}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((period) => (
                  <>
                    {/* Break row before P3 */}
                    {period === 3 && (
                      <tr
                        key="break"
                        className="bg-amber-50 border-y border-amber-100"
                      >
                        <td
                          className="px-3 py-1.5 text-xs font-medium text-amber-700 border-r border-amber-100"
                          colSpan={6}
                        >
                          Break — 10:45 to 11:05
                        </td>
                      </tr>
                    )}
                    {/* Lunch row before P5 */}
                    {period === 5 && (
                      <tr
                        key="lunch"
                        className="bg-green-50 border-y border-green-100"
                      >
                        <td
                          className="px-3 py-1.5 text-xs font-medium text-green-700 border-r border-green-100"
                          colSpan={6}
                        >
                          Lunch — 13:05 to 13:50
                        </td>
                      </tr>
                    )}
                    <tr
                      key={period}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      {/* Period label */}
                      <td className="px-3 py-3 border-r border-gray-200 align-top">
                        <div className="text-xs font-semibold text-gray-700">
                          P{period}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {PERIOD_TIMES[period]}
                        </div>
                      </td>
                      {/* Day cells */}
                      {DAYS.map((_, dayIdx) => {
                        const slot = getSlot(dayIdx, period);
                        const colorClass = slot
                          ? (SUBJECT_COLORS[slot.subject] ?? DEFAULT_COLOR)
                          : "";
                        return (
                          <td
                            key={dayIdx}
                            className="px-2 py-2 border-r border-gray-100 last:border-r-0 min-w-[140px] align-top"
                          >
                            {slot ? (
                              <div
                                className={cn(
                                  "rounded-lg border p-2 text-xs leading-tight",
                                  colorClass,
                                )}
                              >
                                <div className="font-semibold truncate">
                                  {slot.subject}
                                </div>
                                <div className="mt-0.5 text-[10px] opacity-80">
                                  Room {slot.room} &bull; {slot.className}
                                </div>
                                {isAdmin && slot.teacher && (
                                  <div className="mt-0.5 text-[10px] opacity-70 truncate">
                                    {slot.teacher}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="h-12 rounded-lg border border-dashed border-gray-200" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 font-medium">
            Subject colour guide:
          </span>
          {Object.entries(SUBJECT_COLORS)
            .slice(0, 8)
            .map(([subject, color]) => (
              <Badge
                key={subject}
                className={cn("text-[10px] border", color, "hover:opacity-80")}
              >
                {subject}
              </Badge>
            ))}
        </div>
      </div>
    </div>
  );
}
