import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Accessibility,
  Calendar,
  Plus,
  Clock,
  Target,
  FileText,
  X,
  GraduationCap,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Types ---
type SENType = "EHCP" | "SEN_SUPPORT" | "SCHOOL_BASED";

interface SENTarget {
  area: string;
  target: string;
  progress: number; // 0-100
}

interface ReviewRecord {
  date: string;
  outcome: string;
  reviewer: string;
}

interface SENStudent {
  id: string;
  name: string;
  year: string;
  yearGroup: string;
  senType: SENType;
  primaryNeed: string;
  needs: string[];
  provisions: string[];
  provisionsCount: number;
  reviewDate: string;
  sencoLead: string;
  targets: SENTarget[];
  reviewHistory: ReviewRecord[];
  nextReviewDate: string;
  form: string;
}

// --- Mock Data ---
const MOCK_SEN_STUDENTS: SENStudent[] = [
  {
    id: "sen_1",
    name: "Jade Thompson",
    year: "Year 8",
    yearGroup: "8",
    senType: "EHCP",
    primaryNeed: "Autism Spectrum Condition",
    needs: [
      "Communication & Interaction",
      "Social Skills",
      "Sensory Processing",
    ],
    provisions: [
      "1:1 Teaching Assistant support (10 hrs/week)",
      "Sensory breaks between lessons",
      "Adapted timetable (no corridor changes during transitions)",
      "Social skills group (Tuesdays lunch)",
      "Reduced homework expectations",
    ],
    provisionsCount: 5,
    reviewDate: "15/03/2026",
    sencoLead: "Ms. L. Mills",
    targets: [
      {
        area: "Communication",
        target: "Initiate peer conversations in structured settings",
        progress: 60,
      },
      { area: "Literacy", target: "Read at age-expected level", progress: 75 },
      {
        area: "Independence",
        target: "Navigate school independently without support",
        progress: 80,
      },
    ],
    reviewHistory: [
      {
        date: "12/09/2025",
        outcome: "Targets updated. Extra TA hours approved.",
        reviewer: "Ms. L. Mills",
      },
      {
        date: "15/04/2025",
        outcome:
          "Annual review completed. EHCP maintained. Provisions effective.",
        reviewer: "Ms. L. Mills",
      },
      {
        date: "10/09/2024",
        outcome: "Transition review from Year 7. Good progress reported.",
        reviewer: "Ms. L. Mills",
      },
    ],
    nextReviewDate: "15/03/2026",
    form: "8B",
  },
  {
    id: "sen_2",
    name: "Oliver Nwosu",
    year: "Year 9",
    yearGroup: "9",
    senType: "EHCP",
    primaryNeed: "Specific Learning Difficulty (Dyslexia)",
    needs: ["Literacy", "Processing Speed", "Working Memory"],
    provisions: [
      "Extra time (25%) in all assessments",
      "Reader/Scribe available for examinations",
      "Coloured overlays and tinted paper",
      "Pre-teaching key vocabulary",
      "Laptop for extended written work",
      "Weekly specialist literacy sessions",
    ],
    provisionsCount: 6,
    reviewDate: "20/04/2026",
    sencoLead: "Ms. L. Mills",
    targets: [
      {
        area: "Reading Speed",
        target: "Read at 90 words per minute accurately",
        progress: 55,
      },
      {
        area: "Spelling",
        target: "Reduce KS3 spelling errors by 50%",
        progress: 40,
      },
      {
        area: "Written Output",
        target: "Produce structured paragraphs independently",
        progress: 65,
      },
    ],
    reviewHistory: [
      {
        date: "20/10/2025",
        outcome:
          "Reviewed by SENCO and specialist teacher. Laptop provision extended.",
        reviewer: "Ms. L. Mills",
      },
      {
        date: "22/04/2025",
        outcome: "Annual review. Good engagement with literacy programme.",
        reviewer: "Ms. L. Mills",
      },
    ],
    nextReviewDate: "20/04/2026",
    form: "9A",
  },
  {
    id: "sen_3",
    name: "Fatima Hassan",
    year: "Year 10",
    yearGroup: "10",
    senType: "SEN_SUPPORT",
    primaryNeed: "Social, Emotional and Mental Health (SEMH)",
    needs: ["Emotional Regulation", "Anxiety Management", "Attendance"],
    provisions: [
      "Keyworker check-ins (daily)",
      "Safe space access (pastoral office)",
      "Reduced lesson timetable (agreed with parents)",
      "CAMHS referral in progress",
    ],
    provisionsCount: 4,
    reviewDate: "10/03/2026",
    sencoLead: "Ms. L. Mills",
    targets: [
      {
        area: "Attendance",
        target: "Achieve 85% attendance this term",
        progress: 70,
      },
      {
        area: "Emotional Regulation",
        target: "Use self-regulation strategies independently",
        progress: 50,
      },
      {
        area: "Academic Engagement",
        target: "Complete core subject coursework",
        progress: 30,
      },
    ],
    reviewHistory: [
      {
        date: "15/01/2026",
        outcome:
          "Emergency review following extended absence. New plan agreed.",
        reviewer: "Mr. J. Okafor",
      },
      {
        date: "05/11/2025",
        outcome: "Interim review. Additional pastoral support added.",
        reviewer: "Ms. L. Mills",
      },
    ],
    nextReviewDate: "10/03/2026",
    form: "10C",
  },
  {
    id: "sen_4",
    name: "Ethan Park",
    year: "Year 7",
    yearGroup: "7",
    senType: "SEN_SUPPORT",
    primaryNeed: "Speech, Language and Communication",
    needs: [
      "Expressive Language",
      "Receptive Language",
      "Social Communication",
    ],
    provisions: [
      "Weekly SALT sessions (external therapist)",
      "Simplified written instructions",
      "Pre-lesson vocabulary lists",
      "Peer buddy system",
    ],
    provisionsCount: 4,
    reviewDate: "25/03/2026",
    sencoLead: "Ms. L. Mills",
    targets: [
      {
        area: "Spoken Language",
        target: "Contribute verbally in group discussions",
        progress: 45,
      },
      {
        area: "Comprehension",
        target: "Follow multi-step verbal instructions",
        progress: 60,
      },
    ],
    reviewHistory: [
      {
        date: "12/12/2025",
        outcome:
          "First term review. Good progress with SALT, targets adjusted.",
        reviewer: "Ms. L. Mills",
      },
    ],
    nextReviewDate: "25/03/2026",
    form: "7A",
  },
  {
    id: "sen_5",
    name: "Lena Müller",
    year: "Year 8",
    yearGroup: "8",
    senType: "SCHOOL_BASED",
    primaryNeed: "Dyscalculia",
    needs: ["Numeracy", "Mathematical Reasoning", "Number Memory"],
    provisions: [
      "Number square and calculator access",
      "Concrete manipulatives in Maths",
      "Extra time for numeracy tasks",
    ],
    provisionsCount: 3,
    reviewDate: "05/06/2026",
    sencoLead: "Ms. L. Mills",
    targets: [
      { area: "Numeracy", target: "Master times tables (1–10)", progress: 40 },
      {
        area: "Problem Solving",
        target: "Solve two-step word problems with concrete aids",
        progress: 55,
      },
    ],
    reviewHistory: [
      {
        date: "14/10/2025",
        outcome: "Initial plan set following referral from Maths department.",
        reviewer: "Ms. L. Mills",
      },
    ],
    nextReviewDate: "05/06/2026",
    form: "8D",
  },
  {
    id: "sen_6",
    name: "Aaron Birch",
    year: "Year 11",
    yearGroup: "11",
    senType: "EHCP",
    primaryNeed: "Hearing Impairment",
    needs: ["Sensory Support", "Communication Access", "Technology"],
    provisions: [
      "FM radio aid system (all classrooms)",
      "Note-taker support",
      "Front-row seating in all lessons",
      "Captioned video resources",
      "Specialist Teacher of the Deaf (fortnightly)",
      "Extra time (25%) in examinations",
    ],
    provisionsCount: 6,
    reviewDate: "30/04/2026",
    sencoLead: "Ms. L. Mills",
    targets: [
      {
        area: "Academic Access",
        target: "All lessons fully accessible via FM system",
        progress: 90,
      },
      {
        area: "Independence",
        target: "Self-advocate in new settings",
        progress: 70,
      },
      {
        area: "GCSE Preparation",
        target: "Access arrangements confirmed with JCQ",
        progress: 85,
      },
    ],
    reviewHistory: [
      {
        date: "10/01/2026",
        outcome:
          "Pre-GCSE review. Access arrangements confirmed. Strong progress.",
        reviewer: "Ms. L. Mills",
      },
      {
        date: "02/06/2025",
        outcome:
          "Annual review. EHCP maintained with updated technology provision.",
        reviewer: "Ms. L. Mills",
      },
    ],
    nextReviewDate: "30/04/2026",
    form: "11A",
  },
  {
    id: "sen_7",
    name: "Niamh O'Brien",
    year: "Year 9",
    yearGroup: "9",
    senType: "SEN_SUPPORT",
    primaryNeed: "Attention Deficit Hyperactivity Disorder (ADHD)",
    needs: ["Concentration", "Organisation", "Impulse Control"],
    provisions: [
      "Seating near teacher / away from distractions",
      "Short, chunked tasks",
      "Visual timetable and planner",
      "Regular movement breaks",
      "Homework diary checked weekly",
    ],
    provisionsCount: 5,
    reviewDate: "18/05/2026",
    sencoLead: "Ms. L. Mills",
    targets: [
      {
        area: "Focus",
        target: "Sustain on-task focus for 20 minutes independently",
        progress: 50,
      },
      {
        area: "Organisation",
        target: "Submit homework on time for 80% of tasks",
        progress: 60,
      },
      {
        area: "Social",
        target: "Participate in group work without disruption",
        progress: 65,
      },
    ],
    reviewHistory: [
      {
        date: "18/11/2025",
        outcome:
          "First formal review. Provisions effective. Medication review pending.",
        reviewer: "Ms. L. Mills",
      },
    ],
    nextReviewDate: "18/05/2026",
    form: "9C",
  },
  {
    id: "sen_8",
    name: "Samuel Osei",
    year: "Year 10",
    yearGroup: "10",
    senType: "SCHOOL_BASED",
    primaryNeed: "Developmental Coordination Disorder (DCD/Dyspraxia)",
    needs: ["Fine Motor Skills", "Physical Coordination", "Organisation"],
    provisions: [
      "Laptop / tablet for written work",
      "Occupational Therapy exercises (in-school)",
      "Extended time for practical tasks",
    ],
    provisionsCount: 3,
    reviewDate: "12/07/2026",
    sencoLead: "Ms. L. Mills",
    targets: [
      {
        area: "Written Work",
        target: "Produce legible written work under assessment conditions",
        progress: 75,
      },
      {
        area: "Practical Skills",
        target: "Complete practical tasks within standard timeframes",
        progress: 35,
      },
    ],
    reviewHistory: [
      {
        date: "28/10/2025",
        outcome: "School-based plan reviewed. OT referral accepted.",
        reviewer: "Ms. L. Mills",
      },
    ],
    nextReviewDate: "12/07/2026",
    form: "10B",
  },
];

