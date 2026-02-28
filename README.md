# SETU  School & Education Management System

> A comprehensive, multi-role SaaS Education Management Platform  UI prototype built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

---

## Overview

SETU is a unified education management platform designed to consolidate school operations into a single, role-based system. This repository contains the **UI prototype / design system**  a fully functional frontend demonstrating all screens, flows, and interactions defined in the PRD.

The platform serves five distinct user roles, each with tailored navigation, dashboards, and feature access:

| Role | Description |
|------|-------------|
| **IT Administrator** | Tenant-level SaaS admin  manages users, roles, permissions, rooms, equipment, tickets, audit logs, and system settings |
| **Teacher** | Marks attendance, grades assignments, manages timetables, raises support tickets, books IT equipment |
| **Student** | Views timetable, submits assignments, checks grades, accesses library |
| **Parent/Guardian** | Monitors child progress, attendance, grades, communicates with teachers |
| **Librarian** | Manages book catalog, borrowing/returns, overdue tracking |

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Component library (Radix UI primitives) |
| Recharts | Charts & analytics visualisations |
| React Router v6 | Client-side routing |
| Lucide React | Icon library |
| localStorage | Auth state & dashboard preferences persistence |

---

## Project Structure

```
src/
  app/
    components/         # Shared UI components
      figma/            # Figma-generated components
      ui/               # shadcn/ui components
      app-shell.tsx     # Main layout shell (sidebar + topbar)
      data-table.tsx    # Reusable data table
      empty-state.tsx   # Empty state component
      stat-card.tsx     # Metric card component
      status-badge.tsx  # Status/severity badge
    data/
      mock-data.ts      # All mock data for the prototype
    pages/              # Route-level page components
      dashboard.tsx
      students.tsx
      teachers.tsx
      attendance.tsx
      assignments.tsx
      gradebook.tsx
      timetable.tsx
      library.tsx
      reports.tsx
      announcements.tsx
      messages.tsx
      settings.tsx
      user-management.tsx
      roles-permissions.tsx
      audit-logs.tsx
      room-management.tsx
      equipment.tsx
      tickets.tsx
    App.tsx
    routes.ts
  styles/               # Global CSS
  main.tsx              # Entry point
guidelines/             # Design guidelines & PRD reference
```

---

## Features Implemented

### Phase 1  Core EMS
- [x] Multi-role authentication (Login page with SSO options, demo accounts)
- [x] Role-based sidebar navigation & routing
- [x] Customisable dashboard (per-user widget preferences via localStorage)
- [x] Student management (profiles, search, filtering, enrollment)
- [x] Teacher & staff management
- [x] Attendance marking (daily/period, bulk entry, status badges)
- [x] Assignments & online submission
- [x] Gradebook with GPA calculation
- [x] Timetable / scheduling
- [x] Library management (catalog, borrowing, overdue, fines)
- [x] Reports & analytics (charts, report card download)
- [x] Announcements (school-wide & targeted)
- [x] Messaging / chat interface
- [x] Incident & behaviour tracking

### IT Admin Dashboard (SaaS Tenant Console)
- [x] Subscription & resource quota overview (Azure-style tenant panel)
- [x] Platform service health monitoring
- [x] Unified user management (all roles, 2FA status, suspend/reset)
- [x] Roles & permissions matrix (19 modules, inline editing, create custom role)
- [x] Audit logs (filterable, severity badges, IP tracking, export)
- [x] Room management (create rooms, capacity, equipment tags, building filter)
- [x] IT Equipment booking (inventory + booking approval flow)
- [x] Support ticketing (create, assign, resolve, priority levels)
- [x] Messages / chat
- [x] Student profile management
- [x] Teacher profile management
- [x] Azure-style full-width System Settings (8 tabs: Overview, School Profile, Academic Year, Modules, Security, Integrations, Data & Backups, Notifications)

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repository
git clone <repo-path>
cd Setu-UI-Design

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Demo Accounts

Use the quick-fill panel on the login page:

| Role | Email | Password |
|------|-------|----------|
| IT Admin | admin@setu.school | admin123 |
| Teacher | teacher@setu.school | teacher123 |
| Student | student@setu.school | student123 |
| Parent | parent@setu.school | parent123 |
| Librarian | librarian@setu.school | lib123 |

---

## Branch Strategy

This repository uses a **feature-branch workflow**:

| Branch | Description |
|--------|-------------|
| `main` | Latest stable state  always reflects the current production-ready prototype |
| `feature/initial-ems-setup` | Initial EMS scaffold  React/Vite/Tailwind setup + 11 core screens |
| `feature/admin-it-redesign` | IT Admin role redesigned as SaaS tenant admin (system health, user mgmt, roles, audit logs) |
| `feature/auth-flow` | Login/authentication flow with SSO options and role-based demo accounts |
| `feature/library-management` | Library module  catalog, borrowing, overdue, fines |
| `feature/remove-fees-transport` | Removed Fee Management and Bus/Transport modules |
| `feature/saas-tenant-admin-dashboard` | Admin dashboard redesigned as Azure-style SaaS tenant console |
| `feature/customisable-dashboard` | Widget-toggle customisable dashboard with localStorage persistence |
| `feature/rooms-equipment-tickets` | Room Management, IT Equipment Booking, Support Ticketing pages |
| `feature/librarian-role` | New Librarian role with dedicated navigation and library access |
| `feature/create-role-form` | Create Custom Role modal with permissions matrix |
| `feature/azure-style-settings` | Full-width Azure-style System Settings redesign (8 tabs) |

---

## Roadmap (Next Steps)

- [ ] Connect Supabase for real data persistence & user auth
- [ ] CSV bulk import for students, teachers, library books
- [ ] Payment gateway integration (Stripe) for fee invoicing
- [ ] Email/SMS notification triggers (SendGrid, Twilio)
- [ ] Room-to-timetable assignment flow
- [ ] Offline mode (PWA)
- [ ] Mobile app (React Native)
- [ ] HR Management module (Phase 3)
- [ ] Multi-language support

---

## Contributing

1. Always branch off `main`
2. Use descriptive branch names: `feature/`, `fix/`, `chore/`, `refactor/`
3. Commit messages follow: `type: short description` (e.g. `feat: add room management page`)
4. Never delete branches  keep full history
5. Merge back to `main` when stable

---

## Licence

Proprietary  NPATEL GROUP LTD. All rights reserved.
