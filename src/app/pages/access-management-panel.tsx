/**
 * SETU Education Management System - Access Management Admin Panel
 * Comprehensive permission configuration dashboard for administrators
 */

import React, { useState, useCallback, useMemo } from "react";
import { usePermissions } from "../context/permission-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { ScrollArea } from "../components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Separator } from "../components/ui/separator";
import {
  Shield,
  Users,
  BookOpen,
  FileText,
  History,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCog,
  Library,
  Eye,
  Settings,
  Info,
} from "lucide-react";
import type {
  Role,
  Permission,
  AccessConfig,
  Teacher,
  AuditLog,
} from "../types";
import {
  DEFAULT_PERMISSIONS,
  getConfigurablePermissionsForRole,
} from "../data/permissions";
import { teachers as MOCK_TEACHERS } from "../data/mock-data";

// ==================== AUDIT TRAIL MANAGEMENT ====================

interface PermissionChangeEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: "grant" | "revoke" | "update";
  permissionKey: string;
  permissionName: string;
  role: Role;
  targetUserId?: string;
  targetUserName?: string;
  oldValue?: string;
  newValue?: string;
}

// Mock audit log for demonstration
const MOCK_AUDIT_LOG: PermissionChangeEntry[] = [
  {
    id: "audit001",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    userId: "usr001",
    userName: "Admin User",
    action: "grant",
    permissionKey: "academic.assignment.create",
    permissionName: "Create Assignments",
    role: "teacher",
    targetUserId: "tch001",
    targetUserName: "Sarah Johnson",
    newValue: "allow",
  },
  {
    id: "audit002",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    userId: "usr001",
    userName: "Admin User",
    action: "revoke",
    permissionKey: "academic.gradebook.edit",
    permissionName: "Edit Gradebook",
    role: "teacher",
    targetUserId: "tch002",
    targetUserName: "Michael Chen",
    oldValue: "allow",
    newValue: "deny",
  },
  {
    id: "audit003",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    userId: "usr001",
    userName: "Admin User",
    action: "update",
    permissionKey: "library.access.manage",
    permissionName: "Manage Library Access",
    role: "librarian",
    newValue: "allow",
  },
];

// ==================== ACCESS CONFIGURATION CONTEXT ====================

interface TeacherPermissionConfig {
  teacherId: string;
  teacherName: string;
  department: string;
  permissions: {
    "academic.assignment.create": boolean;
    "academic.assignment.edit": boolean;
    "academic.assignment.grade": boolean;
    "academic.assignment.delete": boolean;
    "academic.gradebook.view": boolean;
    "academic.gradebook.edit": boolean;
    "academic.gradebook.export": boolean;
    "academic.timetable.notes.edit": boolean;
  };
}

interface LibrarianConfig {
  canManageLibraryAccess: boolean;
  canManageBookCatalog: boolean;
  canViewBorrowingHistory: boolean;
  canManageFines: boolean;
}

interface ReportVisibilityConfig {
  admin: boolean;
  teacher: boolean;
  student: boolean;
  parent: boolean;
  librarian: boolean;
}

// ==================== MAIN COMPONENT ====================

