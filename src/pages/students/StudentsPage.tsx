import { useState, useMemo, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Users, Plus, PoundSterling, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, DataTable, StatusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudentRow {
  id: string;
  firstName: string;
  lastName: string;
  upn: string;
  yearGroup: string;
  formClass: string;
  attendance: number;
  hasSEN: boolean;
  senType: string | null;
  pupilPremium: boolean;
  status: "ACTIVE" | "WITHDRAWN";
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_STUDENTS: StudentRow[] = [
  {
    id: "s1",
    firstName: "Emma",
    lastName: "Thompson",
    upn: "A820199011001",
    yearGroup: "Y7",
    formClass: "7A",
    attendance: 96.2,
    hasSEN: false,
    senType: null,
    pupilPremium: false,
    status: "ACTIVE",
  },
  {
    id: "s2",
    firstName: "Oliver",
    lastName: "Bennett",
    upn: "A820199011002",
    yearGroup: "Y7",
    formClass: "7B",
    attendance: 94.5,
    hasSEN: true,
    senType: "ADHD",
    pupilPremium: true,
    status: "ACTIVE",
  },
  {
    id: "s3",
    firstName: "Sophie",
    lastName: "Clarke",
    upn: "A820199011003",
    yearGroup: "Y8",
    formClass: "8A",
    attendance: 91.0,
    hasSEN: false,
    senType: null,
    pupilPremium: false,
    status: "ACTIVE",
  },
  {
    id: "s4",
    firstName: "James",
    lastName: "Harrison",
    upn: "A820199011004",
    yearGroup: "Y8",
    formClass: "8C",
    attendance: 88.3,
    hasSEN: true,
    senType: "DYSLEXIA",
    pupilPremium: true,
    status: "ACTIVE",
  },
  {
    id: "s5",
    firstName: "Grace",
    lastName: "Mitchell",
    upn: "A820199011005",
    yearGroup: "Y9",
    formClass: "9B",
    attendance: 97.1,
    hasSEN: false,
    senType: null,
    pupilPremium: false,
    status: "ACTIVE",
  },
  {
    id: "s6",
    firstName: "Ethan",
    lastName: "Robinson",
    upn: "A820199011006",
    yearGroup: "Y9",
    formClass: "9A",
    attendance: 85.6,
    hasSEN: true,
    senType: "ASD",
    pupilPremium: false,
    status: "ACTIVE",
  },
  {
    id: "s7",
    firstName: "Chloe",
    lastName: "Walker",
    upn: "A820199011007",
    yearGroup: "Y10",
    formClass: "10C",
    attendance: 93.8,
    hasSEN: false,
    senType: null,
    pupilPremium: true,
    status: "ACTIVE",
  },
  {
    id: "s8",
    firstName: "Noah",
    lastName: "Wright",
    upn: "A820199011008",
    yearGroup: "Y10",
    formClass: "10B",
    attendance: 99.0,
    hasSEN: false,
    senType: null,
    pupilPremium: false,
    status: "ACTIVE",
  },
  {
    id: "s9",
    firstName: "Amelia",
    lastName: "Turner",
    upn: "A820199011009",
    yearGroup: "Y11",
    formClass: "11A",
    attendance: 78.4,
    hasSEN: true,
    senType: "SEMH",
    pupilPremium: true,
    status: "ACTIVE",
  },
  {
    id: "s10",
    firstName: "Harry",
    lastName: "Adams",
    upn: "A820199011010",
    yearGroup: "Y11",
    formClass: "11D",
    attendance: 95.5,
    hasSEN: false,
    senType: null,
    pupilPremium: false,
    status: "ACTIVE",
  },
  {
    id: "s11",
    firstName: "Lily",
    lastName: "Baker",
    upn: "A820199011011",
    yearGroup: "Y12",
    formClass: "6th",
    attendance: 92.3,
    hasSEN: false,
    senType: null,
    pupilPremium: false,
    status: "ACTIVE",
  },
  {
    id: "s12",
    firstName: "Oscar",
    lastName: "Campbell",
    upn: "A820199011012",
    yearGroup: "Y12",
    formClass: "6th",
    attendance: 90.1,
    hasSEN: true,
    senType: "EAL",
    pupilPremium: true,
    status: "ACTIVE",
  },
  {
    id: "s13",
    firstName: "Mia",
    lastName: "Cooper",
    upn: "A820199011013",
    yearGroup: "Y13",
    formClass: "6th",
    attendance: 96.9,
    hasSEN: false,
    senType: null,
    pupilPremium: false,
    status: "ACTIVE",
  },
  {
    id: "s14",
    firstName: "Liam",
    lastName: "Davis",
    upn: "A820199011014",
    yearGroup: "Y7",
    formClass: "7C",
    attendance: 89.2,
    hasSEN: false,
    senType: null,
    pupilPremium: false,
    status: "ACTIVE",
  },
  {
    id: "s15",
    firstName: "Isla",
    lastName: "Evans",
    upn: "A820199011015",
    yearGroup: "Y8",
    formClass: "8B",
    attendance: 82.7,
    hasSEN: true,
    senType: "VI",
    pupilPremium: true,
    status: "ACTIVE",
  },
  {
    id: "s16",
    firstName: "Logan",
    lastName: "Foster",
    upn: "A820199011016",
    yearGroup: "Y9",
    formClass: "9C",
    attendance: 94.4,
    hasSEN: false,
    senType: null,
    pupilPremium: false,
    status: "ACTIVE",
  },
  {
    id: "s17",
    firstName: "Poppy",
    lastName: "Green",
    upn: "A820199011017",
    yearGroup: "Y10",
    formClass: "10A",
    attendance: 87.0,
    hasSEN: false,
    senType: null,
    pupilPremium: true,
    status: "ACTIVE",
  },
  {
    id: "s18",
    firstName: "Charlie",
    lastName: "Hill",
    upn: "A820199011018",
    yearGroup: "Y11",
    formClass: "11B",
    attendance: 91.8,
    hasSEN: true,
    senType: "MLD",
    pupilPremium: false,
    status: "WITHDRAWN",
  },
  {
    id: "s19",
    firstName: "Freya",
    lastName: "Jackson",
    upn: "A820199011019",
    yearGroup: "Y12",
    formClass: "6th",
    attendance: 98.3,
    hasSEN: false,
    senType: null,
    pupilPremium: false,
    status: "ACTIVE",
  },
  {
    id: "s20",
    firstName: "Alfie",
    lastName: "King",
    upn: "A820199011020",
    yearGroup: "Y13",
    formClass: "6th",
    attendance: 93.0,
    hasSEN: false,
    senType: null,
    pupilPremium: true,
    status: "ACTIVE",
  },
];

const YEAR_GROUPS = ["Y7", "Y8", "Y9", "Y10", "Y11", "Y12", "Y13"];

// ─── Add Student Dialog ────────────────────────────────────────────────────────

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AddStudentDialog({ open, onOpenChange }: AddStudentDialogProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    yearGroup: "",
    dateOfBirth: "",
    gender: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.yearGroup) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    onOpenChange(false);
    setForm({
      firstName: "",
      lastName: "",
      yearGroup: "",
      dateOfBirth: "",
      gender: "",
    });
    toast.success(
      `Student ${form.firstName} ${form.lastName} added successfully.`,
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter the student's basic details. Full profile can be completed
            afterward.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="add-firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="add-firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, firstName: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="add-lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, lastName: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-yearGroup">
              Year Group <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.yearGroup}
              onValueChange={(v) => setForm((p) => ({ ...p, yearGroup: v }))}
            >
              <SelectTrigger id="add-yearGroup">
                <SelectValue placeholder="Select year group" />
              </SelectTrigger>
              <SelectContent>
                {YEAR_GROUPS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-dob">Date of Birth</Label>
            <Input
              id="add-dob"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) =>
                setForm((p) => ({ ...p, dateOfBirth: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-gender">Gender</Label>
            <Select
              value={form.gender}
              onValueChange={(v) => setForm((p) => ({ ...p, gender: v }))}
            >
              <SelectTrigger id="add-gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="NON_BINARY">Non-binary</SelectItem>
                <SelectItem value="PREFER_NOT_TO_SAY">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Column Definitions ────────────────────────────────────────────────────────

function getAttendanceColor(pct: number): string {
  if (pct >= 95) return "text-green-700";
  if (pct >= 90) return "text-amber-600";
  return "text-red-600";
}

const columns: ColumnDef<StudentRow>[] = [
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    id: "name",
    header: "Name",
    cell: ({ row }) => {
      const initials =
        row.original.firstName[0].toUpperCase() +
        row.original.lastName[0].toUpperCase();
      return (
        <div className="flex items-center gap-2.5 min-w-[160px]">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-900 text-sm hover:text-primary">
            {row.original.firstName} {row.original.lastName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "upn",
    header: "UPN",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-gray-500">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "yearGroup",
    header: "Year",
    cell: ({ getValue }) => (
      <Badge variant="ghost">{getValue() as string}</Badge>
    ),
  },
  {
    accessorKey: "formClass",
    header: "Form",
  },
  {
    accessorKey: "attendance",
    header: "Attendance",
    cell: ({ getValue }) => {
      const pct = getValue() as number;
      return (
        <span className={`font-semibold text-sm ${getAttendanceColor(pct)}`}>
          {pct.toFixed(1)}%
        </span>
      );
    },
  },
  {
    accessorKey: "hasSEN",
    header: "SEN",
    cell: ({ row }) =>
      row.original.hasSEN ? (
        <Badge variant="purple">{row.original.senType ?? "SEN"}</Badge>
      ) : (
        <span className="text-gray-300 text-xs">—</span>
      ),
  },
  {
    accessorKey: "pupilPremium",
    header: "PP",
    cell: ({ getValue }) =>
      getValue() ? (
        <div className="flex items-center gap-1 text-amber-600">
          <PoundSterling className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">PP</span>
        </div>
      ) : (
        <span className="text-gray-300 text-xs">—</span>
      ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
  },
];

// ─── Page Component ────────────────────────────────────────────────────────────

export default function StudentsPage() {
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [senFilter, setSenFilter] = useState(false);
  const [ppFilter, setPpFilter] = useState(false);

  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => {
      if (yearFilter !== "all" && s.yearGroup !== yearFilter) return false;
      if (senFilter && !s.hasSEN) return false;
      if (ppFilter && !s.pupilPremium) return false;
      return true;
    });
  }, [yearFilter, senFilter, ppFilter]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <PageHeader
        title="Students"
        subtitle={`${filteredStudents.length} student${filteredStudents.length !== 1 ? "s" : ""} ${yearFilter !== "all" ? `in ${yearFilter}` : "across all year groups"}`}
        icon={Users}
        iconColor="bg-blue-600"
        actions={[
          {
            label: "Add Student",
            icon: Plus,
            onClick: () => setAddOpen(true),
          },
        ]}
      />

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-gray-500 shrink-0">Year Group</Label>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {YEAR_GROUPS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 ml-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="sen-filter"
                checked={senFilter}
                onCheckedChange={(v) => setSenFilter(Boolean(v))}
              />
              <Label htmlFor="sen-filter" className="text-xs cursor-pointer">
                SEN only
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="pp-filter"
                checked={ppFilter}
                onCheckedChange={(v) => setPpFilter(Boolean(v))}
              />
              <Label htmlFor="pp-filter" className="text-xs cursor-pointer">
                Pupil Premium only
              </Label>
            </div>
          </div>

          {(yearFilter !== "all" || senFilter || ppFilter) && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-xs h-7 gap-1 text-gray-500"
              onClick={() => {
                setYearFilter("all");
                setSenFilter(false);
                setPpFilter(false);
              }}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Clear filters
            </Button>
          )}
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredStudents}
          searchPlaceholder="Search by name or UPN..."
          emptyMessage="No students match the current filters."
          onRowClick={(row) => navigate(`/students/${row.id}`)}
          pageSize={20}
        />
      </div>

      <AddStudentDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
