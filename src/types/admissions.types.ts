export type AdmissionStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "OFFER_MADE"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";
export type OfferStatus =
  | "PENDING_RESPONSE"
  | "ACCEPTED"
  | "REJECTED"
  | "LAPSED";

export interface AdmissionApplication {
  id: string;
  organisationId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  yearGroupApplying: string;
  entryPointDate: string;
  reasonForApplying?: string;
  previousSchool?: string;
  siblingAtSchool: boolean;
  hasSEN: boolean;
  medicalInfo?: string;
  fsmEligible: boolean;
  status: AdmissionStatus;
  internalNotes?: string;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail: string;
  applicationDate: string;
  offerDate?: string;
  offerResponseDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpenDay {
  id: string;
  organisationId: string;
  date: string;
  time: string;
  venue: string;
  maxCapacity: number;
  registeredCount: number;
  description?: string;
  createdAt: string;
}

export interface OpenDayRegistration {
  id: string;
  openDayId: string;
  familyName: string;
  childName: string;
  childAge: number;
  email: string;
  phone: string;
  howHeard: string;
  createdAt: string;
}
