/**
 * SETU Education Management System - Feature 7: Teacher Schedule View
 * Display teacher's weekly schedule with conflict detection
 */

import React, { useMemo, useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { mockData } from '../../data';
import { usePermissions } from '../../context/permission-context';
import type { TimetableEntry, Teacher, Subject, ClassGrade } from '../../types';

// ==================== TYPES ====================

interface TeacherScheduleProps {
  teacherId: string;
  className?: string;
}

interface ScheduleSlot {
  day: number;
  period: number;
  entries: TimetableEntry[];
  hasConflict: boolean;
}

interface ConflictInfo {
  day: number;
  period: number;
  entries: TimetableEntry[];
}

// ==================== CONSTANTS ====================

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];
const PERIOD_TIMES: Record<number, { start: string; end: string }> = {
  1: { start: '08:00', end: '08:45' },
  2: { start: '08:45', end: '09:30' },
  3: { start: '09:30', end: '10:15' },
  4: { start: '10:15', end: '11:00' },
  5: { start: '11:00', end: '11:45' },
  6: { start: '11:45', end: '12:30' },
  7: { start: '13:30', end: '14:15' },
  8: { start: '14:15', end: '15:00' },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get current day and period
 */
const getCurrentTimeInfo = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeValue = hour * 60 + minute;
  
  let currentPeriod = null;
  for (const [period, times] of Object.entries(PERIOD_TIMES)) {
    const [startHour, startMin] = times.start.split(':').map(Number);
    const [endHour, endMin] = times.end.split(':').map(Number);
    const startValue = startHour * 60 + startMin;
    const endValue = endHour * 60 + endMin;
    
    if (timeValue >= startValue && timeValue < endValue) {
      currentPeriod = parseInt(period);
      break;
    }
  }
  
  return { day, period: currentPeriod };
};

/**
 * Detect schedule conflicts
 */
const detectConflicts = (entries: TimetableEntry[]): ConflictInfo[] => {
  const conflicts: ConflictInfo[] = [];
  const slotMap = new Map<string, TimetableEntry[]>();
  
  entries.forEach((entry) => {
    const key = `${entry.dayOfWeek}-${entry.period}`;
    if (!slotMap.has(key)) {
      slotMap.set(key, []);
    }
    slotMap.get(key)!.push(entry);
  });
  
  slotMap.forEach((entries, key) => {
    if (entries.length > 1) {
      const [day, period] = key.split('-').map(Number);
      conflicts.push({ day, period, entries });
    }
  });
  
  return conflicts;
};

// ==================== SUB-COMPONENTS ====================

/**
 * Schedule cell component
 */
const ScheduleCell: React.FC<{
  slot: ScheduleSlot | null;
  isCurrentSlot: boolean;
}> = ({ slot, isCurrentSlot }) => {
  if (!slot || slot.entries.length === 0) {
    return (
      <div className={`h-24 border border-gray-100 ${isCurrentSlot ? 'bg-blue-50' : 'bg-gray-50'}`}>
        <span className="sr-only">Free period</span>
      </div>
    );
  }

  const entry = slot.entries[0];
  const subject = mockData.subjects.find((s: Subject) => s.id === entry.subjectId);
  const cls = mockData.classes.find((c: ClassGrade) => c.id === entry.classId);

  return (
    <div
      className={`h-24 p-2 border text-xs relative ${
        slot.hasConflict
          ? 'bg-red-50 border-red-200'
          : isCurrentSlot
          ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400'
          : 'bg-green-50 border-green-200'
      }`}
    >
      {slot.hasConflict && (
        <AlertTriangle className="w-4 h-4 text-red-500 absolute top-1 right-1" />
      )}
      {isCurrentSlot && (
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
      )}
      <div className="font-semibold text-gray-900 truncate">{subject?.name}</div>
      <div className="text-gray-600 flex items-center gap-1 mt-1">
        <Users className="w-3 h-3" />
        {cls?.name}
      </div>
      <div className="text-gray-500 flex items-center gap-1 mt-0.5">
        <MapPin className="w-3 h-3" />
        {entry.room}
      </div>
    </div>
  );
};

/**
 * Conflict alert component
 */
