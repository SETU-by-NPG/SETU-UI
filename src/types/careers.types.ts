export type DestinationType =
  | "A_LEVELS"
  | "APPRENTICESHIP"
  | "COLLEGE"
  | "EMPLOYMENT"
  | "UNDECIDED";
export type GatsbyBenchmark = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "OFFER"
  | "CONDITIONAL"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface CareerProfile {
  id: string;
  studentId: string;
  organisationId: string;
  careerInterests: string[];
  skills: string[];
  aspirations: string;
  destinationInterest: DestinationType;
  workExperience: WorkExperience[];
  actionPlanStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperience {
  id: string;
  employer: string;
  dateFrom: string;
  dateTo: string;
  description: string;
}

export interface CareerSession {
  id: string;
  studentId: string;
  organisationId: string;
  advisorId: string;
  sessionDate: string;
  duration: number;
  sessionType:
    | "INITIAL"
    | "REVIEW"
    | "UNIVERSITY_PREP"
    | "APPRENTICESHIP"
    | "UCAS"
    | "GENERAL_GUIDANCE";
  notes: string;
  actions: string;
  nextSessionDate?: string;
  createdAt: string;
}

export interface CEIAGActivity {
  id: string;
  organisationId: string;
  activityName: string;
  activityType:
    | "TALK"
    | "VISIT"
    | "WORKSHOP"
    | "EMPLOYER_ENCOUNTER"
    | "UNIVERSITY_VISIT"
    | "MOCK_INTERVIEW";
  date: string;
  yearGroupIds: string[];
  providerEmployer: string;
  studentCount: number;
  gatsbyBenchmark: GatsbyBenchmark;
  createdAt: string;
}

export interface CollegeApplication {
  id: string;
  studentId: string;
  organisationId: string;
  destinationType: DestinationType;
  institutionName: string;
  courseProgramme: string;
  appliedDate: string;
  status: ApplicationStatus;
  interviewDate?: string;
  outcome?: string;
  createdAt: string;
}
