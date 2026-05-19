import { StyleSheet } from "react-native";
import { aurora } from "@/lib/constants/aurora";

export default StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    maxWidth: 680,
    width: "100%" as unknown as number,
    alignSelf: "center",
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: aurora.surfaceDark.value,
    borderWidth: 1,
    borderColor: aurora.borderSubtle.value,
    borderRadius: 24,
    padding: 36,
    gap: 0,
  },

  // ── Section header inside card ────────────────────────────────────────────
  cardHeader: {
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: aurora.borderSubtle.value,
  },
  cardEyebrow: {
    fontSize: 10,
    fontWeight: "700",
    color: aurora.auroraGreen.value,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: aurora.starWhite.value,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: aurora.textMuted.value,
    lineHeight: 20,
  },

  // ── Fields ────────────────────────────────────────────────────────────────
  fieldWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: aurora.textMuted.value,
    marginBottom: 4,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: `${aurora.deepSpace.value}e0`,
    borderWidth: 1.5,
    borderColor: aurora.borderSubtle.value,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: aurora.starWhite.value,
  },
  inputError: {
    borderColor: aurora.errorRed.value,
  },
  textArea: {
    minHeight: 140,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  charCount: {
    fontSize: 11,
    color: aurora.textMuted.value,
    marginTop: 5,
    textAlign: "right",
  },
  errorText: {
    fontSize: 11,
    color: aurora.errorRed.value,
    marginTop: 5,
    marginLeft: 1,
  },

  // ── Submit area ───────────────────────────────────────────────────────────
  submitArea: {
    marginTop: 32,
    paddingTop: 28,
    borderTopWidth: 1,
    borderTopColor: aurora.borderSubtle.value,
  },
  submitButton: {
    backgroundColor: aurora.auroraGreen.value,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: aurora.auroraGreen.value,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  submitDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  submitText: {
    fontSize: 14,
    fontWeight: "700",
    color: aurora.deepSpace.value,
    letterSpacing: 0.4,
  },
  submitHint: {
    fontSize: 11,
    color: aurora.textMuted.value,
    textAlign: "center",
    marginTop: 12,
  },

  // ── Banners ───────────────────────────────────────────────────────────────
  successBanner: {
    backgroundColor: `${aurora.auroraGreen.value}12`,
    borderWidth: 1,
    borderColor: `${aurora.auroraGreen.value}35`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  successText: {
    fontSize: 14,
    color: aurora.auroraGreen.value,
    fontWeight: "600",
    flex: 1,
    lineHeight: 20,
  },
  errorBanner: {
    backgroundColor: `${aurora.errorRed.value}10`,
    borderWidth: 1,
    borderColor: `${aurora.errorRed.value}35`,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  errorBannerIcon: {
    fontSize: 15,
    color: aurora.errorRed.value,
    marginTop: 1,
  },
  errorBannerText: {
    fontSize: 13,
    color: aurora.errorRed.value,
    fontWeight: "500",
    flex: 1,
    lineHeight: 19,
  },
});
