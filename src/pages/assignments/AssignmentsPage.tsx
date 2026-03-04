import { useState } from 'react';
import { ClipboardList, Plus, Paperclip } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

// ─── Types ────────────────────────────────────────────────────────────────────

type AssignmentStatus = 'active' | 'upcoming' | 'past';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  className: string;
  setDate: string;
  dueDate: string;
  maxMarks: number;
  submitted: number;
  total: number;
  status: AssignmentStatus;
  teacher: string;
  description: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const ASSIGNMENTS: Assignment[] = [
  { id: 'a01', title: 'Algebra Problem Set 3', subject: 'Mathematics', className: '7A', setDate: '2024-11-10', dueDate: '2024-11-24', maxMarks: 50, submitted: 22, total: 30, status: 'active', teacher: 'Mr Ahmed', description: 'Complete exercises 3.1 to 3.8 from the textbook. Show all working.' },
  { id: 'a02', title: 'The Great Gatsby Essay', subject: 'English', className: '10A', setDate: '2024-11-08', dueDate: '2024-11-22', maxMarks: 100, submitted: 28, total: 31, status: 'active', teacher: 'Ms Clarke', description: 'Write a 1200-word analytical essay on symbolism in The Great Gatsby.' },
  { id: 'a03', title: 'Cell Biology Diagram', subject: 'Science', className: '8B', setDate: '2024-11-12', dueDate: '2024-11-19', maxMarks: 30, submitted: 18, total: 32, status: 'active', teacher: 'Dr Patel', description: 'Label the organelles of a eukaryotic cell and describe the function of each.' },
  { id: 'a04', title: 'WW1 Source Analysis', subject: 'History', className: '9A', setDate: '2024-11-11', dueDate: '2024-11-25', maxMarks: 40, submitted: 14, total: 28, status: 'active', teacher: 'Mr Brown', description: 'Analyse the three primary sources provided and answer the structured questions.' },
  { id: 'a05', title: 'French Translation Exercise', subject: 'French', className: '7A', setDate: '2024-11-13', dueDate: '2024-11-20', maxMarks: 25, submitted: 25, total: 30, status: 'active', teacher: 'Mme Dupont', description: 'Translate the passage from English to French. Focus on accurate verb conjugation.' },
  { id: 'a06', title: 'Quadratic Equations Test Prep', subject: 'Mathematics', className: '11A', setDate: '2024-11-15', dueDate: '2024-12-01', maxMarks: 60, submitted: 5, total: 30, status: 'upcoming', teacher: 'Mr Ahmed', description: 'Practice solving quadratic equations using all three methods.' },
  { id: 'a07', title: 'Macbeth Act 3 Analysis', subject: 'English', className: '9A', setDate: '2024-11-17', dueDate: '2024-12-03', maxMarks: 80, submitted: 0, total: 28, status: 'upcoming', teacher: 'Ms Clarke', description: 'Analyse the themes of ambition and guilt in Act 3 of Macbeth.' },
  { id: 'a08', title: 'Chemistry Lab Report', subject: 'Science', className: '10A', setDate: '2024-11-18', dueDate: '2024-12-05', maxMarks: 50, submitted: 0, total: 31, status: 'upcoming', teacher: 'Dr Patel', description: 'Write a formal report for the neutralisation experiment conducted in class.' },
  { id: 'a09', title: 'Geography Climate Map', subject: 'Geography', className: '8A', setDate: '2024-11-19', dueDate: '2024-12-06', maxMarks: 35, submitted: 0, total: 32, status: 'upcoming', teacher: 'Ms Green', description: 'Create an annotated climate map for a selected biome.' },
  { id: 'a10', title: 'Fractions Homework', subject: 'Mathematics', className: '7C', setDate: '2024-10-28', dueDate: '2024-11-04', maxMarks: 30, submitted: 28, total: 30, status: 'past', teacher: 'Mr Ahmed', description: 'Addition and subtraction of fractions exercises.' },
  { id: 'a11', title: 'Poetry Comparison', subject: 'English', className: '8B', setDate: '2024-10-25', dueDate: '2024-11-01', maxMarks: 60, submitted: 30, total: 32, status: 'past', teacher: 'Ms Clarke', description: 'Compare and contrast two of the poems from the anthology.' },
  { id: 'a12', title: 'Forces and Motion Lab', subject: 'Science', className: '9A', setDate: '2024-10-22', dueDate: '2024-10-29', maxMarks: 40, submitted: 27, total: 28, status: 'past', teacher: 'Dr Patel', description: 'Lab report on Newton\'s laws demonstration.' },
  { id: 'a13', title: 'Spanish Vocabulary Test', subject: 'Spanish', className: '7B', setDate: '2024-11-13', dueDate: '2024-11-20', maxMarks: 20, submitted: 29, total: 30, status: 'active', teacher: 'Mr Garcia', description: 'Learn vocabulary list 4 — family members and descriptions.' },
  { id: 'a14', title: 'Art Portfolio Submission', subject: 'Art', className: '10B', setDate: '2024-11-01', dueDate: '2024-11-30', maxMarks: 100, submitted: 8, total: 31, status: 'active', teacher: 'Ms Lee', description: 'Submit five finished pieces for your portfolio unit.' },
  { id: 'a15', title: 'Religious Studies Essay', subject: 'Religious Studies', className: '8C', setDate: '2024-10-15', dueDate: '2024-10-22', maxMarks: 50, submitted: 32, total: 32, status: 'past', teacher: 'Mrs White', description: 'Discuss the concept of justice in two world religions.' },
];

