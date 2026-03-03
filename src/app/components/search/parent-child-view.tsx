/**
 * SETU Education Management System - Feature 6: Parent-Child View
 * Parent dashboard showing linked children with student data
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { mockData } from '../../data';
import { usePermissions } from '../../context/permission-context';
import type { Student, Parent, Attendance, Grade, ClassGrade } from '../../types';

// ==================== TYPES ====================

interface ParentChildViewProps {
  parentId: string;
  onViewChildDetails?: (studentId: string) => void;
}

interface ChildWithDetails extends Student {
  className: string;
  recentAttendance: Attendance[];
  recentGrades: Grade[];
  attendanceSummary: {
    present: number;
    absent: number;
    late: number;
    excused: number;
  };
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Enrich child data with additional details
 */
const enrichChildData = (student: Student): ChildWithDetails => {
  const cls = mockData.classes.find((c: ClassGrade) => c.id === student.classId);
  
  // Get recent attendance (last 10 entries)
  const recentAttendance = mockData.attendance
    .filter((a: Attendance) => a.studentId === student.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
  
  // Get recent grades (last 5 entries)
  const recentGrades = mockData.grades
    .filter((g: Grade) => g.studentId === student.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Calculate attendance summary
  const allAttendance = mockData.attendance.filter((a: Attendance) => a.studentId === student.id);
  const attendanceSummary = {
    present: allAttendance.filter((a) => a.status === 'present').length,
    absent: allAttendance.filter((a) => a.status === 'absent').length,
    late: allAttendance.filter((a) => a.status === 'late').length,
    excused: allAttendance.filter((a) => a.status === 'excused').length,
  };
  
  return {
    ...student,
    className: cls?.name || 'Unknown Class',
    recentAttendance,
    recentGrades,
    attendanceSummary,
  };
};

/**
 * Get attendance status icon
 */
const getAttendanceIcon = (status: Attendance['status']) => {
  switch (status) {
    case 'present':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'absent':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'late':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'excused':
      return <AlertCircle className="w-4 h-4 text-blue-500" />;
  }
};

/**
 * Get grade color based on value
 */
const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
  if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
  if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

// ==================== SUB-COMPONENTS ====================

/**
 * Child Card Component
 */
const ChildCard: React.FC<{
  child: ChildWithDetails;
  isExpanded: boolean;
  onToggle: () => void;
  onViewDetails: () => void;
}> = ({ child, isExpanded, onToggle, onViewDetails }) => {
  const totalAttendance = Object.values(child.attendanceSummary).reduce((a, b) => a + b, 0);
  const presentPercent = totalAttendance > 0 
    ? Math.round((child.attendanceSummary.present / totalAttendance) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{child.name}</h3>
            <p className="text-sm text-gray-500">{child.className}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">ID: {child.studentId}</span>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs text-gray-400">Roll: {child.rollNo}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{child.gpa.toFixed(2)}</p>
            <p className="text-xs text-gray-500">GPA</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${presentPercent >= 90 ? 'text-green-600' : presentPercent >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
              {presentPercent}%
            </p>
            <p className="text-xs text-gray-500">Attendance</p>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-xl font-bold text-green-600">{child.attendanceSummary.present}</p>
              <p className="text-xs text-gray-600">Present</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-xl font-bold text-red-600">{child.attendanceSummary.absent}</p>
              <p className="text-xs text-gray-600">Absent</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-xl font-bold text-yellow-600">{child.attendanceSummary.late}</p>
              <p className="text-xs text-gray-600">Late</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-xl font-bold text-blue-600">{child.recentGrades.length}</p>
              <p className="text-xs text-gray-600">Recent Grades</p>
            </div>
          </div>

          {/* Recent Attendance */}
          {child.recentAttendance.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Recent Attendance
              </h4>
              <div className="flex gap-2 flex-wrap">
                {child.recentAttendance.slice(0, 7).map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded text-xs"
                    title={`${record.date}: ${record.status}`}
                  >
                    {getAttendanceIcon(record.status)}
                    <span className="text-gray-600">{record.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Grades */}
          {child.recentGrades.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Recent Grades
              </h4>
              <div className="space-y-2">
                {child.recentGrades.map((grade) => {
                  const subject = mockData.subjects.find((s) => s.id === grade.subjectId);
                  return (
                    <div
                      key={grade.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="text-sm font-medium">{subject?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{grade.term}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">
                          {grade.marks}/{grade.maxMarks}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${getGradeColor(grade.grade)}`}>
                          {grade.grade}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* View Details Button */}
          <button
            onClick={onViewDetails}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span>View Full Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Empty State Component
 */
const EmptyState: React.FC = () => (
  <div className="text-center py-12 bg-gray-50 rounded-lg">
    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-700 mb-2">No Children Linked</h3>
    <p className="text-gray-500 text-sm max-w-sm mx-auto">
      No students are currently linked to your parent account. Please contact the school administration to link your children.
    </p>
  </div>
);

/**
 * No Access State Component
 */
const NoAccessState: React.FC = () => (
  <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
    <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-red-700 mb-2">Access Restricted</h3>
    <p className="text-red-600 text-sm max-w-sm mx-auto">
      You don't have permission to view student information. Only parents with linked children can access this feature.
    </p>
  </div>
);

// ==================== MAIN COMPONENT ====================

/**
 * Parent Child View Component
 * Displays all children linked to a parent with attendance and grades
 */
export const ParentChildView: React.FC<ParentChildViewProps> = ({
  parentId,
  onViewChildDetails,
}) => {
  const [expandedChildId, setExpandedChildId] = useState<string | null>(null);
  const { hasPermission, currentRole } = usePermissions();

  // Find parent and their children
  const parent = useMemo(() => 
    mockData.parents.find((p: Parent) => p.id === parentId),
    [parentId]
  );

  const children = useMemo(() => {
    if (!parent) return [];
    
    return parent.children
      .map((childId) => mockData.students.find((s: Student) => s.id === childId))
      .filter((s): s is Student => s !== undefined)
      .map(enrichChildData);
  }, [parent]);

  // Check permission
  const canViewChildren = useMemo(() => {
    // Check if parent can view their own children's records
    return hasPermission('view.student.full', { isOwnChildRecord: true });
  }, [hasPermission]);

  // Console demonstration
  useEffect(() => {
    console.log('\n========== FEATURE 6: PARENT-CHILD VIEW ==========\n');
    console.log(`[ParentChildView] Parent: ${parent?.name || 'Not Found'} (${parentId})`);
    console.log(`[ParentChildView] Current Role: ${currentRole}`);
    console.log(`[ParentChildView] Can view children: ${canViewChildren}`);
    console.log(`[ParentChildView] Number of children: ${children.length}`);
    
    children.forEach((child, i) => {
      console.log(`\n[ParentChildView] Child ${i + 1}:`);
      console.log(`  → Name: ${child.name}`);
      console.log(`  → Class: ${child.className}`);
      console.log(`  → GPA: ${child.gpa.toFixed(2)}`);
      console.log(`  → Attendance: ${child.recentAttendance.length} recent entries`);
      console.log(`  → Grades: ${child.recentGrades.length} recent entries`);
      console.log(`  → view.student.full permission: ${hasPermission('view.student.full', { isOwnChildRecord: true })}`);
    });
    
    console.log('\n==============================================\n');
  }, [parent, parentId, currentRole, canViewChildren, children, hasPermission]);

  // Handle toggling expanded state
  const handleToggleChild = (childId: string) => {
    setExpandedChildId(expandedChildId === childId ? null : childId);
  };

  // Handle viewing child details
  const handleViewDetails = (childId: string) => {
    console.log(`[ParentChildView] Viewing details for child: ${childId}`);
    onViewChildDetails?.(childId);
  };

  // Render based on state
  if (!canViewChildren) {
    return <NoAccessState />;
  }

  if (!parent || children.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Children</h2>
            <p className="text-gray-500">
              {parent.name} • {children.length} child{children.length !== 1 ? 'ren' : ''} linked
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-600">View academic progress</span>
        </div>
      </div>

      {/* Children List */}
      <div className="space-y-4">
        {children.map((child) => (
          <ChildCard
            key={child.id}
            child={child}
            isExpanded={expandedChildId === child.id}
            onToggle={() => handleToggleChild(child.id)}
            onViewDetails={() => handleViewDetails(child.id)}
          />
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Parent Access Information</h4>
            <p className="text-sm text-blue-700 mt-1">
              As a parent, you can view your children's attendance, grades, and basic information. 
              For detailed reports or concerns, please contact the class teacher or school administration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentChildView;
