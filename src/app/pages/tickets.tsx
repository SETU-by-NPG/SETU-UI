/**
 * SETU Education Management System - Tickets Page
 * Integrated with TicketSystem component with parent submission restrictions
 */

import { useOutletContext } from "react-router";
import { TicketSystem } from "../components/communication";
import type { Role } from "../types";

export default function TicketsPage() {
  const { role } = useOutletContext<{ role: Role }>();

  return (
    <div className="p-6">
      <TicketSystem 
        role={role}
        userId="user-001"
        userName="Current User"
      />
    </div>
  );
}
