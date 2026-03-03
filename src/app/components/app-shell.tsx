import { useState, useEffect, useMemo } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  BarChart3,
  Bell,
  Settings,
  X,
  LogOut,
  ChevronDown,
  School,
  UserCheck,
  FileText,
  MessageSquare,
  Shield,
  ScrollText,
  Library,
  DoorOpen,
  Monitor,
  TicketCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import type { Role } from "../types";
import { notifications } from "../data/mock-data";
import { mockUsers } from "../data/mock-data";
import {
  navigationByRole,
  roleDisplayNames,
  roleCategories,
  demoRoleEmails,
} from "../data/permissions";

// ── Icon map: string key → JSX element ──────────────────────────────────────
const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  ClipboardCheck: <ClipboardCheck className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Bell: <Bell className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  MessageSquare: <MessageSquare className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  ScrollText: <ScrollText className="w-5 h-5" />,
  Library: <Library className="w-5 h-5" />,
  DoorOpen: <DoorOpen className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
  TicketCheck: <TicketCheck className="w-5 h-5" />,
  School: <School className="w-5 h-5" />,
};

// Inverse email→role lookup built from demoRoleEmails
const emailToRole: Record<string, Role> = Object.fromEntries(
  (Object.entries(demoRoleEmails) as [Role, string][]).map(([r, email]) => [
    email,
    r,
  ]),
);

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<Role>("master_admin");
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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

  const navItems = navigationByRole[role] ?? navigationByRole["master_admin"];

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setRoleMenuOpen(false);
    const email = demoRoleEmails[newRole];
    localStorage.setItem(
      "setu_auth",
      JSON.stringify({ email, role: roleDisplayNames[newRole] }),
    );
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("setu_auth");
    navigate("/login");
  };

  // Current demo user info
  const demoUser = useMemo(
    () => mockUsers.find((u) => u.role === role),
    [role],
  );

  // Render nav items — always use section headers
  const renderNav = () => {
    let lastSection: string | undefined;
    return navItems.map((item) => {
      const icon = iconMap[item.icon] ?? (
        <LayoutDashboard className="w-5 h-5" />
      );
      const showSection = item.section && item.section !== lastSection;
      if (item.section) lastSection = item.section;
      return (
        <div key={`${item.path}-${item.label}`}>
          {showSection && !sidebarCollapsed && (
            <p
              className="px-3 pt-4 pb-1 text-muted-foreground"
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {item.section}
            </p>
          )}
          <NavLink
            to={item.path}
            end={item.path === "/"}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${sidebarCollapsed ? "justify-center" : ""} ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <span
              className={
                sidebarCollapsed
                  ? "w-6 h-6 flex items-center justify-center"
                  : ""
              }
            >
              {icon}
            </span>
            {!sidebarCollapsed && (
              <span style={{ fontSize: "0.875rem" }}>{item.label}</span>
            )}
          </NavLink>
        </div>
      );
    });
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 ${sidebarCollapsed ? "w-20" : "w-64"} bg-card border-r border-border flex flex-col transition-all duration-300 ${
          sidebarOpen
            ? "translate-x-0 z-40"
            : "-translate-x-full md:translate-x-0 md:z-30"
        }`}
      >
        {sidebarOpen && (
          <button
            className="absolute top-3 right-3 p-1 rounded-md hover:bg-muted md:hidden"
            onClick={() => setSidebarOpen(false)}
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-0.5">{renderNav()}</div>
        </nav>

        {/* User / Role Switcher */}
        <div
          className={`border-t border-border ${sidebarCollapsed ? "p-1" : "p-3"}`}
        >
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4 text-muted-foreground" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 text-left min-w-0">
                  <p
                    className="truncate"
                    style={{ fontSize: "0.875rem", fontWeight: 500 }}
                  >
                    {demoUser?.name ?? roleDisplayNames[role]}
                  </p>
                  <p
                    className="text-muted-foreground truncate"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {roleDisplayNames[role]}
                    {demoUser?.sltPermissions?.isSLT && (
                      <span className="ml-1 text-blue-500">· SLT</span>
                    )}
                  </p>
                </div>
              )}
              {!sidebarCollapsed && (
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${roleMenuOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {roleMenuOpen && (
              <div
                className={`absolute bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 ${
                  sidebarCollapsed
                    ? "bottom-full left-0 mb-2 w-56"
                    : "bottom-full left-0 right-0 mb-1"
                }`}
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <p
                  className="px-3 py-2 text-muted-foreground border-b border-border sticky top-0 bg-card"
                  style={{ fontSize: "0.75rem", fontWeight: 500 }}
                >
                  Switch Role
                </p>
                {(
                  Object.entries(roleCategories) as [
                    import("../types").RoleCategory,
                    { label: string; roles: Role[] },
                  ][]
                ).map(([, { label, roles }]) => (
                  <div key={label}>
                    <p
                      className="px-3 pt-3 pb-1 text-muted-foreground"
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {label}
                    </p>
                    {roles.map((r) => (
                      <button
                        key={r}
                        onClick={() => handleRoleChange(r)}
                        className={`w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-center justify-between ${
                          role === r ? "bg-muted" : ""
                        }`}
                        style={{ fontSize: "0.875rem" }}
                      >
                        <span>{roleDisplayNames[r]}</span>
                        {role === r && (
                          <span
                            className="text-primary"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Active
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-w-0 pt-16 transition-all duration-300 ml-0 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {/* Top Bar */}
        <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-card flex justify-between items-center px-4 lg:px-6 shrink-0 z-50">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <School className="w-5 h-5 text-primary-foreground" />
            </div>
            <span
              className="tracking-tight"
              style={{ fontSize: "1.125rem", fontWeight: 600 }}
            >
              SETU
            </span>
            <button
              className="p-2 rounded-md hover:bg-muted"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setSidebarOpen(!sidebarOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className="hidden sm:inline px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
              style={{ fontSize: "0.75rem", fontWeight: 500 }}
            >
              {roleDisplayNames[role]}
            </span>
            <button className="relative p-2 rounded-md hover:bg-muted">
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative rounded-full p-1.5 text-foreground hover:bg-accent"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-card" />
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border bg-card shadow-lg z-50">
                    <div className="border-b p-4">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-muted-foreground">
                          No notifications
                        </p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`border-b p-4 hover:bg-muted ${!notif.read ? "bg-muted/50" : ""}`}
                          >
                            <div className="flex justify-between">
                              <p className="font-medium">{notif.title}</p>
                              {!notif.read && (
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notif.message}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {notif.time}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-muted"
              title="Sign out"
            >
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet context={{ role }} />
        </main>
      </div>
    </div>
  );
}
