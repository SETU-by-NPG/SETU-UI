import { useState } from "react";
import { useOutletContext } from "react-router";
import {
  Plus, Trash2, Save, Loader2, Check, Edit2, ChevronRight, FolderOpen,
  GraduationCap, Users, MoreHorizontal, ChevronDown, ChevronUp,
  LayoutGrid, ListTree, Search, Filter, School, BookOpen
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
import { ScrollArea } from "../components/ui/scroll-area";
import { cn } from "../components/ui/utils";

// Types for nested structure
interface Subgroup {
  id: string;
  name: string;
  description?: string;
  studentCount: number;
}

interface Section {
  id: string;
  name: string;
  description?: string;
  studentCount: number;
  subgroups: Subgroup[];
}

interface ClassGrade {
  id: string;
  name: string;
  level: number;
  description: string;
  studentCount: number;
  sections: Section[];
  status: "active" | "inactive";
}

// Sample data with nested structure
const sampleClasses: ClassGrade[] = [
  {
    id: "cg-001",
    name: "Grade 1",
    level: 1,
    description: "Primary Year 1 - Foundation Stage",
    studentCount: 53,
    status: "active",
    sections: [
      {
        id: "sec-001",
        name: "Section A",
        description: "Primary group",
        studentCount: 28,
        subgroups: [
          { id: "sg-001", name: "Red Group", description: "Morning sessions", studentCount: 14 },
          { id: "sg-002", name: "Blue Group", description: "Afternoon sessions", studentCount: 14 },
        ],
      },
      {
        id: "sec-002",
        name: "Section B",
        description: "Secondary group",
        studentCount: 25,
        subgroups: [
          { id: "sg-003", name: "Green Group", description: "Morning sessions", studentCount: 13 },
          { id: "sg-004", name: "Yellow Group", description: "Afternoon sessions", studentCount: 12 },
        ],
      },
    ],
  },
  {
    id: "cg-002",
    name: "Grade 2",
    level: 2,
    description: "Primary Year 2",
    studentCount: 71,
    status: "active",
    sections: [
      {
        id: "sec-003",
        name: "Section A",
        description: "Standard track",
        studentCount: 24,
        subgroups: [],
      },
      {
        id: "sec-004",
        name: "Section B",
        description: "Standard track",
        studentCount: 22,
        subgroups: [],
      },
      {
        id: "sec-005",
        name: "Section C",
        description: "Advanced track",
        studentCount: 25,
        subgroups: [
          { id: "sg-005", name: "Alpha Group", description: "Advanced learners", studentCount: 12 },
          { id: "sg-006", name: "Beta Group", description: "Advanced learners", studentCount: 13 },
        ],
      },
    ],
  },
  {
    id: "cg-003",
    name: "Grade 3",
    level: 3,
    description: "Primary Year 3",
    studentCount: 55,
    status: "active",
    sections: [
      {
        id: "sec-006",
        name: "Section A",
        description: "Main stream",
        studentCount: 29,
        subgroups: [],
      },
      {
        id: "sec-007",
        name: "Section B",
        description: "Main stream",
        studentCount: 26,
        subgroups: [],
      },
    ],
  },
  {
    id: "cg-009",
    name: "Grade 9",
    level: 9,
    description: "High School Year 9 - Secondary",
    studentCount: 62,
    status: "active",
    sections: [
      {
        id: "sec-008",
        name: "Science Stream",
        description: "Science-focused curriculum",
        studentCount: 32,
        subgroups: [
          { id: "sg-007", name: "Physics Group", description: "Physics emphasis", studentCount: 16 },
          { id: "sg-008", name: "Biology Group", description: "Biology emphasis", studentCount: 16 },
        ],
      },
      {
        id: "sec-009",
        name: "Commerce Stream",
        description: "Business-focused curriculum",
        studentCount: 30,
        subgroups: [
          { id: "sg-009", name: "Accounting Group", description: "Accounting track", studentCount: 15 },
          { id: "sg-010", name: "Economics Group", description: "Economics track", studentCount: 15 },
        ],
      },
    ],
  },
  {
    id: "cg-010",
    name: "Grade 10",
    level: 10,
    description: "High School Year 10 - Secondary",
    studentCount: 33,
    status: "active",
    sections: [
      {
        id: "sec-010",
        name: "Section A",
        description: "Comprehensive",
        studentCount: 33,
        subgroups: [],
      },
    ],
  },
  {
    id: "cg-011",
    name: "Grade 11",
    level: 11,
    description: "High School Year 11 - Pre-University",
    studentCount: 53,
    status: "active",
    sections: [
      {
        id: "sec-011",
        name: "Science Stream",
        description: "Pre-medical/Pre-engineering",
        studentCount: 28,
        subgroups: [
          { id: "sg-011", name: "Pre-Medical", description: "Medical track", studentCount: 14 },
          { id: "sg-012", name: "Pre-Engineering", description: "Engineering track", studentCount: 14 },
        ],
      },
      {
        id: "sec-012",
        name: "Commerce Stream",
        description: "Business studies",
        studentCount: 25,
        subgroups: [
          { id: "sg-013", name: "Business Group", description: "Business track", studentCount: 13 },
          { id: "sg-014", name: "Accounting Group", description: "Accounting track", studentCount: 12 },
        ],
      },
    ],
  },
  {
    id: "cg-012",
    name: "Grade 12",
    level: 12,
    description: "High School Year 12 - Final Year",
    studentCount: 58,
    status: "active",
    sections: [
      {
        id: "sec-013",
        name: "Science Stream",
        description: "Final year science",
        studentCount: 30,
        subgroups: [
          { id: "sg-015", name: "Medical", description: "Medical final year", studentCount: 15 },
          { id: "sg-016", name: "Engineering", description: "Engineering final year", studentCount: 15 },
        ],
      },
      {
        id: "sec-014",
        name: "Commerce Stream",
        description: "Final year commerce",
        studentCount: 28,
        subgroups: [
          { id: "sg-017", name: "Business", description: "Business final year", studentCount: 14 },
          { id: "sg-018", name: "Accounting", description: "Accounting final year", studentCount: 14 },
        ],
      },
    ],
  },
];

// Utility functions
const getLevelColor = (level: number) => {
  if (level <= 3) return "bg-green-100 text-green-700 border-green-200";
  if (level <= 6) return "bg-blue-100 text-blue-700 border-blue-200";
  if (level <= 9) return "bg-purple-100 text-purple-700 border-purple-200";
  return "bg-amber-100 text-amber-700 border-amber-200";
};

const getLevelLabel = (level: number) => {
  if (level <= 3) return "Primary";
  if (level <= 6) return "Elementary";
  if (level <= 9) return "Middle";
  return "High School";
};

export default function ClassesPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [classes, setClasses] = useState<ClassGrade[]>(sampleClasses);
  const [selectedClassId, setSelectedClassId] = useState<string>(sampleClasses[0].id);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"tree" | "list">("tree");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<"all" | "primary" | "middle" | "high">("all");

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Modal states
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showSubgroupModal, setShowSubgroupModal] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSubgroup, setEditingSubgroup] = useState<{ sectionId: string; subgroup: Subgroup } | null>(null);

  // Form states
  const [newClassForm, setNewClassForm] = useState({
    name: "",
    level: 1,
    description: "",
  });
  const [newSectionForm, setNewSectionForm] = useState({
    name: "",
    description: "",
  });
  const [newSubgroupForm, setNewSubgroupForm] = useState({
    name: "",
    description: "",
  });

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Expand all sections
  const expandAll = () => {
    if (selectedClass) {
      setExpandedSections(new Set(selectedClass.sections.map((s) => s.id)));
    }
  };

  // Collapse all sections
  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  // Add class
  const handleAddClass = () => {
    if (!newClassForm.name) return;

    const newClass: ClassGrade = {
      id: `cg-${Date.now()}`,
      name: newClassForm.name,
      level: newClassForm.level,
      description: newClassForm.description,
      studentCount: 0,
      status: "active",
      sections: [],
    };

    setClasses([...classes, newClass].sort((a, b) => a.level - b.level));
    setSelectedClassId(newClass.id);
    setShowClassModal(false);
    setNewClassForm({ name: "", level: 1, description: "" });
  };

  // Delete class
  const handleDeleteClass = (classId: string) => {
    const updated = classes.filter((c) => c.id !== classId);
    setClasses(updated);
    if (selectedClassId === classId && updated.length > 0) {
      setSelectedClassId(updated[0].id);
    }
  };

  // Add section
  const handleAddSection = () => {
    if (!selectedClass || !newSectionForm.name) return;

    const newSection: Section = {
      id: `sec-${Date.now()}`,
      name: newSectionForm.name,
      description: newSectionForm.description,
      studentCount: 0,
      subgroups: [],
    };

    const updatedClasses = classes.map((c) =>
      c.id === selectedClass.id
        ? { ...c, sections: [...c.sections, newSection] }
        : c
    );

    setClasses(updatedClasses);
    setShowSectionModal(false);
    setNewSectionForm({ name: "", description: "" });
    setExpandedSections((prev) => new Set(prev).add(newSection.id));
  };

  // Delete section
  const handleDeleteSection = (sectionId: string) => {
    if (!selectedClass) return;

    const updatedClasses = classes.map((c) =>
      c.id === selectedClass.id
        ? { ...c, sections: c.sections.filter((s) => s.id !== sectionId) }
        : c
    );

    setClasses(updatedClasses);
  };

  // Add/edit subgroup
  const handleSaveSubgroup = () => {
    if (!selectedClass || !editingSectionId || !newSubgroupForm.name) return;

    const updatedClasses = classes.map((c) => {
      if (c.id !== selectedClass.id) return c;

      return {
        ...c,
        sections: c.sections.map((s) => {
          if (s.id !== editingSectionId) return s;

          if (editingSubgroup) {
            // Edit existing
            return {
              ...s,
              subgroups: s.subgroups.map((sg) =>
                sg.id === editingSubgroup.subgroup.id
                  ? { ...sg, ...newSubgroupForm }
                  : sg
              ),
            };
          } else {
            // Add new
            return {
              ...s,
              subgroups: [
                ...s.subgroups,
                { ...newSubgroupForm, id: `sg-${Date.now()}`, studentCount: 0 },
              ],
            };
          }
        }),
      };
    });

    setClasses(updatedClasses);
    setShowSubgroupModal(false);
    setEditingSectionId(null);
    setEditingSubgroup(null);
    setNewSubgroupForm({ name: "", description: "" });
  };

  // Delete subgroup
  const handleDeleteSubgroup = (sectionId: string, subgroupId: string) => {
    if (!selectedClass) return;

    const updatedClasses = classes.map((c) => {
      if (c.id !== selectedClass.id) return c;

      return {
        ...c,
        sections: c.sections.map((s) => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            subgroups: s.subgroups.filter((sg) => sg.id !== subgroupId),
          };
        }),
      };
    });

    setClasses(updatedClasses);
  };

  // Get filtered classes
  const getFilteredClasses = () => {
    return classes.filter((c) => {
      const matchesSearch =
        searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel =
        filterLevel === "all" ||
        (filterLevel === "primary" && c.level <= 3) ||
        (filterLevel === "middle" && c.level >= 4 && c.level <= 9) ||
        (filterLevel === "high" && c.level >= 10);
      return matchesSearch && matchesLevel;
    });
  };

  // Calculate totals
  const getTotalStudents = () => {
    return classes.reduce((sum, c) => sum + c.studentCount, 0);
  };

  const getTotalSections = () => {
    return classes.reduce((sum, c) => sum + c.sections.length, 0);
  };

  const getTotalSubgroups = () => {
    return classes.reduce(
      (sum, c) => sum + c.sections.reduce((s, sec) => s + sec.subgroups.length, 0),
      0
    );
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
              <span className="text-sm font-medium text-[#323130]">Classes & Sections</span>
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
              onClick={() => setShowClassModal(true)}
              className="bg-[#0078d4] hover:bg-[#106ebe] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Grade
            </Button>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-[#323130] mt-4">Classes & Sections</h1>
        <p className="text-[#605e5c] text-sm mt-1">
          Manage grade levels, sections, and subgroups
        </p>
      </div>

      {/* Stats row */}
      <div className="bg-white border-b border-[#e1dfdd] px-6 py-3">
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-[#e1dfdd] bg-[#faf9f8]">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-[#0078d4]/10 rounded-lg">
                <School className="w-5 h-5 text-[#0078d4]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#323130]">{classes.length}</p>
                <p className="text-xs text-[#605e5c]">Total Grades</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#e1dfdd] bg-[#faf9f8]">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#323130]">{getTotalSections()}</p>
                <p className="text-xs text-[#605e5c]">Total Sections</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#e1dfdd] bg-[#faf9f8]">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ListTree className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#323130]">{getTotalSubgroups()}</p>
                <p className="text-xs text-[#605e5c]">Total Subgroups</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#e1dfdd] bg-[#faf9f8]">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <GraduationCap className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#323130]">{getTotalStudents()}</p>
                <p className="text-xs text-[#605e5c]">Total Students</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-80 bg-white border-r border-[#e1dfdd] flex flex-col">
          <div className="p-4 border-b border-[#e1dfdd]">
            <h2 className="text-sm font-semibold text-[#323130] uppercase tracking-wide">
              Grade Levels
            </h2>
            <p className="text-xs text-[#605e5c] mt-1">
              {getFilteredClasses().length} resource(s)
            </p>
          </div>

          {/* Filters */}
          <div className="p-3 border-b border-[#e1dfdd] space-y-2">
            <div className="flex items-center gap-2 bg-[#f3f2f1] rounded-md px-3 py-2">
              <Search className="w-4 h-4 text-[#605e5c]" />
              <Input
                placeholder="Search grades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-6 text-sm"
              />
            </div>
            <Select value={filterLevel} onValueChange={(v) => setFilterLevel(v as typeof filterLevel)}>
              <SelectTrigger className="h-8 text-sm bg-[#f3f2f1] border-0">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="primary">Primary (1-3)</SelectItem>
                <SelectItem value="middle">Middle (4-9)</SelectItem>
                <SelectItem value="high">High School (10-12)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y divide-[#e1dfdd]">
              {getFilteredClasses().map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={cn(
                    "p-4 cursor-pointer transition-colors hover:bg-[#f3f2f1]",
                    selectedClassId === cls.id && "bg-[#f3f2f1] border-l-4 border-l-[#0078d4]"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#0078d4]" />
                        <span className="font-medium text-[#323130] text-sm truncate">
                          {cls.name}
                        </span>
                      </div>
                      <p className="text-xs text-[#605e5c] mt-1">
                        {cls.sections.length} sections •{" "}
                        {cls.sections.reduce((s, sec) => s + sec.subgroups.length, 0)} subgroups
                      </p>
                      <p className="text-xs text-[#605e5c]">
                        {cls.studentCount} students
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", getLevelColor(cls.level))}
                    >
                      L{cls.level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedClass ? (
            <>
              {/* Resource header */}
              <div className="bg-white border-b border-[#e1dfdd] px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-[#323130]">
                        {selectedClass.name}
                      </h2>
                      <Badge className={getLevelColor(selectedClass.level)}>
                        {getLevelLabel(selectedClass.level)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          selectedClass.status === "active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {selectedClass.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#605e5c] mt-1">
                      Level {selectedClass.level} • {selectedClass.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={expandAll}
                    >
                      Expand All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={collapseAll}
                    >
                      Collapse All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSectionModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Section
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

              {/* Hierarchy view */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4 max-w-4xl">
                  {/* Level 1: Grade Header */}
                  <Card className="border-[#0078d4] border-2 bg-white">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#0078d4] flex items-center justify-center">
                            <School className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-[#323130]">
                              {selectedClass.name}
                            </CardTitle>
                            <p className="text-sm text-[#605e5c]">
                              {selectedClass.studentCount} students • {selectedClass.sections.length} sections
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClass(selectedClass.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Level 2: Sections */}
                  {selectedClass.sections.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-[#e1dfdd] border-dashed">
                      <LayoutGrid className="w-12 h-12 text-[#605e5c] mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium text-[#323130]">No sections defined</h3>
                      <p className="text-sm text-[#605e5c] mt-1">
                        Add sections to organize students into manageable groups
                      </p>
                      <Button
                        className="mt-4 bg-[#0078d4] hover:bg-[#106ebe]"
                        onClick={() => setShowSectionModal(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Section
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 pl-4">
                      {selectedClass.sections.map((section) => {
                        const isExpanded = expandedSections.has(section.id);

                        return (
                          <div key={section.id} className="relative">
                            {/* Connection line */}
                            <div className="absolute -left-4 top-8 w-4 h-px bg-[#e1dfdd]" />
                            
                            {/* Section Card */}
                            <Card className="border-[#e1dfdd] bg-white">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() => toggleSection(section.id)}
                                      className="p-1 hover:bg-[#f3f2f1] rounded"
                                    >
                                      {isExpanded ? (
                                        <ChevronDown className="w-5 h-5 text-[#605e5c]" />
                                      ) : (
                                        <ChevronRight className="w-5 h-5 text-[#605e5c]" />
                                      )}
                                    </button>
                                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                      <Users className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                      <CardTitle className="text-base font-semibold text-[#323130]">
                                        {section.name}
                                      </CardTitle>
                                      <p className="text-sm text-[#605e5c]">
                                        {section.studentCount} students • {section.subgroups.length} subgroups
                                        {section.description && ` • ${section.description}`}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setEditingSectionId(section.id);
                                        setShowSubgroupModal(true);
                                      }}
                                    >
                                      <Plus className="w-4 h-4 mr-1" />
                                      Subgroup
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleDeleteSection(section.id)}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>

                              {/* Level 3: Subgroups */}
                              {isExpanded && section.subgroups.length > 0 && (
                                <CardContent className="pt-0">
                                  <div className="space-y-2 pl-12">
                                    {section.subgroups.map((subgroup) => (
                                      <div
                                        key={subgroup.id}
                                        className="relative flex items-center justify-between p-3 bg-[#faf9f8] rounded-md border border-[#e1dfdd]"
                                      >
                                        {/* Connection line */}
                                        <div className="absolute -left-6 top-1/2 w-6 h-px bg-[#e1dfdd]" />
                                        
                                        <div className="flex items-center gap-3">
                                          <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center">
                                            <BookOpen className="w-3 h-3 text-purple-600" />
                                          </div>
                                          <div>
                                            <p className="font-medium text-[#323130] text-sm">
                                              {subgroup.name}
                                            </p>
                                            <p className="text-xs text-[#605e5c]">
                                              {subgroup.studentCount} students
                                              {subgroup.description && ` • ${subgroup.description}`}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => {
                                              setEditingSectionId(section.id);
                                              setEditingSubgroup({ sectionId: section.id, subgroup });
                                              setNewSubgroupForm({
                                                name: subgroup.name,
                                                description: subgroup.description || "",
                                              });
                                              setShowSubgroupModal(true);
                                            }}
                                          >
                                            <Edit2 className="w-3.5 h-3.5 text-[#605e5c]" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => handleDeleteSubgroup(section.id, subgroup.id)}
                                          >
                                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              )}

                              {isExpanded && section.subgroups.length === 0 && (
                                <CardContent className="pt-0">
                                  <div className="pl-12 py-3 text-center bg-[#faf9f8] rounded-md border border-dashed border-[#e1dfdd]">
                                    <p className="text-sm text-[#605e5c]">
                                      No subgroups defined
                                    </p>
                                    <Button
                                      variant="link"
                                      size="sm"
                                      onClick={() => {
                                        setEditingSectionId(section.id);
                                        setShowSubgroupModal(true);
                                      }}
                                    >
                                      Add your first subgroup
                                    </Button>
                                  </div>
                                </CardContent>
                              )}
                            </Card>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FolderOpen className="w-16 h-16 text-[#605e5c] mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-[#323130]">Select a Grade Level</h3>
                <p className="text-sm text-[#605e5c] mt-1">
                  Choose a grade level from the sidebar to view and manage its hierarchy
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Class Modal */}
      <Dialog open={showClassModal} onOpenChange={setShowClassModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Grade Level</DialogTitle>
            <DialogDescription>
              Create a new grade level for your school.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#323130]">Grade Name *</label>
              <Input
                placeholder="e.g., Grade 4"
                value={newClassForm.name}
                onChange={(e) => setNewClassForm({ ...newClassForm, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#323130]">Level *</label>
              <Input
                type="number"
                min={1}
                max={12}
                value={newClassForm.level}
                onChange={(e) => setNewClassForm({ ...newClassForm, level: parseInt(e.target.value) || 1 })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#323130]">Description</label>
              <Input
                placeholder="Brief description of this grade"
                value={newClassForm.description}
                onChange={(e) => setNewClassForm({ ...newClassForm, description: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClassModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddClass}
              disabled={!newClassForm.name}
              className="bg-[#0078d4] hover:bg-[#106ebe]"
            >
              Create Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Section Modal */}
      <Dialog open={showSectionModal} onOpenChange={setShowSectionModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
            <DialogDescription>
              Add a new section to {selectedClass?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#323130]">Section Name *</label>
              <Input
                placeholder="e.g., Section A"
                value={newSectionForm.name}
                onChange={(e) => setNewSectionForm({ ...newSectionForm, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#323130]">Description</label>
              <Input
                placeholder="Brief description"
                value={newSectionForm.description}
                onChange={(e) => setNewSectionForm({ ...newSectionForm, description: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSectionModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSection}
              disabled={!newSectionForm.name}
              className="bg-[#0078d4] hover:bg-[#106ebe]"
            >
              Add Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Subgroup Modal */}
      <Dialog
        open={showSubgroupModal}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSectionId(null);
            setEditingSubgroup(null);
            setNewSubgroupForm({ name: "", description: "" });
          }
          setShowSubgroupModal(open);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSubgroup ? "Edit Subgroup" : "Add Subgroup"}
            </DialogTitle>
            <DialogDescription>
              {editingSubgroup
                ? "Update subgroup details."
                : "Add a new subgroup to the selected section."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#323130]">Subgroup Name *</label>
              <Input
                placeholder="e.g., Red Group"
                value={newSubgroupForm.name}
                onChange={(e) => setNewSubgroupForm({ ...newSubgroupForm, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#323130]">Description</label>
              <Input
                placeholder="Brief description"
                value={newSubgroupForm.description}
                onChange={(e) => setNewSubgroupForm({ ...newSubgroupForm, description: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubgroupModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveSubgroup}
              disabled={!newSubgroupForm.name}
              className="bg-[#0078d4] hover:bg-[#106ebe]"
            >
              {editingSubgroup ? "Save Changes" : "Add Subgroup"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
