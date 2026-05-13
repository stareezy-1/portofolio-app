import React, { createContext, useContext, useEffect, useMemo } from "react";
import { EThemeMode } from "@/lib/constants/enums";
import { LIGHT_THEME, DARK_THEME } from "@/lib/constants/theme.const";
import { useThemeStore } from "../stores/theme-store";

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
}

interface IThemeContext {
  mode: EThemeMode;
  colors: ThemeColors;
  toggle: () => void;
}

const ThemeContext = createContext<IThemeContext>({
  mode: EThemeMode.LIGHT,
  colors: LIGHT_THEME,
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, toggle, hydrate } = useThemeStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const colors = useMemo(
    () => (mode === EThemeMode.DARK ? DARK_THEME : LIGHT_THEME),
    [mode],
  );

  const value = useMemo(
    () => ({ mode, colors, toggle }),
    [mode, colors, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): IThemeContext {
  return useContext(ThemeContext);
}
