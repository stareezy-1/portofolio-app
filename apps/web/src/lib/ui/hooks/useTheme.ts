import { EThemeMode } from "../../constants/enums";
import { LIGHT_THEME, DARK_THEME } from "../../constants/theme.const";

export type ThemeColors = typeof LIGHT_THEME;

export function getThemeColors(mode: EThemeMode): ThemeColors {
  return mode === EThemeMode.DARK ? DARK_THEME : LIGHT_THEME;
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
