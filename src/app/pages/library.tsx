/**
 * SETU Education Management System - Library Page
 * Integrated with LibrarySystem component with parent borrowing restrictions
 */

import { useOutletContext } from "react-router";
import { LibrarySystem } from "../components/communication";
import type { Role } from "../types";

export default function LibraryPage() {
  const { role } = useOutletContext<{ role: Role }>();

  return (
    <div className="p-6">
      <LibrarySystem 
        role={role}
        userId="user-001"
        userName="Current User"
        studentId={role === 'student' ? 'student-001' : undefined}
      />
    </div>
  );
}
