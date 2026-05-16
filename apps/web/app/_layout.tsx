import { Slot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as AppThemeProvider } from "../src/providers/theme-provider";
import { ThemeProvider as StareezyThemeProvider } from "@stareezy-ui/tokens";
import { ErrorBoundary } from "../src/error/error-boundary";
import { STALE_TIME_PROJECTS } from "@/lib/constants/api.const";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_PROJECTS,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {
          // SW registration failed — app still works without it
        });
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <StareezyThemeProvider theme="dark">
          <AppThemeProvider>
            <Slot />
          </AppThemeProvider>
        </StareezyThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
