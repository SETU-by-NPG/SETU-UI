import { useState } from "react";
import { useOutletContext } from "react-router";
import {
  Calendar, Plus, Trash2, Save, Loader2, Check, X, Edit2,
  ChevronRight, FolderOpen, Clock, AlertCircle, Sun, Umbrella,
  AlertTriangle, Filter, Search, MoreHorizontal, ChevronDown,
  ChevronUp, TreePine, Building2, GraduationCap, LayoutGrid,
  List, CalendarDays
} from "lucide-react";
import type { Role } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { ScrollArea } from "../components/ui/scroll-area";
import { cn } from "../components/ui/utils";

// Types
interface Holiday {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: "public" | "school" | "half-term";
  description?: string;
  affectsClasses: boolean;
}

interface Term {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: "semester" | "quarter" | "trimester";
  holidays: Holiday[];
}

interface AcademicYear {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: "active" | "upcoming" | "archived";
  terms: Term[];
}

// Sample data with holidays
const sampleAcademicYears: AcademicYear[] = [
  {
    id: "ay-2025-2026",
    year: "2025-2026",
    startDate: "2025-09-01",
    endDate: "2026-07-15",
    isCurrent: true,
    status: "active",
    terms: [
      {
        id: "term-1",
        name: "Autumn Term",
        startDate: "2025-09-01",
        endDate: "2025-12-19",
        type: "semester",
        holidays: [
          {
            id: "h-1",
            name: "Half-Term Break",
            startDate: "2025-10-27",
            endDate: "2025-10-31",
            type: "half-term",
            description: "Mid-autumn break for all students",
            affectsClasses: true,
          },
          {
            id: "h-2",
            name: "Christmas Holiday",
            startDate: "2025-12-20",
            endDate: "2026-01-04",
            type: "school",
            description: "Winter break - school closed",
            affectsClasses: true,
          },
        ],
      },
      {
        id: "term-2",
        name: "Spring Term",
        startDate: "2026-01-05",
        endDate: "2026-04-03",
        type: "semester",
        holidays: [
          {
            id: "h-3",
            name: "Half-Term Break",
            startDate: "2026-02-16",
            endDate: "2026-02-20",
            type: "half-term",
            description: "Mid-spring break",
            affectsClasses: true,
          },
          {
            id: "h-4",
            name: "Easter Holiday",
            startDate: "2026-04-04",
            endDate: "2026-04-19",
            type: "school",
            description: "Spring break",
            affectsClasses: true,
          },
        ],
      },
      {
        id: "term-3",
        name: "Summer Term",
        startDate: "2026-04-20",
        endDate: "2026-07-15",
        type: "semester",
        holidays: [
          {
            id: "h-5",
            name: "Half-Term Break",
            startDate: "2026-05-25",
            endDate: "2026-05-29",
            type: "half-term",
            description: "Late spring break",
            affectsClasses: true,
          },
          {
            id: "h-6",
            name: "Bank Holiday",
            startDate: "2026-05-04",
            endDate: "2026-05-04",
            type: "public",
            description: "May Day Bank Holiday",
            affectsClasses: false,
          },
        ],
      },
    ],
  },
  {
    id: "ay-2024-2025",
    year: "2024-2025",
    startDate: "2024-09-02",
    endDate: "2025-07-16",
    isCurrent: false,
    status: "archived",
    terms: [
      {
        id: "term-4",
        name: "Autumn Term",
        startDate: "2024-09-02",
        endDate: "2024-12-20",
        type: "semester",
        holidays: [
          {
            id: "h-7",
            name: "Half-Term Break",
            startDate: "2024-10-28",
            endDate: "2024-11-01",
            type: "half-term",
            description: "Mid-autumn break",
            affectsClasses: true,
          },
          {
            id: "h-8",
            name: "Christmas Holiday",
            startDate: "2024-12-21",
            endDate: "2025-01-05",
            type: "school",
            description: "Winter break",
            affectsClasses: true,
          },
        ],
      },
      {
        id: "term-5",
        name: "Spring Term",
        startDate: "2025-01-06",
        endDate: "2025-04-04",
        type: "semester",
        holidays: [
          {
            id: "h-9",
            name: "Half-Term Break",
            startDate: "2025-02-17",
            endDate: "2025-02-21",
            type: "half-term",
            description: "Mid-spring break",
            affectsClasses: true,
          },
        ],
      },
      {
        id: "term-6",
        name: "Summer Term",
        startDate: "2025-04-22",
        endDate: "2025-07-16",
        type: "semester",
        holidays: [
          {
            id: "h-10",
            name: "Half-Term Break",
            startDate: "2025-05-26",
            endDate: "2025-05-30",
            type: "half-term",
            description: "Late spring break",
            affectsClasses: true,
          },
        ],
      },
    ],
  },
  {
    id: "ay-2026-2027",
    year: "2026-2027",
    startDate: "2026-09-01",
    endDate: "2027-07-15",
    isCurrent: false,
    status: "upcoming",
    terms: [
      {
        id: "term-7",
        name: "Autumn Term",
        startDate: "2026-09-01",
        endDate: "2026-12-18",
        type: "semester",
        holidays: [],
      },
      {
        id: "term-8",
        name: "Spring Term",
        startDate: "2027-01-04",
        endDate: "2027-04-02",
        type: "semester",
        holidays: [],
      },
      {
        id: "term-9",
        name: "Summer Term",
        startDate: "2027-04-19",
        endDate: "2027-07-15",
        type: "semester",
        holidays: [],
      },
    ],
  },
];

