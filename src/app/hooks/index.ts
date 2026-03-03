/**
 * SETU Education Management System - Hooks Exports
 * 
 * Custom React hooks for the SETU application
 */

// Permission-related hooks
export {
  usePermissions,
  usePermission,
  useHasAccess,
  useModuleAccess,
  useModulePermissions,
} from '../context/permission-context';

// Re-export all hooks from context for convenience
export type {
  PermissionContextType,
  PermissionCheckContext,
  PermissionProviderProps,
} from '../context/permission-context';
