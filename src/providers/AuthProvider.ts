import { useEffect } from "react";
import type { ReactNode } from "react";

import { authApi } from "@/api/endpoints/auth.api";
import { useAuthStore } from "@/stores/auth.store";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const finishInitialization = useAuthStore(
    (state) => state.finishInitialization,
  );

  useEffect(() => {
    authApi
      .refresh()
      .then(setUser)
      .catch(() => finishInitialization());
  }, [setUser, finishInitialization]);

  return children;
}
