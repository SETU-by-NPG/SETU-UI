import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Calendar,
  ClipboardCheck, BarChart3, Bell, Settings, Menu, X, LogOut,
  ChevronDown, School, UserCheck, FileText, MessageSquare,
  Shield, ScrollText, Library, DoorOpen, Monitor, TicketCheck
} from "lucide-react";
import { type Role } from "../data/mock-data";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  section?: string;
}

const navByRole: Record<Role, NavItem[]> = {
  admin: [
    { label: "Dashboard", path: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "User Management", path: "/user-management", icon: <Users className="w-5 h-5" />, section: "Identity" },
    { label: "Roles & Permissions", path: "/roles-permissions", icon: <Shield className="w-5 h-5" /> },
    { label: "Student Profiles", path: "/students", icon: <GraduationCap className="w-5 h-5" />, section: "People" },
    { label: "Teacher Profiles", path: "/teachers", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Room Management", path: "/rooms", icon: <DoorOpen className="w-5 h-5" />, section: "Resources" },
    { label: "IT Equipment", path: "/equipment", icon: <Monitor className="w-5 h-5" /> },
    { label: "Support Tickets", path: "/tickets", icon: <TicketCheck className="w-5 h-5" />, section: "Operations" },
    { label: "Messages", path: "/messages", icon: <MessageSquare className="w-5 h-5" /> },
    { label: "Announcements", path: "/announcements", icon: <Bell className="w-5 h-5" /> },
    { label: "Reports", path: "/reports", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Audit Logs", path: "/audit-logs", icon: <ScrollText className="w-5 h-5" />, section: "System" },
    { label: "System Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
  ],
  teacher: [
    { label: "Dashboard", path: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "My Classes", path: "/students", icon: <Users className="w-5 h-5" /> },
    { label: "Attendance", path: "/attendance", icon: <ClipboardCheck className="w-5 h-5" /> },
    { label: "Assignments", path: "/assignments", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Gradebook", path: "/gradebook", icon: <FileText className="w-5 h-5" /> },
    { label: "Timetable", path: "/timetable", icon: <Calendar className="w-5 h-5" /> },
    { label: "Library", path: "/library", icon: <Library className="w-5 h-5" /> },
    { label: "IT Equipment", path: "/equipment", icon: <Monitor className="w-5 h-5" /> },
    { label: "Support Tickets", path: "/tickets", icon: <TicketCheck className="w-5 h-5" /> },
    { label: "Messages", path: "/messages", icon: <MessageSquare className="w-5 h-5" /> },
  ],
  student: [
    { label: "Dashboard", path: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Assignments", path: "/assignments", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Grades", path: "/gradebook", icon: <FileText className="w-5 h-5" /> },
    { label: "Timetable", path: "/timetable", icon: <Calendar className="w-5 h-5" /> },
    { label: "Attendance", path: "/attendance", icon: <ClipboardCheck className="w-5 h-5" /> },
    { label: "Library", path: "/library", icon: <Library className="w-5 h-5" /> },
    { label: "Announcements", path: "/announcements", icon: <Bell className="w-5 h-5" /> },
  ],
  parent: [
    { label: "Dashboard", path: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Attendance", path: "/attendance", icon: <ClipboardCheck className="w-5 h-5" /> },
    { label: "Grades", path: "/gradebook", icon: <FileText className="w-5 h-5" /> },
    { label: "Assignments", path: "/assignments", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Library", path: "/library", icon: <Library className="w-5 h-5" /> },
    { label: "Messages", path: "/messages", icon: <MessageSquare className="w-5 h-5" /> },
    { label: "Report Card", path: "/reports", icon: <BarChart3 className="w-5 h-5" /> },
  ],
  librarian: [
    { label: "Dashboard", path: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Library", path: "/library", icon: <Library className="w-5 h-5" /> },
    { label: "Messages", path: "/messages", icon: <MessageSquare className="w-5 h-5" /> },
    { label: "Announcements", path: "/announcements", icon: <Bell className="w-5 h-5" /> },
  ],
};

const roleLabels: Record<Role, string> = {
  admin: "IT Administrator",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
  librarian: "Librarian",
};

const roleNames: Record<Role, string> = {
  admin: "Dr. Sarah Mitchell",
  teacher: "Mr. John Williams",
  student: "Alice Johnson",
  parent: "Robert Johnson",
  librarian: "Ms. Priya Nair",
};

const emailToRole: Record<string, Role> = {
  "sarah.mitchell@setu.edu": "admin",
  "john.w@setu.edu": "teacher",
  "alice@setu.edu": "student",
  "robert@email.com": "parent",
  "priya.n@setu.edu": "librarian",
};

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<Role>("admin");
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check auth on mount
  useEffect(() => {
    const authStr = localStorage.getItem("setu_auth");
    if (!authStr) {
      navigate("/login");
      return;
    }
    try {
      const auth = JSON.parse(authStr);
      const detectedRole = emailToRole[auth.email];
      if (detectedRole) {
        setRole(detectedRole);
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const navItems = navByRole[role];

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setRoleMenuOpen(false);
    const emailMap: Record<Role, string> = {
      admin: "sarah.mitchell@setu.edu",
      teacher: "john.w@setu.edu",
      student: "alice@setu.edu",
      parent: "robert@email.com",
      librarian: "priya.n@setu.edu",
    };
    localStorage.setItem("setu_auth", JSON.stringify({ email: emailMap[newRole], role: roleLabels[newRole] }));
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("setu_auth");
    navigate("/login");
  };

  // Group nav items by section for admin
  const renderNav = () => {
    if (role === "admin") {
      let lastSection: string | undefined;
      return navItems.map((item, idx) => {
        const showSection = item.section && item.section !== lastSection;
        if (item.section) lastSection = item.section;
        return (
          <div key={item.path}>
            {showSection && (
              <p className="px-3 pt-4 pb-1 text-muted-foreground" style={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {item.section}
              </p>
            )}
            <NavLink
              to={item.path}
              end={item.path === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              {item.icon}
              <span style={{ fontSize: "0.875rem" }}>{item.label}</span>
            </NavLink>
          </div>
        );
      });
    }

    return navItems.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.path === "/"}
        onClick={() => setSidebarOpen(false)}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`
        }
      >
        {item.icon}
        <span style={{ fontSize: "0.875rem" }}>{item.label}</span>
      </NavLink>
    ));
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <School className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="tracking-tight" style={{ fontSize: "1.125rem", fontWeight: 600 }}>SETU</span>
          <button
            className="ml-auto lg:hidden p-1 rounded-md hover:bg-muted"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-0.5">
            {renderNav()}
          </div>
        </nav>

        {/* User / Role Switcher */}
        <div className="border-t border-border p-3">
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="truncate" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{roleNames[role]}</p>
                <p className="text-muted-foreground truncate" style={{ fontSize: "0.75rem" }}>{roleLabels[role]}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${roleMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {roleMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                <p className="px-3 py-2 text-muted-foreground border-b border-border" style={{ fontSize: "0.75rem", fontWeight: 500 }}>Switch Role</p>
                {(["admin", "teacher", "student", "parent", "librarian"] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-center justify-between ${
                      role === r ? "bg-muted" : ""
                    }`}
                    style={{ fontSize: "0.875rem" }}
                  >
                    <span>{roleLabels[r]}</span>
                    {role === r && <span className="text-primary" style={{ fontSize: "0.75rem" }}>Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center px-4 lg:px-6 gap-4 shrink-0">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <span
            className="hidden sm:inline px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
            style={{ fontSize: "0.75rem", fontWeight: 500 }}
          >
            {roleLabels[role]}
          </span>
          <button className="relative p-2 rounded-md hover:bg-muted">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </button>
          <button onClick={handleLogout} className="p-2 rounded-md hover:bg-muted" title="Sign out">
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet context={{ role }} />
        </main>
      </div>
    </div>
  );
}
