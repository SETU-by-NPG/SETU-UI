import { useAuthStore } from "@/stores/authStore";
import type { Role } from "@/types";

interface RoleGuardProps {
  roles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({
  roles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { role } = useAuthStore();
  if (!role || !roles.includes(role)) return <>{fallback}</>;
  return <>{children}</>;
}

export function useHasRole(roles: Role[]): boolean {
  const { role } = useAuthStore();
  return !!role && roles.includes(role);
}
