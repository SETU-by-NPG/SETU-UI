import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  PoundSterling,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Plus,
  FileText,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { BudgetAreaChart } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type InvoiceStatus = "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

interface Invoice {
  id: string;
  invoiceNo: string;
  party: string;
  type: "SUPPLIER" | "FEES" | "OTHER";
  amount: number;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
}

interface Payment {
  id: string;
  ref: string;
  payer: string;
  category: string;
  amount: number;
  date: string;
  method: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  budget: number;
  actual: number;
  variance: number;
}

const INVOICE_STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-600" },
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  PAID: { label: "Paid", className: "bg-green-100 text-green-700" },
  OVERDUE: { label: "Overdue", className: "bg-red-100 text-red-700" },
  CANCELLED: { label: "Cancelled", className: "bg-gray-100 text-gray-400" },
};

const MONTHLY_DATA = [
  { month: "Sep", income: 210000, expenditure: 185000 },
  { month: "Oct", income: 205000, expenditure: 192000 },
  { month: "Nov", income: 198000, expenditure: 178000 },
  { month: "Dec", income: 175000, expenditure: 160000 },
  { month: "Jan", income: 202000, expenditure: 195000 },
  { month: "Feb", income: 210000, expenditure: 188000 },
  { month: "Mar", income: 208000, expenditure: 191000 },
  { month: "Apr", income: 195000, expenditure: 174000 },
  { month: "May", income: 201000, expenditure: 183000 },
  { month: "Jun", income: 196000, expenditure: 176000 },
  { month: "Jul", income: 198000, expenditure: 181000 },
  { month: "Aug", income: 202000, expenditure: 197000 },
];

const PIE_COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

const SPEND_CATEGORIES = [
  { name: "Staff Salaries", value: 1480000 },
  { name: "Premises", value: 210000 },
  { name: "Learning Resources", value: 145000 },
  { name: "IT & Technology", value: 118000 },
  { name: "Other", value: 147000 },
];

const MOCK_INVOICES: Invoice[] = [
  {
    id: "1",
    invoiceNo: "INV-2025-001",
    party: "ABC Cleaning Services",
    type: "SUPPLIER",
    amount: 3200,
    date: "2025-01-05",
    dueDate: "2025-02-05",
    status: "PAID",
  },
  {
    id: "2",
    invoiceNo: "INV-2025-002",
    party: "Oliver Patel (Fees)",
    type: "FEES",
    amount: 4500,
    date: "2025-01-08",
    dueDate: "2025-01-31",
    status: "OVERDUE",
  },
  {
    id: "3",
    invoiceNo: "INV-2025-003",
    party: "Pearson Education",
    type: "SUPPLIER",
    amount: 8750,
    date: "2025-01-10",
    dueDate: "2025-02-28",
    status: "PENDING",
  },
  {
    id: "4",
    invoiceNo: "INV-2025-004",
    party: "Emily Carter (Fees)",
    type: "FEES",
    amount: 4500,
    date: "2025-01-12",
    dueDate: "2025-01-31",
    status: "PAID",
  },
  {
    id: "5",
    invoiceNo: "INV-2025-005",
    party: "BT Business",
    type: "SUPPLIER",
    amount: 1100,
    date: "2025-01-15",
    dueDate: "2025-02-15",
    status: "PAID",
  },
  {
    id: "6",
    invoiceNo: "INV-2025-006",
    party: "Noah Williams (Fees)",
    type: "FEES",
    amount: 4500,
    date: "2025-01-15",
    dueDate: "2025-01-31",
    status: "OVERDUE",
  },
  {
    id: "7",
    invoiceNo: "INV-2025-007",
    party: "Catering Co. Ltd",
    type: "SUPPLIER",
    amount: 5600,
    date: "2025-01-18",
    dueDate: "2025-02-18",
    status: "PENDING",
  },
  {
    id: "8",
    invoiceNo: "INV-2025-008",
    party: "IT Support Ltd",
    type: "SUPPLIER",
    amount: 2400,
    date: "2025-01-20",
    dueDate: "2025-02-20",
    status: "DRAFT",
  },
  {
    id: "9",
    invoiceNo: "INV-2025-009",
    party: "Sophia Chen (Fees)",
    type: "FEES",
    amount: 4500,
    date: "2025-01-22",
    dueDate: "2025-02-28",
    status: "PAID",
  },
  {
    id: "10",
    invoiceNo: "INV-2025-010",
    party: "Grounds Maintenance Ltd",
    type: "SUPPLIER",
    amount: 1750,
    date: "2025-01-25",
    dueDate: "2025-02-25",
    status: "CANCELLED",
  },
];

