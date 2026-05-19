import { StyleSheet } from "react-native";
import { aurora } from "@/lib/constants/aurora";

export const styles = StyleSheet.create({
  container: {
    minHeight: 680,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 100,
    paddingBottom: 80,
    backgroundColor: aurora.deepSpace.value,
    position: "relative",
    overflow: "hidden",
    maxWidth: 900,
    width: "100%" as unknown as number,
    alignSelf: "center",
  },
  badge: {
    marginBottom: 28,
  },
  name: {
    fontSize: 52,
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 56,
    marginBottom: 10,
    color: aurora.starWhite.value,
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 8,
  },
  rolePrefix: {
    fontSize: 22,
    fontWeight: "400",
    color: aurora.textSecondary.value,
  },
  tagline: {
    fontSize: 17,
    color: aurora.textSecondary.value,
    lineHeight: 28,
    marginBottom: 40,
    maxWidth: 560,
  },
  statsRow: {
    flexDirection: "row",
    gap: 40,
    marginBottom: 40,
    flexWrap: "wrap",
  },
  stat: {
    alignItems: "flex-start",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "800",
    color: aurora.auroraGreen.value,
    lineHeight: 36,
  },
  statLabel: {
    fontSize: 11,
    color: aurora.textMuted.value,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 3,
  },
  ctaRow: {
    flexDirection: "row",
    gap: 14,
    flexWrap: "wrap",
  },
  primaryBtn: {
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: aurora.auroraGreen.value,
    shadowColor: aurora.auroraGreen.value,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryBtnText: {
    color: aurora.deepSpace.value,
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryBtn: {
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: aurora.borderSubtle.value,
  },
  secondaryBtnText: {
    color: aurora.starWhite.value,
    fontWeight: "600",
    fontSize: 15,
  },
  glowBlob: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.06,
  },
});
