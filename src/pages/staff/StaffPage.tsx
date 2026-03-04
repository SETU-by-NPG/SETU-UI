import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Briefcase,
  Eye,
  Mail,
  Phone,
  Calendar,
  Building2,
  ShieldCheck,
} from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StaffRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  contractType: "PERMANENT" | "FIXED_TERM" | "SUPPLY";
  startDate: string;
  isActive: boolean;
  subjects: string[];
  qualifications: string[];
  dbsExpiry: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_STAFF: StaffRow[] = [
  {
    id: "st1",
    firstName: "Rachel",
    lastName: "Clarke",
    email: "r.clarke@setu.ac.uk",
    phone: "01234 567 001",
    jobTitle: "Head of English",
    department: "English",
    contractType: "PERMANENT",
    startDate: "2015-09-01",
    isActive: true,
    qualifications: ["BA English", "PGCE", "QTS"],
    dbsExpiry: "2026-08-31",
    subjects: ["English Language", "English Literature"],
  },
  {
    id: "st2",
    firstName: "Arun",
    lastName: "Patel",
    email: "a.patel@setu.ac.uk",
    phone: "01234 567 002",
    jobTitle: "Maths Teacher",
    department: "Mathematics",
    contractType: "PERMANENT",
    startDate: "2018-09-03",
    isActive: true,
    qualifications: ["BSc Mathematics", "PGCE"],
    dbsExpiry: "2026-04-15",
    subjects: ["Mathematics", "Further Maths"],
  },
  {
    id: "st3",
    firstName: "Helen",
    lastName: "Hughes",
    email: "h.hughes@setu.ac.uk",
    phone: "01234 567 003",
    jobTitle: "Head of Science",
    department: "Science",
    contractType: "PERMANENT",
    startDate: "2012-01-10",
    isActive: true,
    qualifications: ["PhD Chemistry", "PGCE", "QTS"],
    dbsExpiry: "2025-11-30",
    subjects: ["Chemistry", "Biology"],
  },
  {
    id: "st4",
    firstName: "Amanda",
    lastName: "Ford",
    email: "a.ford@setu.ac.uk",
    phone: "01234 567 004",
    jobTitle: "History Teacher",
    department: "Humanities",
    contractType: "PERMANENT",
    startDate: "2019-09-02",
    isActive: true,
    qualifications: ["MA History", "PGCE"],
    dbsExpiry: "2027-02-28",
    subjects: ["History"],
  },
  {
    id: "st5",
    firstName: "Thomas",
    lastName: "Bell",
    email: "t.bell@setu.ac.uk",
    phone: "01234 567 005",
    jobTitle: "Geography Teacher",
    department: "Humanities",
    contractType: "FIXED_TERM",
    startDate: "2023-09-04",
    isActive: true,
    qualifications: ["BSc Geography", "PGCE"],
    dbsExpiry: "2026-09-14",
    subjects: ["Geography"],
  },
  {
    id: "st6",
    firstName: "Isabelle",
    lastName: "Dupont",
    email: "i.dupont@setu.ac.uk",
    phone: "01234 567 006",
    jobTitle: "MFL Teacher",
    department: "Languages",
    contractType: "PERMANENT",
    startDate: "2017-09-01",
    isActive: true,
    qualifications: ["Licence FLE", "PGCE"],
    dbsExpiry: "2026-06-20",
    subjects: ["French", "Spanish"],
  },
  {
    id: "st7",
    firstName: "Nina",
    lastName: "Stone",
    email: "n.stone@setu.ac.uk",
    phone: "01234 567 007",
    jobTitle: "Art & Design Teacher",
    department: "Arts",
    contractType: "PERMANENT",
    startDate: "2016-01-11",
    isActive: true,
    qualifications: ["BA Fine Art", "PGCE"],
    dbsExpiry: "2025-12-31",
    subjects: ["Art", "Photography"],
  },
  {
    id: "st8",
    firstName: "Daniel",
    lastName: "James",
    email: "d.james@setu.ac.uk",
    phone: "01234 567 008",
    jobTitle: "Head of PE",
    department: "PE & Sport",
    contractType: "PERMANENT",
    startDate: "2014-09-01",
    isActive: true,
    qualifications: ["BSc Sports Science", "QTS"],
    dbsExpiry: "2026-07-10",
    subjects: ["PE", "Health & Social Care"],
  },
  {
    id: "st9",
    firstName: "Patricia",
    lastName: "Simmons",
    email: "p.simmons@setu.ac.uk",
    phone: "01234 567 009",
    jobTitle: "Deputy Headteacher",
    department: "Leadership",
    contractType: "PERMANENT",
    startDate: "2010-09-01",
    isActive: true,
    qualifications: ["MA Education", "NPQH", "QTS"],
    dbsExpiry: "2027-09-01",
    subjects: [],
  },
  {
    id: "st10",
    firstName: "Kevin",
    lastName: "Walsh",
    email: "k.walsh@setu.ac.uk",
    phone: "01234 567 010",
    jobTitle: "Computing Teacher",
    department: "Computing",
    contractType: "FIXED_TERM",
    startDate: "2022-01-04",
    isActive: true,
    qualifications: ["BSc Computer Science", "PGCE"],
    dbsExpiry: "2026-01-03",
    subjects: ["Computer Science", "ICT"],
  },
  {
    id: "st11",
    firstName: "Samira",
    lastName: "Khan",
    email: "s.khan@setu.ac.uk",
    phone: "01234 567 011",
    jobTitle: "SENCO",
    department: "SEN",
    contractType: "PERMANENT",
    startDate: "2016-09-05",
    isActive: true,
    qualifications: ["BEd", "NASENCo", "QTS"],
    dbsExpiry: "2026-05-22",
    subjects: ["PSHE"],
  },
  {
    id: "st12",
    firstName: "Jonathan",
    lastName: "Price",
    email: "j.price@setu.ac.uk",
    phone: "01234 567 012",
    jobTitle: "Music Teacher",
    department: "Arts",
    contractType: "PERMANENT",
    startDate: "2018-01-08",
    isActive: true,
    qualifications: ["BMus", "PGCE"],
    dbsExpiry: "2025-10-15",
    subjects: ["Music"],
  },
  {
    id: "st13",
    firstName: "Laura",
    lastName: "Green",
    email: "l.green@setu.ac.uk",
    phone: "01234 567 013",
    jobTitle: "Business Studies",
    department: "Business",
    contractType: "FIXED_TERM",
    startDate: "2024-09-02",
    isActive: true,
    qualifications: ["MBA", "PGCE"],
    dbsExpiry: "2027-09-01",
    subjects: ["Business Studies", "Economics"],
  },
  {
    id: "st14",
    firstName: "Marcus",
    lastName: "Brown",
    email: "m.brown@setu.ac.uk",
    phone: "01234 567 014",
    jobTitle: "Supply Teacher",
    department: "Cover",
    contractType: "SUPPLY",
    startDate: "2025-01-06",
    isActive: true,
    qualifications: ["BA Education", "QTS"],
    dbsExpiry: "2026-03-31",
    subjects: [],
  },
  {
    id: "st15",
    firstName: "Judith",
    lastName: "Morris",
    email: "j.morris@setu.ac.uk",
    phone: "01234 567 015",
    jobTitle: "School Business Manager",
    department: "Operations",
    contractType: "PERMANENT",
    startDate: "2013-04-15",
    isActive: true,
    qualifications: ["CIMA", "MBA"],
    dbsExpiry: "2026-11-20",
    subjects: [],
  },
];

