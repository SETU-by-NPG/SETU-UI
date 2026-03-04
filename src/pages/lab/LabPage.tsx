import { useState } from 'react';
import { FlaskConical, Plus, Calendar, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type LabName = 'Biology Lab' | 'Chemistry Lab' | 'Physics Lab';
type EquipmentCondition = 'good' | 'fair' | 'poor' | 'out-of-service';

interface LabBooking {
  id: string;
  lab: LabName;
  date: string;
  period: number;
  periodTime: string;
  teacher: string;
  className: string;
  subject: string;
  equipment: string;
  preparation: string;
}

interface Equipment {
  id: string;
  name: string;
  lab: LabName;
  quantity: number;
  condition: EquipmentCondition;
  lastChecked: string;
  notes: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const LAB_BOOKINGS: LabBooking[] = [
  { id: 'lb01', lab: 'Biology Lab', date: '2024-12-03', period: 2, periodTime: '9:45–10:45', teacher: 'Dr Patel', className: '9A', subject: 'Science', equipment: 'Microscopes x15, Slides, Staining kit', preparation: 'Cell structure practical' },
  { id: 'lb02', lab: 'Chemistry Lab', date: '2024-12-03', period: 4, periodTime: '12:05–13:05', teacher: 'Mrs Lewis', className: '10A', subject: 'Chemistry', equipment: 'Titration apparatus, Burettes, Conical flasks', preparation: 'Acid-base titration' },
  { id: 'lb03', lab: 'Physics Lab', date: '2024-12-03', period: 5, periodTime: '13:50–14:50', teacher: 'Mr Evans', className: '11A', subject: 'Physics', equipment: 'Power packs, Ammeters, Connecting wires', preparation: 'Ohm\'s Law experiment' },
  { id: 'lb04', lab: 'Biology Lab', date: '2024-12-04', period: 1, periodTime: '8:45–9:45', teacher: 'Dr Patel', className: '8B', subject: 'Science', equipment: 'Microscopes x12, Prepared slides', preparation: 'Plant cell observation' },
  { id: 'lb05', lab: 'Chemistry Lab', date: '2024-12-04', period: 3, periodTime: '11:05–12:05', teacher: 'Mrs Lewis', className: '9B', subject: 'Chemistry', equipment: 'Test tubes, Bunsen burners, Safety goggles', preparation: 'Metal reactivity series' },
  { id: 'lb06', lab: 'Physics Lab', date: '2024-12-04', period: 6, periodTime: '14:50–15:50', teacher: 'Mr Evans', className: '10B', subject: 'Physics', equipment: 'Ray boxes, Lenses, Prisms', preparation: 'Refraction investigation' },
  { id: 'lb07', lab: 'Biology Lab', date: '2024-12-05', period: 2, periodTime: '9:45–10:45', teacher: 'Dr Patel', className: '7A', subject: 'Science', equipment: 'Forceps, Dissection trays, Hand lenses', preparation: 'Flower dissection' },
  { id: 'lb08', lab: 'Chemistry Lab', date: '2024-12-05', period: 5, periodTime: '13:50–14:50', teacher: 'Mrs Lewis', className: '11A', subject: 'Chemistry', equipment: 'Electrochemical cells, Electrodes', preparation: 'Electrolysis experiment' },
  { id: 'lb09', lab: 'Physics Lab', date: '2024-12-06', period: 1, periodTime: '8:45–9:45', teacher: 'Mr Evans', className: '9A', subject: 'Physics', equipment: 'Oscilloscope, Signal generator, Leads', preparation: 'Wave properties' },
];

const EQUIPMENT_LIST: Equipment[] = [
  { id: 'eq01', name: 'Compound Microscope', lab: 'Biology Lab', quantity: 16, condition: 'good', lastChecked: '2024-11-01', notes: '' },
  { id: 'eq02', name: 'Dissection Kit (set)', lab: 'Biology Lab', quantity: 10, condition: 'fair', lastChecked: '2024-10-15', notes: '3 sets missing scalpels' },
  { id: 'eq03', name: 'Prepared Slide Set', lab: 'Biology Lab', quantity: 8, condition: 'good', lastChecked: '2024-11-10', notes: '' },
  { id: 'eq04', name: 'Bunsen Burner', lab: 'Chemistry Lab', quantity: 20, condition: 'good', lastChecked: '2024-11-05', notes: '' },
  { id: 'eq05', name: 'Fume Cupboard', lab: 'Chemistry Lab', quantity: 2, condition: 'good', lastChecked: '2024-11-01', notes: 'Last serviced Oct 2024' },
  { id: 'eq06', name: 'Titration Burette', lab: 'Chemistry Lab', quantity: 30, condition: 'fair', lastChecked: '2024-10-20', notes: '4 have minor chips at tips' },
  { id: 'eq07', name: 'Safety Goggle', lab: 'Chemistry Lab', quantity: 35, condition: 'good', lastChecked: '2024-11-12', notes: '' },
  { id: 'eq08', name: 'Conical Flask 250ml', lab: 'Chemistry Lab', quantity: 40, condition: 'good', lastChecked: '2024-11-08', notes: '' },
  { id: 'eq09', name: 'Power Supply (DC)', lab: 'Physics Lab', quantity: 14, condition: 'good', lastChecked: '2024-11-03', notes: '' },
  { id: 'eq10', name: 'Ammeter (digital)', lab: 'Physics Lab', quantity: 12, condition: 'fair', lastChecked: '2024-10-28', notes: '2 units showing drift' },
  { id: 'eq11', name: 'Oscilloscope', lab: 'Physics Lab', quantity: 4, condition: 'poor', lastChecked: '2024-09-15', notes: 'Calibration required urgently' },
  { id: 'eq12', name: 'Optical Bench', lab: 'Physics Lab', quantity: 8, condition: 'good', lastChecked: '2024-11-01', notes: '' },
  { id: 'eq13', name: 'Geiger Counter', lab: 'Physics Lab', quantity: 2, condition: 'out-of-service', lastChecked: '2024-08-01', notes: 'Sent for repair — estimated return Jan 2025' },
  { id: 'eq14', name: 'Balance Scale (0.01g)', lab: 'Chemistry Lab', quantity: 6, condition: 'good', lastChecked: '2024-11-10', notes: '' },
  { id: 'eq15', name: 'Centrifuge', lab: 'Biology Lab', quantity: 2, condition: 'fair', lastChecked: '2024-10-05', notes: 'Vibrates at high speed' },
];

const LAB_COLORS: Record<LabName, string> = {
  'Biology Lab': 'bg-green-100 text-green-700 border-green-200',
  'Chemistry Lab': 'bg-orange-100 text-orange-700 border-orange-200',
  'Physics Lab': 'bg-blue-100 text-blue-700 border-blue-200',
};

const CONDITION_CONFIG: Record<EquipmentCondition, { icon: React.ElementType; color: string; label: string }> = {
  good: { icon: CheckCircle2, color: 'text-green-600', label: 'Good' },
  fair: { icon: AlertTriangle, color: 'text-amber-500', label: 'Fair' },
  poor: { icon: AlertTriangle, color: 'text-orange-600', label: 'Poor' },
  'out-of-service': { icon: XCircle, color: 'text-red-600', label: 'Out of Service' },
};

// ─── Column definitions ───────────────────────────────────────────────────────

const bookingColumns: ColumnDef<LabBooking>[] = [
  {
    accessorKey: 'lab',
    header: 'Lab',
    cell: ({ row }) => (
      <span className={cn('inline-flex px-2 py-0.5 rounded border text-xs font-medium', LAB_COLORS[row.original.lab])}>
        {row.original.lab}
      </span>
    ),
  },
  { accessorKey: 'date', header: 'Date' },
  {
    accessorKey: 'period',
    header: 'Period',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">P{row.original.period}</div>
        <div className="text-xs text-gray-400">{row.original.periodTime}</div>
      </div>
    ),
  },
  { accessorKey: 'teacher', header: 'Teacher' },
  { accessorKey: 'className', header: 'Class' },
  { accessorKey: 'subject', header: 'Subject' },
  {
    accessorKey: 'equipment',
    header: 'Equipment',
    cell: ({ row }) => (
      <span className="text-xs text-gray-600 max-w-[200px] truncate inline-block" title={row.original.equipment}>
        {row.original.equipment}
      </span>
    ),
  },
  {
    accessorKey: 'preparation',
    header: 'Preparation',
    cell: ({ row }) => (
      <span className="text-xs text-gray-500">{row.original.preparation}</span>
    ),
  },
];

const equipmentColumns: ColumnDef<Equipment>[] = [
  { accessorKey: 'name', header: 'Equipment', cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.name}</span> },
  {
    accessorKey: 'lab',
    header: 'Lab',
    cell: ({ row }) => (
      <span className={cn('inline-flex px-2 py-0.5 rounded border text-xs font-medium', LAB_COLORS[row.original.lab])}>
        {row.original.lab}
      </span>
    ),
  },
  { accessorKey: 'quantity', header: 'Qty' },
  {
    accessorKey: 'condition',
    header: 'Condition',
    cell: ({ row }) => {
      const cfg = CONDITION_CONFIG[row.original.condition];
      const Icon = cfg.icon;
      return (
        <div className={cn('flex items-center gap-1 text-xs font-medium', cfg.color)}>
          <Icon className="h-3.5 w-3.5" />
          {cfg.label}
        </div>
      );
    },
  },
  { accessorKey: 'lastChecked', header: 'Last Checked' },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row }) => (
      <span className="text-xs text-gray-500">{row.original.notes || '—'}</span>
    ),
  },
];

