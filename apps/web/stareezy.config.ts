// stareezy.config.ts
import { createUi, token, themes } from "@stareezy-ui/tokens";

export const ui = createUi({
  // Register all four built-in themes
  themes: {
    aurora: themes.aurora,
    dark: themes.dark,
    light: themes.light,
    "steins-gate": themes["steins-gate"],
  },

  // Your custom token groups — fully typed on ui.tokens
  tokens: {
    brand: {
      primary: token("#FF6B35", "brand-primary"),
      secondary: token("#004E89", "brand-secondary"),
    },
  },

  // Responsive breakpoints (mobile-first, min-width in px)
  media: {
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },

  // Prop shorthands — these become valid BoxProps automatically
  shorthands: {
    bg: "backgroundColor",
    p: "padding",
    px: "paddingHorizontal",
    py: "paddingVertical",
    m: "margin",
    mx: "marginHorizontal",
    my: "marginVertical",
    br: "borderRadius",
    f: "flex",
    w: "width",
    h: "height",
    tasya: "color",
  } as const,
});

// ── Module augmentation ──────────────────────────────────────────────────
// This makes your shorthands flow into BoxProps as typed props.
// Without this, TypeScript won't know about your custom shorthands.
type AppConfig = typeof ui;
declare module "@stareezy-ui/tokens" {
  interface SzrCustomConfig extends AppConfig {}
}

export default ui;
