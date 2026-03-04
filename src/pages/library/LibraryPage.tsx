import { useState } from "react";
import { BookOpen, AlertCircle, ArrowDownLeft, Plus } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type BookStatus = "available" | "borrowed" | "reserved" | "lost";
type BorrowStatus = "on-loan" | "overdue" | "returned";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: BookStatus;
  location: string;
  copies: number;
  available: number;
}

interface BorrowedBook {
  id: string;
  student: string;
  yearGroup: string;
  book: string;
  author: string;
  borrowedDate: string;
  dueDate: string;
  status: BorrowStatus;
  daysOverdue?: number;
}

interface LibraryMember {
  id: string;
  name: string;
  type: "Student" | "Staff";
  yearGroup: string;
  booksOut: number;
  joinedDate: string;
  status: "active" | "suspended";
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const BOOKS: Book[] = [
  {
    id: "bk01",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    category: "Fiction",
    status: "available",
    location: "F-A01",
    copies: 6,
    available: 4,
  },
  {
    id: "bk02",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "978-0-55-305505-0",
    category: "Non-Fiction",
    status: "available",
    location: "NF-S03",
    copies: 3,
    available: 1,
  },
  {
    id: "bk03",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-74-320975-6",
    category: "Fiction",
    status: "available",
    location: "F-F02",
    copies: 8,
    available: 5,
  },
  {
    id: "bk04",
    title: "Animal Farm",
    author: "George Orwell",
    isbn: "978-0-45-228424-1",
    category: "Fiction",
    status: "available",
    location: "F-O01",
    copies: 10,
    available: 7,
  },
  {
    id: "bk05",
    title: "Frankenstein",
    author: "Mary Shelley",
    isbn: "978-0-19-953582-0",
    category: "Fiction",
    status: "borrowed",
    location: "F-S04",
    copies: 4,
    available: 0,
  },
  {
    id: "bk06",
    title: "The Periodic Table",
    author: "Primo Levi",
    isbn: "978-0-14-118642-3",
    category: "Science",
    status: "available",
    location: "SC-L01",
    copies: 2,
    available: 2,
  },
  {
    id: "bk07",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    isbn: "978-0-09-959008-8",
    category: "History",
    status: "available",
    location: "H-01",
    copies: 5,
    available: 3,
  },
  {
    id: "bk08",
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-45-228423-4",
    category: "Fiction",
    status: "available",
    location: "F-O02",
    copies: 9,
    available: 6,
  },
  {
    id: "bk09",
    title: "Macbeth",
    author: "William Shakespeare",
    isbn: "978-0-19-953592-9",
    category: "Drama",
    status: "available",
    location: "DR-S01",
    copies: 30,
    available: 18,
  },
  {
    id: "bk10",
    title: "An Inspector Calls",
    author: "J.B. Priestley",
    isbn: "978-0-14-118562-4",
    category: "Drama",
    status: "available",
    location: "DR-P01",
    copies: 30,
    available: 22,
  },
  {
    id: "bk11",
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    isbn: "978-0-19-929114-4",
    category: "Science",
    status: "borrowed",
    location: "SC-D01",
    copies: 3,
    available: 0,
  },
  {
    id: "bk12",
    title: "A Raisin in the Sun",
    author: "Lorraine Hansberry",
    isbn: "978-0-67-972133-0",
    category: "Drama",
    status: "available",
    location: "DR-H01",
    copies: 6,
    available: 4,
  },
  {
    id: "bk13",
    title: "Of Mice and Men",
    author: "John Steinbeck",
    isbn: "978-0-14-028671-0",
    category: "Fiction",
    status: "available",
    location: "F-S05",
    copies: 12,
    available: 8,
  },
  {
    id: "bk14",
    title: "The Crucible",
    author: "Arthur Miller",
    isbn: "978-0-14-048138-6",
    category: "Drama",
    status: "reserved",
    location: "DR-M01",
    copies: 8,
    available: 2,
  },
  {
    id: "bk15",
    title: "Longitude",
    author: "Dava Sobel",
    isbn: "978-0-14-028075-6",
    category: "Non-Fiction",
    status: "available",
    location: "NF-S04",
    copies: 2,
    available: 2,
  },
  {
    id: "bk16",
    title: "Just William",
    author: "Richmal Crompton",
    isbn: "978-0-33-034810-6",
    category: "Fiction",
    status: "available",
    location: "F-C01",
    copies: 4,
    available: 3,
  },
  {
    id: "bk17",
    title: "Holes",
    author: "Louis Sachar",
    isbn: "978-0-44-022859-0",
    category: "Young Adult",
    status: "available",
    location: "YA-S01",
    copies: 6,
    available: 4,
  },
];

const BORROWED_BOOKS: BorrowedBook[] = [
  {
    id: "br01",
    student: "Aisha Patel",
    yearGroup: "Year 7",
    book: "To Kill a Mockingbird",
    author: "Harper Lee",
    borrowedDate: "2024-11-15",
    dueDate: "2024-11-29",
    status: "overdue",
    daysOverdue: 5,
  },
  {
    id: "br02",
    student: "Ben Thompson",
    yearGroup: "Year 7",
    book: "Animal Farm",
    author: "George Orwell",
    borrowedDate: "2024-11-20",
    dueDate: "2024-12-04",
    status: "on-loan",
  },
  {
    id: "br03",
    student: "Callum Harris",
    yearGroup: "Year 7",
    book: "A Brief History of Time",
    author: "Stephen Hawking",
    borrowedDate: "2024-11-10",
    dueDate: "2024-11-24",
    status: "overdue",
    daysOverdue: 10,
  },
  {
    id: "br04",
    student: "Danielle Morgan",
    yearGroup: "Year 7",
    book: "Frankenstein",
    author: "Mary Shelley",
    borrowedDate: "2024-11-22",
    dueDate: "2024-12-06",
    status: "on-loan",
  },
  {
    id: "br05",
    student: "Ethan Clarke",
    yearGroup: "Year 7",
    book: "1984",
    author: "George Orwell",
    borrowedDate: "2024-11-18",
    dueDate: "2024-12-02",
    status: "on-loan",
  },
  {
    id: "br06",
    student: "Fatima Al-Said",
    yearGroup: "Year 8",
    book: "Sapiens",
    author: "Yuval Noah Harari",
    borrowedDate: "2024-11-05",
    dueDate: "2024-11-19",
    status: "overdue",
    daysOverdue: 15,
  },
  {
    id: "br07",
    student: "George Bennett",
    yearGroup: "Year 8",
    book: "Macbeth",
    author: "William Shakespeare",
    borrowedDate: "2024-11-25",
    dueDate: "2024-12-09",
    status: "on-loan",
  },
  {
    id: "br08",
    student: "Hannah Wright",
    yearGroup: "Year 9",
    book: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    borrowedDate: "2024-11-28",
    dueDate: "2024-12-12",
    status: "on-loan",
  },
  {
    id: "br09",
    student: "Isaac Johnson",
    yearGroup: "Year 9",
    book: "The Selfish Gene",
    author: "Richard Dawkins",
    borrowedDate: "2024-11-01",
    dueDate: "2024-11-15",
    status: "overdue",
    daysOverdue: 19,
  },
  {
    id: "br10",
    student: "Jasmine Lee",
    yearGroup: "Year 10",
    book: "An Inspector Calls",
    author: "J.B. Priestley",
    borrowedDate: "2024-11-26",
    dueDate: "2024-12-10",
    status: "on-loan",
  },
  {
    id: "br11",
    student: "Kyle Adams",
    yearGroup: "Year 10",
    book: "Of Mice and Men",
    author: "John Steinbeck",
    borrowedDate: "2024-11-29",
    dueDate: "2024-12-13",
    status: "on-loan",
  },
  {
    id: "br12",
    student: "Layla Hassan",
    yearGroup: "Year 11",
    book: "The Crucible",
    author: "Arthur Miller",
    borrowedDate: "2024-11-12",
    dueDate: "2024-11-26",
    status: "overdue",
    daysOverdue: 8,
  },
];

const MEMBERS: LibraryMember[] = [
  {
    id: "lm01",
    name: "Aisha Patel",
    type: "Student",
    yearGroup: "Year 7",
    booksOut: 1,
    joinedDate: "2024-09-03",
    status: "active",
  },
  {
    id: "lm02",
    name: "Ben Thompson",
    type: "Student",
    yearGroup: "Year 7",
    booksOut: 1,
    joinedDate: "2024-09-03",
    status: "active",
  },
  {
    id: "lm03",
    name: "Callum Harris",
    type: "Student",
    yearGroup: "Year 7",
    booksOut: 1,
    joinedDate: "2024-09-03",
    status: "suspended",
  },
  {
    id: "lm04",
    name: "Mr Ahmed",
    type: "Staff",
    yearGroup: "Staff",
    booksOut: 2,
    joinedDate: "2022-09-01",
    status: "active",
  },
  {
    id: "lm05",
    name: "Ms Clarke",
    type: "Staff",
    yearGroup: "Staff",
    booksOut: 0,
    joinedDate: "2021-09-01",
    status: "active",
  },
  {
    id: "lm06",
    name: "Fatima Al-Said",
    type: "Student",
    yearGroup: "Year 8",
    booksOut: 1,
    joinedDate: "2023-09-04",
    status: "active",
  },
  {
    id: "lm07",
    name: "Isaac Johnson",
    type: "Student",
    yearGroup: "Year 9",
    booksOut: 1,
    joinedDate: "2022-09-05",
    status: "suspended",
  },
];

// ─── Status configs ───────────────────────────────────────────────────────────

const BOOK_STATUS_STYLES: Record<BookStatus, string> = {
  available: "bg-green-100 text-green-700 border-green-200",
  borrowed: "bg-amber-100 text-amber-700 border-amber-200",
  reserved: "bg-blue-100 text-blue-700 border-blue-200",
  lost: "bg-red-100 text-red-700 border-red-200",
};

const BORROW_STATUS_STYLES: Record<BorrowStatus, string> = {
  "on-loan": "bg-blue-100 text-blue-700 border-blue-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
  returned: "bg-green-100 text-green-700 border-green-200",
};

// ─── Column definitions ───────────────────────────────────────────────────────

const catalogueColumns: ColumnDef<Book>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">{row.original.title}</span>
    ),
  },
  { accessorKey: "author", header: "Author" },
  { accessorKey: "isbn", header: "ISBN" },
  { accessorKey: "category", header: "Category" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex px-2 py-0.5 rounded-full border text-xs font-medium",
          BOOK_STATUS_STYLES[row.original.status],
        )}
      >
        {row.original.status.charAt(0).toUpperCase() +
          row.original.status.slice(1)}
      </span>
    ),
  },
  {
    id: "copies",
    header: "Copies",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.original.available}/{row.original.copies}
      </span>
    ),
  },
  { accessorKey: "location", header: "Location" },
];

