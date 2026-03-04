import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Shield,
  DollarSign,
  UserCog,
  Calendar,
  FileText,
  Download,
  Clock,
  ChevronRight,
  Loader2,
  Table,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubReport {
  id: string;
  title: string;
  description: string;
  preview: PreviewData;
}

interface PreviewData {
  headers: string[];
  rows: string[][];
  summary?: string;
}

interface ReportCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  reports: SubReport[];
}

// ─── Mock Preview Data ────────────────────────────────────────────────────────

const REPORT_CATEGORIES: ReportCategory[] = [
  {
    id: "attendance",
    title: "Attendance Reports",
    icon: Calendar,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    reports: [
      {
        id: "att-daily",
        title: "Daily Summary",
        description:
          "Whole-school daily attendance overview with absence reasons breakdown.",
        preview: {
          summary: "94.2% attendance recorded for today, 04 Mar 2026.",
          headers: ["Class", "Present", "Absent", "Unauthorised", "Rate"],
          rows: [
            ["7A", "28", "2", "0", "93.3%"],
            ["7B", "30", "0", "0", "100%"],
            ["8A", "27", "3", "1", "90.0%"],
            ["9B", "25", "2", "2", "89.3%"],
            ["10A", "29", "1", "0", "96.7%"],
          ],
        },
      },
      {
        id: "att-weekly",
        title: "Weekly Trends",
        description:
          "Week-by-week attendance trends across all year groups for the current term.",
        preview: {
          summary: "Term 2 average attendance: 93.8%. Below target (96%).",
          headers: ["Week", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11"],
          rows: [
            ["Wk 1", "96.2%", "95.1%", "94.8%", "93.2%", "92.0%"],
            ["Wk 2", "95.8%", "94.7%", "93.4%", "92.9%", "91.5%"],
            ["Wk 3", "94.1%", "94.2%", "92.7%", "93.5%", "90.8%"],
            ["Wk 4", "93.9%", "93.8%", "92.1%", "91.8%", "89.4%"],
            ["Wk 5", "94.5%", "94.3%", "93.0%", "92.4%", "90.1%"],
          ],
        },
      },
      {
        id: "att-pa",
        title: "Persistent Absence",
        description:
          "Students with attendance below 90% — qualifies as persistent absence (PA).",
        preview: {
          summary:
            "8.3% of students are persistent absentees (below 90% attendance).",
          headers: ["Student", "Year", "Attendance", "Days Missed", "Reason"],
          rows: [
            ["***** *****", "Year 9", "81.2%", "18", "Illness"],
            ["***** *****", "Year 8", "78.5%", "22", "Unauthorised"],
            ["***** *****", "Year 11", "82.1%", "17", "Medical"],
            ["***** *****", "Year 7", "85.6%", "13", "Mixed"],
            ["***** *****", "Year 10", "87.0%", "11", "Illness"],
          ],
        },
      },
      {
        id: "att-yg",
        title: "Year Group Analysis",
        description:
          "Comparison of attendance rates across all year groups for the current term.",
        preview: {
          summary: "Year 7 highest (95.1%), Year 11 lowest (90.7%).",
          headers: [
            "Year Group",
            "Students",
            "Avg Attendance",
            "PA Count",
            "Sessions",
          ],
          rows: [
            ["Year 7", "180", "95.1%", "4", "16,200"],
            ["Year 8", "175", "94.2%", "6", "15,750"],
            ["Year 9", "168", "93.0%", "9", "15,120"],
            ["Year 10", "160", "92.5%", "11", "14,400"],
            ["Year 11", "155", "90.7%", "14", "13,950"],
          ],
        },
      },
    ],
  },
  {
    id: "academic",
    title: "Academic Reports",
    icon: BarChart3,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    reports: [
      {
        id: "ac-grade",
        title: "Grade Overview",
        description:
          "Current grade distribution across all subjects and year groups.",
        preview: {
          summary: "Average grade across all subjects: 5.4 (target 5.6).",
          headers: ["Subject", "Avg Grade", "9-7 (%)", "6-4 (%)", "3-1 (%)"],
          rows: [
            ["Mathematics", "5.2", "28%", "54%", "18%"],
            ["English", "5.5", "31%", "51%", "18%"],
            ["Science", "5.1", "25%", "56%", "19%"],
            ["History", "5.8", "35%", "49%", "16%"],
            ["Geography", "5.4", "29%", "53%", "18%"],
          ],
        },
      },
      {
        id: "ac-progress",
        title: "Progress Report",
        description:
          "Student progress against target grades — Spring term update.",
        preview: {
          summary: "62% of students are on or above target grade.",
          headers: [
            "Year",
            "On Target",
            "Above",
            "Below",
            "Significantly Below",
          ],
          rows: [
            ["Year 7", "68%", "14%", "15%", "3%"],
            ["Year 8", "65%", "12%", "18%", "5%"],
            ["Year 9", "60%", "11%", "22%", "7%"],
            ["Year 10", "58%", "10%", "24%", "8%"],
            ["Year 11", "56%", "9%", "25%", "10%"],
          ],
        },
      },
      {
        id: "ac-dept",
        title: "Department Analysis",
        description:
          "Comparative attainment by department with RAG rating and target vs actual.",
        preview: {
          summary:
            "4 departments rated Amber, 1 department rated Red (SEN support flagged).",
          headers: ["Department", "Avg Grade", "Target", "RAG", "HoD"],
          rows: [
            ["Mathematics", "5.2", "5.5", "Amber", "Mr Ahmed"],
            ["English", "5.5", "5.5", "Green", "Ms Clarke"],
            ["Science", "5.1", "5.4", "Amber", "Dr Patel"],
            ["Humanities", "5.7", "5.5", "Green", "Mr Brown"],
            ["MFL", "4.8", "5.2", "Red", "Mme Dupont"],
          ],
        },
      },
      {
        id: "ac-predictedvactual",
        title: "Predicted vs Actual",
        description:
          "Compare end-of-year predicted grades against interim assessment outcomes.",
        preview: {
          summary: "Overall: Actual grades are 0.2 below predicted average.",
          headers: [
            "Subject",
            "Predicted Avg",
            "Actual Avg",
            "Delta",
            "Status",
          ],
          rows: [
            ["Mathematics", "5.4", "5.2", "-0.2", "Amber"],
            ["English", "5.6", "5.5", "-0.1", "Green"],
            ["Science", "5.3", "5.1", "-0.2", "Amber"],
            ["History", "5.7", "5.8", "+0.1", "Green"],
            ["Computing", "5.5", "5.0", "-0.5", "Red"],
          ],
        },
      },
    ],
  },
  {
    id: "behaviour",
    title: "Behaviour Reports",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    reports: [
      {
        id: "beh-incident",
        title: "Incident Summary",
        description:
          "Logged behaviour incidents by type, year group, and staff member this term.",
        preview: {
          summary:
            "142 incidents logged this term. Down 12% vs same period last year.",
          headers: ["Type", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11"],
          rows: [
            ["Low-level disruption", "12", "18", "22", "15", "10"],
            ["Mobile phone", "3", "6", "9", "7", "4"],
            ["Physical altercation", "0", "1", "2", "1", "0"],
            ["Bullying", "1", "1", "2", "0", "0"],
            ["Exclusion-worthy", "0", "0", "1", "1", "1"],
          ],
        },
      },
      {
        id: "beh-rewards",
        title: "Reward Points",
        description:
          "Merit and achievement points awarded across year groups this term.",
        preview: {
          summary:
            "4,280 merit points awarded this term. 18 students on Headteacher Commendation.",
          headers: [
            "Year Group",
            "Total Points",
            "Top Student",
            "Avg / Student",
            "On Commendation",
          ],
          rows: [
            ["Year 7", "1,240", "A. Kamara (188)", "6.9", "5"],
            ["Year 8", "980", "G. Owusu (142)", "5.6", "4"],
            ["Year 9", "820", "H. Sultani (130)", "4.9", "3"],
            ["Year 10", "740", "Z. Hussain (120)", "4.6", "4"],
            ["Year 11", "500", "D. Okonkwo (98)", "3.2", "2"],
          ],
        },
      },
      {
        id: "beh-exclusion",
        title: "Exclusion Report",
        description:
          "Fixed-term and permanent exclusion data for the current academic year.",
        preview: {
          summary: "3 fixed-term exclusions this term. 0 permanent exclusions.",
          headers: ["Student (Anon)", "Year", "Type", "Duration", "Reason"],
          rows: [
            [
              "S-0231",
              "Year 9",
              "Fixed-term",
              "1 day",
              "Persistent disruption",
            ],
            [
              "S-0188",
              "Year 10",
              "Fixed-term",
              "2 days",
              "Physical altercation",
            ],
            ["S-0312", "Year 11", "Fixed-term", "1 day", "Defiance"],
          ],
        },
      },
    ],
  },
  {
    id: "safeguarding",
    title: "Safeguarding Reports",
    icon: Shield,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    reports: [
      {
        id: "sg-case",
        title: "Case Summary",
        description:
          "Non-identifiable summary of open and closed safeguarding cases this academic year.",
        preview: {
          summary:
            "Restricted report — data anonymised. 6 open cases, 14 closed this year.",
          headers: [
            "Category",
            "Open",
            "Closed",
            "Referred to LA",
            "CIN Plans",
          ],
          rows: [
            ["Child Protection", "2", "5", "3", "2"],
            ["Child in Need", "3", "6", "2", "3"],
            ["Early Help", "1", "3", "1", "0"],
          ],
        },
      },
      {
        id: "sg-training",
        title: "Training Compliance",
        description:
          "Staff safeguarding training completion status and expiry dates.",
        preview: {
          summary:
            "94% of staff trained. 8 staff due for renewal within 30 days.",
          headers: [
            "Training Type",
            "Completed",
            "Overdue",
            "Due in 30d",
            "% Compliant",
          ],
          rows: [
            ["Basic Safeguarding", "68", "0", "2", "100%"],
            ["Level 2 DSL", "12", "1", "3", "92%"],
            ["Prevent Duty", "65", "3", "5", "96%"],
            ["Online Safety", "60", "8", "6", "88%"],
          ],
        },
      },
    ],
  },
  {
    id: "finance",
    title: "Finance Reports",
    icon: DollarSign,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    reports: [
      {
        id: "fin-budget",
        title: "Budget vs Actual",
        description:
          "Current year budget allocation compared to actual spend by cost centre.",
        preview: {
          summary:
            "Overall budget: £4.2M. Spend to date: £2.8M (67%). On track.",
          headers: ["Cost Centre", "Budget", "Actual", "Variance", "RAG"],
          rows: [
            ["Teaching Staff", "£2,400,000", "£1,560,000", "+£40,000", "Green"],
            ["Support Staff", "£800,000", "£542,000", "-£8,000", "Amber"],
            ["Premises", "£320,000", "£228,000", "+£12,000", "Green"],
            ["ICT Equipment", "£180,000", "£164,000", "-£24,000", "Red"],
            ["Curriculum", "£150,000", "£88,000", "+£2,000", "Green"],
          ],
        },
      },
      {
        id: "fin-income",
        title: "Income Summary",
        description:
          "All income streams including GAG, pupil premium, SEND top-up, and other grants.",
        preview: {
          summary:
            "Total income YTD: £2.94M. Pupil Premium: £214,000 received.",
          headers: ["Income Stream", "Budgeted", "Received", "Outstanding"],
          rows: [
            ["General Annual Grant", "£3,800,000", "£2,533,000", "£1,267,000"],
            ["Pupil Premium", "£320,000", "£214,000", "£106,000"],
            ["SEND Top-up", "£48,000", "£36,000", "£12,000"],
            ["PE / Sport Premium", "£18,000", "£18,000", "£0"],
            ["Other Grants", "£14,000", "£9,000", "£5,000"],
          ],
        },
      },
      {
        id: "fin-exp",
        title: "Expenditure Breakdown",
        description:
          "Detailed expenditure analysis by category for the current financial year.",
        preview: {
          summary:
            "Total expenditure YTD: £2.8M. Staff costs: 86% of total spend.",
          headers: ["Category", "Amount", "% of Budget", "vs Last Year"],
          rows: [
            ["Teaching Staff", "£1,560,000", "55.7%", "+2.1%"],
            ["Support Staff", "£542,000", "19.4%", "+0.8%"],
            ["Premises & Utilities", "£228,000", "8.1%", "+5.2%"],
            ["ICT & Equipment", "£164,000", "5.9%", "-1.4%"],
            ["Other", "£306,000", "10.9%", "+1.0%"],
          ],
        },
      },
    ],
  },
  {
    id: "hr",
    title: "HR Reports",
    icon: UserCog,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    reports: [
      {
        id: "hr-absence",
        title: "Staff Absence",
        description:
          "Staff absence tracking — Bradford Factor, sickness reasons, and cover impact.",
        preview: {
          summary:
            "Staff absence rate: 2.1% (national average: 3.2%). 3 on long-term absence.",
          headers: [
            "Staff",
            "Days Absent",
            "Bradford Factor",
            "Reason",
            "Cover Days",
          ],
          rows: [
            ["P. Nolan", "5", "125", "Illness", "5"],
            ["K. Walsh (TA)", "3", "27", "Illness", "2"],
            ["V. Osei", "2", "8", "Medical appt.", "2"],
            ["A. Levy", "10", "500", "Long-term (mental)", "10"],
            ["T. Harris", "1", "1", "Annual leave", "0"],
          ],
        },
      },
      {
        id: "hr-cpd",
        title: "CPD Hours",
        description:
          "Continuing Professional Development hours completed by staff this academic year.",
        preview: {
          summary:
            "Average CPD hours per teacher: 28.4 hrs (target: 30 hrs). 82% on track.",
          headers: ["Staff Name", "Role", "CPD Hours", "Target", "Status"],
          rows: [
            ["Emma Williams", "Teacher", "32", "30", "Met"],
            ["James Davies", "Teacher", "28", "30", "In Progress"],
            ["Daniel Okonkwo", "Teacher", "30", "30", "Met"],
            ["Zara Hussain", "Teacher", "24", "30", "At Risk"],
            ["Aisha Kamara", "HoD", "18", "15", "Met"],
          ],
        },
      },
      {
        id: "hr-census",
        title: "Workforce Census",
        description:
          "DfE Workforce Census data — headcount, FTE, ethnicity, and qualification summary.",
        preview: {
          summary:
            "68 staff members. 41 teachers (38.2 FTE). Qualified Teacher Status: 97%.",
          headers: ["Category", "Headcount", "FTE", "% of Staff"],
          rows: [
            ["Teaching Staff", "41", "38.2", "60.3%"],
            ["Teaching Assistants", "14", "12.0", "20.6%"],
            ["Admin & Support", "8", "7.5", "11.8%"],
            ["Leadership (SLT)", "5", "5.0", "7.4%"],
          ],
        },
      },
    ],
  },
];

// ─── Compliance Section ───────────────────────────────────────────────────────

const COMPLIANCE_REPORTS = [
  {
    title: "School Census (Autumn)",
    dueDate: "Due: 01 Oct 2026",
    status: "Submitted",
    statusClass: "bg-green-100 text-green-700",
  },
  {
    title: "School Census (Spring)",
    dueDate: "Due: 19 Jan 2026",
    status: "Submitted",
    statusClass: "bg-green-100 text-green-700",
  },
  {
    title: "School Census (Summer)",
    dueDate: "Due: 18 May 2026",
    status: "Pending",
    statusClass: "bg-amber-100 text-amber-700",
  },
  {
    title: "Workforce Census",
    dueDate: "Due: 05 Nov 2025",
    status: "Submitted",
    statusClass: "bg-green-100 text-green-700",
  },
  {
    title: "Absence Returns (DfE)",
    dueDate: "Due: 31 Mar 2026",
    status: "In Progress",
    statusClass: "bg-blue-100 text-blue-700",
  },
  {
    title: "Phonics Screening (KS1)",
    dueDate: "Due: Jun 2026",
    status: "Not Due",
    statusClass: "bg-gray-100 text-gray-500",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [previewReport, setPreviewReport] = useState<{
    title: string;
    data: PreviewData;
  } | null>(null);

  const handleGenerate = (report: SubReport) => {
    setGeneratingId(report.id);
    setTimeout(() => {
      setGeneratingId(null);
      setPreviewReport({ title: report.title, data: report.preview });
    }, 2000);
  };

  const handleSchedule = (title: string) => {
    toast.info(
      `Schedule report "${title}" — opens scheduler (not yet implemented)`,
    );
  };

  const handleExportPreview = () => {
    if (!previewReport) return;
    toast.success(`Exported "${previewReport.title}" to CSV`);
    setPreviewReport(null);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate, schedule, and export statutory and internal reports"
        icon={BarChart3}
        iconColor="bg-violet-600"
      />

      <div className="flex-1 overflow-auto p-6 space-y-8">
        {/* ── Report Categories ── */}
        {REPORT_CATEGORIES.map((category) => {
          const CategoryIcon = category.icon;
          return (
            <section key={category.id}>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    category.bgColor,
                  )}
                >
                  <CategoryIcon className={cn("h-4 w-4", category.iconColor)} />
                </div>
                <h2 className="text-base font-semibold text-gray-800">
                  {category.title}
                </h2>
                <Badge variant="secondary" className="text-xs">
                  {category.reports.length} reports
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {category.reports.map((report) => {
                  const isLoading = generatingId === report.id;
                  return (
                    <Card
                      key={report.id}
                      className="p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">
                          {report.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {report.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-auto pt-1">
                        <Button
                          size="sm"
                          className="flex-1 gap-1.5 text-xs h-8"
                          disabled={isLoading}
                          onClick={() => handleGenerate(report)}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Generating…
                            </>
                          ) : (
                            <>
                              <Table className="h-3.5 w-3.5" />
                              Generate
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8 px-2 text-gray-400 hover:text-gray-600 gap-1"
                          onClick={() => handleSchedule(report.title)}
                        >
                          <Clock className="h-3.5 w-3.5" />
                          Schedule
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* ── SchoolData.gov.uk Compliance Section ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <FileText className="h-4 w-4 text-slate-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-800">
              SchoolData.gov.uk Compliance Returns
            </h2>
            <Badge variant="secondary" className="text-xs">
              DfE Statutory
            </Badge>
          </div>

          <Card className="overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Statutory returns submitted to the Department for Education via
                COLLECT and the School Data dashboard.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-7"
              >
                <ExternalLink className="h-3 w-3" />
                Open COLLECT
              </Button>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  {["Return", "Due Date", "Status", "Action"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {COMPLIANCE_REPORTS.map((rep) => (
                  <tr key={rep.title} className="hover:bg-gray-50/60">
                    <td className="px-5 py-3 font-medium text-gray-800 text-sm">
                      {rep.title}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {rep.dueDate}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                          rep.statusClass,
                        )}
                      >
                        {rep.status === "Submitted" && (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {rep.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {rep.status !== "Not Due" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs gap-1 text-gray-500 hover:text-blue-600"
                        >
                          {rep.status === "Submitted" ? (
                            <>
                              <Download className="h-3 w-3" /> Download
                            </>
                          ) : (
                            <>
                              <ChevronRight className="h-3 w-3" /> Prepare
                            </>
                          )}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      </div>

      {/* ── Report Preview Dialog ── */}
      <Dialog
        open={!!previewReport}
        onOpenChange={(o) => {
          if (!o) setPreviewReport(null);
        }}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Table className="h-5 w-5 text-violet-500" />
              {previewReport?.title} — Preview
            </DialogTitle>
          </DialogHeader>

          {previewReport && (
            <div className="space-y-4">
              {previewReport.data.summary && (
                <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-100 p-3">
                  <TrendingUp className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    {previewReport.data.summary}
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {previewReport.data.headers.map((h) => (
                          <th
                            key={h}
                            className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {previewReport.data.rows.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/60">
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Showing first 5 rows of preview. Full report contains all
                records.
              </p>

              <div className="flex items-center justify-between pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewReport(null)}
                >
                  Close
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => handleSchedule(previewReport.title)}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    Schedule
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={handleExportPreview}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export Full Report
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
