/**
 * SETU Education Management System - Feature 17: Library System with Parent Restrictions
 * Library catalog and borrowing system with strict parent blocking
 * 
 * CRITICAL RESTRICTIONS:
 * - BLOCK all parent borrowing attempts
 * - Show clear messaging: "Parents cannot borrow books"
 * - Display transactions for students/teachers only
 * - Track overdue books with visual indicators
 */

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Ban,
  Lock,
  Calendar,
  User,
  Bookmark,
  ArrowRightLeft,
  History,
  ShieldAlert,
  BookX,
  BookMarked,
  Filter,
  RotateCcw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { EmptyState } from '../empty-state';
import type { Role, Book, LibraryTransaction, TransactionStatus } from '../../types';

// ==================== TYPES ====================

interface LibrarySystemProps {
  role: Role;
  userId?: string;
  userName?: string;
  studentId?: string;
}

interface BorrowRequest {
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  userRole: Role;
  requestDate: string;
}

// ==================== MOCK DATA ====================

const MOCK_BOOKS: Book[] = [
  { id: 'book-001', isbn: '978-0-123456-78-9', title: 'Introduction to Mathematics', author: 'Dr. Alan Smith', publisher: 'Academic Press', category: 'Mathematics', shelfLocation: 'A-12-3', totalCopies: 5, availableCopies: 2, status: 'available', publishedYear: 2020 },
  { id: 'book-002', isbn: '978-0-234567-89-0', title: 'Advanced Physics', author: 'Prof. Maria Garcia', publisher: 'Science Books Ltd', category: 'Science', shelfLocation: 'B-05-1', totalCopies: 3, availableCopies: 0, status: 'unavailable', publishedYear: 2019 },
  { id: 'book-003', isbn: '978-0-345678-90-1', title: 'World History: A Comprehensive Guide', author: 'Dr. James Wilson', publisher: 'History Press', category: 'History', shelfLocation: 'C-08-2', totalCopies: 8, availableCopies: 5, status: 'available', publishedYear: 2021 },
  { id: 'book-004', isbn: '978-0-456789-01-2', title: 'English Literature Classics', author: 'Prof. Sarah Brown', publisher: 'Literary House', category: 'Literature', shelfLocation: 'D-03-4', totalCopies: 6, availableCopies: 3, status: 'available', publishedYear: 2018 },
  { id: 'book-005', isbn: '978-0-567890-12-3', title: 'Computer Science Fundamentals', author: 'Dr. Michael Chen', publisher: 'Tech Publications', category: 'Computer Science', shelfLocation: 'E-15-1', totalCopies: 4, availableCopies: 1, status: 'available', publishedYear: 2022 },
  { id: 'book-006', isbn: '978-0-678901-23-4', title: 'Biology: The Living World', author: 'Dr. Emily Davis', publisher: 'BioBooks', category: 'Science', shelfLocation: 'B-07-3', totalCopies: 7, availableCopies: 4, status: 'available', publishedYear: 2020 },
  { id: 'book-007', isbn: '978-0-789012-34-5', title: 'Chemistry Basics', author: 'Prof. Robert Lee', publisher: 'ChemPress', category: 'Science', shelfLocation: 'B-02-2', totalCopies: 5, availableCopies: 0, status: 'unavailable', publishedYear: 2019 },
  { id: 'book-008', isbn: '978-0-890123-45-6', title: 'Geography: Exploring Our World', author: 'Dr. Lisa Anderson', publisher: 'GeoBooks', category: 'Geography', shelfLocation: 'F-09-1', totalCopies: 6, availableCopies: 6, status: 'available', publishedYear: 2021 },
];

const MOCK_TRANSACTIONS: LibraryTransaction[] = [
  { id: 'trans-001', bookId: 'book-001', studentId: 'student-001', borrowedDate: '2025-02-01', dueDate: '2025-02-15', returnedDate: null, status: 'overdue', lateFine: 15 },
  { id: 'trans-002', bookId: 'book-003', studentId: 'student-001', borrowedDate: '2025-02-10', dueDate: '2025-02-24', returnedDate: null, status: 'borrowed', lateFine: 0 },
  { id: 'trans-003', bookId: 'book-005', studentId: 'teacher-001', borrowedDate: '2025-02-05', dueDate: '2025-03-05', returnedDate: null, status: 'borrowed', lateFine: 0 },
  { id: 'trans-004', bookId: 'book-002', studentId: 'student-002', borrowedDate: '2025-01-15', dueDate: '2025-01-29', returnedDate: '2025-02-01', status: 'returned', lateFine: 5 },
  { id: 'trans-005', bookId: 'book-004', studentId: 'student-003', borrowedDate: '2025-01-20', dueDate: '2025-02-03', returnedDate: null, status: 'overdue', lateFine: 20 },
  { id: 'trans-006', bookId: 'book-006', studentId: 'teacher-002', borrowedDate: '2025-02-20', dueDate: '2025-03-20', returnedDate: null, status: 'borrowed', lateFine: 0 },
];

