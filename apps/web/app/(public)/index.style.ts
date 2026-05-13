import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    // Background comes from PublicLayout — transparent here
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 80,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  sectionAlt: {
    maxWidth: "100%" as unknown as number,
    paddingHorizontal: 24,
    paddingVertical: 80,
  },
  sectionInner: {
    maxWidth: 1200,
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
  sectionHeading: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  aboutGrid: {
    flexDirection: "row",
    gap: 48,
    flexWrap: "wrap",
  },
  aboutText: {
    flex: 1,
    minWidth: 280,
  },
  aboutParagraph: {
    fontSize: 16,
    lineHeight: 28,
    marginBottom: 16,
  },
  aboutHighlight: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  aboutStats: {
    gap: 16,
    minWidth: 200,
  },
  statCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statIcon: {
    fontSize: 24,
  },
  statInfo: {},
  statValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  statDesc: {
    fontSize: 12,
    marginTop: 1,
  },
  featuredHeading: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  featuredSubheading: {
    fontSize: 16,
    marginBottom: 40,
    lineHeight: 24,
  },
  viewAllRow: {
    alignItems: "center",
    marginTop: 40,
  },
  viewAllButton: {
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.3)",
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
    backgroundColor: "rgba(59,130,246,0.05)",
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3B82F6",
  },
  resumeSection: {
    paddingHorizontal: 24,
    paddingVertical: 80,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  resumeHeading: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  resumeSubheading: {
    fontSize: 16,
    marginBottom: 40,
    lineHeight: 24,
  },
  socialSection: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    borderTopWidth: 1,
  },
  socialHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  socialLinks: {
    flexDirection: "row",
    gap: 12,
  },
});
