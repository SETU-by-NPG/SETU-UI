import { useState } from "react";
import { useOutletContext } from "react-router";
import {
  Users, Plus, Trash2, Save, Loader2, ChevronLeft, ChevronRight,
  Check, X, Edit2, Copy, GraduationCap, MoreVertical, Archive
} from "lucide-react";
import { type Role } from "../data/mock-data";

// Types
interface Section {
  id: number;
  name: string;
  capacity: number;
  enrolled: number;
}

interface ClassGrade {
  id: number;
  name: string;
  level: number;
  sections: Section[];
  description: string;
}

// Sample data
const sampleClasses: ClassGrade[] = [
  {
    id: 1,
    name: "Grade 1",
    level: 1,
    description: "Primary Year 1 - Foundation",
    sections: [
      { id: 1, name: "Section A", capacity: 30, enrolled: 28 },
      { id: 2, name: "Section B", capacity: 30, enrolled: 25 },
    ],
  },
  {
    id: 2,
    name: "Grade 2",
    level: 2,
    description: "Primary Year 2",
    sections: [
      { id: 1, name: "Section A", capacity: 30, enrolled: 27 },
      { id: 2, name: "Section B", capacity: 30, enrolled: 24 },
      { id: 3, name: "Section C", capacity: 30, enrolled: 20 },
    ],
  },
  {
    id: 3,
    name: "Grade 3",
    level: 3,
    description: "Primary Year 3",
    sections: [
      { id: 1, name: "Section A", capacity: 30, enrolled: 29 },
      { id: 2, name: "Section B", capacity: 30, enrolled: 26 },
    ],
  },
  {
    id: 4,
    name: "Grade 9",
    level: 9,
    description: "High School Year 9 - Secondary",
    sections: [
      { id: 1, name: "Section A - Science", capacity: 35, enrolled: 32 },
      { id: 2, name: "Section B - Commerce", capacity: 35, enrolled: 30 },
    ],
  },
  {
    id: 5,
    name: "Grade 10",
    level: 10,
    description: "High School Year 10 - Secondary",
    sections: [
      { id: 1, name: "Section A", capacity: 35, enrolled: 33 },
    ],
  },
  {
    id: 6,
    name: "Grade 11",
    level: 11,
    description: "High School Year 11 - Pre-University",
    sections: [
      { id: 1, name: "Science Stream", capacity: 30, enrolled: 28 },
      { id: 2, name: "Commerce Stream", capacity: 30, enrolled: 25 },
    ],
  },
  {
    id: 7,
    name: "Grade 12",
    level: 12,
    description: "High School Year 12 - Final Year",
    sections: [
      { id: 1, name: "Science Stream", capacity: 30, enrolled: 30 },
      { id: 2, name: "Commerce Stream", capacity: 30, enrolled: 28 },
    ],
  },
];

