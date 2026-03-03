import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router";
import {
  Download,
  FileText,
  BarChart3,
  Users,
  ClipboardCheck,
  Pin,
  PinOff,
  Plus,
  Search,
  Calendar,
  Filter,
  Eye,
  Trash2,
  Edit3,
  FileSpreadsheet,
  FileCode,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Clock,
  CheckCircle2,
  X,
  Save,
  TrendingUp,
  PieChart,
  Activity,
  GraduationCap,
  School,
  BookOpen,
  Settings2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  format as formatDate,
  subDays,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import type { DateRange } from "react-day-picker";
import { attendanceChartData, gradeDistribution } from "../data/mock-data";
import type { Role } from "../types";

// UI Components
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar as CalendarComponent } from "../components/ui/calendar";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { DataTable } from "../components/data-table";

// ==================== TYPES ====================

type ReportType =
  | "attendance"
  | "grades"
  | "performance"
  | "behavior"
  | "financial"
  | "library";
type ReportViewType = "summary" | "detailed" | "trend" | "comparison";
type ExportFormat = "pdf" | "xlsx" | "csv";
type ReportDisplayView = "table" | "chart";

interface SavedView {
  id: string;
  name: string;
  description: string;
  reportType: ReportType;
  viewType: ReportViewType;
  filters: ReportFilters;
  dateRange: { from: string; to: string };
  isPinned: boolean;
  lastRunAt: string;
  createdAt: string;
}

interface ReportFilters {
  classes: string[];
  subjects: string[];
  students: string[];
  teachers: string[];
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  reportType: ReportType;
  viewType: ReportViewType;
  typicalUseCase: string;
  defaultFilters: ReportFilters;
}

interface ExportHistory {
  id: string;
  viewName: string;
  format: ExportFormat;
  exportedAt: string;
  fileName: string;
}

interface ReportDataRow {
  id: string;
  name: string;
  class?: string;
  subject?: string;
  metric: number | string;
  trend?: "up" | "down" | "neutral";
  status?: "good" | "average" | "poor";
  details?: Record<string, unknown>;
}

// ==================== MOCK DATA ====================

const MOCK_CLASSES = [
  "Grade 9-A",
  "Grade 9-B",
  "Grade 10-A",
  "Grade 10-B",
  "Grade 11-A",
  "Grade 11-B",
  "Grade 12-A",
  "Grade 12-B",
];
const MOCK_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Computer Science",
  "Geography",
];
const MOCK_STUDENTS = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown",
  "Diana Prince",
  "Eve Davis",
  "Frank Miller",
];
const MOCK_TEACHERS = [
  "Mr. Anderson",
  "Ms. Johnson",
  "Dr. Williams",
  "Mrs. Davis",
  "Mr. Brown",
];

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: "student-attendance",
    name: "Student Attendance Report",
    description:
      "Track student attendance patterns across classes and time periods",
    icon: <ClipboardCheck className="w-5 h-5" />,
    reportType: "attendance",
    viewType: "detailed",
    typicalUseCase: "Monthly attendance reviews, identifying chronic absentees",
    defaultFilters: { classes: [], subjects: [], students: [], teachers: [] },
  },
  {
    id: "grade-distribution",
    name: "Grade Distribution Analysis",
    description: "Analyze grade distributions across subjects and classes",
    icon: <BarChart3 className="w-5 h-5" />,
    reportType: "grades",
    viewType: "summary",
    typicalUseCase:
      "End-of-term grade analysis, curriculum effectiveness review",
    defaultFilters: { classes: [], subjects: [], students: [], teachers: [] },
  },
  {
    id: "class-performance",
    name: "Class Performance Overview",
    description: "Comprehensive performance metrics for entire classes",
    icon: <Users className="w-5 h-5" />,
    reportType: "performance",
    viewType: "comparison",
    typicalUseCase:
      "Comparing class performance, identifying areas for improvement",
    defaultFilters: { classes: [], subjects: [], students: [], teachers: [] },
  },
  {
    id: "student-progress",
    name: "Individual Student Progress",
    description: "Track individual student academic progress over time",
    icon: <TrendingUp className="w-5 h-5" />,
    reportType: "performance",
    viewType: "trend",
    typicalUseCase: "Parent-teacher meetings, student counseling sessions",
    defaultFilters: { classes: [], subjects: [], students: [], teachers: [] },
  },
  {
    id: "teacher-effectiveness",
    name: "Teacher Effectiveness Report",
    description: "Analyze teaching effectiveness through student outcomes",
    icon: <GraduationCap className="w-5 h-5" />,
    reportType: "performance",
    viewType: "summary",
    typicalUseCase: "Teacher evaluations, professional development planning",
    defaultFilters: { classes: [], subjects: [], students: [], teachers: [] },
  },
  {
    id: "library-usage",
    name: "Library Usage Statistics",
    description: "Track library resource utilization and borrowing patterns",
    icon: <BookOpen className="w-5 h-5" />,
    reportType: "library",
    viewType: "summary",
    typicalUseCase: "Resource planning, popular book identification",
    defaultFilters: { classes: [], subjects: [], students: [], teachers: [] },
  },
];

