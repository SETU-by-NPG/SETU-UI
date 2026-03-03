# SETU Role System Migration Guide

## Overview

This document describes the migration from the **5-role system** to the **27-role hierarchy** implemented in the SETU Education Management System.

---

## Old → New Role Mapping

| Old Role    | New Role(s)                                                                                                                                                                              | Notes                                       |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `admin`     | `master_admin`, `it_admin`, `it_technician`, `principal`, `finance_manager`, `hr_manager`, `admissions_officer`, `data_manager`, `facilities_manager`                                    | Split into 9 granular administrative roles  |
| `teacher`   | `teacher`, `cover_supervisor`, `teaching_assistant`, `head_of_department`, `head_of_year`, `examinations_officer`, `safeguarding_lead`, `senco`, `attendance_officer`, `careers_advisor` | Split into 10 teaching/welfare roles        |
| `student`   | `student`, `student_leadership`                                                                                                                                                          | `student_leadership` has minor extra access |
| `parent`    | `parent`                                                                                                                                                                                 | Unchanged                                   |
| `librarian` | `librarian`, `science_technician`, `subject_technician`, `support_staff`                                                                                                                 | Split into 4 specialist/support roles       |

---

## Role Categories (8 groups)

| Category               | Roles                                                                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `administrative`       | `master_admin`, `it_admin`, `it_technician`, `principal`, `finance_manager`, `hr_manager`, `admissions_officer`, `data_manager`, `facilities_manager` |
| `academic_leadership`  | `slt_member`, `head_of_department`, `head_of_year`, `examinations_officer`                                                                            |
| `safeguarding_welfare` | `safeguarding_lead`, `senco`, `attendance_officer`, `careers_advisor`                                                                                 |
| `teaching_support`     | `teacher`, `cover_supervisor`, `teaching_assistant`                                                                                                   |
| `technical_specialist` | `librarian`, `science_technician`, `subject_technician`                                                                                               |
| `student`              | `student`, `student_leadership`                                                                                                                       |
| `parent`               | `parent`                                                                                                                                              |
| `support`              | `support_staff`                                                                                                                                       |

---

## SLT (Senior Leadership Team) Permission Layer

The SLT layer is **additive** — it grants extra permissions on top of a user's base role.

### How it works

1. A `SystemUser` with `sltPermissions: { isSLT: true, sltAccessLevel: "full" | "strategic" | "operational" }` gets SLT-gated permissions in addition to their role permissions.
2. Permissions with `requiresSLT: true` in `DEFAULT_PERMISSIONS` are only granted when `isSLT === true`.
3. The `hasSLTAccess()` helper in `PermissionContext` returns `true` when the current user has SLT access.

### Roles that commonly have SLT access

| Role                 | SLT Access Level |
| -------------------- | ---------------- |
| `slt_member`         | `full`           |
| `head_of_department` | `strategic`      |
| `head_of_year`       | `operational`    |
| `principal`          | (varies)         |

**Note:** SLT access is configured per user in `mockData.systemUsers`, not automatically by role.

---

## Student Leadership Subtypes

The `student_leadership` role has a `studentLeadershipType` field:

| Value           | Description       |
| --------------- | ----------------- |
| `head_boy`      | Head Boy          |
| `head_girl`     | Head Girl         |
| `prefect`       | Prefect           |
| `house_captain` | House Captain     |
| `council`       | Student Council   |
| `ambassador`    | School Ambassador |
| `monitor`       | Class Monitor     |

Access to extra features is controlled by the `student_leadership` role and SLT layer, not by the subtype.

---

## Dashboard Routing (27 roles → 5 components)