const CATEGORIES = ['All', 'Mathematics', 'Science', 'History', 'Literature', 'Computer Science', 'Geography'];

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validates if a user can borrow books
 * PARENTS ARE BLOCKED from borrowing
 */
const validateBorrowing = (
  role: Role,
  userId: string,
  userName: string,
  bookId: string,
  bookTitle: string
): { allowed: boolean; error?: string; reason?: string } => {
  console.log(`[LibrarySystem] Borrowing validation - Role: ${role}, User: ${userName}, Book: ${bookTitle}`);

  // BLOCK parents from borrowing
  if (role === 'parent') {
    const reason = 'Parents cannot borrow books';
    console.log(`[LibrarySystem] BLOCKED: ${reason}`);
    console.log(`[LibrarySystem] Attempted by: ${userName} (${userId})`);
    console.log(`[LibrarySystem] Attempted book: ${bookTitle} (${bookId})`);
    return { allowed: false, error: reason, reason };
  }

  // Students and teachers can borrow
  if (role === 'student' || role === 'teacher' || role === 'admin') {
    console.log(`[LibrarySystem] ALLOWED: ${role} can borrow books`);
    return { allowed: true };
  }

  // Unknown role
  const reason = 'Invalid user role';
  console.log(`[LibrarySystem] BLOCKED: ${reason}`);
  return { allowed: false, error: reason, reason };
};

// ==================== HELPER FUNCTIONS ====================

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getDaysOverdue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

const STATUS_CONFIG: Record<TransactionStatus, { label: string; color: string; icon: React.ReactNode }> = {
  borrowed: { 
    label: 'Borrowed', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <BookOpen className="w-3 h-3" />
  },
  returned: { 
    label: 'Returned', 
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckCircle2 className="w-3 h-3" />
  },
  overdue: { 
    label: 'Overdue', 
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: <AlertCircle className="w-3 h-3" />
  },
  lost: { 
    label: 'Lost', 
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: <BookX className="w-3 h-3" />
  },
};

// ==================== SUB-COMPONENTS ====================

/**
 * Book Card Component
 */
