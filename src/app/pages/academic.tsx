import { useState } from "react";
import { useOutletContext } from "react-router";
import {
  Calendar, Plus, Trash2, Save, Loader2, ChevronLeft, ChevronRight,
  Check, X, Clock, AlertCircle, Copy, Edit2
} from "lucide-react";
import { type Role } from "../data/mock-data";

// Types
interface Term {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  type: "semester" | "quarter" | "trimester";
}

interface AcademicYear {
  id: number;
  year: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  terms: Term[];
}

// Sample data
const sampleAcademicYears: AcademicYear[] = [
  {
    id: 1,
    year: "2025-2026",
    startDate: "2025-09-01",
    endDate: "2026-07-15",
    isCurrent: true,
    terms: [
      { id: 1, name: "Fall Semester", startDate: "2025-09-01", endDate: "2025-12-15", type: "semester" },
      { id: 2, name: "Spring Semester", startDate: "2026-01-05", endDate: "2026-04-30", type: "semester" },
      { id: 3, name: "Summer Term", startDate: "2026-05-15", endDate: "2026-07-15", type: "semester" },
    ],
  },
  {
    id: 2,
    year: "2024-2025",
    startDate: "2024-09-01",
    endDate: "2025-07-15",
    isCurrent: false,
    terms: [
      { id: 1, name: "Fall Semester", startDate: "2024-09-01", endDate: "2024-12-15", type: "semester" },
      { id: 2, name: "Spring Semester", startDate: "2025-01-05", endDate: "2025-04-30", type: "semester" },
      { id: 3, name: "Summer Term", startDate: "2025-05-15", endDate: "2025-07-15", type: "semester" },
    ],
  },
];

