// Backward-compat shim — delegates to AuroraAppProvider
export {
  AuroraAppProvider as ThemeProvider,
  useAurora as useTheme,
} from "./aurora-provider";
