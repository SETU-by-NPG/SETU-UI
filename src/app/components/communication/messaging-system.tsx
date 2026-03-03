/**
 * SETU Education Management System - Feature 16: Messaging System with Restrictions
 * Messaging interface with strict role-based restrictions
 * 
 * CRITICAL RESTRICTIONS:
 * - Students can ONLY message allocated teachers
 * - Class-wide messages BLOCKED for students/parents
 * - Validation errors shown for blocked attempts
 * 
 * PHASE 3 ENHANCEMENTS:
 * - IT Admin group creation interface
 * - Message groups with name, description, members
 * - Groups visible in sidebar for all teachers
 * - Group management (edit, delete, add/remove members)
 * - Group selection as recipient in message composition
 * - Mock data for sample groups
 */

import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  AlertCircle,
  User,
  Users,
  Lock,
  Ban,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  Paperclip,
  MoreVertical,
  ShieldAlert,
  Plus,
  Settings,
  Edit3,
  Trash2,
  X,
  UserPlus,
  UserMinus,
  GraduationCap
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
import type { Role, Message } from '../../types';

// ==================== TYPES ====================

interface MessagingSystemProps {
  role: Role;
  userId?: string;
  userName?: string;
  allocatedTeacherIds?: string[];
  classId?: string;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: Role;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isClassWide?: boolean;
  classId?: string;
  isGroup?: boolean;
  groupId?: string;
}

interface MessageFormData {
  recipientId: string;
  recipientName: string;
  subject: string;
  content: string;
  isClassWide: boolean;
  isGroup?: boolean;
}

// Group types for Phase 3
interface MessageGroup {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdByRole: Role;
  members: string[]; // User IDs
  memberNames: string[]; // For display
  createdAt: string;
  isAdminOnly?: boolean;
}

// ==================== MOCK DATA ====================

const MOCK_TEACHERS = [
  { id: 'teacher-001', name: 'Mr. John Williams', subject: 'Mathematics', avatar: 'JW' },
  { id: 'teacher-002', name: 'Ms. Rachel Adams', subject: 'Science', avatar: 'RA' },
  { id: 'teacher-003', name: 'Mr. David Chen', subject: 'English', avatar: 'DC' },
  { id: 'teacher-004', name: 'Ms. Sarah Miller', subject: 'History', avatar: 'SM' },
  { id: 'teacher-005', name: 'Mr. James Brown', subject: 'Physics', avatar: 'JB' },
];

const MOCK_STUDENTS = [
  { id: 'student-001', name: 'Alice Johnson', class: 'Grade 10-A', avatar: 'AJ' },
  { id: 'student-002', name: 'Bob Smith', class: 'Grade 10-A', avatar: 'BS' },
  { id: 'student-003', name: 'Carol White', class: 'Grade 10-B', avatar: 'CW' },
];

const MOCK_PARENTS = [
  { id: 'parent-001', name: 'Mr. Robert Johnson', childName: 'Alice Johnson', avatar: 'RJ' },
  { id: 'parent-002', name: 'Mrs. Emily Smith', childName: 'Bob Smith', avatar: 'ES' },
];

const MOCK_CLASSES = [
  { id: 'class-010', name: 'Grade 10-A' },
  { id: 'class-011', name: 'Grade 10-B' },
  { id: 'class-012', name: 'Grade 11-A' },
];

// Phase 3: Sample Message Groups (visible to all teachers)
const MOCK_MESSAGE_GROUPS: MessageGroup[] = [
  {
    id: 'group-001',
    name: 'IT Support Team',
    description: 'Technical support and system maintenance discussions',
    createdBy: 'admin-001',
    createdByRole: 'admin',
    members: ['teacher-001', 'teacher-002', 'teacher-003', 'admin-001'],
    memberNames: ['Mr. John Williams', 'Ms. Rachel Adams', 'Mr. David Chen', 'IT Admin'],
    createdAt: '2025-02-01T10:00:00Z',
    isAdminOnly: false,
  },
  {
    id: 'group-002',
    name: 'Science Department',
    description: 'Science teachers coordination and resource sharing',
    createdBy: 'teacher-002',
    createdByRole: 'teacher',
    members: ['teacher-002', 'teacher-005', 'admin-001'],
    memberNames: ['Ms. Rachel Adams', 'Mr. James Brown', 'IT Admin'],
    createdAt: '2025-02-15T14:00:00Z',
    isAdminOnly: false,
  },
  {
    id: 'group-003',
    name: 'Exam Committee',
    description: 'Exam scheduling and coordination (Admin only)',
    createdBy: 'admin-001',
    createdByRole: 'admin',
    members: ['teacher-001', 'teacher-002', 'teacher-004', 'admin-001'],
    memberNames: ['Mr. John Williams', 'Ms. Rachel Adams', 'Ms. Sarah Miller', 'IT Admin'],
    createdAt: '2025-02-20T09:00:00Z',
    isAdminOnly: true,
  },
];