// Student-specific "my assignments" data
const STUDENT_ASSIGNMENTS: (Assignment & { myStatus: 'submitted' | 'pending' | 'overdue'; myGrade?: string })[] = [
  { ...ASSIGNMENTS[0], myStatus: 'pending' },
  { ...ASSIGNMENTS[1], myStatus: 'submitted', myGrade: 'A' },
  { ...ASSIGNMENTS[2], myStatus: 'pending' },
  { ...ASSIGNMENTS[5], myStatus: 'pending' },
  { ...ASSIGNMENTS[9], myStatus: 'submitted', myGrade: 'B' },
  { ...ASSIGNMENTS[10], myStatus: 'submitted', myGrade: 'A*' },
];

const SUBJECTS = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'French', 'Spanish', 'Art', 'Music', 'Drama', 'Religious Studies'];
const CLASSES = ['7A', '7B', '7C', '8A', '8B', '8C', '9A', '9B', '10A', '10B', '11A', '11B'];

// ─── Column definitions ───────────────────────────────────────────────────────

function makeColumns(onView?: (row: Assignment) => void): ColumnDef<Assignment>[] {
  return [
    { accessorKey: 'title', header: 'Title', cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.title}</span> },
    { accessorKey: 'subject', header: 'Subject' },
    { accessorKey: 'className', header: 'Class' },
    { accessorKey: 'setDate', header: 'Set Date' },
    { accessorKey: 'dueDate', header: 'Due Date' },
    {
      id: 'submissions',
      header: 'Submissions',
      cell: ({ row }) => {
        const pct = Math.round((row.original.submitted / row.original.total) * 100);
        return (
          <div className="flex items-center gap-2 min-w-[120px]">
            <Progress value={pct} className="h-1.5 w-16" />
            <span className="text-xs text-gray-500">{row.original.submitted}/{row.original.total}</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => onView?.(row.original)}>
          View
        </Button>
      ),
    },
  ];
}

// ─── Set Assignment Sheet ─────────────────────────────────────────────────────

interface SetAssignmentSheetProps {
  open: boolean;
  onClose: () => void;
}

