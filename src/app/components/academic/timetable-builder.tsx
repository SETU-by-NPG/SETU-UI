/**
 * SETU Education Management System - Feature 11: Timetable Builder
 * Admin interface for building and managing school-wide timetables
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  BookOpen,
  DoorOpen,
  User,
  X,
  Save,
  Filter,
  Search,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { mockData } from '../../data';
import { usePermissions } from '../../context/permission-context';
import type { 
  TimetableEntry, 
  ClassGrade, 
  Subject, 
  Teacher,
  SchedulePeriod
} from '../../types';

// ==================== TYPES ====================

interface TimetableBuilderProps {
  className?: string;
}

interface Conflict {
  type: 'teacher' | 'room' | 'class';
  message: string;
  entries: TimetableEntry[];
}

interface NewEntryForm {
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number;
  period: number;
  room: string;
}

// ==================== CONSTANTS ====================

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

// ==================== HELPER FUNCTIONS ====================

const getClassColor = (classId: string): string => {
  const colors = [
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-green-100 text-green-700 border-green-200',
    'bg-purple-100 text-purple-700 border-purple-200',
    'bg-orange-100 text-orange-700 border-orange-200',
    'bg-pink-100 text-pink-700 border-pink-200',
    'bg-teal-100 text-teal-700 border-teal-200',
  ];
  let hash = 0;
  for (let i = 0; i < classId.length; i++) {
    hash = classId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// ==================== SUB-COMPONENTS ====================

/**
 * Entry Modal for creating/editing timetable entries
 */
const EntryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: NewEntryForm) => void;
  initialData?: Partial<NewEntryForm>;
}> = ({ isOpen, onClose, onSave, initialData }) => {
  const [form, setForm] = useState<NewEntryForm>({
    classId: '',
    subjectId: '',
    teacherId: '',
    dayOfWeek: 1,
    period: 1,
    room: '',
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Add Timetable Entry</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={form.classId}
                onChange={(e) => setForm({ ...form, classId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Class</option>
                {mockData.classes.map((c: ClassGrade) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Subject</option>
                {mockData.subjects.map((s: Subject) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
            <select
              value={form.teacherId}
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Teacher</option>
              {mockData.teachers.map((t: Teacher) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <select
                value={form.dayOfWeek}
                onChange={(e) => setForm({ ...form, dayOfWeek: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {DAYS.slice(1, 6).map((day, idx) => (
                  <option key={idx + 1} value={idx + 1}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <select
                value={form.period}
                onChange={(e) => setForm({ ...form, period: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {PERIODS.map((p) => (
                  <option key={p} value={p}>Period {p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
              <input
                type="text"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 101"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Conflict Alert Component
 */
const ConflictAlert: React.FC<{
  conflicts: Conflict[];
}> = ({ conflicts }) => {
  if (conflicts.length === 0) return null;

  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h4 className="font-semibold text-red-700">Schedule Conflicts Detected</h4>
      </div>
      <ul className="space-y-1">
        {conflicts.map((conflict, idx) => (
          <li key={idx} className="text-sm text-red-600">
            • {conflict.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

/**
 * Timetable Builder Component
 * Admin interface for managing school-wide timetables
 */
export const TimetableBuilder: React.FC<TimetableBuilderProps> = ({
  className = '',
}) => {
  const [entries, setEntries] = useState<TimetableEntry[]>(mockData.timetable);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { hasPermission, currentRole } = usePermissions();

  // Check permissions
  const canEdit = hasPermission('admin.timetable');

  // Filter entries by class
  const filteredEntries = useMemo(() => {
    if (selectedClass === 'all') return entries;
    return entries.filter((e) => e.classId === selectedClass);
  }, [entries, selectedClass]);

  // Detect conflicts
  const detectConflicts = useMemo(() => {
    const newConflicts: Conflict[] = [];
    
    // Check teacher conflicts
    const teacherSlots = new Map<string, TimetableEntry[]>();
    entries.forEach((entry) => {
      const key = `${entry.teacherId}-${entry.dayOfWeek}-${entry.period}`;
      if (!teacherSlots.has(key)) teacherSlots.set(key, []);
      teacherSlots.get(key)!.push(entry);
    });
    
    teacherSlots.forEach((conflictEntries, key) => {
      if (conflictEntries.length > 1) {
        const teacher = mockData.teachers.find((t: Teacher) => t.id === conflictEntries[0].teacherId);
        newConflicts.push({
          type: 'teacher',
          message: `${teacher?.name} is scheduled for multiple classes at the same time (${DAYS[conflictEntries[0].dayOfWeek]}, Period ${conflictEntries[0].period})`,
          entries: conflictEntries,
        });
      }
    });

    // Check room conflicts
    const roomSlots = new Map<string, TimetableEntry[]>();
    entries.forEach((entry) => {
      const key = `${entry.room}-${entry.dayOfWeek}-${entry.period}`;
      if (!roomSlots.has(key)) roomSlots.set(key, []);
      roomSlots.get(key)!.push(entry);
    });
    
    roomSlots.forEach((conflictEntries, key) => {
      if (conflictEntries.length > 1) {
        newConflicts.push({
          type: 'room',
          message: `Room ${conflictEntries[0].room} has multiple classes scheduled (${DAYS[conflictEntries[0].dayOfWeek]}, Period ${conflictEntries[0].period})`,
          entries: conflictEntries,
        });
      }
    });

    // Check class conflicts
    const classSlots = new Map<string, TimetableEntry[]>();
    entries.forEach((entry) => {
      const key = `${entry.classId}-${entry.dayOfWeek}-${entry.period}`;
      if (!classSlots.has(key)) classSlots.set(key, []);
      classSlots.get(key)!.push(entry);
    });
    
    classSlots.forEach((conflictEntries, key) => {
      if (conflictEntries.length > 1) {
        const cls = mockData.classes.find((c: ClassGrade) => c.id === conflictEntries[0].classId);
        newConflicts.push({
          type: 'class',
          message: `${cls?.name} has multiple subjects scheduled at the same time (${DAYS[conflictEntries[0].dayOfWeek]}, Period ${conflictEntries[0].period})`,
          entries: conflictEntries,
        });
      }
    });

    return newConflicts;
  }, [entries]);

  useEffect(() => {
    setConflicts(detectConflicts);
  }, [detectConflicts]);

  // Handle adding new entry
  const handleAddEntry = (newEntry: NewEntryForm) => {
    const entry: TimetableEntry = {
      id: `tt-${Date.now()}`,
      ...newEntry,
      startTime: `${8 + newEntry.period}:00`,
      endTime: `${9 + newEntry.period}:00`,
      academicYear: '2024-2025',
    };
    setEntries((prev) => [...prev, entry]);
    console.log('[TimetableBuilder] Added entry:', entry);
  };

  // Handle deleting entry
  const handleDeleteEntry = (entryId: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
    console.log('[TimetableBuilder] Deleted entry:', entryId);
  };

  // Get entry for a specific slot
  const getEntryForSlot = (classId: string, day: number, period: number) => {
    return entries.find(
      (e) => e.classId === classId && e.dayOfWeek === day && e.period === period
    );
  };

  // Get entry details
  const getEntryDetails = (entry: TimetableEntry) => {
    const subject = mockData.subjects.find((s: Subject) => s.id === entry.subjectId);
    const teacher = mockData.teachers.find((t: Teacher) => t.id === entry.teacherId);
    return { subject, teacher };
  };

  // Console demonstration
  useEffect(() => {
    console.log('\n========== FEATURE 11: TIMETABLE BUILDER ==========\n');
    console.log(`[TimetableBuilder] Current Role: ${currentRole}`);
    console.log(`[TimetableBuilder] Total Entries: ${entries.length}`);
    console.log(`[TimetableBuilder] Conflicts: ${conflicts.length}`);
    console.log(`[TimetableBuilder] admin.timetable permission: ${canEdit}`);
    console.log(`[TimetableBuilder] Classes: ${mockData.classes.length}`);
    
    if (conflicts.length > 0) {
      console.log('\n[Conflicts detected]:');
      conflicts.forEach((c) => console.log(`  - ${c.message}`));
    }
  }, [currentRole, entries.length, conflicts, canEdit]);

  if (!canEdit) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600">You don't have permission to access the timetable builder.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Timetable Builder</h2>
            <p className="text-sm text-gray-500">
              {entries.length} entries • {conflicts.length > 0 && (
                <span className="text-red-500">{conflicts.length} conflicts</span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Conflict Alerts */}
      <ConflictAlert conflicts={conflicts} />

      {/* Filters */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">Filter:</span>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All Classes</option>
          {mockData.classes.map((c: ClassGrade) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left text-sm font-medium text-gray-700 border border-gray-200 sticky left-0 bg-gray-50 min-w-[120px]">
                  Class / Period
                </th>
                {DAYS.slice(1, 6).map((day) => (
                  <th key={day} className="p-2 text-center text-sm font-medium text-gray-700 border border-gray-200 min-w-[150px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockData.classes
                .filter((c: ClassGrade) => selectedClass === 'all' || c.id === selectedClass)
                .map((cls: ClassGrade) => (
                  <React.Fragment key={cls.id}>
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="p-2 text-sm font-semibold text-gray-700 border border-gray-200">
                        {cls.name}
                      </td>
                    </tr>
                    {PERIODS.map((period) => (
                      <tr key={`${cls.id}-${period}`} className="hover:bg-gray-50">
                        <td className="p-2 text-sm text-gray-600 border border-gray-200 sticky left-0 bg-white">
                          Period {period}
                        </td>
                        {[1, 2, 3, 4, 5].map((day) => {
                          const entry = getEntryForSlot(cls.id, day, period);
                          if (!entry) {
                            return (
                              <td key={day} className="p-2 border border-gray-200 bg-gray-50/50">
                                <button
                                  onClick={() => {
                                    setIsModalOpen(true);
                                  }}
                                  className="w-full h-12 flex items-center justify-center text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </td>
                            );
                          }
                          const { subject, teacher } = getEntryDetails(entry);
                          const hasConflict = conflicts.some(
                            (c) => c.entries.some((e) => e.id === entry.id)
                          );
                          return (
                            <td key={day} className="p-1 border border-gray-200">
                              <div className={`p-2 rounded text-xs relative group ${getClassColor(cls.id)} ${hasConflict ? 'ring-2 ring-red-400' : ''}`}>
                                <div className="font-medium">{subject?.name}</div>
                                <div className="opacity-75">{teacher?.name}</div>
                                <div className="opacity-60">Room {entry.room}</div>
                                <button
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
                                >
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                </button>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {filteredEntries.map((entry) => {
            const { subject, teacher } = getEntryDetails(entry);
            const cls = mockData.classes.find((c: ClassGrade) => c.id === entry.classId);
            const hasConflict = conflicts.some((c) => c.entries.some((e) => e.id === entry.id));
            
            return (
              <div
                key={entry.id}
                className={`p-3 bg-white rounded-lg border flex items-center justify-between ${
                  hasConflict ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-12 rounded-full ${hasConflict ? 'bg-red-400' : 'bg-green-400'}`} />
                  <div>
                    <div className="font-medium text-gray-900">
                      {cls?.name} • {subject?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {teacher?.name}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{DAYS[entry.dayOfWeek]}, Period {entry.period}</span>
                      <span className="mx-2">•</span>
                      <span>Room {entry.room}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          {filteredEntries.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No timetable entries found</p>
            </div>
          )}
        </div>
      )}

      {/* Entry Modal */}
      <EntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddEntry}
      />
    </div>
  );
};

export default TimetableBuilder;
