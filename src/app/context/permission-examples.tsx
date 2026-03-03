/**
 * SETU Education Management System - Permission System Usage Examples
 * Comprehensive examples of how to use the permission system in components
 */

import React from 'react';
import {
  PermissionProvider,
  usePermissions,
  usePermission,
  useHasAccess,
  useModuleAccess,
  PermissionGate,
  withPermission,
} from './permission-context';
import type { Role } from '../types';

// ==================== EXAMPLE 1: BASIC PERMISSION CHECK ====================

/**
 * Example component showing basic permission check
 */
const CreateAssignmentButton: React.FC = () => {
  // Check single permission
  const canCreateAssignment = usePermission('create.assignment');
  
  return (
    <button
      disabled={!canCreateAssignment}
      className={`px-4 py-2 rounded ${
        canCreateAssignment
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
      onClick={() => console.log('Creating assignment...')}
    >
      {canCreateAssignment ? 'Create Assignment' : 'No Permission'}
    </button>
  );
};

// ==================== EXAMPLE 2: MULTIPLE PERMISSIONS ====================

/**
 * Example component checking multiple permissions
 */
const GradebookActions: React.FC = () => {
  // Check multiple permissions
  const canViewGradebook = usePermission('view.gradebook.all');
  const canEditGrades = usePermission('edit.gradebook');
  const canExportGrades = usePermission('export.gradebook');
  
  // Or use useHasAccess for any/all checks
  const canManageGrades = useHasAccess([
    'view.gradebook.all',
    'edit.gradebook',
  ]);
  
  return (
    <div className="space-x-2">
      {canViewGradebook && (
        <button className="px-4 py-2 bg-green-500 text-white rounded">
          View Grades
        </button>
      )}
      
      {canEditGrades && (
        <button className="px-4 py-2 bg-yellow-500 text-white rounded">
          Edit Grades
        </button>
      )}
      
      {canExportGrades && (
        <button className="px-4 py-2 bg-purple-500 text-white rounded">
          Export
        </button>
      )}
    </div>
  );
};

// ==================== EXAMPLE 3: OWN RECORD PERMISSIONS ====================

/**
 * Example showing "own" record permissions for students
 */
interface StudentGradeViewProps {
  studentId: string;
  currentStudentId: string;
}

const StudentGradeView: React.FC<StudentGradeViewProps> = ({
  studentId,
  currentStudentId,
}) => {
  // Student can only view their own grades
  const canViewGrades = usePermission('view.student.grades', {
    isOwnRecord: studentId === currentStudentId,
  });
  
  if (!canViewGrades) {
    return <div className="text-red-500">Access denied. You can only view your own grades.</div>;
  }
  
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Your Grades</h3>
      {/* Grade content here */}
    </div>
  );
};

// ==================== EXAMPLE 4: PARENT CHILD PERMISSIONS ====================

/**
 * Example showing "own child" permissions for parents
 */
interface ParentChildViewProps {
  studentId: string;
  parentChildrenIds: string[];
}

const ParentChildView: React.FC<ParentChildViewProps> = ({
  studentId,
  parentChildrenIds,
}) => {
  // Parent can only view their children's records
  const canViewChild = usePermission('view.student.full', {
    isOwnChildRecord: parentChildrenIds.includes(studentId),
  });
  
  if (!canViewChild) {
    return <div className="text-red-500">Access denied. This is not your child.</div>;
  }
  
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Child Profile</h3>
      {/* Child details here */}
    </div>
  );
};

// ==================== EXAMPLE 5: PERMISSION GATE COMPONENT ====================

/**
 * Example using PermissionGate for conditional rendering
 */
const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {/* Only admins can see user management */}
      <PermissionGate
        permissionKey="search.students"
        fallback={<div className="text-gray-500">User management restricted</div>}
      >
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="font-bold">User Management</h2>
          <p>Manage system users here...</p>
        </div>
      </PermissionGate>
      
      {/* Only teachers and admins can see this */}
      <PermissionGate permissionKey={['create.assignment', 'edit.assignment']}>
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="font-bold">Assignment Management</h2>
          <p>Create and edit assignments...</p>
        </div>
      </PermissionGate>
      
      {/* Blocked for parents */}
      <PermissionGate
        permissionKey="borrow.book"
        fallback={<div className="text-orange-500">Library borrowing is blocked for parents</div>}
      >
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold">Library</h2>
          <p>Borrow books here...</p>
        </div>
      </PermissionGate>
    </div>
  );
};

// ==================== EXAMPLE 6: HOC PATTERN ====================

/**
 * Example component to be wrapped with HOC
 */
const SensitiveDataComponent: React.FC = () => {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <h3 className="text-red-700 font-bold">Sensitive Admin Data</h3>
      <p>This component is only visible to admins.</p>
    </div>
  );
};

// Wrap with permission HOC
const ProtectedSensitiveData = withPermission(SensitiveDataComponent, {
  permissionKey: 'view.student.notes',
  fallback: <div className="p-4 text-gray-500">You don't have access to sensitive data</div>,
});

// ==================== EXAMPLE 7: MODULE ACCESS ====================

/**
 * Example showing module-level access check
 */
const LibraryModule: React.FC = () => {
  const canAccessLibrary = useModuleAccess('library');
  
  if (!canAccessLibrary) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl text-gray-600">Library Module</h2>
        <p className="text-gray-400">You don't have access to this module</p>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Library</h2>
      {/* Library content */}
    </div>
  );
};

// ==================== EXAMPLE 8: CONFIGURABLE PERMISSIONS PANEL ====================

/**
 * Example admin panel for configuring permissions
 */
const PermissionConfigPanel: React.FC = () => {
  const {
    getConfigurablePermissions,
    getEffectiveAccess,
    addAccessConfig,
    currentRole,
  } = usePermissions();
  
  // Get configurable permissions for teachers
  const teacherPermissions = getConfigurablePermissions('teacher');
  
  const handleTogglePermission = (permissionKey: string, currentAccess: 'allow' | 'deny') => {
    const newAccess = currentAccess === 'allow' ? 'deny' : 'allow';
    addAccessConfig(permissionKey, 'teacher', newAccess);
  };
  
  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Teacher Permission Configuration</h2>
      
      <div className="space-y-2">
        {teacherPermissions.map((permission) => {
          const effectiveAccess = getEffectiveAccess(permission.key, 'teacher');
          
          return (
            <div
              key={permission.id}
              className="flex items-center justify-between p-3 border rounded"
            >
              <div>
                <h4 className="font-semibold">{permission.name}</h4>
                <p className="text-sm text-gray-500">{permission.description}</p>
              </div>
              
              <button
                onClick={() => handleTogglePermission(permission.key, effectiveAccess)}
                className={`px-4 py-2 rounded ${
                  effectiveAccess === 'allow'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {effectiveAccess === 'allow' ? 'Allowed' : 'Denied'}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
        <p>Current Role: <strong>{currentRole}</strong></p>
        <p>Configurable permissions for teachers allow admins to customize access.</p>
      </div>
    </div>
  );
};

// ==================== EXAMPLE 9: ROLE-BASED NAVIGATION ====================

/**
 * Example navigation that adapts based on role permissions
 */
const RoleBasedNavigation: React.FC = () => {
  const { hasPermission } = usePermissions();
  
  const navItems = [
    { label: 'Dashboard', path: '/', permission: null },
    { label: 'Students', path: '/students', permission: 'search.students' },
    { label: 'Teachers', path: '/teachers', permission: 'search.teachers' },
    { label: 'Assignments', path: '/assignments', permission: 'view.assignment.all' },
    { label: 'Gradebook', path: '/gradebook', permission: 'view.gradebook.all' },
    { label: 'Library', path: '/library', permission: 'borrow.book' },
    { label: 'Reports', path: '/reports', permission: 'view.reports.student' },
    { label: 'Settings', path: '/settings', permission: 'admin.timetable' },
  ];
  
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        {navItems.map((item) => {
          // Show if no permission required or has permission
          const canShow = !item.permission || hasPermission(item.permission);
          
          if (!canShow) return null;
          
          return (
            <li key={item.path}>
              <a
                href={item.path}
                className="hover:text-blue-300 transition-colors"
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

// ==================== EXAMPLE 10: COMPLETE APP WRAPPER ====================

/**
 * Example of wrapping the entire app with PermissionProvider
 */
interface AppWithPermissionsProps {
  initialRole?: Role;
  children: React.ReactNode;
}

const AppWithPermissionsExample: React.FC<AppWithPermissionsProps> = ({
  initialRole = 'admin',
  children,
}) => {
  return (
    <PermissionProvider initialRole={initialRole} initialUserId="usr001">
      <div className="min-h-screen bg-gray-50">
        <RoleBasedNavigation />
        <main className="container mx-auto py-6">
          {children}
        </main>
      </div>
    </PermissionProvider>
  );
};

// ==================== EXAMPLE 11: CONSOLE DEMO COMPONENT ====================

/**
 * Component that runs permission demonstrations in console
 */
const PermissionConsoleDemo: React.FC = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, getRolePermissions } = usePermissions();
  
  React.useEffect(() => {
    console.log('\n========== REACT PERMISSION SYSTEM DEMO ==========\n');
    
    // Demo permission checks
    console.log('[REACT DEMO] Permission checks from component:');
    console.log(`  → Can create assignment: ${hasPermission('create.assignment')}`);
    console.log(`  → Can manage library: ${hasPermission('manage.library')}`);
    console.log(`  → Can assign tickets: ${hasPermission('assign.ticket')}`);
    console.log(`  → Can borrow books: ${hasPermission('borrow.book')}`);
    
    // Demo multiple permissions
    const assignmentPerms = ['create.assignment', 'edit.assignment', 'grade.assignment'];
    console.log(`\n[REACT DEMO] Multiple permission checks:`);
    console.log(`  → Has ANY assignment permission: ${hasAnyPermission(assignmentPerms)}`);
    console.log(`  → Has ALL assignment permissions: ${hasAllPermissions(assignmentPerms)}`);
    
    // Demo role permissions
    const rolePerms = getRolePermissions();
    console.log(`\n[REACT DEMO] Role has ${rolePerms.length} permissions available`);
    
    console.log('\n========== END REACT DEMO ==========\n');
  }, [hasPermission, hasAnyPermission, hasAllPermissions, getRolePermissions]);
  
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
      <h3 className="text-blue-800 font-bold">Permission System Active</h3>
      <p className="text-blue-600 text-sm">Check the browser console for permission demonstrations.</p>
    </div>
  );
};

// ==================== EXAMPLE 12: ERROR BOUNDARY ====================

/**
 * Error boundary for permission errors
 */
class PermissionErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error) {
    console.error('[PERMISSION ERROR]', error);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          <h3 className="font-bold">Permission System Error</h3>
          <p>Something went wrong with the permission system.</p>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// ==================== EXPORTS ====================

export {
  // Example components
  CreateAssignmentButton,
  GradebookActions,
  StudentGradeView,
  ParentChildView,
  AdminDashboard,
  ProtectedSensitiveData,
  LibraryModule,
  PermissionConfigPanel,
  RoleBasedNavigation,
  AppWithPermissionsExample,
  PermissionConsoleDemo,
  PermissionErrorBoundary,
};

// ==================== USAGE DOCUMENTATION ====================

/**
 * USAGE EXAMPLES:
 * 
 * 1. Wrap your app with PermissionProvider:
 * 
 *    <PermissionProvider initialRole="teacher" initialUserId="tch001">
 *      <App />
 *    </PermissionProvider>
 * 
 * 2. Use usePermission hook in components:
 * 
 *    const canEdit = usePermission('edit.gradebook');
 *    if (!canEdit) return <AccessDenied />;
 * 
 * 3. Use useHasAccess for multiple permissions:
 * 
 *    const canManage = useHasAccess(['create.assignment', 'edit.assignment']);
 * 
 * 4. Use PermissionGate for conditional rendering:
 * 
 *    <PermissionGate permissionKey="manage.library" fallback={<NoAccess />}>
 *      <LibraryManagement />
 *    </PermissionGate>
 * 
 * 5. Use withPermission HOC:
 * 
 *    const ProtectedComponent = withPermission(Component, {
 *      permissionKey: 'view.student.full',
 *      fallback: <AccessDenied />
 *    });
 * 
 * 6. Check "own" record permissions:
 * 
 *    const canView = usePermission('view.student.grades', {
 *      isOwnRecord: studentId === currentUserId
 *    });
 * 
 * 7. Check "own child" permissions:
 * 
 *    const canView = usePermission('view.student.full', {
 *      isOwnChildRecord: parentChildrenIds.includes(studentId)
 *    });
 * 
 * 8. Use module access:
 * 
 *    const canAccess = useModuleAccess('library');
 * 
 * 9. Configure permissions dynamically:
 * 
 *    const { addAccessConfig } = usePermissions();
 *    addAccessConfig('create.assignment', 'teacher', 'allow');
 * 
 * 10. Get all permissions for current role:
 * 
 *     const permissions = getRolePermissions();
 */
