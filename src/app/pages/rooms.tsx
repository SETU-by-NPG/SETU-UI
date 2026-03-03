import { useState } from "react";
import { DoorOpen, Plus, Search, Users, MapPin, Wrench, X } from "lucide-react";
import { StatusBadge } from "../components/status-badge";
import { rooms, type Room } from "../data/mock-data";

const typeLabels: Record<Room["type"], string> = {
  classroom: "Classroom",
  lab: "Laboratory",
  auditorium: "Auditorium",
  conference: "Conference",
  "staff-room": "Staff Room",
};

const typeColors: Record<Room["type"], string> = {
  classroom: "bg-blue-50 text-blue-700",
  lab: "bg-purple-50 text-purple-700",
  auditorium: "bg-amber-50 text-amber-700",
  conference: "bg-green-50 text-green-700",
  "staff-room": "bg-gray-50 text-gray-600",
};

export default function RoomsPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = rooms.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.building.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || r.type === filterType;
    return matchSearch && matchType;
  });

  const stats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === "available").length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1>Room Management</h1>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            Manage classrooms, labs, and facilities for timetable assignment.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
          style={{ fontSize: "0.875rem" }}
        >
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Rooms", value: stats.total, color: "text-foreground" },
          { label: "Available", value: stats.available, color: "text-green-600" },
          { label: "Occupied", value: stats.occupied, color: "text-blue-600" },
          { label: "Maintenance", value: stats.maintenance, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={`${s.color}`} style={{ fontSize: "1.5rem", fontWeight: 600 }}>{s.value}</p>
            <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-input-background"
            style={{ fontSize: "0.875rem" }}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-input-background"
          style={{ fontSize: "0.875rem" }}
        >
          <option value="all">All Types</option>
          <option value="classroom">Classroom</option>
          <option value="lab">Laboratory</option>
          <option value="auditorium">Auditorium</option>
          <option value="conference">Conference</option>
          <option value="staff-room">Staff Room</option>
        </select>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((room) => (
          <div key={room.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p style={{ fontWeight: 500, fontSize: "0.9375rem" }}>{room.name}</p>
                <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span style={{ fontSize: "0.75rem" }}>{room.building}, Floor {room.floor}</span>
                </div>
              </div>
              <StatusBadge status={room.status} />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2 py-0.5 rounded-full ${typeColors[room.type]}`} style={{ fontSize: "0.6875rem", fontWeight: 500 }}>
                {typeLabels[room.type]}
              </span>
              <span className="text-muted-foreground flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                <Users className="w-3 h-3" /> {room.capacity} seats
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.isArray(room.equipment) && room.equipment.map((eq) => (
                <span key={eq} className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground" style={{ fontSize: "0.625rem" }}>
                  {eq}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create Room Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2>Add New Room</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-md hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label style={{ fontSize: "0.875rem" }}>Room Name</label>
                <input type="text" placeholder="e.g., Room 301" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Building</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                    <option>Main Block</option>
                    <option>Science Block</option>
                    <option>Tech Block</option>
                    <option>Admin Block</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Floor</label>
                  <input type="number" defaultValue={1} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Type</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                    <option value="classroom">Classroom</option>
                    <option value="lab">Laboratory</option>
                    <option value="auditorium">Auditorium</option>
                    <option value="conference">Conference</option>
                    <option value="staff-room">Staff Room</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Capacity</label>
                  <input type="number" defaultValue={30} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Equipment (comma-separated)</label>
                <input type="text" placeholder="Projector, Whiteboard, AC" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-muted" style={{ fontSize: "0.875rem" }}>Cancel</button>
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90" style={{ fontSize: "0.875rem" }}>Create Room</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
