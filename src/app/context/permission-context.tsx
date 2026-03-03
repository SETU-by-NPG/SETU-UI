/**
 * SETU Education Management System - Permission Context
 * React Context for role-based access control
 */

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import type {
  Role,
  RoleCategory,
  AccessConfig,
  Permission,
  SLTPermissions,
} from "../types";
import {
  DEFAULT_PERMISSIONS,
  hasPermission as checkPermission,
  hasAnyPermission as checkAnyPermission,
  hasAllPermissions as checkAllPermissions,
  getRolePermissions as getPermissionsForRole,
  getConfigurablePermissionsForRole,
  createAccessConfig,
  getEffectivePermission,
  roleCategories,
} from "../data/permissions";

// ==================== CONTEXT TYPE ====================

interface PermissionContextType {
  // Current user info
  currentRole: Role;
  currentUserId: string;

  // User switching (for demo purposes)
  setCurrentUser: (
    userId: string,
    role: Role,
    sltPermissions?: SLTPermissions,
  ) => void;

  // Permission checking
  hasPermission: (
    permissionKey: string,
    context?: PermissionCheckContext,
  ) => boolean;
  hasAnyPermission: (
    permissionKeys: string[],
    context?: PermissionCheckContext,
  ) => boolean;
  hasAllPermissions: (
    permissionKeys: string[],
    context?: PermissionCheckContext,
  ) => boolean;

  // Role helpers
  hasSLTAccess: () => boolean;
  getRoleCategory: () => RoleCategory;

  // Permission queries
  getRolePermissions: (role?: Role) => Permission[];
  getConfigurablePermissions: (role?: Role) => Permission[];
  getEffectiveAccess: (permissionKey: string, role?: Role) => "allow" | "deny";

  // Access configuration management
  accessConfigs: AccessConfig[];
  addAccessConfig: (
    permissionKey: string,
    role: Role,
    access: "allow" | "deny",
    config?: Record<string, unknown>,
  ) => void;
  removeAccessConfig: (configId: string) => void;
  updateAccessConfig: (
    configId: string,
    access: "allow" | "deny",
    config?: Record<string, unknown>,
  ) => void;

  // Utility
  canAccessModule: (module: string) => boolean;
  getPermissionsByModule: (module: string) => Permission[];
}

interface PermissionCheckContext {
  isOwnRecord?: boolean;
  isOwnChildRecord?: boolean;
  isHeadOfSubject?: boolean;
  isClassTeacher?: boolean;
}

// ==================== CONTEXT CREATION ====================

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined,
);

// ==================== PROVIDER PROPS ====================

interface PermissionProviderProps {
  children: React.ReactNode;
  initialRole?: Role;
  initialUserId?: string;
  initialAccessConfigs?: AccessConfig[];
  initialSLTPermissions?: SLTPermissions;
}

// ==================== PROVIDER COMPONENT ====================