const BookCard: React.FC<{
  book: Book;
  role: Role;
  userId: string;
  userName: string;
  onBorrow: (book: Book) => void;
  isBorrowed: boolean;
}> = ({ book, role, userId, userName, onBorrow, isBorrowed }) => {
  const isAvailable = book.availableCopies > 0;
  const isParent = role === 'parent';

  const handleBorrowClick = () => {
    if (isParent) {
      // Log blocked attempt
      console.log(`[LibrarySystem] BLOCKED: Parent ${userName} attempted to borrow ${book.title}`);
      // Still show the error via the onBorrow handler
    }
    onBorrow(book);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base leading-tight truncate">{book.title}</CardTitle>
            <CardDescription className="text-sm">{book.author}</CardDescription>
          </div>
          <Badge 
            variant={isAvailable ? 'default' : 'secondary'}
            className={isAvailable ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
          >
            {isAvailable ? `${book.availableCopies} Available` : 'Unavailable'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Category:</span>
            <Badge variant="outline">{book.category}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">ISBN:</span>
            <span className="font-mono text-xs">{book.isbn}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location:</span>
            <span>{book.shelfLocation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Publisher:</span>
            <span className="text-right truncate max-w-[150px]">{book.publisher}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {isParent ? (
          <Button 
            variant="outline" 
            className="w-full" 
            disabled
          >
            <Lock className="w-4 h-4 mr-2" />
            Parents Cannot Borrow
          </Button>
        ) : isBorrowed ? (
          <Button 
            variant="outline" 
            className="w-full" 
            disabled
          >
            <BookMarked className="w-4 h-4 mr-2" />
            Already Borrowed
          </Button>
        ) : (
          <Button 
            variant={isAvailable ? 'default' : 'outline'} 
            className="w-full" 
            disabled={!isAvailable}
            onClick={handleBorrowClick}
          >
            {isAvailable ? (
              <><BookOpen className="w-4 h-4 mr-2" /> Borrow</>
            ) : (
              <><BookX className="w-4 h-4 mr-2" /> Unavailable</>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

/**
 * Transaction Card Component
 */
const TransactionCard: React.FC<{
  transaction: LibraryTransaction;
  book: Book;
  showUser?: boolean;
}> = ({ transaction, book, showUser = false }) => {
  const status = STATUS_CONFIG[transaction.status];
  const daysOverdue = transaction.status === 'overdue' ? getDaysOverdue(transaction.dueDate) : 0;

  return (
    <Card className={transaction.status === 'overdue' ? 'border-red-200' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{book.title}</h4>
            <p className="text-sm text-muted-foreground">{book.author}</p>
            
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className={status.color}>
                <span className="flex items-center gap-1">
                  {status.icon}
                  {status.label}
                </span>
              </Badge>
              
              {transaction.status === 'overdue' && (
                <Badge variant="destructive">
                  {daysOverdue} days overdue
                </Badge>
              )}
              
              {transaction.lateFine > 0 && (
                <Badge variant="secondary">
                  Fine: ${transaction.lateFine}
                </Badge>
              )}
            </div>

            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Borrowed: {formatDate(transaction.borrowedDate)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Due: {formatDate(transaction.dueDate)}
              </div>
              {transaction.returnedDate && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Returned: {formatDate(transaction.returnedDate)}
                </div>
              )}
              {showUser && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  User: {transaction.studentId}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Borrow Confirmation Dialog
 */
const BorrowDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  book: Book | null;
  role: Role;
  validationError: string | null;
}> = ({ isOpen, onClose, onConfirm, book, role, validationError }) => {
  if (!book) return null;

  const isParent = role === 'parent';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isParent ? <Ban className="w-5 h-5 text-red-500" /> : <BookOpen className="w-5 h-5" />}
            {isParent ? 'Borrowing Not Allowed' : 'Confirm Borrow'}
          </DialogTitle>
          <DialogDescription>
            {isParent 
              ? 'You are not permitted to borrow books.' 
              : 'Please confirm you want to borrow this book.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium">{book.title}</h4>
            <p className="text-sm text-muted-foreground">{book.author}</p>
            <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
              <span>ISBN: {book.isbn}</span>
              <span>&middot;</span>
              <span>Location: {book.shelfLocation}</span>
            </div>
          </div>

          {validationError && (
            <Alert variant="destructive" className="mt-4">
              <Ban className="w-4 h-4" />
              <AlertTitle>Action Blocked</AlertTitle>
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {isParent && (
            <Alert className="mt-4 bg-amber-50 border-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Parent Restriction</AlertTitle>
              <AlertDescription className="text-amber-700">
                Parents cannot borrow books from the library. This restriction is in place to ensure proper accountability.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {isParent ? 'Close' : 'Cancel'}
          </Button>
          {!isParent && (
            <Button onClick={onConfirm} disabled={!!validationError}>
              <BookOpen className="w-4 h-4 mr-2" />
              Confirm Borrow
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ==================== MAIN COMPONENT ====================

export const LibrarySystem: React.FC<LibrarySystemProps> = ({
  role,
  userId = 'user-001',
  userName = 'Current User',
  studentId,
}) => {
  const [books] = useState<Book[]>(MOCK_BOOKS);
  const [transactions, setTransactions] = useState<LibraryTransaction[]>(MOCK_TRANSACTIONS);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBorrowDialogOpen, setIsBorrowDialogOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('catalog');

  // Console log role and restrictions
  console.log(`[LibrarySystem] Initialized with role: ${role}`);
  console.log(`[LibrarySystem] User: ${userName} (${userId})`);
  console.log(`[LibrarySystem] Parent borrowing: ${role === 'parent' ? 'BLOCKED' : 'ALLOWED'}`);

  const isParent = role === 'parent';
  const canViewTransactions = role === 'student' || role === 'teacher' || role === 'admin';

  // Filter books based on search and category
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery);
      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [books, searchQuery, selectedCategory]);

  // Get user's transactions (for students/teachers) or all (for admin)
  const userTransactions = useMemo(() => {
    if (role === 'admin') return transactions;
    if (role === 'student' || role === 'teacher') {
      return transactions.filter(t => t.studentId === userId);
    }
    return []; // Parents see no transactions
  }, [transactions, role, userId]);

  // Get currently borrowed books
  const currentlyBorrowed = userTransactions.filter(t => t.status === 'borrowed' || t.status === 'overdue');
  
  // Get overdue books
  const overdueBooks = userTransactions.filter(t => t.status === 'overdue');

  const handleBorrowClick = (book: Book) => {
    setSelectedBook(book);
    
    // Validate borrowing
    const validation = validateBorrowing(role, userId, userName, book.id, book.title);
    
    if (!validation.allowed) {
      setValidationError(validation.error || 'Borrowing not allowed');
      console.log(`[LibrarySystem] Borrowing blocked: ${validation.reason}`);
    } else {
      setValidationError(null);
    }
    
    setIsBorrowDialogOpen(true);
  };

  const handleConfirmBorrow = () => {
    if (!selectedBook) return;

    const newTransaction: LibraryTransaction = {
      id: `trans-${Date.now()}`,
      bookId: selectedBook.id,
      studentId: userId,
      borrowedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
      returnedDate: null,
      status: 'borrowed',
      lateFine: 0,
    };

    setTransactions(prev => [...prev, newTransaction]);
    setIsBorrowDialogOpen(false);
    setSelectedBook(null);
    
    console.log(`[LibrarySystem] Book borrowed successfully: ${selectedBook.title}`);
    console.log(`[LibrarySystem] Transaction ID: ${newTransaction.id}`);
  };

  const isBookBorrowed = (bookId: string): boolean => {
    return currentlyBorrowed.some(t => t.bookId === bookId);
  };

  const getBookById = (bookId: string): Book | undefined => {
    return books.find(b => b.id === bookId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Library
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {isParent 
              ? 'Browse the library catalog (borrowing restricted)'
              : 'Browse and borrow books from the school library'}
          </p>
        </div>
      </div>

      {/* Parent Restriction Alert */}
      {isParent && (
        <Alert className="bg-red-50 border-red-200">
          <Ban className="w-4 h-4 text-red-600" />
          <AlertTitle className="text-red-800">Borrowing Restricted</AlertTitle>
          <AlertDescription className="text-red-700">
            Parents cannot borrow books from the library. This restriction ensures proper accountability and tracking.
            Check console logs for restriction demonstrations.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <BookOpen className="w-3 h-3" />
              Total Books
            </div>
            <p className="text-2xl font-bold">{books.reduce((sum, b) => sum + b.totalCopies, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <CheckCircle2 className="w-3 h-3" />
              Available
            </div>
            <p className="text-2xl font-bold">{books.reduce((sum, b) => sum + b.availableCopies, 0)}</p>
          </CardContent>
        </Card>
        {!isParent && (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <ArrowRightLeft className="w-3 h-3" />
                  My Books
                </div>
                <p className="text-2xl font-bold">{currentlyBorrowed.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <AlertCircle className="w-3 h-3" />
                  Overdue
                </div>
                <p className={`text-2xl font-bold ${overdueBooks.length > 0 ? 'text-red-600' : ''}`}>
                  {overdueBooks.length}
                </p>
              </CardContent>
            </Card>
          </>
        )}
        {isParent && (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Lock className="w-3 h-3" />
                  Borrowing
                </div>
                <p className="text-sm font-medium text-red-600">Not Allowed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <History className="w-3 h-3" />
                  History
                </div>
                <p className="text-sm font-medium text-muted-foreground">No Access</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="catalog">
            <BookOpen className="w-4 h-4 mr-2" />
            Catalog
          </TabsTrigger>
          {!isParent && (
            <TabsTrigger value="transactions">
              <History className="w-4 h-4 mr-2" />
              My Books
              {currentlyBorrowed.length > 0 && (
                <Badge variant="secondary" className="ml-2">{currentlyBorrowed.length}</Badge>
              )}
            </TabsTrigger>
          )}
          {overdueBooks.length > 0 && !isParent && (
            <TabsTrigger value="overdue">
              <AlertCircle className="w-4 h-4 mr-2" />
              Overdue
              <Badge variant="destructive" className="ml-2">{overdueBooks.length}</Badge>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Catalog Tab */}
        <TabsContent value="catalog" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {(CATEGORIES || []).map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Books Grid */}
          {filteredBooks.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="w-8 h-8 text-muted-foreground" />}
              title="No books found"
              description="Try adjusting your search or filter criteria"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(filteredBooks || []).map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  role={role}
                  userId={userId}
                  userName={userName}
                  onBorrow={handleBorrowClick}
                  isBorrowed={isBookBorrowed(book.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Transactions Tab */}
        {!isParent && (
          <TabsContent value="transactions" className="space-y-4">
            {userTransactions.length === 0 ? (
              <EmptyState
                icon={<History className="w-8 h-8 text-muted-foreground" />}
                title="No borrowing history"
                description="You haven't borrowed any books yet"
              />
            ) : (
              <div className="space-y-3">
                {(userTransactions || []).map(transaction => {
                  const book = getBookById(transaction.bookId);
                  if (!book) return null;
                  return (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      book={book}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
        )}

        {/* Overdue Tab */}
        {!isParent && overdueBooks.length > 0 && (
          <TabsContent value="overdue" className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Overdue Books</AlertTitle>
              <AlertDescription>
                You have {overdueBooks.length} overdue book(s). Please return them as soon as possible to avoid additional fines.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              {(overdueBooks || []).map(transaction => {
                const book = getBookById(transaction.bookId);
                if (!book) return null;
                return (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    book={book}
                  />
                );
              })}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Borrow Dialog */}
      <BorrowDialog
        isOpen={isBorrowDialogOpen}
        onClose={() => {
          setIsBorrowDialogOpen(false);
          setSelectedBook(null);
          setValidationError(null);
        }}
        onConfirm={handleConfirmBorrow}
        book={selectedBook}
        role={role}
        validationError={validationError}
      />
    </div>
  );
};

export default LibrarySystem;
