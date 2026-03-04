import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  UsersRound,
  Calendar,
  CheckSquare,
  BookOpen,
  AlertTriangle,
  Shield,
  Heart,
  Library,
  UserPlus,
  ClipboardList,
  Briefcase,
  Building2,
  BookMarked,
  Cpu,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Settings,
  Bell,
  User,
  GraduationCap,
  FlaskConical,
  Trophy,
  Newspaper,
  MessageSquare,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Role } from "@/types";

interface NavItem {
  label: string;
  path?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  badge?: string | number;
  requiredRoles?: Role[];
}

const ALL_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    label: "Students",
    icon: Users,
    requiredRoles: [
      "MASTER_ADMIN",
      "IT_ADMINISTRATOR",
      "HEAD_OF_SCHOOL",
      "SLT_MEMBER",
      "HEAD_OF_DEPARTMENT",
      "HEAD_OF_YEAR",
      "TEACHER",
      "COVER_SUPERVISOR",
      "SAFEGUARDING_LEAD",
      "SENCO",
      "ATTENDANCE_WELFARE_OFFICER",
      "DATA_MANAGER",
    ],
    children: [
      { label: "All Students", path: "/students", icon: Users },
      { label: "Attendance", path: "/attendance", icon: CheckSquare },
      { label: "Behaviour & Rewards", path: "/incidents", icon: AlertTriangle },
      {
        label: "Safeguarding",
        path: "/safeguarding",
        icon: Shield,
        requiredRoles: [
          "MASTER_ADMIN",
          "HEAD_OF_SCHOOL",
          "SLT_MEMBER",
          "SAFEGUARDING_LEAD",
        ],
      },
      {
        label: "SEN Register",
        path: "/sen",
        icon: Heart,
        requiredRoles: [
          "MASTER_ADMIN",
          "HEAD_OF_SCHOOL",
          "SLT_MEMBER",
          "SENCO",
          "TEACHER",
          "TEACHING_ASSISTANT",
        ],
      },
    ],
  },
  {
    label: "Teaching & Learning",
    icon: BookOpen,
    requiredRoles: [
      "MASTER_ADMIN",
      "IT_ADMINISTRATOR",
      "HEAD_OF_SCHOOL",
      "SLT_MEMBER",
      "HEAD_OF_DEPARTMENT",
      "HEAD_OF_YEAR",
      "TEACHER",
      "COVER_SUPERVISOR",
      "TEACHING_ASSISTANT",
    ],
    children: [
      { label: "Timetable", path: "/timetable", icon: Calendar },
      { label: "Assignments", path: "/assignments", icon: ClipboardList },
      { label: "Grades", path: "/grades", icon: BarChart3 },
      {
        label: "Cover Manager",
        path: "/cover",
        icon: UsersRound,
        requiredRoles: [
          "MASTER_ADMIN",
          "HEAD_OF_SCHOOL",
          "SLT_MEMBER",
          "HEAD_OF_DEPARTMENT",
        ],
      },
      {
        label: "Science Labs",
        path: "/lab",
        icon: FlaskConical,
        requiredRoles: [
          "MASTER_ADMIN",
          "HEAD_OF_SCHOOL",
          "SLT_MEMBER",
          "HEAD_OF_DEPARTMENT",
          "SCIENCE_TECHNICIAN",
        ],
      },
      {
        label: "Library",
        path: "/library",
        icon: Library,
        requiredRoles: [
          "MASTER_ADMIN",
          "HEAD_OF_SCHOOL",
          "SLT_MEMBER",
          "LIBRARIAN",
          "TEACHER",
        ],
      },
      {
        label: "Examinations",
        path: "/examinations",
        icon: GraduationCap,
        requiredRoles: [
          "MASTER_ADMIN",
          "HEAD_OF_SCHOOL",
          "SLT_MEMBER",
          "EXAMINATIONS_OFFICER",
        ],
      },
    ],
  },
  {
    label: "Communication",
    icon: MessageSquare,
    children: [
      { label: "Messages", path: "/messages", icon: MessageSquare },
      { label: "Announcements", path: "/announcements", icon: Newspaper },
    ],
  },
  {
    label: "Staff",
    icon: UsersRound,
    requiredRoles: [
      "MASTER_ADMIN",
      "IT_ADMINISTRATOR",
      "HEAD_OF_SCHOOL",
      "SLT_MEMBER",
      "HR_MANAGER",
      "DATA_MANAGER",
    ],
    children: [
      { label: "Staff Directory", path: "/staff", icon: UsersRound },
      {
        label: "HR",
        path: "/hr",
        icon: Briefcase,
        requiredRoles: ["MASTER_ADMIN", "HEAD_OF_SCHOOL", "HR_MANAGER"],
      },
    ],
  },
  {
    label: "Operations",
    icon: Building2,
    requiredRoles: [
      "MASTER_ADMIN",
      "IT_ADMINISTRATOR",
      "HEAD_OF_SCHOOL",
      "SLT_MEMBER",
      "ADMISSIONS_OFFICER",
      "FINANCE_MANAGER",
      "FACILITIES_MANAGER",
      "CAREERS_ADVISOR",
      "DATA_MANAGER",
    ],
    children: [
      {
        label: "Admissions",
        path: "/admissions",
        icon: UserPlus,
        requiredRoles: [
          "MASTER_ADMIN",
          "HEAD_OF_SCHOOL",
          "SLT_MEMBER",
          "ADMISSIONS_OFFICER",
        ],
      },
      {
        label: "Finance",
        path: "/finance",
        icon: BookMarked,
        requiredRoles: ["MASTER_ADMIN", "HEAD_OF_SCHOOL", "FINANCE_MANAGER"],
      },
      {
        label: "Facilities",
        path: "/facilities",
        icon: Building2,
        requiredRoles: [
          "MASTER_ADMIN",
          "HEAD_OF_SCHOOL",
          "FACILITIES_MANAGER",
          "IT_ADMINISTRATOR",
        ],
      },
      {
        label: "Careers",
        path: "/careers",
        icon: Trophy,
        requiredRoles: [
          "MASTER_ADMIN",
          "HEAD_OF_SCHOOL",
          "SLT_MEMBER",
          "CAREERS_ADVISOR",
          "TEACHER",
        ],
      },
    ],
  },
  {
    label: "Leadership",
    icon: BarChart3,
    requiredRoles: ["MASTER_ADMIN", "HEAD_OF_SCHOOL", "SLT_MEMBER"],
    children: [
      { label: "Dashboard", path: "/leadership", icon: BarChart3 },
      { label: "Reports", path: "/reports", icon: ClipboardList },
    ],
  },
  {
    label: "IT Admin",
    icon: Cpu,
    requiredRoles: ["MASTER_ADMIN", "IT_ADMINISTRATOR", "IT_TECHNICIAN"],
    children: [
      { label: "System Health", path: "/it-admin", icon: Cpu },
      { label: "Audit Logs", path: "/it-admin/audit", icon: ClipboardList },
      { label: "User Management", path: "/it-admin/users", icon: Users },
    ],
  },
];