const DEPARTMENTS = [...new Set(MOCK_STAFF.map((s) => s.department))].sort();
const CONTRACT_COLORS: Record<StaffRow["contractType"], string> = {
  PERMANENT: "success",
  FIXED_TERM: "warning",
  SUPPLY: "info",
};

// ─── Quick View Sheet ──────────────────────────────────────────────────────────

function StaffQuickView({
  staff,
  open,
  onOpenChange,
  onViewFull,
}: {
  staff: StaffRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onViewFull: (id: string) => void;
}) {
  if (!staff) return null;
  const initials =
    staff.firstName[0].toUpperCase() + staff.lastName[0].toUpperCase();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-start gap-3 pr-6">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-indigo-600 text-white text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle>
                {staff.firstName} {staff.lastName}
              </SheetTitle>
              <SheetDescription>{staff.jobTitle}</SheetDescription>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge variant="ghost">{staff.department}</Badge>
                <Badge
                  variant={
                    CONTRACT_COLORS[staff.contractType] as
                      | "success"
                      | "warning"
                      | "info"
                  }
                >
                  {staff.contractType.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        <Separator />

        <div className="space-y-5 pt-4">
          {/* Contact */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Contact
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-gray-700 truncate">{staff.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-gray-700">{staff.phone}</span>
            </div>
          </div>

          <Separator />

          {/* Employment */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Employment
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">Start Date:</span>
              <span className="font-medium text-gray-800">
                {staff.startDate}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">Department:</span>
              <span className="font-medium text-gray-800">
                {staff.department}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">DBS Expiry:</span>
              <span className="font-medium text-gray-800">
                {staff.dbsExpiry}
              </span>
            </div>
          </div>

          {staff.subjects.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Subjects
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {staff.subjects.map((s) => (
                    <Badge key={s} variant="ghost">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {staff.qualifications.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Qualifications
                </p>
                <ul className="space-y-1">
                  {staff.qualifications.map((q) => (
                    <li
                      key={q}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <Separator />

          <Button
            className="w-full gap-2"
            onClick={() => {
              onOpenChange(false);
              onViewFull(staff.id);
            }}
          >
            <Eye className="h-4 w-4" />
            View Full Profile
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default function StaffPage() {
  const navigate = useNavigate();
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [contractFilter, setContractFilter] = useState<string>("all");
  const [quickViewStaff, setQuickViewStaff] = useState<StaffRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filteredStaff = useMemo(() => {
    return MOCK_STAFF.filter((s) => {
      if (deptFilter !== "all" && s.department !== deptFilter) return false;
      if (contractFilter !== "all" && s.contractType !== contractFilter)
        return false;
      return true;
    });
  }, [deptFilter, contractFilter]);

  const columns: ColumnDef<StaffRow>[] = [
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
              <AvatarFallback className="text-xs bg-indigo-600 text-white font-medium">
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
      accessorKey: "jobTitle",
      header: "Job Title",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-700">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ getValue }) => (
        <Badge variant="ghost">{getValue() as string}</Badge>
      ),
    },
    {
      accessorKey: "contractType",
      header: "Contract",
      cell: ({ getValue }) => {
        const ct = getValue() as StaffRow["contractType"];
        return (
          <Badge
            variant={CONTRACT_COLORS[ct] as "success" | "warning" | "info"}
          >
            {ct.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-500">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ getValue }) => (
        <StatusBadge status={getValue() ? "ACTIVE" : "INACTIVE"} />
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewStaff(row.original);
            setSheetOpen(true);
          }}
          title="Quick view"
        >
          <Eye className="h-4 w-4 text-gray-400" />
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full min-h-0">
      <PageHeader
        title="Staff"
        subtitle={`${filteredStaff.length} staff member${filteredStaff.length !== 1 ? "s" : ""}`}
        icon={Briefcase}
        iconColor="bg-indigo-600"
      />

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 shrink-0">Department</span>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 shrink-0">Contract</span>
            <Select value={contractFilter} onValueChange={setContractFilter}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contracts</SelectItem>
                <SelectItem value="PERMANENT">Permanent</SelectItem>
                <SelectItem value="FIXED_TERM">Fixed Term</SelectItem>
                <SelectItem value="SUPPLY">Supply</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(deptFilter !== "all" || contractFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-xs h-7 text-gray-500"
              onClick={() => {
                setDeptFilter("all");
                setContractFilter("all");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Data table */}
        <DataTable
          columns={columns}
          data={filteredStaff}
          searchPlaceholder="Search staff by name, role or department..."
          emptyMessage="No staff match the current filters."
          onRowClick={(row) => navigate(`/staff/${row.id}`)}
          pageSize={15}
        />
      </div>

      {/* Quick view sheet */}
      <StaffQuickView
        staff={quickViewStaff}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onViewFull={(id) => navigate(`/staff/${id}`)}
      />
    </div>
  );
}
