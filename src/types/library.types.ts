export type BookCategory =
  | "FICTION"
  | "NON_FICTION"
  | "SCIENCE"
  | "HISTORY"
  | "MATHEMATICS"
  | "LANGUAGES"
  | "REFERENCE"
  | "BIOGRAPHY"
  | "OTHER";
export type BorrowingStatus = "BORROWED" | "RETURNED" | "OVERDUE" | "LOST";

export interface Book {
  id: string;
  organisationId: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  edition?: string;
  category: BookCategory;
  totalCopies: number;
  availableCopies: number;
  coverImageUrl?: string;
  recommendedYearGroups: string[];
  description?: string;
  createdAt: string;
}

export interface BookBorrowing {
  id: string;
  bookId: string;
  studentId: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  fineAmount: number;
  finePaid: boolean;
  status: BorrowingStatus;
  createdAt: string;
}
