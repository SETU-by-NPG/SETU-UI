import { type ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

export function StatCard({ label, value, icon, change, changeType = "neutral" }: StatCardProps) {
  const changeColor = changeType === "positive"
    ? "text-green-600"
    : changeType === "negative"
    ? "text-destructive"
    : "text-muted-foreground";

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>{label}</p>
          <p className="mt-1" style={{ fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.2 }}>{value}</p>
          {change && (
            <p className={`mt-1 ${changeColor}`} style={{ fontSize: "0.75rem" }}>{change}</p>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}