const SAMPLE_SAVED_VIEWS: SavedView[] = [
  {
    id: "view-1",
    name: "Monthly Attendance - Grade 10",
    description: "Monthly attendance tracking for all Grade 10 sections",
    reportType: "attendance",
    viewType: "detailed",
    filters: {
      classes: ["Grade 10-A", "Grade 10-B"],
      subjects: [],
      students: [],
      teachers: [],
    },
    dateRange: {
      from: subDays(new Date(), 30).toISOString(),
      to: new Date().toISOString(),
    },
    isPinned: true,
    lastRunAt: subDays(new Date(), 2).toISOString(),
    createdAt: subDays(new Date(), 30).toISOString(),
  },
  {
    id: "view-2",
    name: "Q1 Grade Analysis",
    description: "Quarter 1 grade distribution across all subjects",
    reportType: "grades",
    viewType: "summary",
    filters: {
      classes: [],
      subjects: MOCK_SUBJECTS,
      students: [],
      teachers: [],
    },
    dateRange: {
      from: subDays(new Date(), 90).toISOString(),
      to: new Date().toISOString(),
    },
    isPinned: true,
    lastRunAt: subDays(new Date(), 5).toISOString(),
    createdAt: subDays(new Date(), 90).toISOString(),
  },
  {
    id: "view-3",
    name: "Science Performance Comparison",
    description: "Compare Physics, Chemistry, and Biology performance",
    reportType: "performance",
    viewType: "comparison",
    filters: {
      classes: [],
      subjects: ["Physics", "Chemistry", "Biology"],
      students: [],
      teachers: [],
    },
    dateRange: {
      from: subDays(new Date(), 60).toISOString(),
      to: new Date().toISOString(),
    },
    isPinned: false,
    lastRunAt: subDays(new Date(), 10).toISOString(),
    createdAt: subDays(new Date(), 60).toISOString(),
  },
  {
    id: "view-4",
    name: "At-Risk Students Report",
    description: "Students with attendance or grade concerns",
    reportType: "behavior",
    viewType: "detailed",
    filters: { classes: [], subjects: [], students: [], teachers: [] },
    dateRange: {
      from: subDays(new Date(), 30).toISOString(),
      to: new Date().toISOString(),
    },
    isPinned: false,
    lastRunAt: subDays(new Date(), 7).toISOString(),
    createdAt: subDays(new Date(), 45).toISOString(),
  },
];

