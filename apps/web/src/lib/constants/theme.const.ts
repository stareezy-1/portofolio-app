export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const LIGHT_THEME = {
  primary: "#2563EB",
  secondary: "#7C3AED",
  background: "#FFFFFF",
  surface: "#F8FAFC",
  text: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  error: "#DC2626",
  success: "#16A34A",
} as const;

export const DARK_THEME = {
  primary: "#3B82F6",
  secondary: "#8B5CF6",
  background: "#0F172A",
  surface: "#1E293B",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  border: "#334155",
  error: "#EF4444",
  success: "#22C55E",
} as const;