const MOCK_PAYMENTS: Payment[] = [
  {
    id: "1",
    ref: "PAY-001",
    payer: "Sarah Carter",
    category: "Tuition Fees",
    amount: 4500,
    date: "2025-01-10",
    method: "Bank Transfer",
  },
  {
    id: "2",
    ref: "PAY-002",
    payer: "Mark Williams",
    category: "School Fund",
    amount: 150,
    date: "2025-01-11",
    method: "Online",
  },
  {
    id: "3",
    ref: "PAY-003",
    payer: "Li Chen",
    category: "Tuition Fees",
    amount: 4500,
    date: "2025-01-12",
    method: "Direct Debit",
  },
  {
    id: "4",
    ref: "PAY-004",
    payer: "Helen Miller",
    category: "School Trip",
    amount: 85,
    date: "2025-01-14",
    method: "Online",
  },
  {
    id: "5",
    ref: "PAY-005",
    payer: "David Brown",
    category: "Tuition Fees",
    amount: 9000,
    date: "2025-01-15",
    method: "Bank Transfer",
  },
  {
    id: "6",
    ref: "PAY-006",
    payer: "Priya Singh",
    category: "Uniform",
    amount: 210,
    date: "2025-01-16",
    method: "Card",
  },
  {
    id: "7",
    ref: "PAY-007",
    payer: "Raj Patel",
    category: "Tuition Fees",
    amount: 4500,
    date: "2025-01-18",
    method: "Direct Debit",
  },
  {
    id: "8",
    ref: "PAY-008",
    payer: "Claire Davies",
    category: "School Fund",
    amount: 150,
    date: "2025-01-20",
    method: "Online",
  },
];

