/**
 * SETU Education Management System - Feature 8: Subject Management
 * Subject listing with department filters, category management, and Head of Subject designation
 * Enhanced with Phase 6: Subject Category Management
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Filter, 
  User, 
  Users, 
  ChevronDown, 
  ChevronRight,
  Edit,
  AlertCircle,
  GraduationCap,
  Library,
  Target,
  CheckCircle,
  X,
  Plus,
  Tag,
  Grid3X3,
  LayoutList,
  Search,
  Trash2,
  Beaker,
  Calculator,
  Book,
  Languages,
  Palette,
  Dumbbell,
  Computer,
  Music,
  Globe,
  Leaf,
  MoreHorizontal
} from 'lucide-react';
import { mockData, subjectCategories } from '../../data';
import { usePermissions } from '../../context/permission-context';
import type { Subject, Teacher, ClassGrade, SubjectCategory, SubjectCategoryIcon } from '../../types';

// ==================== TYPES ====================

interface SubjectManagementProps {
  className?: string;
}

type ViewMode = 'grid' | 'list';

type TabMode = 'subjects' | 'categories';

interface SubjectWithDetails extends Subject {
  headTeacherName?: string;
  classCount: number;
  teacherCount: number;
  category?: SubjectCategory | null;
}

interface CategoryFormData {
  name: string;
  description: string;
  colorCode: string;
  icon: SubjectCategoryIcon;
}

// ==================== ICON MAP ====================

const iconMap: Record<SubjectCategoryIcon, React.ElementType> = {
  flask: Beaker,
  calculator: Calculator,
  book: Book,
  languages: Languages,
  palette: Palette,
  dumbbell: Dumbbell,
  computer: Computer,
  music: Music,
  globe: Globe,
  leaf: Leaf,
};

// ==================== SUB-COMPONENTS ====================

/**
 * Category Badge Component
 */
const CategoryBadge: React.FC<{
  category: SubjectCategory | null | undefined;
  showName?: boolean;
}> = ({ category, showName = true }) => {
  if (!category) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
        <Tag className="w-3 h-3" />
        Uncategorized
      </span>
    );
  }

  const IconComponent = iconMap[category.icon] || Tag;

  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full"
      style={{ 
        backgroundColor: `${category.colorCode}20`,
        color: category.colorCode 
      }}
    >
      <IconComponent className="w-3 h-3" />
      {showName && category.name}
    </span>
  );
};

/**
 * Category Card Component
 */
