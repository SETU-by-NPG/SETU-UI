import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { useAppSettings, CURRENCIES } from "../context/app-settings-context";

const TIMEZONES = [
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "Europe/London", label: "GMT/BST" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Asia/Singapore", label: "Singapore Time (SGT)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
];

import {
  School, Calendar, Users, BookOpen, ChevronRight, ChevronLeft,
  Check, Upload, Plus, Trash2, Save, Loader2, GraduationCap,
  MapPin, Phone, Mail, Clock
} from "lucide-react";
import { type Role } from "../data/mock-data";

// Wizard steps
const steps = [
  { id: "profile", label: "School Profile", icon: School },
  { id: "academic", label: "Academic Year", icon: Calendar },
  { id: "holidays", label: "Holidays", icon: Calendar },
  { id: "classes", label: "Classes & Sections", icon: Users },
  { id: "subjects", label: "Subjects", icon: BookOpen },
];

// Sample data
const sampleHolidays = [
  { id: 1, name: "Summer Break", date: "2026-07-01", type: "vacation" },
  { id: 2, name: "Independence Day", date: "2026-08-15", type: "national" },
  { id: 3, name: "Diwali Break", date: "2026-10-20", type: "festival" },
  { id: 4, name: "Winter Break", date: "2026-12-25", type: "vacation" },
];

const sampleGrades = [
  { id: 1, name: "Grade 1", level: 1 },
  { id: 2, name: "Grade 2", level: 2 },
  { id: 3, name: "Grade 3", level: 3 },
  { id: 4, name: "Grade 4", level: 4 },
  { id: 5, name: "Grade 5", level: 5 },
  { id: 6, name: "Grade 6", level: 6 },
  { id: 7, name: "Grade 7", level: 7 },
  { id: 8, name: "Grade 8", level: 8 },
  { id: 9, name: "Grade 9", level: 9 },
  { id: 10, name: "Grade 10", level: 10 },
  { id: 11, name: "Grade 11", level: 11 },
  { id: 12, name: "Grade 12", level: 12 },
];

const sampleSubjects = [
  { id: 1, name: "Mathematics", code: "MATH", category: "Core" },
  { id: 2, name: "English", code: "ENG", category: "Core" },
  { id: 3, name: "Physics", code: "PHY", category: "Science" },
  { id: 4, name: "Chemistry", code: "CHEM", category: "Science" },
  { id: 5, name: "Biology", code: "BIO", category: "Science" },
  { id: 6, name: "History", code: "HIST", category: "Social" },
  { id: 7, name: "Geography", code: "GEO", category: "Social" },
  { id: 8, name: "Computer Science", code: "CS", category: "Technology" },
];

