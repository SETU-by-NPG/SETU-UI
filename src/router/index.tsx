import React, { Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { AppShell } from "@/components/layout/AppShell";

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function ProtectedRoute() {
  const { isAuthenticated, onboardingComplete } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (!onboardingComplete) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

function AuthRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

function AppLayout() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AppShell />
    </Suspense>
  );
}

// Auth pages
const LoginPage = React.lazy(() => import("@/pages/auth/LoginPage"));
const MFAPage = React.lazy(() => import("@/pages/auth/MFAPage"));
const ForgotPasswordPage = React.lazy(
  () => import("@/pages/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = React.lazy(
  () => import("@/pages/auth/ResetPasswordPage"),
);
const MFASetupPage = React.lazy(() => import("@/pages/auth/MFASetupPage"));

// Core pages
const DashboardPage = React.lazy(
  () => import("@/pages/dashboard/DashboardPage"),
);
const OnboardingPage = React.lazy(
  () => import("@/pages/onboarding/OnboardingPage"),
);
const ProfilePage = React.lazy(() => import("@/pages/profile/ProfilePage"));
const NotificationsPage = React.lazy(
  () => import("@/pages/notifications/NotificationsPage"),
);
const SettingsPage = React.lazy(() => import("@/pages/settings/SettingsPage"));

// Students
const StudentsPage = React.lazy(() => import("@/pages/students/StudentsPage"));
const StudentProfilePage = React.lazy(
  () => import("@/pages/students/StudentProfilePage"),
);
const StudentEditPage = React.lazy(
  () => import("@/pages/students/StudentEditPage"),
);

// Staff
const StaffPage = React.lazy(() => import("@/pages/staff/StaffPage"));
const StaffProfilePage = React.lazy(
  () => import("@/pages/staff/StaffProfilePage"),
);

// Teaching & Learning
const TimetablePage = React.lazy(
  () => import("@/pages/timetable/TimetablePage"),
);
const AttendancePage = React.lazy(
  () => import("@/pages/attendance/AttendancePage"),
);
const GradesPage = React.lazy(() => import("@/pages/grades/GradesPage"));
const AssignmentsPage = React.lazy(
  () => import("@/pages/assignments/AssignmentsPage"),
);
const CoverPage = React.lazy(() => import("@/pages/cover/CoverPage"));
const LabPage = React.lazy(() => import("@/pages/lab/LabPage"));
const LibraryPage = React.lazy(() => import("@/pages/library/LibraryPage"));
const ExaminationsPage = React.lazy(
  () => import("@/pages/examinations/ExaminationsPage"),
);

// Communication
const MessagesPage = React.lazy(() => import("@/pages/messages/MessagesPage"));
const AnnouncementsPage = React.lazy(
  () => import("@/pages/announcements/AnnouncementsPage"),
);

// Pastoral
const IncidentsPage = React.lazy(
  () => import("@/pages/incidents/IncidentsPage"),
);
const SafeguardingPage = React.lazy(
  () => import("@/pages/safeguarding/SafeguardingPage"),
);
const SENPage = React.lazy(() => import("@/pages/sen/SENPage"));

// Operations
const AdmissionsPage = React.lazy(
  () => import("@/pages/admissions/AdmissionsPage"),
);
const FinancePage = React.lazy(() => import("@/pages/finance/FinancePage"));
const HRPage = React.lazy(() => import("@/pages/hr/HRPage"));
const FacilitiesPage = React.lazy(
  () => import("@/pages/facilities/FacilitiesPage"),
);
const CareersPage = React.lazy(() => import("@/pages/careers/CareersPage"));

// Leadership & Admin
const LeadershipPage = React.lazy(
  () => import("@/pages/leadership/LeadershipPage"),
);
const ReportsPage = React.lazy(() => import("@/pages/reports/ReportsPage"));
const ITAdminPage = React.lazy(() => import("@/pages/it-admin/ITAdminPage"));
const AuditLogsPage = React.lazy(
  () => import("@/pages/it-admin/AuditLogsPage"),
);
const UserManagementPage = React.lazy(
  () => import("@/pages/it-admin/UserManagementPage"),
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/auth",
    element: <AuthRoute />,
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "mfa",
        element: (
          <Suspense fallback={<PageLoader />}>
            <MFAPage />
          </Suspense>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ForgotPasswordPage />
          </Suspense>
        ),
      },
      {
        path: "reset-password",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResetPasswordPage />
          </Suspense>
        ),
      },
      {
        path: "mfa-setup",
        element: (
          <Suspense fallback={<PageLoader />}>
            <MFASetupPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/onboarding",
    element: (
      <Suspense fallback={<PageLoader />}>
        <OnboardingPage />
      </Suspense>
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
            element: (
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: "/profile",
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfilePage />
              </Suspense>
            ),
          },
          {
            path: "/notifications",
            element: (
              <Suspense fallback={<PageLoader />}>
                <NotificationsPage />
              </Suspense>
            ),
          },
          {
            path: "/settings",
            element: (
              <Suspense fallback={<PageLoader />}>
                <SettingsPage />
              </Suspense>
            ),
          },
          // Students
          {
            path: "/students",
            element: (
              <Suspense fallback={<PageLoader />}>
                <StudentsPage />
              </Suspense>
            ),
          },
          {
            path: "/students/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <StudentProfilePage />
              </Suspense>
            ),
          },
          {
            path: "/students/:id/edit",
            element: (
              <Suspense fallback={<PageLoader />}>
                <StudentEditPage />
              </Suspense>
            ),
          },
          // Staff
          {
            path: "/staff",
            element: (
              <Suspense fallback={<PageLoader />}>
                <StaffPage />
              </Suspense>
            ),
          },
          {
            path: "/staff/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <StaffProfilePage />
              </Suspense>
            ),
          },
          // Teaching & Learning
          {
            path: "/timetable",
            element: (
              <Suspense fallback={<PageLoader />}>
                <TimetablePage />
              </Suspense>
            ),
          },
          {
            path: "/attendance",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AttendancePage />
              </Suspense>
            ),
          },
          {
            path: "/grades",
            element: (
              <Suspense fallback={<PageLoader />}>
                <GradesPage />
              </Suspense>
            ),
          },
          {
            path: "/assignments",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AssignmentsPage />
              </Suspense>
            ),
          },
          {
            path: "/cover",
            element: (
              <Suspense fallback={<PageLoader />}>
                <CoverPage />
              </Suspense>
            ),
          },
          {
            path: "/lab",
            element: (
              <Suspense fallback={<PageLoader />}>
                <LabPage />
              </Suspense>
            ),
          },
          {
            path: "/library",
            element: (
              <Suspense fallback={<PageLoader />}>
                <LibraryPage />
              </Suspense>
            ),
          },
          {
            path: "/examinations",
            element: (
              <Suspense fallback={<PageLoader />}>
                <ExaminationsPage />
              </Suspense>
            ),
          },
          // Communication
          {
            path: "/messages",
            element: (
              <Suspense fallback={<PageLoader />}>
                <MessagesPage />
              </Suspense>
            ),
          },
          {
            path: "/announcements",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AnnouncementsPage />
              </Suspense>
            ),
          },
          // Pastoral
          {
            path: "/incidents",
            element: (
              <Suspense fallback={<PageLoader />}>
                <IncidentsPage />
              </Suspense>
            ),
          },
          {
            path: "/safeguarding",
            element: (
              <Suspense fallback={<PageLoader />}>
                <SafeguardingPage />
              </Suspense>
            ),
          },
          {
            path: "/sen",
            element: (
              <Suspense fallback={<PageLoader />}>
                <SENPage />
              </Suspense>
            ),
          },
          // Operations
          {
            path: "/admissions",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdmissionsPage />
              </Suspense>
            ),
          },
          {
            path: "/finance",
            element: (
              <Suspense fallback={<PageLoader />}>
                <FinancePage />
              </Suspense>
            ),
          },
          {
            path: "/hr",
            element: (
              <Suspense fallback={<PageLoader />}>
                <HRPage />
              </Suspense>
            ),
          },
          {
            path: "/facilities",
            element: (
              <Suspense fallback={<PageLoader />}>
                <FacilitiesPage />
              </Suspense>
            ),
          },
          {
            path: "/careers",
            element: (
              <Suspense fallback={<PageLoader />}>
                <CareersPage />
              </Suspense>
            ),
          },
          // Leadership & Admin
          {
            path: "/leadership",
            element: (
              <Suspense fallback={<PageLoader />}>
                <LeadershipPage />
              </Suspense>
            ),
          },
          {
            path: "/reports",
            element: (
              <Suspense fallback={<PageLoader />}>
                <ReportsPage />
              </Suspense>
            ),
          },
          {
            path: "/it-admin",
            element: (
              <Suspense fallback={<PageLoader />}>
                <ITAdminPage />
              </Suspense>
            ),
          },
          {
            path: "/it-admin/audit",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AuditLogsPage />
              </Suspense>
            ),
          },
          {
            path: "/it-admin/users",
            element: (
              <Suspense fallback={<PageLoader />}>
                <UserManagementPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);