const CategoryCard: React.FC<{
  category: SubjectCategory;
  subjectCount: number;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
}> = ({ category, subjectCount, onEdit, onDelete, canEdit }) => {
  const IconComponent = iconMap[category.icon] || Tag;

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      style={{ borderLeftWidth: '4px', borderLeftColor: category.colorCode }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${category.colorCode}20` }}
            >
              <IconComponent className="w-6 h-6" style={{ color: category.colorCode }} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500">{subjectCount} subjects</p>
            </div>
          </div>
          {canEdit && (
            <div className="flex items-center gap-1">
              <button
                onClick={onEdit}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                title="Edit Category"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{category.description}</p>

        <div className="mt-3 flex items-center gap-2">
          <span 
            className="px-2 py-1 text-xs rounded"
            style={{ backgroundColor: `${category.colorCode}15`, color: category.colorCode }}
          >
            Color: {category.colorCode}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            Icon: {category.icon}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Subject card component (grid view)
 */
const SubjectCard: React.FC<{
  subject: SubjectWithDetails;
  isExpanded: boolean;
  onToggle: () => void;
  canEdit: boolean;
  onEdit: () => void;
}> = ({ subject, isExpanded, onToggle, canEdit, onEdit }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{subject.name}</h3>
              <p className="text-sm text-gray-500">{subject.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {subject.headTeacherId && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                Head: {subject.headTeacherName}
              </span>
            )}
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Category Badge */}
        <div className="mt-2">
          <CategoryBadge category={subject.category} />
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <GraduationCap className="w-4 h-4" />
            {subject.department}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {subject.classCount} classes
          </span>
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {subject.teacherCount} teachers
          </span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          {/* Credits & Status */}
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              {subject.credits} Credits
            </span>
            <span className={`px-3 py-1 text-sm rounded-full ${
              subject.status === 'active' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {subject.status}
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
            <p className="text-sm text-gray-600">{subject.description}</p>
          </div>

          {/* Curriculum */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <Library className="w-4 h-4" />
              Curriculum
            </h4>
            <p className="text-sm text-gray-600">{subject.curriculum}</p>
          </div>

          {/* Textbook */}
          {subject.textbook && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Textbook
              </h4>
              <p className="text-sm text-gray-600">{subject.textbook}</p>
            </div>
          )}

          {/* Learning Objectives */}
          {subject.learningObjectives && subject.learningObjectives.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Learning Objectives
              </h4>
              <ul className="space-y-1">
                {subject.learningObjectives.map((objective, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Assigned Teachers */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Assigned Teachers</h4>
            <div className="flex flex-wrap gap-2">
              {subject.teachers.map((teacherId) => {
                const teacher = mockData.teachers.find((t: Teacher) => t.id === teacherId);
                const isHead = teacherId === subject.headTeacherId;
                return (
                  <span 
                    key={teacherId}
                    className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                      isHead 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <User className="w-3 h-3" />
                    {teacher?.name}
                    {isHead && <span className="text-purple-500">(Head)</span>}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Classes */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Classes</h4>
            <div className="flex flex-wrap gap-2">
              {subject.classes.map((classId) => {
                const cls = mockData.classes.find((c: ClassGrade) => c.id === classId);
                return (
                  <span 
                    key={classId}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                  >
                    {cls?.name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Edit Button */}
          {canEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Subject
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Edit Subject Modal
 */
const EditSubjectModal: React.FC<{
  subject: Subject | null;
  categories: SubjectCategory[];
  onClose: () => void;
  onSave: (subject: Partial<Subject>) => void;
}> = ({ subject, categories, onClose, onSave }) => {
  if (!subject) return null;

  const [formData, setFormData] = useState({
    name: subject.name,
    description: subject.description,
    curriculum: subject.curriculum,
    textbook: subject.textbook,
    status: subject.status,
    categoryId: subject.categoryId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Edit Subject</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.categoryId || ''}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Curriculum</label>
            <input
              type="text"
              value={formData.curriculum}
              onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Textbook</label>
            <input
              type="text"
              value={formData.textbook}
              onChange={(e) => setFormData({ ...formData, textbook: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Subject['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Category Form Modal
 */
const CategoryModal: React.FC<{
  category: SubjectCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormData) => void;
}> = ({ category, isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || '',
    description: category?.description || '',
    colorCode: category?.colorCode || '#3B82F6',
    icon: category?.icon || 'book',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const colorOptions = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981',
    '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
    '#F43F5E', '#78716C', '#374151', '#1F2937',
  ];

  const iconOptions: SubjectCategoryIcon[] = ['flask', 'calculator', 'book', 'languages', 'palette', 'dumbbell', 'computer', 'music', 'globe', 'leaf'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">
            {category ? 'Edit Category' : 'Create Category'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Sciences"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of this category"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, colorCode: color })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    formData.colorCode === color ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((icon) => {
                const IconComponent = iconMap[icon];
                return (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                      formData.icon === icon 
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                    title={icon}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {category ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

/**
 * Subject Management Component
 * Lists subjects with department filters, category management, and head designation
 */
export const SubjectManagement: React.FC<SubjectManagementProps> = ({
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('subjects');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [savedMessage, setSavedMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Category management state
  const [categories, setCategories] = useState<SubjectCategory[]>(subjectCategories);
  const [editingCategory, setEditingCategory] = useState<SubjectCategory | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const { hasPermission, currentRole, currentUserId } = usePermissions();

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(mockData.subjects.map((s: Subject) => s.department));
    return ['all', ...Array.from(depts)];
  }, []);

  // Get subjects with details
  const subjects = useMemo(() => {
    let filtered = mockData.subjects;
    
    // Department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter((s: Subject) => s.department === selectedDepartment);
    }
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((s: Subject) => s.categoryId === selectedCategory);
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((s: Subject) => 
        s.name.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
      );
    }
    
    return filtered.map((subject: Subject): SubjectWithDetails => {
      const headTeacher = subject.headTeacherId 
        ? mockData.teachers.find((t: Teacher) => t.id === subject.headTeacherId)
        : undefined;
      
      const category = subject.categoryId
        ? categories.find((c) => c.id === subject.categoryId)
        : null;
      
      return {
        ...subject,
        headTeacherName: headTeacher?.name,
        classCount: subject.classes.length,
        teacherCount: subject.teachers.length,
        category,
      };
    });
  }, [selectedDepartment, selectedCategory, searchQuery, categories]);

  // Category statistics
  const categoryStats = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      subjectCount: mockData.subjects.filter((s: Subject) => s.categoryId === category.id).length,
    }));
  }, [categories]);

  // Check if user can edit a subject
  const canEditSubject = (subject: Subject) => {
    // Admin can edit any subject
    if (hasPermission('edit.subject')) return true;
    
    // Head of subject can edit their subject
    if (subject.headTeacherId === currentUserId) return true;
    
    return false;
  };

  // Check if user can manage categories
  const canManageCategories = hasPermission('admin.manage');

  // Toggle expanded state
  const toggleExpanded = (subjectId: string) => {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subjectId)) {
        next.delete(subjectId);
      } else {
        next.add(subjectId);
      }
      return next;
    });
  };

  // Handle subject save
  const handleSaveSubject = (data: Partial<Subject>) => {
    console.log('[SubjectManagement] Saving subject changes:', data);
    setSavedMessage('Subject updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  // Handle category save
  const handleSaveCategory = (data: CategoryFormData) => {
    if (editingCategory) {
      // Update existing
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, ...data, updatedAt: new Date().toISOString() }
            : c
        )
      );
      setSavedMessage('Category updated successfully!');
    } else {
      // Create new
      const newCategory: SubjectCategory = {
        id: `cat-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCategory]);
      setSavedMessage('Category created successfully!');
    }
    setTimeout(() => setSavedMessage(''), 3000);
  };

  // Handle category delete
  const handleDeleteCategory = (categoryId: string) => {
    const hasSubjects = mockData.subjects.some((s: Subject) => s.categoryId === categoryId);
    if (hasSubjects) {
      alert('Cannot delete category that has subjects assigned. Please reassign subjects first.');
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    setSavedMessage('Category deleted successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  // Console demonstration
  useEffect(() => {
    console.log('\n========== FEATURE 8: SUBJECT MANAGEMENT ==========\n');
    console.log(`[SubjectManagement] Current Role: ${currentRole}`);
    console.log(`[SubjectManagement] Current User: ${currentUserId}`);
    console.log(`[SubjectManagement] Total subjects: ${mockData.subjects.length}`);
    console.log(`[SubjectManagement] Filtered subjects: ${subjects.length}`);
    console.log(`[SubjectManagement] edit.subject permission: ${hasPermission('edit.subject')}`);
    console.log(`[SubjectManagement] Departments: ${departments.length - 1}`);
    console.log(`[SubjectManagement] Categories: ${categories.length}`);
    
    // List heads of subjects
    const heads = mockData.subjects
      .filter((s: Subject) => s.headTeacherId)
      .map((s: Subject) => {
        const teacher = mockData.teachers.find((t: Teacher) => t.id === s.headTeacherId);
        return { subject: s.name, head: teacher?.name };
      });
    console.log(`\n[SubjectManagement] Heads of Subjects:`);
    heads.forEach((h) => console.log(`  - ${h.subject}: ${h.head}`));
    
    // Category breakdown
    console.log(`\n[SubjectManagement] Category Distribution:`);
    categories.forEach((cat) => {
      const count = mockData.subjects.filter((s: Subject) => s.categoryId === cat.id).length;
      console.log(`  - ${cat.name}: ${count} subjects`);
    });
  }, [currentRole, currentUserId, subjects.length, hasPermission, departments, categories]);

  // Check view permission
  const canViewSubjects = hasPermission('view.subject.all');
  if (!canViewSubjects) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600">You don't have permission to view subjects.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Subject Management</h2>
            <p className="text-sm text-gray-500">
              {activeTab === 'subjects' ? `${subjects.length} subjects` : `${categories.length} categories`}
            </p>
          </div>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'subjects'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Subjects
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'categories'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {/* Saved Message */}
      {savedMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {savedMessage}
        </div>
      )}

      {/* SUBJECTS TAB */}
      {activeTab === 'subjects' && (
        <>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Filters:</span>
              
              {/* Department Filter */}
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.filter(d => d !== 'all').map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="">Uncategorized</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="flex-1 w-full lg:w-auto lg:ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subjects..."
                  className="w-full lg:w-64 pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border-l border-gray-300 pl-3">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                title="List View"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subjects Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-2'}>
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                isExpanded={expandedSubjects.has(subject.id)}
                onToggle={() => toggleExpanded(subject.id)}
                canEdit={canEditSubject(subject)}
                onEdit={() => setEditingSubject(subject)}
              />
            ))}
          </div>

          {/* Empty State */}
          {subjects.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No subjects found matching your filters.</p>
              <button
                onClick={() => {
                  setSelectedDepartment('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <>
          {/* Categories Header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Manage subject categories to organize your curriculum
            </p>
            {canManageCategories && (
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsCategoryModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            )}
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryStats.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                subjectCount={category.subjectCount}
                onEdit={() => {
                  setEditingCategory(category);
                  setIsCategoryModalOpen(true);
                }}
                onDelete={() => handleDeleteCategory(category.id)}
                canEdit={canManageCategories}
              />
            ))}
          </div>

          {/* Uncategorized Card */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Uncategorized Subjects</h3>
                  <p className="text-sm text-gray-500">
                    {mockData.subjects.filter((s: Subject) => !s.categoryId).length} subjects without a category
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('subjects');
                  setSelectedCategory('');
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Subjects
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit Subject Modal */}
      {editingSubject && (
        <EditSubjectModal
          subject={editingSubject}
          categories={categories}
          onClose={() => setEditingSubject(null)}
          onSave={handleSaveSubject}
        />
      )}

      {/* Category Modal */}
      <CategoryModal
        category={editingCategory}
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default SubjectManagement;
