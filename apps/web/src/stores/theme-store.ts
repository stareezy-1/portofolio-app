import { create } from "zustand";
import { EThemeMode } from "@/lib/constants/enums";
import { getStoredTheme, setStoredTheme } from "@/lib/utils/storage";
import { aurora, type AuroraTokens } from "@/lib/constants/aurora";

// ---------------------------------------------------------------------------
// Aurora store — single aurora theme for public routes (Task 1.1)
// ---------------------------------------------------------------------------

export interface IAuroraStore {
  tokens: AuroraTokens;
}

export const useAuroraStore = create<IAuroraStore>(() => ({
  tokens: aurora,
}));

// ---------------------------------------------------------------------------
// Legacy theme store — kept for backward compatibility with existing tests
// and admin panel code that still uses light/dark toggle.
// ---------------------------------------------------------------------------

export interface IThemeStore {
  mode: EThemeMode;
  toggle: () => void;
  setMode: (mode: EThemeMode) => void;
  hydrate: () => void;
}

export const useThemeStore = create<IThemeStore>((set) => ({
  mode: EThemeMode.LIGHT,

  toggle: () =>
    set((state) => {
      const newMode =
        state.mode === EThemeMode.DARK ? EThemeMode.LIGHT : EThemeMode.DARK;
      setStoredTheme(newMode);
      return { mode: newMode };
    }),

  setMode: (mode: EThemeMode) => {
    setStoredTheme(mode);
    set({ mode });
  },

  hydrate: () => {
    const stored = getStoredTheme();
    if (stored === EThemeMode.DARK || stored === EThemeMode.LIGHT) {
      set({ mode: stored });
      return;
    }
    if (typeof window !== "undefined" && window.matchMedia) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const systemMode = prefersDark ? EThemeMode.DARK : EThemeMode.LIGHT;
      set({ mode: systemMode });
    }
  },
}));
