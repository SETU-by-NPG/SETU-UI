import { useState } from "react";
import { useOutletContext } from "react-router";
import { Monitor, Search, Plus, Calendar, X, CheckCircle } from "lucide-react";
import { StatusBadge } from "../components/status-badge";
import { equipment, equipmentBookings } from "../data/mock-data";

const conditionColors: Record<string, string> = {
  excellent: "text-green-600",
  good: "text-blue-600",
  fair: "text-amber-600",
  "needs-repair": "text-red-600",
};

export default function EquipmentPage() {
  const { role } = useOutletContext<{ role: string }>();
  const [tab, setTab] = useState<"inventory" | "bookings">(role === "teacher" ? "bookings" : "inventory");
  const [search, setSearch] = useState("");
  const [showBooking, setShowBooking] = useState(false);
  const [filterCat, setFilterCat] = useState("all");

  const categories = [...new Set(equipment.map((e) => e.category))];

  const filteredEquipment = equipment.filter((e) => {
    const matchSearch = e.name?.toLowerCase().includes(search.toLowerCase()) || e.serialNumber?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || e.category === filterCat;
    return matchSearch && matchCat;
  });

  const filteredBookings = equipmentBookings.filter((b) =>
    b.equipment?.toLowerCase().includes(search.toLowerCase()) || b.bookedBy?.toLowerCase().includes(search.toLowerCase())
  );

  const availableCount = equipment.filter((e) => e.available).length;
  const activeBookings = equipmentBookings.filter((b) => b.status === "confirmed" || b.status === "pending").length;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1>IT Equipment</h1>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            {role === "admin" ? "Manage inventory and approve bookings." : "Browse and book available IT equipment."}
          </p>
        </div>
        <button
          onClick={() => setShowBooking(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
          style={{ fontSize: "0.875rem" }}
        >
          <Plus className="w-4 h-4" /> {role === "admin" ? "Add Equipment" : "Book Equipment"}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{equipment.length}</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Total Items</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-green-600" style={{ fontSize: "1.5rem", fontWeight: 600 }}>{availableCount}</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Available</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-blue-600" style={{ fontSize: "1.5rem", fontWeight: 600 }}>{activeBookings}</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Active Bookings</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-red-600" style={{ fontSize: "1.5rem", fontWeight: 600 }}>{equipment.filter((e) => e.condition === "needs-repair").length}</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Needs Repair</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg w-fit">
        <button onClick={() => setTab("inventory")} className={`px-3 py-1.5 rounded-md transition-colors ${tab === "inventory" ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"}`} style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
          Inventory
        </button>
        <button onClick={() => setTab("bookings")} className={`px-3 py-1.5 rounded-md transition-colors ${tab === "bookings" ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"}`} style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
          Bookings
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
        </div>
        {tab === "inventory" && (
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {/* Inventory Tab */}
      {tab === "inventory" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["Name", "Category", "Serial #", "Location", "Condition", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map((eq) => (
                  <tr key={eq.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                    <td className="px-4 py-3" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{eq.name}</td>
                    <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: "0.875rem" }}>{eq.category}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground" style={{ fontSize: "0.75rem" }}>{eq.serialNumber}</td>
                    <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: "0.875rem" }}>{(eq as {location?: string}).location || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`capitalize ${conditionColors[eq.condition]}`} style={{ fontSize: "0.8125rem" }}>{eq.condition.replace("-", " ")}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full border ${eq.available ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"}`} style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                        {eq.available ? "Available" : "In Use"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {tab === "bookings" && (
        <div className="space-y-3">
          {filteredBookings.map((b) => (
            <div key={b.id} className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Monitor className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{b.equipment}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>{b.bookedBy}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{b.date} &middot; {b.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:shrink-0">
                <StatusBadge status={b.status} />
                {role === "admin" && b.status === "pending" && (
                  <button className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700" style={{ fontSize: "0.75rem" }}>
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowBooking(false)}>
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2>{role === "admin" ? "Add Equipment" : "Book Equipment"}</h2>
              <button onClick={() => setShowBooking(false)} className="p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {role === "admin" ? (
                <>
                  <div><label style={{ fontSize: "0.875rem" }}>Name</label><input type="text" placeholder="e.g., Portable Projector #3" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label style={{ fontSize: "0.875rem" }}>Category</label><input type="text" placeholder="Projector" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
                    <div><label style={{ fontSize: "0.875rem" }}>Serial Number</label><input type="text" placeholder="PJ-2026-003" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
                  </div>
                  <div><label style={{ fontSize: "0.875rem" }}>Location</label><input type="text" defaultValue="IT Storage" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: "0.875rem" }}>Equipment</label>
                    <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                      {equipment.filter((e) => e.available).map((e) => (
                        <option key={e.id} value={e.id}>{e.name} ({e.category})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label style={{ fontSize: "0.875rem" }}>Date</label><input type="date" defaultValue="2026-03-01" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
                    <div><label style={{ fontSize: "0.875rem" }}>Time Slot</label>
                      <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                        <option>8:00 AM - 12:00 PM</option>
                        <option>1:00 PM - 5:00 PM</option>
                        <option>Full Day</option>
                      </select>
                    </div>
                  </div>
                  <div><label style={{ fontSize: "0.875rem" }}>Purpose</label><input type="text" placeholder="What do you need this for?" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
                </>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowBooking(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-muted" style={{ fontSize: "0.875rem" }}>Cancel</button>
                <button onClick={() => setShowBooking(false)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90" style={{ fontSize: "0.875rem" }}>
                  {role === "admin" ? "Add Equipment" : "Submit Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