const borrowedColumns: ColumnDef<BorrowedBook>[] = [
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.student}</span>
    ),
  },
  { accessorKey: "yearGroup", header: "Year" },
  { accessorKey: "book", header: "Book" },
  { accessorKey: "borrowedDate", header: "Borrowed" },
  { accessorKey: "dueDate", header: "Due Date" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex px-2 py-0.5 rounded-full border text-xs font-medium",
          BORROW_STATUS_STYLES[row.original.status],
        )}
      >
        {row.original.status === "on-loan"
          ? "On Loan"
          : row.original.status === "overdue"
            ? `Overdue (${row.original.daysOverdue}d)`
            : "Returned"}
      </span>
    ),
  },
];

const memberColumns: ColumnDef<LibraryMember>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "yearGroup", header: "Year / Dept" },
  { accessorKey: "booksOut", header: "Books Out" },
  { accessorKey: "joinedDate", header: "Joined" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex px-2 py-0.5 rounded-full border text-xs font-medium",
          row.original.status === "active"
            ? "bg-green-100 text-green-700 border-green-200"
            : "bg-red-100 text-red-700 border-red-200",
        )}
      >
        {row.original.status.charAt(0).toUpperCase() +
          row.original.status.slice(1)}
      </span>
    ),
  },
];

