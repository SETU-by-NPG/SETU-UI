/**
 * SETU Education Management System - Feature 15: Announcement System
 * Full announcement creation and management with role-based permissions
 * 
 * PHASE 3 ENHANCEMENTS:
 * - Multiple target audience selection (year groups, classes, specific users, roles)
 * - Target selection as tags/badges with remove option
 * - File attachment functionality with drag-and-drop
 * - File upload UI with preview and remove option
 * - File type validation display (PDF, DOC, images, etc.)
 * - Updated mock data with file attachments
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Megaphone,
  Plus,
  X,
  Calendar,
  Users,
  Clock,
  Edit3,
  Trash2,
  Archive,
  Send,
  Eye,
  Filter,
  Search,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  FileText,
  Paperclip,
  Upload,
  File,
  Image,
  FileSpreadsheet,
  FileCode,
  XCircle,
  GraduationCap,
  User,
  UserCog,
  Target,
  Check
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { EmptyState } from '../empty-state';
import { Checkbox } from '../ui/checkbox';
import type { Role, Announcement, TargetType, PublishType, AnnouncementStatus } from '../../types';

// ==================== TYPES ====================

interface AnnouncementSystemProps {
  role: Role;
  userId?: string;
  userName?: string;
  classId?: string;
}

interface AnnouncementFormData {
  title: string;
  message: string;
  targetType: TargetType;
  targetIds: string[];
  targetRoles: Role[];
  publishType: PublishType;
  publishAt?: string;
  attachments: Attachment[];
}

// File attachment type
interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

// Extended announcement type with attachments
interface AnnouncementWithAttachments extends Announcement {
  attachments?: Attachment[];
}

// Target selection option
interface TargetOption {
  id: string;
  label: string;
  type: 'year' | 'class' | 'user' | 'role';
  icon?: React.ReactNode;
}

// ==================== MOCK DATA ====================

const MOCK_CLASSES: TargetOption[] = [
  { id: 'class-009', label: 'Grade 9 - A', type: 'class', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'class-010', label: 'Grade 10 - A', type: 'class', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'class-011', label: 'Grade 11 - A', type: 'class', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'class-012', label: 'Grade 12 - A', type: 'class', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'class-013', label: 'Grade 9 - B', type: 'class', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'class-014', label: 'Grade 10 - B', type: 'class', icon: <GraduationCap className="w-4 h-4" /> },
];

const MOCK_YEAR_GROUPS: TargetOption[] = [
  { id: 'year-9', label: 'Grade 9 (All Sections)', type: 'year', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'year-10', label: 'Grade 10 (All Sections)', type: 'year', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'year-11', label: 'Grade 11 (All Sections)', type: 'year', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'year-12', label: 'Grade 12 (All Sections)', type: 'year', icon: <GraduationCap className="w-4 h-4" /> },
];

const MOCK_USERS: TargetOption[] = [
  { id: 'user-001', label: 'Mr. John Williams', type: 'user', icon: <User className="w-4 h-4" /> },
  { id: 'user-002', label: 'Ms. Rachel Adams', type: 'user', icon: <User className="w-4 h-4" /> },
  { id: 'user-003', label: 'Mr. David Chen', type: 'user', icon: <User className="w-4 h-4" /> },
  { id: 'user-004', label: 'Alice Johnson', type: 'user', icon: <User className="w-4 h-4" /> },
  { id: 'user-005', label: 'Bob Smith', type: 'user', icon: <User className="w-4 h-4" /> },
];

const ROLE_OPTIONS: TargetOption[] = [
  { id: 'teacher', label: 'All Teachers', type: 'role', icon: <UserCog className="w-4 h-4" /> },
  { id: 'student', label: 'All Students', type: 'role', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'parent', label: 'All Parents', type: 'role', icon: <Users className="w-4 h-4" /> },
  { id: 'admin', label: 'All Administrators', type: 'role', icon: <UserCog className="w-4 h-4" /> },
];

// Mock announcements with attachments
const generateMockAnnouncements = (): AnnouncementWithAttachments[] => [
  {
    id: 'ann-001',
    title: 'Mid-Term Examination Schedule',
    message: 'The mid-term examinations for all grades will commence from March 15th. Please check your individual timetables and ensure you have all necessary materials prepared.',
    authorId: 'admin-001',
    targetType: 'all',
    targetIds: [],
    publishType: 'immediate',
    status: 'published',
    createdAt: '2025-02-28T10:00:00Z',
    attachments: [
      {
        id: 'att-001',
        name: 'MidTerm_Schedule_2025.pdf',
        size: 2457600,
        type: 'application/pdf',
        url: '#',
        uploadedAt: '2025-02-28T10:00:00Z',
      },
      {
        id: 'att-002',
        name: 'Exam_Guidelines.docx',
        size: 512000,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        url: '#',
        uploadedAt: '2025-02-28T10:00:00Z',
      },
    ],
  },
  {
    id: 'ann-002',
    title: 'Science Fair 2025',
    message: 'Annual Science Fair registration is now open! All students from grades 9-12 are encouraged to participate. Deadline for submission is March 10th.',
    authorId: 'teacher-001',
    targetType: 'class',
    targetIds: ['class-009', 'class-010', 'class-011', 'class-012'],
    publishType: 'immediate',
    status: 'published',
    createdAt: '2025-02-27T14:30:00Z',
    attachments: [
      {
        id: 'att-003',
        name: 'Science_Fair_Poster.jpg',
        size: 1048576,
        type: 'image/jpeg',
        url: '#',
        uploadedAt: '2025-02-27T14:30:00Z',
      },
    ],
  },
  {
    id: 'ann-003',
    title: 'Parent-Teacher Meeting - Grade 10',
    message: 'Parent-Teacher meeting for Grade 10 students is scheduled for March 5th, 2:00 PM - 5:00 PM. Please confirm your attendance.',
    authorId: 'teacher-002',
    targetType: 'parent',
    targetIds: [],
    publishType: 'scheduled',
    publishAt: '2025-03-01T08:00:00Z',
    status: 'draft',
    createdAt: '2025-02-26T09:00:00Z',
    attachments: [],
  },
  {
    id: 'ann-004',
    title: 'Library Maintenance Notice',
    message: 'The school library will be closed for maintenance on March 3rd and 4th. All borrowed books due on these dates will have their due dates extended.',
    authorId: 'librarian-001',
    targetType: 'all',
    targetIds: [],
    publishType: 'immediate',
    status: 'archived',
    createdAt: '2025-02-20T11:00:00Z',
    attachments: [],
  },
  {
    id: 'ann-005',
    title: 'Sports Day Preparation',
    message: 'All students participating in Sports Day must attend the rehearsal on March 8th at 3:00 PM on the main ground.',
    authorId: 'teacher-003',
    targetType: 'student',
    targetIds: [],
    publishType: 'immediate',
    status: 'published',
    createdAt: '2025-02-25T15:00:00Z',
    attachments: [
      {
        id: 'att-004',
        name: 'Sports_Day_Events.xlsx',
        size: 15360,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        url: '#',
        uploadedAt: '2025-02-25T15:00:00Z',
      },
    ],
  },
];

// ==================== CONSTANTS ====================

const STATUS_CONFIG: Record<AnnouncementStatus, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { 
    label: 'Draft', 
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: <Edit3 className="w-3 h-3" />
  },
  published: { 
    label: 'Published', 
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <Send className="w-3 h-3" />
  },
  archived: { 
    label: 'Archived', 
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: <Archive className="w-3 h-3" />
  },
};

const TARGET_TYPE_LABELS: Record<TargetType, string> = {
  all: 'All Users',
  class: 'Specific Classes',
  teacher: 'Teachers Only',
  student: 'Students Only',
  parent: 'Parents Only',
};

// File type configurations
const FILE_TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  'application/pdf': { icon: <FileText className="w-5 h-5" />, color: 'text-red-500', label: 'PDF' },
  'image/jpeg': { icon: <Image className="w-5 h-5" />, color: 'text-blue-500', label: 'Image' },
  'image/png': { icon: <Image className="w-5 h-5" />, color: 'text-blue-500', label: 'Image' },
  'image/gif': { icon: <Image className="w-5 h-5" />, color: 'text-blue-500', label: 'Image' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { 
    icon: <FileText className="w-5 h-5" />, 
    color: 'text-blue-600', 
    label: 'Word' 
  },
  'application/msword': { icon: <FileText className="w-5 h-5" />, color: 'text-blue-600', label: 'Word' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { 
    icon: <FileSpreadsheet className="w-5 h-5" />, 
    color: 'text-green-600', 
    label: 'Excel' 
  },
  'application/vnd.ms-excel': { icon: <FileSpreadsheet className="w-5 h-5" />, color: 'text-green-600', label: 'Excel' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { 
    icon: <File className="w-5 h-5" />, 
    color: 'text-orange-500', 
    label: 'PowerPoint' 
  },
  'text/plain': { icon: <FileCode className="w-5 h-5" />, color: 'text-gray-500', label: 'Text' },
};

// Allowed file types for upload
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileConfig = (type: string) => {
  return FILE_TYPE_CONFIG[type] || { icon: <File className="w-5 h-5" />, color: 'text-gray-500', label: 'File' };
};

const canCreateAnnouncement = (role: Role): boolean => {
  return role === 'admin' || role === 'teacher';
};

const canEditAnnouncement = (role: Role, announcement: Announcement, userId?: string): boolean => {
  if (role === 'admin') return true;
  if (role === 'teacher' && announcement.authorId === userId) return true;
  return false;
};

const isAnnouncementVisibleToUser = (announcement: Announcement, role: Role, classId?: string): boolean => {
  if (announcement.targetType === 'all') return true;
  if (announcement.targetType === role) return true;
  if (announcement.targetType === 'class' && classId && announcement.targetIds.includes(classId)) return true;
  return false;
};

// ==================== SUB-COMPONENTS ====================

/**
 * File Upload Component
 */
