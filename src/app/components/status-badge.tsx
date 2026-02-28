interface StatusBadgeProps {
  status: string;
  variant?: "default" | "attendance";
}

const colorMap: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  inactive: "bg-gray-50 text-gray-600 border-gray-200",
  graded: "bg-blue-50 text-blue-700 border-blue-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
  present: "bg-green-50 text-green-700 border-green-200",
  absent: "bg-red-50 text-red-700 border-red-200",
  late: "bg-amber-50 text-amber-700 border-amber-200",
  excused: "bg-purple-50 text-purple-700 border-purple-200",
  suspended: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  connected: "bg-green-50 text-green-700 border-green-200",
  disconnected: "bg-gray-50 text-gray-600 border-gray-200",
  error: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  partial: "bg-amber-50 text-amber-700 border-amber-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  issued: "bg-blue-50 text-blue-700 border-blue-200",
  returned: "bg-gray-50 text-gray-600 border-gray-200",
  "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
  open: "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-green-50 text-green-700 border-green-200",
  closed: "bg-gray-50 text-gray-600 border-gray-200",
  confirmed: "bg-green-50 text-green-700 border-green-200",
  available: "bg-green-50 text-green-700 border-green-200",
  occupied: "bg-blue-50 text-blue-700 border-blue-200",
  degraded: "bg-amber-50 text-amber-700 border-amber-200",
  maintenance: "bg-blue-50 text-blue-700 border-blue-200",
  operational: "bg-green-50 text-green-700 border-green-200",
  outage: "bg-red-50 text-red-700 border-red-200",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = colorMap[status.toLowerCase()] || "bg-muted text-muted-foreground border-border";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border capitalize ${colors}`}
      style={{ fontSize: "0.75rem", fontWeight: 500 }}
    >
      {status}
    </span>
  );
}