const SAMPLE_REPORT_DATA: ReportDataRow[] = [
  {
    id: "1",
    name: "Alice Johnson",
    class: "Grade 10-A",
    subject: "Mathematics",
    metric: 92,
    trend: "up",
    status: "good",
  },
  {
    id: "2",
    name: "Bob Smith",
    class: "Grade 10-A",
    subject: "Mathematics",
    metric: 78,
    trend: "neutral",
    status: "average",
  },
  {
    id: "3",
    name: "Charlie Brown",
    class: "Grade 10-A",
    subject: "Mathematics",
    metric: 85,
    trend: "up",
    status: "good",
  },
  {
    id: "4",
    name: "Diana Prince",
    class: "Grade 10-B",
    subject: "Mathematics",
    metric: 95,
    trend: "up",
    status: "good",
  },
  {
    id: "5",
    name: "Eve Davis",
    class: "Grade 10-B",
    subject: "Mathematics",
    metric: 67,
    trend: "down",
    status: "poor",
  },
  {
    id: "6",
    name: "Frank Miller",
    class: "Grade 10-B",
    subject: "Mathematics",
    metric: 88,
    trend: "neutral",
    status: "good",
  },
  {
    id: "7",
    name: "Grace Lee",
    class: "Grade 11-A",
    subject: "Physics",
    metric: 91,
    trend: "up",
    status: "good",
  },
  {
    id: "8",
    name: "Henry Wilson",
    class: "Grade 11-A",
    subject: "Physics",
    metric: 73,
    trend: "down",
    status: "average",
  },
  {
    id: "9",
    name: "Ivy Chen",
    class: "Grade 11-B",
    subject: "Chemistry",
    metric: 89,
    trend: "up",
    status: "good",
  },
  {
    id: "10",
    name: "Jack Taylor",
    class: "Grade 11-B",
    subject: "Chemistry",
    metric: 82,
    trend: "neutral",
    status: "average",
  },
  {
    id: "11",
    name: "Kelly White",
    class: "Grade 12-A",
    subject: "Computer Science",
    metric: 96,
    trend: "up",
    status: "good",
  },
  {
    id: "12",
    name: "Liam Brown",
    class: "Grade 12-A",
    subject: "Computer Science",
    metric: 88,
    trend: "neutral",
    status: "good",
  },
];

// ==================== UTILITY FUNCTIONS ====================

const generateFileName = (
  viewName: string,
  fileFormat: ExportFormat,
): string => {
  const date = formatDate(new Date(), "yyyy-MM-dd");
  const sanitizedName = viewName.replace(/[^a-zA-Z0-9]/g, "_");
  return `${sanitizedName}_${date}.${fileFormat}`;
};

// ==================== COMPONENTS ====================

/**
 * Date Range Picker Component
 */
