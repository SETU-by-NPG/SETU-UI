/**
 * SETU Education Management System - Communication & Restrictions Demo
 * 
 * Comprehensive demonstration page showing all communication features
 * and their role-based restrictions in action.
 * 
 * Features Demonstrated:
 * - Feature 15: Announcement System (Role-based creation)
 * - Feature 16: Messaging System (Student/Parent restrictions)
 * - Feature 17: Library System (Parent borrowing blocked)
 * - Feature 18: Ticket System (Parent submission blocked)
 */

import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  Lock,
  Ban,
  Users,
  User,
  MessageSquare,
  BookOpen,
  TicketCheck,
  Megaphone,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronDown,
  Terminal,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AnnouncementSystem, MessagingSystem, LibrarySystem, TicketSystem } from '../components/communication';
import type { Role } from '../types';

// ==================== RESTRICTION DOCUMENTATION ====================

interface RestrictionRule {
  id: string;
  feature: string;
  role: Role;
  restriction: string;
  errorMessage: string;
  consoleLog: string;
  severity: 'critical' | 'warning' | 'info';
}

const RESTRICTION_RULES: RestrictionRule[] = [
  {
    id: 'msg-001',
    feature: 'Messaging',
    role: 'student',
    restriction: 'Can ONLY message allocated teachers',
    errorMessage: 'You can only message your allocated teachers',
    consoleLog: '[MessagingSystem] BLOCKED: You can only message your allocated teachers',
    severity: 'critical',
  },
  {
    id: 'msg-002',
    feature: 'Messaging',
    role: 'student',
    restriction: 'Class-wide messages BLOCKED',
    errorMessage: 'Class-wide messages not allowed for your role',
    consoleLog: '[MessagingSystem] BLOCKED: Class-wide messages not allowed for your role',
    severity: 'critical',
  },
  {
    id: 'msg-003',
    feature: 'Messaging',
    role: 'parent',
    restriction: 'Class-wide messages BLOCKED',
    errorMessage: 'Class-wide messages not allowed for your role',
    consoleLog: '[MessagingSystem] BLOCKED: Class-wide messages not allowed for your role',
    severity: 'critical',
  },
  {
    id: 'lib-001',
    feature: 'Library',
    role: 'parent',
    restriction: 'Borrowing BLOCKED',
    errorMessage: 'Parents cannot borrow books',
    consoleLog: '[LibrarySystem] BLOCKED: Parents cannot borrow books',
    severity: 'critical',
  },
  {
    id: 'tkt-001',
    feature: 'Tickets',
    role: 'parent',
    restriction: 'Ticket submission BLOCKED',
    errorMessage: 'Parents cannot submit tickets',
    consoleLog: '[TicketSystem] BLOCKED: Parents cannot submit tickets',
    severity: 'critical',
  },
  {
    id: 'ann-001',
    feature: 'Announcements',
    role: 'student',
    restriction: 'Cannot create announcements',
    errorMessage: 'Only teachers and admins can create announcements',
    consoleLog: '[AnnouncementSystem] User role student cannot create announcements',
    severity: 'info',
  },
  {
    id: 'ann-002',
    feature: 'Announcements',
    role: 'parent',
    restriction: 'Cannot create announcements',
    errorMessage: 'Only teachers and admins can create announcements',
    consoleLog: '[AnnouncementSystem] User role parent cannot create announcements',
    severity: 'info',
  },
];

// ==================== ROLE CONFIGURATIONS ====================

interface RoleConfig {
  id: Role;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  allocatedTeachers?: string[];
}

const ROLE_CONFIGS: RoleConfig[] = [
  {
    id: 'admin',
    label: 'Administrator',
    description: 'Full access to all features including user management and system configuration',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    id: 'teacher',
    label: 'Teacher',
    description: 'Can create announcements, message students/parents, manage class activities',
    icon: <User className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    id: 'student',
    label: 'Student',
    description: 'Restricted messaging (allocated teachers only), can view announcements',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-green-100 text-green-700 border-green-200',
    allocatedTeachers: ['teacher-001', 'teacher-002', 'teacher-003'],
  },
  {
    id: 'parent',
    label: 'Parent',
    description: 'BLOCKED from library borrowing and ticket submission. Can message teachers only.',
    icon: <ShieldAlert className="w-5 h-5" />,
    color: 'bg-red-100 text-red-700 border-red-200',
  },
];

// ==================== CONSOLE LOG SIMULATOR ====================