// Utility functions
const getStatusColor = (status: AcademicYear["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 border-green-200";
    case "upcoming":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "archived":
      return "bg-gray-100 text-gray-600 border-gray-200";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getHolidayTypeIcon = (type: Holiday["type"]) => {
  switch (type) {
    case "public":
      return <Building2 className="w-4 h-4" />;
    case "school":
      return <GraduationCap className="w-4 h-4" />;
    case "half-term":
      return <TreePine className="w-4 h-4" />;
    default:
      return <Sun className="w-4 h-4" />;
  }
};

const getHolidayTypeColor = (type: Holiday["type"]) => {
  switch (type) {
    case "public":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "school":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "half-term":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const calculateDuration = (start: string, end: string) => {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return days;
};

const formatDateRange = (start: string, end: string) => {
  if (start === end) {
    return new Date(start).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  const startFmt = new Date(start).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  const endFmt = new Date(end).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${startFmt} - ${endFmt}`;
};

// Check for holiday conflicts
const checkConflicts = (holidays: Holiday[]): string[] => {
  const conflicts: string[] = [];
  for (let i = 0; i < holidays.length; i++) {
    for (let j = i + 1; j < holidays.length; j++) {
      const h1 = holidays[i];
      const h2 = holidays[j];
      const h1Start = new Date(h1.startDate);
      const h1End = new Date(h1.endDate);
      const h2Start = new Date(h2.startDate);
      const h2End = new Date(h2.endDate);

      if (
        (h1Start <= h2End && h1End >= h2Start) ||
        (h2Start <= h1End && h2End >= h1Start)
      ) {
        conflicts.push(`${h1.name} overlaps with ${h2.name}`);
      }
    }
  }
  return conflicts;
};

export default function AcademicPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(sampleAcademicYears);
  const [selectedYearId, setSelectedYearId] = useState<string>(sampleAcademicYears[0].id);
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set(["term-1"]));
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [filterType, setFilterType] = useState<Holiday["type"] | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Modal states
  const [showYearModal, setShowYearModal] = useState(false);
  const [showTermModal, setShowTermModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [editingTermId, setEditingTermId] = useState<string | null>(null);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);

  // Form states
  const [newYearForm, setNewYearForm] = useState({
    year: "",
    startDate: "",
    endDate: "",
  });
  const [newTermForm, setNewTermForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    type: "semester" as Term["type"],
  });
  const [newHolidayForm, setNewHolidayForm] = useState<Omit<Holiday, "id">>({
    name: "",
    startDate: "",
    endDate: "",
    type: "school",
    description: "",
    affectsClasses: true,
  });

  const selectedYear = academicYears.find((y) => y.id === selectedYearId);

  // Toggle term expansion
  const toggleTerm = (termId: string) => {
    setExpandedTerms((prev) => {
      const next = new Set(prev);
      if (next.has(termId)) {
        next.delete(termId);
      } else {
        next.add(termId);
      }
      return next;
    });
  };

  // Save handlers
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  // Add academic year
  const handleAddYear = () => {
    if (!newYearForm.year || !newYearForm.startDate || !newYearForm.endDate) return;

    const newYear: AcademicYear = {
      id: `ay-${Date.now()}`,
      year: newYearForm.year,
      startDate: newYearForm.startDate,
      endDate: newYearForm.endDate,
      isCurrent: false,
      status: "upcoming",
      terms: [],
    };

    setAcademicYears([newYear, ...academicYears]);
    setSelectedYearId(newYear.id);
    setShowYearModal(false);
    setNewYearForm({ year: "", startDate: "", endDate: "" });
  };

  // Add term
  const handleAddTerm = () => {
    if (!selectedYear || !newTermForm.name || !newTermForm.startDate || !newTermForm.endDate) return;

    const newTerm: Term = {
      id: `term-${Date.now()}`,
      name: newTermForm.name,
      startDate: newTermForm.startDate,
      endDate: newTermForm.endDate,
      type: newTermForm.type,
      holidays: [],
    };

    const updatedYears = academicYears.map((y) =>
      y.id === selectedYear.id
        ? { ...y, terms: [...y.terms, newTerm] }
        : y
    );

    setAcademicYears(updatedYears);
    setShowTermModal(false);
    setNewTermForm({ name: "", startDate: "", endDate: "", type: "semester" });
    setExpandedTerms((prev) => new Set(prev).add(newTerm.id));
  };

  // Delete term
  const handleDeleteTerm = (termId: string) => {
    if (!selectedYear) return;
    const updatedYears = academicYears.map((y) =>
      y.id === selectedYear.id
        ? { ...y, terms: y.terms.filter((t) => t.id !== termId) }
        : y
    );
    setAcademicYears(updatedYears);
  };

  // Add/edit holiday
  const handleSaveHoliday = () => {
    if (!selectedYear || !editingTermId) return;
    if (!newHolidayForm.name || !newHolidayForm.startDate || !newHolidayForm.endDate) return;

    const updatedYears = academicYears.map((y) => {
      if (y.id !== selectedYear.id) return y;

      return {
        ...y,
        terms: y.terms.map((t) => {
          if (t.id !== editingTermId) return t;

          if (editingHoliday) {
            // Edit existing
            return {
              ...t,
              holidays: t.holidays.map((h) =>
                h.id === editingHoliday.id
                  ? { ...newHolidayForm, id: h.id }
                  : h
              ),
            };
          } else {
            // Add new
            return {
              ...t,
              holidays: [
                ...t.holidays,
                { ...newHolidayForm, id: `h-${Date.now()}` },
              ],
            };
          }
        }),
      };
    });

    setAcademicYears(updatedYears);
    setShowHolidayModal(false);
    setEditingHoliday(null);
    setEditingTermId(null);
    setNewHolidayForm({
      name: "",
      startDate: "",
      endDate: "",
      type: "school",
      description: "",
      affectsClasses: true,
    });
  };

  // Delete holiday
  const handleDeleteHoliday = (termId: string, holidayId: string) => {
    if (!selectedYear) return;

    const updatedYears = academicYears.map((y) => {
      if (y.id !== selectedYear.id) return y;

      return {
        ...y,
        terms: y.terms.map((t) => {
          if (t.id !== termId) return t;
          return {
            ...t,
            holidays: t.holidays.filter((h) => h.id !== holidayId),
          };
        }),
      };
    });

    setAcademicYears(updatedYears);
  };

  // Set current year
  const setCurrentYear = (yearId: string) => {
    setAcademicYears((prev) =>
      prev.map((y) => ({
        ...y,
        isCurrent: y.id === yearId,
        status: y.id === yearId ? "active" : y.status === "active" ? "archived" : y.status,
      }))
    );
  };

  // Get filtered holidays
  const getFilteredHolidays = (holidays: Holiday[]) => {
    return holidays.filter((h) => {
      const matchesType = filterType === "all" || h.type === filterType;
      const matchesSearch =
        searchQuery === "" ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  };

  // Get all holidays for calendar view
  const getAllHolidays = () => {
    if (!selectedYear) return [];
    const allHolidays: (Holiday & { termName: string; termId: string })[] = [];
    selectedYear.terms.forEach((term) => {
      term.holidays.forEach((h) => {
        allHolidays.push({ ...h, termName: term.name, termId: term.id });
      });
    });
    return allHolidays.filter((h) => {
      const matchesType = filterType === "all" || h.type === filterType;
      const matchesSearch =
        searchQuery === "" ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#f3f2f1]">
      {/* Azure-style header */}
      <div className="bg-white border-b border-[#e1dfdd] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[#605e5c]">
              <FolderOpen className="w-5 h-5" />
              <ChevronRight className="w-4 h-4" />
              <span className="text-sm">Academic Management</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-sm font-medium text-[#323130]">Academic Years</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showSavedToast && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Check className="w-3 h-3 mr-1" />
                Saved
              </Badge>
            )}
            <Button
              onClick={() => setShowYearModal(true)}
              className="bg-[#0078d4] hover:bg-[#106ebe] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Academic Year
            </Button>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-[#323130] mt-4">Academic Years</h1>
        <p className="text-[#605e5c] text-sm mt-1">
          Manage academic years, terms, and holidays
        </p>
      </div>

      {/* Main content area - Azure style */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Resource groups style */}
        <div className="w-80 bg-white border-r border-[#e1dfdd] flex flex-col">
          <div className="p-4 border-b border-[#e1dfdd]">
            <h2 className="text-sm font-semibold text-[#323130] uppercase tracking-wide">
              Academic Years
            </h2>
            <p className="text-xs text-[#605e5c] mt-1">
              {academicYears.length} resource(s)
            </p>
          </div>
          <ScrollArea className="flex-1">
            <div className="divide-y divide-[#e1dfdd]">
              {academicYears.map((year) => (
                <div
                  key={year.id}
                  onClick={() => setSelectedYearId(year.id)}
                  className={cn(
                    "p-4 cursor-pointer transition-colors hover:bg-[#f3f2f1]",
                    selectedYearId === year.id && "bg-[#f3f2f1] border-l-4 border-l-[#0078d4]"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#0078d4]" />
                        <span className="font-medium text-[#323130] text-sm truncate">
                          {year.year}
                        </span>
                      </div>
                      <p className="text-xs text-[#605e5c] mt-1">
                        {year.terms.length} terms • {year.terms.reduce((sum, t) => sum + t.holidays.length, 0)} holidays
                      </p>
                      <p className="text-xs text-[#605e5c]">
                        {new Date(year.startDate).toLocaleDateString("en-GB")} - {new Date(year.endDate).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", getStatusColor(year.status))}
                    >
                      {year.status}
                    </Badge>
                  </div>
                  {year.isCurrent && (
                    <div className="mt-2">
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        Current Year
                      </Badge>
                    </div>
                  )}
                  {!year.isCurrent && year.status !== "archived" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentYear(year.id);
                      }}
                      className="mt-2 text-xs text-[#0078d4] hover:underline"
                    >
                      Set as current
                    </button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedYear ? (
            <>
              {/* Resource header */}
              <div className="bg-white border-b border-[#e1dfdd] px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-[#323130]">
                        {selectedYear.year}
                      </h2>
                      <Badge className={getStatusColor(selectedYear.status)}>
                        {selectedYear.status}
                      </Badge>
                      {selectedYear.isCurrent && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-[#605e5c] mt-1">
                      {new Date(selectedYear.startDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(selectedYear.endDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTermModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Term
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filters and view toggle */}
              <div className="bg-[#faf9f8] border-b border-[#e1dfdd] px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white rounded-md border border-[#e1dfdd] px-3 py-1.5">
                      <Search className="w-4 h-4 text-[#605e5c]" />
                      <Input
                        placeholder="Search holidays..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-7 w-48 text-sm"
                      />
                    </div>
                    <Select value={filterType} onValueChange={(v) => setFilterType(v as Holiday["type"] | "all")}>
                      <SelectTrigger className="w-40 h-8 text-sm bg-white">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="public">Public Holiday</SelectItem>
                        <SelectItem value="school">School Holiday</SelectItem>
                        <SelectItem value="half-term">Half-Term</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-md border border-[#e1dfdd] p-1">
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded text-sm",
                        viewMode === "list"
                          ? "bg-[#0078d4] text-white"
                          : "text-[#605e5c] hover:bg-[#f3f2f1]"
                      )}
                    >
                      <List className="w-4 h-4" />
                      List
                    </button>
                    <button
                      onClick={() => setViewMode("calendar")}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded text-sm",
                        viewMode === "calendar"
                          ? "bg-[#0078d4] text-white"
                          : "text-[#605e5c] hover:bg-[#f3f2f1]"
                      )}
                    >
                      <CalendarDays className="w-4 h-4" />
                      Calendar
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1 p-6">
                {viewMode === "list" ? (
                  <div className="space-y-4">
                    {/* Term resource groups */}
                    {selectedYear.terms.map((term) => {
                      const isExpanded = expandedTerms.has(term.id);
                      const termConflicts = checkConflicts(term.holidays);
                      const filteredHolidays = getFilteredHolidays(term.holidays);

                      return (
                        <Card key={term.id} className="border-[#e1dfdd] shadow-sm">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => toggleTerm(term.id)}
                                  className="p-1 hover:bg-[#f3f2f1] rounded"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-5 h-5 text-[#605e5c]" />
                                  ) : (
                                    <ChevronRight className="w-5 h-5 text-[#605e5c]" />
                                  )}
                                </button>
                                <div>
                                  <CardTitle className="text-base font-semibold text-[#323130]">
                                    {term.name}
                                  </CardTitle>
                                  <p className="text-sm text-[#605e5c]">
                                    {formatDateRange(term.startDate, term.endDate)} •{" "}
                                    {calculateDuration(term.startDate, term.endDate)} days •{" "}
                                    <span className="capitalize">{term.type}</span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {termConflicts.length > 0 && (
                                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    {termConflicts.length} conflict(s)
                                  </Badge>
                                )}
                                <Badge variant="outline" className="bg-[#f3f2f1] text-[#323130]">
                                  {filteredHolidays.length} holiday(s)
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingTermId(term.id);
                                    setShowHolidayModal(true);
                                  }}
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Add Holiday
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTerm(term.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>

                          {isExpanded && (
                            <CardContent className="pt-0">
                              {termConflicts.length > 0 && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                  <div className="flex items-center gap-2 text-red-700 text-sm font-medium">
                                    <AlertCircle className="w-4 h-4" />
                                    Holiday Conflicts Detected
                                  </div>
                                  <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
                                    {termConflicts.map((conflict, idx) => (
                                      <li key={idx}>{conflict}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {filteredHolidays.length === 0 ? (
                                <div className="text-center py-8 bg-[#faf9f8] rounded-md">
                                  <Umbrella className="w-10 h-10 text-[#605e5c] mx-auto mb-2 opacity-50" />
                                  <p className="text-sm text-[#605e5c]">
                                    No holidays found for this term
                                  </p>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => {
                                      setEditingTermId(term.id);
                                      setShowHolidayModal(true);
                                    }}
                                  >
                                    Add your first holiday
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {filteredHolidays.map((holiday) => (
                                    <div
                                      key={holiday.id}
                                      className="flex items-center justify-between p-3 bg-[#faf9f8] rounded-md border border-[#e1dfdd] hover:border-[#0078d4] transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={cn("p-2 rounded-md", getHolidayTypeColor(holiday.type))}>
                                          {getHolidayTypeIcon(holiday.type)}
                                        </div>
                                        <div>
                                          <p className="font-medium text-[#323130] text-sm">
                                            {holiday.name}
                                          </p>
                                          <p className="text-xs text-[#605e5c]">
                                            {formatDateRange(holiday.startDate, holiday.endDate)} •{" "}
                                            {calculateDuration(holiday.startDate, holiday.endDate)} day(s)
                                          </p>
                                          {holiday.description && (
                                            <p className="text-xs text-[#605e5c] mt-0.5">
                                              {holiday.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant="outline"
                                          className={getHolidayTypeColor(holiday.type)}
                                        >
                                          {holiday.type}
                                        </Badge>
                                        {holiday.affectsClasses && (
                                          <Badge variant="outline" className="text-xs">
                                            <GraduationCap className="w-3 h-3 mr-1" />
                                            Affects Classes
                                          </Badge>
                                        )}
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() => {
                                            setEditingTermId(term.id);
                                            setEditingHoliday(holiday);
                                            setNewHolidayForm(holiday);
                                            setShowHolidayModal(true);
                                          }}
                                        >
                                          <Edit2 className="w-4 h-4 text-[#605e5c]" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() => handleDeleteHoliday(term.id, holiday.id)}
                                        >
                                          <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          )}
                        </Card>
                      );
                    })}

                    {selectedYear.terms.length === 0 && (
                      <div className="text-center py-12 bg-white rounded-lg border border-[#e1dfdd]">
                        <LayoutGrid className="w-12 h-12 text-[#605e5c] mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-[#323130]">No terms defined</h3>
                        <p className="text-sm text-[#605e5c] mt-1">
                          Add terms to this academic year to start managing holidays
                        </p>
                        <Button
                          className="mt-4 bg-[#0078d4] hover:bg-[#106ebe]"
                          onClick={() => setShowTermModal(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Term
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Calendar View */
                  <div className="bg-white rounded-lg border border-[#e1dfdd] p-6">
                    <h3 className="text-lg font-semibold text-[#323130] mb-4">
                      Holiday Calendar - {selectedYear.year}
                    </h3>
                    <div className="space-y-2">
                      {getAllHolidays().length === 0 ? (
                        <div className="text-center py-12">
                          <Calendar className="w-12 h-12 text-[#605e5c] mx-auto mb-4 opacity-50" />
                          <p className="text-[#605e5c]">No holidays match your filters</p>
                        </div>
                      ) : (
                        getAllHolidays()
                          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                          .map((holiday) => (
                            <div
                              key={holiday.id}
                              className="flex items-center gap-4 p-3 rounded-md border border-[#e1dfdd] hover:bg-[#f3f2f1]"
                            >
                              <div className={cn("p-2 rounded-md", getHolidayTypeColor(holiday.type))}>
                                {getHolidayTypeIcon(holiday.type)}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-[#323130]">{holiday.name}</p>
                                <p className="text-sm text-[#605e5c]">
                                  {holiday.termName} • {formatDateRange(holiday.startDate, holiday.endDate)}
                                </p>
                              </div>
                              <Badge className={getHolidayTypeColor(holiday.type)}>
                                {holiday.type}
                              </Badge>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </ScrollArea>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FolderOpen className="w-16 h-16 text-[#605e5c] mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-[#323130]">Select an Academic Year</h3>
                <p className="text-sm text-[#605e5c] mt-1">
                  Choose an academic year from the sidebar to view and manage its details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Year Modal */}
      <Dialog open={showYearModal} onOpenChange={setShowYearModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Academic Year</DialogTitle>
            <DialogDescription>
              Create a new academic year with start and end dates.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#323130]">Academic Year Name *</label>
              <Input
                placeholder="e.g., 2026-2027"
                value={newYearForm.year}
                onChange={(e) => setNewYearForm({ ...newYearForm, year: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#323130]">Start Date *</label>
                <Input
                  type="date"
                  value={newYearForm.startDate}
                  onChange={(e) => setNewYearForm({ ...newYearForm, startDate: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#323130]">End Date *</label>
                <Input
                  type="date"
                  value={newYearForm.endDate}
                  onChange={(e) => setNewYearForm({ ...newYearForm, endDate: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowYearModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddYear}
              disabled={!newYearForm.year || !newYearForm.startDate || !newYearForm.endDate}
              className="bg-[#0078d4] hover:bg-[#106ebe]"
            >
              Create Academic Year
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Term Modal */}
      <Dialog open={showTermModal} onOpenChange={setShowTermModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Term</DialogTitle>
            <DialogDescription>
              Add a new term to {selectedYear?.year}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#323130]">Term Name *</label>
              <Input
                placeholder="e.g., Autumn Term"
                value={newTermForm.name}
                onChange={(e) => setNewTermForm({ ...newTermForm, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#323130]">Term Type *</label>
              <Select
                value={newTermForm.type}
                onValueChange={(v) => setNewTermForm({ ...newTermForm, type: v as Term["type"] })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semester">Semester</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="trimester">Trimester</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#323130]">Start Date *</label>
                <Input
                  type="date"
                  value={newTermForm.startDate}
                  onChange={(e) => setNewTermForm({ ...newTermForm, startDate: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#323130]">End Date *</label>
                <Input
                  type="date"
                  value={newTermForm.endDate}
                  onChange={(e) => setNewTermForm({ ...newTermForm, endDate: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTermModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddTerm}
              disabled={!newTermForm.name || !newTermForm.startDate || !newTermForm.endDate}
              className="bg-[#0078d4] hover:bg-[#106ebe]"
            >
              Add Term
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Holiday Modal */}
      <Dialog
        open={showHolidayModal}
        onOpenChange={(open) => {
          if (!open) {
            setEditingHoliday(null);
            setEditingTermId(null);
            setNewHolidayForm({
              name: "",
              startDate: "",
              endDate: "",
              type: "school",
              description: "",
              affectsClasses: true,
            });
          }
          setShowHolidayModal(open);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingHoliday ? "Edit Holiday" : "Add Holiday"}
            </DialogTitle>
            <DialogDescription>
              {editingHoliday
                ? "Update holiday details."
                : `Add a new holiday to the selected term.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#323130]">Holiday Name *</label>
              <Input
                placeholder="e.g., Christmas Break"
                value={newHolidayForm.name}
                onChange={(e) => setNewHolidayForm({ ...newHolidayForm, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#323130]">Holiday Type *</label>
              <Select
                value={newHolidayForm.type}
                onValueChange={(v) => setNewHolidayForm({ ...newHolidayForm, type: v as Holiday["type"] })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public Holiday</SelectItem>
                  <SelectItem value="school">School Holiday</SelectItem>
                  <SelectItem value="half-term">Half-Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#323130]">Start Date *</label>
                <Input
                  type="date"
                  value={newHolidayForm.startDate}
                  onChange={(e) => setNewHolidayForm({ ...newHolidayForm, startDate: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#323130]">End Date *</label>
                <Input
                  type="date"
                  value={newHolidayForm.endDate}
                  onChange={(e) => setNewHolidayForm({ ...newHolidayForm, endDate: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#323130]">Description</label>
              <Input
                placeholder="Optional description"
                value={newHolidayForm.description}
                onChange={(e) => setNewHolidayForm({ ...newHolidayForm, description: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="affectsClasses"
                checked={newHolidayForm.affectsClasses}
                onChange={(e) => setNewHolidayForm({ ...newHolidayForm, affectsClasses: e.target.checked })}
                className="rounded border-gray-300"
              />
              <label htmlFor="affectsClasses" className="text-sm text-[#323130]">
                Affects class schedules
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHolidayModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveHoliday}
              disabled={!newHolidayForm.name || !newHolidayForm.startDate || !newHolidayForm.endDate}
              className="bg-[#0078d4] hover:bg-[#106ebe]"
            >
              {editingHoliday ? "Save Changes" : "Add Holiday"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
