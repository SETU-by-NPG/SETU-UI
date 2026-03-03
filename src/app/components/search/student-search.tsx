/**
 * SETU Education Management System - Feature 4: Student Search (Teacher/Librarian)
 * Dedicated student search with role-based filtering
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Search, GraduationCap, Filter, Users, Loader2 } from 'lucide-react';
import { mockData } from '../../data';
import { usePermissions } from '../../context/permission-context';
import type { Student, Teacher, ClassGrade } from '../../types';

// ==================== TYPES ====================

interface StudentSearchProps {
  teacherId?: string; // For teacher-specific filtering
  onStudentSelect?: (student: Student) => void;
  className?: string;
  showFilters?: boolean;
}

type FilterOption = 'all' | 'my-classes' | 'by-class';

interface StudentWithDetails extends Student {
  className: string;
  classTeacherName?: string;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get teacher's allocated classes
 */
const getTeacherClasses = (teacherId: string): ClassGrade[] => {
  const teacher = mockData.teachers.find((t: Teacher) => t.id === teacherId);
  if (!teacher) return [];
  
  return mockData.classes.filter((cls: ClassGrade) =>
    teacher.classes.includes(cls.id)
  );
};

/**
 * Enrich student with class details
 */
const enrichStudentWithDetails = (student: Student): StudentWithDetails => {
  const cls = mockData.classes.find((c: ClassGrade) => c.id === student.classId);
  const classTeacher = cls?.classTeacherId 
    ? mockData.teachers.find((t: Teacher) => t.id === cls.classTeacherId)
    : undefined;
    
  return {
    ...student,
    className: cls?.name || 'Unknown Class',
    classTeacherName: classTeacher?.name,
  };
};

// ==================== SUB-COMPONENTS ====================

/**
 * Student card component
 */
