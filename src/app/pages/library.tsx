import { useState } from "react";
import { useOutletContext } from "react-router";
import {
  BookOpen,
  Plus,
  BookMarked,
  BookX,
  AlertTriangle,
  RotateCcw,
  Library as LibraryIcon,
} from "lucide-react";
import { StatCard } from "../components/stat-card";
import { StatusBadge } from "../components/status-badge";
import { DataTable } from "../components/data-table";
import { libraryBooks, bookIssues, type Role } from "../data/mock-data";

type Tab = "catalog" | "issued" | "overdue";

export default function LibraryPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [activeTab, setActiveTab] = useState<Tab>("catalog");
  const [showAddBook, setShowAddBook] = useState(false);
  const [showIssueBook, setShowIssueBook] = useState(false);

  const isAdmin = role === "admin" || role === "librarian";
  const isTeacher = role === "teacher";
  const canManage = isAdmin || isTeacher;

  const totalBooks = libraryBooks.reduce((sum, b) => sum + b.totalCopies, 0);
  const availableBooks = libraryBooks.reduce(
    (sum, b) => sum + b.availableCopies,
    0,
  );
  const currentlyIssued = bookIssues.filter(
    (i) => i.status === "issued",
  ).length;
  const overdueCount = bookIssues.filter((i) => i.status === "overdue").length;
  const totalFines = bookIssues.reduce((sum, i) => sum + i.fine, 0);

  // For student view, filter to their issues
  const myIssues =
    role === "student"
      ? bookIssues.filter((i) => i.borrower === "Alice Johnson")
      : role === "parent"
        ? bookIssues.filter((i) => i.borrower === "Alice Johnson")
        : bookIssues;

  const overdueIssues = bookIssues.filter((i) => i.status === "overdue");

  const tabs = [
    { id: "catalog" as Tab, label: "Book Catalog" },
    {
      id: "issued" as Tab,
      label:
        role === "student" || role === "parent" ? "My Books" : "Issued Books",
    },
    { id: "overdue" as Tab, label: "Overdue" },
  ];

  const catalogColumns = [
    {
      key: "title",
      label: "Title",
      render: (book: (typeof libraryBooks)[0]) => (
        <div>
          <p style={{ fontWeight: 500 }}>{book.title}</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
            {book.author}
          </p>
        </div>
      ),
    },
    {
      key: "isbn",
      label: "ISBN",
      render: (book: (typeof libraryBooks)[0]) => (
        <span
          className="font-mono text-muted-foreground"
          style={{ fontSize: "0.8125rem" }}
        >
          {book.isbn}
        </span>
      ),
      className: "hidden md:table-cell",
    },
    {
      key: "category",
      label: "Category",
      render: (book: (typeof libraryBooks)[0]) => (
        <span
          className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
          style={{ fontSize: "0.75rem" }}
        >
          {book.category}
        </span>
      ),
    },
    {
      key: "copies",
      label: "Available",
      render: (book: (typeof libraryBooks)[0]) => (
        <span className={book.availableCopies === 0 ? "text-red-600" : ""}>
          {book.availableCopies} / {book.totalCopies}
        </span>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (book: (typeof libraryBooks)[0]) => (
        <span className="text-muted-foreground">{book.location}</span>
      ),
      className: "hidden lg:table-cell",
    },
    ...(canManage
      ? [
          {
            key: "actions",
            label: "",
            render: (_book: (typeof libraryBooks)[0]) => (
              <button
                onClick={() => setShowIssueBook(true)}
                className="px-2.5 py-1 rounded-md border border-border hover:bg-muted transition-colors"
                style={{ fontSize: "0.75rem" }}
              >
                Issue
              </button>
            ),
          },
        ]
      : []),
  ];

  const issuedColumns = [
    {
      key: "book",
      label: "Book",
      render: (issue: (typeof bookIssues)[0]) => (
        <p style={{ fontWeight: 500 }}>{issue.bookTitle}</p>
      ),
    },
    {
      key: "borrower",
      label: "Borrower",
      render: (issue: (typeof bookIssues)[0]) => (
        <div>
          <p>{issue.borrower}</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
            {issue.borrowerRole}
          </p>
        </div>
      ),
      className: role === "student" || role === "parent" ? "hidden" : "",
    },
    {
      key: "issueDate",
      label: "Issued",
      render: (issue: (typeof bookIssues)[0]) => (
        <span className="text-muted-foreground">{issue.issueDate}</span>
      ),
      className: "hidden sm:table-cell",
    },
    {
      key: "dueDate",
      label: "Due Date",
      render: (issue: (typeof bookIssues)[0]) => (
        <span className={issue.status === "overdue" ? "text-red-600" : ""}>
          {issue.dueDate}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (issue: (typeof bookIssues)[0]) => (
        <StatusBadge status={issue.status} />
      ),
    },
    {
      key: "fine",
      label: "Fine",
      render: (issue: (typeof bookIssues)[0]) =>
        issue.fine > 0 ? (
          <span className="text-red-600" style={{ fontWeight: 500 }}>
            {issue.fine}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    ...(canManage
      ? [
          {
            key: "actions",
            label: "",
            render: (issue: (typeof bookIssues)[0]) =>
              issue.status !== "returned" ? (
                <button
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-border hover:bg-muted transition-colors"
                  style={{ fontSize: "0.75rem" }}
                >
                  <RotateCcw className="w-3 h-3" /> Return
                </button>
              ) : null,
          },
        ]
      : []),
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1>Library Management</h1>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            {canManage
              ? "Manage book catalog, issue and track books."
              : "Browse and track your borrowed books."}
          </p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowIssueBook(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              style={{ fontSize: "0.875rem" }}
            >
              <BookMarked className="w-4 h-4" /> Issue Book
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowAddBook(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                style={{ fontSize: "0.875rem" }}
              >
                <Plus className="w-4 h-4" /> Add Book
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Books"
          value={totalBooks}
          icon={<BookOpen className="w-5 h-5 text-muted-foreground" />}
          change={`${libraryBooks.length} titles`}
          changeType="neutral"
        />
        <StatCard
          label="Available"
          value={availableBooks}
          icon={<LibraryIcon className="w-5 h-5 text-muted-foreground" />}
          change={`of ${totalBooks} copies`}
          changeType="positive"
        />
        <StatCard
          label="Currently Issued"
          value={currentlyIssued}
          icon={<BookMarked className="w-5 h-5 text-muted-foreground" />}
        />
        <StatCard
          label="Overdue"
          value={overdueCount}
          icon={<AlertTriangle className="w-5 h-5 text-muted-foreground" />}
          change={`₹${totalFines} in fines`}
          changeType="negative"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-muted rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-card shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={{ fontSize: "0.8125rem", fontWeight: 500 }}
          >
            {tab.label}
            {tab.id === "overdue" && overdueCount > 0 && (
              <span
                className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-100 text-red-700"
                style={{ fontSize: "0.65rem" }}
              >
                {overdueCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Catalog Tab */}
      {activeTab === "catalog" && (
        <DataTable
          data={libraryBooks}
          columns={catalogColumns}
          searchKey={(book) =>
            `${book.title} ${book.author} ${book.category} ${book.isbn}`
          }
          searchPlaceholder="Search books by title, author, category..."
          pageSize={8}
        />
      )}

      {/* Issued Tab */}
      {activeTab === "issued" && (
        <DataTable
          data={
            role === "student" || role === "parent"
              ? myIssues
              : bookIssues.filter((i) => i.status !== "returned")
          }
          columns={issuedColumns}
          searchKey={(issue) => `${issue.bookTitle} ${issue.borrower}`}
          searchPlaceholder="Search by book or borrower..."
          pageSize={8}
        />
      )}

      {/* Overdue Tab */}
      {activeTab === "overdue" && (
        <div>
          {overdueIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mb-1">No Overdue Books</h3>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.875rem" }}
              >
                All books are returned on time.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-card border border-red-200 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                      <BookX className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                        {issue.bookTitle}
                      </p>
                      <p
                        className="text-muted-foreground"
                        style={{ fontSize: "0.8125rem" }}
                      >
                        Borrowed by {issue.borrower} ({issue.borrowerRole})
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span
                          className="text-muted-foreground"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Due: {issue.dueDate}
                        </span>
                        <span
                          className="text-red-600"
                          style={{ fontSize: "0.75rem", fontWeight: 500 }}
                        >
                          Fine: ₹{issue.fine}
                        </span>
                      </div>
                    </div>
                  </div>
                  {canManage && (
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                        style={{ fontSize: "0.8125rem" }}
                      >
                        Send Reminder
                      </button>
                      <button
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                        style={{ fontSize: "0.8125rem" }}
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Mark Returned
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Book Modal */}
      {showAddBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowAddBook(false)}
          />
          <div className="relative bg-card border border-border rounded-xl p-6 w-full max-w-lg shadow-xl mx-4">
            <h3 className="mb-4">Add New Book</h3>
            <div className="space-y-4">
              <div>
                <label style={{ fontSize: "0.875rem" }}>Title</label>
                <input
                  type="text"
                  placeholder="Book title"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Author</label>
                  <input
                    type="text"
                    placeholder="Author name"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem" }}>ISBN</label>
                  <input
                    type="text"
                    placeholder="978-XXXXXXXXX"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Category</label>
                  <select
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                    style={{ fontSize: "0.875rem" }}
                  >
                    <option>Computer Science</option>
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Literature</option>
                    <option>History</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Copies</label>
                  <input
                    type="number"
                    defaultValue={1}
                    min={1}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Location</label>
                <input
                  type="text"
                  placeholder="e.g., Shelf A-12"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddBook(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                style={{ fontSize: "0.875rem" }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddBook(false)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                style={{ fontSize: "0.875rem" }}
              >
                Add Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Book Modal */}
      {showIssueBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowIssueBook(false)}
          />
          <div className="relative bg-card border border-border rounded-xl p-6 w-full max-w-lg shadow-xl mx-4">
            <h3 className="mb-4">Issue Book</h3>
            <div className="space-y-4">
              <div>
                <label style={{ fontSize: "0.875rem" }}>Select Book</label>
                <select
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                  style={{ fontSize: "0.875rem" }}
                >
                  <option value="">Choose a book...</option>
                  {libraryBooks
                    .filter((b) => b.availableCopies > 0)
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} ({b.availableCopies} available)
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.875rem" }}>Borrower Name</label>
                <input
                  type="text"
                  placeholder="Search student or teacher..."
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Issue Date</label>
                  <input
                    type="date"
                    defaultValue="2026-02-27"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Due Date</label>
                  <input
                    type="date"
                    defaultValue="2026-03-13"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background"
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowIssueBook(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                style={{ fontSize: "0.875rem" }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowIssueBook(false)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                style={{ fontSize: "0.875rem" }}
              >
                Issue Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
