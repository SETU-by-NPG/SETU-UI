import { useState } from "react";
import { useOutletContext } from "react-router";
import {
  BookOpen, Plus, Trash2, Save, Loader2, Edit2, Check, X,
  Search, Filter, MoreVertical, Users, Clock, GraduationCap
} from "lucide-react";
import { type Role } from "../data/mock-data";

// Types
interface Subject {
  id: number;
  name: string;
  code: string;
  category: string;
  description: string;
  assignedTeachers: number;
  classes: string[];
  periodsPerWeek: number;
  isActive: boolean;
}

interface SubjectCategory {
  name: string;
  color: string;
}

// Categories
const categories: SubjectCategory[] = [
  { name: "Core", color: "#4f46e5" },
  { name: "Science", color: "#10b981" },
  { name: "Social", color: "#f59e0b" },
  { name: "Technology", color: "#06b6d4" },
  { name: "Language", color: "#8b5cf6" },
  { name: "Arts", color: "#ec4899" },
  { name: "Physical Education", color: "#ef4444" },
];

// Sample data
const sampleSubjects: Subject[] = [
  {
    id: 1,
    name: "Mathematics",
    code: "MATH",
    category: "Core",
    description: "Algebra, Geometry, Calculus, Statistics",
    assignedTeachers: 5,
    classes: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    periodsPerWeek: 5,
    isActive: true,
  },
  {
    id: 2,
    name: "English",
    code: "ENG",
    category: "Core",
    description: "Grammar, Literature, Composition, Communication",
    assignedTeachers: 4,
    classes: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    periodsPerWeek: 5,
    isActive: true,
  },
  {
    id: 3,
    name: "Physics",
    code: "PHY",
    category: "Science",
    description: "Mechanics, Thermodynamics, Waves, Optics",
    assignedTeachers: 3,
    classes: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    periodsPerWeek: 4,
    isActive: true,
  },
  {
    id: 4,
    name: "Chemistry",
    code: "CHEM",
    category: "Science",
    description: "Organic, Inorganic, Physical Chemistry",
    assignedTeachers: 3,
    classes: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    periodsPerWeek: 4,
    isActive: true,
  },
  {
    id: 5,
    name: "Biology",
    code: "BIO",
    category: "Science",
    description: "Cell Biology, Genetics, Ecology, Human Anatomy",
    assignedTeachers: 2,
    classes: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    periodsPerWeek: 4,
    isActive: true,
  },
  {
    id: 6,
    name: "History",
    code: "HIST",
    category: "Social",
    description: "World History, Ancient Civilizations, Modern History",
    assignedTeachers: 2,
    classes: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    periodsPerWeek: 3,
    isActive: true,
  },
  {
    id: 7,
    name: "Geography",
    code: "GEO",
    category: "Social",
    description: "Physical Geography, Human Geography, Cartography",
    assignedTeachers: 2,
    classes: ["Grade 9", "Grade 10"],
    periodsPerWeek: 3,
    isActive: true,
  },
  {
    id: 8,
    name: "Computer Science",
    code: "CS",
    category: "Technology",
    description: "Programming, Data Structures, Algorithms, Web Development",
    assignedTeachers: 3,
    classes: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    periodsPerWeek: 4,
    isActive: true,
  },
  {
    id: 9,
    name: "Physical Education",
    code: "PE",
    category: "Physical Education",
    description: "Sports, Fitness, Health and Wellness",
    assignedTeachers: 3,
    classes: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    periodsPerWeek: 2,
    isActive: true,
  },
  {
    id: 10,
    name: "Art",
    code: "ART",
    category: "Arts",
    description: "Drawing, Painting, Sculpture, Digital Art",
    assignedTeachers: 2,
    classes: ["Grade 9", "Grade 10", "Grade 11"],
    periodsPerWeek: 2,
    isActive: true,
  },
  {
    id: 11,
    name: "Music",
    code: "MUS",
    category: "Arts",
    description: "Theory, Instrumental, Vocal, Music History",
    assignedTeachers: 1,
    classes: ["Grade 9", "Grade 10"],
    periodsPerWeek: 2,
    isActive: true,
  },
  {
    id: 12,
    name: "Spanish",
    code: "SPA",
    category: "Language",
    description: "Conversation, Grammar, Literature, Culture",
    assignedTeachers: 2,
    classes: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    periodsPerWeek: 4,
    isActive: true,
  },
];

