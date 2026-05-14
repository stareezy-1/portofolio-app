import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 56,
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: "#818CF8",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  heading: {
    fontSize: 48,
    fontWeight: "900",
    marginBottom: 10,
    letterSpacing: -1.5,
  },
  subheading: {
    fontSize: 16,
    marginBottom: 36,
    lineHeight: 26,
  },
  downloadButton: {
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  section: { marginBottom: 52 },
  sectionHeading: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 22,
    letterSpacing: -0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  loadingText: { fontSize: 16 },
});