export default function SetupPage() {
  const navigate = useNavigate();
  const { currency } = useAppSettings();
  const { role } = useOutletContext<{ role: Role }>();

  // Role-based access control: only admins can access setup
  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, [role, navigate]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Step 1: School Profile
  const [schoolData, setSchoolData] = useState({
    name: "SETU Academy",
    shortName: "SETU",
    email: "admin@setu.edu",
    phone: "+1 234 567 8900",
    address: "123 Education Street",
    city: "San Francisco",
    state: "California",
    country: "United States",
    zipCode: "94102",
    timezone: "America/Los_Angeles",
    currency: "USD",
    website: "https://setu.edu",
    logo: null as string | null,
  });
  
  // Step 2: Academic Year
  const [academicData, setAcademicData] = useState({
    currentYear: "2025-2026",
    terms: [
      { id: 1, name: "Term 1", startDate: "2025-09-01", endDate: "2025-12-15", type: "semester" },
      { id: 2, name: "Term 2", startDate: "2026-01-05", endDate: "2026-04-30", type: "semester" },
      { id: 3, name: "Term 3", startDate: "2026-05-15", endDate: "2026-07-15", type: "semester" },
    ],
  });
  
  // Step 3: Holidays
  const [holidays, setHolidays] = useState(sampleHolidays);
  const [newHoliday, setNewHoliday] = useState({ name: "", date: "", type: "national" });
  
  // Step 4: Classes & Sections
  const [classes, setClasses] = useState(sampleGrades);
  const [sections, setSections] = useState<Record<number, string[]>>({
    1: ["A", "B"],
    2: ["A", "B", "C"],
    3: ["A", "B"],
  });
  
  // Step 5: Subjects
  const [subjects, setSubjects] = useState(sampleSubjects);
  const [newSubject, setNewSubject] = useState({ name: "", code: "", category: "Core" });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => {
        navigate("/settings");
      }, 1500);
    }, 1000);
  };

  const addHoliday = () => {
    if (newHoliday.name && newHoliday.date) {
      setHolidays([...holidays, { ...newHoliday, id: Date.now() }]);
      setNewHoliday({ name: "", date: "", type: "national" });
    }
  };

  const removeHoliday = (id: number) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  const addSubject = () => {
    if (newSubject.name && newSubject.code) {
      setSubjects([...subjects, { ...newSubject, id: Date.now() }]);
      setNewSubject({ name: "", code: "", category: "Core" });
    }
  };

  const removeSubject = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const addSection = (gradeId: number) => {
    const gradeSections = sections[gradeId] || [];
    const nextLetter = String.fromCharCode(65 + gradeSections.length);
    setSections({ ...sections, [gradeId]: [...gradeSections, nextLetter] });
  };

  const removeSection = (gradeId: number, section: string) => {
    const gradeSections = sections[gradeId] || [];
    setSections({ ...sections, [gradeId]: gradeSections.filter(s => s !== section) });
  };

  // Render progress bar
  const renderProgress = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentStep;
          const isComplete = idx < currentStep;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div 
                className={`flex items-center gap-2 ${
                  isComplete ? "text-green-600" : isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isComplete ? "border-green-600 bg-green-50" : 
                  isActive ? "border-primary bg-primary/10" : "border-border"
                }`}>
                  {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className="hidden sm:block text-sm font-medium">{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${isComplete ? "bg-green-600" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Step 1: School Profile
  const renderProfileStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
          {schoolData.logo ? (
            <img src={schoolData.logo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <School className="w-8 h-8 text-primary" />
          )}
        </div>
        <div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-sm">
            <Upload className="w-4 h-4" />
            Upload Logo
          </button>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "0.75rem" }}>
            Recommended: 200x200px, PNG or JPG
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={{ fontSize: "0.875rem" }}>School Name *</label>
          <input
            type="text"
            value={schoolData.name}
            onChange={(e) => setSchoolData({ ...schoolData, name: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            style={{ fontSize: "0.875rem" }}
          />
        </div>
        <div>
          <label style={{ fontSize: "0.875rem" }}>Short Name</label>
          <input
            type="text"
            value={schoolData.shortName}
            onChange={(e) => setSchoolData({ ...schoolData, shortName: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            style={{ fontSize: "0.875rem" }}
          />
        </div>
        <div>
          <label style={{ fontSize: "0.875rem" }}>Email *</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              value={schoolData.email}
              onChange={(e) => setSchoolData({ ...schoolData, email: e.target.value })}
              className="w-full pl-10 px-3 py-2 rounded-lg border border-border bg-background"
              style={{ fontSize: "0.875rem" }}
            />
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.875rem" }}>Phone</label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="tel"
              value={schoolData.phone}
              onChange={(e) => setSchoolData({ ...schoolData, phone: e.target.value })}
              className="w-full pl-10 px-3 py-2 rounded-lg border border-border bg-background"
              style={{ fontSize: "0.875rem" }}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label style={{ fontSize: "0.875rem" }}>Address</label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={schoolData.address}
              onChange={(e) => setSchoolData({ ...schoolData, address: e.target.value })}
              className="w-full pl-10 px-3 py-2 rounded-lg border border-border bg-background"
              style={{ fontSize: "0.875rem" }}
              placeholder="Street address"
            />
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.875rem" }}>City</label>
          <input
            type="text"
            value={schoolData.city}
            onChange={(e) => setSchoolData({ ...schoolData, city: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            style={{ fontSize: "0.875rem" }}
          />
        </div>
        <div>
          <label style={{ fontSize: "0.875rem" }}>State/Province</label>
          <input
            type="text"
            value={schoolData.state}
            onChange={(e) => setSchoolData({ ...schoolData, state: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            style={{ fontSize: "0.875rem" }}
          />
        </div>
        <div>
          <label style={{ fontSize: "0.875rem" }}>Country</label>
          <input
            type="text"
            value={schoolData.country}
            onChange={(e) => setSchoolData({ ...schoolData, country: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            style={{ fontSize: "0.875rem" }}
          />
        </div>
        <div>
          <label style={{ fontSize: "0.875rem" }}>Zip/Postal Code</label>
          <input
            type="text"
            value={schoolData.zipCode}
            onChange={(e) => setSchoolData({ ...schoolData, zipCode: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            style={{ fontSize: "0.875rem" }}
          />
        </div>
        <div>
          <label style={{ fontSize: "0.875rem" }}>Timezone</label>
          <div className="relative mt-1">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={schoolData.timezone}
              onChange={(e) => setSchoolData({ ...schoolData, timezone: e.target.value })}
              className="w-full pl-10 px-3 py-2 rounded-lg border border-border bg-background"
              style={{ fontSize: "0.875rem" }}
            >
              {TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.875rem" }}>Currency</label>
          <select
            value={schoolData.currency}
            onChange={(e) => setSchoolData({ ...schoolData, currency: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            style={{ fontSize: "0.875rem" }}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name} ({c.symbol})</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label style={{ fontSize: "0.875rem" }}>Website</label>
          <input
            type="url"
            value={schoolData.website}
            onChange={(e) => setSchoolData({ ...schoolData, website: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
            style={{ fontSize: "0.875rem" }}
            placeholder="https://"
          />
        </div>
      </div>
    </div>
  );

  // Step 2: Academic Year
  const renderAcademicStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Current Academic Year</h3>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            Set up your academic calendar
          </p>
        </div>
        <button
          onClick={() => setAcademicData({
            ...academicData,
            terms: [...academicData.terms, { id: Date.now(), name: "", startDate: "", endDate: "", type: "semester" }]
          })}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Term
        </button>
      </div>

      <div className="grid gap-4">
        {academicData.terms.map((term, idx) => (
          <div key={term.id} className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">{idx + 1}</span>
                </div>
                <input
                  type="text"
                  value={term.name}
                  onChange={(e) => {
                    const newTerms = [...academicData.terms];
                    newTerms[idx].name = e.target.value;
                    setAcademicData({ ...academicData, terms: newTerms });
                  }}
                  placeholder="Term Name"
                  className="px-2 py-1 rounded border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              {academicData.terms.length > 1 && (
                <button
                  onClick={() => {
                    setAcademicData({
                      ...academicData,
                      terms: academicData.terms.filter(t => t.id !== term.id)
                    });
                  }}
                  className="p-1 text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={{ fontSize: "0.75rem" }}>Start Date</label>
                <input
                  type="date"
                  value={term.startDate}
                  onChange={(e) => {
                    const newTerms = [...academicData.terms];
                    newTerms[idx].startDate = e.target.value;
                    // Validate: start date should not be after end date
                    if (newTerms[idx].endDate && e.target.value > newTerms[idx].endDate) {
                      newTerms[idx].endDate = e.target.value;
                    }
                    setAcademicData({ ...academicData, terms: newTerms });
                  }}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem" }}>End Date</label>
                <input
                  type="date"
                  value={term.endDate}
                  onChange={(e) => {
                    const newTerms = [...academicData.terms];
                    // Validate: end date should not be before start date
                    if (newTerms[idx].startDate && e.target.value < newTerms[idx].startDate) {
                      return; // Don't update if end date is before start date
                    }
                    newTerms[idx].endDate = e.target.value;
                    setAcademicData({ ...academicData, terms: newTerms });
                  }}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Step 3: Holidays
  const renderHolidaysStep = () => (
    <div className="space-y-6">
      <div>
        <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>School Holidays</h3>
        <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
          Add holidays and vacation days
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newHoliday.name}
          onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
          placeholder="Holiday name"
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background"
          style={{ fontSize: "0.875rem" }}
        />
        <input
          type="date"
          value={newHoliday.date}
          onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
          className="w-40 px-3 py-2 rounded-lg border border-border bg-background"
          style={{ fontSize: "0.875rem" }}
        />
        <select
          value={newHoliday.type}
          onChange={(e) => setNewHoliday({ ...newHoliday, type: e.target.value })}
          className="w-32 px-3 py-2 rounded-lg border border-border bg-background"
          style={{ fontSize: "0.875rem" }}
        >
          <option value="national">National</option>
          <option value="festival">Festival</option>
          <option value="vacation">Vacation</option>
        </select>
        <button
          onClick={addHoliday}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {holidays.map(holiday => (
          <div key={holiday.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                holiday.type === "national" ? "bg-blue-500" :
                holiday.type === "festival" ? "bg-purple-500" : "bg-green-500"
              }`} />
              <span style={{ fontSize: "0.875rem" }}>{holiday.name}</span>
              <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{holiday.date}</span>
            </div>
            <button
              onClick={() => removeHoliday(holiday.id)}
              className="p-1 text-muted-foreground hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Step 4: Classes & Sections
  const renderClassesStep = () => (
    <div className="space-y-6">
      <div>
        <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Classes & Sections</h3>
        <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
          Define grade levels and sections
        </p>
      </div>

      <div className="space-y-3">
        {classes.map(grade => (
          <div key={grade.id} className="p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span style={{ fontSize: "0.9375rem", fontWeight: 500 }}>{grade.name}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(sections[grade.id] || []).map(section => (
                <span
                  key={section}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-sm"
                >
                  Section {section}
                  <button
                    onClick={() => removeSection(grade.id, section)}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={() => addSection(grade.id)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-dashed border-border text-muted-foreground hover:bg-muted"
                style={{ fontSize: "0.8125rem" }}
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Step 5: Subjects
  const renderSubjectsStep = () => (
    <div className="space-y-6">
      <div>
        <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Subjects</h3>
        <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
          Configure subjects and categories
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newSubject.name}
          onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
          placeholder="Subject name"
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background"
          style={{ fontSize: "0.875rem" }}
        />
        <input
          type="text"
          value={newSubject.code}
          onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
          placeholder="Code"
          className="w-24 px-3 py-2 rounded-lg border border-border bg-background"
          style={{ fontSize: "0.875rem" }}
        />
        <select
          value={newSubject.category}
          onChange={(e) => setNewSubject({ ...newSubject, category: e.target.value })}
          className="w-32 px-3 py-2 rounded-lg border border-border bg-background"
          style={{ fontSize: "0.875rem" }}
        >
          <option value="Core">Core</option>
          <option value="Science">Science</option>
          <option value="Social">Social</option>
          <option value="Technology">Technology</option>
          <option value="Language">Language</option>
          <option value="Arts">Arts</option>
        </select>
        <button
          onClick={addSubject}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {subjects.map(subject => (
          <div key={subject.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>{subject.name}</p>
              <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{subject.code}</p>
            </div>
            <button
              onClick={() => removeSubject(subject.id)}
              className="p-1 text-muted-foreground hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderProfileStep();
      case 1: return renderAcademicStep();
      case 2: return renderHolidaysStep();
      case 3: return renderClassesStep();
      case 4: return renderSubjectsStep();
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {saved ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Setup Complete!</h2>
          <p className="text-muted-foreground mt-2" style={{ fontSize: "0.875rem" }}>
            Redirecting to settings...
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>School Setup Wizard</h1>
            <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>
              Complete these steps to configure your school
            </p>
          </div>

          {renderProgress()}

          <div className="bg-card rounded-xl border border-border p-6">
            {renderCurrentStep()}
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors ${
                currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ fontSize: "0.875rem" }}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => navigate("/settings")}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                style={{ fontSize: "0.875rem" }}
              >
                Save & Exit
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                  style={{ fontSize: "0.875rem" }}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60"
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
                      Complete Setup
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
