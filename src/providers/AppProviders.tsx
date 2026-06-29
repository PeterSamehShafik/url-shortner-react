import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";

import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
