import { useState } from "react";
import { useOutletContext } from "react-router";
import {
  Calendar, Plus, Trash2, Save, Loader2, Edit2, Check, X,
  Clock, Users, BookOpen, DoorOpen, AlertTriangle, Copy, ChevronDown, Filter
} from "lucide-react";
import { type Role } from "../data/mock-data";

// Types
interface Period {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  type: "regular" | "break" | "lunch";
}

interface TimetableSlot {
  id: number;
  day: number;
  period: number;
  subject: string;
  teacher: string;
  room: string;
}

interface ClassTimetable {
  classId: number;
  className: string;
  slots: TimetableSlot[];
}

// Days
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Sample periods
const defaultPeriods: Period[] = [
  { id: 1, name: "Period 1", startTime: "08:00", endTime: "08:45", type: "regular" },
  { id: 2, name: "Period 2", startTime: "08:45", endTime: "09:30", type: "regular" },
  { id: 3, name: "Period 3", startTime: "09:30", endTime: "10:15", type: "regular" },
  { id: 4, name: "Short Break", startTime: "10:15", endTime: "10:30", type: "break" },
  { id: 5, name: "Period 4", startTime: "10:30", endTime: "11:15", type: "regular" },
  { id: 6, name: "Period 5", startTime: "11:15", endTime: "12:00", type: "regular" },
  { id: 7, name: "Lunch Break", startTime: "12:00", endTime: "12:45", type: "lunch" },
  { id: 8, name: "Period 6", startTime: "12:45", endTime: "13:30", type: "regular" },
  { id: 9, name: "Period 7", startTime: "13:30", endTime: "14:15", type: "regular" },
  { id: 10, name: "Period 8", startTime: "14:15", endTime: "15:00", type: "regular" },
];

// Sample classes
const classes = [
  { id: 1, name: "Grade 9 - Section A" },
  { id: 2, name: "Grade 9 - Section B" },
  { id: 3, name: "Grade 10 - Section A" },
  { id: 4, name: "Grade 11 - Science" },
  { id: 5, name: "Grade 12 - Commerce" },
];

// Sample subjects
const subjects = [
  "Mathematics", "English", "Physics", "Chemistry", "Biology", 
  "History", "Geography", "Computer Science", "Physical Education", "Art"
];

// Sample teachers
const teachers = [
  "Mr. John Williams", "Ms. Sarah Johnson", "Mr. Robert Brown", 
  "Ms. Emily Davis", "Mr. Michael Wilson", "Ms. Lisa Anderson"
];

// Sample rooms
const rooms = ["Room 101", "Room 102", "Room 103", "Lab 1", "Lab 2", "Lab 3", "Gym", "Art Room"];

// Generate initial slots
const generateInitialSlots = (): TimetableSlot[] => {
  const slots: TimetableSlot[] = [];
  let id = 1;
  for (let day = 0; day < 5; day++) {
    for (let period = 1; period <= 10; period++) {
      if (period === 4 || period === 7) continue; // Skip breaks
      slots.push({
        id: id++,
        day,
        period,
        subject: "",
        teacher: "",
        room: "",
      });
    }
  }
  return slots;
};

