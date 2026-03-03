/**
 * SETU Education Management System - Feature 3: Global Search
 * Global search component with role-based filtering
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Search, User, GraduationCap, BookOpen, Users, Loader2 } from 'lucide-react';
import { mockData } from '../../data';
import { usePermissions } from '../../context/permission-context';
import type { SearchResult, Role, Student, Teacher, Parent, Admin, Librarian, ClassGrade } from '../../types';

// ==================== TYPES ====================

interface GlobalSearchProps {
  placeholder?: string;
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
  maxResults?: number;
}

type SearchFilterType = 'all' | 'students' | 'teachers' | 'parents' | 'staff';

interface SearchFilters {
  type: SearchFilterType;
  query: string;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert mock data entities to SearchResult format
 */
const convertToSearchResult = (
  entity: any,
  type: SearchResult['type'],
  role: Role,
  additionalInfo?: Partial<SearchResult>
): SearchResult => {
  return {
    type,
    id: entity.id,
    name: entity.name,
    email: entity.email,
    role,
    ...additionalInfo,
  };
};

/**
 * Check if user has permission to search entity type
 */
const canSearchType = (
  type: SearchResult['type'],
  hasPermission: (key: string) => boolean
): boolean => {
  switch (type) {
    case 'student':
      return hasPermission('search.students');
    case 'teacher':
      return hasPermission('search.teachers');
    case 'parent':
      return hasPermission('search.parents');
    case 'staff':
      return hasPermission('search.staff');
    default:
      return false;
  }
};

// ==================== SUB-COMPONENTS ====================

/**
 * Search result item component
 */