function hasAccess(item: NavItem, role: Role): boolean {
  if (!item.requiredRoles || item.requiredRoles.length === 0) return true;
  return item.requiredRoles.includes(role);
}

function NavLeaf({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation();
  const isActive = item.path
    ? location.pathname === item.path ||
      location.pathname.startsWith(item.path + "/")
    : false;

  if (collapsed && item.path) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={item.path}
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-lg mx-auto transition-colors",
              isActive
                ? "bg-sidebar-active-bg text-sidebar-active-tx"
                : "text-sidebar-text hover:bg-white/10 hover:text-white",
            )}
          >
            <item.icon className="h-4 w-4" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  if (!item.path) return null;

  return (
    <Link
      to={item.path}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-sidebar-active-bg text-sidebar-active-tx font-medium"
          : "text-sidebar-text hover:bg-white/10 hover:text-white",
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function NavGroup({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation();
  const isAnyChildActive = item.children?.some(
    (c) =>
      c.path &&
      (location.pathname === c.path ||
        location.pathname.startsWith(c.path + "/")),
  );
  const [open, setOpen] = useState(isAnyChildActive ?? false);

  if (collapsed) {
    return (
      <div className="mb-0.5">
        {item.children?.map((child) =>
          child.path ? (
            <NavLeaf key={child.path} item={child} collapsed={true} />
          ) : null,
        )}
      </div>
    );
  }

  return (
    <div className="mb-0.5">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
          isAnyChildActive
            ? "text-white"
            : "text-sidebar-text hover:bg-white/10 hover:text-white",
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left truncate">{item.label}</span>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
      </button>
      {open && (
        <div className="ml-4 mt-0.5 border-l border-white/10 pl-2">
          {item.children?.map((child) => (
            <NavLeaf
              key={child.path ?? child.label}
              item={child}
              collapsed={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const { role, name, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const visibleItems = ALL_NAV_ITEMS.filter(
    (item) => role && hasAccess(item, role),
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col bg-sidebar-bg border-r border-white/10 transition-all duration-200 shrink-0",
          sidebarCollapsed ? "w-14" : "w-56",
        )}
        style={{ minHeight: "100vh" }}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-14 border-b border-white/10 shrink-0",
            sidebarCollapsed ? "justify-center px-2" : "px-4 gap-2.5",
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
            S
          </div>
          {!sidebarCollapsed && (
            <div>
              <div className="text-white font-bold text-sm leading-none">
                SETU
              </div>
              <div className="text-sidebar-text text-[10px]">
                Hartfield Academy
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 py-3">
          <nav
            className={cn("space-y-0.5", sidebarCollapsed ? "px-1" : "px-2")}
          >
            {visibleItems.map((item) =>
              item.children ? (
                <NavGroup
                  key={item.label}
                  item={item}
                  collapsed={sidebarCollapsed}
                />
              ) : (
                <NavLeaf
                  key={item.path ?? item.label}
                  item={item}
                  collapsed={sidebarCollapsed}
                />
              ),
            )}
          </nav>
        </ScrollArea>

        {/* Bottom actions */}
        <div
          className={cn(
            "border-t border-white/10 py-3 space-y-1",
            sidebarCollapsed ? "px-1" : "px-2",
          )}
        >
          {[
            { icon: Bell, label: "Notifications", path: "/notifications" },
            { icon: Settings, label: "Settings", path: "/settings" },
            { icon: User, label: "My Profile", path: "/profile" },
          ].map(({ icon: Icon, label, path }) =>
            sidebarCollapsed ? (
              <Tooltip key={path}>
                <TooltipTrigger asChild>
                  <Link
                    to={path}
                    className="flex items-center justify-center w-9 h-9 rounded-lg mx-auto text-sidebar-text hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ) : (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-text hover:bg-white/10 hover:text-white transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ),
          )}

          {/* Logout */}
          {sidebarCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={logout}
                  className="flex items-center justify-center w-9 h-9 rounded-lg mx-auto text-sidebar-text hover:bg-red-500/20 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign Out</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-text hover:bg-red-500/20 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          )}

          {/* User info + collapse toggle */}
          <div
            className={cn(
              "flex items-center border-t border-white/10 pt-3 mt-1",
              sidebarCollapsed ? "justify-center" : "gap-2.5 px-1",
            )}
          >
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-medium truncate">
                  {name}
                </div>
                <div className="text-sidebar-text text-[10px] truncate">
                  {role?.replace(/_/g, " ")}
                </div>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sidebar-text hover:bg-white/10 hover:text-white transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
