import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Award,
  AlertTriangle,
  UserCog,
  CheckCircle2,
  Clock,
  Bell,
  Download,
  ChevronRight,
  BarChart2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Mock Data ────────────────────────────────────────────────────────────────

// Attendance trend — last 12 weeks (whole school %)
const ATTENDANCE_TREND = [
  { week: "Wk 1", attendance: 95.8, target: 96 },
  { week: "Wk 2", attendance: 95.2, target: 96 },
  { week: "Wk 3", attendance: 94.9, target: 96 },
  { week: "Wk 4", attendance: 94.3, target: 96 },
  { week: "Wk 5", attendance: 93.8, target: 96 },
  { week: "Wk 6", attendance: 94.1, target: 96 },
  { week: "Wk 7", attendance: 94.4, target: 96 },
  { week: "Wk 8", attendance: 94.2, target: 96 },
  { week: "Wk 9", attendance: 93.7, target: 96 },
  { week: "Wk 10", attendance: 94.0, target: 96 },
  { week: "Wk 11", attendance: 94.3, target: 96 },
  { week: "Wk 12", attendance: 94.2, target: 96 },
];

// Year group breakdown — attendance %
const YEAR_GROUP_ATTENDANCE = [
  { yearGroup: "Yr 7", attendance: 95.1 },
  { yearGroup: "Yr 8", attendance: 94.2 },
  { yearGroup: "Yr 9", attendance: 93.0 },
  { yearGroup: "Yr 10", attendance: 92.5 },
  { yearGroup: "Yr 11", attendance: 90.7 },
  { yearGroup: "Yr 12", attendance: 93.8 },
  { yearGroup: "Yr 13", attendance: 92.1 },
];

// Grade distribution by year group (stacked bar — count of students per grade band)
const GRADE_DISTRIBUTION = [
  { yearGroup: "Yr 7", "9-8": 28, "7-6": 52, "5-4": 68, "3-2": 22, "1-U": 10 },
  { yearGroup: "Yr 8", "9-8": 24, "7-6": 48, "5-4": 70, "3-2": 24, "1-U": 9 },
  { yearGroup: "Yr 9", "9-8": 20, "7-6": 44, "5-4": 68, "3-2": 26, "1-U": 10 },
  { yearGroup: "Yr 10", "9-8": 18, "7-6": 40, "5-4": 66, "3-2": 28, "1-U": 8 },
  { yearGroup: "Yr 11", "9-8": 16, "7-6": 36, "5-4": 64, "3-2": 28, "1-U": 11 },
];

const GRADE_COLORS: Record<string, string> = {
  "9-8": "#14532d",
  "7-6": "#16a34a",
  "5-4": "#ca8a04",
  "3-2": "#ea580c",
  "1-U": "#dc2626",
};

// Incident trend — merits vs incidents last 8 weeks
const INCIDENT_TREND = [
  { week: "Wk 5", merits: 420, incidents: 28 },
  { week: "Wk 6", merits: 398, incidents: 31 },
  { week: "Wk 7", merits: 445, incidents: 25 },
  { week: "Wk 8", merits: 460, incidents: 22 },
  { week: "Wk 9", merits: 435, incidents: 24 },
  { week: "Wk 10", merits: 448, incidents: 21 },
  { week: "Wk 11", merits: 462, incidents: 19 },
  { week: "Wk 12", merits: 475, incidents: 17 },
];

// SLT Action items
interface SltAction {
  id: string;
  type: "approval" | "flag" | "deadline";
  title: string;
  description: string;
  dueDate?: string;
  urgency: "high" | "medium" | "low";
}