| Dashboard Component  | Roles Served                                                                                                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AdminDashboard`     | `master_admin`, `it_admin`, `it_technician`, `principal`, `finance_manager`, `hr_manager`, `admissions_officer`, `data_manager`, `facilities_manager`, `slt_member`                      |
| `TeacherDashboard`   | `teacher`, `cover_supervisor`, `teaching_assistant`, `head_of_department`, `head_of_year`, `examinations_officer`, `safeguarding_lead`, `senco`, `attendance_officer`, `careers_advisor` |
| `LibrarianDashboard` | `librarian`, `science_technician`, `subject_technician`, `support_staff`                                                                                                                 |
| `StudentDashboard`   | `student`, `student_leadership`                                                                                                                                                          |
| `ParentDashboard`    | `parent`                                                                                                                                                                                 |

---

## localStorage Keys

Dashboard widget visibility is persisted per role:

```
setu_dashboard_master_admin
setu_dashboard_it_admin
setu_dashboard_teacher
setu_dashboard_student
setu_dashboard_parent
setu_dashboard_librarian
... (one key per role)
```

Auth state:

```
setu_auth  →  { email: string, role: string }
```

**Note:** After migrating, old `setu_dashboard_admin` keys in localStorage are now stale and can be cleared.

---

## Demo Role Emails (Role Switcher)

| Role                   | Demo Email                      |
| ---------------------- | ------------------------------- |
| `master_admin`         | `james.smith@setu.edu`          |
| `it_admin`             | `it.admin@setu.edu`             |
| `it_technician`        | `it.tech@setu.edu`              |
| `principal`            | `principal@setu.edu`            |
| `finance_manager`      | `finance@setu.edu`              |
| `hr_manager`           | `hr@setu.edu`                   |
| `admissions_officer`   | `admissions@setu.edu`           |
| `data_manager`         | `data@setu.edu`                 |
| `facilities_manager`   | `facilities@setu.edu`           |
| `slt_member`           | `slt@setu.edu`                  |
| `head_of_department`   | `sarah.mitchell@setu.edu`       |
| `head_of_year`         | `hoy@setu.edu`                  |
| `examinations_officer` | `exams@setu.edu`                |
| `safeguarding_lead`    | `dsl@setu.edu`                  |
| `senco`                | `senco@setu.edu`                |
| `attendance_officer`   | `attendance@setu.edu`           |
| `careers_advisor`      | `careers@setu.edu`              |
| `teacher`              | `jwilliams@setu.edu`            |
| `cover_supervisor`     | `cover@setu.edu`                |
| `teaching_assistant`   | `ta@setu.edu`                   |
| `librarian`            | `thurston.howell@setu.edu`      |
| `science_technician`   | `sci.tech@setu.edu`             |
| `subject_technician`   | `subj.tech@setu.edu`            |
| `student`              | `peter.santos@student.setu.edu` |
| `student_leadership`   | `student.leader@setu.edu`       |
| `parent`               | `heather.moran@email.com`       |
| `support_staff`        | `reception@setu.edu`            |

---

## Testing Checklist

Use the role switcher (bottom of sidebar) to test each role:

- [ ] `master_admin` — Admin Console, all system widgets visible
- [ ] `it_admin` — Admin Console, IT-relevant widgets
- [ ] `it_technician` — Admin Console dashboard
- [ ] `principal` — Admin Console dashboard
- [ ] `finance_manager` — Admin Console dashboard
- [ ] `hr_manager` — Admin Console dashboard
- [ ] `admissions_officer` — Admin Console dashboard
- [ ] `data_manager` — Admin Console dashboard
- [ ] `facilities_manager` — Admin Console dashboard
- [ ] `slt_member` — Admin Console + SLT badge visible in sidebar
- [ ] `head_of_department` — Teacher dashboard, SLT badge visible
- [ ] `head_of_year` — Teacher dashboard, SLT badge visible
- [ ] `examinations_officer` — Teacher dashboard
- [ ] `safeguarding_lead` — Teacher dashboard
- [ ] `senco` — Teacher dashboard
- [ ] `attendance_officer` — Teacher dashboard
- [ ] `careers_advisor` — Teacher dashboard
- [ ] `teacher` — Teacher dashboard, schedule/assignments visible
- [ ] `cover_supervisor` — Teacher dashboard
- [ ] `teaching_assistant` — Teacher dashboard
- [ ] `librarian` — Librarian dashboard, library stats visible
- [ ] `science_technician` — Librarian dashboard
- [ ] `subject_technician` — Librarian dashboard
- [ ] `support_staff` — Librarian dashboard
- [ ] `student` — Student dashboard, timetable/assignments visible
- [ ] `student_leadership` — Student dashboard
- [ ] `parent` — Parent dashboard, child info visible

### Sidebar Verification

For each role, verify:

- Navigation items match the role (e.g., student cannot see /user-management)
- Role name displayed correctly in top-right chip
- Correct demo username shown in sidebar footer

### Permission Gate Verification

- Student/parent viewing admin-only pages should see restricted content
- SLT-gated permissions should only apply to users with `isSLT: true`

---

## Files Changed in This Migration

| File                                     | Change Type |
| ---------------------------------------- | ----------- |
| `src/app/types/index.ts`                 | Modified    |
| `src/app/data/permissions.ts`            | Rewritten   |
| `src/app/data/mock-data.ts`              | Modified    |
| `src/app/context/permission-context.tsx` | Modified    |
| `src/app/App.tsx`                        | Modified    |
| `src/app/components/app-shell.tsx`       | Rewritten   |
| `src/app/pages/dashboard.tsx`            | Modified    |
| `src/app/utils/data-utils.ts`            | Modified    |
