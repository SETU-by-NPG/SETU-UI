export type ExamBoard = "AQA" | "OCR" | "EDEXCEL" | "WJEC" | "CIE" | "OTHER";
export type ExamEntryStatus = "ENTERED" | "PENDING" | "WITHDRAWAL_REQUESTED";
export type InvigilationStatus = "ASSIGNED" | "NEEDS_COVER";
export type JCQItemStatus = "COMPLETE" | "PENDING" | "OVERDUE";

export interface ExamEntry {
  id: string;
  organisationId: string;
  studentId: string;
  subjectId: string;
  examBoard: ExamBoard;
  component: string;
  entryStatus: ExamEntryStatus;
  hasAccessArrangements: boolean;
  uciNumber?: string;
  entryType: "STANDARD" | "PRIVATE_CANDIDATE";
  createdAt: string;
}

export interface ExamTimetableSlot {
  id: string;
  organisationId: string;
  subjectId: string;
  examBoard: ExamBoard;
  paperComponent: string;
  date: string;
  startTime: string;
  duration: number;
  roomId: string;
  candidateCount: number;
  createdAt: string;
}

export interface InvigilationAssignment {
  id: string;
  examSlotId: string;
  organisationId: string;
  leadInvigilatorId: string;
  additionalInvigilatorIds: string[];
  status: InvigilationStatus;
  createdAt: string;
}

export interface JCQComplianceItem {
  id: string;
  organisationId: string;
  description: string;
  isComplete: boolean;
  notes?: string;
  responsibleStaffId?: string;
  dueDate?: string;
  updatedAt: string;
}