const MOCK_BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: "1",
    name: "Staff Salaries",
    budget: 1500000,
    actual: 1480000,
    variance: 20000,
  },
  {
    id: "2",
    name: "Premises & Facilities",
    budget: 220000,
    actual: 210000,
    variance: 10000,
  },
  {
    id: "3",
    name: "Learning Resources",
    budget: 130000,
    actual: 145000,
    variance: -15000,
  },
  {
    id: "4",
    name: "IT & Technology",
    budget: 110000,
    actual: 118000,
    variance: -8000,
  },
  {
    id: "5",
    name: "Travel & Trips",
    budget: 45000,
    actual: 38000,
    variance: 7000,
  },
  {
    id: "6",
    name: "Marketing & Admissions",
    budget: 25000,
    actual: 22000,
    variance: 3000,
  },
  {
    id: "7",
    name: "Professional Development",
    budget: 30000,
    actual: 27000,
    variance: 3000,
  },
  { id: "8", name: "Catering", budget: 80000, actual: 84000, variance: -4000 },
];

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const config = INVOICE_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNewInvoiceDialog, setShowNewInvoiceDialog] = useState(false);

  const invoiceColumns: ColumnDef<Invoice>[] = [
    { accessorKey: "invoiceNo", header: "Invoice #", size: 130 },
    { accessorKey: "party", header: "Supplier / Student" },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="text-xs text-gray-500 capitalize">
          {row.original.type.toLowerCase()}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-medium">
          {formatCurrency(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.date).toLocaleDateString("en-GB"),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) =>
        new Date(row.original.dueDate).toLocaleDateString("en-GB"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <InvoiceStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
          <Eye className="h-3.5 w-3.5 mr-1" /> View
        </Button>
      ),
    },
  ];

  const paymentColumns: ColumnDef<Payment>[] = [
    { accessorKey: "ref", header: "Ref", size: 100 },
    { accessorKey: "payer", header: "Payer" },
    { accessorKey: "category", header: "Category" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-medium text-green-700">
          {formatCurrency(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.date).toLocaleDateString("en-GB"),
    },
    { accessorKey: "method", header: "Method" },
  ];

  const budgetColumns: ColumnDef<BudgetCategory>[] = [
    { accessorKey: "name", header: "Category" },
    {
      accessorKey: "budget",
      header: "Budget",
      cell: ({ row }) => formatCurrency(row.original.budget),
    },
    {
      accessorKey: "actual",
      header: "Actual",
      cell: ({ row }) => formatCurrency(row.original.actual),
    },
    {
      accessorKey: "variance",
      header: "Variance",
      cell: ({ row }) => (
        <span
          className={
            row.original.variance >= 0
              ? "text-green-600 font-medium"
              : "text-red-600 font-medium"
          }
        >
          {row.original.variance >= 0 ? "+" : ""}
          {formatCurrency(row.original.variance)}
        </span>
      ),
    },
    {
      id: "progress",
      header: "Spent",
      cell: ({ row }) => {
        const pct = Math.min(
          Math.round((row.original.actual / row.original.budget) * 100),
          100,
        );
        return (
          <div className="flex items-center gap-2 min-w-[120px]">
            <Progress value={pct} className="h-1.5 flex-1" />
            <span
              className={cn(
                "text-xs font-medium w-8 text-right",
                pct > 100 ? "text-red-600" : "text-gray-600",
              )}
            >
              {pct}%
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Finance"
        subtitle="Income, expenditure, invoices and budget management"
        icon={PoundSterling}
        iconColor="bg-green-600"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Income YTD"
            value="£2.4M"
            icon={TrendingUp}
            variant="success"
            subtitle="Academic year to date"
            trend={{ value: 3.2, label: "vs last year", direction: "up" }}
          />
          <StatCard
            title="Total Expenditure"
            value="£2.1M"
            icon={TrendingDown}
            variant="warning"
            subtitle="Academic year to date"
            trend={{ value: 1.8, label: "vs last year", direction: "up" }}
          />
          <StatCard
            title="Budget Remaining"
            value="£300K"
            icon={PoundSterling}
            variant="info"
            subtitle="Across all categories"
          />
          <StatCard
            title="Overdue Invoices"
            value={7}
            icon={AlertCircle}
            variant="danger"
            subtitle="Require attention"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="budget">Budget Categories</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-4 space-y-6">
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Income vs Expenditure (12 Months)
              </h3>
              <BudgetAreaChart data={MONTHLY_DATA} height={260} />
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Top 5 Spending Categories
              </h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={220}>
                  <PieChart>
                    <Pie
                      data={SPEND_CATEGORIES}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                    >
                      {SPEND_CATEGORIES.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => formatCurrency(v)}
                      contentStyle={{ borderRadius: "8px", fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {SPEND_CATEGORIES.map((cat, i) => (
                    <div key={cat.name} className="flex items-center gap-3">
                      <div
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: PIE_COLORS[i] }}
                      />
                      <span className="text-sm text-gray-600 flex-1">
                        {cat.name}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(cat.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="mt-4">
            <DataTable
              columns={invoiceColumns}
              data={MOCK_INVOICES}
              searchPlaceholder="Search invoices..."
              toolbar={
                <Button size="sm" onClick={() => setShowNewInvoiceDialog(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  New Invoice
                </Button>
              }
              emptyMessage="No invoices found"
            />
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <DataTable
              columns={paymentColumns}
              data={MOCK_PAYMENTS}
              searchPlaceholder="Search payments..."
              emptyMessage="No payments found"
            />
          </TabsContent>

          <TabsContent value="budget" className="mt-4 space-y-6">
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Budget vs Actual (12 Months)
              </h3>
              <BudgetAreaChart data={MONTHLY_DATA} height={220} />
            </Card>
            <DataTable
              columns={budgetColumns}
              data={MOCK_BUDGET_CATEGORIES}
              searchPlaceholder="Search categories..."
              showSearch={false}
              emptyMessage="No budget categories found"
            />
          </TabsContent>

          <TabsContent value="reports" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Annual Budget Report",
                  desc: "Full year income and expenditure summary",
                  icon: FileText,
                },
                {
                  title: "Invoice Aging Report",
                  desc: "Outstanding invoices by age band",
                  icon: FileText,
                },
                {
                  title: "Category Spend Analysis",
                  desc: "Breakdown of spending by category",
                  icon: FileText,
                },
                {
                  title: "Cash Flow Forecast",
                  desc: "3-month cash flow projection",
                  icon: FileText,
                },
                {
                  title: "Year-on-Year Comparison",
                  desc: "This year vs previous academic year",
                  icon: FileText,
                },
                {
                  title: "Payroll Summary Report",
                  desc: "Staff salary and payroll overview",
                  icon: FileText,
                },
              ].map((r) => (
                <Card
                  key={r.title}
                  className="p-4 flex items-start gap-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => toast.info(`Generating ${r.title}...`)}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
                    <r.icon className="h-4.5 w-4.5 text-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {r.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Invoice Dialog */}
      <Dialog
        open={showNewInvoiceDialog}
        onOpenChange={setShowNewInvoiceDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Invoice Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPPLIER">Supplier</SelectItem>
                  <SelectItem value="FEES">Student Fees</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Supplier / Student Name</Label>
              <Input placeholder="Enter name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Amount (£)</Label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-1.5">
                <Label>Invoice Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Due Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input placeholder="Brief description" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewInvoiceDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowNewInvoiceDialog(false);
                toast.success("Invoice created");
              }}
            >
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