export const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
  initialRole = "master_admin",
  initialUserId = "usr001",
  initialAccessConfigs = [],
  initialSLTPermissions,
}) => {
  // State
  const [currentRole, setCurrentRole] = useState<Role>(initialRole);
  const [currentUserId, setCurrentUserId] = useState<string>(initialUserId);
  const [accessConfigs, setAccessConfigs] =
    useState<AccessConfig[]>(initialAccessConfigs);
  const [currentSLTPermissions, setCurrentSLTPermissions] = useState<
    SLTPermissions | undefined
  >(initialSLTPermissions);

  // ==================== PERMISSION CHECKING ====================

  const hasPermission = useCallback(
    (permissionKey: string, context?: PermissionCheckContext): boolean => {
      return checkPermission(currentRole, permissionKey, {
        ...context,
        sltPermissions: currentSLTPermissions,
      });
    },
    [currentRole, currentSLTPermissions],
  );

  const hasAnyPermission = useCallback(
    (permissionKeys: string[], context?: PermissionCheckContext): boolean => {
      return checkAnyPermission(currentRole, permissionKeys, {
        ...context,
        sltPermissions: currentSLTPermissions,
      });
    },
    [currentRole, currentSLTPermissions],
  );

  const hasAllPermissions = useCallback(
    (permissionKeys: string[], context?: PermissionCheckContext): boolean => {
      return checkAllPermissions(currentRole, permissionKeys, {
        ...context,
        sltPermissions: currentSLTPermissions,
      });
    },
    [currentRole, currentSLTPermissions],
  );

  // ==================== ROLE HELPERS ====================

  const hasSLTAccess = useCallback((): boolean => {
    return currentSLTPermissions?.isSLT === true;
  }, [currentSLTPermissions]);

  const getRoleCategory = useCallback((): RoleCategory => {
    for (const [category, data] of Object.entries(roleCategories) as [
      RoleCategory,
      { label: string; roles: Role[] },
    ][]) {
      if (data.roles.includes(currentRole)) return category;
    }
    return "support";
  }, [currentRole]);

  // ==================== PERMISSION QUERIES ====================

  const getRolePermissions = useCallback(
    (role?: Role): Permission[] => {
      return getPermissionsForRole(role || currentRole);
    },
    [currentRole],
  );

  const getConfigurablePermissions = useCallback(
    (role?: Role): Permission[] => {
      return getConfigurablePermissionsForRole(role || currentRole);
    },
    [currentRole],
  );

  const getEffectiveAccess = useCallback(
    (permissionKey: string, role?: Role): "allow" | "deny" => {
      return getEffectivePermission(
        permissionKey,
        role || currentRole,
        accessConfigs,
      );
    },
    [currentRole, accessConfigs],
  );

  // ==================== ACCESS CONFIG MANAGEMENT ====================

  const addAccessConfig = useCallback(
    (
      permissionKey: string,
      role: Role,
      access: "allow" | "deny",
      config?: Record<string, unknown>,
    ) => {
      const newConfig = createAccessConfig(
        permissionKey,
        role,
        access,
        currentUserId,
        config,
      );
      setAccessConfigs((prev) => [...prev, newConfig]);
      console.log(
        `[PERMISSION] Config added: ${permissionKey} for ${role} = ${access} by ${currentUserId}`,
      );
    },
    [currentUserId],
  );

  const removeAccessConfig = useCallback((configId: string) => {
    setAccessConfigs((prev) => prev.filter((c) => c.id !== configId));
    console.log(`[PERMISSION] Config removed: ${configId}`);
  }, []);

  const updateAccessConfig = useCallback(
    (
      configId: string,
      access: "allow" | "deny",
      config?: Record<string, unknown>,
    ) => {
      setAccessConfigs((prev) =>
        prev.map((c) =>
          c.id === configId
            ? {
                ...c,
                access,
                config: config || c.config,
                updatedBy: currentUserId,
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
      );
      console.log(`[PERMISSION] Config updated: ${configId} = ${access}`);
    },
    [currentUserId],
  );

  // ==================== UTILITY FUNCTIONS ====================

  const canAccessModule = useCallback(
    (module: string): boolean => {
      const modulePermissions = DEFAULT_PERMISSIONS.filter(
        (p) => p.module === module,
      );
      return modulePermissions.some((p) => hasPermission(p.key));
    },
    [hasPermission],
  );

  const getPermissionsByModule = useCallback((module: string): Permission[] => {
    return DEFAULT_PERMISSIONS.filter((p) => p.module === module);
  }, []);

  // ==================== USER SWITCHING (Demo Only) ====================

  const setCurrentUser = useCallback(
    (userId: string, role: Role, sltPermissions?: SLTPermissions) => {
      setCurrentUserId(userId);
      setCurrentRole(role);
      setCurrentSLTPermissions(sltPermissions);
      console.log(
        `[PERMISSION] Switched to user: ${userId} with role: ${role}${sltPermissions?.isSLT ? " (SLT)" : ""}`,
      );
    },
    [],
  );

  // ==================== CONTEXT VALUE ====================

  const contextValue = useMemo<PermissionContextType>(
    () => ({
      currentRole,
      currentUserId,
      setCurrentUser,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      hasSLTAccess,
      getRoleCategory,
      getRolePermissions,
      getConfigurablePermissions,
      getEffectiveAccess,
      accessConfigs,
      addAccessConfig,
      removeAccessConfig,
      updateAccessConfig,
      canAccessModule,
      getPermissionsByModule,
    }),
    [
      currentRole,
      currentUserId,
      setCurrentUser,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      hasSLTAccess,
      getRoleCategory,
      getRolePermissions,
      getConfigurablePermissions,
      getEffectiveAccess,
      accessConfigs,
      addAccessConfig,
      removeAccessConfig,
      updateAccessConfig,
      canAccessModule,
      getPermissionsByModule,
    ],
  );

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
};

// ==================== HOOKS ====================

/**
 * Hook to access the full permission context
 *
 * @returns {PermissionContextType} The permission context containing all permission-related methods and state
 * @throws {Error} If used outside of a PermissionProvider
 *
 * @example
 * ```tsx
 * const { hasPermission, currentRole } = usePermissions();
 * if (hasPermission('students.view')) { ... }
 * ```
 */
export const usePermissions = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};

/**
 * Hook to check if the current user has a specific permission
 *
 * @param {string} permissionKey - The unique key of the permission to check (e.g., 'students.view', 'grades.edit')
 * @param {PermissionCheckContext} [context] - Optional context for permission evaluation (e.g., studentId for parent checks)
 * @returns {boolean} True if the user has the permission, false otherwise
 *
 * @example
 * ```tsx
 * const canEditGrades = usePermission('grades.edit');
 * const canViewStudent = usePermission('students.view', { studentId: '123' });
 * ```
 */
export const usePermission = (
  permissionKey: string,
  context?: PermissionCheckContext,
): boolean => {
  const { hasPermission } = usePermissions();
  return hasPermission(permissionKey, context);
};

/**
 * Hook to check if the user has access to any of the specified permissions
 * Useful for showing UI elements when user needs at least one of several permissions
 *
 * @param {string | string[]} permissionKeys - A single permission key or array of keys to check
 * @param {PermissionCheckContext} [context] - Optional context for permission evaluation
 * @returns {boolean} True if user has at least one of the specified permissions
 *
 * @example
 * ```tsx
 * const canAccessStudents = useHasAccess(['students.view', 'students.manage']);
 * const canAccessReports = useHasAccess('reports.view');
 * ```
 */
export const useHasAccess = (
  permissionKeys: string | string[],
  context?: PermissionCheckContext,
): boolean => {
  const { hasAnyPermission } = usePermissions();
  const keys = Array.isArray(permissionKeys)
    ? permissionKeys
    : [permissionKeys];
  return hasAnyPermission(keys, context);
};

/**
 * Hook to check if the user can access a specific module
 * Modules include: students, teachers, classes, attendance, grades, reports, etc.
 *
 * @param {string} module - The module name to check access for
 * @returns {boolean} True if user has any permission in the specified module
 *
 * @example
 * ```tsx
 * const canAccessAttendance = useModuleAccess('attendance');
 * const canAccessGrades = useModuleAccess('grades');
 * ```
 */
export const useModuleAccess = (module: string): boolean => {
  const { canAccessModule } = usePermissions();
  return canAccessModule(module);
};

/**
 * Hook to get all permissions associated with a specific module
 * Useful for building permission matrices or access control UIs
 *
 * @param {string} module - The module name to get permissions for
 * @returns {Permission[]} Array of permission objects for the specified module
 *
 * @example
 * ```tsx
 * const studentPermissions = useModulePermissions('students');
 * // Returns: [{ key: 'students.view', ... }, { key: 'students.edit', ... }]
 * ```
 */
export const useModulePermissions = (module: string): Permission[] => {
  const { getPermissionsByModule } = usePermissions();
  return useMemo(
    () => getPermissionsByModule(module),
    [getPermissionsByModule, module],
  );
};

// ==================== HOC ====================

interface WithPermissionProps {
  permissionKey: string;
  context?: PermissionCheckContext;
  fallback?: React.ReactNode;
}

/**
 * HOC to wrap components with permission check
 */
export const withPermission = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { permissionKey, context, fallback = null }: WithPermissionProps,
) => {
  return (props: P) => {
    const hasAccess = usePermission(permissionKey, context);

    if (!hasAccess) {
      return <>{fallback}</>;
    }

    return <WrappedComponent {...props} />;
  };
};

// ==================== CONDITIONAL RENDER COMPONENTS ====================

interface PermissionGateProps {
  permissionKey: string | string[];
  context?: PermissionCheckContext;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component to conditionally render based on permissions
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permissionKey,
  context,
  children,
  fallback = null,
}) => {
  const hasAccess = useHasAccess(permissionKey, context);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// ==================== EXPORTS ====================

export type {
  PermissionContextType,
  PermissionCheckContext,
  PermissionProviderProps,
};
export default PermissionContext;
