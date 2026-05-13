/**
 * Feature: portfolio-platform, Property 20: Axios JWT injection
 *
 * Validates: Requirements 13.4
 *
 * Property: For any API request made via the centralized Axios instance while
 * an auth token is stored, the request headers SHALL include an Authorization
 * header with the value "Bearer {token}".
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fc from "fast-check";

// Mock localStorage before importing modules that use it
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "window", {
  value: { localStorage: localStorageMock },
  writable: true,
});

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("Property 20: Axios JWT injection", () => {
  const TOKEN_KEY = "portfolio_auth_token";

  beforeEach(() => {
    localStorageMock.clear();
    vi.resetModules();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it("should add Bearer {token} to Authorization header for any non-empty token", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        async (token) => {
          // Reset modules to get fresh imports each iteration
          vi.resetModules();

          // Store the token in localStorage
          localStorageMock.setItem(TOKEN_KEY, token);

          // Import fresh instances
          const { apiClient } = await import("@/lib/utils/api-client");

          // Run the request interceptor by getting the resolved config
          // Axios interceptors modify the config before sending
          const config = {
            headers: apiClient.defaults.headers as any,
            url: "/test",
            method: "get" as const,
          };

          // Manually run the request interceptor chain
          const interceptors = (apiClient.interceptors.request as any).handlers;
          let resolvedConfig: any = {
            ...config,
            headers: {
              ...apiClient.defaults.headers.common,
              ...apiClient.defaults.headers.get,
            },
          };

          for (const interceptor of interceptors) {
            if (interceptor && interceptor.fulfilled) {
              resolvedConfig = await interceptor.fulfilled(resolvedConfig);
            }
          }

          expect(resolvedConfig.headers.Authorization).toBe(`Bearer ${token}`);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("should NOT add Authorization header when no token is stored", async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        vi.resetModules();

        // Ensure no token is stored
        localStorageMock.clear();

        const { apiClient } = await import("@/lib/utils/api-client");

        const config = {
          headers: apiClient.defaults.headers as any,
          url: "/test",
          method: "get" as const,
        };

        const interceptors = (apiClient.interceptors.request as any).handlers;
        let resolvedConfig: any = {
          ...config,
          headers: {
            ...apiClient.defaults.headers.common,
            ...apiClient.defaults.headers.get,
          },
        };

        for (const interceptor of interceptors) {
          if (interceptor && interceptor.fulfilled) {
            resolvedConfig = await interceptor.fulfilled(resolvedConfig);
          }
        }

        expect(resolvedConfig.headers.Authorization).toBeUndefined();
      }),
      { numRuns: 50 },
    );
  });
});
