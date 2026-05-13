import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center",
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3B82F6",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  heading: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 16,
    marginBottom: 32,
    lineHeight: 24,
  },
  downloadButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  section: {
    marginBottom: 48,
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  loadingText: {
    fontSize: 16,
  },
});
