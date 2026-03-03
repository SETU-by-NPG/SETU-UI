/**
 * SETU Education Management System - Feature 9: Attendance System
 * Attendance marking interface with grid view and reports
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Users,
  Download,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Search,
  Filter,
  CheckSquare,
  Save
} from 'lucide-react';
import { mockData } from '../../data';
import { usePermissions } from '../../context/permission-context';
import type { Student, ClassGrade, Attendance, Teacher } from '../../types';

// ==================== TYPES ====================

interface AttendanceSystemProps {
  classId?: string;
  teacherId?: string;
  className?: string;
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
type ViewMode = 'mark' | 'grid' | 'report';

interface StudentAttendance {
  student: Student;
  status: AttendanceStatus | null;
  remarks: string;
}

// ==================== CONSTANTS ====================

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; color: string; icon: React.ReactNode }> = {
  present: { 
    label: 'Present', 
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckCircle className="w-4 h-4" />
  },
  absent: { 
    label: 'Absent', 
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: <XCircle className="w-4 h-4" />
  },
  late: { 
    label: 'Late', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: <Clock className="w-4 h-4" />
  },
  excused: { 
    label: 'Excused', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <AlertTriangle className="w-4 h-4" />
  },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate date range for grid view
 */
const generateDateRange = (startDate: Date, days: number): Date[] => {
  const dates: Date[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - i);
    dates.unshift(date);
  }
  return dates;
};

/**
 * Format date for display
 */
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Calculate attendance percentage
 */
const calculateAttendancePercent = (studentId: string): number => {
  const records = mockData.attendance.filter((a: Attendance) => a.studentId === studentId);
  if (records.length === 0) return 100;
  
  const present = records.filter((a) => a.status === 'present' || a.status === 'excused').length;
  return Math.round((present / records.length) * 100);
};

// ==================== SUB-COMPONENTS ====================

/**
 * Attendance marking interface
 */
