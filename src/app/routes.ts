import { createBrowserRouter } from "react-router";
import { AppShell } from "./components/app-shell";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import UserManagementPage from "./pages/user-management";
import RolesPermissionsPage from "./pages/roles-permissions";
import StudentsPage from "./pages/students";
import TeachersPage from "./pages/teachers";
import AttendancePage from "./pages/attendance";
import AssignmentsPage from "./pages/assignments";
import GradebookPage from "./pages/gradebook";
import TimetablePage from "./pages/timetable";
import ReportsPage from "./pages/reports";
import AnnouncementsPage from "./pages/announcements";
import MessagesPage from "./pages/messages";
import AuditLogsPage from "./pages/audit-logs";
import SettingsPage from "./pages/settings";
import LibraryPage from "./pages/library";
import RoomsPage from "./pages/rooms";
import EquipmentPage from "./pages/equipment";
import TicketsPage from "./pages/tickets";
import NotFoundPage from "./pages/not-found";
import SetupPage from "./pages/setup";
import AcademicPage from "./pages/academic";
import ClassesPage from "./pages/classes";
import SubjectsPage from "./pages/subjects";
import TimetableBuilderPage from "./pages/timetable-builder";
import StudentDetailPage from "./pages/student-detail";
import TeacherDetailPage from "./pages/teacher-detail";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: AppShell,
    children: [
      { index: true, Component: DashboardPage },
      { path: "user-management", Component: UserManagementPage },
      { path: "roles-permissions", Component: RolesPermissionsPage },
      { path: "students", Component: StudentsPage },
      { path: "students/:id", Component: StudentDetailPage },
      { path: "teachers", Component: TeachersPage },
      { path: "teachers/:id", Component: TeacherDetailPage },
      { path: "attendance", Component: AttendancePage },
      { path: "assignments", Component: AssignmentsPage },
      { path: "gradebook", Component: GradebookPage },
      { path: "timetable", Component: TimetablePage },
      { path: "reports", Component: ReportsPage },
      { path: "announcements", Component: AnnouncementsPage },
      { path: "messages", Component: MessagesPage },
      { path: "audit-logs", Component: AuditLogsPage },
      { path: "settings", Component: SettingsPage },
      { path: "library", Component: LibraryPage },
      { path: "rooms", Component: RoomsPage },
      { path: "equipment", Component: EquipmentPage },
      { path: "tickets", Component: TicketsPage },
      { path: "setup", Component: SetupPage },
      { path: "academic", Component: AcademicPage },
      { path: "classes", Component: ClassesPage },
      { path: "subjects", Component: SubjectsPage },
      { path: "timetable-builder", Component: TimetableBuilderPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
