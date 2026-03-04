import type { User } from '@/types'

export const users: User[] = [
  // System Admin
  { id: 'usr_001', organisationId: 'org_001', email: 'admin@hartfield.ac.uk', firstName: 'System', lastName: 'Admin', role: 'MASTER_ADMIN', additionalRoles: [], status: 'ACTIVE', emailVerified: true, mfaEnabled: true, lastLoginAt: '2026-03-04T08:00:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-04T08:00:00Z' },
  // IT Administrator
  { id: 'usr_002', organisationId: 'org_001', email: 'j.okafor@hartfield.ac.uk', firstName: 'James', lastName: 'Okafor', role: 'IT_ADMINISTRATOR', status: 'ACTIVE', emailVerified: true, mfaEnabled: true, lastLoginAt: '2026-03-04T07:45:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-04T07:45:00Z' },
  // IT Technician
  { id: 'usr_003', organisationId: 'org_001', email: 'it.tech@hartfield.ac.uk', firstName: 'Daniel', lastName: 'Park', role: 'IT_TECHNICIAN', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T16:00:00Z', createdAt: '2022-01-01T00:00:00Z', updatedAt: '2026-03-03T16:00:00Z' },
  // Head of School
  { id: 'usr_004', organisationId: 'org_001', email: 's.whitfield@hartfield.ac.uk', firstName: 'Sarah', lastName: 'Whitfield', role: 'HEAD_OF_SCHOOL', status: 'ACTIVE', emailVerified: true, mfaEnabled: true, lastLoginAt: '2026-03-04T08:30:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-04T08:30:00Z' },
  // Finance Manager
  { id: 'usr_005', organisationId: 'org_001', email: 'p.singh@hartfield.ac.uk', firstName: 'Priya', lastName: 'Singh', role: 'FINANCE_MANAGER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T09:00:00Z', createdAt: '2021-01-01T00:00:00Z', updatedAt: '2026-03-04T09:00:00Z' },
  // HR Manager
  { id: 'usr_006', organisationId: 'org_001', email: 'c.lawson@hartfield.ac.uk', firstName: 'Carol', lastName: 'Lawson', role: 'HR_MANAGER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T14:00:00Z', createdAt: '2021-01-01T00:00:00Z', updatedAt: '2026-03-03T14:00:00Z' },
  // Admissions Officer
  { id: 'usr_007', organisationId: 'org_001', email: 'e.garcia@hartfield.ac.uk', firstName: 'Elena', lastName: 'Garcia', role: 'ADMISSIONS_OFFICER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T09:15:00Z', createdAt: '2022-04-01T00:00:00Z', updatedAt: '2026-03-04T09:15:00Z' },
  // Data Manager
  { id: 'usr_008', organisationId: 'org_001', email: 'data.mgr@hartfield.ac.uk', firstName: 'Tom', lastName: 'Bradley', role: 'DATA_MANAGER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T11:00:00Z', createdAt: '2022-09-01T00:00:00Z', updatedAt: '2026-03-03T11:00:00Z' },
  // Facilities Manager
  { id: 'usr_009', organisationId: 'org_001', email: 'k.kowalski@hartfield.ac.uk', firstName: 'Krzysztof', lastName: 'Kowalski', role: 'FACILITIES_MANAGER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T07:30:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-04T07:30:00Z' },
  // SLT Member
  { id: 'usr_010', organisationId: 'org_001', email: 'r.ahmed@hartfield.ac.uk', firstName: 'Rahul', lastName: 'Ahmed', role: 'SLT_MEMBER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:45:00Z', createdAt: '2021-09-01T00:00:00Z', updatedAt: '2026-03-04T08:45:00Z' },
  // Head of Department - English
  { id: 'usr_031', organisationId: 'org_001', email: 'l.fletcher@hartfield.ac.uk', firstName: 'Laura', lastName: 'Fletcher', role: 'HEAD_OF_DEPARTMENT', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:20:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-04T08:20:00Z' },
  // Head of Department - Maths
  { id: 'usr_032', organisationId: 'org_001', email: 'n.patel@hartfield.ac.uk', firstName: 'Nitin', lastName: 'Patel', role: 'HEAD_OF_DEPARTMENT', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:10:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-04T08:10:00Z' },
  // Head of Department - Science
  { id: 'usr_033', organisationId: 'org_001', email: 'a.morrison@hartfield.ac.uk', firstName: 'Alan', lastName: 'Morrison', role: 'HEAD_OF_DEPARTMENT', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:00:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-04T08:00:00Z' },
  // Head of Department - Humanities
  { id: 'usr_034', organisationId: 'org_001', email: 'b.campbell@hartfield.ac.uk', firstName: 'Barbara', lastName: 'Campbell', role: 'HEAD_OF_DEPARTMENT', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T17:00:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-03T17:00:00Z' },
  // HOD MFL (placeholder)
  { id: 'usr_035', organisationId: 'org_001', email: 'c.dubois@hartfield.ac.uk', firstName: 'Claire', lastName: 'Dubois', role: 'HEAD_OF_DEPARTMENT', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T16:30:00Z', createdAt: '2021-09-01T00:00:00Z', updatedAt: '2026-03-03T16:30:00Z' },
  // HOD Computing
  { id: 'usr_036', organisationId: 'org_001', email: 'm.hassan@hartfield.ac.uk', firstName: 'Mustafa', lastName: 'Hassan', role: 'HEAD_OF_DEPARTMENT', additionalRoles: ['TEACHER', 'EXAMINATIONS_OFFICER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T07:50:00Z', createdAt: '2021-01-01T00:00:00Z', updatedAt: '2026-03-04T07:50:00Z' },
  // HOD Arts
  { id: 'usr_037', organisationId: 'org_001', email: 'j.turner@hartfield.ac.uk', firstName: 'Jessica', lastName: 'Turner', role: 'HEAD_OF_DEPARTMENT', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T15:00:00Z', createdAt: '2021-09-01T00:00:00Z', updatedAt: '2026-03-03T15:00:00Z' },
  // HOD PE
  { id: 'usr_038', organisationId: 'org_001', email: 's.cooper@hartfield.ac.uk', firstName: 'Steve', lastName: 'Cooper', role: 'HEAD_OF_DEPARTMENT', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T14:30:00Z', createdAt: '2021-09-01T00:00:00Z', updatedAt: '2026-03-03T14:30:00Z' },
  // HOD RE
  { id: 'usr_039', organisationId: 'org_001', email: 'f.ibrahim@hartfield.ac.uk', firstName: 'Fatima', lastName: 'Ibrahim', role: 'HEAD_OF_DEPARTMENT', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:05:00Z', createdAt: '2022-09-01T00:00:00Z', updatedAt: '2026-03-04T08:05:00Z' },
  // HOD Business
  { id: 'usr_040', organisationId: 'org_001', email: 'p.watson@hartfield.ac.uk', firstName: 'Philip', lastName: 'Watson', role: 'HEAD_OF_DEPARTMENT', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T17:30:00Z', createdAt: '2022-09-01T00:00:00Z', updatedAt: '2026-03-03T17:30:00Z' },
  // Head of Year 7 - Miss Patel
  { id: 'usr_022', organisationId: 'org_001', email: 'a.patel@hartfield.ac.uk', firstName: 'Anita', lastName: 'Patel', role: 'HEAD_OF_YEAR', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:15:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-04T08:15:00Z' },
  // Head of Year 8 - Mr Thompson
  { id: 'usr_023', organisationId: 'org_001', email: 'r.thompson@hartfield.ac.uk', firstName: 'Richard', lastName: 'Thompson', role: 'HEAD_OF_YEAR', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:25:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-04T08:25:00Z' },
  // Head of Year 9 placeholder
  { id: 'usr_024', organisationId: 'org_001', email: 'g.wright@hartfield.ac.uk', firstName: 'Grace', lastName: 'Wright', role: 'HEAD_OF_YEAR', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T16:00:00Z', createdAt: '2021-09-01T00:00:00Z', updatedAt: '2026-03-03T16:00:00Z' },
  // HOY 10
  { id: 'usr_025', organisationId: 'org_001', email: 'm.jenkins@hartfield.ac.uk', firstName: 'Martin', lastName: 'Jenkins', role: 'HEAD_OF_YEAR', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T15:30:00Z', createdAt: '2021-09-01T00:00:00Z', updatedAt: '2026-03-03T15:30:00Z' },
  // HOY 11
  { id: 'usr_026', organisationId: 'org_001', email: 'v.shah@hartfield.ac.uk', firstName: 'Vivek', lastName: 'Shah', role: 'HEAD_OF_YEAR', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T14:00:00Z', createdAt: '2021-09-01T00:00:00Z', updatedAt: '2026-03-03T14:00:00Z' },
  // HOY 12
  { id: 'usr_027', organisationId: 'org_001', email: 'k.obrien@hartfield.ac.uk', firstName: 'Katie', lastName: "O'Brien", role: 'HEAD_OF_YEAR', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T12:00:00Z', createdAt: '2022-09-01T00:00:00Z', updatedAt: '2026-03-03T12:00:00Z' },
  // HOY 13
  { id: 'usr_028', organisationId: 'org_001', email: 'd.morgan@hartfield.ac.uk', firstName: 'Derek', lastName: 'Morgan', role: 'HEAD_OF_YEAR', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T10:00:00Z', createdAt: '2022-09-01T00:00:00Z', updatedAt: '2026-03-03T10:00:00Z' },
  // Examinations Officer
  { id: 'usr_011', organisationId: 'org_001', email: 'm.hassan.exams@hartfield.ac.uk', firstName: 'Mohammed', lastName: 'Hassan', role: 'EXAMINATIONS_OFFICER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T09:00:00Z', createdAt: '2021-01-01T00:00:00Z', updatedAt: '2026-03-04T09:00:00Z' },
  // Safeguarding Lead - Mr Davies
  { id: 'usr_012', organisationId: 'org_001', email: 'g.davies@hartfield.ac.uk', firstName: 'Gareth', lastName: 'Davies', role: 'SAFEGUARDING_LEAD', additionalRoles: ['TEACHER'], status: 'ACTIVE', emailVerified: true, mfaEnabled: true, lastLoginAt: '2026-03-04T08:00:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-04T08:00:00Z' },
  // SENCO - Mrs Chen
  { id: 'usr_013', organisationId: 'org_001', email: 'l.chen@hartfield.ac.uk', firstName: 'Linda', lastName: 'Chen', role: 'SENCO', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T09:10:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-04T09:10:00Z' },
  // Attendance Officer - Miss Roberts
  { id: 'usr_014', organisationId: 'org_001', email: 's.roberts@hartfield.ac.uk', firstName: 'Sophie', lastName: 'Roberts', role: 'ATTENDANCE_WELFARE_OFFICER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:55:00Z', createdAt: '2021-01-01T00:00:00Z', updatedAt: '2026-03-04T08:55:00Z' },
  // Careers Advisor - Mrs Bloom
  { id: 'usr_015', organisationId: 'org_001', email: 'r.bloom@hartfield.ac.uk', firstName: 'Rachel', lastName: 'Bloom', role: 'CAREERS_ADVISOR', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T13:00:00Z', createdAt: '2021-09-01T00:00:00Z', updatedAt: '2026-03-03T13:00:00Z' },
  // Librarian - Mrs Okonkwo
  { id: 'usr_016', organisationId: 'org_001', email: 'n.okonkwo@hartfield.ac.uk', firstName: 'Ngozi', lastName: 'Okonkwo', role: 'LIBRARIAN', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:40:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-04T08:40:00Z' },
  // Science Technician
  { id: 'usr_017', organisationId: 'org_001', email: 'sci.tech@hartfield.ac.uk', firstName: 'Kevin', lastName: 'Barnes', role: 'SCIENCE_TECHNICIAN', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T07:30:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-04T07:30:00Z' },
  // Subject Technician
  { id: 'usr_018', organisationId: 'org_001', email: 'sub.tech@hartfield.ac.uk', firstName: 'Mia', lastName: 'Coleman', role: 'SUBJECT_TECHNICIAN', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T15:00:00Z', createdAt: '2021-09-01T00:00:00Z', updatedAt: '2026-03-03T15:00:00Z' },
  // Teachers (Class tutors + subject teachers)
  { id: 'usr_041', organisationId: 'org_001', email: 't.james@hartfield.ac.uk', firstName: 'Thomas', lastName: 'James', role: 'TEACHER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:35:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-04T08:35:00Z' },
  { id: 'usr_042', organisationId: 'org_001', email: 'h.wilson@hartfield.ac.uk', firstName: 'Hannah', lastName: 'Wilson', role: 'TEACHER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:18:00Z', createdAt: '2021-09-01T00:00:00Z', updatedAt: '2026-03-04T08:18:00Z' },
  { id: 'usr_043', organisationId: 'org_001', email: 'j.nguyen@hartfield.ac.uk', firstName: 'Jason', lastName: 'Nguyen', role: 'TEACHER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:22:00Z', createdAt: '2021-09-01T00:00:00Z', updatedAt: '2026-03-04T08:22:00Z' },
  { id: 'usr_044', organisationId: 'org_001', email: 'z.ali@hartfield.ac.uk', firstName: 'Zara', lastName: 'Ali', role: 'TEACHER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:40:00Z', createdAt: '2022-01-01T00:00:00Z', updatedAt: '2026-03-04T08:40:00Z' },
  { id: 'usr_045', organisationId: 'org_001', email: 'c.reid@hartfield.ac.uk', firstName: 'Connor', lastName: 'Reid', role: 'TEACHER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:12:00Z', createdAt: '2022-09-01T00:00:00Z', updatedAt: '2026-03-04T08:12:00Z' },
  { id: 'usr_046', organisationId: 'org_001', email: 'p.kowalczyk@hartfield.ac.uk', firstName: 'Patricia', lastName: 'Kowalczyk', role: 'TEACHER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:30:00Z', createdAt: '2022-09-01T00:00:00Z', updatedAt: '2026-03-04T08:30:00Z' },
  { id: 'usr_047', organisationId: 'org_001', email: 'b.osei@hartfield.ac.uk', firstName: 'Benjamin', lastName: 'Osei', role: 'TEACHER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:10:00Z', createdAt: '2022-09-01T00:00:00Z', updatedAt: '2026-03-04T08:10:00Z' },
  { id: 'usr_048', organisationId: 'org_001', email: 'i.petrov@hartfield.ac.uk', firstName: 'Ivan', lastName: 'Petrov', role: 'TEACHER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T17:40:00Z', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2026-03-03T17:40:00Z' },
  { id: 'usr_049', organisationId: 'org_001', email: 'o.smith@hartfield.ac.uk', firstName: 'Olivia', lastName: 'Smith', role: 'TEACHER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:05:00Z', createdAt: '2023-09-01T00:00:00Z', updatedAt: '2026-03-04T08:05:00Z' },
  { id: 'usr_050', organisationId: 'org_001', email: 'w.brown@hartfield.ac.uk', firstName: 'William', lastName: 'Brown', role: 'TEACHER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T16:50:00Z', createdAt: '2023-09-01T00:00:00Z', updatedAt: '2026-03-03T16:50:00Z' },
  { id: 'usr_051', organisationId: 'org_001', email: 'e.taylor@hartfield.ac.uk', firstName: 'Eleanor', lastName: 'Taylor', role: 'TEACHER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:45:00Z', createdAt: '2023-09-01T00:00:00Z', updatedAt: '2026-03-04T08:45:00Z' },
  { id: 'usr_052', organisationId: 'org_001', email: 'f.martins@hartfield.ac.uk', firstName: 'Felix', lastName: 'Martins', role: 'TEACHER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T16:00:00Z', createdAt: '2023-09-01T00:00:00Z', updatedAt: '2026-03-03T16:00:00Z' },
  { id: 'usr_053', organisationId: 'org_001', email: 'r.nair@hartfield.ac.uk', firstName: 'Rashmi', lastName: 'Nair', role: 'TEACHER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T15:30:00Z', createdAt: '2023-09-01T00:00:00Z', updatedAt: '2026-03-03T15:30:00Z' },
  { id: 'usr_054', organisationId: 'org_001', email: 'h.green@hartfield.ac.uk', firstName: 'Helen', lastName: 'Green', role: 'TEACHER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T14:00:00Z', createdAt: '2023-09-01T00:00:00Z', updatedAt: '2026-03-03T14:00:00Z' },
  { id: 'usr_055', organisationId: 'org_001', email: 'p.adams@hartfield.ac.uk', firstName: 'Paul', lastName: 'Adams', role: 'TEACHER', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T13:00:00Z', createdAt: '2023-09-01T00:00:00Z', updatedAt: '2026-03-03T13:00:00Z' },
  // Cover Supervisors
  { id: 'usr_056', organisationId: 'org_001', email: 'cover1@hartfield.ac.uk', firstName: 'Andy', lastName: 'Walsh', role: 'COVER_SUPERVISOR', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T09:00:00Z', createdAt: '2022-09-01T00:00:00Z', updatedAt: '2026-03-04T09:00:00Z' },
  { id: 'usr_057', organisationId: 'org_001', email: 'cover2@hartfield.ac.uk', firstName: 'Diana', lastName: 'Fox', role: 'COVER_SUPERVISOR', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T16:00:00Z', createdAt: '2022-09-01T00:00:00Z', updatedAt: '2026-03-03T16:00:00Z' },
  // Teaching Assistants
  { id: 'usr_058', organisationId: 'org_001', email: 'ta1@hartfield.ac.uk', firstName: 'Michelle', lastName: 'Evans', role: 'TEACHING_ASSISTANT', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:50:00Z', createdAt: '2021-09-01T00:00:00Z', updatedAt: '2026-03-04T08:50:00Z' },
  { id: 'usr_059', organisationId: 'org_001', email: 'ta2@hartfield.ac.uk', firstName: 'John', lastName: 'Parker', role: 'TEACHING_ASSISTANT', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:45:00Z', createdAt: '2021-09-01T00:00:00Z', updatedAt: '2026-03-04T08:45:00Z' },
  { id: 'usr_060', organisationId: 'org_001', email: 'ta3@hartfield.ac.uk', firstName: 'Ayesha', lastName: 'Khan', role: 'TEACHING_ASSISTANT', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:40:00Z', createdAt: '2022-01-01T00:00:00Z', updatedAt: '2026-03-04T08:40:00Z' },
  { id: 'usr_061', organisationId: 'org_001', email: 'ta4@hartfield.ac.uk', firstName: 'Chris', lastName: 'Diaz', role: 'TEACHING_ASSISTANT', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-03T16:30:00Z', createdAt: '2022-01-01T00:00:00Z', updatedAt: '2026-03-03T16:30:00Z' },
  // Support Staff
  { id: 'usr_062', organisationId: 'org_001', email: 'reception@hartfield.ac.uk', firstName: 'Janet', lastName: 'Hill', role: 'SUPPORT_STAFF', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:00:00Z', createdAt: '2020-09-01T00:00:00Z', updatedAt: '2026-03-04T08:00:00Z' },
  { id: 'usr_063', organisationId: 'org_001', email: 'reception2@hartfield.ac.uk', firstName: 'Mark', lastName: 'Stone', role: 'SUPPORT_STAFF', status: 'ACTIVE', emailVerified: true, mfaEnabled: false, lastLoginAt: '2026-03-04T08:05:00Z', createdAt: '2021-01-01T00:00:00Z', updatedAt: '2026-03-04T08:05:00Z' },
]

// Demo login credentials
export const demoUsers = [
  { email: 'admin@hartfield.ac.uk', password: 'setu1234', role: 'MASTER_ADMIN' as const, userId: 'usr_001', name: 'System Admin', avatarInitials: 'SA' },
  { email: 'j.okafor@hartfield.ac.uk', password: 'setu1234', role: 'IT_ADMINISTRATOR' as const, userId: 'usr_002', name: 'James Okafor', avatarInitials: 'JO' },
  { email: 'it.tech@hartfield.ac.uk', password: 'setu1234', role: 'IT_TECHNICIAN' as const, userId: 'usr_003', name: 'Daniel Park', avatarInitials: 'DP' },
  { email: 's.whitfield@hartfield.ac.uk', password: 'setu1234', role: 'HEAD_OF_SCHOOL' as const, userId: 'usr_004', name: 'Sarah Whitfield', avatarInitials: 'SW' },
  { email: 'p.singh@hartfield.ac.uk', password: 'setu1234', role: 'FINANCE_MANAGER' as const, userId: 'usr_005', name: 'Priya Singh', avatarInitials: 'PS' },
  { email: 'c.lawson@hartfield.ac.uk', password: 'setu1234', role: 'HR_MANAGER' as const, userId: 'usr_006', name: 'Carol Lawson', avatarInitials: 'CL' },
  { email: 'e.garcia@hartfield.ac.uk', password: 'setu1234', role: 'ADMISSIONS_OFFICER' as const, userId: 'usr_007', name: 'Elena Garcia', avatarInitials: 'EG' },
  { email: 'data.mgr@hartfield.ac.uk', password: 'setu1234', role: 'DATA_MANAGER' as const, userId: 'usr_008', name: 'Tom Bradley', avatarInitials: 'TB' },
  { email: 'k.kowalski@hartfield.ac.uk', password: 'setu1234', role: 'FACILITIES_MANAGER' as const, userId: 'usr_009', name: 'Krzysztof Kowalski', avatarInitials: 'KK' },
  { email: 'r.ahmed@hartfield.ac.uk', password: 'setu1234', role: 'SLT_MEMBER' as const, userId: 'usr_010', name: 'Rahul Ahmed', avatarInitials: 'RA' },
  { email: 'l.fletcher@hartfield.ac.uk', password: 'setu1234', role: 'HEAD_OF_DEPARTMENT' as const, userId: 'usr_031', name: 'Laura Fletcher', avatarInitials: 'LF' },
  { email: 'a.patel@hartfield.ac.uk', password: 'setu1234', role: 'HEAD_OF_YEAR' as const, userId: 'usr_022', name: 'Anita Patel', avatarInitials: 'AP' },
  { email: 'm.hassan.exams@hartfield.ac.uk', password: 'setu1234', role: 'EXAMINATIONS_OFFICER' as const, userId: 'usr_011', name: 'Mohammed Hassan', avatarInitials: 'MH' },
  { email: 'g.davies@hartfield.ac.uk', password: 'setu1234', role: 'SAFEGUARDING_LEAD' as const, userId: 'usr_012', name: 'Gareth Davies', avatarInitials: 'GD' },
  { email: 'l.chen@hartfield.ac.uk', password: 'setu1234', role: 'SENCO' as const, userId: 'usr_013', name: 'Linda Chen', avatarInitials: 'LC' },
  { email: 's.roberts@hartfield.ac.uk', password: 'setu1234', role: 'ATTENDANCE_WELFARE_OFFICER' as const, userId: 'usr_014', name: 'Sophie Roberts', avatarInitials: 'SR' },
  { email: 'r.bloom@hartfield.ac.uk', password: 'setu1234', role: 'CAREERS_ADVISOR' as const, userId: 'usr_015', name: 'Rachel Bloom', avatarInitials: 'RB' },
  { email: 't.james@hartfield.ac.uk', password: 'setu1234', role: 'TEACHER' as const, userId: 'usr_041', name: 'Thomas James', avatarInitials: 'TJ' },
  { email: 'cover1@hartfield.ac.uk', password: 'setu1234', role: 'COVER_SUPERVISOR' as const, userId: 'usr_056', name: 'Andy Walsh', avatarInitials: 'AW' },
  { email: 'ta1@hartfield.ac.uk', password: 'setu1234', role: 'TEACHING_ASSISTANT' as const, userId: 'usr_058', name: 'Michelle Evans', avatarInitials: 'ME' },
  { email: 'n.okonkwo@hartfield.ac.uk', password: 'setu1234', role: 'LIBRARIAN' as const, userId: 'usr_016', name: 'Ngozi Okonkwo', avatarInitials: 'NO' },
  { email: 'sci.tech@hartfield.ac.uk', password: 'setu1234', role: 'SCIENCE_TECHNICIAN' as const, userId: 'usr_017', name: 'Kevin Barnes', avatarInitials: 'KB' },
  { email: 'sub.tech@hartfield.ac.uk', password: 'setu1234', role: 'SUBJECT_TECHNICIAN' as const, userId: 'usr_018', name: 'Mia Coleman', avatarInitials: 'MC' },
  { email: 'reception@hartfield.ac.uk', password: 'setu1234', role: 'SUPPORT_STAFF' as const, userId: 'usr_062', name: 'Janet Hill', avatarInitials: 'JH' },
]
