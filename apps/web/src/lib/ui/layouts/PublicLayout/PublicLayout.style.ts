import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#060B18" },
  containerLight: { backgroundColor: "#F0F4FF" },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    backgroundColor: "rgba(6,11,24,0.92)",
  },
  headerLight: {
    backgroundColor: "rgba(240,244,255,0.95)",
    borderBottomColor: "rgba(99,102,241,0.1)",
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoDot: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#6366F1",
  },
  logo: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F1F5F9",
    letterSpacing: -0.5,
  },
  logoDark: { color: "#1E1B4B" },
  nav: { flexDirection: "row", alignItems: "center", gap: 2 },
  main: { flex: 1 },
  mainContent: { flexGrow: 1 },

  // ── Footer shell ─────────────────────────────────────────────────────────
  footer: {
    paddingTop: 56,
    paddingHorizontal: 40,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(4,8,18,0.98)",
  },
  footerLight: {
    backgroundColor: "#E8EEFF",
    borderTopColor: "rgba(99,102,241,0.12)",
  },

  // ── Footer columns row ───────────────────────────────────────────────────
  footerInner: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 40,
    paddingBottom: 40,
  },

  // Brand column
  footerBrand: { flex: 1, minWidth: 220, maxWidth: 340, gap: 14 },
  footerLogoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  footerLogoDot: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: "#6366F1",
  },
  footerLogoText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#F1F5F9",
    letterSpacing: -0.4,
  },
  footerLogoTextLight: { color: "#1E1B4B" },
  footerBrandDesc: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 20,
  },
  footerBrandDescLight: { color: "#475569" },
  footerSocials: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  socialChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.3)",
    backgroundColor: "rgba(99,102,241,0.08)",
  },
  socialChipLight: {
    borderColor: "rgba(99,102,241,0.25)",
    backgroundColor: "rgba(99,102,241,0.06)",
  },
  socialChipText: { fontSize: 12, color: "#818CF8", fontWeight: "500" },

  // Generic link column
  footerCol: { gap: 12, minWidth: 120 },
  footerColHeading: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6366F1",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  footerColHeadingLight: { color: "#4F46E5" },
  footerColLink: { fontSize: 13, color: "#94A3B8", fontWeight: "500" },
  footerColLinkLight: { color: "#475569" },

  // ── Bottom bar ───────────────────────────────────────────────────────────
  footerBottom: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  footerBottomLight: { borderTopColor: "rgba(99,102,241,0.1)" },
  footerCopy: { fontSize: 12, color: "#475569" },
  footerCopyLight: { color: "#6366F1" },
  footerBuiltWith: { fontSize: 11, color: "#334155", letterSpacing: 0.3 },

  // ── Legacy (kept for safety) ─────────────────────────────────────────────
  footerLeft: {},
  footerText: { fontSize: 13, color: "#475569" },
  footerTextLight: { color: "#6366F1" },
  footerTagline: {
    fontSize: 11,
    color: "#334155",
    marginTop: 3,
    letterSpacing: 0.3,
  },
  footerRight: { flexDirection: "row", gap: 28 },
  footerLink: { fontSize: 13, color: "#6366F1", fontWeight: "500" },
});