function SetAssignmentSheet({ open, onClose }: SetAssignmentSheetProps) {
  const [form, setForm] = useState({
    title: '',
    subject: '',
    className: '',
    dueDate: '',
    description: '',
    maxMarks: '',
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Set New Assignment</SheetTitle>
          <SheetDescription>Fill in the details to create a new assignment for your class.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Assignment Title</Label>
            <Input
              id="title"
              placeholder="e.g. Algebra Problem Set 4"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Select value={form.subject} onValueChange={(v) => update('subject', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Class</Label>
              <Select value={form.className} onValueChange={(v) => update('className', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="maxMarks">Max Marks</Label>
              <Input id="maxMarks" type="number" placeholder="100" value={form.maxMarks} onChange={(e) => update('maxMarks', e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">Description / Instructions</Label>
            <Textarea
              id="desc"
              rows={4}
              placeholder="Describe what students need to do..."
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </div>
          <div>
            <Button variant="outline" size="sm" className="gap-1.5 text-gray-500" type="button">
              <Paperclip className="h-3.5 w-3.5" />
              Attach File (demo only)
            </Button>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={onClose} className="flex-1">Set Assignment</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Student view ─────────────────────────────────────────────────────────────

function StudentView() {
  const pending = STUDENT_ASSIGNMENTS.filter((a) => a.myStatus === 'pending');
  const submitted = STUDENT_ASSIGNMENTS.filter((a) => a.myStatus === 'submitted');

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">My Assignments</h3>
      {STUDENT_ASSIGNMENTS.map((a) => (
        <Card key={a.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 text-sm">{a.title}</span>
                <Badge
                  className={cn(
                    'text-[10px]',
                    a.myStatus === 'submitted' ? 'bg-green-100 text-green-700' :
                    a.myStatus === 'overdue' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700',
                  )}
                >
                  {a.myStatus === 'submitted' ? 'Submitted' : a.myStatus === 'overdue' ? 'Overdue' : 'Pending'}
                </Badge>
                {a.myGrade && (
                  <Badge className="text-[10px] bg-purple-100 text-purple-700">Grade: {a.myGrade}</Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">{a.subject} · {a.className} · Set by {a.teacher}</p>
              <p className="text-xs text-gray-400 mt-1">{a.description}</p>
            </div>
            <div className="text-right text-xs shrink-0">
              <p className="text-gray-500">Due</p>
              <p className={cn('font-semibold', a.myStatus === 'overdue' ? 'text-red-600' : 'text-gray-700')}>
                {a.dueDate}
              </p>
              {a.myStatus === 'pending' && (
                <Button size="sm" className="mt-2 h-7 text-xs">Submit</Button>
              )}
            </div>
          </div>
        </Card>
      ))}
      <div className="grid grid-cols-3 gap-4 pt-2">
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Pending</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{submitted.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Submitted</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-gray-700">0</p>
          <p className="text-xs text-gray-500 mt-0.5">Overdue</p>
        </Card>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AssignmentsPage() {
  const { role } = useAuthStore();
  const isStudent = role === 'STUDENT';

  const [sheetOpen, setSheetOpen] = useState(false);

  const active = ASSIGNMENTS.filter((a) => a.status === 'active');
  const upcoming = ASSIGNMENTS.filter((a) => a.status === 'upcoming');
  const past = ASSIGNMENTS.filter((a) => a.status === 'past');
  const submitted = ASSIGNMENTS.filter((a) => a.submitted > 0);

  const columns = makeColumns();

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Assignments"
        subtitle="Manage and track class assignments"
        icon={ClipboardList}
        iconColor="bg-orange-500"
        actions={
          !isStudent
            ? [{ label: 'Set Assignment', icon: Plus, onClick: () => setSheetOpen(true) }]
            : undefined
        }
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {isStudent ? (
          <StudentView />
        ) : (
          <Tabs defaultValue="active">
            <TabsList className="grid grid-cols-4 w-full max-w-lg">
              <TabsTrigger value="active">
                Active
                <Badge className="ml-1.5 text-[10px] bg-orange-100 text-orange-700">{active.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              <DataTable
                columns={columns}
                data={active}
                searchPlaceholder="Search active assignments..."
                emptyMessage="No active assignments"
                toolbar={
                  <Button size="sm" onClick={() => setSheetOpen(true)}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Set Assignment
                  </Button>
                }
              />
            </TabsContent>

            <TabsContent value="upcoming" className="mt-4">
              <DataTable
                columns={columns}
                data={upcoming}
                searchPlaceholder="Search upcoming assignments..."
                emptyMessage="No upcoming assignments"
              />
            </TabsContent>

            <TabsContent value="past" className="mt-4">
              <DataTable
                columns={columns}
                data={past}
                searchPlaceholder="Search past assignments..."
                emptyMessage="No past assignments"
              />
            </TabsContent>

            <TabsContent value="submitted" className="mt-4">
              <DataTable
                columns={columns}
                data={submitted}
                searchPlaceholder="Search submitted assignments..."
                emptyMessage="No submitted assignments"
              />
            </TabsContent>
          </Tabs>
        )}
      </div>

      <SetAssignmentSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  );
}
