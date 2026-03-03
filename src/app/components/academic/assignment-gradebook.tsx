/**
 * SETU Education Management System - Feature 10: Assignment & Gradebook Module
 * Assignment management and gradebook with student submissions
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Users,
  Download,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Calendar,
  TrendingUp,
  Award,
  Save,
  ChevronDown,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { mockData } from '../../data';
import { usePermissions } from '../../context/permission-context';
import type { 
  Assignment, 
  AssignmentSubmission, 
  Student, 
  ClassGrade, 
  Teacher,
  Subject,
  Grade
} from '../../types';

// ==================== TYPES ====================

interface AssignmentGradebookProps {
  classId?: string;
  teacherId?: string;
  className?: string;
}

type ViewMode = 'assignments' | 'submissions' | 'gradebook';
type AssignmentStatus = 'draft' | 'published' | 'graded' | 'archived';
type SubmissionStatus = 'pending' | 'submitted' | 'late' | 'graded';

// ==================== CONSTANTS ====================

const ASSIGNMENT_STATUS_CONFIG: Record<AssignmentStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  published: { label: 'Published', color: 'bg-blue-100 text-blue-700' },
  graded: { label: 'Graded', color: 'bg-green-100 text-green-700' },
  archived: { label: 'Archived', color: 'bg-purple-100 text-purple-700' },
};

const SUBMISSION_STATUS_CONFIG: Record<SubmissionStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-700',
    icon: <Clock className="w-4 h-4" />
  },
  submitted: { 
    label: 'Submitted', 
    color: 'bg-blue-100 text-blue-700',
    icon: <CheckCircle className="w-4 h-4" />
  },
  late: { 
    label: 'Late', 
    color: 'bg-red-100 text-red-700',
    icon: <AlertTriangle className="w-4 h-4" />
  },
  graded: { 
    label: 'Graded', 
    color: 'bg-green-100 text-green-700',
    icon: <Award className="w-4 h-4" />
  },
};

// ==================== HELPER FUNCTIONS ====================

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date();
};

const calculateGradeStats = (grades: Grade[]) => {
  if (grades.length === 0) return { avg: 0, highest: 0, lowest: 0 };
  
  const percentages = grades.map(g => (g.marks / g.maxMarks) * 100);
  return {
    avg: Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length),
    highest: Math.round(Math.max(...percentages)),
    lowest: Math.round(Math.min(...percentages)),
  };
};

// ==================== SUB-COMPONENTS ====================

/**
 * Create Assignment Modal
 */
const CreateAssignmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignment: Partial<Assignment>) => void;
  classes: ClassGrade[];
  subjects: Subject[];
}> = ({ isOpen, onClose, onSave, classes, subjects }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    classId: '',
    dueDate: '',
    totalMarks: 100,
    status: 'draft' as AssignmentStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      teacherId: '', // Will be set from context
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Create Assignment</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
              <input
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
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
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Grade Entry Modal
 */
const GradeEntryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (submissionId: string, marks: number, feedback: string) => void;
  submission: AssignmentSubmission | null;
  assignment: Assignment | null;
  student: Student | null;
}> = ({ isOpen, onClose, onSave, submission, assignment, student }) => {
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (submission && submission.marks !== null) {
      setMarks(submission.marks.toString());
      setFeedback(submission.feedback || '');
    } else {
      setMarks('');
      setFeedback('');
    }
  }, [submission]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submission) {
      onSave(submission.id, parseInt(marks), feedback);
    }
    onClose();
  };

  if (!isOpen || !submission || !assignment || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Grade Submission</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Student</p>
            <p className="font-medium">{student.name}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Assignment</p>
            <p className="font-medium">{assignment.title}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marks (out of {assignment.totalMarks})
            </label>
            <input
              type="number"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max={assignment.totalMarks}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter feedback for the student..."
            />
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
              Save Grade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Assignments List
 */
const AssignmentsList: React.FC<{
  assignments: Assignment[];
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignmentId: string) => void;
  canEdit: boolean;
}> = ({ assignments, onEdit, onDelete, canEdit }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {assignments.map((assignment) => {
        const subject = mockData.subjects.find((s: Subject) => s.id === assignment.subjectId);
        const classGrade = mockData.classes.find((c: ClassGrade) => c.id === assignment.classId);
        const isExpanded = expandedId === assignment.id;
        
        return (
          <div 
            key={assignment.id} 
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedId(isExpanded ? null : assignment.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                    <p className="text-sm text-gray-500">
                      {subject?.name} • {classGrade?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${ASSIGNMENT_STATUS_CONFIG[assignment.status].color}`}>
                    {ASSIGNMENT_STATUS_CONFIG[assignment.status].label}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Due: {formatDate(assignment.dueDate)}
                  {isOverdue(assignment.dueDate) && assignment.status !== 'graded' && (
                    <span className="text-red-500 ml-1">(Overdue)</span>
                  )}
                </span>
                <span>•</span>
                <span>{assignment.totalMarks} marks</span>
                <span>•</span>
                <span>{assignment.submissions?.length || 0} submissions</span>
              </div>
            </div>
            
            {isExpanded && (
              <div className="border-t border-gray-200 p-4 space-y-3">
                <p className="text-sm text-gray-600">{assignment.description}</p>
                
                {canEdit && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(assignment)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(assignment.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      {assignments.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No assignments found</p>
        </div>
      )}
    </div>
  );
};

/**
 * Submissions View
 */
const SubmissionsView: React.FC<{
  assignment: Assignment | null;
  onGrade: (submission: AssignmentSubmission) => void;
  canGrade: boolean;
}> = ({ assignment, onGrade, canGrade }) => {
  const [filter, setFilter] = useState<SubmissionStatus | 'all'>('all');

  if (!assignment) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Select an assignment to view submissions</p>
      </div>
    );
  }

  const submissions = assignment.submissions || [];
  const filteredSubmissions = filter === 'all' 
    ? submissions 
    : submissions.filter((s) => s.status === filter);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
          <p className="text-sm text-gray-500">
            {submissions.filter((s) => s.status === 'graded').length}/{submissions.length} graded
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as SubmissionStatus | 'all')}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="submitted">Submitted</option>
          <option value="late">Late</option>
          <option value="graded">Graded</option>
        </select>
      </div>

      {/* Submissions List */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div className="col-span-4">Student</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-2">Submitted</div>
          <div className="col-span-2">Marks</div>
          <div className="col-span-1"></div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredSubmissions.map((submission) => {
            const student = mockData.students.find((s: Student) => s.id === submission.studentId);
            return (
              <div key={submission.id} className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-gray-50">
                <div className="col-span-4">
                  <p className="font-medium text-gray-900">{student?.name}</p>
                  <p className="text-xs text-gray-500">{student?.studentId}</p>
                </div>
                <div className="col-span-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${SUBMISSION_STATUS_CONFIG[submission.status].color}`}>
                    {SUBMISSION_STATUS_CONFIG[submission.status].icon}
                    {SUBMISSION_STATUS_CONFIG[submission.status].label}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-gray-600">
                  {formatDate(submission.submittedAt)}
                </div>
                <div className="col-span-2">
                  {submission.marks !== null ? (
                    <span className={`font-semibold ${
                      (submission.marks / assignment.totalMarks) >= 0.7 
                        ? 'text-green-600' 
                        : (submission.marks / assignment.totalMarks) >= 0.5 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`}>
                      {submission.marks}/{assignment.totalMarks}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div className="col-span-1">
                  {canGrade && (
                    <button
                      onClick={() => onGrade(submission)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Award className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Gradebook View
 */
const GradebookView: React.FC<{
  students: Student[];
  assignments: Assignment[];
  canEdit: boolean;
}> = ({ students, assignments, canEdit }) => {
  const getGradeForStudent = (studentId: string, assignmentId: string): Grade | undefined => {
    return mockData.grades.find((g: Grade) => 
      g.studentId === studentId && g.assignmentId === assignmentId
    );
  };

  const calculateOverallGrade = (studentId: string): { percentage: number; grade: string } => {
    const studentGrades = mockData.grades.filter((g: Grade) => g.studentId === studentId);
    if (studentGrades.length === 0) return { percentage: 0, grade: '-' };
    
    const totalPercentage = studentGrades.reduce((sum, g) => sum + g.percentage, 0);
    const avg = totalPercentage / studentGrades.length;
    
    let grade = 'F';
    if (avg >= 90) grade = 'A';
    else if (avg >= 80) grade = 'B';
    else if (avg >= 70) grade = 'C';
    else if (avg >= 60) grade = 'D';
    
    return { percentage: Math.round(avg), grade };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3 text-left text-sm font-medium text-gray-700 border border-gray-200 sticky left-0 bg-gray-50 min-w-[150px]">
              Student
            </th>
            {assignments.map((assignment) => (
              <th 
                key={assignment.id} 
                className="p-3 text-center text-xs font-medium text-gray-700 border border-gray-200 min-w-[100px]"
              >
                <div className="truncate max-w-[100px]" title={assignment.title}>
                  {assignment.title}
                </div>
                <div className="text-gray-500">({assignment.totalMarks})</div>
              </th>
            ))}
            <th className="p-3 text-center text-sm font-medium text-gray-700 border border-gray-200 bg-blue-50">
              Overall
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const overall = calculateOverallGrade(student.id);
            return (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-200 sticky left-0 bg-white">
                  <p className="text-sm font-medium text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.studentId}</p>
                </td>
                {assignments.map((assignment) => {
                  const grade = getGradeForStudent(student.id, assignment.id);
                  return (
                    <td key={assignment.id} className="p-3 border border-gray-200 text-center">
                      {grade ? (
                        <span className={`font-semibold ${
                          grade.percentage >= 70 
                            ? 'text-green-600' 
                            : grade.percentage >= 50 
                              ? 'text-yellow-600' 
                              : 'text-red-600'
                        }`}>
                          {grade.marks}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  );
                })}
                <td className="p-3 border border-gray-200 text-center bg-blue-50/50">
                  <span className={`font-bold ${
                    overall.percentage >= 70 
                      ? 'text-green-600' 
                      : overall.percentage >= 50 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                  }`}>
                    {overall.grade}
                  </span>
                  <div className="text-xs text-gray-500">{overall.percentage}%</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

/**
 * Assignment & Gradebook Module
 * Complete assignment management and grading system
 */
export const AssignmentGradebook: React.FC<AssignmentGradebookProps> = ({
  classId: initialClassId,
  teacherId,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('assignments');
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId || '');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const { hasPermission, currentRole, currentUserId } = usePermissions();

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

  // Get assignments for selected class
  const assignments = useMemo(() => {
    if (!selectedClassId) return [];
    return mockData.assignments.filter((a: Assignment) => a.classId === selectedClassId);
  }, [selectedClassId]);

  // Get available subjects
  const availableSubjects = useMemo(() => {
    if (!teacherId) return mockData.subjects;
    const teacher = mockData.teachers.find((t: Teacher) => t.id === teacherId);
    if (!teacher) return [];
    return mockData.subjects.filter((s: Subject) => teacher.subjects.includes(s.id));
  }, [teacherId]);

  // Check permissions
  const canCreate = hasPermission('create.assignment');
  const canEdit = hasPermission('edit.assignment');
  const canGrade = hasPermission('grade.assignment');
  const canViewGradebook = hasPermission('view.gradebook.all') || hasPermission('view.reports.student');

  // Handle create assignment
  const handleCreateAssignment = (data: Partial<Assignment>) => {
    console.log('[AssignmentGradebook] Creating assignment:', data);
    // In real app, this would save to database
    setIsCreateModalOpen(false);
  };

  // Handle grade submission
  const handleGradeSubmission = (submissionId: string, marks: number, feedback: string) => {
    console.log('[AssignmentGradebook] Grading submission:', { submissionId, marks, feedback });
    // In real app, this would save to database
    setIsGradeModalOpen(false);
  };

  // Handle edit assignment
  const handleEditAssignment = (assignment: Assignment) => {
    console.log('[AssignmentGradebook] Editing assignment:', assignment);
    setSelectedAssignment(assignment);
  };

  // Handle delete assignment
  const handleDeleteAssignment = (assignmentId: string) => {
    console.log('[AssignmentGradebook] Deleting assignment:', assignmentId);
    if (confirm('Are you sure you want to delete this assignment?')) {
      // In real app, this would delete from database
    }
  };

  // Handle grade button click
  const handleGradeClick = (submission: AssignmentSubmission) => {
    setGradingSubmission(submission);
    setIsGradeModalOpen(true);
  };

  // Console demonstration
  useEffect(() => {
    console.log('\n========== FEATURE 10: ASSIGNMENT & GRADEBOOK ==========\n');
    console.log(`[AssignmentGradebook] Current Role: ${currentRole}`);
    console.log(`[AssignmentGradebook] Current User: ${currentUserId}`);
    console.log(`[AssignmentGradebook] Selected Class: ${selectedClassId || 'None'}`);
    console.log(`[AssignmentGradebook] Students: ${students.length}`);
    console.log(`[AssignmentGradebook] Assignments: ${assignments.length}`);
    console.log(`[AssignmentGradebook] create.assignment permission: ${canCreate}`);
    console.log(`[AssignmentGradebook] edit.assignment permission: ${canEdit}`);
    console.log(`[AssignmentGradebook] grade.assignment permission: ${canGrade}`);
    console.log(`[AssignmentGradebook] view.gradebook.all permission: ${canViewGradebook}`);
  }, [currentRole, currentUserId, selectedClassId, students.length, assignments.length, canCreate, canEdit, canGrade, canViewGradebook]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Assignments & Gradebook</h2>
            <p className="text-sm text-gray-500">
              {selectedClassId 
                ? `${assignments.length} assignments • ${students.length} students`
                : 'Select a class to view assignments'
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
          onChange={(e) => {
            setSelectedClassId(e.target.value);
            setSelectedAssignment(null);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Class...</option>
          {availableClasses.map((cls: ClassGrade) => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setViewMode('assignments')}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              viewMode === 'assignments' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Assignments
          </button>
          <button
            onClick={() => setViewMode('submissions')}
            disabled={!selectedAssignment}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              viewMode === 'submissions' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-200 disabled:opacity-50'
            }`}
          >
            Submissions
          </button>
          {canViewGradebook && (
            <button
              onClick={() => setViewMode('gradebook')}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                viewMode === 'gradebook' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Gradebook
            </button>
          )}
        </div>

        {/* Create Button */}
        {canCreate && selectedClassId && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New Assignment
          </button>
        )}
      </div>

      {/* Content */}
      {selectedClassId ? (
        <>
          {viewMode === 'assignments' && (
            <AssignmentsList
              assignments={assignments}
              onEdit={handleEditAssignment}
              onDelete={handleDeleteAssignment}
              canEdit={canEdit}
            />
          )}
          
          {viewMode === 'submissions' && (
            <SubmissionsView
              assignment={selectedAssignment || assignments[0] || null}
              onGrade={handleGradeClick}
              canGrade={canGrade}
            />
          )}
          
          {viewMode === 'gradebook' && canViewGradebook && (
            <GradebookView
              students={students}
              assignments={assignments}
              canEdit={canEdit}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Select a class to view assignments</p>
        </div>
      )}

      {/* Create Assignment Modal */}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateAssignment}
        classes={availableClasses}
        subjects={availableSubjects}
      />

      {/* Grade Entry Modal */}
      <GradeEntryModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        onSave={handleGradeSubmission}
        submission={gradingSubmission}
        assignment={selectedAssignment || assignments[0] || null}
        student={gradingSubmission 
          ? mockData.students.find((s: Student) => s.id === gradingSubmission.studentId) || null
          : null
        }
      />
    </div>
  );
};

export default AssignmentGradebook;