const FileUpload: React.FC<{
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
}> = ({ attachments, onAttachmentsChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `File type not allowed. Allowed types: PDF, Images, Word, Excel, PowerPoint, Text`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size: 10MB`;
    }
    return null;
  };

  const handleFiles = (files: FileList | null) => {
    setUploadError(null);
    if (!files) return;

    const newAttachments: Attachment[] = [];
    
    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }

      newAttachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
      });
    });

    onAttachmentsChange([...attachments, ...newAttachments]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [attachments]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = ''; // Reset input
  };

  const removeAttachment = (id: string) => {
    onAttachmentsChange(attachments.filter(att => att.id !== id));
  };

  return (
    <div className="space-y-3">
      <Label>Attachments</Label>
      
      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-1">
          Drag and drop files here, or{' '}
          <label className="text-primary cursor-pointer hover:underline">
            browse
            <input
              type="file"
              multiple
              accept={ALLOWED_FILE_TYPES.join(',')}
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </p>
        <p className="text-xs text-muted-foreground">
          Supported: PDF, Images, Word, Excel, PowerPoint, Text (Max 10MB)
        </p>
      </div>

      {/* Error Message */}
      {uploadError && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="text-xs">{uploadError}</AlertDescription>
        </Alert>
      )}

      {/* File List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((attachment) => {
            const config = getFileConfig(attachment.type);
            return (
              <div
                key={attachment.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
              >
                <div className={`${config.color}`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {config.label} • {formatFileSize(attachment.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAttachment(attachment.id)}
                  className="h-8 w-8 text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * Multi-Target Selection Component
 */
const MultiTargetSelector: React.FC<{
  selectedTargets: TargetOption[];
  onChange: (targets: TargetOption[]) => void;
}> = ({ selectedTargets, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'years' | 'classes' | 'users' | 'roles'>('all');

  const allOptions = [...MOCK_YEAR_GROUPS, ...MOCK_CLASSES, ...MOCK_USERS, ...ROLE_OPTIONS];

  const filteredOptions = allOptions.filter(option => {
    const matchesSearch = option.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'years' && option.type === 'year') ||
      (activeTab === 'classes' && option.type === 'class') ||
      (activeTab === 'users' && option.type === 'user') ||
      (activeTab === 'roles' && option.type === 'role');
    return matchesSearch && matchesTab;
  });

  const isSelected = (option: TargetOption) => {
    return selectedTargets.some(t => t.id === option.id);
  };

  const toggleTarget = (option: TargetOption) => {
    if (isSelected(option)) {
      onChange(selectedTargets.filter(t => t.id !== option.id));
    } else {
      onChange([...selectedTargets, option]);
    }
  };

  const removeTarget = (id: string) => {
    onChange(selectedTargets.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-4">
      <Label>Target Audience</Label>
      
      {/* Selected Targets Tags */}
      {selectedTargets.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
          {selectedTargets.map(target => (
            <Badge
              key={target.id}
              variant="secondary"
              className="flex items-center gap-1 pr-1"
            >
              {target.icon}
              <span className="ml-1">{target.label}</span>
              <button
                type="button"
                onClick={() => removeTarget(target.id)}
                className="ml-1 p-0.5 hover:bg-muted rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search targets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'years', label: 'Year Groups' },
            { id: 'classes', label: 'Classes' },
            { id: 'users', label: 'Users' },
            { id: 'roles', label: 'Roles' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Options List */}
        <div className="border rounded-lg max-h-48 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No targets found
            </div>
          ) : (
            filteredOptions.map(option => {
              const selected = isSelected(option);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleTarget(option)}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left border-b last:border-b-0 ${
                    selected ? 'bg-primary/5' : ''
                  }`}
                >
                  <Checkbox
                    checked={selected}
                  />
                  <span className="text-muted-foreground">{option.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{option.label}</p>
                    <p className="text-xs text-muted-foreground capitalize">{option.type}</p>
                  </div>
                  {selected && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {selectedTargets.length} target{selectedTargets.length !== 1 ? 's' : ''} selected
        </p>
      </div>
    </div>
  );
};

// Alert component for file upload
const Alert: React.FC<{ variant?: 'default' | 'destructive'; className?: string; children: React.ReactNode }> = ({ 
  variant = 'default', 
  className = '', 
  children 
}) => (
  <div className={`p-3 rounded-lg flex items-start gap-2 ${
    variant === 'destructive' 
      ? 'bg-destructive/10 text-destructive border border-destructive/20' 
      : 'bg-muted border'
  } ${className}`}>
    {children}
  </div>
);

const AlertDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <p className={`text-sm ${className}`}>{children}</p>
);