// Generate mock conversations
const generateMockConversations = (role: Role, groups: MessageGroup[]): Conversation[] => {
  const baseConversations: Conversation[] = [];
  
  if (role === 'student') {
    baseConversations.push(
      {
        id: 'conv-001',
        participantId: 'teacher-001',
        participantName: 'Mr. John Williams',
        participantRole: 'teacher',
        participantAvatar: 'JW',
        lastMessage: 'Your assignment has been graded. Great work!',
        lastMessageTime: '10:30 AM',
        unreadCount: 1,
      },
      {
        id: 'conv-002',
        participantId: 'teacher-002',
        participantName: 'Ms. Rachel Adams',
        participantRole: 'teacher',
        participantAvatar: 'RA',
        lastMessage: 'Please submit your lab report by Friday.',
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
      },
    );
  }

  if (role === 'parent') {
    baseConversations.push(
      {
        id: 'conv-003',
        participantId: 'teacher-001',
        participantName: 'Mr. John Williams',
        participantRole: 'teacher',
        participantAvatar: 'JW',
        lastMessage: 'Alice is doing great in Algebra this term.',
        lastMessageTime: '2 days ago',
        unreadCount: 0,
      },
    );
  }

  if (role === 'teacher') {
    baseConversations.push(
      {
        id: 'conv-004',
        participantId: 'student-001',
        participantName: 'Alice Johnson',
        participantRole: 'student',
        participantAvatar: 'AJ',
        lastMessage: 'Thank you for the feedback, sir!',
        lastMessageTime: '11:00 AM',
        unreadCount: 0,
      },
      {
        id: 'conv-005',
        participantId: 'parent-001',
        participantName: 'Mr. Robert Johnson',
        participantRole: 'parent',
        participantAvatar: 'RJ',
        lastMessage: 'When is the parent meeting scheduled?',
        lastMessageTime: 'Yesterday',
        unreadCount: 2,
      },
      {
        id: 'conv-class-010',
        participantId: 'class-010',
        participantName: 'Grade 10-A (Class-wide)',
        participantRole: 'student',
        participantAvatar: '10A',
        lastMessage: 'Reminder: Test tomorrow on Chapter 5',
        lastMessageTime: '9:00 AM',
        unreadCount: 0,
        isClassWide: true,
        classId: 'class-010',
      },
    );
    
    // Add groups to teacher conversations
    groups.forEach(group => {
      baseConversations.push({
        id: `conv-group-${group.id}`,
        participantId: group.id,
        participantName: group.name,
        participantRole: 'teacher',
        participantAvatar: group.name.substring(0, 2).toUpperCase(),
        lastMessage: 'New group message...',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        isGroup: true,
        groupId: group.id,
      });
    });
  }

  if (role === 'admin') {
    baseConversations.push(
      {
        id: 'conv-006',
        participantId: 'teacher-001',
        participantName: 'Mr. John Williams',
        participantRole: 'teacher',
        participantAvatar: 'JW',
        lastMessage: 'Requesting leave for next week.',
        lastMessageTime: '1 hour ago',
        unreadCount: 1,
      },
      {
        id: 'conv-007',
        participantId: 'parent-001',
        participantName: 'Mr. Robert Johnson',
        participantRole: 'parent',
        participantAvatar: 'RJ',
        lastMessage: 'Fee payment confirmation attached.',
        lastMessageTime: '3 hours ago',
        unreadCount: 0,
      },
    );
    
    // Add groups to admin conversations
    groups.forEach(group => {
      baseConversations.push({
        id: `conv-group-${group.id}`,
        participantId: group.id,
        participantName: group.name,
        participantRole: 'teacher',
        participantAvatar: group.name.substring(0, 2).toUpperCase(),
        lastMessage: 'New group message...',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        isGroup: true,
        groupId: group.id,
      });
    });
  }

  return baseConversations;
};

