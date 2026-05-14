import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1 },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 88,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  sectionAlt: {
    maxWidth: "100%" as unknown as number,
    paddingHorizontal: 24,
    paddingVertical: 88,
  },
  sectionInner: {
    maxWidth: 1200,
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
  sectionHeading: {
    fontSize: 40,
    fontWeight: "900",
    marginBottom: 20,
    letterSpacing: -1,
  },
  aboutGrid: {
    flexDirection: "row",
    gap: 52,
    flexWrap: "wrap",
  },
  aboutText: {
    flex: 1,
    minWidth: 280,
  },
  aboutParagraph: {
    fontSize: 16,
    lineHeight: 30,
    marginBottom: 16,
  },
  aboutHighlight: {
    color: "#818CF8",
    fontWeight: "700",
  },
  aboutStats: {
    gap: 14,
    minWidth: 200,
  },
  statCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  statIcon: {
    fontSize: 26,
  },
  statInfo: {},
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  statDesc: {
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  featuredHeading: {
    fontSize: 40,
    fontWeight: "900",
    marginBottom: 10,
    letterSpacing: -1,
  },
  featuredSubheading: {
    fontSize: 16,
    marginBottom: 44,
    lineHeight: 26,
  },
  viewAllRow: {
    alignItems: "center",
    marginTop: 44,
  },
  viewAllButton: {
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.3)",
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 13,
    backgroundColor: "rgba(99,102,241,0.06)",
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#818CF8",
  },
  resumeSection: {
    paddingHorizontal: 24,
    paddingVertical: 88,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  resumeHeading: {
    fontSize: 40,
    fontWeight: "900",
    marginBottom: 10,
    letterSpacing: -1,
  },
  resumeSubheading: {
    fontSize: 16,
    marginBottom: 44,
    lineHeight: 26,
  },
  socialSection: {
    paddingVertical: 52,
    paddingHorizontal: 24,
    alignItems: "center",
    borderTopWidth: 1,
  },
  socialHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  socialLinks: {
    flexDirection: "row",
    gap: 12,
  },
});
