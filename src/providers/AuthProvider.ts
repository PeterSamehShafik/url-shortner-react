import { useEffect, useRef } from "react";
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
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    authApi
      .refresh()
      .then(setUser)
      .catch(() => finishInitialization());
  }, []);

  return children;
}
