import { timetable } from "../data/mock-data";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetablePage() {
  return (
    <div>
      <div className="mb-6">
        <h1>Timetable</h1>
        <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Weekly class schedule and room assignments.</p>
      </div>

      {/* Day tabs - show Monday by default */}
      <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg w-fit overflow-x-auto">
        {days.map((day, i) => (
          <button
            key={day}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              i === 0 ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
            style={{ fontSize: "0.8125rem", fontWeight: 500 }}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Period</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Time</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Subject</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Teacher</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Room</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((slot, idx) => (
                <tr key={slot.period} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3" style={{ fontSize: "0.875rem" }}>
                    <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center" style={{ fontWeight: 500, fontSize: "0.8125rem" }}>
                      {slot.period}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: "0.875rem" }}>{slot.time}</td>
                  <td className="px-4 py-3" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                    {idx === 3 ? (
                      <span className="text-muted-foreground italic" style={{ fontWeight: 400 }}>Lunch Break</span>
                    ) : (
                      slot.subject
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: "0.875rem" }}>{idx === 3 ? "—" : slot.teacher}</td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: "0.875rem" }}>{idx === 3 ? "—" : slot.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