const ConflictAlert: React.FC<{ conflicts: ConflictInfo[] }> = ({ conflicts }) => {
  if (conflicts.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
        <div>
          <h4 className="font-semibold text-red-700">Schedule Conflicts Detected</h4>
          <p className="text-sm text-red-600 mt-1">
            {conflicts.length} conflicting time slot{conflicts.length > 1 ? 's' : ''} found:
          </p>
          <ul className="mt-2 space-y-1">
            {conflicts.map((conflict, idx) => (
              <li key={idx} className="text-sm text-red-600">
                • {DAYS[conflict.day]} Period {conflict.period}: {conflict.entries.length} classes scheduled
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

/**
 * Teacher Schedule Component
 * Displays weekly timetable with conflict detection
 */
export const TeacherSchedule: React.FC<TeacherScheduleProps> = ({
  teacherId,
  className = '',
}) => {
  const [currentTime, setCurrentTime] = useState(getCurrentTimeInfo());
  const { hasPermission, currentRole } = usePermissions();

  // Refresh current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeInfo());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Get teacher's schedule
  const teacher = useMemo(() => 
    mockData.teachers.find((t: Teacher) => t.id === teacherId),
    [teacherId]
  );

  const scheduleEntries = useMemo(() => 
    mockData.timetable.filter((entry: TimetableEntry) => entry.teacherId === teacherId),
    [teacherId]
  );

  // Detect conflicts
  const conflicts = useMemo(() => detectConflicts(scheduleEntries), [scheduleEntries]);

  // Build schedule grid
  const scheduleGrid = useMemo(() => {
    const grid: (ScheduleSlot | null)[][] = [];
    
    for (let day = 0; day < 7; day++) {
      const dayRow: (ScheduleSlot | null)[] = [];
      for (const period of PERIODS) {
        const entries = scheduleEntries.filter(
          (e) => e.dayOfWeek === day && e.period === period
        );
        
        if (entries.length > 0) {
          dayRow.push({
            day,
            period,
            entries,
            hasConflict: entries.length > 1,
          });
        } else {
          dayRow.push(null);
        }
      }
      grid.push(dayRow);
    }
    
    return grid;
  }, [scheduleEntries]);

  // Console demonstration
  useEffect(() => {
    console.log('\n========== FEATURE 7: TEACHER SCHEDULE VIEW ==========\n');
    console.log(`[TeacherSchedule] Teacher: ${teacher?.name} (${teacherId})`);
    console.log(`[TeacherSchedule] Total entries: ${scheduleEntries.length}`);
    console.log(`[TeacherSchedule] Conflicts detected: ${conflicts.length}`);
    console.log(`[TeacherSchedule] Current time: ${DAYS[currentTime.day]}, Period ${currentTime.period || 'None'}`);
    console.log(`[TeacherSchedule] view.teacher.schedule permission: ${hasPermission('view.teacher.schedule')}`);
    
    if (conflicts.length > 0) {
      console.log('\n[TeacherSchedule] Conflict Details:');
      conflicts.forEach((c, i) => {
        console.log(`  Conflict ${i + 1}: ${DAYS[c.day]} Period ${c.period}`);
        c.entries.forEach((e) => {
          const subject = mockData.subjects.find((s: Subject) => s.id === e.subjectId);
          const cls = mockData.classes.find((c: ClassGrade) => c.id === e.classId);
          console.log(`    - ${subject?.name} (${cls?.name}) in ${e.room}`);
        });
      });
    }
  }, [teacher, teacherId, scheduleEntries, conflicts, currentTime, hasPermission]);

  // Check permission
  const canViewSchedule = hasPermission('view.teacher.schedule');
  if (!canViewSchedule) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <Info className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600">You don't have permission to view teacher schedules.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Weekly Schedule</h2>
            <p className="text-sm text-gray-500">{teacher?.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Classes</p>
          <p className="text-2xl font-bold text-blue-600">{scheduleEntries.length}</p>
        </div>
      </div>

      {/* Conflict Alert */}
      <ConflictAlert conflicts={conflicts} />

      {/* Current Period Indicator */}
      {currentTime.period && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-sm text-blue-700">
            Current: {DAYS[currentTime.day]} Period {currentTime.period}
          </span>
        </div>
      )}

      {/* Schedule Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-9 gap-1 mb-1">
            <div className="p-2 text-sm font-semibold text-gray-500">Time</div>
            {DAYS.map((day, idx) => (
              <div
                key={day}
                className={`p-2 text-center text-sm font-semibold rounded ${
                  idx === currentTime.day ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                }`}
              >
                {day.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Period Rows */}
          {PERIODS.map((period) => (
            <div key={period} className="grid grid-cols-9 gap-1 mb-1">
              {/* Time Column */}
              <div className={`p-2 text-xs ${
                period === currentTime.period ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-500'
              }`}>
                <div className="font-medium">Period {period}</div>
                <div>{PERIOD_TIMES[period].start}</div>
                <div className="text-gray-400">{PERIOD_TIMES[period].end}</div>
              </div>

              {/* Day Columns */}
              {DAYS.map((_, dayIndex) => {
                const slot = scheduleGrid[dayIndex]?.[period - 1];
                const isCurrentSlot = dayIndex === currentTime.day && period === currentTime.period;
                
                return (
                  <ScheduleCell
                    key={`${dayIndex}-${period}`}
                    slot={slot}
                    isCurrentSlot={isCurrentSlot}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-green-200 rounded" />
          <span className="text-gray-600">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border-2 border-blue-400 rounded" />
          <span className="text-gray-600">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-50 border border-red-200 rounded" />
          <span className="text-gray-600">Conflict</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-50 border border-gray-100 rounded" />
          <span className="text-gray-600">Free</span>
        </div>
      </div>
    </div>
  );
};

export default TeacherSchedule;
