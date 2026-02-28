import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import {
  Users, GraduationCap, ClipboardCheck, BookOpen, TrendingUp,
  AlertCircle, Clock, CalendarDays, Activity, HardDrive, Shield,
  Zap, UserPlus, AlertTriangle, Server, Wifi, CheckCircle,
  ExternalLink, MapPin, CreditCard, Wrench, ChevronRight,
  Settings2, X, Eye, EyeOff, GripVertical, TicketCheck, Monitor
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { StatCard } from "../components/stat-card";
import { StatusBadge } from "../components/status-badge";
import {
  students, teachers, assignments, announcements,
  attendanceChartData, gradeDistribution, timetable,
  systemMetrics, userActivityChart, usersByRoleChart, storageBreakdown,
  auditLogs, systemUsers, subscription, serviceStatuses, resourceQuotas,
  tickets, equipmentBookings,
  type Role
} from "../data/mock-data";

const ROLE_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#06b6d4"];

// Widget definitions per role
interface WidgetDef {
  id: string;
  label: string;
  defaultVisible: boolean;
}

const adminWidgets: WidgetDef[] = [
  { id: "subscription", label: "Subscription Plan", defaultVisible: true },
  { id: "quotas", label: "Resource Usage", defaultVisible: true },
  { id: "stats", label: "Key Stats", defaultVisible: true },
  { id: "activity", label: "User Activity Chart", defaultVisible: true },
  { id: "services", label: "Platform Services", defaultVisible: true },
  { id: "users-role", label: "Users by Role", defaultVisible: true },
  { id: "tickets", label: "Recent Tickets", defaultVisible: true },
  { id: "alerts", label: "Security Alerts", defaultVisible: true },
  { id: "quick-actions", label: "Quick Actions", defaultVisible: true },
];

const teacherWidgets: WidgetDef[] = [
  { id: "stats", label: "Overview Stats", defaultVisible: true },
  { id: "schedule", label: "Today's Schedule", defaultVisible: true },
  { id: "assignments", label: "Recent Assignments", defaultVisible: true },
  { id: "tickets", label: "My Tickets", defaultVisible: true },
  { id: "equipment", label: "Equipment Bookings", defaultVisible: true },
];

const studentWidgets: WidgetDef[] = [
  { id: "stats", label: "Overview Stats", defaultVisible: true },
  { id: "timetable", label: "Today's Timetable", defaultVisible: true },
  { id: "assignments", label: "Upcoming Assignments", defaultVisible: true },
];

const parentWidgets: WidgetDef[] = [
  { id: "child-info", label: "Child Info", defaultVisible: true },
  { id: "stats", label: "Overview Stats", defaultVisible: true },
  { id: "grades", label: "Recent Grades", defaultVisible: true },
  { id: "announcements", label: "Announcements", defaultVisible: true },
];

const librarianWidgets: WidgetDef[] = [
  { id: "stats", label: "Library Stats", defaultVisible: true },
  { id: "announcements", label: "Announcements", defaultVisible: true },
];

const widgetsByRole: Record<Role, WidgetDef[]> = {
  admin: adminWidgets,
  teacher: teacherWidgets,
  student: studentWidgets,
  parent: parentWidgets,
  librarian: librarianWidgets,
};

function useWidgetVisibility(role: Role) {
  const key = `setu_dashboard_${role}`;
  const defs = widgetsByRole[role];
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defs.reduce((a, w) => ({ ...a, [w.id]: w.defaultVisible }), {} as Record<string, boolean>);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(visibility));
  }, [visibility, key]);

  const toggle = (id: string) => setVisibility((v) => ({ ...v, [id]: !v[id] }));
  const isVisible = (id: string) => visibility[id] !== false;

  return { visibility, toggle, isVisible, defs };
}

