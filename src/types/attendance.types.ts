export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  periodId: string;
  status: AttendanceStatus;
  markedBy: string;
  remarks?: string;
  arrivedAt?: string;
  createdAt: string;
  updatedAt: string;
}