// --- SEN Type Config ---
const senTypeConfig: Record<
  SENType,
  { label: string; variant: "default" | "info" | "success"; shortLabel: string }
> = {
  EHCP: { label: "EHCP", variant: "default", shortLabel: "EHCP" },
  SEN_SUPPORT: {
    label: "SEN Support",
    variant: "info",
    shortLabel: "SEN Support",
  },
  SCHOOL_BASED: {
    label: "School-Based",
    variant: "success",
    shortLabel: "School-Based",
  },
};

// --- Side Panel ---
function SENSidePanel({
  student,
  onClose,
}: {
  student: SENStudent;
  onClose: () => void;
}) {
  const senCfg = senTypeConfig[student.senType];

  return (
    <div className="flex flex-col h-full border-l border-gray-200 bg-white w-full md:w-[420px] shrink-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-sm">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">
              {student.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-gray-500">
                {student.year} · Form {student.form}
              </span>
              <Badge variant={senCfg.variant} className="text-xs">
                {senCfg.label}
              </Badge>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-100 shrink-0"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 py-4 space-y-5">
          {/* Primary Need */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Primary Need
            </p>
            <p className="text-sm font-medium text-gray-800">
              {student.primaryNeed}
            </p>
          </div>

          {/* Needs */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Areas of Need
            </p>
            <div className="flex flex-wrap gap-1.5">
              {student.needs.map((need) => (
                <Badge key={need} variant="ghost" className="text-xs">
                  {need}
                </Badge>
              ))}
            </div>
          </div>

          {/* Current Provisions */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <ClipboardList className="h-3.5 w-3.5" />
              Current Provisions ({student.provisionsCount})
            </p>
            <ul className="space-y-1.5">
              {student.provisions.map((prov, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="text-xs text-gray-700 leading-relaxed">
                    {prov}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Targets */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" />
              Target Progress
            </p>
            <div className="space-y-3">
              {student.targets.map((tgt, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">
                      {tgt.area}
                    </span>
                    <span className="text-xs text-gray-500">
                      {tgt.progress}%
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-1.5 leading-relaxed">
                    {tgt.target}
                  </p>
                  <Progress value={tgt.progress} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Review History */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Review History
            </p>
            <div className="space-y-2">
              {student.reviewHistory.map((rev, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-gray-700">
                      {rev.date}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {rev.reviewer}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {rev.outcome}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Review */}
          <div className="rounded-xl bg-blue-50 border border-blue-100 px-3 py-3 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-500 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-blue-800">
                Next Review Date
              </p>
              <p className="text-sm font-bold text-blue-900">
                {student.nextReviewDate}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="ml-auto h-7 text-xs gap-1 border-blue-200 text-blue-700 hover:bg-blue-100"
              onClick={() => toast.success("Review scheduled")}
            >
              <Calendar className="h-3 w-3" />
              Schedule
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Footer actions */}
      <div className="border-t border-gray-100 px-4 py-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs gap-1.5"
          onClick={() => toast.info("Opening full profile")}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          Full Profile
        </Button>
        <Button
          size="sm"
          className="flex-1 text-xs gap-1.5"
          onClick={() => toast.success("Review scheduled")}
        >
          <Calendar className="h-3.5 w-3.5" />
          Schedule Review
        </Button>
      </div>
    </div>
  );
}

// --- Columns ---
const senColumns: ColumnDef<SENStudent>[] = [
  { accessorKey: "name", header: "Student" },
  { accessorKey: "year", header: "Year", size: 90 },
  {
    accessorKey: "senType",
    header: "SEN Type",
    size: 120,
    cell: ({ row }) => {
      const cfg = senTypeConfig[row.original.senType];
      return (
        <Badge variant={cfg.variant} className="text-xs">
          {cfg.label}
        </Badge>
      );
    },
  },
  { accessorKey: "primaryNeed", header: "Primary Need" },
  {
    accessorKey: "provisionsCount",
    header: "Provisions",
    size: 90,
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
        <ClipboardList className="h-3.5 w-3.5 text-gray-400" />
        {row.original.provisionsCount}
      </span>
    ),
  },
  {
    accessorKey: "reviewDate",
    header: "Review Date",
    size: 110,
    cell: ({ row }) => {
      const today = new Date();
      const reviewDate = row.original.reviewDate.split("/").reverse().join("-");
      const isDue =
        new Date(reviewDate) <=
        new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      return (
        <span
          className={`flex items-center gap-1 text-xs ${isDue ? "text-amber-600 font-medium" : "text-gray-600"}`}
        >
          <Clock
            className={`h-3.5 w-3.5 ${isDue ? "text-amber-500" : "text-gray-400"}`}
          />
          {row.original.reviewDate}
        </span>
      );
    },
  },
  { accessorKey: "sencoLead", header: "SENCO Lead" },
];

// --- Main Component ---
export default function SENPage() {
  const [selectedStudent, setSelectedStudent] = useState<SENStudent | null>(
    null,
  );
  const [filterSENType, setFilterSENType] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentYear, setNewStudentYear] = useState("Year 7");
  const [newStudentSENType, setNewStudentSENType] =
    useState<SENType>("SEN_SUPPORT");
  const [newStudentNeed, setNewStudentNeed] = useState("");

  const [students, setStudents] = useState<SENStudent[]>(MOCK_SEN_STUDENTS);

  const filteredStudents = students.filter((s) => {
    const matchesSENType =
      filterSENType === "all" || s.senType === filterSENType;
    const matchesYear = filterYear === "all" || s.yearGroup === filterYear;
    return matchesSENType && matchesYear;
  });

  const ehcpCount = students.filter((s) => s.senType === "EHCP").length;
  const senSupportCount = students.filter(
    (s) => s.senType === "SEN_SUPPORT",
  ).length;
  const schoolBasedCount = students.filter(
    (s) => s.senType === "SCHOOL_BASED",
  ).length;
  const reviewsDue = students.filter((s) => {
    const today = new Date();
    const reviewDate = s.reviewDate.split("/").reverse().join("-");
    return (
      new Date(reviewDate) <=
      new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    );
  }).length;

  function handleAddStudent() {
    if (!newStudentName.trim() || !newStudentNeed.trim()) {
      toast.error("Please fill in required fields");
      return;
    }
    const newStudent: SENStudent = {
      id: `sen_${Date.now()}`,
      name: newStudentName,
      year: newStudentYear,
      yearGroup: newStudentYear.replace("Year ", ""),
      senType: newStudentSENType,
      primaryNeed: newStudentNeed,
      needs: [newStudentNeed],
      provisions: ["To be determined at review"],
      provisionsCount: 0,
      reviewDate: "TBC",
      sencoLead: "Ms. L. Mills",
      targets: [],
      reviewHistory: [],
      nextReviewDate: "TBC",
      form: "TBC",
    };
    setStudents((p) => [...p, newStudent]);
    setNewStudentName("");
    setNewStudentYear("Year 7");
    setNewStudentSENType("SEN_SUPPORT");
    setNewStudentNeed("");
    setAddStudentOpen(false);
    toast.success(`${newStudent.name} added to the SEN Register`);
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="SEN Register"
        subtitle={`${students.length} students on register`}
        icon={Accessibility}
        iconColor="bg-purple-600"
        actions={[
          {
            label: "Add Student",
            icon: Plus,
            variant: "outline",
            onClick: () => setAddStudentOpen(true),
          },
          {
            label: "Schedule Review",
            icon: Calendar,
            onClick: () => toast.info("Opening review scheduler"),
          },
        ]}
      />

      <div className="flex flex-1 overflow-hidden bg-gray-50">
        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-auto p-6 space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="EHCP"
              value={ehcpCount}
              icon={FileText}
              variant="default"
              subtitle="Education, Health & Care Plans"
            />
            <StatCard
              title="SEN Support"
              value={senSupportCount}
              icon={Accessibility}
              variant="info"
              subtitle="SEN Support plans"
            />
            <StatCard
              title="School-Based Support"
              value={schoolBasedCount}
              icon={GraduationCap}
              variant="success"
              subtitle="Informal support plans"
            />
            <StatCard
              title="Reviews Due"
              value={reviewsDue}
              icon={Clock}
              variant="warning"
              subtitle="Within next 30 days"
            />
          </div>

          {/* Filters */}
          <Card className="p-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-medium text-gray-500 shrink-0">
                Filter:
              </span>
              <Select value={filterSENType} onValueChange={setFilterSENType}>
                <SelectTrigger className="h-7 w-40 text-xs">
                  <SelectValue placeholder="SEN Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All SEN Types</SelectItem>
                  <SelectItem value="EHCP">EHCP</SelectItem>
                  <SelectItem value="SEN_SUPPORT">SEN Support</SelectItem>
                  <SelectItem value="SCHOOL_BASED">School-Based</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="h-7 w-36 text-xs">
                  <SelectValue placeholder="Year Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {["7", "8", "9", "10", "11"].map((y) => (
                    <SelectItem key={y} value={y}>
                      Year {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(filterSENType !== "all" || filterYear !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-gray-500 gap-1"
                  onClick={() => {
                    setFilterSENType("all");
                    setFilterYear("all");
                  }}
                >
                  <X className="h-3 w-3" />
                  Clear
                </Button>
              )}
              <span className="text-xs text-gray-400 ml-auto">
                {filteredStudents.length} of {students.length} students
              </span>
            </div>
          </Card>

          {/* DataTable */}
          <DataTable
            columns={senColumns}
            data={filteredStudents}
            searchPlaceholder="Search students..."
            onRowClick={setSelectedStudent}
            emptyMessage="No students match the selected filters"
            rowClassName={(row) =>
              selectedStudent?.id === row.id ? "bg-blue-50/60" : ""
            }
          />
        </div>

        {/* Side panel */}
        {selectedStudent && (
          <SENSidePanel
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </div>

      {/* Add Student Dialog */}
      <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Student to SEN Register</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Student Name *</Label>
              <Input
                placeholder="Search for a student..."
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Year Group *</Label>
                <Select
                  value={newStudentYear}
                  onValueChange={setNewStudentYear}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Year 7", "Year 8", "Year 9", "Year 10", "Year 11"].map(
                      (y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">SEN Type *</Label>
                <Select
                  value={newStudentSENType}
                  onValueChange={(v) => setNewStudentSENType(v as SENType)}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EHCP">EHCP</SelectItem>
                    <SelectItem value="SEN_SUPPORT">SEN Support</SelectItem>
                    <SelectItem value="SCHOOL_BASED">School-Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Primary Need *</Label>
              <Select value={newStudentNeed} onValueChange={setNewStudentNeed}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select primary need" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Autism Spectrum Condition">
                    Autism Spectrum Condition
                  </SelectItem>
                  <SelectItem value="Specific Learning Difficulty (Dyslexia)">
                    Dyslexia
                  </SelectItem>
                  <SelectItem value="Dyscalculia">Dyscalculia</SelectItem>
                  <SelectItem value="Speech, Language and Communication">
                    Speech, Language & Communication
                  </SelectItem>
                  <SelectItem value="Social, Emotional and Mental Health (SEMH)">
                    SEMH
                  </SelectItem>
                  <SelectItem value="Attention Deficit Hyperactivity Disorder (ADHD)">
                    ADHD
                  </SelectItem>
                  <SelectItem value="Hearing Impairment">
                    Hearing Impairment
                  </SelectItem>
                  <SelectItem value="Visual Impairment">
                    Visual Impairment
                  </SelectItem>
                  <SelectItem value="Physical Disability">
                    Physical Disability
                  </SelectItem>
                  <SelectItem value="Developmental Coordination Disorder (DCD/Dyspraxia)">
                    DCD / Dyspraxia
                  </SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddStudentOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddStudent} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add to Register
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
