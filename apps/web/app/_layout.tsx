import { Slot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as StareezyThemeProvider } from "@stareezy-ui/tokens";
import { AuroraAppProvider } from "../src/providers/aurora-provider";
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
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <StareezyThemeProvider theme="dark">
          <AuroraAppProvider>
            <Slot />
          </AuroraAppProvider>
        </StareezyThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
