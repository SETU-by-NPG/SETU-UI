import type { Organisation } from '@/types'

export const organisations: Organisation[] = [
  {
    id: 'org_001',
    name: 'Hartfield Academy',
    type: 'Secondary Academy',
    location: 'London, England',
    subdomain: 'hartfield',
    logoInitials: 'HA',
    email: 'info@hartfield.ac.uk',
    phone: '020 7123 4567',
    website: 'www.hartfield.ac.uk',
    address: {
      line1: '1 Academy Road',
      city: 'London',
      postcode: 'SE1 7PB',
      country: 'England',
    },
    createdAt: '2020-09-01T00:00:00Z',
    updatedAt: '2025-09-01T00:00:00Z',
  },
]

export const academicYears = [
  {
    id: 'ay_2024',
    organisationId: 'org_001',
    name: '2024–2025',
    startDate: '2024-09-02',
    endDate: '2025-07-18',
    isCurrent: false,
    createdAt: '2024-09-01T00:00:00Z',
  },
  {
    id: 'ay_2025',
    organisationId: 'org_001',
    name: '2025–2026',
    startDate: '2025-09-01',
    endDate: '2026-07-17',
    isCurrent: true,
    createdAt: '2025-09-01T00:00:00Z',
  },
]

export const terms = [
  {
    id: 'term_aut25',
    academicYearId: 'ay_2025',
    organisationId: 'org_001',
    name: 'Autumn 2025',
    startDate: '2025-09-01',
    endDate: '2025-12-19',
    isCurrent: false,
  },
  {
    id: 'term_spr26',
    academicYearId: 'ay_2025',
    organisationId: 'org_001',
    name: 'Spring 2026',
    startDate: '2026-01-05',
    endDate: '2026-04-09',
    isCurrent: true,
  },
  {
    id: 'term_sum26',
    academicYearId: 'ay_2025',
    organisationId: 'org_001',
    name: 'Summer 2026',
    startDate: '2026-04-20',
    endDate: '2026-07-17',
    isCurrent: false,
  },
]

export const periods = [
  { id: 'per_1', organisationId: 'org_001', name: 'Period 1', type: 'LESSON' as const, startTime: '08:45', endTime: '09:45', order: 1 },
  { id: 'per_2', organisationId: 'org_001', name: 'Period 2', type: 'LESSON' as const, startTime: '09:45', endTime: '10:45', order: 2 },
  { id: 'per_break', organisationId: 'org_001', name: 'Break', type: 'BREAK' as const, startTime: '10:45', endTime: '11:05', order: 3 },
  { id: 'per_3', organisationId: 'org_001', name: 'Period 3', type: 'LESSON' as const, startTime: '11:05', endTime: '12:05', order: 4 },
  { id: 'per_4', organisationId: 'org_001', name: 'Period 4', type: 'LESSON' as const, startTime: '12:05', endTime: '13:05', order: 5 },
  { id: 'per_lunch', organisationId: 'org_001', name: 'Lunch', type: 'LUNCH' as const, startTime: '13:05', endTime: '13:50', order: 6 },
  { id: 'per_5', organisationId: 'org_001', name: 'Period 5', type: 'LESSON' as const, startTime: '13:50', endTime: '14:50', order: 7 },
  { id: 'per_6', organisationId: 'org_001', name: 'Period 6', type: 'LESSON' as const, startTime: '14:50', endTime: '15:45', order: 8 },
]