function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}) {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {formatDate(dateRange.from, "LLL dd, y")} -{" "}
                  {formatDate(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                formatDate(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/**
 * Saved View Card Component
 */
function SavedViewCard({
  view,
  onPinToggle,
  onLoad,
  onEdit,
  onDelete,
  onExport,
}: {
  view: SavedView;
  onPinToggle: (id: string) => void;
  onLoad: (view: SavedView) => void;
  onEdit: (view: SavedView) => void;
  onDelete: (id: string) => void;
  onExport: (view: SavedView, format: ExportFormat) => void;
}) {
  const getReportTypeIcon = (type: ReportType) => {
    switch (type) {
      case "attendance":
        return <ClipboardCheck className="w-4 h-4" />;
      case "grades":
        return <BarChart3 className="w-4 h-4" />;
      case "performance":
        return <TrendingUp className="w-4 h-4" />;
      case "behavior":
        return <Activity className="w-4 h-4" />;
      case "library":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getViewTypeLabel = (type: ReportViewType) => {
    switch (type) {
      case "summary":
        return "Summary";
      case "detailed":
        return "Detailed";
      case "trend":
        return "Trend Analysis";
      case "comparison":
        return "Comparison";
      default:
        return type;
    }
  };

  return (
    <Card
      className={`group transition-all hover:shadow-md ${view.isPinned ? "border-primary/50 bg-primary/5" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-muted">
              {getReportTypeIcon(view.reportType)}
            </div>
            <div>
              <CardTitle className="text-sm font-medium">{view.name}</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {getViewTypeLabel(view.viewType)}
              </CardDescription>
            </div>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPinToggle(view.id)}
                >
                  {view.isPinned ? (
                    <Pin className="h-4 w-4 text-primary fill-primary" />
                  ) : (
                    <PinOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{view.isPinned ? "Unpin" : "Pin"}</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {view.description}
        </p>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              Last run: {formatDate(new Date(view.lastRunAt), "MMM d")}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => onLoad(view)}
        >
          <Eye className="w-3.5 h-3.5 mr-1" /> Load
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(view)}>
              <Edit3 className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onExport(view, "pdf")}>
              <FileText className="w-4 h-4 mr-2" /> Export PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport(view, "xlsx")}>
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Export Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport(view, "csv")}>
              <FileCode className="w-4 h-4 mr-2" /> Export CSV
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(view.id)}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

/**
 * Report Template Card Component
 */
function ReportTemplateCard({
  template,
  onSelect,
}: {
  template: ReportTemplate;
  onSelect: (template: ReportTemplate) => void;
}) {
  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
      onClick={() => onSelect(template)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {template.icon}
          </div>
          <div>
            <CardTitle className="text-sm font-medium">
              {template.name}
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              {template.viewType.charAt(0).toUpperCase() +
                template.viewType.slice(1)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground">{template.description}</p>
        <div className="mt-3 p-2 rounded bg-muted/50">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Use case:</span>{" "}
            {template.typicalUseCase}
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-1" /> Use Template
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Custom Report Builder Dialog
 */
function CustomReportDialog({
  open,
  onOpenChange,
  onSave,
  initialView,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (view: Omit<SavedView, "id" | "createdAt" | "lastRunAt">) => void;
  initialView?: SavedView | null;
}) {
  const [name, setName] = useState(initialView?.name || "");
  const [description, setDescription] = useState(
    initialView?.description || "",
  );
  const [reportType, setReportType] = useState<ReportType>(
    initialView?.reportType || "attendance",
  );
  const [viewType, setViewType] = useState<ReportViewType>(
    initialView?.viewType || "summary",
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialView
      ? {
          from: new Date(initialView.dateRange.from),
          to: new Date(initialView.dateRange.to),
        }
      : { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
  );
  const [filters, setFilters] = useState<ReportFilters>(
    initialView?.filters || {
      classes: [],
      subjects: [],
      students: [],
      teachers: [],
    },
  );

  useEffect(() => {
    if (initialView) {
      setName(initialView.name);
      setDescription(initialView.description);
      setReportType(initialView.reportType);
      setViewType(initialView.viewType);
      setDateRange({
        from: new Date(initialView.dateRange.from),
        to: new Date(initialView.dateRange.to),
      });
      setFilters(initialView.filters);
    }
  }, [initialView]);

  const handleSave = () => {
    onSave({
      name,
      description,
      reportType,
      viewType,
      filters,
      dateRange: {
        from: dateRange?.from?.toISOString() || new Date().toISOString(),
        to: dateRange?.to?.toISOString() || new Date().toISOString(),
      },
      isPinned: false,
    });
    onOpenChange(false);
    // Reset form
    setName("");
    setDescription("");
    setReportType("attendance");
    setViewType("summary");
    setDateRange({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    });
    setFilters({ classes: [], subjects: [], students: [], teachers: [] });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialView ? "Edit Custom Report" : "Create Custom Report"}
          </DialogTitle>
          <DialogDescription>
            Configure your report parameters and filters
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Basic Info */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Report Name</Label>
              <Input
                id="name"
                placeholder="e.g., Monthly Attendance Summary"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this report..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <Separator />

          {/* Report Type & View Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Report Type</Label>
              <Select
                value={reportType}
                onValueChange={(v) => setReportType(v as ReportType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">Attendance</SelectItem>
                  <SelectItem value="grades">Grades</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="behavior">Behavior</SelectItem>
                  <SelectItem value="library">Library</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>View Type</Label>
              <Select
                value={viewType}
                onValueChange={(v) => setViewType(v as ReportViewType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="trend">Trend Analysis</SelectItem>
                  <SelectItem value="comparison">Comparison</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid gap-2">
            <Label>Date Range</Label>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>

          <Separator />

          {/* Filters */}
          <div className="grid gap-4">
            <Label className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </Label>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-xs text-muted-foreground">Classes</Label>
                <Select
                  value={filters.classes[0] || "all"}
                  onValueChange={(v) =>
                    setFilters({ ...filters, classes: v === "all" ? [] : [v] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {MOCK_CLASSES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs text-muted-foreground">
                  Subjects
                </Label>
                <Select
                  value={filters.subjects[0] || "all"}
                  onValueChange={(v) =>
                    setFilters({ ...filters, subjects: v === "all" ? [] : [v] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {MOCK_SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            <Save className="w-4 h-4 mr-2" /> {initialView ? "Update" : "Save"}{" "}
            Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Export History Component
 */
function ExportHistoryList({ history }: { history: ExportHistory[] }) {
  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case "pdf":
        return <FileText className="w-4 h-4 text-red-500" />;
      case "xlsx":
        return <FileSpreadsheet className="w-4 h-4 text-green-500" />;
      case "csv":
        return <FileCode className="w-4 h-4 text-blue-500" />;
    }
  };

  const getFormatLabel = (format: ExportFormat) => {
    return format.toUpperCase();
  };

  return (
    <div className="space-y-2">
      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No exports yet
        </p>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {getFormatIcon(item.format)}
              <div>
                <p className="text-sm font-medium">{item.viewName}</p>
                <p className="text-xs text-muted-foreground">{item.fileName}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="text-xs">
                {getFormatLabel(item.format)}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(new Date(item.exportedAt), "MMM d, h:mm a")}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/**
 * Main Reports Page Component
 */
export default function ReportsPage() {
  const { role } = useOutletContext<{ role: Role }>();

  // State
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);
  const [activeView, setActiveView] = useState<SavedView | null>(null);
  const [displayView, setDisplayView] = useState<ReportDisplayView>("table");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [customReportOpen, setCustomReportOpen] = useState(false);
  const [editingView, setEditingView] = useState<SavedView | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<ReportDataRow[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedViews = localStorage.getItem("setu_saved_report_views");
    const storedHistory = localStorage.getItem("setu_export_history");

    if (storedViews) {
      try {
        setSavedViews(JSON.parse(storedViews));
      } catch {
        setSavedViews(SAMPLE_SAVED_VIEWS);
      }
    } else {
      setSavedViews(SAMPLE_SAVED_VIEWS);
    }

    if (storedHistory) {
      try {
        setExportHistory(JSON.parse(storedHistory));
      } catch {
        setExportHistory([]);
      }
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (savedViews.length > 0) {
      localStorage.setItem(
        "setu_saved_report_views",
        JSON.stringify(savedViews),
      );
    }
  }, [savedViews]);

  useEffect(() => {
    if (exportHistory.length > 0) {
      localStorage.setItem(
        "setu_export_history",
        JSON.stringify(exportHistory),
      );
    }
  }, [exportHistory]);

  // Derived state
  const pinnedViews = useMemo(
    () => savedViews.filter((v) => v.isPinned),
    [savedViews],
  );
  const unpinnedViews = useMemo(
    () => savedViews.filter((v) => !v.isPinned),
    [savedViews],
  );

  // Handlers
  const handlePinToggle = (id: string) => {
    setSavedViews((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isPinned: !v.isPinned } : v)),
    );
  };

  const handleLoadView = (view: SavedView) => {
    setActiveView(view);
    // Simulate loading data
    setPreviewData(SAMPLE_REPORT_DATA);
    setShowPreview(true);
    // Update last run date
    setSavedViews((prev) =>
      prev.map((v) =>
        v.id === view.id ? { ...v, lastRunAt: new Date().toISOString() } : v,
      ),
    );
  };

  const handleEditView = (view: SavedView) => {
    setEditingView(view);
    setCustomReportOpen(true);
  };

  const handleDeleteView = (id: string) => {
    setSavedViews((prev) => prev.filter((v) => v.id !== id));
    if (activeView?.id === id) {
      setActiveView(null);
      setShowPreview(false);
    }
  };

  const handleSaveView = (
    viewData: Omit<SavedView, "id" | "createdAt" | "lastRunAt">,
  ) => {
    if (editingView) {
      setSavedViews((prev) =>
        prev.map((v) => (v.id === editingView.id ? { ...v, ...viewData } : v)),
      );
      setEditingView(null);
    } else {
      const newView: SavedView = {
        ...viewData,
        id: `view-${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastRunAt: new Date().toISOString(),
      };
      setSavedViews((prev) => [...prev, newView]);
    }
  };

  const handleExport = (view: SavedView, format: ExportFormat) => {
    const fileName = generateFileName(view.name, format);
    const newExport: ExportHistory = {
      id: `export-${Date.now()}`,
      viewName: view.name,
      format,
      exportedAt: new Date().toISOString(),
      fileName,
    };
    setExportHistory((prev) => [newExport, ...prev].slice(0, 20)); // Keep last 20

    // Simulate download
    setTimeout(() => {
      alert(`Downloading ${fileName}`);
    }, 100);
  };

  const handleTemplateSelect = (template: ReportTemplate) => {
    const newView: SavedView = {
      id: `view-${Date.now()}`,
      name: `${template.name} - ${formatDate(new Date(), "MMM d")}`,
      description: template.description,
      reportType: template.reportType,
      viewType: template.viewType,
      filters: template.defaultFilters,
      dateRange: {
        from: subDays(new Date(), 30).toISOString(),
        to: new Date().toISOString(),
      },
      isPinned: false,
      lastRunAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setSavedViews((prev) => [...prev, newView]);
    handleLoadView(newView);
  };

  // Parent view (unchanged from original)
  if (role === "parent") {
    return (
      <div>
        <div className="mb-6">
          <h1>Report Card</h1>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            Alice Johnson's academic report.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2>Academic Report - Spring 2026</h2>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.875rem" }}
              >
                Grade 10-A &middot; Roll #1001
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted"
              style={{ fontSize: "0.875rem" }}
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th
                    className="text-left py-3 text-muted-foreground"
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    Subject
                  </th>
                  <th
                    className="text-left py-3 text-muted-foreground"
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    Score
                  </th>
                  <th
                    className="text-left py-3 text-muted-foreground"
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    Grade
                  </th>
                  <th
                    className="text-left py-3 text-muted-foreground"
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    subject: "Mathematics",
                    score: 92,
                    grade: "A",
                    remarks: "Excellent",
                  },
                  {
                    subject: "Physics",
                    score: 88,
                    grade: "A-",
                    remarks: "Very Good",
                  },
                  {
                    subject: "English",
                    score: 85,
                    grade: "B+",
                    remarks: "Good",
                  },
                  {
                    subject: "History",
                    score: 90,
                    grade: "A",
                    remarks: "Excellent",
                  },
                  {
                    subject: "Computer Science",
                    score: 95,
                    grade: "A+",
                    remarks: "Outstanding",
                  },
                ].map((row) => (
                  <tr
                    key={row.subject}
                    className="border-b border-border last:border-b-0"
                  >
                    <td
                      className="py-3"
                      style={{ fontWeight: 500, fontSize: "0.875rem" }}
                    >
                      {row.subject}
                    </td>
                    <td className="py-3" style={{ fontSize: "0.875rem" }}>
                      {row.score}/100
                    </td>
                    <td className="py-3">
                      <span
                        className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200"
                        style={{ fontSize: "0.75rem", fontWeight: 500 }}
                      >
                        {row.grade}
                      </span>
                    </td>
                    <td
                      className="py-3 text-muted-foreground"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {row.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <div>
              <span
                className="text-muted-foreground"
                style={{ fontSize: "0.875rem" }}
              >
                Overall GPA:{" "}
              </span>
              <span style={{ fontWeight: 600, fontSize: "1.125rem" }}>3.8</span>
            </div>
            <div>
              <span
                className="text-muted-foreground"
                style={{ fontSize: "0.875rem" }}
              >
                Attendance:{" "}
              </span>
              <span style={{ fontWeight: 600, fontSize: "1.125rem" }}>94%</span>
            </div>
            <div>
              <span
                className="text-muted-foreground"
                style={{ fontSize: "0.875rem" }}
              >
                Rank:{" "}
              </span>
              <span style={{ fontWeight: 600, fontSize: "1.125rem" }}>
                3/25
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin/Teacher view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create, save, and export custom reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCustomReportOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Report
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Clock className="w-4 h-4 mr-2" /> Export History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Export History</DialogTitle>
                <DialogDescription>Recently exported reports</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[400px]">
                <ExportHistoryList history={exportHistory} />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="saved" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="saved">Saved Views</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="preview" disabled={!showPreview}>
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Saved Views Tab */}
        <TabsContent value="saved" className="space-y-6">
          {/* Pinned Views Section */}
          {pinnedViews.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Pin className="w-4 h-4" /> Pinned Views
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedViews.map((view) => (
                  <SavedViewCard
                    key={view.id}
                    view={view}
                    onPinToggle={handlePinToggle}
                    onLoad={handleLoadView}
                    onEdit={handleEditView}
                    onDelete={handleDeleteView}
                    onExport={handleExport}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Saved Views */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                All Saved Views ({savedViews.length})
              </h3>
              {unpinnedViews.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCustomReportOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-1" /> Create New
                </Button>
              )}
            </div>
            {savedViews.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-full bg-muted">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">No saved views yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Create custom reports or use templates to get started
                  </p>
                  <Button
                    onClick={() => setCustomReportOpen(true)}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Create Your First Report
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unpinnedViews.map((view) => (
                  <SavedViewCard
                    key={view.id}
                    view={view}
                    onPinToggle={handlePinToggle}
                    onLoad={handleLoadView}
                    onEdit={handleEditView}
                    onDelete={handleDeleteView}
                    onExport={handleExport}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> Report Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {REPORT_TEMPLATES.map((template) => (
                <ReportTemplateCard
                  key={template.id}
                  template={template}
                  onSelect={handleTemplateSelect}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          {activeView && showPreview && (
            <div className="space-y-4">
              {/* Preview Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{activeView.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {activeView.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">
                      {activeView.reportType.charAt(0).toUpperCase() +
                        activeView.reportType.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      {activeView.viewType.charAt(0).toUpperCase() +
                        activeView.viewType.slice(1)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(new Date(activeView.dateRange.from), "MMM d")}{" "}
                      -{" "}
                      {formatDate(
                        new Date(activeView.dateRange.to),
                        "MMM d, yyyy",
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* View Toggle */}
                  <div className="flex items-center border rounded-lg p-1">
                    <Button
                      variant={displayView === "table" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8"
                      onClick={() => setDisplayView("table")}
                    >
                      <List className="w-4 h-4 mr-1" /> Table
                    </Button>
                    <Button
                      variant={displayView === "chart" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8"
                      onClick={() => setDisplayView("chart")}
                    >
                      <BarChart3 className="w-4 h-4 mr-1" /> Chart
                    </Button>
                  </div>

                  {/* Export Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <Download className="w-4 h-4 mr-2" /> Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleExport(activeView, "pdf")}
                      >
                        <FileText className="w-4 h-4 mr-2 text-red-500" />{" "}
                        Export as PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExport(activeView, "xlsx")}
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2 text-green-500" />{" "}
                        Export as Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExport(activeView, "csv")}
                      >
                        <FileCode className="w-4 h-4 mr-2 text-blue-500" />{" "}
                        Export as CSV
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Preview Content */}
              <Card>
                <CardContent className="p-6">
                  {displayView === "table" ? (
                    <DataTable
                      data={previewData}
                      columns={[
                        {
                          key: "name",
                          label: "Name",
                          render: (row) => (
                            <span className="font-medium">{row.name}</span>
                          ),
                        },
                        {
                          key: "class",
                          label: "Class",
                          render: (row) => row.class || "-",
                        },
                        {
                          key: "subject",
                          label: "Subject",
                          render: (row) => row.subject || "-",
                        },
                        {
                          key: "metric",
                          label: "Score",
                          render: (row) => (
                            <span
                              className={`font-medium ${
                                typeof row.metric === "number" &&
                                row.metric >= 90
                                  ? "text-green-600"
                                  : typeof row.metric === "number" &&
                                      row.metric >= 70
                                    ? "text-amber-600"
                                    : "text-red-600"
                              }`}
                            >
                              {row.metric}
                            </span>
                          ),
                        },
                        {
                          key: "trend",
                          label: "Trend",
                          render: (row) => {
                            if (!row.trend) return "-";
                            return (
                              <span
                                className={`flex items-center gap-1 ${
                                  row.trend === "up"
                                    ? "text-green-600"
                                    : row.trend === "down"
                                      ? "text-red-600"
                                      : "text-gray-500"
                                }`}
                              >
                                {row.trend === "up"
                                  ? "↑"
                                  : row.trend === "down"
                                    ? "↓"
                                    : "→"}
                                {row.trend === "up"
                                  ? "Improving"
                                  : row.trend === "down"
                                    ? "Declining"
                                    : "Stable"}
                              </span>
                            );
                          },
                        },
                        {
                          key: "status",
                          label: "Status",
                          render: (row) => {
                            if (!row.status) return "-";
                            const colors = {
                              good: "bg-green-100 text-green-800 border-green-200",
                              average:
                                "bg-amber-100 text-amber-800 border-amber-200",
                              poor: "bg-red-100 text-red-800 border-red-200",
                            };
                            return (
                              <Badge
                                variant="outline"
                                className={colors[row.status]}
                              >
                                {row.status.charAt(0).toUpperCase() +
                                  row.status.slice(1)}
                              </Badge>
                            );
                          },
                        },
                      ]}
                      searchKey={(row) => row.name}
                      searchPlaceholder="Search by name..."
                      pageSize={pageSize}
                      onPageSizeChange={setPageSize}
                      pageSizeOptions={[5, 10, 25, 50]}
                    />
                  ) : (
                    <div className="space-y-6">
                      <div className="h-[300px]">
                        <h4 className="text-sm font-medium mb-4">
                          Score Distribution
                        </h4>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={previewData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="var(--border)"
                            />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 12 }}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <RechartsTooltip />
                            <Bar
                              dataKey="metric"
                              fill="#4f46e5"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <Separator />
                      <div className="h-[300px]">
                        <h4 className="text-sm font-medium mb-4">
                          Trend Analysis
                        </h4>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={previewData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="var(--border)"
                            />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 12 }}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <RechartsTooltip />
                            <Line
                              type="monotone"
                              dataKey="metric"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Custom Report Dialog */}
      <CustomReportDialog
        open={customReportOpen}
        onOpenChange={(open) => {
          setCustomReportOpen(open);
          if (!open) setEditingView(null);
        }}
        onSave={handleSaveView}
        initialView={editingView}
      />
    </div>
  );
}
