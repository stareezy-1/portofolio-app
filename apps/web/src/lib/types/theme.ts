import { EThemeMode } from "../constants/enums";

export interface IThemeConfig {
  mode: EThemeMode;
  colors: {
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
}
