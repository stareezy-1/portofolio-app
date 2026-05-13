/**
 * Feature: portfolio-platform, Property 13: Theme persistence round-trip
 * Feature: portfolio-platform, Property 14: System theme detection fallback
 *
 * Validates: Requirements 7.2, 7.3
 *
 * Property 13: For any theme toggle action, the selected theme ('dark' or 'light')
 * SHALL be written to localStorage, and on subsequent page load, reading from
 * localStorage SHALL restore the same theme value.
 *
 * Property 14: For any initial page load where no theme preference exists in
 * localStorage, the applied theme SHALL match the system color scheme preference
 * (prefers-color-scheme media query result).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fc from "fast-check";
import { EThemeMode } from "@/lib/constants/enums";

const THEME_KEY = "portfolio_theme";

// Mock localStorage
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
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

// Mock matchMedia
let mockPrefersDark = false;

const matchMediaMock = (query: string) => ({
  matches: query === "(prefers-color-scheme: dark)" ? mockPrefersDark : false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

Object.defineProperty(globalThis, "window", {
  value: {
    localStorage: localStorageMock,
    matchMedia: matchMediaMock,
  },
  writable: true,
  configurable: true,
});

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

describe("Property 13: Theme persistence round-trip", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.resetModules();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it("for any theme toggle action, the selected theme SHALL be written to localStorage and restored on hydrate", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(fc.constant(EThemeMode.DARK), fc.constant(EThemeMode.LIGHT)),
        fc.nat({ max: 5 }),
        async (initialMode, toggleCount) => {
          vi.resetModules();
          localStorageMock.clear();

          const { useThemeStore } =
            await import("../../src/stores/theme-store");

          // Set initial mode
          useThemeStore.getState().setMode(initialMode);

          // Verify it was written to localStorage
          expect(localStorageMock.getItem(THEME_KEY)).toBe(initialMode);

          // Toggle N times
          let expectedMode = initialMode;
          for (let i = 0; i < toggleCount; i++) {
            useThemeStore.getState().toggle();
            expectedMode =
              expectedMode === EThemeMode.DARK
                ? EThemeMode.LIGHT
                : EThemeMode.DARK;
          }

          // Verify localStorage has the final mode
          const storedValue = localStorageMock.getItem(THEME_KEY);
          expect(storedValue).toBe(expectedMode);

          // Simulate page reload: reset modules and hydrate
          vi.resetModules();
          const { useThemeStore: freshStore } =
            await import("../../src/stores/theme-store");
          freshStore.getState().hydrate();

          // Verify hydrated mode matches what was stored
          expect(freshStore.getState().mode).toBe(expectedMode);
        },
      ),
      { numRuns: 100 },
    );
  });
});

describe("Property 14: System theme detection fallback", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.resetModules();
  });

  afterEach(() => {
    localStorageMock.clear();
    mockPrefersDark = false;
  });

  it("when no theme preference exists in localStorage, the applied theme SHALL match the system color scheme preference", async () => {
    await fc.assert(
      fc.asyncProperty(fc.boolean(), async (systemPrefersDark) => {
        vi.resetModules();
        localStorageMock.clear();

        // Set system preference
        mockPrefersDark = systemPrefersDark;

        const { useThemeStore } = await import("../../src/stores/theme-store");

        // Hydrate with no stored preference
        useThemeStore.getState().hydrate();

        const expectedMode = systemPrefersDark
          ? EThemeMode.DARK
          : EThemeMode.LIGHT;

        expect(useThemeStore.getState().mode).toBe(expectedMode);
      }),
      { numRuns: 100 },
    );
  });

  it("when a theme preference exists in localStorage, system preference SHALL be ignored", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(fc.constant(EThemeMode.DARK), fc.constant(EThemeMode.LIGHT)),
        fc.boolean(),
        async (storedMode, systemPrefersDark) => {
          vi.resetModules();
          localStorageMock.clear();

          // Set stored preference
          localStorageMock.setItem(THEME_KEY, storedMode);

          // Set system preference (should be ignored)
          mockPrefersDark = systemPrefersDark;

          const { useThemeStore } =
            await import("../../src/stores/theme-store");

          useThemeStore.getState().hydrate();

          // Should use stored value, not system preference
          expect(useThemeStore.getState().mode).toBe(storedMode);
        },
      ),
      { numRuns: 100 },
    );
  });
});
