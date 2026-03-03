/**
 * SETU Education Management System - Academic Features Demo Page
 * Comprehensive demonstration of Features 7-14
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  BookOpen,
  CheckSquare,
  GraduationCap,
  User,
  ArrowLeft,
  Play,
  CheckCircle,
  AlertCircle,
  Layout,
  Edit3,
  BarChart3,
  FileText
} from 'lucide-react';
import {
  TeacherSchedule,
  SubjectManagement,
  AttendanceSystem,
  AssignmentGradebook,
  TimetableBuilder,
  TimetableTeacherEdit,
  TeacherReports,
  StudentReports
} from '../components/academic';
import { PermissionProvider, usePermissions } from '../context/permission-context';
import { mockData } from '../data';
import type { Role } from '../types';

// ==================== ROLE SWITCHER COMPONENT ====================

/**
 * Role switcher for demo purposes
 */
const RoleSwitcher: React.FC<{
  currentRole: Role;
  onRoleChange: (role: Role, userId: string) => void;
}> = ({ currentRole, onRoleChange }) => {
  const roles: { role: Role; label: string; userId: string }[] = [
    { role: 'admin', label: 'Administrator', userId: 'admin-001' },
    { role: 'teacher', label: 'Teacher (Sarah Johnson)', userId: 'teacher-001' },
    { role: 'student', label: 'Student (Emma Wilson)', userId: 'student-001' },
    { role: 'parent', label: 'Parent (Robert Wilson)', userId: 'parent-001' },
    { role: 'librarian', label: 'Librarian', userId: 'librarian-001' },
  ];

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <User className="w-4 h-4" />
        Switch Role (Demo Only)
      </h3>
      <div className="flex flex-wrap gap-2">
        {roles.map(({ role, label, userId }) => (
          <button
            key={role}
            onClick={() => onRoleChange(role, userId)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              currentRole === role
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Current: {currentRole} (ID: {roles.find(r => r.role === currentRole)?.userId})
      </p>
    </div>
  );
};

// ==================== FEATURE CARD COMPONENT ====================

/**
 * Feature demonstration card
 */
const FeatureCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  feature: 'schedule' | 'subjects' | 'attendance' | 'gradebook' | 'timetable-builder' | 'timetable-edit' | 'teacher-reports' | 'student-reports';
  isActive: boolean;
  onClick: () => void;
  status: 'implemented' | 'pending';
}> = ({ title, icon, isActive, onClick, status }) => (
  <button
    onClick={onClick}
    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
      isActive
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 hover:border-gray-300 bg-white'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2 mt-1">
          {status === 'implemented' ? (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle className="w-3 h-3" />
              Implemented
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-yellow-600">
              <AlertCircle className="w-3 h-3" />
              Pending
            </span>
          )}
        </div>
      </div>
    </div>
  </button>
);

// ==================== CONSOLE DEMO COMPONENT ====================

/**
 * Console demo instructions
 */
const ConsoleDemo: React.FC<{
  feature: 'schedule' | 'subjects' | 'attendance' | 'gradebook' | 'timetable-builder' | 'timetable-edit' | 'teacher-reports' | 'student-reports';
}> = ({ feature }) => {
  const demos: Record<string, { title: string; steps: string[] }> = {
    schedule: {
      title: 'Feature 7: Teacher Schedule View',
      steps: [
        'View weekly schedule with classes, subjects, rooms, and timings',
        'Current period is highlighted automatically',
        'Schedule conflicts are detected and displayed',
        'Works for both teachers (own schedule) and admins (all schedules)',
      ],
    },
    subjects: {
      title: 'Feature 8: Subject Management',
      steps: [
        'Browse subjects with department filters',
        'View Head of Subject designation',
        'Expand subjects to see curriculum, textbooks, learning objectives',
        'Heads can edit their subjects (permission-based)',
      ],
    },
    attendance: {
      title: 'Feature 9: Attendance System',
      steps: [
        'Mark attendance for a class and date',
        'View attendance grid (date x students)',
        'See attendance reports and statistics',
        'Export attendance data',
      ],
    },
    gradebook: {
      title: 'Feature 10: Assignment & Gradebook',
      steps: [
        'Create and manage assignments',
        'Track student submissions',
        'Enter grades with feedback',
        'View gradebook with overall grades',
      ],
    },
    'timetable-builder': {
      title: 'Feature 11: Timetable Builder',
      steps: [
        'Admin interface for building school timetable',
        'Add entries with class, subject, teacher, room, time',
        'Conflict detection for teacher/room/time overlaps',
        'View entire school timetable in grid or list view',
      ],
    },
    'timetable-edit': {
      title: 'Feature 12: Timetable Teacher Edit',
      steps: [
        'Teachers view their own timetable',
        'Add notes about students during their periods',
        'Track behavior, participation, and remarks',
        'Permission-based editing (edit.timetable.student)',
      ],
    },
    'teacher-reports': {
      title: 'Feature 13: Teacher Reports',
      steps: [
        'Class performance summaries',
        'Attendance trends visualization',
        'Subject-wise grade distributions',
        'Exportable reports for teachers',
      ],
    },
    'student-reports': {
      title: 'Feature 14: Student Reports',
      steps: [
        'Student progress reports with grade cards',
        'Term-wise GPA calculation',
        'Attendance summaries with trends',
        'Teacher remarks and recommendations',
      ],
    },
  };

  const demo = demos[feature];

  return (
    <div className="p-4 bg-gray-900 text-gray-100 rounded-lg font-mono text-sm">
      <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2">
        <Play className="w-4 h-4" />
        {demo.title}
      </h4>
      <ul className="space-y-1">
        {demo.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-gray-500">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400">
        Open browser console (F12) to see detailed permission and data logs
      </div>
    </div>
  );
};

// ==================== MAIN DEMO PAGE ====================

/**
 * Academic Features Demo Page
 * Demonstrates Features 7-10 with role switching
 */
const AcademicFeaturesDemoContent: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<'schedule' | 'subjects' | 'attendance' | 'gradebook' | 'timetable-builder' | 'timetable-edit' | 'teacher-reports' | 'student-reports'>('schedule');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('teacher-001');
  const [selectedClassId, setSelectedClassId] = useState<string>('class-001');
  
  const { currentRole, currentUserId, setCurrentUser } = usePermissions();

  // Update selected IDs based on role
  useEffect(() => {
    if (currentRole === 'teacher') {
      setSelectedTeacherId(currentUserId);
      const teacher = mockData.teachers.find((t) => t.id === currentUserId);
      if (teacher && teacher.classes.length > 0) {
        setSelectedClassId(teacher.classes[0]);
      }
    } else if (currentRole === 'student') {
      const student = mockData.students.find((s) => s.id === currentUserId);
      if (student) {
        setSelectedClassId(student.classId);
      }
    }
  }, [currentRole, currentUserId]);

  const handleRoleChange = (role: Role, userId: string) => {
    setCurrentUser(userId, role);
  };

  const features = [
    { 
      id: 'schedule' as const, 
      title: 'Teacher Schedule', 
      icon: <Calendar className="w-5 h-5" />,
      status: 'implemented' as const,
    },
    { 
      id: 'subjects' as const, 
      title: 'Subject Management', 
      icon: <BookOpen className="w-5 h-5" />,
      status: 'implemented' as const,
    },
    { 
      id: 'attendance' as const, 
      title: 'Attendance System', 
      icon: <CheckSquare className="w-5 h-5" />,
      status: 'implemented' as const,
    },
    { 
      id: 'gradebook' as const, 
      title: 'Assignment & Gradebook', 
      icon: <GraduationCap className="w-5 h-5" />,
      status: 'implemented' as const,
    },
    { 
      id: 'timetable-builder' as const, 
      title: 'Timetable Builder', 
      icon: <Layout className="w-5 h-5" />,
      status: 'implemented' as const,
    },
    { 
      id: 'timetable-edit' as const, 
      title: 'Timetable Edit', 
      icon: <Edit3 className="w-5 h-5" />,
      status: 'implemented' as const,
    },
    { 
      id: 'teacher-reports' as const, 
      title: 'Teacher Reports', 
      icon: <BarChart3 className="w-5 h-5" />,
      status: 'implemented' as const,
    },
    { 
      id: 'student-reports' as const, 
      title: 'Student Reports', 
      icon: <FileText className="w-5 h-5" />,
      status: 'implemented' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Academic Features Demo</h1>
              <p className="text-sm text-gray-500">
                Features 7-14: Schedule • Subjects • Attendance • Gradebook • Timetable • Reports
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Role Switcher */}
            <RoleSwitcher 
              currentRole={currentRole} 
              onRoleChange={handleRoleChange} 
            />

            {/* Feature Navigation */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Features</h3>
              <div className="space-y-2">
                {features.map((feature) => (
                  <FeatureCard
                    key={feature.id}
                    title={feature.title}
                    icon={feature.icon}
                    feature={feature.id}
                    isActive={activeFeature === feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                    status={feature.status}
                  />
                ))}
              </div>
            </div>

            {/* Console Demo Info */}
            <ConsoleDemo feature={activeFeature} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {activeFeature === 'schedule' && (
                <TeacherSchedule teacherId={selectedTeacherId} />
              )}
              
              {activeFeature === 'subjects' && (
                <SubjectManagement />
              )}
              
              {activeFeature === 'attendance' && (
                <AttendanceSystem 
                  classId={selectedClassId}
                  teacherId={currentRole === 'teacher' ? currentUserId : undefined}
                />
              )}
              
              {activeFeature === 'gradebook' && (
                <AssignmentGradebook 
                  classId={selectedClassId}
                  teacherId={currentRole === 'teacher' ? currentUserId : undefined}
                />
              )}

              {activeFeature === 'timetable-builder' && (
                <TimetableBuilder />
              )}

              {activeFeature === 'timetable-edit' && (
                <TimetableTeacherEdit teacherId={currentRole === 'teacher' ? currentUserId : 'teacher-001'} />
              )}

              {activeFeature === 'teacher-reports' && (
                <TeacherReports teacherId={currentRole === 'teacher' ? currentUserId : 'teacher-001'} />
              )}

              {activeFeature === 'student-reports' && (
                <StudentReports studentId={currentRole === 'student' ? currentUserId : 'student-001'} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Wrapped demo page with PermissionProvider
 */
const AcademicFeaturesDemo: React.FC = () => {
  return (
    <PermissionProvider initialRole="admin" initialUserId="admin-001">
      <AcademicFeaturesDemoContent />
    </PermissionProvider>
  );
};

export default AcademicFeaturesDemo;
