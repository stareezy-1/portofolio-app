/**
 * Aurora design tokens — local definition for portofolio-app/apps/web.
 *
 * These mirror the aurora token group in @stareezy-ui/tokens source but are
 * defined locally because the installed package version (0.1.1) does not yet
 * export the aurora group. Once the package is updated, this file can be
 * replaced with a re-export from @stareezy-ui/tokens.
 */

export const aurora = {
  deepSpace: { value: "#050505" },
  auroraGreen: { value: "#00ff88" },
  starWhite: { value: "#ffffff" },
  nebulaPurple: { value: "#7c3aed" },
  cosmicGray: { value: "#1a1a2e" },
  surfaceDark: { value: "#0a0a1a" },
  borderSubtle: { value: "#2a2a3e" },
  textMuted: { value: "#888888" },
  textSecondary: { value: "#aaaaaa" },
  errorRed: { value: "#ff4444" },
  warningAmber: { value: "#f59e0b" },
} as const;

export type AuroraTokens = typeof aurora;