/**
 * Create/Edit Announcement Modal
 */
const AnnouncementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AnnouncementFormData) => void;
  initialData?: AnnouncementWithAttachments;
  mode: 'create' | 'edit';
}> = ({ isOpen, onClose, onSave, initialData, mode }) => {
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: initialData?.title || '',
    message: initialData?.message || '',
    targetType: initialData?.targetType || 'all',
    targetIds: initialData?.targetIds || [],
    targetRoles: [],
    publishType: initialData?.publishType || 'immediate',
    publishAt: initialData?.publishAt || '',
    attachments: initialData?.attachments || [],
  });
  const [selectedTargets, setSelectedTargets] = useState<TargetOption[]>([]);

  // Convert initial targetIds to TargetOptions
  React.useEffect(() => {
    if (initialData?.targetIds && initialData.targetIds.length > 0) {
      const allOptions = [...MOCK_YEAR_GROUPS, ...MOCK_CLASSES, ...MOCK_USERS, ...ROLE_OPTIONS];
      const initialTargets = initialData.targetIds
        .map(id => allOptions.find(opt => opt.id === id))
        .filter((opt): opt is TargetOption => opt !== undefined);
      setSelectedTargets(initialTargets);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      targetIds: selectedTargets.map(t => t.id),
    });
    onClose();
  };

  const handleTargetTypeChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      targetType: value as TargetType,
      targetIds: [],
    }));
    setSelectedTargets([]);
  };

  const handleClassSelection = (classId: string) => {
    setFormData(prev => ({
      ...prev,
      targetIds: prev.targetIds.includes(classId)
        ? prev.targetIds.filter(id => id !== classId)
        : [...prev.targetIds, classId]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            {mode === 'create' ? 'Create Announcement' : 'Edit Announcement'}
          </DialogTitle>
          <DialogDescription>
            Compose and schedule your announcement. Only teachers and admins can create announcements.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter announcement title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your announcement message..."
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              required
            />
          </div>

          {/* File Attachments */}
          <FileUpload
            attachments={formData.attachments}
            onAttachmentsChange={(attachments) => setFormData(prev => ({ ...prev, attachments }))}
          />

          <div className="space-y-3">
            <Label>Target Audience Type</Label>
            <RadioGroup
              value={formData.targetType}
              onValueChange={handleTargetTypeChange}
              className="grid grid-cols-2 gap-3"
            >
              {Object.entries(TARGET_TYPE_LABELS || {}).map(([value, label]) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={`target-${value}`} />
                  <Label htmlFor={`target-${value}`} className="cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {formData.targetType === 'class' && (
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <Label className="text-sm mb-2 block">Select Classes</Label>
                <div className="flex flex-wrap gap-2">
                  {MOCK_CLASSES.map(cls => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => handleClassSelection(cls.id)}
                      className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                        formData.targetIds.includes(cls.id)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted border-border'
                      }`}
                    >
                      {cls.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Multi-Target Selection for Advanced Targeting */}
            {formData.targetType !== 'all' && formData.targetType !== 'class' && (
              <div className="mt-3">
                <MultiTargetSelector
                  selectedTargets={selectedTargets}
                  onChange={setSelectedTargets}
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label>Publish Options</Label>
            <RadioGroup
              value={formData.publishType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, publishType: value as PublishType }))}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="immediate" id="publish-immediate" />
                <Label htmlFor="publish-immediate" className="cursor-pointer flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Publish Immediately
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scheduled" id="publish-scheduled" />
                <Label htmlFor="publish-scheduled" className="cursor-pointer flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Schedule for Later
                </Label>
              </div>
            </RadioGroup>

            {formData.publishType === 'scheduled' && (
              <div className="mt-3">
                <Input
                  type="datetime-local"
                  value={formData.publishAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, publishAt: e.target.value }))}
                  required={formData.publishType === 'scheduled'}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? (
                <><Plus className="w-4 h-4 mr-1" /> Create</>
              ) : (
                <><Edit3 className="w-4 h-4 mr-1" /> Save Changes</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Attachment Display Component
 */
const AttachmentList: React.FC<{
  attachments: Attachment[];
}> = ({ attachments }) => {
  if (attachments.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-medium flex items-center gap-2">
        <Paperclip className="w-4 h-4" />
        Attachments ({attachments.length})
      </p>
      <div className="flex flex-wrap gap-2">
        {attachments.map(attachment => {
          const config = getFileConfig(attachment.type);
          return (
            <a
              key={attachment.id}
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <span className={config.color}>{config.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate max-w-[150px]">{attachment.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Announcement Card Component
 */
const AnnouncementCard: React.FC<{
  announcement: AnnouncementWithAttachments;
  role: Role;
  userId?: string;
  onEdit: (announcement: AnnouncementWithAttachments) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ announcement, role, userId, onEdit, onArchive, onDelete }) => {
  const status = STATUS_CONFIG[announcement.status];
  const canEdit = canEditAnnouncement(role, announcement, userId);

  // Build target label
  const getTargetLabel = () => {
    if (announcement.targetType === 'all') return 'All Users';
    if (announcement.targetType === 'class' && announcement.targetIds.length > 0) {
      const selectedClasses = MOCK_CLASSES.filter(c => announcement.targetIds.includes(c.id));
      if (selectedClasses.length <= 2) {
        return selectedClasses.map(c => c.label).join(', ');
      }
      return `${selectedClasses.length} Classes`;
    }
    return TARGET_TYPE_LABELS[announcement.targetType];
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={status.color}>
                <span className="flex items-center gap-1">
                  {status.icon}
                  {status.label}
                </span>
              </Badge>
              {announcement.publishType === 'scheduled' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Clock className="w-3 h-3 mr-1" />
                  Scheduled
                </Badge>
              )}
              {announcement.attachments && announcement.attachments.length > 0 && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Paperclip className="w-3 h-3 mr-1" />
                  {announcement.attachments.length}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-tight">{announcement.title}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {getTargetLabel()}
              </span>
              <span>&middot;</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(announcement.createdAt)}
              </span>
            </CardDescription>
          </div>
          
          {canEdit && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(announcement)}
                className="h-8 w-8"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              {announcement.status !== 'archived' ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onArchive(announcement.id)}
                  className="h-8 w-8"
                >
                  <Archive className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(announcement.id)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {announcement.message}
        </p>
        
        {/* Attachments */}
        {announcement.attachments && announcement.attachments.length > 0 && (
          <AttachmentList attachments={announcement.attachments} />
        )}
        
        {announcement.publishType === 'scheduled' && announcement.publishAt && (
          <div className="mt-4 p-3 bg-muted rounded-lg flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Scheduled for: <strong>{formatDate(announcement.publishAt)}</strong></span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ==================== MAIN COMPONENT ====================

export const AnnouncementSystem: React.FC<AnnouncementSystemProps> = ({
  role,
  userId = 'user-001',
  userName = 'Current User',
  classId,
}) => {
  const [announcements, setAnnouncements] = useState<AnnouncementWithAttachments[]>(generateMockAnnouncements());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementWithAttachments | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<AnnouncementStatus | 'all'>('all');

  // Console log role information for debugging
  console.log(`[AnnouncementSystem] Initialized with role: ${role}`);
  console.log(`[AnnouncementSystem] Can create announcements: ${canCreateAnnouncement(role)}`);

  // Filter announcements based on role, tab, and search
  const filteredAnnouncements = useMemo(() => {
    let filtered = announcements;

    // Filter by visibility (role-based)
    filtered = filtered.filter(ann => 
      role === 'admin' || isAnnouncementVisibleToUser(ann, role, classId)
    );

    // Filter by status tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(ann => ann.status === activeTab);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ann =>
        ann.title.toLowerCase().includes(query) ||
        ann.message.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [announcements, role, classId, activeTab, searchQuery]);

  const handleCreate = (formData: AnnouncementFormData) => {
    console.log(`[AnnouncementSystem] Creating new announcement:`, formData);
    
    const newAnnouncement: AnnouncementWithAttachments = {
      id: `ann-${Date.now()}`,
      title: formData.title,
      message: formData.message,
      authorId: userId,
      targetType: formData.targetType,
      targetIds: formData.targetIds,
      publishType: formData.publishType,
      publishAt: formData.publishAt,
      status: formData.publishType === 'immediate' ? 'published' : 'draft',
      createdAt: new Date().toISOString(),
      attachments: formData.attachments,
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);
    console.log(`[AnnouncementSystem] Announcement created with ID: ${newAnnouncement.id}`);
  };

  const handleEdit = (formData: AnnouncementFormData) => {
    if (!editingAnnouncement) return;
    
    console.log(`[AnnouncementSystem] Editing announcement ${editingAnnouncement.id}:`, formData);
    
    setAnnouncements(prev => prev.map(ann => 
      ann.id === editingAnnouncement.id
        ? {
            ...ann,
            title: formData.title,
            message: formData.message,
            targetType: formData.targetType,
            targetIds: formData.targetIds,
            publishType: formData.publishType,
            publishAt: formData.publishAt,
            attachments: formData.attachments,
          }
        : ann
    ));
    setEditingAnnouncement(undefined);
  };

  const handleArchive = (id: string) => {
    console.log(`[AnnouncementSystem] Archiving announcement: ${id}`);
    setAnnouncements(prev => prev.map(ann => 
      ann.id === id ? { ...ann, status: 'archived' as AnnouncementStatus } : ann
    ));
  };

  const handleDelete = (id: string) => {
    console.log(`[AnnouncementSystem] Deleting announcement: ${id}`);
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingAnnouncement(undefined);
    setIsModalOpen(true);
    console.log(`[AnnouncementSystem] Opening create modal`);
  };

  const openEditModal = (announcement: AnnouncementWithAttachments) => {
    setModalMode('edit');
    setEditingAnnouncement(announcement);
    setIsModalOpen(true);
    console.log(`[AnnouncementSystem] Opening edit modal for: ${announcement.id}`);
  };

  const canCreate = canCreateAnnouncement(role);

  // Count announcements by status
  const counts = {
    all: announcements.filter(ann => role === 'admin' || isAnnouncementVisibleToUser(ann, role, classId)).length,
    draft: announcements.filter(ann => ann.status === 'draft').length,
    published: announcements.filter(ann => ann.status === 'published').length,
    archived: announcements.filter(ann => ann.status === 'archived').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="w-6 h-6" />
            Announcements
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {role === 'admin' 
              ? 'Manage and publish school-wide announcements'
              : role === 'teacher'
              ? 'Create announcements for your classes'
              : 'View announcements relevant to you'
            }
          </p>
        </div>
        
        {canCreate && (
          <Button onClick={openCreateModal} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AnnouncementStatus | 'all')}>
        <TabsList className="grid grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="all">
            All ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Drafts ({counts.draft})
          </TabsTrigger>
          <TabsTrigger value="published">
            Published ({counts.published})
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived ({counts.archived})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredAnnouncements.length === 0 ? (
            <EmptyState
              icon={<Megaphone className="w-8 h-8 text-muted-foreground" />}
              title="No announcements found"
              description={
                activeTab === 'all' 
                  ? "There are no announcements at this time."
                  : `No ${activeTab} announcements found.`
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredAnnouncements.map(announcement => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  role={role}
                  userId={userId}
                  onEdit={openEditModal}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAnnouncement(undefined);
        }}
        onSave={modalMode === 'create' ? handleCreate : handleEdit}
        initialData={editingAnnouncement}
        mode={modalMode}
      />
    </div>
  );
};

export default AnnouncementSystem;
