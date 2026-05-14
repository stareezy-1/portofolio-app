import { Slot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as AppThemeProvider } from "../src/providers/theme-provider";
import { ThemeProvider as StareezyThemeProvider } from "@stareezy-ui/tokens";
import { ErrorBoundary } from "../src/error/error-boundary";
import { STALE_TIME_PROJECTS } from "@/lib/constants/api.const";

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