export default function AccessManagementPanel() {
  const {
    currentRole,
    hasPermission,
    accessConfigs,
    addAccessConfig,
    updateAccessConfig,
    removeAccessConfig,
  } = usePermissions();

  // Use accessConfigs directly from context - no local state duplication
  const [auditLog, setAuditLog] =
    useState<PermissionChangeEntry[]>(MOCK_AUDIT_LOG);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRole, setSelectedRole] = useState<Role>("teacher");
  const [showChangeConfirmation, setShowChangeConfirmation] = useState(false);
  const [lastChange, setLastChange] = useState<PermissionChangeEntry | null>(
    null,
  );

  // Teacher-specific configurations
  const [teacherConfigs, setTeacherConfigs] = useState<
    TeacherPermissionConfig[]
  >(
    MOCK_TEACHERS.map((teacher) => ({
      teacherId: teacher.id,
      teacherName: teacher.name,
      department: teacher.department,
      permissions: {
        "academic.assignment.create": true,
        "academic.assignment.edit": true,
        "academic.assignment.grade": true,
        "academic.assignment.delete": false,
        "academic.gradebook.view": true,
        "academic.gradebook.edit": true,
        "academic.gradebook.export": true,
        "academic.timetable.notes.edit": true,
      },
    })),
  );

  // Librarian configuration
  const [librarianConfig, setLibrarianConfig] = useState<LibrarianConfig>({
    canManageLibraryAccess: true,
    canManageBookCatalog: true,
    canViewBorrowingHistory: true,
    canManageFines: true,
  });

  // Report visibility configuration
  const [reportVisibility, setReportVisibility] =
    useState<ReportVisibilityConfig>({
      admin: true,
      teacher: true,
      student: false,
      parent: false,
      librarian: false,
    });

  // Check if user is admin
  const isAdmin = currentRole === "master_admin";

  // Get all configurable permissions
  const configurablePermissions = useMemo(() => {
    return DEFAULT_PERMISSIONS.filter((p) => p.isConfigurable);
  }, []);

  // Get permissions grouped by module
  const permissionsByModule = useMemo(() => {
    const grouped: Record<string, Permission[]> = {};
    configurablePermissions.forEach((permission) => {
      if (!grouped[permission.module]) {
        grouped[permission.module] = [];
      }
      grouped[permission.module].push(permission);
    });
    return grouped;
  }, [configurablePermissions]);

  // Helper function to add audit log entry
  const addAuditEntry = useCallback(
    (entry: Omit<PermissionChangeEntry, "id" | "timestamp">) => {
      const newEntry: PermissionChangeEntry = {
        ...entry,
        id: `audit${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      setAuditLog((prev) => [newEntry, ...prev]);
      setLastChange(newEntry);
      setShowChangeConfirmation(true);

      // Console log for demonstration
      console.log(
        "%c[Access Management] Permission Change Logged:",
        "color: #4CAF50; font-weight: bold;",
        {
          action: entry.action,
          permission: entry.permissionName,
          role: entry.role,
          targetUser: entry.targetUserName || "N/A",
          oldValue: entry.oldValue,
          newValue: entry.newValue,
          timestamp: newEntry.timestamp,
        },
      );

      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowChangeConfirmation(false), 3000);
    },
    [],
  );

  // Handle role permission toggle
  const handleRolePermissionToggle = useCallback(
    (permission: Permission, role: Role, granted: boolean) => {
      const existingConfig = accessConfigs.find(
        (c: AccessConfig) =>
          c.permissionKey === permission.key && c.role === role,
      );

      if (existingConfig) {
        // Update existing config
        updateAccessConfig(existingConfig.id, granted ? "allow" : "deny");
      } else {
        // Create new config
        addAccessConfig(permission.key, role, granted ? "allow" : "deny");
      }

      // Add audit entry
      addAuditEntry({
        userId: "usr001",
        userName: "Admin User",
        action: granted ? "grant" : "revoke",
        permissionKey: permission.key,
        permissionName: permission.name,
        role,
        oldValue: existingConfig?.access,
        newValue: granted ? "allow" : "deny",
      });
    },
    [accessConfigs, addAccessConfig, updateAccessConfig, addAuditEntry],
  );

  // Handle teacher-specific permission toggle
  const handleTeacherPermissionToggle = useCallback(
    (teacherId: string, permissionKey: string, granted: boolean) => {
      setTeacherConfigs((prev) =>
        prev.map((config) => {
          if (config.teacherId === teacherId) {
            return {
              ...config,
              permissions: {
                ...config.permissions,
                [permissionKey]: granted,
              },
            };
          }
          return config;
        }),
      );

      const teacher = MOCK_TEACHERS.find((t) => t.id === teacherId);
      const permissionName = permissionKey.split(".").slice(1).join(" ");

      addAuditEntry({
        userId: "usr001",
        userName: "Admin User",
        action: granted ? "grant" : "revoke",
        permissionKey,
        permissionName: `Teacher: ${permissionName}`,
        role: "teacher",
        targetUserId: teacherId,
        targetUserName: teacher?.name,
        newValue: granted ? "allow" : "deny",
      });

      // Console log showing immediate effect
      console.log(
        "%c[Access Management] Teacher Permission Updated:",
        "color: #2196F3; font-weight: bold;",
        {
          teacher: teacher?.name,
          permission: permissionKey,
          granted,
          effect: granted
            ? "Teacher can now use this feature"
            : "Teacher can no longer use this feature",
        },
      );
    },
    [addAuditEntry],
  );

  // Handle librarian config toggle
  const handleLibrarianConfigToggle = useCallback(
    (key: keyof LibrarianConfig, value: boolean) => {
      setLibrarianConfig((prev) => ({ ...prev, [key]: value }));

      const permissionNames: Record<string, string> = {
        canManageLibraryAccess: "Manage Library Access",
        canManageBookCatalog: "Manage Book Catalog",
        canViewBorrowingHistory: "View Borrowing History",
        canManageFines: "Manage Fines",
      };

      addAuditEntry({
        userId: "usr001",
        userName: "Admin User",
        action: value ? "grant" : "revoke",
        permissionKey: `library.${key}`,
        permissionName: `Librarian: ${permissionNames[key]}`,
        role: "librarian",
        newValue: value ? "allow" : "deny",
      });

      console.log(
        "%c[Access Management] Librarian Config Updated:",
        "color: #9C27B0; font-weight: bold;",
        {
          permission: permissionNames[key],
          enabled: value,
          affectedModules: [
            "Library Management",
            "Book Catalog",
            "Student Access Control",
          ],
        },
      );
    },
    [addAuditEntry],
  );

  // Handle report visibility toggle
  const handleReportVisibilityToggle = useCallback(
    (role: keyof ReportVisibilityConfig, value: boolean) => {
      setReportVisibility((prev) => ({ ...prev, [role]: value }));

      addAuditEntry({
        userId: "usr001",
        userName: "Admin User",
        action: value ? "grant" : "revoke",
        permissionKey: "reports.view",
        permissionName: "View Student Reports",
        role,
        newValue: value ? "allow" : "deny",
      });

      console.log(
        "%c[Access Management] Report Visibility Updated:",
        "color: #FF9800; font-weight: bold;",
        {
          role,
          canViewReports: value,
          affectedReports: [
            "Student Academic Reports",
            "Attendance Reports",
            "Behavior Reports",
          ],
        },
      );
    },
    [addAuditEntry],
  );

  // Get effective permission status
  const getEffectivePermission = useCallback(
    (permissionKey: string, role: Role): boolean => {
      const config = accessConfigs.find(
        (c: AccessConfig) =>
          c.permissionKey === permissionKey && c.role === role,
      );
      if (config) {
        return config.access === "allow";
      }

      // Fall back to default
      const permission = DEFAULT_PERMISSIONS.find(
        (p) => p.key === permissionKey,
      );
      return permission?.roles.includes(role) ?? false;
    },
    [accessConfigs],
  );

  // Render permission toggle with context
  const PermissionToggle = ({
    permission,
    role,
    showContext = true,
  }: {
    permission: Permission;
    role: Role;
    showContext?: boolean;
  }) => {
    const isGranted = getEffectivePermission(permission.key, role);
    const affectedModules = useMemo(() => {
      const modules: string[] = [];
      if (permission.module) modules.push(permission.module);
      if (permission.key.includes("assignment"))
        modules.push("Assignments", "Gradebook");
      if (permission.key.includes("gradebook"))
        modules.push("Gradebook", "Reports");
      if (permission.key.includes("timetable"))
        modules.push("Timetable", "Scheduling");
      if (permission.key.includes("library"))
        modules.push("Library", "Book Management");
      return [...new Set(modules)];
    }, [permission]);

    return (
      <div className="flex items-start justify-between p-4 border rounded-lg mb-3 bg-card hover:bg-accent/5 transition-colors">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{permission.name}</span>
            <Badge
              variant={isGranted ? "default" : "secondary"}
              className="text-xs"
            >
              {isGranted ? "Granted" : "Denied"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {permission.description}
          </p>
          {showContext && affectedModules.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-muted-foreground">Affects:</span>
              {affectedModules.map((module) => (
                <Badge key={module} variant="outline" className="text-xs">
                  {module}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <Switch
          checked={isGranted}
          onCheckedChange={(checked) =>
            handleRolePermissionToggle(permission, role, checked)
          }
          disabled={!isAdmin}
        />
      </div>
    );
  };

  if (!isAdmin) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access the Access Management Panel.
            This feature is restricted to administrators only.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Access Management</h1>
        </div>
        <p className="text-muted-foreground">
          Configure permissions and access controls for all users in the system
        </p>
      </div>

      {/* Change Confirmation Toast */}
      {showChangeConfirmation && lastChange && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Permission Updated</AlertTitle>
          <AlertDescription className="text-green-700">
            {lastChange.action === "grant" ? "Granted" : "Revoked"}{" "}
            {lastChange.permissionName}
            {lastChange.targetUserName
              ? ` for ${lastChange.targetUserName}`
              : ` for ${lastChange.role}s`}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="gap-2">
            <Shield className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="teachers" className="gap-2">
            <UserCog className="h-4 w-4" />
            Teachers
          </TabsTrigger>
          <TabsTrigger value="librarians" className="gap-2">
            <Library className="h-4 w-4" />
            Librarians
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <History className="h-4 w-4" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Configurable Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {configurablePermissions.length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Across {Object.keys(permissionsByModule).length} modules
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Active Grants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {
                    accessConfigs.filter(
                      (c: AccessConfig) => c.access === "allow",
                    ).length
                  }
                </div>
                <p className="text-sm text-muted-foreground">
                  Custom permission configurations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Changes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{auditLog.length}</div>
                <p className="text-sm text-muted-foreground">
                  In the last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Permission Configuration by Role */}
          <Card>
            <CardHeader>
              <CardTitle>Permission Configuration by Role</CardTitle>
              <CardDescription>
                Toggle permissions for each role. Changes take effect
                immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="teacher">
                <TabsList className="mb-4">
                  <TabsTrigger value="teacher">Teachers</TabsTrigger>
                  <TabsTrigger value="student">Students</TabsTrigger>
                  <TabsTrigger value="parent">Parents</TabsTrigger>
                  <TabsTrigger value="librarian">Librarians</TabsTrigger>
                </TabsList>

                {(["teacher", "student", "parent", "librarian"] as Role[]).map(
                  (role) => (
                    <TabsContent key={role} value={role}>
                      <ScrollArea className="h-[500px]">
                        <div className="pr-4">
                          {configurablePermissions.length === 0 ? (
                            <Alert>
                              <Info className="h-4 w-4" />
                              <AlertTitle>
                                No Configurable Permissions
                              </AlertTitle>
                              <AlertDescription>
                                There are no configurable permissions available
                                for {role}s.
                              </AlertDescription>
                            </Alert>
                          ) : (
                            configurablePermissions.map((permission) => (
                              <PermissionToggle
                                key={permission.id}
                                permission={permission}
                                role={role}
                              />
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  ),
                )}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Teacher-Specific Permissions
              </CardTitle>
              <CardDescription>
                Configure individual permissions for each teacher. These
                settings override role-based defaults.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="space-y-4">
                {teacherConfigs.map((teacher) => (
                  <AccordionItem
                    key={teacher.teacherId}
                    value={teacher.teacherId}
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-semibold text-primary">
                              {teacher.teacherName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div className="text-left">
                            <p className="font-medium">{teacher.teacherName}</p>
                            <p className="text-sm text-muted-foreground">
                              {teacher.department}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {
                            Object.entries(teacher.permissions).filter(
                              ([_, v]) => v,
                            ).length
                          }{" "}
                          / {Object.keys(teacher.permissions).length}{" "}
                          permissions
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4 space-y-6">
                        {/* Assignment Management */}
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Assignment Management
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              {
                                key: "academic.assignment.create",
                                label: "Create Assignments",
                              },
                              {
                                key: "academic.assignment.edit",
                                label: "Edit Assignments",
                              },
                              {
                                key: "academic.assignment.grade",
                                label: "Grade Assignments",
                              },
                              {
                                key: "academic.assignment.delete",
                                label: "Delete Assignments",
                              },
                            ].map(({ key, label }) => (
                              <div
                                key={key}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <span className="text-sm">{label}</span>
                                <Switch
                                  checked={
                                    teacher.permissions[
                                      key as keyof typeof teacher.permissions
                                    ]
                                  }
                                  onCheckedChange={(checked) =>
                                    handleTeacherPermissionToggle(
                                      teacher.teacherId,
                                      key,
                                      checked,
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Gradebook Access */}
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Gradebook Access
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              {
                                key: "academic.gradebook.view",
                                label: "View Gradebook",
                              },
                              {
                                key: "academic.gradebook.edit",
                                label: "Edit Grades",
                              },
                              {
                                key: "academic.gradebook.export",
                                label: "Export Grades",
                              },
                            ].map(({ key, label }) => (
                              <div
                                key={key}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <span className="text-sm">{label}</span>
                                <Switch
                                  checked={
                                    teacher.permissions[
                                      key as keyof typeof teacher.permissions
                                    ]
                                  }
                                  onCheckedChange={(checked) =>
                                    handleTeacherPermissionToggle(
                                      teacher.teacherId,
                                      key,
                                      checked,
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Timetable Notes */}
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Timetable Features
                          </h4>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm">
                              Edit Student Notes in Timetable
                            </span>
                            <Switch
                              checked={
                                teacher.permissions[
                                  "academic.timetable.notes.edit"
                                ]
                              }
                              onCheckedChange={(checked) =>
                                handleTeacherPermissionToggle(
                                  teacher.teacherId,
                                  "academic.timetable.notes.edit",
                                  checked,
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Librarians Tab */}
        <TabsContent value="librarians" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Library className="h-5 w-5" />
                Librarian Configuration
              </CardTitle>
              <CardDescription>
                Configure permissions specific to librarian role for library
                management.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Manage Library Access</p>
                    <p className="text-sm text-muted-foreground">
                      Allow librarians to grant/revoke student library access
                    </p>
                  </div>
                  <Switch
                    checked={librarianConfig.canManageLibraryAccess}
                    onCheckedChange={(checked) =>
                      handleLibrarianConfigToggle(
                        "canManageLibraryAccess",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Manage Book Catalog</p>
                    <p className="text-sm text-muted-foreground">
                      Add, edit, and remove books from the catalog
                    </p>
                  </div>
                  <Switch
                    checked={librarianConfig.canManageBookCatalog}
                    onCheckedChange={(checked) =>
                      handleLibrarianConfigToggle(
                        "canManageBookCatalog",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">View Borrowing History</p>
                    <p className="text-sm text-muted-foreground">
                      Access complete borrowing records for all users
                    </p>
                  </div>
                  <Switch
                    checked={librarianConfig.canViewBorrowingHistory}
                    onCheckedChange={(checked) =>
                      handleLibrarianConfigToggle(
                        "canViewBorrowingHistory",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Manage Fines</p>
                    <p className="text-sm text-muted-foreground">
                      Issue and manage overdue fines
                    </p>
                  </div>
                  <Switch
                    checked={librarianConfig.canManageFines}
                    onCheckedChange={(checked) =>
                      handleLibrarianConfigToggle("canManageFines", checked)
                    }
                  />
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Library Access Management</AlertTitle>
                <AlertDescription>
                  When "Manage Library Access" is enabled, librarians can
                  control which students are allowed to borrow books. This
                  affects the Library module's access control features.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Student Report Visibility
              </CardTitle>
              <CardDescription>
                Configure which roles can view student reports and academic
                records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(
                  [
                    {
                      key: "admin",
                      label: "Administrators",
                      description: "Full access to all reports",
                    },
                    {
                      key: "teacher",
                      label: "Teachers",
                      description: "Access to their students' reports",
                    },
                    {
                      key: "student",
                      label: "Students",
                      description: "Access to their own reports only",
                    },
                    {
                      key: "parent",
                      label: "Parents",
                      description: "Access to their children's reports",
                    },
                    {
                      key: "librarian",
                      label: "Librarians",
                      description: "Access to library-related reports",
                    },
                  ] as const
                ).map(({ key, label, description }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                    <Switch
                      checked={reportVisibility[key]}
                      onCheckedChange={(checked) =>
                        handleReportVisibilityToggle(key, checked)
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Affected Reports</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Academic Performance",
                    "Attendance Summary",
                    "Behavior Records",
                    "Progress Reports",
                    "Transcripts",
                  ].map((report) => (
                    <Badge key={report} variant="secondary">
                      {report}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Permission Change Audit Trail
              </CardTitle>
              <CardDescription>
                Track all permission changes made in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Permission</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Changed By</TableHead>
                    <TableHead>Previous</TableHead>
                    <TableHead>New</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLog.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            entry.action === "grant"
                              ? "default"
                              : entry.action === "revoke"
                                ? "destructive"
                                : "secondary"
                          }
                          className="capitalize"
                        >
                          {entry.action}
                        </Badge>
                      </TableCell>
                      <TableCell>{entry.permissionName}</TableCell>
                      <TableCell>
                        {entry.targetUserName ? (
                          <span className="text-sm">
                            <span className="font-medium">
                              {entry.targetUserName}
                            </span>
                            <span className="text-muted-foreground">
                              {" "}
                              ({entry.role})
                            </span>
                          </span>
                        ) : (
                          <span className="capitalize">{entry.role}s</span>
                        )}
                      </TableCell>
                      <TableCell>{entry.userName}</TableCell>
                      <TableCell>
                        {entry.oldValue ? (
                          <Badge
                            variant="outline"
                            className={
                              entry.oldValue === "allow"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {entry.oldValue}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            entry.newValue === "allow"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {entry.newValue}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {auditLog.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No permission changes recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
