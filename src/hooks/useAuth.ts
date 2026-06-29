import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/api/endpoints/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginDto, RegisterDto } from "@/types/api.types";

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),

    onSuccess: (user) => {
      setUser(user);
    },
  });
}

export function useRegister() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),

    onSuccess: (user) => {
      setUser(user);
    },
  });
}

export function useLogout() {
  const clear = useAuthStore((state) => state.clear);

  return useMutation({
    mutationFn: authApi.logout,

    onSuccess: () => {
      clear();
    },
  });
}
