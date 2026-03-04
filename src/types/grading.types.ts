export type AssessmentType =
  | "CLASSWORK"
  | "HOMEWORK"
  | "TEST"
  | "MOCK_EXAM"
  | "PROJECT"
  | "EXAM";
export type LetterGrade =
  | "A*"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "U"
  | "DISTINCTION"
  | "MERIT"
  | "PASS";
export type AssignmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
export type SubmissionType = "ONLINE_TEXT" | "FILE_UPLOAD" | "BOTH";
export type SubmissionStatus =
  | "PENDING"
  | "SUBMITTED"
  | "LATE"
  | "GRADED"
  | "RETURNED";

export interface GradeEntry {
  id: string;
  studentId: string;
  subjectId: string;
  academicYearId: string;
  termId: string;
  assessmentType: AssessmentType;
  assessmentName: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  letterGrade: LetterGrade;
  remarks?: string;
  enteredBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  organisationId: string;
  classIds: string[];
  subjectId: string;
  teacherId: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  attachmentUrls: string[];
  status: AssignmentStatus;
  allowLateSubmissions: boolean;
  submissionType: SubmissionType;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionText?: string;
  attachmentNames: string[];
  submittedAt: string;
  isLate: boolean;
  marksObtained?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  status: SubmissionStatus;
}
