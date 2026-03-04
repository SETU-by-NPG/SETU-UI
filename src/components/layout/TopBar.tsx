import { Search, Bell, WifiOff, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { demoUsers } from "@/data/seed/users";
import type { Role } from "@/types";

const ROLE_LABELS: Record<Role, string> = {
  MASTER_ADMIN: "System Admin",
  IT_ADMINISTRATOR: "IT Administrator",
  IT_TECHNICIAN: "IT Technician",
  HEAD_OF_SCHOOL: "Head of School",
  FINANCE_MANAGER: "Finance Manager",
  HR_MANAGER: "HR Manager",
  ADMISSIONS_OFFICER: "Admissions Officer",
  DATA_MANAGER: "Data Manager",
  FACILITIES_MANAGER: "Facilities Manager",
  SLT_MEMBER: "SLT Member",
  HEAD_OF_DEPARTMENT: "Head of Department",
  HEAD_OF_YEAR: "Head of Year",
  EXAMINATIONS_OFFICER: "Examinations Officer",
  SAFEGUARDING_LEAD: "Safeguarding Lead",
  SENCO: "SENCO",
  ATTENDANCE_WELFARE_OFFICER: "Attendance Officer",
  CAREERS_ADVISOR: "Careers Advisor",
  TEACHER: "Teacher",
  COVER_SUPERVISOR: "Cover Supervisor",
  TEACHING_ASSISTANT: "Teaching Assistant",
  LIBRARIAN: "Librarian",
  SCIENCE_TECHNICIAN: "Science Technician",
  SUBJECT_TECHNICIAN: "Subject Technician",
  STUDENT: "Student",
  STUDENT_LEADERSHIP: "Student Leader",
  PARENT: "Parent/Guardian",
  SUPPORT_STAFF: "Support Staff",
};

export function TopBar({ title }: { title?: string }) {
  const { name, role, avatarInitials, switchRole, logout } = useAuthStore();
  const { isOffline, openCommandPalette } = useUIStore();
  const { unreadCount } = useNotificationStore();

  return (
    <header className="flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-4 shrink-0">
      {/* Page title */}
      {title && (
        <h1 className="text-base font-semibold text-gray-900 hidden md:block">
          {title}
        </h1>
      )}

      {/* Search trigger */}
      <button
        onClick={openCommandPalette}
        className="flex flex-1 max-w-sm items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400 hover:border-gray-300 hover:bg-white transition-colors"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-white px-1.5 font-mono text-[10px] text-gray-500">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      {/* Offline indicator */}
      {isOffline && (
        <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-200">
          <WifiOff className="h-3.5 w-3.5" />
          Offline
        </div>
      )}

      {/* Notifications */}
      <Link to="/notifications" className="relative">
        <Button variant="ghost" size="icon-sm" className="text-gray-500">
          <Bell className="h-4 w-4" />
        </Button>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Link>

      {/* Role switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs bg-primary text-white">
                {avatarInitials ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <div className="text-xs font-medium text-gray-900 leading-none">
                {name}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                {role ? ROLE_LABELS[role] : ""}
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-white text-sm">
                  {avatarInitials ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-sm text-gray-900">
                  {name}
                </div>
                <div className="text-xs text-gray-500">
                  {role ? ROLE_LABELS[role] : ""}
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            Switch Role (Demo)
          </DropdownMenuLabel>
          <div className="max-h-48 overflow-y-auto">
            {demoUsers.map((u) => (
              <DropdownMenuItem
                key={u.userId}
                onClick={() => switchRole(u.userId)}
                className="gap-2"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px] bg-gray-200 text-gray-700">
                    {u.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{u.name}</div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {u.role.replace(/_/g, " ")}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile">My Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logout}
            className="text-red-600 focus:text-red-600"
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
