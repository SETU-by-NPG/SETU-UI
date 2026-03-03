/**
 * SETU Education Management System - Feature 18: Ticket System with Parent Restrictions
 * Support ticket creation and management with strict parent blocking
 * 
 * CRITICAL RESTRICTIONS:
 * - BLOCK all parent ticket submissions
 * - Show clear messaging: "Parents cannot submit tickets"
 * - Display ticket management for allowed roles (students/teachers/admins)
 * - Track ticket status (open/in-progress/resolved/closed)
 * - Assignment tracking
 * - Console logs showing blocked attempts
 * 
 * PHASE 3 ENHANCEMENTS:
 * - Admin interface to manage priority levels (Low, Medium, High, Critical)
 * - Admin interface to manage ticket categories (IT Support, Maintenance, Academic, Administrative, etc.)
 * - Priority color coding (Critical=red, High=orange, Medium=yellow, Low=blue)
 * - Dynamic priority and category configuration
 */

import React, { useState, useMemo } from 'react';
import {
  TicketCheck,
  Plus,
  Search,
  X,
  AlertCircle,
  Clock,
  CheckCircle,
  Filter,
  Ban,
  Lock,
  ShieldAlert,
  User,
  Calendar,
  Tag,
  MessageSquare,
  Send,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  Users,
  Settings,
  Palette,
  FolderOpen,
  Flag,
  PlusCircle,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { EmptyState } from '../empty-state';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import type { Role, Ticket, TicketStatus, TicketPriority, TicketCategory } from '../../types';

// ==================== TYPES ====================

interface TicketSystemProps {
  role: Role;
  userId?: string;
  userName?: string;
}

interface TicketFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
}

interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  content: string;
  createdAt: string;
}

// Priority configuration type with color coding
interface PriorityConfig {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description?: string;
  isDefault?: boolean;
}

// Category configuration type
interface CategoryConfig {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  isDefault?: boolean;
}

// ==================== MOCK DATA ====================

// Default priorities with color coding (Critical=red, High=orange, Medium=yellow, Low=blue)
const DEFAULT_PRIORITIES: PriorityConfig[] = [
  { 
    id: 'critical', 
    label: 'Critical', 
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    description: 'Urgent issues requiring immediate attention',
    isDefault: true
  },
  { 
    id: 'high', 
    label: 'High', 
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    description: 'Important issues to be resolved quickly',
    isDefault: true
  },
  { 
    id: 'medium', 
    label: 'Medium', 
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
    description: 'Standard priority issues',
    isDefault: true
  },
  { 
    id: 'low', 
    label: 'Low', 
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    description: 'Minor issues that can be addressed when convenient',
    isDefault: true
  },
];

// Default categories
const DEFAULT_CATEGORIES: CategoryConfig[] = [
  { id: 'it', label: 'IT Support', description: 'Technical issues, software, hardware', isDefault: true },
  { id: 'facility', label: 'Maintenance', description: 'Building maintenance, facilities', isDefault: true },
  { id: 'academic', label: 'Academic', description: 'Course-related, assignments, exams', isDefault: true },
  { id: 'admin', label: 'Administrative', description: 'Registration, fees, general admin', isDefault: true },
  { id: 'other', label: 'Other', description: 'Miscellaneous inquiries', isDefault: true },
];

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'ticket-001',
    title: 'Cannot access online portal',
    description: 'I am unable to log in to the student portal. It keeps showing an error message.',
    category: 'it',
    priority: 'high',
    status: 'open',
    createdBy: 'student-001',
    createdByRole: 'student',
    assignedTo: 'admin-001',
    createdAt: '2025-02-28T10:00:00Z',
    isBlocked: false,
  },
  {
    id: 'ticket-002',
    title: 'Projector not working in Room 203',
    description: 'The projector in Room 203 is not displaying any image. Need urgent repair.',
    category: 'facility',
    priority: 'critical',
    status: 'in_progress',
    createdBy: 'teacher-001',
    createdByRole: 'teacher',
    assignedTo: 'admin-002',
    createdAt: '2025-02-27T14:30:00Z',
    resolvedAt: undefined,
    isBlocked: false,
  },
  {
    id: 'ticket-003',
    title: 'Request for assignment extension',
    description: 'Due to medical reasons, I need an extension for the Math assignment due this week.',
    category: 'academic',
    priority: 'medium',
    status: 'resolved',
    createdBy: 'student-002',
    createdByRole: 'student',
    assignedTo: 'teacher-001',
    createdAt: '2025-02-25T09:00:00Z',
    resolvedAt: '2025-02-26T16:00:00Z',
    isBlocked: false,
  },
  {
    id: 'ticket-004',
    title: 'Library book return issue',
    description: 'I returned a book last week but it still shows as borrowed in my account.',
    category: 'admin',
    priority: 'low',
    status: 'closed',
    createdBy: 'student-001',
    createdByRole: 'student',
    assignedTo: 'admin-003',
    createdAt: '2025-02-20T11:00:00Z',
    resolvedAt: '2025-02-22T10:00:00Z',
    isBlocked: false,
  },
  {
    id: 'ticket-005',
    title: 'WiFi connectivity issues',
    description: 'The WiFi in the science block is very slow and keeps disconnecting.',
    category: 'it',
    priority: 'medium',
    status: 'open',
    createdBy: 'teacher-002',
    createdByRole: 'teacher',
    assignedTo: undefined,
    createdAt: '2025-02-26T13:00:00Z',
    isBlocked: false,
  },
];

