/**
 * SETU Education Management System - Feature 5: Student Detail Access
 * Student detail view with role-based permission checks
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Calendar, 
  GraduationCap, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { mockData } from '../../data';
import { usePermissions } from '../../context/permission-context';
import type { Student, Attendance, Grade, ClassGrade, Parent, Teacher } from '../../types';

// ==================== TYPES ====================

interface StudentDetailProps {
  studentId: string;
  currentUserId?: string;
  parentChildrenIds?: string[]; // For parent role
  onBack?: () => void;
}

type TabType = 'overview' | 'contact' | 'attendance' | 'grades' | 'notes';

// ==================== SUB-COMPONENTS ====================

/**
 * Access denied component
 */
const AccessDenied: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
    <Lock className="w-12 h-12 text-red-400 mx-auto mb-3" />
    <h3 className="text-red-700 font-semibold mb-1">Access Denied</h3>
    <p className="text-red-600 text-sm">{message}</p>
  </div>
);

/**
 * Overview Tab Content
 */
const OverviewTab: React.FC<{ student: Student }> = ({ student }) => {
  const cls = mockData.classes.find((c: ClassGrade) => c.id === student.classId);
  const parent = student.parentId 
    ? mockData.parents.find((p: Parent) => p.id === student.parentId)
    : null;

  return (
    <div className="space-y-6">
      {/* Basic Info Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Admission Number</p>
            <p className="font-medium">{student.admissionNo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Class</p>
            <p className="font-medium">{cls?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Section</p>
            <p className="font-medium">{student.section || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Roll Number</p>
            <p className="font-medium">{student.rollNo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium capitalize">{student.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium">{student.dateOfBirth}</p>
          </div>
          {student.house && (
            <div>
              <p className="text-sm text-gray-500">House</p>
              <p className="font-medium">{student.house}</p>
            </div>
          )}
          {student.bloodGroup && (
            <div>
              <p className="text-sm text-gray-500">Blood Group</p>
              <p className="font-medium">{student.bloodGroup}</p>
            </div>
          )}
        </div>
      </div>

      {/* Parent Info */}
      {parent && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Parent/Guardian Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{parent.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Relationship</p>
              <p className="font-medium capitalize">{parent.relationship}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{parent.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{parent.email}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Occupation</p>
              <p className="font-medium">{parent.occupation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Academic Summary */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{student.gpa.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Current GPA</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{student.attendancePercent}%</p>
            <p className="text-sm text-gray-600">Attendance</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {mockData.grades.filter((g: Grade) => g.studentId === student.id).length}
            </p>
            <p className="text-sm text-gray-600">Grades Recorded</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {mockData.attendance.filter((a: Attendance) => a.studentId === student.id).length}
            </p>
            <p className="text-sm text-gray-600">Attendance Entries</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Contact Tab Content
 */
const ContactTab: React.FC<{ student: Student }> = ({ student }) => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{student.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{student.phone}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium">{student.address}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-sm text-gray-500">Contact Person</p>
            <p className="font-medium">{student.emergencyContact}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-sm text-gray-500">Emergency Phone</p>
            <p className="font-medium">{student.emergencyPhone}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Attendance Tab Content
 */
const AttendanceTab: React.FC<{ student: Student }> = ({ student }) => {
  const attendanceRecords = useMemo(() => 
    mockData.attendance
      .filter((a: Attendance) => a.studentId === student.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20),
    [student.id]
  );

  const stats = useMemo(() => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter((a) => a.status === 'present').length;
    const absent = attendanceRecords.filter((a) => a.status === 'absent').length;
    const late = attendanceRecords.filter((a) => a.status === 'late').length;
    const excused = attendanceRecords.filter((a) => a.status === 'excused').length;
    return { total, present, absent, late, excused };
  }, [attendanceRecords]);

  const getStatusIcon = (status: Attendance['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'late':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'excused':
        return <AlertTriangle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusClass = (status: Attendance['status']) => {
    switch (status) {
      case 'present':
        return 'bg-green-50 text-green-700';
      case 'absent':
        return 'bg-red-50 text-red-700';
      case 'late':
        return 'bg-yellow-50 text-yellow-700';
      case 'excused':
        return 'bg-blue-50 text-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Attendance Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{stats.present}</p>
          <p className="text-xs text-gray-600">Present</p>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
          <p className="text-xs text-gray-600">Absent</p>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
          <p className="text-xs text-gray-600">Late</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{stats.excused}</p>
          <p className="text-xs text-gray-600">Excused</p>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Attendance</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {attendanceRecords.map((record) => (
            <div key={record.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(record.status)}
                <div>
                  <p className="font-medium">{record.date}</p>
                  {record.remarks && (
                    <p className="text-sm text-gray-500">{record.remarks}</p>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(record.status)}`}>
                {record.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Grades Tab Content
 */
const GradesTab: React.FC<{ student: Student }> = ({ student }) => {
  const grades = useMemo(() => 
    mockData.grades
      .filter((g: Grade) => g.studentId === student.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [student.id]
  );

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Academic Grades</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {grades.map((grade) => {
            const subject = mockData.subjects.find((s) => s.id === grade.subjectId);
            return (
              <div key={grade.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{subject?.name || 'Unknown Subject'}</p>
                    <p className="text-sm text-gray-500">{grade.term}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {grade.marks}/{grade.maxMarks}
                      </p>
                      <p className="text-xs text-gray-400">{grade.percentage}%</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(grade.grade)}`}>
                      {grade.grade}
                    </span>
                  </div>
                </div>
                {grade.remarks && (
                  <p className="mt-2 text-sm text-gray-500">{grade.remarks}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Notes Tab Content (Admin/Teacher only)
 */
const NotesTab: React.FC<{ student: Student }> = ({ student }) => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavioral Notes</h3>
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Example Note</p>
              <p className="text-sm text-yellow-700 mt-1">
                This section is for behavioral notes, disciplinary actions, and teacher observations.
                Only administrators and teachers with proper permissions can view and edit this section.
              </p>
              <p className="text-xs text-yellow-600 mt-2">Added by: Admin • 2026-02-28</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-500 text-sm">
            No additional notes for this student.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// ==================== MAIN COMPONENT ====================

/**
 * Student Detail Component
 * Shows student information with permission-based access control
 */
export const StudentDetail: React.FC<StudentDetailProps> = ({
  studentId,
  currentUserId,
  parentChildrenIds = [],
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { hasPermission, currentRole } = usePermissions();

  // Find student
  const student = useMemo(() => 
    mockData.students.find((s: Student) => s.id === studentId),
    [studentId]
  );

  // Determine access permissions
  const isOwnRecord = currentUserId === studentId;
  const isOwnChild = parentChildrenIds.includes(studentId);

  // Check section permissions
  const canViewFull = hasPermission('view.student.full', { isOwnRecord, isOwnChildRecord: isOwnChild });
  const canViewContact = hasPermission('view.student.contact', { isOwnRecord, isOwnChildRecord: isOwnChild });
  const canViewAttendance = hasPermission('view.student.attendance', { isOwnRecord, isOwnChildRecord: isOwnChild });
  const canViewGrades = hasPermission('view.student.grades', { isOwnRecord, isOwnChildRecord: isOwnChild });
  const canViewNotes = hasPermission('view.student.notes');

  // Console demonstration
  useEffect(() => {
    console.log('\n========== FEATURE 5: STUDENT DETAIL ACCESS ==========\n');
    console.log(`[StudentDetail] Student: ${student?.name || 'Not Found'} (${studentId})`);
    console.log(`[StudentDetail] Current Role: ${currentRole}`);
    console.log(`[StudentDetail] Is Own Record: ${isOwnRecord}`);
    console.log(`[StudentDetail] Is Own Child: ${isOwnChild}`);
    console.log(`[StudentDetail] Permissions:`);
    console.log(`  → view.student.full: ${canViewFull}`);
    console.log(`  → view.student.contact: ${canViewContact}`);
    console.log(`  → view.student.attendance: ${canViewAttendance}`);
    console.log(`  → view.student.grades: ${canViewGrades}`);
    console.log(`  → view.student.notes: ${canViewNotes}`);
  }, [student, studentId, currentRole, isOwnRecord, isOwnChild, canViewFull, canViewContact, canViewAttendance, canViewGrades, canViewNotes]);

  // Tab configuration with permission checks
  const tabs: { id: TabType; label: string; icon: React.ReactNode; permission: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" />, permission: canViewFull },
    { id: 'contact', label: 'Contact', icon: <Phone className="w-4 h-4" />, permission: canViewContact },
    { id: 'attendance', label: 'Attendance', icon: <Calendar className="w-4 h-4" />, permission: canViewAttendance },
    { id: 'grades', label: 'Grades', icon: <GraduationCap className="w-4 h-4" />, permission: canViewGrades },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" />, permission: canViewNotes },
  ];

  const availableTabs = tabs.filter((t) => t.permission);

  if (!student) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-gray-500">Student not found</p>
      </div>
    );
  }

  if (!canViewFull) {
    return <AccessDenied message="You don't have permission to view this student's details." />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab student={student} />;
      case 'contact':
        return canViewContact ? <ContactTab student={student} /> : <AccessDenied message="Contact information is restricted." />;
      case 'attendance':
        return canViewAttendance ? <AttendanceTab student={student} /> : <AccessDenied message="Attendance records are restricted." />;
      case 'grades':
        return canViewGrades ? <GradesTab student={student} /> : <AccessDenied message="Grade information is restricted." />;
      case 'notes':
        return canViewNotes ? <NotesTab student={student} /> : <AccessDenied message="Behavioral notes are restricted to staff only." />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Back
            </button>
          )}
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-gray-500">{student.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                {student.studentId}
              </span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                student.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {student.status}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold text-gray-900">{student.gpa.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500">Current GPA</p>
        </div>
      </div>

      {/* Tabs */}
      {availableTabs.length > 0 ? (
        <>
          <div className="border-b border-gray-200">
            <nav className="flex gap-1">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {renderTabContent()}
          </div>
        </>
      ) : (
        <AccessDenied message="You don't have permission to view any student details." />
      )}
    </div>
  );
};

export default StudentDetail;
