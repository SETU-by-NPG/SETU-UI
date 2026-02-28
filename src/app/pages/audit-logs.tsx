import { useState } from "react";
import { Download, Filter, Search, AlertTriangle, Info, AlertOctagon, Clock } from "lucide-react";
import { auditLogs, type AuditLogEntry } from "../data/mock-data";

const severityFilters = ["All", "info", "warning", "critical"] as const;
const moduleFilters = ["All", "Authentication", "User Management", "Security", "System Settings", "Data Management", "Platform", "Gradebook", "Attendance", "Integrations", "Roles & Permissions"] as const;

const severityConfig = {
  info: { icon: <Info className="w-3.5 h-3.5" />, color: "bg-blue-50 text-blue-600 border-blue-200", dot: "bg-blue-500" },
  warning: { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "bg-amber-50 text-amber-600 border-amber-200", dot: "bg-amber-500" },
  critical: { icon: <AlertOctagon className="w-3.5 h-3.5" />, color: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-500" },
};

export default function AuditLogsPage() {
  const [severityFilter, setSeverityFilter] = useState<string>("All");
  const [moduleFilter, setModuleFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = auditLogs.filter(log => {
    if (severityFilter !== "All" && log.severity !== severityFilter) return false;
    if (moduleFilter !== "All" && log.module !== moduleFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        log.user.toLowerCase().includes(s) ||
        log.action.toLowerCase().includes(s) ||
        log.details.toLowerCase().includes(s) ||
        log.module.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const stats = {
    total: auditLogs.length,
    info: auditLogs.filter(l => l.severity === "info").length,
    warning: auditLogs.filter(l => l.severity === "warning").length,
    critical: auditLogs.filter(l => l.severity === "critical").length,
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1>Audit Logs</h1>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            Track all system activities, user actions, and security events.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors" style={{ fontSize: "0.875rem" }}>
          <Download className="w-4 h-4" /> Export Logs
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Total Events</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-blue-600" style={{ fontSize: "0.75rem" }}>Info</p>
          <p className="text-blue-600" style={{ fontSize: "1.5rem", fontWeight: 600 }}>{stats.info}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-amber-600" style={{ fontSize: "0.75rem" }}>Warnings</p>
          <p className="text-amber-600" style={{ fontSize: "1.5rem", fontWeight: 600 }}>{stats.warning}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-red-600" style={{ fontSize: "0.75rem" }}>Critical</p>
          <p className="text-red-600" style={{ fontSize: "1.5rem", fontWeight: 600 }}>{stats.critical}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search logs by user, action, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-input-background"
            style={{ fontSize: "0.875rem" }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors ${showFilters ? "bg-muted" : ""}`}
          style={{ fontSize: "0.875rem" }}
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4 space-y-3">
          <div>
            <label className="text-muted-foreground block mb-1.5" style={{ fontSize: "0.75rem", fontWeight: 500 }}>Severity</label>
            <div className="flex gap-1 flex-wrap">
              {severityFilters.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverityFilter(s)}
                  className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
                    severityFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ fontSize: "0.8125rem" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-muted-foreground block mb-1.5" style={{ fontSize: "0.75rem", fontWeight: 500 }}>Module</label>
            <div className="flex gap-1 flex-wrap">
              {moduleFilters.map((m) => (
                <button
                  key={m}
                  onClick={() => setModuleFilter(m)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    moduleFilter === m ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ fontSize: "0.8125rem" }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Log Entries */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-muted-foreground w-8" style={{ fontSize: "0.75rem", fontWeight: 500 }}></th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Timestamp</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>User</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Action</th>
                <th className="text-left px-4 py-3 text-muted-foreground hidden lg:table-cell" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Module</th>
                <th className="text-left px-4 py-3 text-muted-foreground hidden xl:table-cell" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Details</th>
                <th className="text-left px-4 py-3 text-muted-foreground hidden xl:table-cell" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground" style={{ fontSize: "0.875rem" }}>
                    No log entries match your filters
                  </td>
                </tr>
              ) : (
                filtered.map((log) => {
                  const config = severityConfig[log.severity];
                  return (
                    <tr key={log.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`w-2 h-2 rounded-full inline-block ${config.dot}`} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span style={{ fontSize: "0.8125rem" }}>{log.timestamp}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{log.user}</p>
                          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{log.userRole}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${config.color}`} style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                          {config.icon}
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>{log.module}</span>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell max-w-xs">
                        <p className="text-muted-foreground truncate" style={{ fontSize: "0.8125rem" }}>{log.details}</p>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span className="text-muted-foreground font-mono" style={{ fontSize: "0.75rem" }}>{log.ipAddress}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 text-muted-foreground text-right" style={{ fontSize: "0.75rem" }}>
        Showing {filtered.length} of {auditLogs.length} entries &middot; Logs retained for 90 days
      </div>
    </div>
  );
}