const generateMockMessages = (conversationId: string): Message[] => {
  const messages: Record<string, Message[]> = {
    'conv-001': [
      { id: 'm1', senderId: 'student-001', senderRole: 'student', senderName: 'You', recipientId: 'teacher-001', recipientRole: 'teacher', recipientName: 'Mr. John Williams', title: 'Assignment Question', content: 'Sir, I have a question about problem #5 in the assignment.', read: true, createdAt: '2025-02-28T10:00:00Z', isValid: true },
      { id: 'm2', senderId: 'teacher-001', senderRole: 'teacher', senderName: 'Mr. John Williams', recipientId: 'student-001', recipientRole: 'student', recipientName: 'You', title: 'Re: Assignment Question', content: 'Sure, what would you like to know?', read: true, createdAt: '2025-02-28T10:15:00Z', isValid: true },
      { id: 'm3', senderId: 'teacher-001', senderRole: 'teacher', senderName: 'Mr. John Williams', recipientId: 'student-001', recipientRole: 'student', recipientName: 'You', title: 'Re: Assignment Question', content: 'Your assignment has been graded. Great work!', read: false, createdAt: '2025-02-28T10:30:00Z', isValid: true },
    ],
    'conv-002': [
      { id: 'm4', senderId: 'teacher-002', senderRole: 'teacher', senderName: 'Ms. Rachel Adams', recipientId: 'student-001', recipientRole: 'student', recipientName: 'You', title: 'Lab Report', content: 'Please submit your lab report by Friday.', read: true, createdAt: '2025-02-27T14:00:00Z', isValid: true },
    ],
    'conv-003': [
      { id: 'm5', senderId: 'teacher-001', senderRole: 'teacher', senderName: 'Mr. John Williams', recipientId: 'parent-001', recipientRole: 'parent', recipientName: 'Mr. Robert Johnson', title: 'Progress Update', content: 'Alice is doing great in Algebra this term.', read: true, createdAt: '2025-02-26T10:00:00Z', isValid: true },
    ],
  };

  return messages[conversationId] || [];
};

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validates if a student can message the target recipient
 * Students can ONLY message their allocated teachers
 */
const validateStudentMessage = (
  recipientId: string,
  isClassWide: boolean,
  allocatedTeacherIds: string[] = []
): { valid: boolean; error?: string; reason?: string } => {
  // Block class-wide messages from students
  if (isClassWide) {
    const reason = 'Class-wide messages not allowed for your role';
    console.log(`[MessagingSystem] BLOCKED: ${reason}`);
    console.log(`[MessagingSystem] Attempted class-wide message by student to class: ${recipientId}`);
    return { valid: false, error: reason, reason };
  }

  // Check if recipient is in allocated teachers list
  if (!allocatedTeacherIds.includes(recipientId)) {
    const reason = 'You can only message your allocated teachers';
    console.log(`[MessagingSystem] BLOCKED: ${reason}`);
    console.log(`[MessagingSystem] Attempted recipient: ${recipientId}`);
    console.log(`[MessagingSystem] Allowed teachers:`, allocatedTeacherIds);
    return { valid: false, error: reason, reason };
  }

  console.log(`[MessagingSystem] ALLOWED: Student message to allocated teacher ${recipientId}`);
  return { valid: true };
};

/**
 * Validates if a parent can message the target recipient
 * Parents have restricted messaging capabilities
 */
const validateParentMessage = (
  recipientId: string,
  isClassWide: boolean
): { valid: boolean; error?: string; reason?: string } => {
  // Block class-wide messages from parents
  if (isClassWide) {
    const reason = 'Class-wide messages not allowed for your role';
    console.log(`[MessagingSystem] BLOCKED: ${reason}`);
    console.log(`[MessagingSystem] Attempted class-wide message by parent to class: ${recipientId}`);
    return { valid: false, error: reason, reason };
  }

  // Parents can only message teachers (not students directly)
  const isTeacher = MOCK_TEACHERS.some(t => t.id === recipientId);
  if (!isTeacher) {
    const reason = 'Parents can only message teachers directly';
    console.log(`[MessagingSystem] BLOCKED: ${reason}`);
    console.log(`[MessagingSystem] Attempted recipient: ${recipientId}`);
    return { valid: false, error: reason, reason };
  }

  console.log(`[MessagingSystem] ALLOWED: Parent message to teacher ${recipientId}`);
  return { valid: true };
};

/**
 * Validates message based on sender role
 */
const validateMessage = (
  role: Role,
  recipientId: string,
  isClassWide: boolean,
  isGroup: boolean,
  allocatedTeacherIds: string[] = []
): { valid: boolean; error?: string; reason?: string } => {
  console.log(`[MessagingSystem] Validating message - Role: ${role}, Class-wide: ${isClassWide}, Group: ${isGroup}, Recipient: ${recipientId}`);

  // Groups are always allowed for teachers and admins
  if (isGroup && (role === 'teacher' || role === 'admin')) {
    console.log(`[MessagingSystem] ALLOWED: ${role} can send messages to groups`);
    return { valid: true };
  }

  switch (role) {
    case 'student':
      return validateStudentMessage(recipientId, isClassWide, allocatedTeacherIds);
    case 'parent':
      return validateParentMessage(recipientId, isClassWide);
    case 'teacher':
    case 'admin':
      console.log(`[MessagingSystem] ALLOWED: ${role} can send any message`);
      return { valid: true };
    default:
      return { valid: false, error: 'Invalid role', reason: 'Unknown role type' };
  }
};

