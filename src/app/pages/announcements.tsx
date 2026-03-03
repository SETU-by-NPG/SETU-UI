/**
 * SETU Education Management System - Announcements Page
 * Integrated with AnnouncementSystem component
 */

import { useOutletContext } from "react-router";
import { AnnouncementSystem } from "../components/communication";
import type { Role } from "../types";

export default function AnnouncementsPage() {
  const { role } = useOutletContext<{ role: Role }>();

  return (
    <div className="p-6">
      <AnnouncementSystem 
        role={role}
        userId="user-001"
        userName="Current User"
        classId="class-010"
      />
    </div>
  );
}
