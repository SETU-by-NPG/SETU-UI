import { useState } from "react";
import {
  Server,
  Database,
  Mail,
  HardDrive,
  Shield,
  RefreshCw,
  Cpu,
  MemoryStick,
  Disc,
  AlertTriangle,
  LogIn,
  LogOut,
  Lock,
  Activity,
  Wifi,
  Layers,
  Clock,
  UserX,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceStatus = "running" | "stopped" | "degraded";

interface SystemService {
  name: string;
  status: ServiceStatus;
  responseTimeMs: number;
  icon: React.ElementType;
}

interface SecurityEvent {
  id: string;
  description: string;
  ip: string;
  time: string;
  type: "warning" | "error" | "info";
}

interface ActiveSession {
  id: string;
  user: string;
  role: string;
  ip: string;
  lastActive: string;
  device: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SERVICES: SystemService[] = [
  { name: "Web Server", status: "running", responseTimeMs: 12, icon: Server },
  { name: "Database", status: "running", responseTimeMs: 4, icon: Database },
  { name: "Email", status: "running", responseTimeMs: 88, icon: Mail },
  { name: "Backup", status: "running", responseTimeMs: 210, icon: HardDrive },
  { name: "LDAP", status: "degraded", responseTimeMs: 547, icon: Shield },
  { name: "MIS Sync", status: "running", responseTimeMs: 33, icon: RefreshCw },
  { name: "Cache", status: "running", responseTimeMs: 2, icon: Layers },
  { name: "Queue", status: "stopped", responseTimeMs: 0, icon: Activity },
];

const SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: "1",
    description: "Multiple failed login attempts detected",
    ip: "192.168.1.45",
    time: "2 min ago",
    type: "error",
  },
  {
    id: "2",
    description: "Admin account password changed",
    ip: "10.0.0.12",
    time: "18 min ago",
    type: "warning",
  },
  {
    id: "3",
    description: "New device login: j.smith@setu.edu",
    ip: "86.4.12.200",
    time: "34 min ago",
    type: "info",
  },
  {
    id: "4",
    description: "Access denied — restricted module",
    ip: "192.168.2.101",
    time: "51 min ago",
    type: "warning",
  },
  {
    id: "5",
    description: "Bulk export by data manager",
    ip: "10.0.0.8",
    time: "1 hr ago",
    type: "info",
  },
];

const ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: "1",
    user: "Sarah Johnson",
    role: "MASTER_ADMIN",
    ip: "10.0.0.5",
    lastActive: "1 min ago",
    device: "Chrome / Windows",
  },
  {
    id: "2",
    user: "Michael Chen",
    role: "HEAD_OF_SCHOOL",
    ip: "10.0.0.7",
    lastActive: "3 min ago",
    device: "Safari / macOS",
  },
  {
    id: "3",
    user: "Emma Williams",
    role: "TEACHER",
    ip: "192.168.1.22",
    lastActive: "7 min ago",
    device: "Firefox / Linux",
  },
  {
    id: "4",
    user: "Omar Rashid",
    role: "DATA_MANAGER",
    ip: "192.168.1.30",
    lastActive: "11 min ago",
    device: "Edge / Windows",
  },
  {
    id: "5",
    user: "Priya Patel",
    role: "HR_MANAGER",
    ip: "10.0.0.15",
    lastActive: "19 min ago",
    device: "Chrome / macOS",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const statusDot: Record<ServiceStatus, string> = {
  running: "bg-green-500",
  stopped: "bg-red-500",
  degraded: "bg-amber-400",
};

const statusLabel: Record<ServiceStatus, string> = {
  running: "Running",
  stopped: "Stopped",
  degraded: "Degraded",
};

const statusTextColor: Record<ServiceStatus, string> = {
  running: "text-green-700",
  stopped: "text-red-600",
  degraded: "text-amber-600",
};

const eventTypeConfig = {
  error: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  info: { icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
};

function ServiceCard({ service }: { service: SystemService }) {
  const Icon = service.icon;
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-600">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {service.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={cn(
              "inline-block h-2 w-2 rounded-full",
              statusDot[service.status],
            )}
          />
          <span
            className={cn(
              "text-xs font-medium",
              statusTextColor[service.status],
            )}
          >
            {statusLabel[service.status]}
          </span>
        </div>
      </div>
      <div className="text-right shrink-0">
        {service.status !== "stopped" ? (
          <span className="text-xs text-gray-500">
            {service.responseTimeMs}ms
          </span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ITAdminPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [forceLogoutId, setForceLogoutId] = useState<string | null>(null);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success("System data refreshed");
    }, 1500);
  };

  const handleForceLogout = (session: ActiveSession) => {
    setForceLogoutId(session.id);
    setTimeout(() => {
      setForceLogoutId(null);
      toast.success(`Session terminated for ${session.user}`);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="IT Administration"
        subtitle="System health, services, and security monitoring"
        icon={Server}
        iconColor="bg-slate-700"
        actions={[
          {
            label: refreshing ? "Refreshing…" : "Refresh",
            onClick: handleRefresh,
            icon: RefreshCw,
            variant: "outline",
            disabled: refreshing,
          },
        ]}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="System Uptime"
            value="99.98%"
            subtitle="Last 30 days"
            icon={Activity}
            variant="success"
            trend={{ value: 0.01, label: "vs last month", direction: "up" }}
          />
          <StatCard
            title="Active Sessions"
            value={47}
            subtitle="Across all devices"
            icon={LogIn}
            variant="default"
          />
          <StatCard
            title="Failed Logins Today"
            value={3}
            subtitle="0 from known IPs"
            icon={Lock}
            variant="warning"
          />
          <StatCard
            title="Storage Used"
            value="67%"
            subtitle="4.02 TB of 6 TB used"
            icon={HardDrive}
            variant="info"
            trend={{ value: 2.1, label: "vs last week", direction: "up" }}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* ── Left: Services + Resources ── */}
          <div className="xl:col-span-2 space-y-6">
            {/* System Services */}
            <Card className="p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Server className="h-4 w-4 text-gray-400" />
                System Services
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {SERVICES.map((svc) => (
                  <ServiceCard key={svc.name} service={svc} />
                ))}
              </div>
            </Card>

            {/* Resource Usage */}
            <Card className="p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-gray-400" />
                Resource Usage
              </h2>
              <div className="space-y-4">
                {/* CPU */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Cpu className="h-3.5 w-3.5 text-blue-500" />
                      CPU Usage
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      34%
                    </span>
                  </div>
                  <Progress value={34} className="h-2" />
                  <p className="text-xs text-gray-400 mt-1">
                    8 cores · avg 2.4 GHz
                  </p>
                </div>
                {/* Memory */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MemoryStick className="h-3.5 w-3.5 text-purple-500" />
                      Memory Usage
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      61%
                    </span>
                  </div>
                  <Progress value={61} className="h-2" />
                  <p className="text-xs text-gray-400 mt-1">
                    9.8 GB used of 16 GB
                  </p>
                </div>
                {/* Disk */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Disc className="h-3.5 w-3.5 text-amber-500" />
                      Disk Usage
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      67%
                    </span>
                  </div>
                  <Progress value={67} className="h-2" />
                  <p className="text-xs text-gray-400 mt-1">
                    4.02 TB used of 6 TB
                  </p>
                </div>
                {/* Network */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <Wifi className="h-4 w-4 text-indigo-400" />
                    <div>
                      <p className="text-xs text-gray-400">Network In</p>
                      <p className="text-sm font-semibold text-gray-700">
                        142 Mbps
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <Wifi className="h-4 w-4 text-teal-400" />
                    <div>
                      <p className="text-xs text-gray-400">Network Out</p>
                      <p className="text-sm font-semibold text-gray-700">
                        87 Mbps
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Active Sessions Table */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <LogIn className="h-4 w-4 text-gray-400" />
                  Active Sessions
                </h2>
                <Badge variant="secondary">
                  {ACTIVE_SESSIONS.length} shown
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide pr-4">
                        User
                      </th>
                      <th className="text-left pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide pr-4">
                        Role
                      </th>
                      <th className="text-left pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide pr-4">
                        IP Address
                      </th>
                      <th className="text-left pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide pr-4">
                        Last Active
                      </th>
                      <th className="text-right pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {ACTIVE_SESSIONS.map((session) => (
                      <tr
                        key={session.id}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="py-3 pr-4">
                          <div>
                            <p className="font-medium text-gray-800">
                              {session.user}
                            </p>
                            <p className="text-xs text-gray-400">
                              {session.device}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant="secondary" className="text-[10px]">
                            {session.role.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 font-mono text-xs text-gray-600">
                          {session.ip}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {session.lastActive}
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            disabled={forceLogoutId === session.id}
                            onClick={() => handleForceLogout(session)}
                          >
                            <UserX className="h-3 w-3" />
                            {forceLogoutId === session.id
                              ? "Logging out…"
                              : "Force Logout"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* ── Right: Security Events ── */}
          <div>
            <Card className="p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-400" />
                Recent Security Events
              </h2>
              <div className="space-y-3">
                {SECURITY_EVENTS.map((event) => {
                  const {
                    icon: EventIcon,
                    color,
                    bg,
                  } = eventTypeConfig[event.type];
                  return (
                    <div
                      key={event.id}
                      className={cn("flex gap-3 rounded-lg p-3", bg)}
                    >
                      <div className={cn("shrink-0 mt-0.5", color)}>
                        <EventIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 leading-snug">
                          {event.description}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono text-xs text-gray-400">
                            {event.ip}
                          </span>
                          <span className="text-xs text-gray-400">
                            {event.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 gap-1.5 text-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                View All Security Events
              </Button>
            </Card>

            {/* Quick Stats */}
            <Card className="p-5 mt-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Quick Stats
              </h2>
              <div className="space-y-2">
                {[
                  { label: "Total Users", value: "312" },
                  { label: "Active Users (30d)", value: "289" },
                  { label: "Disabled Accounts", value: "14" },
                  { label: "MFA Enabled", value: "187 (60%)" },
                  { label: "Last Full Backup", value: "6 hrs ago" },
                  { label: "Next Backup", value: "in 18 hrs" },
                  { label: "SSL Certificate", value: "Valid (87 days)" },
                  { label: "DB Size", value: "2.1 GB" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-semibold text-gray-700">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
