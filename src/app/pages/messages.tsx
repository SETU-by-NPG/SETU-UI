/**
 * SETU Education Management System - Messages Page
 * Integrated with MessagingSystem component with role-based restrictions
 */

import { useOutletContext } from "react-router";
import { MessagingSystem } from "../components/communication";
import type { Role } from "../types";

export default function MessagesPage() {
  const { role } = useOutletContext<{ role: Role }>();

  // Mock allocated teachers for students
  const allocatedTeacherIds = ['teacher-001', 'teacher-002', 'teacher-003'];

  return (
    <div className="p-6">
      <MessagingSystem 
        role={role}
        userId="user-001"
        userName="Current User"
        allocatedTeacherIds={role === 'student' ? allocatedTeacherIds : undefined}
        classId="class-010"
      />
    </div>
  );
}
