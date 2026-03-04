import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/types";
import { demoUsers } from "@/data/seed/users";
import { mockDelay } from "@/lib/utils";

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  role: Role | null;
  name: string | null;
  email: string | null;
  avatarInitials: string | null;
  schoolId: string;
  onboardingComplete: boolean;
  mfaEnabled: boolean;
  mfaVerified: boolean;
  token: string | null;
  linkedStudentIds: string[];
  assignedYearGroupId: string | null;
  assignedDepartmentId: string | null;
  assignedClassIds: string[];
  failedLoginAttempts: number;
  isLocked: boolean;
  pendingMfaUserId: string | null;
  // Actions
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; requiresMfa?: boolean; error?: string }>;
  logout: () => void;
  switchRole: (userId: string) => void;
  verifyMfa: (code: string) => boolean;
  incrementFailedAttempt: () => void;
  resetFailedAttempts: () => void;
  setOnboardingComplete: () => void;
  updateProfile: (
    data: Partial<Pick<AuthState, "name" | "avatarInitials">>,
  ) => void;
}

const ROLE_META: Record<
  string,
  {
    linkedStudentIds: string[];
    assignedYearGroupId: string | null;
    assignedDepartmentId: string | null;
    assignedClassIds: string[];
  }
> = {
  usr_022: {
    linkedStudentIds: [],
    assignedYearGroupId: "yg_7",
    assignedDepartmentId: "dept_english",
    assignedClassIds: ["cls_7a", "cls_8b"],
  },
  usr_023: {
    linkedStudentIds: [],
    assignedYearGroupId: "yg_8",
    assignedDepartmentId: "dept_maths",
    assignedClassIds: ["cls_8a", "cls_7c"],
  },
  usr_031: {
    linkedStudentIds: [],
    assignedYearGroupId: null,
    assignedDepartmentId: "dept_english",
    assignedClassIds: ["cls_7a", "cls_8a"],
  },
  usr_032: {
    linkedStudentIds: [],
    assignedYearGroupId: null,
    assignedDepartmentId: "dept_maths",
    assignedClassIds: ["cls_7b", "cls_8b"],
  },
  usr_033: {
    linkedStudentIds: [],
    assignedYearGroupId: null,
    assignedDepartmentId: "dept_science",
    assignedClassIds: ["cls_7c", "cls_8c"],
  },
  usr_034: {
    linkedStudentIds: [],
    assignedYearGroupId: null,
    assignedDepartmentId: "dept_humanities",
    assignedClassIds: ["cls_7d", "cls_8d"],
  },
  usr_041: {
    linkedStudentIds: [],
    assignedYearGroupId: null,
    assignedDepartmentId: null,
    assignedClassIds: ["cls_7a", "cls_8a", "cls_9a"],
  },
  usr_042: {
    linkedStudentIds: [],
    assignedYearGroupId: null,
    assignedDepartmentId: null,
    assignedClassIds: ["cls_7b", "cls_7c"],
  },
  usr_043: {
    linkedStudentIds: [],
    assignedYearGroupId: null,
    assignedDepartmentId: null,
    assignedClassIds: ["cls_7c", "cls_8c", "cls_9a"],
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userId: null,
      role: null,
      name: null,
      email: null,
      avatarInitials: null,
      schoolId: "org_001",
      onboardingComplete: true,
      mfaEnabled: false,
      mfaVerified: false,
      token: null,
      linkedStudentIds: [],
      assignedYearGroupId: null,
      assignedDepartmentId: null,
      assignedClassIds: [],
      failedLoginAttempts: 0,
      isLocked: false,
      pendingMfaUserId: null,

      login: async (email, password) => {
        await mockDelay();
        const state = get();
        if (state.isLocked) {
          return { success: false, error: "Account locked for 15 minutes" };
        }

        const user = demoUsers.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password,
        );

        if (!user) {
          get().incrementFailedAttempt();
          return { success: false, error: "Invalid email or password" };
        }

        get().resetFailedAttempts();

        // Check if MFA required
        const mfaUsers = ["usr_001", "usr_002", "usr_012"];
        if (mfaUsers.includes(user.userId)) {
          set({ pendingMfaUserId: user.userId, mfaEnabled: true });
          return { success: true, requiresMfa: true };
        }

        const meta = ROLE_META[user.userId] || {
          linkedStudentIds: [],
          assignedYearGroupId: null,
          assignedDepartmentId: null,
          assignedClassIds: [],
        };

        set({
          isAuthenticated: true,
          userId: user.userId,
          role: user.role,
          name: user.name,
          email: user.email,
          avatarInitials: user.avatarInitials,
          token: "mock-jwt-token",
          mfaEnabled: mfaUsers.includes(user.userId),
          mfaVerified: false,
          pendingMfaUserId: null,
          ...meta,
        });

        return { success: true };
      },

      logout: () => {
        set({
          isAuthenticated: false,
          userId: null,
          role: null,
          name: null,
          email: null,
          avatarInitials: null,
          token: null,
          mfaVerified: false,
          pendingMfaUserId: null,
          linkedStudentIds: [],
          assignedYearGroupId: null,
          assignedDepartmentId: null,
          assignedClassIds: [],
        });
      },

      switchRole: (userId) => {
        const user = demoUsers.find((u) => u.userId === userId);
        if (!user) return;

        const meta = ROLE_META[userId] || {
          linkedStudentIds: [],
          assignedYearGroupId: null,
          assignedDepartmentId: null,
          assignedClassIds: [],
        };

        set({
          isAuthenticated: true,
          userId: user.userId,
          role: user.role,
          name: user.name,
          email: user.email,
          avatarInitials: user.avatarInitials,
          token: "mock-jwt-token",
          mfaVerified: false,
          pendingMfaUserId: null,
          ...meta,
        });
      },

      verifyMfa: (code) => {
        // Any 6-digit code starting with "1" passes
        if (/^1\d{5}$/.test(code) || code === "123456") {
          const { pendingMfaUserId } = get();
          if (!pendingMfaUserId) return false;

          const user = demoUsers.find((u) => u.userId === pendingMfaUserId);
          if (!user) return false;

          const meta = ROLE_META[pendingMfaUserId] || {
            linkedStudentIds: [],
            assignedYearGroupId: null,
            assignedDepartmentId: null,
            assignedClassIds: [],
          };

          set({
            isAuthenticated: true,
            userId: user.userId,
            role: user.role,
            name: user.name,
            email: user.email,
            avatarInitials: user.avatarInitials,
            token: "mock-jwt-token",
            mfaVerified: true,
            pendingMfaUserId: null,
            ...meta,
          });
          return true;
        }
        return false;
      },

      incrementFailedAttempt: () => {
        set((state) => ({
          failedLoginAttempts: state.failedLoginAttempts + 1,
          isLocked: state.failedLoginAttempts + 1 >= 5,
        }));
        // Auto-unlock after 15 minutes
        if (get().isLocked) {
          setTimeout(
            () => {
              set({ isLocked: false, failedLoginAttempts: 0 });
            },
            15 * 60 * 1000,
          );
        }
      },

      resetFailedAttempts: () => {
        set({ failedLoginAttempts: 0, isLocked: false });
      },

      setOnboardingComplete: () => {
        set({ onboardingComplete: true });
      },

      updateProfile: (data) => {
        set(data);
      },
    }),
    {
      name: "setu-auth",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        role: state.role,
        name: state.name,
        email: state.email,
        avatarInitials: state.avatarInitials,
        token: state.token,
        onboardingComplete: state.onboardingComplete,
        linkedStudentIds: state.linkedStudentIds,
        assignedYearGroupId: state.assignedYearGroupId,
        assignedDepartmentId: state.assignedDepartmentId,
        assignedClassIds: state.assignedClassIds,
        mfaEnabled: state.mfaEnabled,
      }),
    },
  ),
);