// ─── Check Out Dialog ─────────────────────────────────────────────────────────

interface CheckOutDialogProps {
  open: boolean;
  onClose: () => void;
}

function CheckOutDialog({ open, onClose }: CheckOutDialogProps) {
  const [form, setForm] = useState({ member: "", isbn: "", dueDate: "" });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Check Out Book</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Member</Label>
            <Select
              value={form.member}
              onValueChange={(v) => setForm((p) => ({ ...p, member: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {MEMBERS.filter((m) => m.status === "active").map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} ({m.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="isbn">ISBN or Title</Label>
            <Input
              id="isbn"
              placeholder="Scan barcode or enter ISBN"
              value={form.isbn}
              onChange={(e) => setForm((p) => ({ ...p, isbn: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="due">Due Date</Label>
            <Input
              id="due"
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, dueDate: e.target.value }))
              }
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onClose} className="flex-1">
              Check Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LibraryPage() {
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  const overdue = BORROWED_BOOKS.filter((b) => b.status === "overdue");
  const returnsToday = BORROWED_BOOKS.filter(
    (b) => b.dueDate === "2024-12-03",
  ).length;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Library"
        subtitle="Catalogue, borrowing and member management"
        icon={BookOpen}
        iconColor="bg-teal-600"
        actions={[
          {
            label: "Check Out Book",
            icon: Plus,
            onClick: () => setCheckOutOpen(true),
          },
        ]}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Books"
            value="2,840"
            subtitle="Across all categories"
            icon={BookOpen}
            variant="default"
          />
          <StatCard
            title="Currently Borrowed"
            value={BORROWED_BOOKS.filter((b) => b.status === "on-loan").length}
            subtitle="Active loans"
            icon={ArrowDownLeft}
            variant="info"
          />
          <StatCard
            title="Overdue"
            value={overdue.length}
            subtitle="Books past due date"
            icon={AlertCircle}
            variant="danger"
          />
          <StatCard
            title="Returns Today"
            value={returnsToday || 8}
            subtitle="Due back today"
            icon={ArrowDownLeft}
            variant="warning"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="catalogue">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="catalogue">Catalogue</TabsTrigger>
            <TabsTrigger value="borrowed">Borrowed</TabsTrigger>
            <TabsTrigger value="overdue">
              Overdue
              {overdue.length > 0 && (
                <Badge className="ml-1.5 text-[10px] bg-red-100 text-red-700">
                  {overdue.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          {/* ── Catalogue tab ── */}
          <TabsContent value="catalogue" className="mt-4">
            <DataTable
              columns={catalogueColumns}
              data={BOOKS}
              searchPlaceholder="Search by title, author, ISBN..."
              emptyMessage="No books found"
              toolbar={
                <Button size="sm" onClick={() => setCheckOutOpen(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Check Out
                </Button>
              }
            />
          </TabsContent>

          {/* ── Borrowed tab ── */}
          <TabsContent value="borrowed" className="mt-4">
            <DataTable
              columns={borrowedColumns}
              data={BORROWED_BOOKS}
              searchPlaceholder="Search borrowed books..."
              emptyMessage="No books currently on loan"
              rowClassName={(row) =>
                row.status === "overdue" ? "bg-red-50/50" : ""
              }
            />
          </TabsContent>

          {/* ── Overdue tab ── */}
          <TabsContent value="overdue" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {overdue.length} books are overdue. Please contact the borrowers
                to arrange return.
              </div>
              <DataTable
                columns={borrowedColumns}
                data={overdue}
                searchPlaceholder="Search overdue books..."
                emptyMessage="No overdue books"
              />
            </div>
          </TabsContent>

          {/* ── Members tab ── */}
          <TabsContent value="members" className="mt-4">
            <DataTable
              columns={memberColumns}
              data={MEMBERS}
              searchPlaceholder="Search members..."
              emptyMessage="No members found"
            />
          </TabsContent>
        </Tabs>
      </div>

      <CheckOutDialog
        open={checkOutOpen}
        onClose={() => setCheckOutOpen(false)}
      />
    </div>
  );
}
