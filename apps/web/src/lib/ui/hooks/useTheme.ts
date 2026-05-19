import { EThemeMode } from "../../constants/enums";
import { LIGHT_THEME, DARK_THEME } from "../../constants/theme.const";

// Widen to a common shape so both themes are assignable
export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
};

export function getThemeColors(mode: EThemeMode): ThemeColors {
  return mode === EThemeMode.DARK
    ? (DARK_THEME as ThemeColors)
    : (LIGHT_THEME as ThemeColors);
}

let _currentMode: EThemeMode = EThemeMode.LIGHT;

export function setCurrentThemeMode(mode: EThemeMode) {
  _currentMode = mode;
}

export function useTheme(): { mode: EThemeMode; colors: ThemeColors } {
  return {
    mode: _currentMode,
    colors: getThemeColors(_currentMode),
  };
}