const SLT_ACTIONS: SltAction[] = [
  {
    id: "1",
    type: "approval",
    title: "Staff Absence Policy Update",
    description: "Updated HR policy requires SLT sign-off before circulation.",
    urgency: "high",
  },
  {
    id: "2",
    type: "approval",
    title: "Year 11 Mock Results Sign-Off",
    description: "155 student result sheets awaiting headteacher approval.",
    urgency: "high",
  },
  {
    id: "3",
    type: "flag",
    title: "Persistent Absence Alert — Year 9",
    description:
      "Year 9 PA rate has risen to 9.8%, above the 8% amber threshold.",
    urgency: "high",
  },
  {
    id: "4",
    type: "flag",
    title: "Safeguarding Case Follow-up",
    description: "Case S-2055 requires DSL weekly review (overdue by 2 days).",
    urgency: "high",
  },
  {
    id: "5",
    type: "deadline",
    title: "Spring Census Submission",
    description: "DfE Spring Census must be submitted by 19 Jan 2026.",
    dueDate: "19 Jan 2026",
    urgency: "medium",
  },
  {
    id: "6",
    type: "deadline",
    title: "Governors Report — Spring Term",
    description: "SLT report for full governing body meeting due in 8 days.",
    dueDate: "12 Mar 2026",
    urgency: "medium",
  },
  {
    id: "7",
    type: "approval",
    title: "Behaviour Policy Review",
    description:
      "Annual review of the school behaviour policy requires SLT input.",
    urgency: "low",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const actionTypeConfig: Record<
  SltAction["type"],
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  approval: {
    label: "Approval",
    icon: CheckCircle2,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  flag: {
    label: "Urgent Flag",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  deadline: {
    label: "Deadline",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
};

const urgencyBadge: Record<SltAction["urgency"], string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-gray-100 text-gray-500 border-gray-200",
};

const CHART_TOOLTIP_STYLE = {
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  fontSize: 12,
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeadershipPage() {
  const handleExport = (reportName: string) => {
    toast.success(`Exported "${reportName}" data`);
  };

  const handleAction = (action: SltAction) => {
    toast.info(`Opening: ${action.title}`);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Leadership Overview"
        subtitle="School-wide performance metrics and SLT actions dashboard"
        icon={BarChart2}
        iconColor="bg-violet-700"
        actions={[
          {
            label: "Export All Data",
            onClick: () => handleExport("Leadership Overview"),
            icon: Download,
            variant: "outline",
          },
        ]}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            title="Whole School Attendance"
            value="94.2%"
            subtitle="Target: 96%"
            icon={Calendar}
            variant="warning"
            trend={{ value: 0.3, label: "vs last week", direction: "down" }}
          />
          <StatCard
            title="Persistent Absence"
            value="8.3%"
            subtitle="Above 8% threshold"
            icon={AlertTriangle}
            variant="danger"
            trend={{ value: 0.5, label: "vs last term", direction: "up" }}
          />
          <StatCard
            title="Progress 8 Score"
            value="+0.3"
            subtitle="National avg: +0.0"
            icon={TrendingUp}
            variant="success"
            trend={{ value: 0.1, label: "vs last year", direction: "up" }}
          />
          <StatCard
            title="Attainment 8"
            value="48.2"
            subtitle="National avg: 46.4"
            icon={Award}
            variant="success"
            trend={{ value: 1.2, label: "vs national avg", direction: "up" }}
          />
          <StatCard
            title="Staff Absence Rate"
            value="2.1%"
            subtitle="National avg: 3.2%"
            icon={UserCog}
            variant="default"
            trend={{ value: 0.2, label: "vs last year", direction: "down" }}
          />
          <StatCard
            title="Ofsted Readiness"
            value="Good"
            subtitle="Last inspection: Nov 2023"
            icon={CheckCircle2}
            variant="success"
          />
        </div>

        {/* ── Charts Row 1 ── */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Attendance Trend — Line Chart */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-700">
                  Whole School Attendance Trend
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Last 12 weeks — all year groups
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => handleExport("Attendance Trend")}
              >
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={ATTENDANCE_TREND}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[90, 97]}
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(v: number) => [`${v}%`, undefined]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine
                  y={96}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{
                    position: "right",
                    value: "96% target",
                    fontSize: 10,
                    fill: "#ef4444",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#2563eb" }}
                  name="Attendance"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Year Group Attendance — Bar Chart */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-700">
                  Attendance by Year Group
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Current term average
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => handleExport("Year Group Attendance")}
              >
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={YEAR_GROUP_ATTENDANCE}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="yearGroup"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[85, 100]}
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(v: number) => [`${v}%`, "Attendance"]}
                />
                <ReferenceLine y={96} stroke="#ef4444" strokeDasharray="4 4" />
                <Bar
                  dataKey="attendance"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  name="Attendance %"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* ── Charts Row 2 ── */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Grade Distribution — Stacked Bar */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-700">
                  Grade Distribution by Year Group
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Student count per grade band (Term 2 assessments)
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => handleExport("Grade Distribution")}
              >
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={GRADE_DISTRIBUTION}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="yearGroup"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {Object.entries(GRADE_COLORS).map(([grade, color]) => (
                  <Bar
                    key={grade}
                    dataKey={grade}
                    stackId="grades"
                    fill={color}
                    name={`Grade ${grade}`}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Incident vs Merits Trend — Dual Axis Line Chart */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-700">
                  Behaviour Trend
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Merits awarded vs incidents logged — last 8 weeks
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => handleExport("Behaviour Trend")}
              >
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={INCIDENT_TREND}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="merits"
                  orientation="left"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="incidents"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  yAxisId="merits"
                  type="monotone"
                  dataKey="merits"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#16a34a" }}
                  name="Merit Points"
                />
                <Line
                  yAxisId="incidents"
                  type="monotone"
                  dataKey="incidents"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#dc2626" }}
                  strokeDasharray="4 2"
                  name="Incidents"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* ── SLT Actions Panel ── */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Main action list */}
          <div className="xl:col-span-2">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-gray-400" />
                  SLT Actions Required
                  <Badge className="text-[10px] bg-red-500 text-white border-0 ml-1">
                    {SLT_ACTIONS.filter((a) => a.urgency === "high").length}{" "}
                    urgent
                  </Badge>
                </h2>
                <Badge variant="secondary" className="text-xs">
                  {SLT_ACTIONS.length} items
                </Badge>
              </div>

              <div className="space-y-2">
                {SLT_ACTIONS.map((action) => {
                  const {
                    icon: ActionIcon,
                    color,
                    bg,
                    label,
                  } = actionTypeConfig[action.type];
                  return (
                    <div
                      key={action.id}
                      className="flex items-start gap-3 rounded-lg p-3 border border-gray-100 hover:bg-gray-50/60 transition-colors cursor-pointer group"
                      onClick={() => handleAction(action)}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          bg,
                        )}
                      >
                        <ActionIcon className={cn("h-4 w-4", color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium text-gray-800">
                            {action.title}
                          </p>
                          <span
                            className={cn(
                              "inline-block rounded-full border px-1.5 py-0 text-[10px] font-medium",
                              urgencyBadge[action.urgency],
                            )}
                          >
                            {action.urgency}
                          </span>
                          <span className="text-[10px] text-gray-400 rounded bg-gray-100 px-1.5 py-0">
                            {label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {action.description}
                        </p>
                        {action.dueDate && (
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-amber-400" />
                            <span className="text-[11px] text-amber-600 font-medium">
                              Due: {action.dueDate}
                            </span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 mt-1 group-hover:text-gray-500 transition-colors" />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Side panel — Key performance summary */}
          <div className="space-y-4">
            <Card className="p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-400" />
                Performance Highlights
              </h2>
              <div className="space-y-3">
                {[
                  {
                    label: "P8 Score vs National",
                    value: "+0.3",
                    change: "above",
                    color: "text-green-600",
                  },
                  {
                    label: "Attainment 8",
                    value: "48.2",
                    change: "+1.8 vs national",
                    color: "text-green-600",
                  },
                  {
                    label: "EBacc Entry Rate",
                    value: "39%",
                    change: "Target: 40%",
                    color: "text-amber-600",
                  },
                  {
                    label: "Tier 1 Interventions",
                    value: "34 pupils",
                    change: "In progress",
                    color: "text-blue-600",
                  },
                  {
                    label: "Pupil Premium Gap",
                    value: "-0.4 P8",
                    change: "Narrowing",
                    color: "text-green-600",
                  },
                  {
                    label: "SEND Cohort (EHCP)",
                    value: "28 pupils",
                    change: "Stable",
                    color: "text-gray-500",
                  },
                ].map(({ label, value, change, color }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-xs text-gray-500">{label}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-800 block">
                        {value}
                      </span>
                      <span className={cn("text-[10px]", color)}>{change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                Pupil Cohort Summary
              </h2>
              <div className="space-y-2">
                {[
                  { label: "Total Pupils on Roll", value: "838" },
                  { label: "Pupil Premium", value: "214 (25.5%)" },
                  { label: "EAL", value: "118 (14.1%)" },
                  { label: "SEND (SEN Support)", value: "82 (9.8%)" },
                  { label: "SEND (EHCP)", value: "28 (3.3%)" },
                  { label: "Looked After Children", value: "6 (0.7%)" },
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

            <Card className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-violet-500" />
                <h3 className="text-sm font-semibold text-violet-800">
                  Ofsted Readiness
                </h3>
              </div>
              <p className="text-xs text-violet-600 mb-3">
                Last full inspection: November 2023. Overall: Good.
              </p>
              <Separator className="bg-violet-100 mb-3" />
              {[
                { area: "Quality of Education", grade: "Good" },
                { area: "Behaviour & Attitudes", grade: "Good" },
                { area: "Personal Development", grade: "Good" },
                { area: "Leadership & Management", grade: "Outstanding" },
              ].map(({ area, grade }) => (
                <div
                  key={area}
                  className="flex items-center justify-between py-1"
                >
                  <span className="text-xs text-violet-700">{area}</span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold rounded-full px-1.5 py-0",
                      grade === "Outstanding"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700",
                    )}
                  >
                    {grade}
                  </span>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 text-xs h-7 gap-1.5 border-violet-200 text-violet-700 hover:bg-violet-100"
              >
                <TrendingDown className="h-3 w-3" />
                View Self-Evaluation
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