const AttendanceMarking: React.FC<{
  students: Student[];
  selectedDate: string;
  onSave: (attendance: Record<string, AttendanceStatus>) => void;
}> = ({ students, selectedDate, onSave }) => {
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave(attendance);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const allMarked = students.every((s) => attendance[s.id]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Mark Attendance</h3>
          <p className="text-sm text-gray-500">Date: {selectedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {Object.keys(attendance).length}/{students.length} marked
          </span>
          <button
            onClick={handleSave}
            disabled={!allMarked}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              allMarked 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            Save Attendance
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Attendance saved successfully!
        </div>
      )}

      {/* Student List */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Student Name</div>
          <div className="col-span-4">Status</div>
          <div className="col-span-3">Remarks</div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {students.map((student, index) => (
            <div key={student.id} className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-gray-50">
              <div className="col-span-1 text-gray-500">{index + 1}</div>
              <div className="col-span-4">
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-xs text-gray-500">{student.studentId}</p>
              </div>
              <div className="col-span-4 flex gap-1">
                {(Object.keys(STATUS_CONFIG) as AttendanceStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(student.id, status)}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      attendance[student.id] === status
                        ? STATUS_CONFIG[status].color
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {STATUS_CONFIG[status].label}
                  </button>
                ))}
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  placeholder="Add remarks..."
                  value={remarks[student.id] || ''}
                  onChange={(e) => setRemarks((prev) => ({ ...prev, [student.id]: e.target.value }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Attendance grid view
 */
const AttendanceGrid: React.FC<{
  students: Student[];
  classId: string;
}> = ({ students, classId }) => {
  const [dateOffset, setDateOffset] = useState(0);
  
  const dates = useMemo(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - dateOffset);
    return generateDateRange(endDate, 7);
  }, [dateOffset]);

  const getAttendanceForDate = (studentId: string, date: Date) => {
    const dateStr = formatDate(date);
    return mockData.attendance.find(
      (a: Attendance) => a.studentId === studentId && a.date === dateStr
    );
  };

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Attendance Grid</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDateOffset(dateOffset + 7)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600">
            {formatDate(dates[0])} to {formatDate(dates[dates.length - 1])}
          </span>
          <button
            onClick={() => setDateOffset(Math.max(0, dateOffset - 7))}
            disabled={dateOffset === 0}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left text-sm font-medium text-gray-700 border border-gray-200 sticky left-0 bg-gray-50">
                Student
              </th>
              {dates.map((date) => (
                <th 
                  key={date.toISOString()} 
                  className="p-2 text-center text-xs font-medium text-gray-700 border border-gray-200 min-w-[60px]"
                >
                  <div>{date.toLocaleDateString('en', { weekday: 'short' })}</div>
                  <div className="text-gray-500">{date.getDate()}</div>
                </th>
              ))}
              <th className="p-2 text-center text-sm font-medium text-gray-700 border border-gray-200">
                %
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const percent = calculateAttendancePercent(student.id);
              return (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="p-2 border border-gray-200 sticky left-0 bg-white">
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.studentId}</p>
                  </td>
                  {dates.map((date) => {
                    const record = getAttendanceForDate(student.id, date);
                    return (
                      <td key={date.toISOString()} className="p-2 border border-gray-200 text-center">
                        {record ? (
                          <div className={`inline-flex items-center justify-center w-6 h-6 rounded ${STATUS_CONFIG[record.status].color}`}>
                            {STATUS_CONFIG[record.status].icon}
                          </div>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="p-2 border border-gray-200 text-center">
                    <span className={`text-sm font-semibold ${
                      percent >= 90 ? 'text-green-600' : percent >= 75 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {percent}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Attendance reports
 */
const AttendanceReport: React.FC<{
  students: Student[];
  classId: string;
}> = ({ students, classId }) => {
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const avgAttendance = Math.round(
      students.reduce((sum, s) => sum + calculateAttendancePercent(s.id), 0) / totalStudents
    );
    
    const allRecords = mockData.attendance.filter((a: Attendance) =>
      students.some((s) => s.id === a.studentId)
    );
    
    const present = allRecords.filter((a) => a.status === 'present').length;
    const absent = allRecords.filter((a) => a.status === 'absent').length;
    const late = allRecords.filter((a) => a.status === 'late').length;
    const excused = allRecords.filter((a) => a.status === 'excused').length;
    const total = allRecords.length;
    
    return {
      totalStudents,
      avgAttendance,
      present,
      absent,
      late,
      excused,
      total,
      presentPercent: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  }, [students]);

  const handleExport = () => {
    console.log('[AttendanceSystem] Exporting attendance report...');
    alert('Attendance report exported! Check console for details.');
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
          <p className="text-sm text-gray-600">Total Students</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg text-center">
          <p className="text-3xl font-bold text-green-600">{stats.avgAttendance}%</p>
          <p className="text-sm text-gray-600">Avg Attendance</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg text-center">
          <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Records</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg text-center">
          <p className="text-3xl font-bold text-yellow-600">{stats.presentPercent}%</p>
          <p className="text-sm text-gray-600">Present Rate</p>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-4">Status Distribution</h4>
        <div className="space-y-3">
          {[
            { label: 'Present', count: stats.present, color: 'bg-green-500', total: stats.total },
            { label: 'Absent', count: stats.absent, color: 'bg-red-500', total: stats.total },
            { label: 'Late', count: stats.late, color: 'bg-yellow-500', total: stats.total },
            { label: 'Excused', count: stats.excused, color: 'bg-blue-500', total: stats.total },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span>{item.label}</span>
                <span>{item.count} ({item.total > 0 ? Math.round((item.count / item.total) * 100) : 0}%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all`}
                  style={{ width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Attendance Students */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-4">Students Below 75% Attendance</h4>
        <div className="space-y-2">
          {students
            .map((s) => ({ student: s, percent: calculateAttendancePercent(s.id) }))
            .filter((s) => s.percent < 75)
            .sort((a, b) => a.percent - b.percent)
            .map(({ student, percent }) => (
              <div key={student.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                <span className="font-medium">{student.name}</span>
                <span className={`font-bold ${percent < 60 ? 'text-red-600' : 'text-yellow-600'}`}>
                  {percent}%
                </span>
              </div>
            ))}
          {students.filter((s) => calculateAttendancePercent(s.id) < 75).length === 0 && (
            <p className="text-gray-500 text-center py-4">All students have good attendance!</p>
          )}
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Download className="w-5 h-5" />
        Export Attendance Report
      </button>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

/**
 * Attendance System Component
 * Complete attendance management with marking, grid view, and reports
 */
export const AttendanceSystem: React.FC<AttendanceSystemProps> = ({
  classId: initialClassId,
  teacherId,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('mark');
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId || '');
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const { hasPermission, currentRole } = usePermissions();

  // Get available classes for teacher
  const availableClasses = useMemo(() => {
    if (!teacherId) return mockData.classes;
    const teacher = mockData.teachers.find((t: Teacher) => t.id === teacherId);
    if (!teacher) return [];
    return mockData.classes.filter((c: ClassGrade) => teacher.classes.includes(c.id));
  }, [teacherId]);

  // Get students for selected class
  const students = useMemo(() => {
    if (!selectedClassId) return [];
    return mockData.students.filter((s: Student) => s.classId === selectedClassId);
  }, [selectedClassId]);

  // Console demonstration
  useEffect(() => {
    console.log('\n========== FEATURE 9: ATTENDANCE SYSTEM ==========\n');
    console.log(`[AttendanceSystem] Current Role: ${currentRole}`);
    console.log(`[AttendanceSystem] Selected Class: ${selectedClassId || 'None'}`);
    console.log(`[AttendanceSystem] Selected Date: ${selectedDate}`);
    console.log(`[AttendanceSystem] Students: ${students.length}`);
    console.log(`[AttendanceSystem] mark.attendance permission: ${hasPermission('mark.attendance')}`);
    console.log(`[AttendanceSystem] export.attendance permission: ${hasPermission('export.attendance')}`);
    console.log(`[AttendanceSystem] view.attendance.class permission: ${hasPermission('view.attendance.class')}`);
  }, [currentRole, selectedClassId, selectedDate, students.length, hasPermission]);

  // Handle saving attendance
  const handleSaveAttendance = (attendance: Record<string, AttendanceStatus>) => {
    console.log('[AttendanceSystem] Saving attendance:', attendance);
    // In real app, this would save to database
  };

  // Check permissions
  const canMarkAttendance = hasPermission('mark.attendance');
  const canViewAttendance = hasPermission('view.attendance.class') || hasPermission('view.attendance.all');
  const canExport = hasPermission('export.attendance');

  if (!canViewAttendance) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600">You don't have permission to view attendance.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Attendance System</h2>
            <p className="text-sm text-gray-500">
              {selectedClassId 
                ? `${students.length} students in ${mockData.classes.find((c: ClassGrade) => c.id === selectedClassId)?.name}`
                : 'Select a class'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-lg">
        {/* Class Selector */}
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Class...</option>
          {availableClasses.map((cls: ClassGrade) => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>

        {/* Date Selector (for marking) */}
        {viewMode === 'mark' && (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 ml-auto">
          {canMarkAttendance && (
            <button
              onClick={() => setViewMode('mark')}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                viewMode === 'mark' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Mark
            </button>
          )}
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              viewMode === 'grid' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('report')}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              viewMode === 'report' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Report
          </button>
        </div>
      </div>

      {/* Content */}
      {selectedClassId ? (
        <>
          {viewMode === 'mark' && canMarkAttendance && (
            <AttendanceMarking
              students={students}
              selectedDate={selectedDate}
              onSave={handleSaveAttendance}
            />
          )}
          
          {viewMode === 'grid' && (
            <AttendanceGrid students={students} classId={selectedClassId} />
          )}
          
          {viewMode === 'report' && (
            <AttendanceReport students={students} classId={selectedClassId} />
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Select a class to view attendance</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceSystem;