const StudentCard: React.FC<{
  student: StudentWithDetails;
  onClick: () => void;
}> = ({ student, onClick }) => {
  const getAttendanceColor = (percent: number) => {
    if (percent >= 90) return 'text-green-600 bg-green-50';
    if (percent >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-600';
    if (gpa >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-500">{student.email}</p>
            <p className="text-xs text-gray-400">ID: {student.studentId}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${getAttendanceColor(student.attendancePercent)}`}>
          {student.attendancePercent}% Attendance
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-400 text-xs">Class</p>
          <p className="font-medium text-gray-700">{student.className}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Section</p>
          <p className="font-medium text-gray-700">{student.section || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">GPA</p>
          <p className={`font-bold ${getGPAColor(student.gpa)}`}>
            {student.gpa.toFixed(2)}
          </p>
        </div>
      </div>
      
      {student.classTeacherName && (
        <div className="mt-2 text-xs text-gray-400">
          Class Teacher: {student.classTeacherName}
        </div>
      )}
    </button>
  );
};

/**
 * Filter selector component
 */
const FilterSelector: React.FC<{
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  selectedClassId?: string;
  onClassChange: (classId: string) => void;
  availableClasses: ClassGrade[];
  isTeacher: boolean;
}> = ({ 
  activeFilter, 
  onFilterChange, 
  selectedClassId, 
  onClassChange,
  availableClasses,
  isTeacher 
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-700">Filters</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            activeFilter === 'all'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          All Students
        </button>
        
        {isTeacher && (
          <button
            onClick={() => onFilterChange('my-classes')}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              activeFilter === 'my-classes'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            My Classes
          </button>
        )}
        
        <button
          onClick={() => onFilterChange('by-class')}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            activeFilter === 'by-class'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          By Class
        </button>
      </div>
      
      {activeFilter === 'by-class' && (
        <select
          value={selectedClassId}
          onChange={(e) => onClassChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a class...</option>
          {availableClasses.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name} ({cls.students.length} students)
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

/**
 * Student Search Component
 * For Teachers: Filter by allocated classes
 * For Librarians: Access all students
 */
export const StudentSearch: React.FC<StudentSearchProps> = ({
  teacherId,
  onStudentSelect,
  className = '',
  showFilters = true,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState<StudentWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { hasPermission, currentRole } = usePermissions();
  const isTeacher = currentRole === 'teacher';
  const isLibrarian = currentRole === 'librarian';
  const isAdmin = currentRole === 'admin';

  // Get teacher's classes if applicable
  const teacherClasses = teacherId && isTeacher 
    ? getTeacherClasses(teacherId) 
    : mockData.classes;

  // Console demonstration on mount
  useEffect(() => {
    console.log('\n========== FEATURE 4: STUDENT SEARCH ==========\n');
    console.log(`[StudentSearch] Initialized for role: ${currentRole}`);
    console.log(`[StudentSearch] Teacher ID: ${teacherId || 'N/A'}`);
    console.log(`[StudentSearch] Has search.students permission: ${hasPermission('search.students')}`);
    
    if (isTeacher && teacherId) {
      console.log(`[StudentSearch] Teacher classes: ${teacherClasses.length}`);
      teacherClasses.forEach((cls, i) => {
        console.log(`  → Class ${i + 1}: ${cls.name} (${cls.students.length} students)`);
      });
    }
    
    if (isLibrarian) {
      console.log(`[StudentSearch] Librarian view: All ${mockData.students.length} students accessible`);
    }
  }, [currentRole, hasPermission, isLibrarian, isTeacher, teacherClasses, teacherId]);

  /**
   * Filter students based on role and filters
   */
  const filterStudents = useCallback((): StudentWithDetails[] => {
    // Check permission
    if (!hasPermission('search.students')) {
      console.log('[StudentSearch] Access denied: No search.students permission');
      return [];
    }

    let filteredStudents: Student[] = [];

    if (isTeacher && teacherId) {
      // Teacher: Filter by allocated classes
      switch (activeFilter) {
        case 'my-classes':
          // Only students in teacher's allocated classes
          const teacherClassIds = teacherClasses.map((c) => c.id);
          filteredStudents = mockData.students.filter((s: Student) =>
            teacherClassIds.includes(s.classId)
          );
          console.log(`[StudentSearch] Filter: My Classes (${filteredStudents.length} students)`);
          break;
          
        case 'by-class':
          // Specific class selected
          if (selectedClassId) {
            filteredStudents = mockData.students.filter(
              (s: Student) => s.classId === selectedClassId
            );
            const cls = mockData.classes.find((c: ClassGrade) => c.id === selectedClassId);
            console.log(`[StudentSearch] Filter: By Class "${cls?.name}" (${filteredStudents.length} students)`);
          } else {
            filteredStudents = [];
          }
          break;
          
        case 'all':
        default:
          // Teacher can search all but should see their classes prioritized
          filteredStudents = mockData.students;
          console.log(`[StudentSearch] Filter: All Students (${filteredStudents.length} total)`);
          break;
      }
    } else if (isLibrarian || isAdmin) {
      // Librarian/Admin: Access all students
      filteredStudents = mockData.students;
      console.log(`[StudentSearch] ${currentRole} view: All ${filteredStudents.length} students`);
    } else {
      // Other roles: Limited access
      filteredStudents = [];
      console.log(`[StudentSearch] ${currentRole}: No student access`);
    }

    // Apply text search
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filteredStudents = filteredStudents.filter(
        (s) =>
          s.name.toLowerCase().includes(lowerQuery) ||
          s.email.toLowerCase().includes(lowerQuery) ||
          s.studentId.toLowerCase().includes(lowerQuery) ||
          s.rollNo.toString().includes(lowerQuery)
      );
      console.log(`[StudentSearch] Text filter "${query}": ${filteredStudents.length} matches`);
    }

    // Enrich and return
    return filteredStudents.map(enrichStudentWithDetails);
  }, [activeFilter, hasPermission, isAdmin, isLibrarian, isTeacher, query, selectedClassId, teacherClasses, teacherId, currentRole]);

  // Update students when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const results = filterStudents();
      setStudents(results);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [filterStudents]);

  const handleStudentSelect = (student: StudentWithDetails) => {
    console.log(`[StudentSearch] Selected student: ${student.name} (${student.studentId})`);
    onStudentSelect?.(student);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Student Search</h2>
        </div>
        <span className="text-sm text-gray-500">
          {students.length} student{students.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, ID, or roll number..."
          className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <FilterSelector
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          selectedClassId={selectedClassId}
          onClassChange={setSelectedClassId}
          availableClasses={teacherClasses}
          isTeacher={isTeacher}
        />
      )}

      {/* Results */}
      <div className="space-y-3">
        {students.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {query.trim() 
                ? `No students found matching "${query}"`
                : 'No students to display'
              }
            </p>
            {isTeacher && activeFilter === 'my-classes' && teacherClasses.length === 0 && (
              <p className="text-sm text-gray-400 mt-1">
                You are not assigned to any classes
              </p>
            )}
          </div>
        ) : (
          students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={() => handleStudentSelect(student)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default StudentSearch;
