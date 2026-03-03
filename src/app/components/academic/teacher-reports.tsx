/**
 * SETU Education Management System - Feature 13: Teacher Reports
 * Teacher-specific reports with class performance and analytics
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Download, 
  Calendar,
  Award,
  AlertCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { mockData } from '../../data';
import { usePermissions } from '../../context/permission-context';
import type { 
  Teacher, 
  ClassGrade, 
  Student, 
  Grade, 
  Attendance,
  Subject
} from '../../types';

// ==================== TYPES ====================

interface TeacherReportsProps {
  teacherId?: string;
  className?: string;
}

type ReportType = 'performance' | 'attendance' | 'grades' | 'overview';

// ==================== HELPER FUNCTIONS ====================

const calculateAverageGrade = (grades: Grade[]): number => {
  if (grades.length === 0) return 0;
  const total = grades.reduce((sum, g) => sum + (g.marks / g.maxMarks) * 100, 0);
  return Math.round(total / grades.length);
};

const calculateAttendanceRate = (records: Attendance[]): number => {
  if (records.length === 0) return 0;
  const present = records.filter(r => r.status === 'present' || r.status === 'excused').length;
  return Math.round((present / records.length) * 100);
};

const getGradeDistribution = (grades: Grade[]) => {
  const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  grades.forEach((g) => {
    const percentage = (g.marks / g.maxMarks) * 100;
    if (percentage >= 90) distribution.A++;
    else if (percentage >= 80) distribution.B++;
    else if (percentage >= 70) distribution.C++;
    else if (percentage >= 60) distribution.D++;
    else distribution.F++;
  });
  return distribution;
};

// ==================== SUB-COMPONENTS ====================

/**
 * Overview Report Card
 */
const OverviewCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color: string;
}> = ({ title, value, subtitle, icon, trend, color }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className={`flex items-center gap-1 mt-2 text-sm ${
        trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
      }`}>
        {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : trend === 'down' ? <TrendingUp className="w-4 h-4 rotate-180" /> : null}
        <span>{trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}</span>
      </div>
    )}
  </div>
);

/**
 * Grade Distribution Chart
 */