// ─── Book Lab Dialog ───────────────────────────────────────────────────────────

interface BookLabDialogProps {
  open: boolean;
  onClose: () => void;
}

function BookLabDialog({ open, onClose }: BookLabDialogProps) {
  const [form, setForm] = useState({ lab: '', date: '', period: '', className: '', equipment: '', notes: '' });
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Science Lab</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Lab</Label>
              <Select value={form.lab} onValueChange={(v) => update('lab', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lab" />
                </SelectTrigger>
                <SelectContent>
                  {(['Biology Lab', 'Chemistry Lab', 'Physics Lab'] as LabName[]).map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Period</Label>
              <Select value={form.period} onValueChange={(v) => update('period', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((p) => (
                    <SelectItem key={p} value={String(p)}>Period {p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Class</Label>
              <Select value={form.className} onValueChange={(v) => update('className', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  {['7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B'].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Equipment Required</Label>
            <Input
              placeholder="e.g. Microscopes x15, Slides"
              value={form.equipment}
              onChange={(e) => update('equipment', e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Preparation Notes</Label>
            <Textarea
              rows={3}
              placeholder="Instructions for the technician..."
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={onClose} className="flex-1">Book Lab</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Weekly calendar grid ─────────────────────────────────────────────────────

const CALENDAR_DAYS = ['Monday 2 Dec', 'Tuesday 3 Dec', 'Wednesday 4 Dec', 'Thursday 5 Dec', 'Friday 6 Dec'];
const CALENDAR_PERIODS = [1, 2, 3, 4, 5, 6];

function CalendarGrid() {
  function getBooking(dayLabel: string, period: number): LabBooking | undefined {
    const dateMap: Record<string, string> = {
      'Monday 2 Dec': '2024-12-02',
      'Tuesday 3 Dec': '2024-12-03',
      'Wednesday 4 Dec': '2024-12-04',
      'Thursday 5 Dec': '2024-12-05',
      'Friday 6 Dec': '2024-12-06',
    };
    return LAB_BOOKINGS.find((b) => b.date === dateMap[dayLabel] && b.period === period);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase w-16 border-r border-gray-200">Period</th>
            {CALENDAR_DAYS.map((d) => (
              <th key={d} className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase border-r border-gray-200 last:border-r-0">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CALENDAR_PERIODS.map((period) => (
            <tr key={period} className="border-b border-gray-100 last:border-0">
              <td className="px-3 py-2 text-xs font-semibold text-gray-500 border-r border-gray-200">P{period}</td>
              {CALENDAR_DAYS.map((day) => {
                const booking = getBooking(day, period);
                return (
                  <td key={day} className="px-2 py-1.5 border-r border-gray-100 last:border-r-0 min-w-[130px] align-top">
                    {booking ? (
                      <div className={cn('rounded border px-2 py-1.5 text-xs', LAB_COLORS[booking.lab])}>
                        <div className="font-semibold truncate">{booking.lab.replace(' Lab', '')}</div>
                        <div className="mt-0.5 opacity-80">{booking.teacher} · {booking.className}</div>
                      </div>
                    ) : (
                      <div className="h-10 rounded border border-dashed border-gray-200" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LabPage() {
  const [bookOpen, setBookOpen] = useState(false);

  const goodCount = EQUIPMENT_LIST.filter((e) => e.condition === 'good').length;
  const fairCount = EQUIPMENT_LIST.filter((e) => e.condition === 'fair').length;
  const poorCount = EQUIPMENT_LIST.filter((e) => e.condition === 'poor' || e.condition === 'out-of-service').length;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Science Labs"
        subtitle="Lab bookings, equipment tracker and room availability"
        icon={FlaskConical}
        iconColor="bg-green-600"
        actions={[
          { label: 'Book Lab', icon: Plus, onClick: () => setBookOpen(true) },
        ]}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Lab status cards */}
        <div className="grid grid-cols-3 gap-4">
          {(['Biology Lab', 'Chemistry Lab', 'Physics Lab'] as LabName[]).map((lab) => {
            const bookingsToday = LAB_BOOKINGS.filter((b) => b.date === '2024-12-03' && b.lab === lab).length;
            return (
              <Card key={lab} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">{lab}</h4>
                  <span className={cn('inline-flex px-2 py-0.5 rounded border text-xs font-medium', LAB_COLORS[lab])}>
                    {bookingsToday} today
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {LAB_BOOKINGS.filter((b) => b.lab === lab).length} bookings this week
                </p>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="calendar">
          <TabsList className="grid grid-cols-3 w-full max-w-sm">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
          </TabsList>

          {/* ── Calendar tab ── */}
          <TabsContent value="calendar" className="mt-4">
            <Card className="p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500" />
                Week of 2–6 December 2024
              </h3>
              <CalendarGrid />
            </Card>
          </TabsContent>

          {/* ── Bookings tab ── */}
          <TabsContent value="bookings" className="mt-4">
            <DataTable
              columns={bookingColumns}
              data={LAB_BOOKINGS}
              searchPlaceholder="Search lab bookings..."
              emptyMessage="No lab bookings found"
              toolbar={
                <Button size="sm" onClick={() => setBookOpen(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Book Lab
                </Button>
              }
            />
          </TabsContent>

          {/* ── Equipment tab ── */}
          <TabsContent value="equipment" className="mt-4">
            <div className="space-y-4">
              {/* Equipment summary */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-lg font-bold">{goodCount}</span>
                  </div>
                  <p className="text-xs text-gray-500">Good condition</p>
                </Card>
                <Card className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-lg font-bold">{fairCount}</span>
                  </div>
                  <p className="text-xs text-gray-500">Fair condition</p>
                </Card>
                <Card className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                    <XCircle className="h-4 w-4" />
                    <span className="text-lg font-bold">{poorCount}</span>
                  </div>
                  <p className="text-xs text-gray-500">Needs attention</p>
                </Card>
              </div>

              <DataTable
                columns={equipmentColumns}
                data={EQUIPMENT_LIST}
                searchPlaceholder="Search equipment..."
                emptyMessage="No equipment found"
                rowClassName={(row) => row.condition === 'out-of-service' ? 'bg-red-50' : row.condition === 'poor' ? 'bg-orange-50' : ''}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BookLabDialog open={bookOpen} onClose={() => setBookOpen(false)} />
    </div>
  );
}
