/**
 * SETU Education Management System - Feature 12: Timetable Teacher Edit
 * Allow teachers to add notes about students in their periods
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  User, 
  Clock,
  BookOpen,
  DoorOpen,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { mockData } from '../../data';
import { usePermissions } from '../../context/permission-context';
import type { 
  TimetableEntry, 
  Student, 
  ClassGrade, 
  Subject,
  Teacher
} from '../../types';

// ==================== TYPES ====================

interface TimetableTeacherEditProps {
  teacherId?: string;
  className?: string;
}

interface StudentNote {
  studentId: string;
  note: string;
  behavior?: 'excellent' | 'good' | 'average' | 'needs_improvement' | 'poor';
  participation?: 'active' | 'moderate' | 'passive';
}

interface PeriodNotes {
  timetableEntryId: string;
  classNotes: string;
  studentNotes: StudentNote[];
  date: string;
}

// ==================== CONSTANTS ====================

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

const BEHAVIOR_OPTIONS = [
  { value: 'excellent', label: 'Excellent', color: 'bg-green-100 text-green-700' },
  { value: 'good', label: 'Good', color: 'bg-blue-100 text-blue-700' },
  { value: 'average', label: 'Average', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'needs_improvement', label: 'Needs Improvement', color: 'bg-orange-100 text-orange-700' },
  { value: 'poor', label: 'Poor', color: 'bg-red-100 text-red-700' },
];

const PARTICIPATION_OPTIONS = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-700' },
  { value: 'moderate', label: 'Moderate', color: 'bg-blue-100 text-blue-700' },
  { value: 'passive', label: 'Passive', color: 'bg-gray-100 text-gray-700' },
];

// ==================== SUB-COMPONENTS ====================

/**
 * Notes Editor Modal
 */
const NotesEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: PeriodNotes) => void;
  entry: TimetableEntry | null;
  students: Student[];
  initialNotes?: PeriodNotes;
}> = ({ isOpen, onClose, onSave, entry, students, initialNotes }) => {
  const [classNotes, setClassNotes] = useState(initialNotes?.classNotes || '');
  const [studentNotes, setStudentNotes] = useState<Record<string, StudentNote>>(
    initialNotes?.studentNotes.reduce((acc, note) => ({ ...acc, [note.studentId]: note }), {}) || {}
  );
  const [saved, setSaved] = useState(false);

  if (!isOpen || !entry) return null;

  const subject = mockData.subjects.find((s: Subject) => s.id === entry.subjectId);
  const cls = mockData.classes.find((c: ClassGrade) => c.id === entry.classId);

  const handleSave = () => {
    const notes: PeriodNotes = {
      timetableEntryId: entry.id,
      classNotes,
      studentNotes: Object.values(studentNotes),
      date: new Date().toISOString(),
    };
    onSave(notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateStudentNote = (studentId: string, updates: Partial<StudentNote>) => {
    setStudentNotes((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        studentId,
        ...updates,
      },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold">Period Notes</h3>
            <p className="text-sm text-gray-500">
              {cls?.name} • {subject?.name} • {DAYS[entry.dayOfWeek]}, Period {entry.period}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                Saved
              </span>
            )}
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Class Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class Notes
            </label>
            <textarea
              value={classNotes}
              onChange={(e) => setClassNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="General notes about the class, lesson progress, observations..."
            />
          </div>

          {/* Student Notes */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Student Notes</h4>
            <div className="space-y-3">
              {students.map((student) => {
                const note = studentNotes[student.id];
                return (
                  <div key={student.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{student.name}</span>
                        <span className="text-sm text-gray-500">({student.studentId})</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mb-2">
                      <select
                        value={note?.behavior || ''}
                        onChange={(e) => updateStudentNote(student.id, { behavior: e.target.value as any })}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="">Behavior...</option>
                        {BEHAVIOR_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      
                      <select
                        value={note?.participation || ''}
                        onChange={(e) => updateStudentNote(student.id, { participation: e.target.value as any })}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="">Participation...</option>
                        {PARTICIPATION_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <textarea
                      value={note?.note || ''}
                      onChange={(e) => updateStudentNote(student.id, { note: e.target.value })}
                      rows={2}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      placeholder="Individual notes about this student..."
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

/**
 * Timetable Teacher Edit Component
 * Allows teachers to add notes about students in their periods
 */
export const TimetableTeacherEdit: React.FC<TimetableTeacherEditProps> = ({
  teacherId: propTeacherId,
  className = '',
}) => {
  const [selectedDay, setSelectedDay] = useState(1); // Monday
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedNotes, setSavedNotes] = useState<Record<string, PeriodNotes>>({});
  
  const { hasPermission, currentRole, currentUserId } = usePermissions();

  // Determine teacher ID
  const teacherId = propTeacherId || (currentRole === 'teacher' ? currentUserId : undefined);

  // Check permissions
  const canEditNotes = hasPermission('edit.timetable.student');

  // Get teacher's timetable entries
  const teacherEntries = useMemo(() => {
    if (!teacherId) return [];
    return mockData.timetable.filter((e: TimetableEntry) => e.teacherId === teacherId);
  }, [teacherId]);

  // Get entries for selected day
  const dayEntries = useMemo(() => {
    return teacherEntries
      .filter((e: TimetableEntry) => e.dayOfWeek === selectedDay)
      .sort((a: TimetableEntry, b: TimetableEntry) => a.period - b.period);
  }, [teacherEntries, selectedDay]);

  // Get teacher info
  const teacher = useMemo(() => {
    if (!teacherId) return null;
    return mockData.teachers.find((t: Teacher) => t.id === teacherId);
  }, [teacherId]);

  // Get students for a class
  const getStudentsForClass = (classId: string): Student[] => {
    return mockData.students.filter((s: Student) => s.classId === classId);
  };

  // Handle opening notes editor
  const handleEditNotes = (entry: TimetableEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  // Handle saving notes
  const handleSaveNotes = (notes: PeriodNotes) => {
    setSavedNotes((prev) => ({
      ...prev,
      [notes.timetableEntryId]: notes,
    }));
    console.log('[TimetableTeacherEdit] Saved notes:', notes);
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  // Console demonstration
  useEffect(() => {
    console.log('\n========== FEATURE 12: TIMETABLE TEACHER EDIT ==========\n');
    console.log(`[TimetableTeacherEdit] Current Role: ${currentRole}`);
    console.log(`[TimetableTeacherEdit] Teacher ID: ${teacherId}`);
    console.log(`[TimetableTeacherEdit] Teacher: ${teacher?.name}`);
    console.log(`[TimetableTeacherEdit] Total Entries: ${teacherEntries.length}`);
    console.log(`[TimetableTeacherEdit] edit.timetable.student permission: ${canEditNotes}`);
    console.log(`[TimetableTeacherEdit] Saved notes: ${Object.keys(savedNotes).length}`);
  }, [currentRole, teacherId, teacher?.name, teacherEntries.length, canEditNotes, savedNotes]);

  if (!teacherId) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
        <p className="text-yellow-600">No teacher selected.</p>
      </div>
    );
  }

  if (!canEditNotes) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600">You don't have permission to edit timetable notes.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">My Timetable & Notes</h2>
            <p className="text-sm text-gray-500">
              {teacher?.name} • {teacherEntries.length} periods • {Object.keys(savedNotes).length} with notes
            </p>
          </div>
        </div>
      </div>

      {/* Day Navigation */}
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
        <button
          onClick={() => setSelectedDay((prev) => (prev > 1 ? prev - 1 : 5))}
          className="p-2 hover:bg-gray-200 rounded-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                selectedDay === day
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {DAYS[day]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSelectedDay((prev) => (prev < 5 ? prev + 1 : 1))}
          className="p-2 hover:bg-gray-200 rounded-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Periods List */}
      <div className="space-y-3">
        {dayEntries.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No classes scheduled for {DAYS[selectedDay]}</p>
          </div>
        ) : (
          dayEntries.map((entry) => {
            const subject = mockData.subjects.find((s: Subject) => s.id === entry.subjectId);
            const cls = mockData.classes.find((c: ClassGrade) => c.id === entry.classId);
            const hasNotes = savedNotes[entry.id];
            const studentCount = getStudentsForClass(entry.classId).length;

            return (
              <div
                key={entry.id}
                className={`p-4 bg-white rounded-lg border transition-all hover:shadow-md ${
                  hasNotes ? 'border-green-300 bg-green-50/30' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">Period {entry.period}</span>
                        <span className="text-sm text-gray-500">
                          {entry.startTime} - {entry.endTime}
                        </span>
                        {hasNotes && (
                          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Notes saved
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {subject?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {cls?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <DoorOpen className="w-4 h-4" />
                          Room {entry.room}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {studentCount} students
                        </span>
                      </div>
                      {hasNotes && hasNotes.classNotes && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          "{hasNotes.classNotes.substring(0, 100)}
                          {hasNotes.classNotes.length > 100 ? '...' : ''}"
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditNotes(entry)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    {hasNotes ? 'Edit Notes' : 'Add Notes'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Notes Editor Modal */}
      <NotesEditorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEntry(null);
        }}
        onSave={handleSaveNotes}
        entry={selectedEntry}
        students={selectedEntry ? getStudentsForClass(selectedEntry.classId) : []}
        initialNotes={selectedEntry ? savedNotes[selectedEntry.id] : undefined}
      />
    </div>
  );
};

export default TimetableTeacherEdit;
