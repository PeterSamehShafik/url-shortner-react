import { create } from "zustand";

import type { User } from "@/types/api.types";

interface AuthState {
  user: User | null;
  isInitializing: boolean;

  setUser: (user: User) => void;
  clear: () => void;
  finishInitialization: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitializing: true,

  setUser: (user) =>
    set({
      user,
      isInitializing: false,
    }),

  clear: () =>
    set({
      user: null,
      isInitializing: false,
    }),

  finishInitialization: () =>
    set({
      isInitializing: false,
    }),
}));
