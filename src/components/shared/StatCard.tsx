import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconBg?: string;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  default: {
    card: "",
    icon: "bg-blue-50 text-blue-600",
    value: "text-gray-900",
  },
  success: {
    card: "",
    icon: "bg-green-50 text-green-600",
    value: "text-gray-900",
  },
  warning: {
    card: "",
    icon: "bg-amber-50 text-amber-600",
    value: "text-gray-900",
  },
  danger: { card: "", icon: "bg-red-50 text-red-600", value: "text-gray-900" },
  info: {
    card: "",
    icon: "bg-purple-50 text-purple-600",
    value: "text-gray-900",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  trend,
  variant = "default",
  className,
  onClick,
}: StatCardProps) {
  const styles = variantStyles[variant];
  const trendIcon =
    trend?.direction === "up"
      ? TrendingUp
      : trend?.direction === "down"
        ? TrendingDown
        : Minus;
  const TrendIcon = trendIcon;

  return (
    <Card
      className={cn(
        "p-4 transition-shadow",
        onClick && "cursor-pointer hover:shadow-md",
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
            {title}
          </p>
          <p
            className={cn(
              "mt-1 text-2xl font-bold tracking-tight",
              styles.value,
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-400 truncate">{subtitle}</p>
          )}
          {trend && (
            <div
              className={cn(
                "mt-2 flex items-center gap-1 text-xs font-medium",
                trend.direction === "up"
                  ? "text-green-600"
                  : trend.direction === "down"
                    ? "text-red-500"
                    : "text-gray-400",
              )}
            >
              <TrendIcon className="h-3.5 w-3.5" />
              <span>
                {trend.direction === "up"
                  ? "+"
                  : trend.direction === "down"
                    ? "-"
                    : ""}
                {Math.abs(trend.value)}% {trend.label}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              iconBg ?? styles.icon,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </Card>
  );
}