const ConsoleLogSimulator: React.FC<{ role: Role }> = ({ role }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const relevantLogs = RESTRICTION_RULES.filter(r => r.role === role);

  return (
    <Card className="bg-gray-900 text-gray-100 border-gray-800">
      <CardHeader 
        className="pb-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono flex items-center gap-2 text-green-400">
            <Terminal className="w-4 h-4" />
            Console Logs - Expected Restrictions for {role}
          </CardTitle>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="font-mono text-xs space-y-1">
            <div className="text-gray-500 border-b border-gray-700 pb-2 mb-2">
              // Open browser console (F12) to see live restriction logs
            </div>
            
            {relevantLogs.length === 0 ? (
              <div className="text-green-400">
                <span className="text-blue-400">[System]</span> No restrictions apply to this role. Full access granted.
              </div>
            ) : (
              <>
                <div className="text-yellow-400">
                  <span className="text-blue-400">[{role}]</span> Active restrictions for this role:
                </div>
                {relevantLogs.map((log, idx) => (
                  <div key={log.id} className={`pl-4 ${
                    log.severity === 'critical' ? 'text-red-400' : 
                    log.severity === 'warning' ? 'text-yellow-400' : 'text-gray-300'
                  }`}>
                    <span className="text-gray-500">[{idx + 1}]</span> {log.consoleLog}
                  </div>
                ))}
                <div className="text-gray-500 border-t border-gray-700 pt-2 mt-2">
                  // These logs will appear when user attempts restricted actions
                </div>
              </>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

// ==================== RESTRICTION MATRIX ====================

const RestrictionMatrix: React.FC = () => {
  const features = ['Announcements', 'Messaging', 'Library', 'Tickets'];
  const roles: Role[] = ['admin', 'teacher', 'student', 'parent'];

  const getAccessLevel = (feature: string, role: Role): { level: 'full' | 'limited' | 'blocked'; note: string } => {
    const rules = RESTRICTION_RULES.filter(r => r.feature === feature && r.role === role);
    
    if (rules.length === 0) return { level: 'full', note: 'Full access' };
    if (rules.some(r => r.severity === 'critical')) return { level: 'blocked', note: rules.find(r => r.severity === 'critical')?.restriction || 'Blocked' };
    return { level: 'limited', note: rules[0].restriction };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Permission Matrix</CardTitle>
        <CardDescription>Access levels by role and feature</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">Feature</th>
                {roles.map(role => (
                  <th key={role} className="text-center py-2 px-3 capitalize">{role}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map(feature => (
                <tr key={feature} className="border-b last:border-0">
                  <td className="py-3 px-3 font-medium">{feature}</td>
                  {roles.map(role => {
                    const access = getAccessLevel(feature, role);
                    return (
                      <td key={role} className="py-3 px-3 text-center">
                        <Badge 
                          variant="outline"
                          className={
                            access.level === 'full' ? 'bg-green-100 text-green-700 border-green-200' :
                            access.level === 'limited' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            'bg-red-100 text-red-700 border-red-200'
                          }
                          title={access.note}
                        >
                          {access.level === 'full' ? <CheckCircle2 className="w-3 h-3 mr-1" /> :
                           access.level === 'limited' ? <AlertCircle className="w-3 h-3 mr-1" /> :
                           <XCircle className="w-3 h-3 mr-1" />}
                          {access.level}
                        </Badge>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// ==================== MAIN DEMO PAGE ====================

export default function CommunicationRestrictionsDemo() {
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [activeTab, setActiveTab] = useState('announcements');

  const currentRoleConfig = ROLE_CONFIGS.find(r => r.id === selectedRole);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Communication & Restrictions Demo
        </h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive demonstration of role-based restrictions across all communication features.
          Open the browser console (F12) to see restriction logs in action.
        </p>
      </div>

      {/* Role Selector */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Select Role to Test
          </CardTitle>
          <CardDescription>
            Switch between roles to see how restrictions apply differently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ROLE_CONFIGS.map(config => (
              <button
                key={config.id}
                onClick={() => setSelectedRole(config.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedRole === config.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className={`inline-flex p-2 rounded-lg mb-2 ${config.color}`}>
                  {config.icon}
                </div>
                <div className="font-medium">{config.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {config.id === 'parent' ? 'Restrictions Apply' : 
                   config.id === 'student' ? 'Limited Access' : 'Full Access'}
                </div>
              </button>
            ))}
          </div>

          {currentRoleConfig && (
            <Alert className={`mt-4 ${
              selectedRole === 'parent' ? 'bg-red-50 border-red-200' :
              selectedRole === 'student' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className={`w-4 h-4 rounded-full mr-2 ${
                selectedRole === 'parent' ? 'bg-red-500' :
                selectedRole === 'student' ? 'bg-yellow-500' :
                'bg-green-500'
              }`} />
              <AlertTitle className={
                selectedRole === 'parent' ? 'text-red-800' :
                selectedRole === 'student' ? 'text-yellow-800' :
                'text-green-800'
              }>
                Current Role: {currentRoleConfig.label}
              </AlertTitle>
              <AlertDescription className={
                selectedRole === 'parent' ? 'text-red-700' :
                selectedRole === 'student' ? 'text-yellow-700' :
                'text-green-700'
              }>
                {currentRoleConfig.description}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Console Log Simulator */}
      <ConsoleLogSimulator role={selectedRole} />

      {/* Permission Matrix */}
      <RestrictionMatrix />

      {/* Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Megaphone className="w-4 h-4" />
            <span className="hidden sm:inline">Announcements</span>
          </TabsTrigger>
          <TabsTrigger value="messaging" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Messaging</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Library</span>
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <TicketCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Tickets</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="announcements">
            <AnnouncementSystem 
              role={selectedRole}
              userId={`user-${selectedRole}-001`}
              userName={`Test ${selectedRole}`}
              classId="class-010"
            />
          </TabsContent>

          <TabsContent value="messaging">
            <MessagingSystem 
              role={selectedRole}
              userId={`user-${selectedRole}-001`}
              userName={`Test ${selectedRole}`}
              allocatedTeacherIds={currentRoleConfig?.allocatedTeachers}
              classId="class-010"
            />
          </TabsContent>

          <TabsContent value="library">
            <LibrarySystem 
              role={selectedRole}
              userId={`user-${selectedRole}-001`}
              userName={`Test ${selectedRole}`}
              studentId={selectedRole === 'student' ? 'student-001' : undefined}
            />
          </TabsContent>

          <TabsContent value="tickets">
            <TicketSystem 
              role={selectedRole}
              userId={`user-${selectedRole}-001`}
              userName={`Test ${selectedRole}`}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Restriction Legend */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Restriction Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                <Ban className="w-3 h-3 mr-1" />
                Blocked
              </Badge>
              <span className="text-muted-foreground">Action completely restricted</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                <AlertCircle className="w-3 h-3 mr-1" />
                Limited
              </Badge>
              <span className="text-muted-foreground">Partial access with restrictions</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Full
              </Badge>
              <span className="text-muted-foreground">Complete access granted</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