export default function SubjectsPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [subjects, setSubjects] = useState<Subject[]>(sampleSubjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "Core",
    description: "",
    periodsPerWeek: 4,
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  const openModal = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        name: subject.name,
        code: subject.code,
        category: subject.category,
        description: subject.description,
        periodsPerWeek: subject.periodsPerWeek,
      });
    } else {
      setEditingSubject(null);
      setFormData({
        name: "",
        code: "",
        category: "Core",
        description: "",
        periodsPerWeek: 4,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSubject(null);
    setFormData({
      name: "",
      code: "",
      category: "Core",
      description: "",
      periodsPerWeek: 4,
    });
  };

  const saveSubject = () => {
    if (!formData.name || !formData.code) return;

    if (editingSubject) {
      // Update existing
      setSubjects(
        subjects.map((s) =>
          s.id === editingSubject.id
            ? {
                ...s,
                ...formData,
              }
            : s
        )
      );
    } else {
      // Add new
      const newSubject: Subject = {
        id: Date.now(),
        ...formData,
        assignedTeachers: 0,
        classes: [],
        isActive: true,
      };
      setSubjects([...subjects, newSubject]);
    }
    closeModal();
  };

  const deleteSubject = (id: number) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const toggleActive = (id: number) => {
    setSubjects(
      subjects.map((s) =>
        s.id === id ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  // Filter subjects
  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || subject.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by category
  const subjectsByCategory = categories
    .map((cat) => ({
      ...cat,
      subjects: filteredSubjects.filter((s) => s.category === cat.name),
    }))
    .filter((cat) => cat.subjects.length > 0 || !selectedCategory);

  const getCategoryColor = (category: string) => {
    return categories.find((c) => c.name === category)?.color || "#6b7280";
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Subjects</h1>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>
            Manage subjects and curriculum
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
          style={{ fontSize: "0.875rem" }}
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      </div>

      {/* Success message */}
      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 mb-4">
          <Check className="w-4 h-4" />
          <p style={{ fontSize: "0.875rem" }}>Changes saved successfully!</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Total Subjects</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{subjects.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Categories</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{categories.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Active Subjects</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{subjects.filter(s => s.isActive).length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Total Teachers</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{subjects.reduce((sum, s) => sum + s.assignedTeachers, 0)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects..."
            className="w-full pl-10 px-3 py-2 rounded-lg border border-border bg-background"
            style={{ fontSize: "0.875rem" }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-2 rounded-lg border transition-colors ${
              !selectedCategory
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:bg-muted"
            }`}
            style={{ fontSize: "0.8125rem" }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                selectedCategory === cat.name
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted"
              }`}
              style={{ fontSize: "0.8125rem" }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((subject) => (
          <div
            key={subject.id}
            className={`bg-card rounded-xl border border-border p-4 transition-all ${
              !subject.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${getCategoryColor(subject.category)}20` }}
                >
                  <BookOpen
                    className="w-5 h-5"
                    style={{ color: getCategoryColor(subject.category) }}
                  />
                </div>
                <div>
                  <h3 style={{ fontSize: "0.9375rem", fontWeight: 600 }}>{subject.name}</h3>
                  <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                    {subject.code}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openModal(subject)}
                  className="p-1.5 rounded hover:bg-muted text-muted-foreground"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteSubject(subject.id)}
                  className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${getCategoryColor(subject.category)}20`,
                  color: getCategoryColor(subject.category),
                }}
              >
                {subject.category}
              </span>
              <button
                onClick={() => toggleActive(subject.id)}
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  subject.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {subject.isActive ? "Active" : "Inactive"}
              </button>
            </div>

            <p className="text-muted-foreground mb-3" style={{ fontSize: "0.8125rem" }}>
              {subject.description}
            </p>

            <div className="flex items-center gap-4 text-muted-foreground" style={{ fontSize: "0.75rem" }}>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {subject.assignedTeachers} teachers
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {subject.periodsPerWeek} periods/week
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                {subject.classes.length} classes
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            No subjects found
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md">
            <div className="p-4 border-b border-border">
              <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                {editingSubject ? "Edit Subject" : "Add Subject"}
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label style={{ fontSize: "0.875rem" }}>Subject Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., MATH"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                  maxLength={6}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                >
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Periods per Week</label>
                <input
                  type="number"
                  value={formData.periodsPerWeek}
                  onChange={(e) =>
                    setFormData({ ...formData, periodsPerWeek: parseInt(e.target.value) || 0 })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                  min={1}
                  max={10}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the subject"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                  rows={3}
                />
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted"
                style={{ fontSize: "0.875rem" }}
              >
                Cancel
              </button>
              <button
                onClick={saveSubject}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                style={{ fontSize: "0.875rem" }}
              >
                {editingSubject ? "Save Changes" : "Add Subject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
