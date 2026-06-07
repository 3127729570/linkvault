// Custom hook to get current user from session

import { useSession } from "next-auth/react";
import type { SafeUser } from "@/types";

export function useCurrentUser() {
  const { data: session, status } = useSession();
  const user = session?.user as SafeUser | undefined;

  return {
    user,
    loading: status === "loading",
    isAuthenticated: status === "authenticated",
    isAdmin: user?.role === "ADMIN",
  };
}

export function useIsAdmin() {
  const { user } = useCurrentUser();
  return user?.role === "ADMIN";
}