export default function ClassesPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [classes, setClasses] = useState<ClassGrade[]>(sampleClasses);
  const [selectedClass, setSelectedClass] = useState<ClassGrade | null>(classes[0]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // New class modal
  const [showNewClass, setShowNewClass] = useState(false);
  const [newClass, setNewClass] = useState({
    name: "",
    level: 0,
    description: "",
  });

  const [showNewSection, setShowNewSection] = useState(false);
  const [newSection, setNewSection] = useState({
    name: "",
    capacity: 30,
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  const addClass = () => {
    if (!newClass.name || newClass.level === 0) return;
    
    const classGrade: ClassGrade = {
      id: Date.now(),
      name: newClass.name,
      level: newClass.level,
      description: newClass.description,
      sections: [],
    };
    
    setClasses([...classes, classGrade].sort((a, b) => a.level - b.level));
    setSelectedClass(classGrade);
    setShowNewClass(false);
    setNewClass({ name: "", level: 0, description: "" });
  };

  const deleteClass = (classId: number) => {
    setClasses(classes.filter((c) => c.id !== classId));
    if (selectedClass?.id === classId) {
      setSelectedClass(classes[0] || null);
    }
  };

  const addSection = () => {
    if (!selectedClass || !newSection.name) return;
    
    const section: Section = {
      id: Date.now(),
      name: newSection.name,
      capacity: newSection.capacity,
      enrolled: 0,
    };
    
    setClasses(
      classes.map((c) =>
        c.id === selectedClass.id
          ? { ...c, sections: [...c.sections, section] }
          : c
      )
    );
    setSelectedClass({
      ...selectedClass,
      sections: [...selectedClass.sections, section],
    });
    setShowNewSection(false);
    setNewSection({ name: "", capacity: 30 });
  };

  const updateSection = (sectionId: number, field: keyof Section, value: string | number) => {
    if (!selectedClass) return;
    
    const updatedSections = selectedClass.sections.map((s) =>
      s.id === sectionId ? { ...s, [field]: value } : s
    );
    
    setClasses(
      classes.map((c) =>
        c.id === selectedClass.id
          ? { ...c, sections: updatedSections }
          : c
      )
    );
    setSelectedClass({ ...selectedClass, sections: updatedSections });
  };

  const deleteSection = (sectionId: number) => {
    if (!selectedClass) return;
    
    const updatedSections = selectedClass.sections.filter((s) => s.id !== sectionId);
    
    setClasses(
      classes.map((c) =>
        c.id === selectedClass.id
          ? { ...c, sections: updatedSections }
          : c
      )
    );
    setSelectedClass({ ...selectedClass, sections: updatedSections });
  };

  const getTotalStudents = () => {
    return classes.reduce((sum, c) => sum + c.sections.reduce((s, sec) => s + sec.enrolled, 0), 0);
  };

  const getTotalCapacity = () => {
    return classes.reduce((sum, c) => sum + c.sections.reduce((s, sec) => s + sec.capacity, 0), 0);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Classes & Sections</h1>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>
            Manage grade levels and class sections
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewClass(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
            style={{ fontSize: "0.875rem" }}
          >
            <Plus className="w-4 h-4" />
            Add Grade
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Total Grades</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{classes.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Total Sections</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>
            {classes.reduce((sum, c) => sum + c.sections.length, 0)}
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Total Students</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{getTotalStudents()}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Capacity</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>
            {getTotalStudents()}/{getTotalCapacity()}
          </p>
        </div>
      </div>

      {/* Success message */}
      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 mb-4">
          <Check className="w-4 h-4" />
          <p style={{ fontSize: "0.875rem" }}>Changes saved successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Classes List */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border">
            <div className="p-4 border-b border-border">
              <h2 style={{ fontSize: "0.9375rem", fontWeight: 600 }}>Grade Levels</h2>
            </div>
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedClass?.id === cls.id ? "bg-muted" : ""
                  }`}
                  onClick={() => {
                    setSelectedClass(cls);
                    setIsEditing(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <div>
                        <p style={{ fontSize: "0.9375rem", fontWeight: 500 }}>{cls.name}</p>
                        <p className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>
                          {cls.sections.length} sections • {cls.sections.reduce((s, sec) => s + sec.enrolled, 0)} students
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteClass(cls.id);
                      }}
                      className="p-1 text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Class Details */}
        <div className="lg:col-span-2">
          {selectedClass ? (
            <div className="bg-card rounded-xl border border-border">
              {/* Class Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>{selectedClass.name}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                      Level {selectedClass.level}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: "0.8125rem" }}>
                    {selectedClass.description}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted"
                  style={{ fontSize: "0.8125rem" }}
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              {/* Sections */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Sections</h3>
                  {isEditing && (
                    <button
                      onClick={() => setShowNewSection(true)}
                      className="flex items-center gap-1 text-primary hover:underline"
                      style={{ fontSize: "0.8125rem" }}
                    >
                      <Plus className="w-3 h-3" />
                      Add Section
                    </button>
                  )}
                </div>

                {selectedClass.sections.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
                      No sections defined yet
                    </p>
                    {isEditing && (
                      <button
                        onClick={() => setShowNewSection(true)}
                        className="mt-2 text-primary hover:underline"
                        style={{ fontSize: "0.8125rem" }}
                      >
                        Add your first section
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedClass.sections.map((section) => (
                      <div
                        key={section.id}
                        className="p-4 rounded-lg border border-border bg-muted/30"
                      >
                        <div className="flex items-start justify-between mb-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={section.name}
                              onChange={(e) => updateSection(section.id, "name", e.target.value)}
                              className="px-2 py-1 rounded border border-border bg-background font-medium"
                              style={{ fontSize: "0.9375rem" }}
                            />
                          ) : (
                            <span style={{ fontSize: "0.9375rem", fontWeight: 500 }}>
                              {section.name}
                            </span>
                          )}
                          {isEditing && (
                            <button
                              onClick={() => deleteSection(section.id)}
                              className="p-1 text-muted-foreground hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 ml-0">
                          <div>
                            <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                              Capacity
                            </label>
                            {isEditing ? (
                              <input
                                type="number"
                                value={section.capacity}
                                onChange={(e) => updateSection(section.id, "capacity", parseInt(e.target.value) || 0)}
                                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                                style={{ fontSize: "0.875rem" }}
                                min={0}
                              />
                            ) : (
                              <p style={{ fontSize: "0.875rem" }}>{section.capacity}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                              Enrolled
                            </label>
                            <p style={{ fontSize: "0.875rem" }}>{section.enrolled}</p>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-3">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${Math.min((section.enrolled / section.capacity) * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-muted-foreground mt-1" style={{ fontSize: "0.6875rem" }}>
                            {Math.round((section.enrolled / section.capacity) * 100)}% full
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="p-4 border-t border-border">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
                Select a grade level to view sections
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Class Modal */}
      {showNewClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md">
            <div className="p-4 border-b border-border">
              <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Add Grade Level</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label style={{ fontSize: "0.875rem" }}>Grade Name *</label>
                <input
                  type="text"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  placeholder="e.g., Grade 1"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Level Number *</label>
                <input
                  type="number"
                  value={newClass.level || ""}
                  onChange={(e) => setNewClass({ ...newClass, level: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 1"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                  min={1}
                  max={12}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Description</label>
                <textarea
                  value={newClass.description}
                  onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                  placeholder="Brief description of this grade"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                  rows={3}
                />
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNewClass(false);
                  setNewClass({ name: "", level: 0, description: "" });
                }}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted"
                style={{ fontSize: "0.875rem" }}
              >
                Cancel
              </button>
              <button
                onClick={addClass}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                style={{ fontSize: "0.875rem" }}
              >
                Create Grade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Section Modal */}
      {showNewSection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md">
            <div className="p-4 border-b border-border">
              <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Add Section</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label style={{ fontSize: "0.875rem" }}>Section Name *</label>
                <input
                  type="text"
                  value={newSection.name}
                  onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                  placeholder="e.g., Section A"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Capacity *</label>
                <input
                  type="number"
                  value={newSection.capacity}
                  onChange={(e) => setNewSection({ ...newSection, capacity: parseInt(e.target.value) || 0 })}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                  min={1}
                />
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNewSection(false);
                  setNewSection({ name: "", capacity: 30 });
                }}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted"
                style={{ fontSize: "0.875rem" }}
              >
                Cancel
              </button>
              <button
                onClick={addSection}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                style={{ fontSize: "0.875rem" }}
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