export default function AcademicPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(sampleAcademicYears);
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(academicYears[0]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // New year form
  const [showNewYear, setShowNewYear] = useState(false);
  const [newYear, setNewYear] = useState({
    year: "",
    startDate: "",
    endDate: "",
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

  const addTerm = () => {
    if (!selectedYear) return;
    const newTerm: Term = {
      id: Date.now(),
      name: "",
      startDate: "",
      endDate: "",
      type: "semester",
    };
    setSelectedYear({
      ...selectedYear,
      terms: [...selectedYear.terms, newTerm],
    });
  };

  const updateTerm = (termId: number, field: keyof Term, value: string) => {
    if (!selectedYear) return;
    const updatedTerms = selectedYear.terms.map((t) =>
      t.id === termId ? { ...t, [field]: value } : t
    );
    setSelectedYear({ ...selectedYear, terms: updatedTerms });
  };

  const removeTerm = (termId: number) => {
    if (!selectedYear) return;
    setSelectedYear({
      ...selectedYear,
      terms: selectedYear.terms.filter((t) => t.id !== termId),
    });
  };

  const createNewYear = () => {
    if (!newYear.year || !newYear.startDate || !newYear.endDate) return;
    
    const newAcademicYear: AcademicYear = {
      id: Date.now(),
      year: newYear.year,
      startDate: newYear.startDate,
      endDate: newYear.endDate,
      isCurrent: false,
      terms: [],
    };
    
    setAcademicYears([newAcademicYear, ...academicYears]);
    setSelectedYear(newAcademicYear);
    setShowNewYear(false);
    setNewYear({ year: "", startDate: "", endDate: "" });
  };

  const deleteYear = (yearId: number) => {
    const filtered = academicYears.filter((y) => y.id !== yearId);
    setAcademicYears(filtered);
    if (selectedYear?.id === yearId) {
      setSelectedYear(filtered[0] || null);
    }
  };

  const setCurrentYear = (yearId: number) => {
    const updated = academicYears.map((y) => ({
      ...y,
      isCurrent: y.id === yearId,
    }));
    setAcademicYears(updated);
    const selected = updated.find((y) => y.id === yearId);
    if (selected) setSelectedYear(selected);
  };

  // Calculate duration
  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return "-";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Academic Years</h1>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>
            Configure academic years and terms
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewYear(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
            style={{ fontSize: "0.875rem" }}
          >
            <Plus className="w-4 h-4" />
            Add Year
          </button>
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
        {/* Left: Academic Years List */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border">
            <div className="p-4 border-b border-border">
              <h2 style={{ fontSize: "0.9375rem", fontWeight: 600 }}>Academic Years</h2>
            </div>
            <div className="divide-y divide-border">
              {academicYears.map((year) => (
                <div
                  key={year.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedYear?.id === year.id ? "bg-muted" : ""
                  }`}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsEditing(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ fontSize: "0.9375rem", fontWeight: 500 }}>{year.year}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                        {year.startDate} - {year.endDate}
                      </p>
                    </div>
                    {year.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {!year.isCurrent && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentYear(year.id);
                        }}
                        className="text-xs text-primary hover:underline"
                      >
                        Set as current
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteYear(year.id);
                      }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Year Details */}
        <div className="lg:col-span-2">
          {selectedYear ? (
            <div className="bg-card rounded-xl border border-border">
              {/* Year Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>{selectedYear.year}</h2>
                    {selectedYear.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        Current Academic Year
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: "0.8125rem" }}>
                    {selectedYear.startDate} to {selectedYear.endDate} ({calculateDuration(selectedYear.startDate, selectedYear.endDate)})
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

              {/* Terms */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Terms / Semesters</h3>
                  {isEditing && (
                    <button
                      onClick={addTerm}
                      className="flex items-center gap-1 text-primary hover:underline"
                      style={{ fontSize: "0.8125rem" }}
                    >
                      <Plus className="w-3 h-3" />
                      Add Term
                    </button>
                  )}
                </div>

                {selectedYear.terms.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
                      No terms defined yet
                    </p>
                    {isEditing && (
                      <button
                        onClick={addTerm}
                        className="mt-2 text-primary hover:underline"
                        style={{ fontSize: "0.8125rem" }}
                      >
                        Add your first term
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedYear.terms.map((term, idx) => (
                      <div
                        key={term.id}
                        className="p-4 rounded-lg border border-border bg-muted/30"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium">{idx + 1}</span>
                            </div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={term.name}
                                onChange={(e) => updateTerm(term.id, "name", e.target.value)}
                                placeholder="Term name"
                                className="px-2 py-1 rounded border border-border bg-background"
                                style={{ fontSize: "0.875rem" }}
                              />
                            ) : (
                              <span style={{ fontSize: "0.9375rem", fontWeight: 500 }}>
                                {term.name || "Unnamed Term"}
                              </span>
                            )}
                          </div>
                          {isEditing && selectedYear.terms.length > 1 && (
                            <button
                              onClick={() => removeTerm(term.id)}
                              className="p-1 text-muted-foreground hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 ml-10">
                          <div>
                            <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                              Start Date
                            </label>
                            {isEditing ? (
                              <input
                                type="date"
                                value={term.startDate}
                                onChange={(e) => updateTerm(term.id, "startDate", e.target.value)}
                                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                                style={{ fontSize: "0.875rem" }}
                              />
                            ) : (
                              <p style={{ fontSize: "0.875rem" }}>{term.startDate || "-"}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                              End Date
                            </label>
                            {isEditing ? (
                              <input
                                type="date"
                                value={term.endDate}
                                onChange={(e) => updateTerm(term.id, "endDate", e.target.value)}
                                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                                style={{ fontSize: "0.875rem" }}
                              />
                            ) : (
                              <p style={{ fontSize: "0.875rem" }}>{term.endDate || "-"}</p>
                            )}
                          </div>
                        </div>
                        <div className="ml-10 mt-2">
                          <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                            Term Type
                          </label>
                          {isEditing ? (
                            <select
                              value={term.type}
                              onChange={(e) => updateTerm(term.id, "type", e.target.value)}
                              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                              style={{ fontSize: "0.875rem" }}
                            >
                              <option value="semester">Semester</option>
                              <option value="quarter">Quarter</option>
                              <option value="trimester">Trimester</option>
                            </select>
                          ) : (
                            <p style={{ fontSize: "0.875rem" }} className="capitalize">
                              {term.type}
                            </p>
                          )}
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
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
                Select an academic year to view details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Year Modal */}
      {showNewYear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md">
            <div className="p-4 border-b border-border">
              <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Add Academic Year</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label style={{ fontSize: "0.875rem" }}>Academic Year *</label>
                <input
                  type="text"
                  value={newYear.year}
                  onChange={(e) => setNewYear({ ...newYear, year: e.target.value })}
                  placeholder="e.g., 2026-2027"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Start Date *</label>
                <input
                  type="date"
                  value={newYear.startDate}
                  onChange={(e) => setNewYear({ ...newYear, startDate: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>End Date *</label>
                <input
                  type="date"
                  value={newYear.endDate}
                  onChange={(e) => setNewYear({ ...newYear, endDate: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNewYear(false);
                  setNewYear({ year: "", startDate: "", endDate: "" });
                }}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted"
                style={{ fontSize: "0.875rem" }}
              >
                Cancel
              </button>
              <button
                onClick={createNewYear}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                style={{ fontSize: "0.875rem" }}
              >
                Create Year
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