const GradeDistributionChart: React.FC<{
  distribution: Record<string, number>;
}> = ({ distribution }) => {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);
  const colors = {
    A: 'bg-green-500',
    B: 'bg-blue-500',
    C: 'bg-yellow-500',
    D: 'bg-orange-500',
    F: 'bg-red-500',
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-4">Grade Distribution</h4>
      <div className="space-y-3">
        {Object.entries(distribution).map(([grade, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={grade}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Grade {grade}</span>
                <span className="text-gray-500">{count} students ({Math.round(percentage)}%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors[grade as keyof typeof colors]} transition-all`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Attendance Trend Chart
 */
const AttendanceTrendChart: React.FC<{
  data: { date: string; rate: number }[];
}> = ({ data }) => {
  const maxRate = 100;
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-4">Attendance Trend (Last 10 Days)</h4>
      <div className="flex items-end gap-2 h-32">
        {data.map((point, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full rounded-t transition-all ${
                point.rate >= 90 ? 'bg-green-500' : point.rate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ height: `${(point.rate / maxRate) * 100}%` }}
            />
            <span className="text-xs text-gray-500 rotate-45 origin-left translate-y-2">
              {new Date(point.date).toLocaleDateString('en', { weekday: 'short' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Class Performance Table
 */
const ClassPerformanceTable: React.FC<{
  classData: {
    cls: ClassGrade;
    avgGrade: number;
    attendanceRate: number;
    studentCount: number;
    topStudent?: Student;
  }[];
}> = ({ classData }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-3 text-left text-sm font-medium text-gray-700">Class</th>
          <th className="p-3 text-center text-sm font-medium text-gray-700">Students</th>
          <th className="p-3 text-center text-sm font-medium text-gray-700">Avg Grade</th>
          <th className="p-3 text-center text-sm font-medium text-gray-700">Attendance</th>
          <th className="p-3 text-left text-sm font-medium text-gray-700">Top Student</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {classData.map(({ cls, avgGrade, attendanceRate, studentCount, topStudent }) => (
          <tr key={cls.id} className="hover:bg-gray-50">
            <td className="p-3 font-medium text-gray-900">{cls.name}</td>
            <td className="p-3 text-center text-gray-600">{studentCount}</td>
            <td className="p-3 text-center">
              <span className={`font-semibold ${
                avgGrade >= 80 ? 'text-green-600' : avgGrade >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {avgGrade}%
              </span>
            </td>
            <td className="p-3 text-center">
              <span className={`font-semibold ${
                attendanceRate >= 90 ? 'text-green-600' : attendanceRate >= 75 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {attendanceRate}%
              </span>
            </td>
            <td className="p-3 text-sm text-gray-600">{topStudent?.name || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ==================== MAIN COMPONENT ====================

/**
 * Teacher Reports Component
 * Comprehensive reporting for teachers
 */
export const TeacherReports: React.FC<TeacherReportsProps> = ({
  teacherId: propTeacherId,
  className = '',
}) => {
  const [activeReport, setActiveReport] = useState<ReportType>('overview');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const { hasPermission, currentRole, currentUserId } = usePermissions();

  // Determine teacher ID
  const teacherId = propTeacherId || (currentRole === 'teacher' ? currentUserId : undefined);

  // Check permissions
  const canViewReports = hasPermission('view.reports.teacher') || hasPermission('view.reports.class');

  // Get teacher info
  const teacher = useMemo(() => {
    if (!teacherId) return null;
    return mockData.teachers.find((t: Teacher) => t.id === teacherId);
  }, [teacherId]);

  // Get teacher's classes
  const teacherClasses = useMemo(() => {
    if (!teacher) return [];
    return mockData.classes.filter((c: ClassGrade) => teacher.classes.includes(c.id));
  }, [teacher]);

  // Calculate class statistics
  const classStatistics = useMemo(() => {
    return teacherClasses.map((cls) => {
      const students = mockData.students.filter((s: Student) => s.classId === cls.id);
      const studentIds = students.map((s) => s.id);
      
      // Get grades for these students
      const grades = mockData.grades.filter((g: Grade) => 
        studentIds.includes(g.studentId) && g.teacherId === teacherId
      );
      
      // Get attendance for these students
      const attendance = mockData.attendance.filter((a: Attendance) =>
        studentIds.includes(a.studentId)
      );
      
      // Find top student
      const studentGrades = students.map((s) => {
        const studentGrades = grades.filter((g) => g.studentId === s.id);
        const avg = studentGrades.length > 0
          ? studentGrades.reduce((sum, g) => sum + (g.marks / g.maxMarks) * 100, 0) / studentGrades.length
          : 0;
        return { student: s, avg };
      }).sort((a, b) => b.avg - a.avg);
      
      return {
        cls,
        avgGrade: calculateAverageGrade(grades),
        attendanceRate: calculateAttendanceRate(attendance),
        studentCount: students.length,
        topStudent: studentGrades[0]?.student,
        grades,
      };
    });
  }, [teacherClasses, teacherId]);

  // Filter by selected class
  const filteredStats = useMemo(() => {
    if (selectedClass === 'all') return classStatistics;
    return classStatistics.filter((s) => s.cls.id === selectedClass);
  }, [classStatistics, selectedClass]);

  // Get all grades for selected classes
  const allGrades = useMemo(() => {
    return filteredStats.flatMap((s) => s.grades);
  }, [filteredStats]);

  // Grade distribution
  const gradeDistribution = useMemo(() => {
    return getGradeDistribution(allGrades);
  }, [allGrades]);

  // Attendance trend (mock data for last 10 days)
  const attendanceTrend = useMemo(() => {
    const trend = [];
    for (let i = 9; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trend.push({
        date: date.toISOString(),
        rate: 75 + Math.floor(Math.random() * 20), // Random rate between 75-95%
      });
    }
    return trend;
  }, []);

  // Handle export
  const handleExport = () => {
    console.log('[TeacherReports] Exporting report...');
    alert('Report exported! Check console for details.');
  };

  // Console demonstration
  useEffect(() => {
    console.log('\n========== FEATURE 13: TEACHER REPORTS ==========\n');
    console.log(`[TeacherReports] Current Role: ${currentRole}`);
    console.log(`[TeacherReports] Teacher: ${teacher?.name}`);
    console.log(`[TeacherReports] Classes: ${teacherClasses.length}`);
    console.log(`[TeacherReports] view.reports.teacher permission: ${canViewReports}`);
    console.log(`[TeacherReports] Total students: ${filteredStats.reduce((sum, s) => sum + s.studentCount, 0)}`);
  }, [currentRole, teacher?.name, teacherClasses.length, canViewReports, filteredStats]);

  if (!canViewReports) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600">You don't have permission to view teacher reports.</p>
      </div>
    );
  }

  const totalStudents = filteredStats.reduce((sum, s) => sum + s.studentCount, 0);
  const avgGrade = filteredStats.length > 0
    ? Math.round(filteredStats.reduce((sum, s) => sum + s.avgGrade, 0) / filteredStats.length)
    : 0;
  const avgAttendance = filteredStats.length > 0
    ? Math.round(filteredStats.reduce((sum, s) => sum + s.attendanceRate, 0) / filteredStats.length)
    : 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Teacher Reports</h2>
            <p className="text-sm text-gray-500">
              {teacher?.name} • {teacherClasses.length} classes • {totalStudents} students
            </p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'performance', label: 'Performance', icon: Award },
          { id: 'attendance', label: 'Attendance', icon: Calendar },
          { id: 'grades', label: 'Grades', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id as ReportType)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeReport === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">Class:</span>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All Classes</option>
          {teacherClasses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Overview Report */}
      {activeReport === 'overview' && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <OverviewCard
              title="Total Students"
              value={totalStudents}
              subtitle="Across all classes"
              icon={<Users className="w-5 h-5 text-blue-600" />}
              color="bg-blue-100"
            />
            <OverviewCard
              title="Average Grade"
              value={`${avgGrade}%`}
              subtitle="Class average"
              icon={<Award className="w-5 h-5 text-green-600" />}
              color="bg-green-100"
              trend={avgGrade > 75 ? 'up' : avgGrade > 60 ? 'neutral' : 'down'}
            />
            <OverviewCard
              title="Attendance Rate"
              value={`${avgAttendance}%`}
              subtitle="Average attendance"
              icon={<Calendar className="w-5 h-5 text-purple-600" />}
              color="bg-purple-100"
              trend={avgAttendance > 85 ? 'up' : avgAttendance > 70 ? 'neutral' : 'down'}
            />
            <OverviewCard
              title="Classes"
              value={filteredStats.length}
              subtitle="Teaching load"
              icon={<BookOpen className="w-5 h-5 text-orange-600" />}
              color="bg-orange-100"
            />
          </div>

          <ClassPerformanceTable classData={filteredStats} />
        </>
      )}

      {/* Performance Report */}
      {activeReport === 'performance' && (
        <div className="grid grid-cols-2 gap-4">
          <GradeDistributionChart distribution={gradeDistribution} />
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Top Performers</h4>
            <div className="space-y-2">
              {filteredStats.slice(0, 3).map(({ cls, topStudent }) => (
                topStudent && (
                  <div key={cls.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{topStudent.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({cls.name})</span>
                    </div>
                    <Award className="w-5 h-5 text-yellow-500" />
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attendance Report */}
      {activeReport === 'attendance' && (
        <div className="space-y-4">
          <AttendanceTrendChart data={attendanceTrend} />
          <ClassPerformanceTable classData={filteredStats} />
        </div>
      )}

      {/* Grades Report */}
      {activeReport === 'grades' && (
        <div className="grid grid-cols-2 gap-4">
          <GradeDistributionChart distribution={gradeDistribution} />
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Subject-wise Performance</h4>
            <div className="space-y-3">
              {teacher?.subjects.map((subjectId) => {
                const subject = mockData.subjects.find((s: Subject) => s.id === subjectId);
                const subjectGrades = allGrades.filter((g) => g.subjectId === subjectId);
                const avg = calculateAverageGrade(subjectGrades);
                return (
                  <div key={subjectId}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{subject?.name}</span>
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
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherReports;