const SearchResultItem: React.FC<{
  result: SearchResult;
  onClick: () => void;
  isSelected: boolean;
}> = ({ result, onClick, isSelected }) => {
  const getIcon = () => {
    switch (result.type) {
      case 'student':
        return <GraduationCap className="w-5 h-5 text-blue-500" />;
      case 'teacher':
        return <BookOpen className="w-5 h-5 text-green-500" />;
      case 'parent':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'staff':
        return <User className="w-5 h-5 text-orange-500" />;
      default:
        return <User className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = () => {
    switch (result.type) {
      case 'student':
        return result.className ? `Student - ${result.className}` : 'Student';
      case 'teacher':
        return result.department ? `Teacher - ${result.department}` : 'Teacher';
      case 'parent':
        return result.childName ? `Parent of ${result.childName}` : 'Parent';
      case 'staff':
        return result.department ? `Staff - ${result.department}` : 'Staff';
      default:
        return 'User';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors ${
        isSelected
          ? 'bg-blue-50 border-blue-200 border'
          : 'hover:bg-gray-50 border border-transparent'
      }`}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{result.name}</p>
        <p className="text-sm text-gray-500 truncate">{result.email}</p>
        <p className="text-xs text-gray-400">{getTypeLabel()}</p>
      </div>
    </button>
  );
};

/**
 * Filter tabs component
 */
const FilterTabs: React.FC<{
  activeFilter: SearchFilterType;
  onFilterChange: (filter: SearchFilterType) => void;
  hasPermission: (key: string) => boolean;
}> = ({ activeFilter, onFilterChange, hasPermission }) => {
  const filters: { key: SearchFilterType; label: string; permission: string }[] = [
    { key: 'all', label: 'All', permission: '' },
    { key: 'students', label: 'Students', permission: 'search.students' },
    { key: 'teachers', label: 'Teachers', permission: 'search.teachers' },
    { key: 'parents', label: 'Parents', permission: 'search.parents' },
    { key: 'staff', label: 'Staff', permission: 'search.staff' },
  ];

  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
      {filters.map((filter) => {
        // Show all tab always, others require permission
        if (filter.key !== 'all' && !hasPermission(filter.permission)) {
          return null;
        }

        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeFilter === filter.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

/**
 * Global Search Component
 * Provides unified search across all entity types with role-based filtering
 */
export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  placeholder = 'Search students, teachers, parents...',
  onResultSelect,
  className = '',
  maxResults = 10,
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ type: 'all', query: '' });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const { hasPermission, currentRole } = usePermissions();

  // Console demonstration on mount
  useEffect(() => {
    console.log('\n========== FEATURE 3: GLOBAL SEARCH ==========\n');
    console.log(`[GlobalSearch] Initialized for role: ${currentRole}`);
    console.log(`[GlobalSearch] Search permissions:`);
    console.log(`  → search.students: ${hasPermission('search.students')}`);
    console.log(`  → search.teachers: ${hasPermission('search.teachers')}`);
    console.log(`  → search.parents: ${hasPermission('search.parents')}`);
    console.log(`  → search.staff: ${hasPermission('search.staff')}`);
  }, [currentRole, hasPermission]);

  /**
   * Perform search across all accessible entity types
   */
  const performSearch = useCallback(
    (searchQuery: string, filterType: SearchFilterType): SearchResult[] => {
      if (!searchQuery.trim()) return [];

      const searchResults: SearchResult[] = [];
      const lowerQuery = searchQuery.toLowerCase();

      // Search students
      if (
        (filterType === 'all' || filterType === 'students') &&
        hasPermission('search.students')
      ) {
        const students = mockData.students.filter(
          (s) =>
            s.name.toLowerCase().includes(lowerQuery) ||
            s.email.toLowerCase().includes(lowerQuery) ||
            s.studentId.toLowerCase().includes(lowerQuery)
        );

        students.forEach((student) => {
          const classGrade = mockData.classes.find(
            (c) => c.id === student.classId
          );
          searchResults.push(
            convertToSearchResult(student, 'student', 'student', {
              className: classGrade?.name,
            })
          );
        });

        console.log(`[GlobalSearch] Found ${students.length} students`);
      }

      // Search teachers
      if (
        (filterType === 'all' || filterType === 'teachers') &&
        hasPermission('search.teachers')
      ) {
        const teachers = mockData.teachers.filter(
          (t) =>
            t.name.toLowerCase().includes(lowerQuery) ||
            t.email.toLowerCase().includes(lowerQuery) ||
            t.employeeId.toLowerCase().includes(lowerQuery)
        );

        teachers.forEach((teacher) => {
          searchResults.push(
            convertToSearchResult(teacher, 'teacher', 'teacher', {
              department: teacher.department,
            })
          );
        });

        console.log(`[GlobalSearch] Found ${teachers.length} teachers`);
      }

      // Search parents
      if (
        (filterType === 'all' || filterType === 'parents') &&
        hasPermission('search.parents')
      ) {
        const parents = mockData.parents.filter(
          (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.email.toLowerCase().includes(lowerQuery)
        );

        parents.forEach((parent) => {
          // Get first child's name for display
          const firstChild = mockData.students.find(
            (s) => s.id === parent.children[0]
          );
          searchResults.push(
            convertToSearchResult(parent, 'parent', 'parent', {
              childName: firstChild?.name,
            })
          );
        });

        console.log(`[GlobalSearch] Found ${parents.length} parents`);
      }

      // Search staff (admins and librarians)
      if (
        (filterType === 'all' || filterType === 'staff') &&
        hasPermission('search.staff')
      ) {
        const admins = mockData.admins.filter(
          (a) =>
            a.name.toLowerCase().includes(lowerQuery) ||
            a.email.toLowerCase().includes(lowerQuery)
        );

        const librarians = mockData.librarians.filter(
          (l) =>
            l.name.toLowerCase().includes(lowerQuery) ||
            l.email.toLowerCase().includes(lowerQuery)
        );

        admins.forEach((admin) => {
          searchResults.push(
            convertToSearchResult(admin, 'staff', 'admin', {
              department: admin.department,
            })
          );
        });

        librarians.forEach((librarian) => {
          searchResults.push(
            convertToSearchResult(librarian, 'staff', 'librarian', {
              department: librarian.department,
            })
          );
        });

        console.log(
          `[GlobalSearch] Found ${admins.length} admins, ${librarians.length} librarians`
        );
      }

      // Sort by relevance (exact matches first, then by name)
      searchResults.sort((a, b) => {
        const aExact = a.name.toLowerCase() === lowerQuery;
        const bExact = b.name.toLowerCase() === lowerQuery;
        if (aExact && !bExact) return -1;
        if (bExact && !aExact) return 1;
        return a.name.localeCompare(b.name);
      });

      return searchResults.slice(0, maxResults);
    },
    [hasPermission, maxResults]
  );

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const searchResults = performSearch(query, filters.type);
      setResults(searchResults);
      setSelectedIndex(0);
      setIsLoading(false);

      console.log(
        `[GlobalSearch] Total results: ${searchResults.length} (query: "${query}", filter: ${filters.type})`
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters.type, performSearch]);

  const handleResultSelect = (result: SearchResult) => {
    console.log(`[GlobalSearch] Selected: ${result.name} (${result.type})`);
    onResultSelect?.(result);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleResultSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (query.trim() || results.length > 0) && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Filter Tabs */}
          <div className="p-2 border-b border-gray-100">
            <FilterTabs
              activeFilter={filters.type}
              onFilterChange={(type) => {
                setFilters((prev) => ({ ...prev, type }));
                console.log(`[GlobalSearch] Filter changed to: ${type}`);
              }}
              hasPermission={hasPermission}
            />
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {query.trim() ? (
                  <p>No results found for "{query}"</p>
                ) : (
                  <p>Start typing to search...</p>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((result, index) => (
                  <SearchResultItem
                    key={`${result.type}-${result.id}`}
                    result={result}
                    onClick={() => handleResultSelect(result)}
                    isSelected={index === selectedIndex}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="p-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center">
              {results.length} result{results.length !== 1 ? 's' : ''} found
              {currentRole && ` • Searching as ${currentRole}`}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default GlobalSearch;
