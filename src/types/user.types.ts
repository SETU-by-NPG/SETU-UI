import type { Role } from "./auth.types";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "LOCKED" | "INVITED";

export interface User {
  id: string;
  organisationId: string;
  email: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  phone?: string;
  profilePictureUrl?: string;
  role: Role;
  additionalRoles?: Role[];
  status: UserStatus;
  emailVerified: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}
