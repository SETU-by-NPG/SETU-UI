export type InvoiceStatus = "UNPAID" | "PAID" | "OVERDUE" | "VOID";
export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "CARD" | "BACS";
export type InvoiceCategory =
  | "TUITION_FEES"
  | "TRIPS"
  | "CLUBS"
  | "UNIFORM"
  | "LIBRARY_FINE"
  | "OTHER";

export interface Invoice {
  id: string;
  organisationId: string;
  studentId: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  category: InvoiceCategory;
  dueDate: string;
  issueDate: string;
  status: InvoiceStatus;
  notes?: string;
  isRecurring: boolean;
  recurringFrequency?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  organisationId: string;
  studentId: string;
  invoiceId: string;
  paymentRef: string;
  amount: number;
  method: PaymentMethod;
  dateReceived: string;
  receivedBy: string;
  notes?: string;
  createdAt: string;
}

export interface BudgetCategory {
  id: string;
  organisationId: string;
  name: string;
  allocatedBudget: number;
  spentToDate: number;
  committed: number;
  academicYearId: string;
}