export default function TimetableBuilderPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [periods] = useState<Period[]>(defaultPeriods);
  const [slots, setSlots] = useState<TimetableSlot[]>(generateInitialSlots());
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [selectedDay, setSelectedDay] = useState(0);
  const [conflicts, setConflicts] = useState<string[]>([]);

  // Assign slot
  const updateSlot = (slotId: number, field: keyof TimetableSlot, value: string) => {
    setSlots(slots.map(s => s.id === slotId ? { ...s, [field]: value } : s));
    checkConflicts();
  };

  // Check for conflicts
  const checkConflicts = () => {
    const newConflicts: string[] = [];
    
    // Check for duplicate subjects in same period/day
    const usedSlots = slots.filter(s => s.subject && s.day === selectedDay);
    
    setConflicts(newConflicts);
  };

  // Copy timetable to another class
  const copyToClass = () => {
    alert("Feature: Copy timetable to another class");
  };

  // Clear timetable
  const clearTimetable = () => {
    if (confirm("Are you sure you want to clear all assignments?")) {
      setSlots(generateInitialSlots());
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  // Get slots for selected day
  const getSlotsForDay = (day: number) => {
    return slots.filter(s => s.day === day).sort((a, b) => a.period - b.period);
  };

  // Get period info
  const getPeriodInfo = (periodId: number) => {
    return periods.find(p => p.id === periodId);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Timetable Builder</h1>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>
            Create and manage class schedules
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyToClass}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted"
            style={{ fontSize: "0.8125rem" }}
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={clearTimetable}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted text-red-500"
            style={{ fontSize: "0.8125rem" }}
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60"
            style={{ fontSize: "0.875rem" }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>

      {/* Success message */}
      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 mb-4">
          <Check className="w-4 h-4" />
          <p style={{ fontSize: "0.875rem" }}>Timetable saved successfully!</p>
        </div>
      )}

      {/* Conflicts warning */}
      {conflicts.length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 mb-4">
          <AlertTriangle className="w-4 h-4" />
          <p style={{ fontSize: "0.875rem" }}>{conflicts.length} conflicts detected</p>
        </div>
      )}

      {/* Class Selector */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label style={{ fontSize: "0.875rem" }}>Class:</label>
          <select
            value={selectedClass.id}
            onChange={(e) => setSelectedClass(classes.find(c => c.id === parseInt(e.target.value)) || classes[0])}
            className="px-3 py-2 rounded-lg border border-border bg-background"
            style={{ fontSize: "0.875rem" }}
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("week")}
            className={`px-3 py-2 rounded-lg transition-colors ${
              viewMode === "week" ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"
            }`}
            style={{ fontSize: "0.8125rem" }}
          >
            Week View
          </button>
          <button
            onClick={() => setViewMode("day")}
            className={`px-3 py-2 rounded-lg transition-colors ${
              viewMode === "day" ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"
            }`}
            style={{ fontSize: "0.8125rem" }}
          >
            Day View
          </button>
        </div>
      </div>

      {/* Week View */}
      {viewMode === "week" && (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 gap-2 min-w-[800px]">
            {/* Header */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground text-xs font-medium">PERIOD</p>
            </div>
            {days.slice(0, 5).map((day) => (
              <div key={day} className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs font-medium">{day}</p>
              </div>
            ))}

            {/* Rows */}
            {periods.filter(p => p.type === "regular").map((period) => (
              <>
                {/* Period time */}
                <div key={`period-${period.id}`} className="p-3 bg-muted/30 rounded-lg flex flex-col justify-center">
                  <p className="text-xs font-medium">{period.name}</p>
                  <p className="text-muted-foreground text-xs">{period.startTime} - {period.endTime}</p>
                </div>
                
                {/* Day cells */}
                {days.slice(0, 5).map((_, dayIdx) => {
                  const slot = slots.find(s => s.day === dayIdx && s.period === period.id);
                  return (
                    <div
                      key={`${dayIdx}-${period.id}`}
                      className="p-2 bg-card border border-border rounded-lg min-h-[80px]"
                    >
                      {slot && (
                        <div className="space-y-2">
                          <select
                            value={slot.subject}
                            onChange={(e) => updateSlot(slot.id, "subject", e.target.value)}
                            className="w-full px-2 py-1 rounded border border-border bg-background text-xs"
                          >
                            <option value="">Subject</option>
                            {subjects.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <select
                            value={slot.teacher}
                            onChange={(e) => updateSlot(slot.id, "teacher", e.target.value)}
                            className="w-full px-2 py-1 rounded border border-border bg-background text-xs"
                          >
                            <option value="">Teacher</option>
                            {teachers.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <select
                            value={slot.room}
                            onChange={(e) => updateSlot(slot.id, "room", e.target.value)}
                            className="w-full px-2 py-1 rounded border border-border bg-background text-xs"
                          >
                            <option value="">Room</option>
                            {rooms.map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}

            {/* Breaks */}
            {periods.filter(p => p.type !== "regular").map((period) => (
              <>
                <div key={`break-${period.id}`} className="p-3 bg-muted/50 rounded-lg flex flex-col justify-center">
                  <p className="text-xs font-medium text-muted-foreground">{period.name}</p>
                  <p className="text-muted-foreground text-xs">{period.startTime} - {period.endTime}</p>
                </div>
                {days.slice(0, 5).map((_, dayIdx) => (
                  <div
                    key={`break-${dayIdx}-${period.id}`}
                    className="p-3 bg-muted/30 rounded-lg flex items-center justify-center"
                  >
                    <span className="text-muted-foreground text-xs italic">{period.type === "lunch" ? "Lunch" : "Break"}</span>
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
      )}

      {/* Day View */}
      {viewMode === "day" && (
        <div className="bg-card rounded-xl border border-border">
          {/* Day tabs */}
          <div className="flex gap-1 p-2 border-b border-border overflow-x-auto">
            {days.slice(0, 5).map((day, idx) => (
              <button
                key={day}
                onClick={() => setSelectedDay(idx)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedDay === idx
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
                style={{ fontSize: "0.8125rem" }}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Periods for selected day */}
          <div className="p-4 space-y-3">
            {periods.filter(p => p.type === "regular").map((period) => {
              const slot = slots.find(s => s.day === selectedDay && s.period === period.id);
              return (
                <div key={period.id} className="flex gap-4 items-start p-4 rounded-lg border border-border">
                  <div className="w-24 flex-shrink-0">
                    <p className="font-medium" style={{ fontSize: "0.9375rem" }}>{period.name}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                      {period.startTime} - {period.endTime}
                    </p>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Subject</label>
                      <select
                        value={slot?.subject || ""}
                        onChange={(e) => slot && updateSlot(slot.id, "subject", e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                        style={{ fontSize: "0.875rem" }}
                      >
                        <option value="">Select Subject</option>
                        {subjects.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Teacher</label>
                      <select
                        value={slot?.teacher || ""}
                        onChange={(e) => slot && updateSlot(slot.id, "teacher", e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                        style={{ fontSize: "0.875rem" }}
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Room</label>
                      <select
                        value={slot?.room || ""}
                        onChange={(e) => slot && updateSlot(slot.id, "room", e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                        style={{ fontSize: "0.875rem" }}
                      >
                        <option value="">Select Room</option>
                        {rooms.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Breaks */}
            {periods.filter(p => p.type !== "regular").map((period) => (
              <div key={period.id} className="flex gap-4 items-center p-4 rounded-lg bg-muted/30">
                <div className="w-24 flex-shrink-0">
                  <p className="font-medium text-muted-foreground" style={{ fontSize: "0.9375rem" }}>{period.name}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                    {period.startTime} - {period.endTime}
                  </p>
                </div>
                <div className="flex-1">
                  <span className="text-muted-foreground italic" style={{ fontSize: "0.875rem" }}>
                    {period.type === "lunch" ? "Lunch Break" : "Short Break"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground mb-2" style={{ fontSize: "0.75rem", fontWeight: 500 }}>QUICK TIPS</p>
        <ul className="space-y-1 text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
          <li>• Select a class from the dropdown to view/edit its timetable</li>
          <li>• Use Week View for a quick overview, Day View for detailed editing</li>
          <li>• Assign subject, teacher, and room for each period</li>
          <li>• Breaks and lunch are pre-configured and cannot be modified</li>
        </ul>
      </div>
    </div>
  );
}