function CustomizePanel({ defs, visibility, toggle, onClose }: { defs: WidgetDef[]; visibility: Record<string, boolean>; toggle: (id: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontSize: "1.0625rem" }}>Customize Dashboard</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-muted-foreground mb-4" style={{ fontSize: "0.8125rem" }}>Toggle widgets to show or hide them on your dashboard.</p>
        <div className="space-y-1">
          {defs.map((w) => (
            <button
              key={w.id}
              onClick={() => toggle(w.id)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span style={{ fontSize: "0.875rem" }}>{w.label}</span>
              {visibility[w.id] !== false ? (
                <Eye className="w-4 h-4 text-primary" />
              ) : (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90" style={{ fontSize: "0.875rem" }}>Done</button>
      </div>
    </div>
  );
}

const statusColor: Record<string, string> = { operational: "bg-green-500", degraded: "bg-amber-500", outage: "bg-red-500", maintenance: "bg-blue-500" };
const statusLabel: Record<string, string> = { operational: "Operational", degraded: "Degraded", outage: "Outage", maintenance: "Maintenance" };

function AdminDashboard() {
  const { isVisible, visibility, toggle, defs } = useWidgetVisibility("admin");
  const [showCustomize, setShowCustomize] = useState(false);
  const recentAlerts = auditLogs.filter(l => l.severity === "warning" || l.severity === "critical").slice(0, 4);
  const allOperational = serviceStatuses.every(s => s.status === "operational");
  const degradedCount = serviceStatuses.filter(s => s.status === "degraded" || s.status === "outage").length;
  const openTickets = tickets.filter(t => t.status === "open" || t.status === "in-progress");

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1>Admin Console</h1>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary" style={{ fontSize: "0.6875rem", fontWeight: 500 }}>{subscription.planName}</span>
          </div>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            {subscription.orgName} &middot; <span className="font-mono">{subscription.tenantId}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <div className={`w-2 h-2 rounded-full ${allOperational ? "bg-green-500" : "bg-amber-500"}`} />
            <span className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>{allOperational ? "All systems operational" : `${degradedCount} degraded`}</span>
          </div>
          <button onClick={() => setShowCustomize(true)} className="p-2 rounded-lg border border-border hover:bg-muted" title="Customize Dashboard">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {isVisible("subscription") && (
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><CreditCard className="w-6 h-6 text-primary" /></div>
              <div>
                <div className="flex items-center gap-2">
                  <p style={{ fontWeight: 600 }}>{subscription.planName}</p>
                  <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200" style={{ fontSize: "0.65rem", fontWeight: 500 }}>ACTIVE</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <span className="text-muted-foreground flex items-center gap-1" style={{ fontSize: "0.8125rem" }}><MapPin className="w-3.5 h-3.5" /> {subscription.region}</span>
                  <span className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>Billed {subscription.billingCycle}</span>
                  <span className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>Renews {subscription.nextBillingDate}</span>
                </div>
              </div>
            </div>
            <a href="/settings" className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors shrink-0" style={{ fontSize: "0.8125rem" }}>Manage <ExternalLink className="w-3.5 h-3.5" /></a>
          </div>
        </div>
      )}

      {isVisible("quotas") && (
        <div className="mb-6">
          <h3 className="mb-3">Resource Usage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {resourceQuotas.map((q) => {
              const percent = Math.round((q.used / q.limit) * 100);
              const isHigh = percent > 80, isMedium = percent > 60 && percent <= 80;
              return (
                <div key={q.resource} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>{q.resource}</p>
                    <p style={{ fontSize: "0.75rem", fontWeight: 500 }} className={isHigh ? "text-red-600" : isMedium ? "text-amber-600" : "text-muted-foreground"}>{percent}%</p>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full ${isHigh ? "bg-red-500" : isMedium ? "bg-amber-500" : "bg-primary"}`} style={{ width: `${percent}%` }} />
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{q.used.toLocaleString()} / {q.limit.toLocaleString()} {q.unit}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isVisible("stats") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Active Sessions" value={systemMetrics.activeSessionsNow} icon={<Wifi className="w-5 h-5 text-muted-foreground" />} change="Currently online" changeType="positive" />
          <StatCard label="Failed Logins (24h)" value={systemMetrics.failedLogins24h} icon={<AlertTriangle className="w-5 h-5 text-muted-foreground" />} change="1 IP auto-blocked" changeType="negative" />
          <StatCard label="Open Tickets" value={openTickets.length} icon={<TicketCheck className="w-5 h-5 text-muted-foreground" />} change={`${tickets.filter(t=>t.priority==="critical"&&t.status!=="resolved"&&t.status!=="closed").length} critical`} changeType="negative" />
          <StatCard label="Modules Active" value="9/10" icon={<Activity className="w-5 h-5 text-muted-foreground" />} change="1 disabled" changeType="neutral" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {isVisible("activity") && (
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <h3 className="mb-4">User Activity (Today)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={userActivityChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <defs><linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} /><stop offset="95%" stopColor="#4f46e5" stopOpacity={0} /></linearGradient></defs>
                <Area type="monotone" dataKey="users" stroke="#4f46e5" fill="url(#ug)" strokeWidth={2} name="Active Users" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        {isVisible("services") && (
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3>Platform Services</h3>
              <span className={`px-2 py-0.5 rounded-full text-white ${allOperational ? "bg-green-600" : "bg-amber-600"}`} style={{ fontSize: "0.65rem", fontWeight: 500 }}>{allOperational ? "ALL OK" : "ISSUES"}</span>
            </div>
            <div className="space-y-2.5">
              {serviceStatuses.map((svc) => (
                <div key={svc.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${statusColor[svc.status]}`} />
                    <span style={{ fontSize: "0.8125rem" }}>{svc.name}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded ${svc.status === "operational" ? "bg-green-50 text-green-700" : svc.status === "degraded" ? "bg-amber-50 text-amber-700" : svc.status === "maintenance" ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"}`} style={{ fontSize: "0.625rem", fontWeight: 500 }}>{statusLabel[svc.status]}</span>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground mt-3 pt-3 border-t border-border" style={{ fontSize: "0.6875rem" }}>Last checked 2 min ago.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {isVisible("users-role") && (
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3>Users by Role</h3><a href="/user-management" className="flex items-center gap-1 text-primary hover:underline" style={{ fontSize: "0.8125rem" }}>Manage <ChevronRight className="w-3.5 h-3.5" /></a></div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart><Pie data={usersByRoleChart} dataKey="count" nameKey="role" cx="50%" cy="50%" outerRadius={75} innerRadius={45} label={({ role, count }) => `${role} (${count})`}>{usersByRoleChart.map((_, idx) => <Cell key={idx} fill={ROLE_COLORS[idx % ROLE_COLORS.length]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
            <p className="text-center text-muted-foreground mt-2" style={{ fontSize: "0.75rem" }}>{systemMetrics.totalUsers} / {subscription.maxUsers} seats</p>
          </div>
        )}
        {isVisible("tickets") && (
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3>Recent Tickets</h3><a href="/tickets" className="flex items-center gap-1 text-primary hover:underline" style={{ fontSize: "0.8125rem" }}>View all <ChevronRight className="w-3.5 h-3.5" /></a></div>
            <div className="space-y-2">
              {openTickets.slice(0, 4).map(t => (
                <div key={t.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${t.priority === "critical" ? "bg-red-500" : t.priority === "high" ? "bg-orange-500" : "bg-amber-500"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate" style={{ fontWeight: 500, fontSize: "0.875rem" }}>{t.title}</p>
                      <StatusBadge status={t.status} />
                    </div>
                    <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{t.ticketNo} &middot; {t.createdBy} &middot; {t.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isVisible("alerts") && (
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4"><h3>Security Alerts</h3><a href="/audit-logs" className="flex items-center gap-1 text-primary hover:underline" style={{ fontSize: "0.8125rem" }}>View all <ChevronRight className="w-3.5 h-3.5" /></a></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentAlerts.map(log => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${log.severity === "critical" ? "bg-red-500" : "bg-amber-500"}`} />
                <div className="min-w-0"><p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{log.action}</p><p className="text-muted-foreground line-clamp-1" style={{ fontSize: "0.8125rem" }}>{log.details}</p><p className="text-muted-foreground mt-0.5" style={{ fontSize: "0.75rem" }}>{log.timestamp}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isVisible("quick-actions") && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Add User", icon: <UserPlus className="w-5 h-5" />, href: "/user-management" },
              { label: "Audit Logs", icon: <Shield className="w-5 h-5" />, href: "/audit-logs" },
              { label: "Settings", icon: <Wrench className="w-5 h-5" />, href: "/settings" },
              { label: "Send Notice", icon: <CalendarDays className="w-5 h-5" />, href: "/announcements" },
            ].map(a => (
              <a key={a.label} href={a.href} className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-center">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">{a.icon}</div>
                <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>{a.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {showCustomize && <CustomizePanel defs={defs} visibility={visibility} toggle={toggle} onClose={() => setShowCustomize(false)} />}
    </div>
  );
}

function TeacherDashboard() {
  const { isVisible, visibility, toggle, defs } = useWidgetVisibility("teacher");
  const [showCustomize, setShowCustomize] = useState(false);
  const myAssignments = assignments.filter(a => ["10-A", "11-A", "12-A"].includes(a.class));
  const myTickets = tickets.filter(t => t.createdBy.includes("Williams") || t.createdBy.includes("John"));
  const myBookings = equipmentBookings.filter(b => b.bookedBy.includes("Williams") || b.bookedBy.includes("John"));

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div><h1>Dashboard</h1><p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Good morning, Mr. Williams.</p></div>
        <button onClick={() => setShowCustomize(true)} className="p-2 rounded-lg border border-border hover:bg-muted" title="Customize"><Settings2 className="w-4 h-4 text-muted-foreground" /></button>
      </div>

      {isVisible("stats") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="My Classes" value={3} icon={<Users className="w-5 h-5 text-muted-foreground" />} />
          <StatCard label="Today's Periods" value={5} icon={<Clock className="w-5 h-5 text-muted-foreground" />} />
          <StatCard label="Active Assignments" value={myAssignments.filter(a => a.status === "active").length} icon={<BookOpen className="w-5 h-5 text-muted-foreground" />} />
          <StatCard label="Pending Grading" value={myAssignments.filter(a => a.status !== "graded").length} icon={<ClipboardCheck className="w-5 h-5 text-muted-foreground" />} change="Action needed" changeType="negative" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {isVisible("schedule") && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="mb-4">Today's Schedule</h3>
            <div className="space-y-2">{timetable.slice(0, 5).map(slot => (
              <div key={slot.period} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                <span className="text-muted-foreground shrink-0 w-24" style={{ fontSize: "0.8125rem" }}>{slot.time}</span>
                <div className="flex-1 min-w-0"><p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{slot.subject}</p><p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Room {slot.room}</p></div>
              </div>
            ))}</div>
          </div>
        )}
        {isVisible("assignments") && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="mb-4">Recent Assignments</h3>
            <div className="space-y-2">{myAssignments.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="min-w-0"><p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{a.title}</p><p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{a.class} &middot; Due {a.dueDate}</p></div>
                <StatusBadge status={a.status} />
              </div>
            ))}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isVisible("tickets") && (
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3>My Tickets</h3><a href="/tickets" className="text-primary hover:underline" style={{ fontSize: "0.8125rem" }}>View all</a></div>
            {myTickets.length > 0 ? myTickets.slice(0, 3).map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-border mb-2">
                <div className="min-w-0"><p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{t.title}</p><p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{t.ticketNo} &middot; {t.createdAt}</p></div>
                <StatusBadge status={t.status} />
              </div>
            )) : <p className="text-muted-foreground p-4 text-center" style={{ fontSize: "0.875rem" }}>No tickets</p>}
          </div>
        )}
        {isVisible("equipment") && (
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3>Equipment Bookings</h3><a href="/equipment" className="text-primary hover:underline" style={{ fontSize: "0.8125rem" }}>Book more</a></div>
            {myBookings.length > 0 ? myBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg border border-border mb-2">
                <div className="min-w-0"><p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{b.equipmentName}</p><p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{b.date} &middot; {b.timeSlot}</p></div>
                <StatusBadge status={b.status} />
              </div>
            )) : <p className="text-muted-foreground p-4 text-center" style={{ fontSize: "0.875rem" }}>No bookings</p>}
          </div>
        )}
      </div>

      {showCustomize && <CustomizePanel defs={defs} visibility={visibility} toggle={toggle} onClose={() => setShowCustomize(false)} />}
    </div>
  );
}

function StudentDashboard() {
  const { isVisible, visibility, toggle, defs } = useWidgetVisibility("student");
  const [showCustomize, setShowCustomize] = useState(false);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div><h1>Dashboard</h1><p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Welcome back, Alice.</p></div>
        <button onClick={() => setShowCustomize(true)} className="p-2 rounded-lg border border-border hover:bg-muted" title="Customize"><Settings2 className="w-4 h-4 text-muted-foreground" /></button>
      </div>

      {isVisible("stats") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="GPA" value="3.8" icon={<TrendingUp className="w-5 h-5 text-muted-foreground" />} change="Top 10%" changeType="positive" />
          <StatCard label="Attendance" value="94%" icon={<ClipboardCheck className="w-5 h-5 text-muted-foreground" />} />
          <StatCard label="Pending Tasks" value={2} icon={<BookOpen className="w-5 h-5 text-muted-foreground" />} change="Due this week" changeType="negative" />
          <StatCard label="Classes Today" value={7} icon={<Clock className="w-5 h-5 text-muted-foreground" />} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isVisible("timetable") && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="mb-4">Today's Timetable</h3>
            <div className="space-y-2">{timetable.map(slot => (
              <div key={slot.period} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                <span className="text-muted-foreground shrink-0 w-24" style={{ fontSize: "0.8125rem" }}>{slot.time}</span>
                <div className="flex-1 min-w-0"><p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{slot.subject}</p><p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{slot.teacher} &middot; Room {slot.room}</p></div>
              </div>
            ))}</div>
          </div>
        )}
        {isVisible("assignments") && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="mb-4">Upcoming Assignments</h3>
            <div className="space-y-2">{assignments.filter(a => a.status === "active").slice(0, 4).map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="min-w-0"><p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{a.title}</p><p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{a.subject} &middot; Due {a.dueDate}</p></div>
                <StatusBadge status={a.status} />
              </div>
            ))}</div>
          </div>
        )}
      </div>

      {showCustomize && <CustomizePanel defs={defs} visibility={visibility} toggle={toggle} onClose={() => setShowCustomize(false)} />}
    </div>
  );
}

function ParentDashboard() {
  const { isVisible, visibility, toggle, defs } = useWidgetVisibility("parent");
  const [showCustomize, setShowCustomize] = useState(false);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div><h1>Dashboard</h1><p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Hello, Robert. Here's how Alice is doing.</p></div>
        <button onClick={() => setShowCustomize(true)} className="p-2 rounded-lg border border-border hover:bg-muted" title="Customize"><Settings2 className="w-4 h-4 text-muted-foreground" /></button>
      </div>

      {isVisible("child-info") && (
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><span style={{ fontWeight: 600, fontSize: "1.125rem" }}>AJ</span></div>
            <div><p style={{ fontWeight: 600 }}>Alice Johnson</p><p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Grade 10 &middot; Section A &middot; Roll #1001</p></div>
          </div>
        </div>
      )}

      {isVisible("stats") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Attendance" value="94%" icon={<ClipboardCheck className="w-5 h-5 text-muted-foreground" />} change="This term" changeType="positive" />
          <StatCard label="GPA" value="3.8" icon={<TrendingUp className="w-5 h-5 text-muted-foreground" />} change="Above average" changeType="positive" />
          <StatCard label="Pending Tasks" value={2} icon={<BookOpen className="w-5 h-5 text-muted-foreground" />} />
          <StatCard label="Absences" value={3} icon={<AlertCircle className="w-5 h-5 text-muted-foreground" />} change="This month" changeType="negative" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isVisible("grades") && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="mb-4">Recent Grades</h3>
            <div className="space-y-2">{[
              { subject: "Algebra", grade: "A", score: "92/100", date: "Feb 20" },
              { subject: "Physics", grade: "A-", score: "88/100", date: "Feb 22" },
              { subject: "English", grade: "B+", score: "85/100", date: "Feb 18" },
            ].map((g, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div><p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{g.subject}</p><p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{g.date} &middot; {g.score}</p></div>
                <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>{g.grade}</span>
              </div>
            ))}</div>
          </div>
        )}
        {isVisible("announcements") && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="mb-4">Announcements</h3>
            <div className="space-y-3">{announcements.slice(0, 3).map(a => (
              <div key={a.id} className="p-3 rounded-lg border border-border">
                <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{a.title}</p>
                <p className="text-muted-foreground mt-1 line-clamp-2" style={{ fontSize: "0.8125rem" }}>{a.message}</p>
                <p className="text-muted-foreground mt-1" style={{ fontSize: "0.75rem" }}>{a.date}</p>
              </div>
            ))}</div>
          </div>
        )}
      </div>

      {showCustomize && <CustomizePanel defs={defs} visibility={visibility} toggle={toggle} onClose={() => setShowCustomize(false)} />}
    </div>
  );
}

function LibrarianDashboard() {
  const { isVisible, visibility, toggle, defs } = useWidgetVisibility("librarian");
  const [showCustomize, setShowCustomize] = useState(false);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div><h1>Dashboard</h1><p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Welcome, Ms. Nair. Manage the library catalog.</p></div>
        <button onClick={() => setShowCustomize(true)} className="p-2 rounded-lg border border-border hover:bg-muted" title="Customize"><Settings2 className="w-4 h-4 text-muted-foreground" /></button>
      </div>

      {isVisible("stats") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Books" value={12} icon={<BookOpen className="w-5 h-5 text-muted-foreground" />} />
          <StatCard label="Currently Issued" value={6} icon={<ClipboardCheck className="w-5 h-5 text-muted-foreground" />} />
          <StatCard label="Overdue" value={3} icon={<AlertCircle className="w-5 h-5 text-muted-foreground" />} change="Action needed" changeType="negative" />
          <StatCard label="Fines Pending" value="160" icon={<CreditCard className="w-5 h-5 text-muted-foreground" />} />
        </div>
      )}

      {isVisible("announcements") && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="mb-4">School Announcements</h3>
          <div className="space-y-3">{announcements.slice(0, 3).map(a => (
            <div key={a.id} className="p-3 rounded-lg border border-border">
              <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{a.title}</p>
              <p className="text-muted-foreground mt-1 line-clamp-2" style={{ fontSize: "0.8125rem" }}>{a.message}</p>
              <p className="text-muted-foreground mt-1" style={{ fontSize: "0.75rem" }}>{a.date}</p>
            </div>
          ))}</div>
        </div>
      )}

      {showCustomize && <CustomizePanel defs={defs} visibility={visibility} toggle={toggle} onClose={() => setShowCustomize(false)} />}
    </div>
  );
}

export default function DashboardPage() {
  const { role } = useOutletContext<{ role: Role }>();

  switch (role) {
    case "admin": return <AdminDashboard />;
    case "teacher": return <TeacherDashboard />;
    case "student": return <StudentDashboard />;
    case "parent": return <ParentDashboard />;
    case "librarian": return <LibrarianDashboard />;
  }
}