const MOCK_COMMENTS: TicketComment[] = [
  {
    id: 'comment-001',
    ticketId: 'ticket-001',
    authorId: 'admin-001',
    authorName: 'Admin User',
    authorRole: 'admin',
    content: 'We are looking into this issue. Please try clearing your browser cache in the meantime.',
    createdAt: '2025-02-28T11:00:00Z',
  },
  {
    id: 'comment-002',
    ticketId: 'ticket-002',
    authorId: 'admin-002',
    authorName: 'IT Support',
    authorRole: 'admin',
    content: 'Technician has been dispatched to check the projector.',
    createdAt: '2025-02-27T15:00:00Z',
  },
];

const MOCK_ADMINS = [
  { id: 'admin-001', name: 'IT Support Team' },
  { id: 'admin-002', name: 'Facilities Manager' },
  { id: 'admin-003', name: 'Academic Coordinator' },
];

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validates if a user can submit tickets
 * PARENTS ARE BLOCKED from submitting tickets
 */
const validateTicketSubmission = (
  role: Role,
  userId: string,
  userName: string
): { allowed: boolean; error?: string; reason?: string } => {
  console.log(`[TicketSystem] Ticket submission validation - Role: ${role}, User: ${userName}`);

  // BLOCK parents from submitting tickets
  if (role === 'parent') {
    const reason = 'Parents cannot submit tickets';
    console.log(`[TicketSystem] BLOCKED: ${reason}`);
    console.log(`[TicketSystem] Attempted by: ${userName} (${userId})`);
    console.log(`[TicketSystem] Only students, teachers, and admins can submit tickets`);
    return { allowed: false, error: reason, reason };
  }

  // Students, teachers, and admins can submit tickets
  if (role === 'student' || role === 'teacher' || role === 'admin') {
    console.log(`[TicketSystem] ALLOWED: ${role} can submit tickets`);
    return { allowed: true };
  }

  // Unknown role
  const reason = 'Invalid user role';
  console.log(`[TicketSystem] BLOCKED: ${reason}`);
  return { allowed: false, error: reason, reason };
};

// ==================== HELPER FUNCTIONS ====================

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; icon: React.ReactNode }> = {
  open: { 
    label: 'Open', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: <AlertCircle className="w-3 h-3" />
  },
  in_progress: { 
    label: 'In Progress', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <Clock className="w-3 h-3" />
  },
  resolved: { 
    label: 'Resolved', 
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckCircle className="w-3 h-3" />
  },
  closed: { 
    label: 'Closed', 
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: <X className="w-3 h-3" />
  },
};

// ==================== SUB-COMPONENTS ====================

/**
 * Priority Management Dialog
 * Admin interface to manage priority levels
 */
const PriorityManagementDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  priorities: PriorityConfig[];
  onUpdatePriorities: (priorities: PriorityConfig[]) => void;
}> = ({ isOpen, onClose, priorities, onUpdatePriorities }) => {
  const [localPriorities, setLocalPriorities] = useState<PriorityConfig[]>(priorities);
  const [editingPriority, setEditingPriority] = useState<PriorityConfig | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const colorOptions = [
    { id: 'red', label: 'Red', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    { id: 'orange', label: 'Orange', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
    { id: 'amber', label: 'Amber', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    { id: 'yellow', label: 'Yellow', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
    { id: 'green', label: 'Green', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    { id: 'blue', label: 'Blue', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    { id: 'purple', label: 'Purple', bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    { id: 'pink', label: 'Pink', bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
    { id: 'gray', label: 'Gray', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
  ];

  const handleSave = () => {
    onUpdatePriorities(localPriorities);
    onClose();
  };

  const handleAddPriority = (priority: PriorityConfig) => {
    setLocalPriorities([...localPriorities, priority]);
    setIsAddingNew(false);
  };

  const handleUpdatePriority = (updatedPriority: PriorityConfig) => {
    setLocalPriorities(localPriorities.map(p => p.id === updatedPriority.id ? updatedPriority : p));
    setEditingPriority(null);
  };

  const handleDeletePriority = (priorityId: string) => {
    if (localPriorities.length <= 1) {
      alert('At least one priority level is required');
      return;
    }
    setLocalPriorities(localPriorities.filter(p => p.id !== priorityId));
  };

  const getColorOption = (colorId: string) => {
    return colorOptions.find(c => c.id === colorId) || colorOptions[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5" />
            Manage Priority Levels
          </DialogTitle>
          <DialogDescription>
            Add, edit, or remove ticket priority levels. Each priority can have a custom color for visual identification.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Priority List */}
          <div className="space-y-2">
            {localPriorities.map((priority) => (
              <div key={priority.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className={`w-4 h-4 rounded-full ${getColorOption(priority.bgColor.replace('bg-', '').replace('-100', '')).bg.replace('100', '500')}`} />
                <div className="flex-1">
                  <p className="font-medium">{priority.label}</p>
                  {priority.description && (
                    <p className="text-xs text-muted-foreground">{priority.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingPriority(priority)}
                    className="h-8 w-8"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  {!priority.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePriority(priority.id)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add New Button */}
          {!isAddingNew && !editingPriority && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsAddingNew(true)}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Priority
            </Button>
          )}

          {/* Add/Edit Form */}
          {(isAddingNew || editingPriority) && (
            <PriorityForm
              priority={editingPriority}
              colorOptions={colorOptions}
              onSave={editingPriority ? handleUpdatePriority : handleAddPriority}
              onCancel={() => {
                setIsAddingNew(false);
                setEditingPriority(null);
              }}
              existingIds={localPriorities.map(p => p.id)}
            />
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Priority Form Component
 */
const PriorityForm: React.FC<{
  priority: PriorityConfig | null;
  colorOptions: Array<{ id: string; label: string; bg: string; text: string; border: string }>;
  onSave: (priority: PriorityConfig) => void;
  onCancel: () => void;
  existingIds: string[];
}> = ({ priority, colorOptions, onSave, onCancel, existingIds }) => {
  const [formData, setFormData] = useState<PriorityConfig>({
    id: priority?.id || '',
    label: priority?.label || '',
    description: priority?.description || '',
    color: priority?.color || 'text-blue-700',
    bgColor: priority?.bgColor || 'bg-blue-100',
    borderColor: priority?.borderColor || 'border-blue-200',
    isDefault: priority?.isDefault || false,
  });

  const handleColorSelect = (colorId: string) => {
    const color = colorOptions.find(c => c.id === colorId);
    if (color) {
      setFormData({
        ...formData,
        color: color.text,
        bgColor: color.bg,
        borderColor: color.border,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.label) return;
    
    // Check for duplicate ID (only for new priorities)
    if (!priority && existingIds.includes(formData.id)) {
      alert('A priority with this ID already exists');
      return;
    }
    
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4 bg-muted/50">
      <h4 className="font-medium">{priority ? 'Edit Priority' : 'Add New Priority'}</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority-id">ID (unique key)</Label>
          <Input
            id="priority-id"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            placeholder="e.g., urgent"
            required
            disabled={!!priority}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority-label">Display Label</Label>
          <Input
            id="priority-label"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="e.g., Urgent"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority-description">Description (optional)</Label>
        <Input
          id="priority-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of when to use this priority"
        />
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => handleColorSelect(color.id)}
              className={`w-8 h-8 rounded-full ${color.bg.replace('100', '200')} border-2 transition-all ${
                formData.bgColor === color.bg ? 'border-foreground scale-110' : 'border-transparent'
              }`}
              title={color.label}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {priority ? 'Update Priority' : 'Add Priority'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

/**
 * Category Management Dialog
 * Admin interface to manage ticket categories
 */
const CategoryManagementDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryConfig[];
  onUpdateCategories: (categories: CategoryConfig[]) => void;
}> = ({ isOpen, onClose, categories, onUpdateCategories }) => {
  const [localCategories, setLocalCategories] = useState<CategoryConfig[]>(categories);
  const [editingCategory, setEditingCategory] = useState<CategoryConfig | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleSave = () => {
    onUpdateCategories(localCategories);
    onClose();
  };

  const handleAddCategory = (category: CategoryConfig) => {
    setLocalCategories([...localCategories, category]);
    setIsAddingNew(false);
  };

  const handleUpdateCategory = (updatedCategory: CategoryConfig) => {
    setLocalCategories(localCategories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (localCategories.length <= 1) {
      alert('At least one category is required');
      return;
    }
    setLocalCategories(localCategories.filter(c => c.id !== categoryId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Manage Ticket Categories
          </DialogTitle>
          <DialogDescription>
            Add, edit, or remove ticket categories. Categories help organize and route tickets to the appropriate teams.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category List */}
          <div className="space-y-2">
            {localCategories.map((category) => (
              <div key={category.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{category.label}</p>
                  {category.description && (
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingCategory(category)}
                    className="h-8 w-8"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  {!category.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add New Button */}
          {!isAddingNew && !editingCategory && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsAddingNew(true)}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Category
            </Button>
          )}

          {/* Add/Edit Form */}
          {(isAddingNew || editingCategory) && (
            <CategoryForm
              category={editingCategory}
              onSave={editingCategory ? handleUpdateCategory : handleAddCategory}
              onCancel={() => {
                setIsAddingNew(false);
                setEditingCategory(null);
              }}
              existingIds={localCategories.map(c => c.id)}
            />
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Category Form Component
 */
const CategoryForm: React.FC<{
  category: CategoryConfig | null;
  onSave: (category: CategoryConfig) => void;
  onCancel: () => void;
  existingIds: string[];
}> = ({ category, onSave, onCancel, existingIds }) => {
  const [formData, setFormData] = useState<CategoryConfig>({
    id: category?.id || '',
    label: category?.label || '',
    description: category?.description || '',
    isDefault: category?.isDefault || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.label) return;
    
    // Check for duplicate ID (only for new categories)
    if (!category && existingIds.includes(formData.id)) {
      alert('A category with this ID already exists');
      return;
    }
    
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4 bg-muted/50">
      <h4 className="font-medium">{category ? 'Edit Category' : 'Add New Category'}</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category-id">ID (unique key)</Label>
          <Input
            id="category-id"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            placeholder="e.g., library"
            required
            disabled={!!category}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category-label">Display Label</Label>
          <Input
            id="category-label"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="e.g., Library Services"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-description">Description (optional)</Label>
        <Input
          id="category-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of what this category covers"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {category ? 'Update Category' : 'Add Category'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

/**
 * Ticket Card Component
 */
const TicketCard: React.FC<{
  ticket: Ticket;
  role: Role;
  userId: string;
  onView: (ticket: Ticket) => void;
  onUpdateStatus?: (ticketId: string, status: TicketStatus) => void;
  onAssign?: (ticketId: string, adminId: string) => void;
  priorities: PriorityConfig[];
  categories: CategoryConfig[];
}> = ({ ticket, role, userId, onView, onUpdateStatus, onAssign, priorities, categories }) => {
  const status = STATUS_CONFIG[ticket.status];
  const priority = priorities.find(p => p.id === ticket.priority) || priorities[0];
  const category = categories.find(c => c.id === ticket.category) || categories[0];
  const isAdmin = role === 'admin';
  const isCreator = ticket.createdBy === userId;
  const canManage = isAdmin || (role === 'teacher' && ticket.category === 'academic');

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView(ticket)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={status.color}>
                <span className="flex items-center gap-1">
                  {status.icon}
                  {status.label}
                </span>
              </Badge>
              {priority && (
                <Badge variant="outline" className={`${priority.bgColor} ${priority.color} ${priority.borderColor}`}>
                  <Flag className="w-3 h-3 mr-1" />
                  {priority.label}
                </Badge>
              )}
              {category && (
                <Badge variant="outline">
                  <Tag className="w-3 h-3 mr-1" />
                  {category.label}
                </Badge>
              )}
            </div>

            <h4 className="font-medium truncate">{ticket.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {ticket.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {ticket.createdByRole}: {ticket.createdBy}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(ticket.createdAt)}
              </span>
              {ticket.assignedTo && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Assigned: {ticket.assignedTo}
                </span>
              )}
            </div>
          </div>

          {canManage && (
            <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
              <Select
                value={ticket.status}
                onValueChange={(value) => onUpdateStatus?.(ticket.id, value as TicketStatus)}
              >
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              {!ticket.assignedTo && (
                <Select
                  onValueChange={(value) => onAssign?.(ticket.id, value)}
                >
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <span>Assign To</span>
                  </SelectTrigger>
                  <SelectContent>
                    {(MOCK_ADMINS || []).map(admin => (
                      <SelectItem key={admin.id} value={admin.id}>{admin.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Create Ticket Dialog
 */
const CreateTicketDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TicketFormData) => void;
  role: Role;
  validationError: string | null;
  priorities: PriorityConfig[];
  categories: CategoryConfig[];
}> = ({ isOpen, onClose, onSubmit, role, validationError, priorities, categories }) => {
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    category: categories[0]?.id || 'other',
    priority: priorities.find(p => p.id === 'medium')?.id || priorities[0]?.id || 'medium',
  });

  const isParent = role === 'parent';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isParent ? <Ban className="w-5 h-5 text-red-500" /> : <TicketCheck className="w-5 h-5" />}
            {isParent ? 'Submission Not Allowed' : 'Submit Support Ticket'}
          </DialogTitle>
          <DialogDescription>
            {isParent 
              ? 'You are not permitted to submit support tickets.' 
              : 'Describe your issue and we will help you resolve it.'}
          </DialogDescription>
        </DialogHeader>

        {isParent ? (
          <div className="py-4">
            <Alert variant="destructive">
              <Ban className="w-4 h-4" />
              <AlertTitle>Action Blocked</AlertTitle>
              <AlertDescription>
                Parents cannot submit tickets. Please contact the school administration directly if you need assistance.
              </AlertDescription>
            </Alert>

            <Alert className="mt-4 bg-amber-50 border-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Parent Restriction</AlertTitle>
              <AlertDescription className="text-amber-700">
                This restriction is in place to ensure proper ticket management and accountability. 
                Parents should contact the school office for any concerns.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {validationError && (
              <Alert variant="destructive">
                <Ban className="w-4 h-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Brief summary of the issue..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority.id} value={priority.id}>
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${priority.bgColor.replace('100', '500')}`} />
                          {priority.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of your issue..."
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!!validationError}>
                <Send className="w-4 h-4 mr-2" />
                Submit Ticket
              </Button>
            </DialogFooter>
          </form>
        )}

        {isParent && (
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

/**
 * Ticket Detail Dialog
 */
const TicketDetailDialog: React.FC<{
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  comments: TicketComment[];
  role: Role;
  userId: string;
  onAddComment: (ticketId: string, content: string) => void;
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void;
  priorities: PriorityConfig[];
  categories: CategoryConfig[];
}> = ({ ticket, isOpen, onClose, comments, role, userId, onAddComment, onUpdateStatus, priorities, categories }) => {
  const [newComment, setNewComment] = useState('');
  
  if (!ticket) return null;

  const ticketComments = comments.filter(c => c.ticketId === ticket.id);
  const status = STATUS_CONFIG[ticket.status];
  const priority = priorities.find(p => p.id === ticket.priority);
  const category = categories.find(c => c.id === ticket.category);
  const isAdmin = role === 'admin';
  const canComment = role !== 'parent';

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(ticket.id, newComment);
    setNewComment('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={status.color}>
              <span className="flex items-center gap-1">
                {status.icon}
                {status.label}
              </span>
            </Badge>
            {priority && (
              <Badge variant="outline" className={`${priority.bgColor} ${priority.color} ${priority.borderColor}`}>
                <Flag className="w-3 h-3 mr-1" />
                {priority.label}
              </Badge>
            )}
            {category && (
              <Badge variant="outline">
                {category.label}
              </Badge>
            )}
          </div>
          <DialogTitle>{ticket.title}</DialogTitle>
          <DialogDescription>
            Created by {ticket.createdByRole} on {formatDate(ticket.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Description */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-sm">{ticket.description}</p>
          </div>

          {/* Status Update (Admin only) */}
          {isAdmin && (
            <div className="flex items-center gap-3">
              <Label>Update Status:</Label>
              <Select
                value={ticket.status}
                onValueChange={(value) => onUpdateStatus(ticket.id, value as TicketStatus)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Comments */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comments ({ticketComments.length})
            </h4>

            {ticketComments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            ) : (
              <div className="space-y-3">
                {(ticketComments || []).map(comment => (
                  <div key={comment.id} className={`p-3 rounded-lg ${
                    comment.authorId === userId ? 'bg-primary/10 ml-8' : 'bg-muted mr-8'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {comment.authorName} ({comment.authorRole})
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            {canComment && (
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!newComment.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ==================== MAIN COMPONENT ====================

export const TicketSystem: React.FC<TicketSystemProps> = ({
  role,
  userId = 'user-001',
  userName = 'Current User',
}) => {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [comments, setComments] = useState<TicketComment[]>(MOCK_COMMENTS);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  
  // Phase 3: Priority and Category Management State
  const [priorities, setPriorities] = useState<PriorityConfig[]>(DEFAULT_PRIORITIES);
  const [categories, setCategories] = useState<CategoryConfig[]>(DEFAULT_CATEGORIES);
  const [isPriorityDialogOpen, setIsPriorityDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  // Console log role and restrictions
  console.log(`[TicketSystem] Initialized with role: ${role}`);
  console.log(`[TicketSystem] User: ${userName} (${userId})`);
  console.log(`[TicketSystem] Parent ticket submission: ${role === 'parent' ? 'BLOCKED' : 'ALLOWED'}`);

  const isParent = role === 'parent';
  const canSubmitTickets = role !== 'parent';
  const isAdmin = role === 'admin';

  // Filter tickets
  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Non-admins only see their own tickets or assigned tickets
    if (!isAdmin) {
      filtered = filtered.filter(t => 
        t.createdBy === userId || 
        t.assignedTo === userId ||
        (role === 'teacher' && t.category === 'academic')
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tickets, isAdmin, userId, role, statusFilter, searchQuery]);

  // Stats
  const stats = {
    total: tickets.filter(t => isAdmin || t.createdBy === userId).length,
    open: tickets.filter(t => (isAdmin || t.createdBy === userId) && t.status === 'open').length,
    inProgress: tickets.filter(t => (isAdmin || t.createdBy === userId) && t.status === 'in_progress').length,
    resolved: tickets.filter(t => (isAdmin || t.createdBy === userId) && (t.status === 'resolved' || t.status === 'closed')).length,
  };

  const handleCreateTicket = (formData: TicketFormData) => {
    // Validate
    const validation = validateTicketSubmission(role, userId, userName);
    
    if (!validation.allowed) {
      setValidationError(validation.error || 'Cannot submit ticket');
      console.log(`[TicketSystem] Ticket submission blocked: ${validation.reason}`);
      return;
    }

    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category as TicketCategory,
      priority: formData.priority as TicketPriority,
      status: 'open',
      createdBy: userId,
      createdByRole: role,
      assignedTo: undefined,
      createdAt: new Date().toISOString(),
      isBlocked: false,
    };

    setTickets(prev => [newTicket, ...prev]);
    setIsCreateDialogOpen(false);
    setValidationError(null);
    
    console.log(`[TicketSystem] Ticket created successfully: ${newTicket.id}`);
  };

  const handleUpdateStatus = (ticketId: string, status: TicketStatus) => {
    console.log(`[TicketSystem] Updating ticket ${ticketId} status to ${status}`);
    setTickets(prev => prev.map(t => 
      t.id === ticketId 
        ? { 
            ...t, 
            status,
            resolvedAt: status === 'resolved' || status === 'closed' ? new Date().toISOString() : t.resolvedAt
          } 
        : t
    ));
  };

  const handleAssign = (ticketId: string, adminId: string) => {
    console.log(`[TicketSystem] Assigning ticket ${ticketId} to ${adminId}`);
    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, assignedTo: adminId } : t
    ));
  };

  const handleAddComment = (ticketId: string, content: string) => {
    const newComment: TicketComment = {
      id: `comment-${Date.now()}`,
      ticketId,
      authorId: userId,
      authorName: userName,
      authorRole: role,
      content,
      createdAt: new Date().toISOString(),
    };

    setComments(prev => [...prev, newComment]);
    console.log(`[TicketSystem] Comment added to ticket ${ticketId}`);
  };

  const openCreateDialog = () => {
    // Check if parent
    if (isParent) {
      console.log(`[TicketSystem] Parent ${userName} attempted to open ticket creation dialog`);
    }
    setValidationError(null);
    setIsCreateDialogOpen(true);
  };

  const openDetailDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TicketCheck className="w-6 h-6" />
            Support Tickets
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {isParent 
              ? 'View ticket information (submission restricted)'
              : 'Submit and track support requests'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Admin Settings */}
          {isAdmin && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Admin Settings</p>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setIsPriorityDialogOpen(true)}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Manage Priorities
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setIsCategoryDialogOpen(true)}
                  >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Manage Categories
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
          
          <Button 
            onClick={openCreateDialog} 
            className="shrink-0"
            variant={isParent ? 'outline' : 'default'}
          >
            {isParent ? <Lock className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {isParent ? 'New Ticket (Restricted)' : 'New Ticket'}
          </Button>
        </div>
      </div>

      {/* Parent Restriction Alert */}
      {isParent && (
        <Alert className="bg-red-50 border-red-200">
          <Ban className="w-4 h-4 text-red-600" />
          <AlertTitle className="text-red-800">Ticket Submission Restricted</AlertTitle>
          <AlertDescription className="text-red-700">
            Parents cannot submit support tickets. Please contact the school administration directly 
            for any assistance. Check console logs for restriction demonstrations.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      {!isParent && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <TicketCheck className="w-3 h-3" />
                Total
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <AlertCircle className="w-3 h-3 text-yellow-500" />
                Open
              </div>
              <p className="text-2xl font-bold">{stats.open}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Clock className="w-3 h-3 text-blue-500" />
                In Progress
              </div>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Resolved
              </div>
              <p className="text-2xl font-bold">{stats.resolved}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {!isParent && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TicketStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Tickets List */}
      {isParent ? (
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Access Limited</AlertTitle>
          <AlertDescription>
            Parents do not have access to the ticket system. Please contact the school office directly.
          </AlertDescription>
        </Alert>
      ) : filteredTickets.length === 0 ? (
        <EmptyState
          icon={<TicketCheck className="w-8 h-8 text-muted-foreground" />}
          title="No tickets found"
          description="Submit a new ticket to get support"
        />
      ) : (
        <div className="space-y-3">
          {filteredTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              role={role}
              userId={userId}
              onView={openDetailDialog}
              onUpdateStatus={isAdmin ? handleUpdateStatus : undefined}
              onAssign={isAdmin ? handleAssign : undefined}
              priorities={priorities}
              categories={categories}
            />
          ))}
        </div>
      )}

      {/* Create Ticket Dialog */}
      <CreateTicketDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setValidationError(null);
        }}
        onSubmit={handleCreateTicket}
        role={role}
        validationError={validationError}
        priorities={priorities}
        categories={categories}
      />

      {/* Ticket Detail Dialog */}
      <TicketDetailDialog
        ticket={selectedTicket}
        isOpen={isDetailDialogOpen}
        onClose={() => {
          setIsDetailDialogOpen(false);
          setSelectedTicket(null);
        }}
        comments={comments}
        role={role}
        userId={userId}
        onAddComment={handleAddComment}
        onUpdateStatus={handleUpdateStatus}
        priorities={priorities}
        categories={categories}
      />

      {/* Priority Management Dialog */}
      <PriorityManagementDialog
        isOpen={isPriorityDialogOpen}
        onClose={() => setIsPriorityDialogOpen(false)}
        priorities={priorities}
        onUpdatePriorities={setPriorities}
      />

      {/* Category Management Dialog */}
      <CategoryManagementDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        categories={categories}
        onUpdateCategories={setCategories}
      />
    </div>
  );
};

export default TicketSystem;
