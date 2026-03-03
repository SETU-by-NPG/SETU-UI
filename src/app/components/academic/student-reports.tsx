/**
 * SETU Education Management System - Feature 14: Student Reports
 * Student progress reports with grade cards, attendance, and teacher remarks
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  TrendingUp, 
  Calendar, 
  User, 
  Download, 
  Award,
  BookOpen,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Printer,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { mockData } from '../../data';
import { usePermissions } from '../../context/permission-context';
import type { 
  Student, 
  Grade, 
  Attendance,
  ClassGrade,
  Subject,
  Teacher
} from '../../types';

// ==================== TYPES ====================

interface StudentReportsProps {
  studentId?: string;
  className?: string;
}

type Term = 'Term 1' | 'Term 2' | 'Final';
type ReportView = 'grade-card' | 'attendance' | 'progress' | 'remarks';

// ==================== HELPER FUNCTIONS ====================

const calculateGPA = (grades: Grade[]): number => {
  if (grades.length === 0) return 0;
  const totalPoints = grades.reduce((sum, g) => {
    const percentage = (g.marks / g.maxMarks) * 100;
    let points = 0;
    if (percentage >= 90) points = 4.0;
    else if (percentage >= 80) points = 3.5;
    else if (percentage >= 70) points = 3.0;
    else if (percentage >= 60) points = 2.5;
    else if (percentage >= 50) points = 2.0;
    else points = 1.0;
    return sum + points;
  }, 0);
  return parseFloat((totalPoints / grades.length).toFixed(2));
};

const getGradeLetter = (marks: number, maxMarks: number): string => {
  const percentage = (marks / maxMarks) * 100;
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

const calculateAttendancePercentage = (records: Attendance[]): number => {
  if (records.length === 0) return 0;
  const present = records.filter(r => r.status === 'present' || r.status === 'excused').length;
  return Math.round((present / records.length) * 100);
};

// ==================== SUB-COMPONENTS ====================

/**
 * Grade Card Component
 */