// ==================== SUB-COMPONENTS ====================

/**
 * Group Management Dialog
 * IT Admin interface to create and manage message groups
 */
const GroupManagementDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  groups: MessageGroup[];
  onUpdateGroups: (groups: MessageGroup[]) => void;
  currentUserId: string;
  currentUserRole: Role;
}> = ({ isOpen, onClose, groups, onUpdateGroups, currentUserId, currentUserRole }) => {
  const [localGroups, setLocalGroups] = useState<MessageGroup[]>(groups);
  const [editingGroup, setEditingGroup] = useState<MessageGroup | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleCreateGroup = (group: MessageGroup) => {
    setLocalGroups([...localGroups, group]);
    setIsCreatingNew(false);
  };

  const handleUpdateGroup = (updatedGroup: MessageGroup) => {
    setLocalGroups(localGroups.map(g => g.id === updatedGroup.id ? updatedGroup : g));
    setEditingGroup(null);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (confirm('Are you sure you want to delete this group?')) {
      setLocalGroups(localGroups.filter(g => g.id !== groupId));
    }
  };

  const handleSave = () => {
    onUpdateGroups(localGroups);
    onClose();
  };

  // Only admins and teachers can manage groups
  const canManageGroups = currentUserRole === 'admin' || currentUserRole === 'teacher';

  if (!canManageGroups) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <Alert variant="destructive">
            <Lock className="w-4 h-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              Only teachers and administrators can manage message groups.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Manage Message Groups
          </DialogTitle>
          <DialogDescription>
            Create and manage message groups for team communication. Groups are visible to all teachers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Groups List */}
          <div className="space-y-3">
            {localGroups.map((group) => (
              <Card key={group.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{group.name}</h4>
                        {group.isAdminOnly && (
                          <Badge variant="secondary" className="text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            Admin Only
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {group.members.length} members
                        </span>
                        <span>Created by: {group.createdByRole}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {group.memberNames.slice(0, 5).map((name, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {name}
                          </Badge>
                        ))}
                        {group.memberNames.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{group.memberNames.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingGroup(group)}
                        className="h-8 w-8"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGroup(group.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add New Button */}
          {!isCreatingNew && !editingGroup && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsCreatingNew(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Group
            </Button>
          )}

          {/* Create/Edit Form */}
          {(isCreatingNew || editingGroup) && (
            <GroupForm
              group={editingGroup}
              onSave={editingGroup ? handleUpdateGroup : handleCreateGroup}
              onCancel={() => {
                setIsCreatingNew(false);
                setEditingGroup(null);
              }}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
            />
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Group Form Component
 */
const GroupForm: React.FC<{
  group: MessageGroup | null;
  onSave: (group: MessageGroup) => void;
  onCancel: () => void;
  currentUserId: string;
  currentUserRole: Role;
}> = ({ group, onSave, onCancel, currentUserId, currentUserRole }) => {
  const [formData, setFormData] = useState<MessageGroup>({
    id: group?.id || `group-${Date.now()}`,
    name: group?.name || '',
    description: group?.description || '',
    createdBy: group?.createdBy || currentUserId,
    createdByRole: group?.createdByRole || currentUserRole,
    members: group?.members || [currentUserId],
    memberNames: group?.memberNames || ['You'],
    createdAt: group?.createdAt || new Date().toISOString(),
    isAdminOnly: group?.isAdminOnly || false,
  });

  const [selectedMembers, setSelectedMembers] = useState<string[]>(formData.members);

  // All available members (teachers and admins)
  const availableMembers = [
    ...MOCK_TEACHERS.map(t => ({ id: t.id, name: t.name, role: 'teacher' as Role })),
    { id: 'admin-001', name: 'IT Admin', role: 'admin' as Role },
  ];

  const handleMemberToggle = (memberId: string, memberName: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
      setFormData({
        ...formData,
        members: formData.members.filter(id => id !== memberId),
        memberNames: formData.memberNames.filter(name => name !== memberName),
      });
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
      setFormData({
        ...formData,
        members: [...formData.members, memberId],
        memberNames: [...formData.memberNames, memberName],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.members.length === 0) return;
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4 bg-muted/50">
      <h4 className="font-medium">{group ? 'Edit Group' : 'Create New Group'}</h4>
      
      <div className="space-y-2">
        <Label htmlFor="group-name">Group Name</Label>
        <Input
          id="group-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Science Department"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="group-description">Description</Label>
        <Textarea
          id="group-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the group's purpose"
          rows={2}
        />
      </div>

      {currentUserRole === 'admin' && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="admin-only"
            checked={formData.isAdminOnly}
            onChange={(e) => setFormData({ ...formData, isAdminOnly: e.target.checked })}
            className="rounded border-gray-300"
          />
          <Label htmlFor="admin-only" className="text-sm cursor-pointer">
            Admin-only group
          </Label>
        </div>
      )}

      <div className="space-y-2">
        <Label>Select Members</Label>
        <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto bg-background">
          {availableMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`member-${member.id}`}
                checked={selectedMembers.includes(member.id)}
                onChange={() => handleMemberToggle(member.id, member.name)}
                className="rounded border-gray-300"
              />
              <Label htmlFor={`member-${member.id}`} className="flex items-center gap-2 cursor-pointer flex-1">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                </div>
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {group ? 'Update Group' : 'Create Group'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

/**
 * Compose Message Modal
 */
const ComposeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: MessageFormData) => void;
  role: Role;
  allocatedTeacherIds: string[];
  groups: MessageGroup[];
}> = ({ isOpen, onClose, onSend, role, allocatedTeacherIds, groups }) => {
  const [formData, setFormData] = useState<MessageFormData>({
    recipientId: '',
    recipientName: '',
    subject: '',
    content: '',
    isClassWide: false,
    isGroup: false,
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [recipientFilter, setRecipientFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'individuals' | 'classes' | 'groups'>('individuals');

  // Filter available recipients based on role
  const availableRecipients = useMemo(() => {
    if (role === 'student') {
      return MOCK_TEACHERS.filter(t => allocatedTeacherIds.includes(t.id));
    }
    if (role === 'parent') {
      return MOCK_TEACHERS;
    }
    if (role === 'teacher') {
      return [
        ...MOCK_STUDENTS.map(s => ({ ...s, role: 'student' as Role })),
        ...MOCK_PARENTS.map(p => ({ ...p, role: 'parent' as Role })),
        ...MOCK_TEACHERS.map(t => ({ ...t, role: 'teacher' as Role })),
      ];
    }
    // Admin can see everyone
    return [
      ...MOCK_STUDENTS.map(s => ({ ...s, role: 'student' as Role })),
      ...MOCK_PARENTS.map(p => ({ ...p, role: 'parent' as Role })),
      ...MOCK_TEACHERS.map(t => ({ ...t, role: 'teacher' as Role })),
    ];
  }, [role, allocatedTeacherIds]);

  const filteredRecipients = availableRecipients.filter(r =>
    r.name.toLowerCase().includes(recipientFilter.toLowerCase())
  );

  const handleRecipientSelect = (recipient: typeof availableRecipients[0]) => {
    setFormData(prev => ({
      ...prev,
      recipientId: recipient.id,
      recipientName: recipient.name,
      isClassWide: false,
      isGroup: false,
    }));
    setValidationError(null);
  };

  const handleClassWideSelect = (classId: string, className: string) => {
    const validation = validateMessage(role, classId, true, false, allocatedTeacherIds);
    
    if (!validation.valid) {
      setValidationError(validation.error || 'Message not allowed');
      console.log(`[MessagingSystem] BLOCKED class-wide selection: ${validation.reason}`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      recipientId: classId,
      recipientName: className,
      isClassWide: true,
      isGroup: false,
    }));
    setValidationError(null);
  };

  const handleGroupSelect = (group: MessageGroup) => {
    setFormData(prev => ({
      ...prev,
      recipientId: group.id,
      recipientName: group.name,
      isClassWide: false,
      isGroup: true,
    }));
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateMessage(role, formData.recipientId, formData.isClassWide, formData.isGroup || false, allocatedTeacherIds);
    
    if (!validation.valid) {
      setValidationError(validation.error || 'Message not allowed');
      console.log(`[MessagingSystem] BLOCKED send attempt: ${validation.reason}`);
      return;
    }

    console.log(`[MessagingSystem] Message validated and sending...`);
    onSend(formData);
    onClose();
    setFormData({ recipientId: '', recipientName: '', subject: '', content: '', isClassWide: false, isGroup: false });
    setValidationError(null);
  };

  // Filter groups based on role
  const visibleGroups = role === 'admin' 
    ? groups 
    : groups.filter(g => !g.isAdminOnly || g.members.includes('teacher-001')); // Mock current teacher

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            New Message
          </DialogTitle>
          <DialogDescription>
            {role === 'student' && 'You can only message your allocated teachers'}
            {role === 'parent' && 'You can message teachers directly (class-wide messages not allowed)'}
            {(role === 'teacher' || role === 'admin') && 'Send messages to students, parents, classes, or groups'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Validation Error Alert */}
          {validationError && (
            <Alert variant="destructive">
              <Ban className="w-4 h-4" />
              <AlertTitle>Message Blocked</AlertTitle>
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {/* Role-specific restriction notice */}
          {(role === 'student' || role === 'parent') && (
            <Alert className="bg-amber-50 border-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Messaging Restrictions Apply</AlertTitle>
              <AlertDescription className="text-amber-700">
                {role === 'student' 
                  ? 'You can only message your allocated teachers. Class-wide messages are not allowed.'
                  : 'You can only message teachers directly. Class-wide messages are not allowed.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Recipient Selection Tabs (for teachers/admins) */}
          {(role === 'teacher' || role === 'admin') && (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'individuals' | 'classes' | 'groups')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="individuals">Individuals</TabsTrigger>
                <TabsTrigger value="classes">Classes</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
              </TabsList>

              <TabsContent value="individuals" className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search recipients..."
                    value={recipientFilter}
                    onChange={(e) => setRecipientFilter(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="mt-3 max-h-40 overflow-y-auto border rounded-md">
                  {filteredRecipients.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground text-center">
                      No recipients found
                    </div>
                  ) : (
                    filteredRecipients.map(recipient => (
                      <button
                        key={recipient.id}
                        type="button"
                        onClick={() => handleRecipientSelect(recipient)}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left ${
                          formData.recipientId === recipient.id && !formData.isClassWide && !formData.isGroup ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {recipient.avatar || recipient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{recipient.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {/* @ts-ignore */}
                            {recipient.subject || recipient.class || recipient.childName || recipient.role}
                          </p>
                        </div>
                        {formData.recipientId === recipient.id && !formData.isClassWide && !formData.isGroup && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="classes" className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {(MOCK_CLASSES || []).map(cls => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => handleClassWideSelect(cls.id, cls.name)}
                      className={`px-3 py-1.5 rounded-md text-sm border transition-colors flex items-center gap-1 ${
                        formData.recipientId === cls.id && formData.isClassWide
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted border-border'
                      }`}
                    >
                      <GraduationCap className="w-3 h-3" />
                      {cls.name}
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="groups" className="mt-4">
                <div className="space-y-2">
                  {visibleGroups.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground text-center border rounded-md">
                      No groups available
                    </div>
                  ) : (
                    visibleGroups.map(group => (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => handleGroupSelect(group)}
                        className={`w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-muted transition-colors text-left ${
                          formData.recipientId === group.id && formData.isGroup
                            ? 'bg-primary/5 border-primary'
                            : ''
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{group.name}</p>
                            {group.isAdminOnly && (
                              <Badge variant="secondary" className="text-xs">
                                <Lock className="w-3 h-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{group.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {group.members.length} members
                          </p>
                        </div>
                        {formData.recipientId === group.id && formData.isGroup && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Simple recipient selection for students/parents */}
          {(role === 'student' || role === 'parent') && (
            <div className="space-y-2">
              <Label>To</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search recipients..."
                  value={recipientFilter}
                  onChange={(e) => setRecipientFilter(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="max-h-40 overflow-y-auto border rounded-md">
                {filteredRecipients.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground text-center">
                    {role === 'student' 
                      ? 'No allocated teachers found'
                      : 'No recipients found'}
                  </div>
                ) : (
                  filteredRecipients.map(recipient => (
                    <button
                      key={recipient.id}
                      type="button"
                      onClick={() => handleRecipientSelect(recipient)}
                      className={`w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left ${
                        formData.recipientId === recipient.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        {recipient.avatar || recipient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{recipient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {/* @ts-ignore */}
                          {recipient.subject || recipient.class || recipient.childName || recipient.role}
                        </p>
                      </div>
                      {formData.recipientId === recipient.id && (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {formData.recipientId && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <span className="text-sm text-muted-foreground">Selected:</span>
              <Badge variant="secondary">
                {formData.isClassWide ? (
                  <><GraduationCap className="w-3 h-3 mr-1" />{formData.recipientName}</>
                ) : formData.isGroup ? (
                  <><Users className="w-3 h-3 mr-1" />{formData.recipientName}</>
                ) : (
                  <><User className="w-3 h-3 mr-1" />{formData.recipientName}</>
                )}
              </Badge>
            </div>
          )}

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter message subject..."
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              required
            />
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Message</Label>
            <Textarea
              id="content"
              placeholder="Write your message..."
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.recipientId || validationError !== null}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ==================== MAIN COMPONENT ====================

export const MessagingSystem: React.FC<MessagingSystemProps> = ({
  role,
  userId = 'user-001',
  userName = 'Current User',
  allocatedTeacherIds = ['teacher-001', 'teacher-002'],
  classId,
}) => {
  const [groups, setGroups] = useState<MessageGroup[]>(MOCK_MESSAGE_GROUPS);
  const [conversations, setConversations] = useState<Conversation[]>(generateMockConversations(role, groups));
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isGroupManagementOpen, setIsGroupManagementOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'conversations' | 'groups'>('conversations');

  // Console log role and restrictions
  console.log(`[MessagingSystem] Initialized with role: ${role}`);
  console.log(`[MessagingSystem] Allocated teachers:`, allocatedTeacherIds);
  console.log(`[MessagingSystem] Class-wide messaging: ${role === 'teacher' || role === 'admin' ? 'ALLOWED' : 'BLOCKED'}`);

  // Load messages when conversation selected
  React.useEffect(() => {
    if (selectedConversation) {
      setMessages(generateMockMessages(selectedConversation.id));
    }
  }, [selectedConversation]);

  const handleSendMessage = (formData: MessageFormData) => {
    console.log(`[MessagingSystem] Sending message:`, formData);

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: userId,
      senderRole: role,
      senderName: userName,
      recipientId: formData.recipientId,
      recipientRole: formData.isClassWide ? 'student' : (formData.isGroup ? 'teacher' : (MOCK_TEACHERS.find(t => t.id === formData.recipientId) ? 'teacher' : 'parent')),
      recipientName: formData.recipientName,
      classId: formData.isClassWide ? formData.recipientId : undefined,
      subject: formData.subject,
      title: formData.subject,
      content: formData.content,
      read: false,
      createdAt: new Date().toISOString(),
      isValid: true,
    };

    // Add to messages if in conversation
    if (selectedConversation && selectedConversation.participantId === formData.recipientId) {
      setMessages(prev => [...prev, newMsg]);
    }

    // Update conversation list
    setConversations(prev => {
      const existingIndex = prev.findIndex(c => c.participantId === formData.recipientId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          lastMessage: formData.content,
          lastMessageTime: 'Just now',
        };
        return updated;
      }
      return prev;
    });

    console.log(`[MessagingSystem] Message sent successfully`);
  };

  const handleQuickReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !newMessage.trim()) return;

    const isClassWide = selectedConversation.isClassWide || false;
    const isGroup = selectedConversation.isGroup || false;
    
    const validation = validateMessage(role, selectedConversation.participantId, isClassWide, isGroup, allocatedTeacherIds);
    
    if (!validation.valid) {
      console.log(`[MessagingSystem] BLOCKED quick reply: ${validation.reason}`);
      return;
    }

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: userId,
      senderRole: role,
      senderName: userName,
      recipientId: selectedConversation.participantId,
      recipientRole: selectedConversation.participantRole,
      recipientName: selectedConversation.participantName,
      classId: selectedConversation.classId,
      title: 'Re: Conversation',
      content: newMessage,
      read: true,
      createdAt: new Date().toISOString(),
      isValid: true,
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    setConversations(prev => prev.map(c => 
      c.id === selectedConversation.id
        ? { ...c, lastMessage: newMessage, lastMessageTime: 'Just now' }
        : c
    ));

    console.log(`[MessagingSystem] Quick reply sent to ${selectedConversation.participantName}`);
  };

  const filteredConversations = conversations.filter(c =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter groups for sidebar
  const visibleGroups = role === 'admin' 
    ? groups 
    : groups.filter(g => !g.isAdminOnly || g.members.includes(userId));

  const canManageGroups = role === 'admin' || role === 'teacher';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Messages
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {role === 'student' && 'Message your allocated teachers'}
            {role === 'parent' && 'Communicate with your child\'s teachers'}
            {role === 'teacher' && 'Message students, parents, classes, and groups'}
            {role === 'admin' && 'School-wide messaging system'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {canManageGroups && (
            <Button 
              variant="outline" 
              onClick={() => setIsGroupManagementOpen(true)}
              className="shrink-0"
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Groups
            </Button>
          )}
          <Button onClick={() => setIsComposeOpen(true)} className="shrink-0">
            <MessageSquare className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Role restriction notice */}
      {(role === 'student' || role === 'parent') && (
        <Alert className="bg-amber-50 border-amber-200">
          <Lock className="w-4 h-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Messaging Restrictions Active</AlertTitle>
          <AlertDescription className="text-amber-700">
            {role === 'student' 
              ? 'You can only message your allocated teachers. Class-wide messages are blocked.'
              : 'You can only message teachers directly. Class-wide messages are blocked.'}
            Check console logs for restriction demonstrations.
          </AlertDescription>
        </Alert>
      )}

      {/* Messaging Interface */}
      <Card className="overflow-hidden">
        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className={`w-full sm:w-80 border-r flex flex-col ${selectedConversation ? 'hidden sm:flex' : 'flex'}`}>
            {/* Sidebar Tabs (for teachers/admins) */}
            {(role === 'teacher' || role === 'admin') && (
              <div className="p-3 border-b">
                <Tabs value={activeSidebarTab} onValueChange={(v) => setActiveSidebarTab(v as 'conversations' | 'groups')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="conversations">Chats</TabsTrigger>
                    <TabsTrigger value="groups">Groups</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}
            
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={activeSidebarTab === 'groups' ? "Search groups..." : "Search messages..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {activeSidebarTab === 'groups' && (role === 'teacher' || role === 'admin') ? (
                // Groups List
                visibleGroups.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No groups found
                  </div>
                ) : (
                  visibleGroups.map(group => (
                    <button
                      key={group.id}
                      onClick={() => {
                        const groupConv: Conversation = {
                          id: `conv-group-${group.id}`,
                          participantId: group.id,
                          participantName: group.name,
                          participantRole: 'teacher',
                          participantAvatar: group.name.substring(0, 2).toUpperCase(),
                          lastMessage: 'Click to view messages',
                          lastMessageTime: '',
                          unreadCount: 0,
                          isGroup: true,
                          groupId: group.id,
                        };
                        setSelectedConversation(groupConv);
                      }}
                      className="w-full text-left p-4 border-b hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate text-sm">{group.name}</p>
                            {group.isAdminOnly && (
                              <Badge variant="secondary" className="text-xs">
                                <Lock className="w-3 h-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {group.members.length} members
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-1">{group.description}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )
              ) : (
                // Conversations List
                filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No conversations found
                  </div>
                ) : (
                  filteredConversations.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${
                        selectedConversation?.id === conv.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-medium">
                          {conv.isGroup ? <Users className="w-5 h-5" /> : conv.participantAvatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate text-sm">{conv.participantName}</p>
                            <span className="text-xs text-muted-foreground shrink-0 ml-2">{conv.lastMessageTime}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {conv.isClassWide && <GraduationCap className="w-3 h-3 inline mr-1" />}
                            {conv.isGroup && <Users className="w-3 h-3 inline mr-1" />}
                            {conv.isGroup ? 'Group' : conv.participantRole}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-1">{conv.lastMessage}</p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${selectedConversation ? 'flex' : 'hidden sm:flex'}`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedConversation(null)}
                    className="sm:hidden p-1 hover:bg-muted rounded"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {selectedConversation.isGroup ? <Users className="w-5 h-5" /> : selectedConversation.participantAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{selectedConversation.participantName}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation.isGroup ? (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Message Group
                        </span>
                      ) : selectedConversation.isClassWide ? (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          Class-wide message
                        </span>
                      ) : (
                        selectedConversation.participantRole
                      )}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map(msg => {
                      const isMe = msg.senderId === userId;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] p-3 rounded-lg ${
                            isMe 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-xs mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Reply Box */}
                <form onSubmit={handleQuickReply} className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  {(role === 'student' || role === 'parent') && (
                    <p className="text-xs text-muted-foreground mt-2">
                      <Lock className="w-3 h-3 inline mr-1" />
                      Restricted messaging: {role === 'student' ? 'Allocated teachers only' : 'Teachers only'}
                    </p>
                  )}
                </form>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <EmptyState
                  icon={<MessageSquare className="w-8 h-8 text-muted-foreground" />}
                  title="Select a conversation"
                  description="Choose a conversation from the list to view messages"
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Compose Modal */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={handleSendMessage}
        role={role}
        allocatedTeacherIds={allocatedTeacherIds}
        groups={groups}
      />

      {/* Group Management Modal */}
      <GroupManagementDialog
        isOpen={isGroupManagementOpen}
        onClose={() => setIsGroupManagementOpen(false)}
        groups={groups}
        onUpdateGroups={setGroups}
        currentUserId={userId}
        currentUserRole={role}
      />
    </div>
  );
};

export default MessagingSystem;
