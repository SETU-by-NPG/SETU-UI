import { useState } from "react";
import { useOutletContext } from "react-router";
import { TicketCheck, Plus, Search, X, AlertCircle, Clock, CheckCircle, Filter } from "lucide-react";
import { StatusBadge } from "../components/status-badge";
import { tickets, type Role, type Ticket } from "../data/mock-data";

const priorityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-green-50 text-green-700 border-green-200",
};

const categoryIcons: Record<string, string> = {
  hardware: "HW",
  software: "SW",
  network: "NET",
  account: "ACC",
  other: "OTH",
};

export default function TicketsPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const filtered = tickets.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.ticketNo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in-progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length;
  const criticalCount = tickets.filter((t) => t.priority === "critical" && t.status !== "closed" && t.status !== "resolved").length;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1>{role === "admin" ? "Support Tickets" : "IT Support"}</h1>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            {role === "admin" ? "Manage and resolve IT support requests." : "Submit and track your IT support requests."}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
          style={{ fontSize: "0.875rem" }}
        >
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Open</span>
          </div>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{openCount}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>In Progress</span>
          </div>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{inProgressCount}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Resolved</span>
          </div>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{resolvedCount}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Critical</span>
          </div>
          <p className="text-red-600" style={{ fontSize: "1.5rem", fontWeight: 600 }}>{criticalCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Ticket List */}
      <div className="space-y-2">
        {filtered.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => setSelectedTicket(ticket)}
            className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <span className="text-muted-foreground" style={{ fontSize: "0.625rem", fontWeight: 600 }}>{categoryIcons[ticket.category]}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-muted-foreground font-mono" style={{ fontSize: "0.6875rem" }}>{ticket.ticketNo}</span>
                    <span className={`px-1.5 py-0.5 rounded-full border ${priorityColors[ticket.priority]}`} style={{ fontSize: "0.6rem", fontWeight: 600, textTransform: "uppercase" }}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="mt-0.5" style={{ fontWeight: 500, fontSize: "0.875rem" }}>{ticket.title}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>by {ticket.createdBy}</span>
                    {ticket.assignedTo && (
                      <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>assigned to {ticket.assignedTo}</span>
                    )}
                    <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{ticket.createdAt}</span>
                  </div>
                </div>
              </div>
              <StatusBadge status={ticket.status} />
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTicket(null)}>
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-muted-foreground font-mono" style={{ fontSize: "0.75rem" }}>{selectedTicket.ticketNo}</span>
                <h2 className="mt-1" style={{ fontSize: "1.125rem" }}>{selectedTicket.title}</h2>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <StatusBadge status={selectedTicket.status} />
              <span className={`px-1.5 py-0.5 rounded-full border ${priorityColors[selectedTicket.priority]}`} style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase" }}>
                {selectedTicket.priority}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize" style={{ fontSize: "0.65rem" }}>{selectedTicket.category}</span>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <p style={{ fontSize: "0.875rem" }}>{selectedTicket.description}</p>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>Created by</span><span style={{ fontSize: "0.8125rem" }}>{selectedTicket.createdBy}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>Assigned to</span><span style={{ fontSize: "0.8125rem" }}>{selectedTicket.assignedTo || "Unassigned"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>Created</span><span style={{ fontSize: "0.8125rem" }}>{selectedTicket.createdAt}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>Updated</span><span style={{ fontSize: "0.8125rem" }}>{selectedTicket.updatedAt}</span></div>
            </div>
            {selectedTicket.resolution && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800" style={{ fontWeight: 500, fontSize: "0.8125rem" }}>Resolution</p>
                <p className="text-green-700 mt-1" style={{ fontSize: "0.8125rem" }}>{selectedTicket.resolution}</p>
              </div>
            )}
            {role === "admin" && (selectedTicket.status === "open" || selectedTicket.status === "in-progress") && (
              <div className="flex gap-2 pt-2">
                {selectedTicket.status === "open" && (
                  <button className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" style={{ fontSize: "0.875rem" }}>Assign to Me</button>
                )}
                <button className="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700" style={{ fontSize: "0.875rem" }}>Mark Resolved</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2>New Support Ticket</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label style={{ fontSize: "0.875rem" }}>Title</label><input type="text" placeholder="Brief description of the issue" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ fontSize: "0.875rem" }}>Category</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                    <option value="hardware">Hardware</option>
                    <option value="software">Software</option>
                    <option value="network">Network</option>
                    <option value="account">Account</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div><label style={{ fontSize: "0.875rem" }}>Priority</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div><label style={{ fontSize: "0.875rem" }}>Description</label><textarea rows={4} placeholder="Describe the issue in detail..." className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background resize-none" style={{ fontSize: "0.875rem" }} /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-muted" style={{ fontSize: "0.875rem" }}>Cancel</button>
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90" style={{ fontSize: "0.875rem" }}>Submit Ticket</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