const GradeCard: React.FC<{
  student: Student;
  grades: Grade[];
  term: Term;
}> = ({ student, grades, term }) => {
  const gpa = calculateGPA(grades);
  const cls = mockData.classes.find((c: ClassGrade) => c.id === student.classId);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Report Card - {term}</h3>
          <p className="text-gray-500">Academic Year 2024-2025</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-600">{gpa}</p>
          <p className="text-sm text-gray-500">GPA</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Student Name</p>
          <p className="font-medium">{student.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Student ID</p>
          <p className="font-medium">{student.studentId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Class</p>
          <p className="font-medium">{cls?.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Roll Number</p>
          <p className="font-medium">{student.rollNo}</p>
        </div>
      </div>

      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left text-sm font-medium text-gray-700">Subject</th>
            <th className="p-3 text-center text-sm font-medium text-gray-700">Marks</th>
            <th className="p-3 text-center text-sm font-medium text-gray-700">Max</th>
            <th className="p-3 text-center text-sm font-medium text-gray-700">%</th>
            <th className="p-3 text-center text-sm font-medium text-gray-700">Grade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {grades.map((grade) => {
            const subject = mockData.subjects.find((s: Subject) => s.id === grade.subjectId);
            const percentage = Math.round((grade.marks / grade.maxMarks) * 100);
            const letter = getGradeLetter(grade.marks, grade.maxMarks);
            return (
              <tr key={grade.id}>
                <td className="p-3">{subject?.name}</td>
                <td className="p-3 text-center font-medium">{grade.marks}</td>
                <td className="p-3 text-center text-gray-500">{grade.maxMarks}</td>
                <td className="p-3 text-center">{percentage}%</td>
                <td className="p-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    letter === 'A' ? 'bg-green-100 text-green-700' :
                    letter === 'B' ? 'bg-blue-100 text-blue-700' :
                    letter === 'C' ? 'bg-yellow-100 text-yellow-700' :
                    letter === 'D' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {letter}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          <span className="font-medium">Teacher's Remarks:</span> {student.name} has shown 
          {gpa >= 3.5 ? ' excellent ' : gpa >= 3.0 ? ' good ' : ' satisfactory '} 
          performance this term. Keep up the {gpa >= 3.0 ? 'great' : 'hard'} work!
        </p>
      </div>
    </div>
  );
};

/**
 * Attendance Summary Component
 */
const AttendanceSummary: React.FC<{
  records: Attendance[];
}> = ({ records }) => {
  const total = records.length;
  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const late = records.filter(r => r.status === 'late').length;
  const excused = records.filter(r => r.status === 'excused').length;
  const percentage = calculateAttendancePercentage(records);

  const monthlyData = useMemo(() => {
    const months: Record<string, { present: number; total: number }> = {};
    records.forEach((r) => {
      const month = new Date(r.date).toLocaleString('en', { month: 'short' });
      if (!months[month]) months[month] = { present: 0, total: 0 };
      months[month].total++;
      if (r.status === 'present' || r.status === 'excused') months[month].present++;
    });
    return Object.entries(months).map(([month, data]) => ({
      month,
      rate: Math.round((data.present / data.total) * 100),
    }));
  }, [records]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <p className="text-3xl font-bold text-gray-900">{percentage}%</p>
          <p className="text-sm text-gray-500">Overall</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
          <p className="text-2xl font-bold text-green-600">{present}</p>
          <p className="text-sm text-green-600">Present</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
          <p className="text-2xl font-bold text-red-600">{absent}</p>
          <p className="text-sm text-red-600">Absent</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
          <p className="text-2xl font-bold text-yellow-600">{late}</p>
          <p className="text-sm text-yellow-600">Late</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
          <p className="text-2xl font-bold text-blue-600">{excused}</p>
          <p className="text-sm text-blue-600">Excused</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Monthly Attendance Trend</h4>
        <div className="flex items-end gap-2 h-32">
          {monthlyData.map((data) => (
            <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t transition-all ${
                  data.rate >= 90 ? 'bg-green-500' : data.rate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ height: `${data.rate}%` }}
              />
              <span className="text-xs text-gray-500">{data.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Progress Chart Component
 */
const ProgressChart: React.FC<{
  grades: Grade[];
}> = ({ grades }) => {
  const subjectProgress = useMemo(() => {
    const subjects: Record<string, { grades: number[]; subject: Subject }> = {};
    grades.forEach((g) => {
      const subject = mockData.subjects.find((s: Subject) => s.id === g.subjectId);
      if (!subjects[g.subjectId]) {
        subjects[g.subjectId] = { grades: [], subject: subject! };
      }
      subjects[g.subjectId].grades.push((g.marks / g.maxMarks) * 100);
    });
    return Object.values(subjects).map((s) => ({
      subject: s.subject.name,
      avg: Math.round(s.grades.reduce((a, b) => a + b, 0) / s.grades.length),
    }));
  }, [grades]);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-4">Subject-wise Progress</h4>
      <div className="space-y-3">
        {subjectProgress.map(({ subject, avg }) => (
          <div key={subject}>
            <div className="flex justify-between text-sm mb-1">
              <span>{subject}</span>
              <span className={`font-semibold ${
                avg >= 80 ? 'text-green-600' : avg >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {avg}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${avg >= 80 ? 'bg-green-500' : avg >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${avg}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Teacher Remarks Component
 */
const TeacherRemarks: React.FC<{
  student: Student;
  grades: Grade[];
}> = ({ student, grades }) => {
  const remarks = useMemo(() => {
    return grades.map((grade) => {
      const subject = mockData.subjects.find((s: Subject) => s.id === grade.subjectId);
      const teacher = mockData.teachers.find((t: Teacher) => t.id === grade.teacherId);
      const percentage = (grade.marks / grade.maxMarks) * 100;
      let remark = '';
      if (percentage >= 90) remark = 'Outstanding performance! Shows excellent understanding.';
      else if (percentage >= 80) remark = 'Very good work. Consistent effort shown.';
      else if (percentage >= 70) remark = 'Good progress. Keep working hard.';
      else if (percentage >= 60) remark = 'Satisfactory. Needs more practice.';
      else remark = 'Needs significant improvement. Please seek help.';

      return {
        subject: subject?.name,
        teacher: teacher?.name,
        remark,
        percentage,
        date: grade.createdAt,
      };
    });
  }, [grades]);

  return (
    <div className="space-y-3">
      {remarks.map((r, idx) => (
        <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{r.subject}</span>
            </div>
            <span className="text-sm text-gray-500">{r.teacher}</span>
          </div>
          <p className="text-gray-600">{r.remark}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              r.percentage >= 80 ? 'bg-green-100 text-green-700' :
              r.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {Math.round(r.percentage)}%
            </span>
            <span className="text-xs text-gray-400">
              {new Date(r.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

/**
 * Student Reports Component
 * Comprehensive student progress reports
 */
export const StudentReports: React.FC<StudentReportsProps> = ({
  studentId: propStudentId,
  className = '',
}) => {
  const [activeView, setActiveView] = useState<ReportView>('grade-card');
  const [selectedTerm, setSelectedTerm] = useState<Term>('Term 1');
  const { hasPermission, currentRole, currentUserId } = usePermissions();

  // Determine student ID
  const studentId = propStudentId || (currentRole === 'student' ? currentUserId : 'student-001');

  // Check permissions
  const canViewReport = hasPermission('view.reports.student', {
    isOwnRecord: currentRole === 'student' && currentUserId === studentId,
    isOwnChildRecord: currentRole === 'parent' && mockData.students.find((s: Student) => s.id === studentId)?.parentId === currentUserId,
  });

  // Get student info
  const student = useMemo(() => {
    return mockData.students.find((s: Student) => s.id === studentId);
  }, [studentId]);

  // Get student's grades
  const studentGrades = useMemo(() => {
    if (!student) return [];
    return mockData.grades.filter((g: Grade) => g.studentId === studentId);
  }, [student, studentId]);

  // Get student's attendance
  const studentAttendance = useMemo(() => {
    if (!student) return [];
    return mockData.attendance.filter((a: Attendance) => a.studentId === studentId);
  }, [student, studentId]);

  // Handle export
  const handleExport = () => {
    console.log('[StudentReports] Exporting report for:', student?.name);
    alert('Student report exported!');
  };

  // Handle print
  const handlePrint = () => {
    console.log('[StudentReports] Printing report for:', student?.name);
    window.print();
  };

  // Console demonstration
  useEffect(() => {
    console.log('\n========== FEATURE 14: STUDENT REPORTS ==========\n');
    console.log(`[StudentReports] Current Role: ${currentRole}`);
    console.log(`[StudentReports] Student: ${student?.name}`);
    console.log(`[StudentReports] Grades: ${studentGrades.length}`);
    console.log(`[StudentReports] Attendance: ${studentAttendance.length} records`);
    console.log(`[StudentReports] view.reports.student permission: ${canViewReport}`);
    console.log(`[StudentReports] GPA: ${calculateGPA(studentGrades)}`);
  }, [currentRole, student?.name, studentGrades.length, studentAttendance.length, canViewReport]);

  if (!student) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
        <p className="text-yellow-600">Student not found.</p>
      </div>
    );
  }

  if (!canViewReport) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600">You don't have permission to view this student's report.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Student Progress Report</h2>
            <p className="text-sm text-gray-500">
              {student.name} • {student.studentId} • GPA: {calculateGPA(studentGrades)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        {[
          { id: 'grade-card', label: 'Grade Card', icon: Award },
          { id: 'attendance', label: 'Attendance', icon: Calendar },
          { id: 'progress', label: 'Progress', icon: TrendingUp },
          { id: 'remarks', label: 'Remarks', icon: MessageSquare },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as ReportView)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeView === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Term Selector (for grade card) */}
      {activeView === 'grade-card' && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Term:</span>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value as Term)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          >
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Final">Final</option>
          </select>
        </div>
      )}

      {/* Content */}
      {activeView === 'grade-card' && (
        <GradeCard student={student} grades={studentGrades} term={selectedTerm} />
      )}

      {activeView === 'attendance' && (
        <AttendanceSummary records={studentAttendance} />
      )}

      {activeView === 'progress' && (
        <ProgressChart grades={studentGrades} />
      )}

      {activeView === 'remarks' && (
        <TeacherRemarks student={student} grades={studentGrades} />
      )}
    </div>
  );
};

export default StudentReports;
